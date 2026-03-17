/**
 * Subscription handler — creates Stripe Checkout session.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags stripe, subscription, checkout
 */

import { json, error } from '../lib/responses.js';
import { createCheckoutSession } from '../stripe/client.js';
import * as publishersDb from '../db/publishers.js';
import * as audit from '../db/audit.js';

/**
 * Handle POST /api/v1/subscribe
 * Creates a Stripe Checkout session for a new or renewing subscription.
 *
 * Body: { namespace, email, success_url?, cancel_url? }
 */
export async function handleSubscribe(request, env) {
    let body;
    try {
        body = await request.json();
    } catch {
        return error('Invalid JSON body', 400);
    }

    if (!body.namespace || typeof body.namespace !== 'string') {
        return error('namespace is required', 400);
    }

    if (!body.email || typeof body.email !== 'string') {
        return error('email is required', 400);
    }

    const baseUrl = new URL(request.url).origin;
    const successUrl = body.success_url || `${baseUrl}/api/v1/subscribe/success?namespace=${body.namespace}`;
    const cancelUrl = body.cancel_url || `${baseUrl}/api/v1/subscribe/cancelled`;

    try {
        const session = await createCheckoutSession(env.STRIPE_SECRET_KEY, {
            priceId: env.STRIPE_PRICE_ID,
            namespace: body.namespace,
            email: body.email,
            successUrl,
            cancelUrl,
        });

        await audit.log(env.DB, null, 'checkout_session_created', {
            namespace: body.namespace,
            email: body.email,
            session_id: session.id,
        });

        return json({
            checkout_url: session.url,
            session_id: session.id,
            message: 'Redirect to checkout_url to complete subscription.',
        });
    } catch (e) {
        return error(`Stripe error: ${e.message}`, 502);
    }
}
