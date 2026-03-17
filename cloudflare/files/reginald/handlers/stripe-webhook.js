/**
 * Stripe webhook handler.
 * Processes payment events and manages subscription lifecycle.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags stripe, webhook, payments
 */

import { json, error } from '../lib/responses.js';
import { verifyStripeSignature } from '../middleware/stripe-verify.js';
import { generateToken } from '../lib/token.js';
import * as publishersDb from '../db/publishers.js';
import * as tokensDb from '../db/tokens.js';
import * as subscriptionsDb from '../db/subscriptions.js';
import * as audit from '../db/audit.js';

const GRACE_PERIOD_DAYS = 14;

/**
 * Handle POST /api/v1/stripe/webhook
 */
export async function handleStripeWebhook(request, env) {
    const payload = await request.text();
    const sigHeader = request.headers.get('Stripe-Signature');

    const valid = await verifyStripeSignature(payload, sigHeader, env.STRIPE_WEBHOOK_SECRET);
    if (!valid) {
        return error('Invalid webhook signature', 401);
    }

    let event;
    try {
        event = JSON.parse(payload);
    } catch {
        return error('Invalid JSON', 400);
    }

    const handler = EVENT_HANDLERS[event.type];
    if (handler) {
        try {
            await handler(event, env);
        } catch (e) {
            console.error(`Webhook handler error for ${event.type}:`, e);
            return error(`Webhook processing failed: ${e.message}`, 500);
        }
    }

    return json({ received: true });
}

const EVENT_HANDLERS = {
    'checkout.session.completed': handleCheckoutComplete,
    'invoice.paid': handleInvoicePaid,
    'invoice.payment_failed': handleInvoiceFailed,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
};

/**
 * Checkout completed — create publisher, subscription, and token.
 */
async function handleCheckoutComplete(event, env) {
    const session = event.data.object;
    const namespace = session.metadata?.namespace;
    const email = session.customer_details?.email || session.customer_email;

    if (!namespace) {
        console.error('checkout.session.completed missing namespace metadata');
        return;
    }

    // Create or find publisher.
    let publisher = await publishersDb.findByNamespace(env.DB, namespace);
    if (!publisher) {
        publisher = await publishersDb.create(env.DB, {
            namespace,
            name: namespace,
            domain: '',
            email,
            status: 'active',
        });
    } else {
        await publishersDb.updateStatus(env.DB, publisher.id, 'active');
    }

    // Create subscription record.
    await subscriptionsDb.create(env.DB, {
        publisher_id: publisher.id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        status: 'active',
    });

    // Generate API token.
    const { raw, hash, prefix } = await generateToken();
    await tokensDb.create(env.DB, {
        token_hash: hash,
        publisher_id: publisher.id,
        prefix,
    });

    await audit.log(env.DB, publisher.id, 'subscription_activated', {
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        token_prefix: prefix,
    });

    // Store token in Stripe customer metadata for retrieval on success page.
    // The raw token is only available at this moment.
    try {
        const encoder = new TextEncoder();
        await fetch(`https://api.stripe.com/v1/customers/${session.customer}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `metadata[api_token]=${encodeURIComponent(raw)}&metadata[namespace]=${encodeURIComponent(namespace)}`,
        });
    } catch (e) {
        console.error('Failed to store token in Stripe metadata:', e);
    }
}

/**
 * Invoice paid — renew subscription period.
 */
async function handleInvoicePaid(event, env) {
    const invoice = event.data.object;
    if (!invoice.subscription) return;

    const sub = await subscriptionsDb.findByStripeSubscription(env.DB, invoice.subscription);
    if (!sub) return;

    await subscriptionsDb.updateByStripeId(env.DB, invoice.subscription, {
        status: 'active',
        current_period_start: toISO(invoice.period_start),
        current_period_end: toISO(invoice.period_end),
        grace_period_end: null,
    });

    // Re-activate publisher if previously suspended.
    await publishersDb.updateStatus(env.DB, sub.publisher_id, 'active');

    await audit.log(env.DB, sub.publisher_id, 'invoice_paid', {
        invoice_id: invoice.id,
        amount: invoice.amount_paid,
    });
}

/**
 * Invoice payment failed — set grace period.
 */
async function handleInvoiceFailed(event, env) {
    const invoice = event.data.object;
    if (!invoice.subscription) return;

    const sub = await subscriptionsDb.findByStripeSubscription(env.DB, invoice.subscription);
    if (!sub) return;

    const graceEnd = new Date();
    graceEnd.setDate(graceEnd.getDate() + GRACE_PERIOD_DAYS);

    await subscriptionsDb.updateByStripeId(env.DB, invoice.subscription, {
        status: 'past_due',
        grace_period_end: graceEnd.toISOString(),
    });

    await audit.log(env.DB, sub.publisher_id, 'invoice_payment_failed', {
        invoice_id: invoice.id,
        grace_period_end: graceEnd.toISOString(),
    });
}

/**
 * Subscription updated by Stripe (e.g., plan change, renewal).
 */
async function handleSubscriptionUpdated(event, env) {
    const subscription = event.data.object;

    await subscriptionsDb.updateByStripeId(env.DB, subscription.id, {
        status: mapStripeStatus(subscription.status),
        current_period_start: toISO(subscription.current_period_start),
        current_period_end: toISO(subscription.current_period_end),
    });
}

/**
 * Subscription deleted/cancelled.
 */
async function handleSubscriptionDeleted(event, env) {
    const subscription = event.data.object;

    const sub = await subscriptionsDb.findByStripeSubscription(env.DB, subscription.id);
    if (!sub) return;

    await subscriptionsDb.updateByStripeId(env.DB, subscription.id, {
        status: 'cancelled',
    });

    await publishersDb.updateStatus(env.DB, sub.publisher_id, 'cancelled');

    await audit.log(env.DB, sub.publisher_id, 'subscription_cancelled', {
        stripe_subscription_id: subscription.id,
    });
}

/**
 * Map Stripe subscription status to our status.
 */
function mapStripeStatus(stripeStatus) {
    const map = {
        'active': 'active',
        'past_due': 'past_due',
        'canceled': 'cancelled',
        'unpaid': 'suspended',
        'incomplete': 'incomplete',
        'incomplete_expired': 'cancelled',
        'trialing': 'active',
    };
    return map[stripeStatus] || 'incomplete';
}

/**
 * Convert Unix timestamp to ISO string.
 */
function toISO(unixTimestamp) {
    if (!unixTimestamp) return null;
    return new Date(unixTimestamp * 1000).toISOString();
}
