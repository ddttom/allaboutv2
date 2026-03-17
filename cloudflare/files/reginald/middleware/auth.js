/**
 * Token authentication middleware.
 * Validates Bearer token, checks subscription status.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags auth, middleware, token
 */

import { extractToken, hashToken } from '../lib/token.js';
import * as tokensDb from '../db/tokens.js';
import * as subscriptionsDb from '../db/subscriptions.js';
import * as publishersDb from '../db/publishers.js';
import { error } from '../lib/responses.js';

/**
 * Authenticate a request using Bearer token.
 * Attaches publisher, token, and subscription to the request context.
 *
 * @param {Request} request
 * @param {object} env - Worker environment bindings
 * @returns {Promise<{publisher: object, token: object, subscription: object}|Response>}
 *   Returns context object on success, or an error Response on failure.
 */
export async function authenticate(request, env) {
    const authHeader = request.headers.get('Authorization');
    const rawToken = extractToken(authHeader);

    if (!rawToken) {
        return error('Authentication required. Provide a Bearer token.', 401);
    }

    const tokenHash = await hashToken(rawToken);
    const token = await tokensDb.findByHash(env.DB, tokenHash);

    if (!token) {
        return error('Invalid API token.', 401);
    }

    const publisher = await publishersDb.findById(env.DB, token.publisher_id);
    if (!publisher) {
        return error('Publisher not found for this token.', 401);
    }

    if (publisher.status === 'cancelled') {
        return error('Publisher account has been cancelled.', 403);
    }

    const subscription = await subscriptionsDb.findByPublisher(env.DB, publisher.id);

    if (!subscription || subscription.status === 'cancelled') {
        return error('No active subscription. Subscribe at /api/v1/subscribe.', 403);
    }

    if (subscription.status === 'suspended') {
        return error('Subscription suspended due to non-payment. Please update your payment method.', 403);
    }

    // Update last_used_at (fire and forget — don't block the request).
    env.DB.prepare("UPDATE tokens SET last_used_at = datetime('now') WHERE id = ?")
        .bind(token.id).run();

    return { publisher, token, subscription };
}
