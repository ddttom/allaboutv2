/**
 * Publisher status handler — check subscription and listing status.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags status, publisher, subscription
 */

import { json } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';

/**
 * Handle GET /api/v1/publisher/status
 * Requires Bearer token authentication.
 */
export async function handleStatus(request, env) {
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher, token, subscription } = authResult;

    return json({
        publisher: {
            namespace: publisher.namespace,
            name: publisher.name,
            domain: publisher.domain,
            status: publisher.status,
            registered_at: publisher.created_at,
        },
        subscription: {
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            grace_period_end: subscription.grace_period_end,
        },
        token: {
            prefix: token.prefix,
            status: token.status,
            last_used_at: token.last_used_at,
            created_at: token.created_at,
        },
        listing_url: `/api/v1/namespaces/${publisher.namespace}/cogs.json`,
    });
}
