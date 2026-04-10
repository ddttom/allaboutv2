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
import { generateToken, hashToken } from '../lib/token.js';
import { notifyPurchase } from '../lib/mailerlite.js';
import * as publishersDb from '../db/publishers.js';
import * as tokensDb from '../db/tokens.js';
import * as subscriptionsDb from '../db/subscriptions.js';
import * as downloadsDb from '../db/downloads.js';
import { getCheckoutSession } from '../stripe/client.js';
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
 * Checkout completed — route to publisher subscription or book purchase handler.
 */
async function handleCheckoutComplete(event, env) {
    const session = event.data.object;

    // Book purchase checkout — generate download link and notify.
    if (session.metadata?.type === 'book_purchase') {
        return handleBookPurchase(session, env);
    }

    // Publisher subscription checkout — existing flow.
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
 * Handle book purchase — generate download link, notify via MailerLite.
 * Both PDF and physical orders notify printworks (BCC tom.cranstoun@gmail.com).
 * PDF orders also generate a download link for the buyer.
 */
async function handleBookPurchase(session, env) {
    const email = session.customer_details?.email || session.customer_email;
    const name = session.customer_details?.name || '';
    const bookId = session.metadata?.book_id || 'handbook';
    const productType = session.metadata?.product_type || 'pdf';

    // Stripe moved shipping data to collected_information.shipping_details
    // in recent API versions. Check all three possible locations.
    let shipping = session.collected_information?.shipping_details?.address
        || session.shipping_details?.address
        || session.shipping?.address
        || null;

    // Webhook payload often omits collected_information. For physical orders,
    // retrieve the full session from Stripe to guarantee we have the address.
    if (!shipping && productType !== 'pdf' && env.STRIPE_SECRET_KEY) {
        try {
            const fullSession = await getCheckoutSession(env.STRIPE_SECRET_KEY, session.id);
            shipping = fullSession.collected_information?.shipping_details?.address
                || fullSession.shipping_details?.address
                || fullSession.shipping?.address
                || null;
        } catch (e) {
            console.error('Failed to retrieve full session for shipping address:', e);
        }
    }

    let downloadUrl = '';

    // Generate download link for PDF purchases.
    if (productType === 'pdf') {
        const bytes = new Uint8Array(8);
        crypto.getRandomValues(bytes);
        const downloadToken = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        const tokenHash = await hashToken(downloadToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14);

        // Store both the hash (for the download landing page lookup) and the
        // plaintext token (for the success-page polling endpoint to read by
        // session_id). Plaintext can be cleared/nulled after MailerLite
        // delivery is wired up.
        await downloadsDb.create(env.DB, {
            tokenHash,
            downloadToken,
            bookId,
            email,
            name,
            source: 'stripe',
            stripeSessionId: session.id,
            maxDownloads: 4,
            expiresAt: expiresAt.toISOString(),
        });

        downloadUrl = `https://reginald.allabout.network/api/v1/books/download/${downloadToken}`;
    }

    await audit.log(env.DB, null, 'book_purchase_completed', {
        book_id: bookId,
        product_type: productType,
        email,
        stripe_session_id: session.id,
        has_download_link: !!downloadUrl,
    });

    // Notify via MailerLite — adds subscriber to group, triggers automation.
    // Automation sends buyer email (with download link for PDF) and
    // printworks notification (BCC tom.cranstoun@gmail.com).
    if (env.MAILERLITE_API_KEY) {
        const groupId = productType === 'pdf'
            ? env.MAILERLITE_GROUP_HANDBOOK_PDF
            : env.MAILERLITE_GROUP_HANDBOOK_PHYSICAL;

        try {
            await notifyPurchase(env.MAILERLITE_API_KEY, {
                email,
                name,
                productType,
                bookTitle: 'MX: The Handbook',
                downloadUrl,
                orderId: session.id,
                shippingAddress: shipping,
                groupId,
            });
            console.log(`MailerLite: subscriber added for ${productType} purchase — ${email}`);
        } catch (e) {
            console.error('MailerLite notification failed:', e);
            // Non-fatal — purchase still succeeded, download link still works.
        }
    } else {
        console.warn('MAILERLITE_API_KEY not set — skipping email notification');
    }

    console.log(`Book purchase: ${bookId} (${productType}) for ${email} — complete`);
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
