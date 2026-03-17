/**
 * Publisher aliveness endpoint.
 * Returns latest aliveness check results and active failures.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags aliveness, publisher, dashboard
 */

import { json } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';
import * as alivenessDb from '../db/aliveness.js';

/**
 * Handle GET /api/v1/publisher/aliveness
 * Requires Bearer token authentication.
 * Returns aliveness summary, recent checks, and active failures.
 */
export async function handlePublisherAliveness(request, env) {
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher } = authResult;

    const [summary, recentChecks, failures] = await Promise.all([
        alivenessDb.getSummary(env.DB, publisher.namespace),
        alivenessDb.findChecksByNamespace(env.DB, publisher.namespace, 20),
        alivenessDb.findFailuresByNamespace(env.DB, publisher.namespace),
    ]);

    return json({
        namespace: publisher.namespace,
        summary: {
            total_checks: summary.total_checks || 0,
            passed: summary.passed || 0,
            failed: summary.failed || 0,
            hash_mismatches: summary.hash_mismatches || 0,
            avg_response_time_ms: summary.avg_response_time ? Math.round(summary.avg_response_time) : null,
            hidden_cogs: summary.hidden_cogs || 0,
        },
        recent_checks: recentChecks.map(c => ({
            cog: `${c.cog_namespace}/${c.cog_name}`,
            status: c.http_status,
            response_time_ms: c.response_time_ms,
            hash_match: c.hash_match === 1,
            error: c.error_message,
            checked_at: c.checked_at,
        })),
        active_failures: failures.filter(f => f.consecutive_failures > 0).map(f => ({
            cog: `${f.cog_namespace}/${f.cog_name}`,
            consecutive_failures: f.consecutive_failures,
            hidden: f.hidden_from_resolution === 1,
            last_failure: f.last_failure_at,
            last_error: f.last_error,
        })),
    });
}
