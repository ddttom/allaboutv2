/**
 * Publisher analytics endpoint.
 * Queries Cloudflare Analytics Engine for resolution data.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags analytics, publisher, dashboard
 */

import { json, error } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';

/**
 * Handle GET /api/v1/publisher/analytics?days=30
 * Requires Bearer token authentication.
 * Returns resolution analytics for the authenticated publisher's namespace.
 */
export async function handlePublisherAnalytics(request, env) {
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher } = authResult;

    const url = new URL(request.url);
    const days = Math.min(parseInt(url.searchParams.get('days') || '30', 10), 90);

    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
        return error('Analytics not configured', 503);
    }

    try {
        const query = `
            SELECT
                blob2 AS cog_name,
                blob3 AS agent_category,
                blob4 AS country,
                double1 AS http_status,
                COUNT() AS resolution_count
            FROM reginald-resolutions
            WHERE index1 = '${publisher.namespace}'
            AND timestamp > NOW() - INTERVAL '${days}' DAY
            GROUP BY cog_name, agent_category, country, http_status
            ORDER BY resolution_count DESC
            LIMIT 500
        `;

        const resp = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/analytics_engine/sql`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'text/plain',
                },
                body: query,
            }
        );

        if (!resp.ok) {
            const text = await resp.text();
            console.error('Analytics Engine query failed:', text);
            return error('Analytics query failed', 502);
        }

        const data = await resp.json();

        // Aggregate into useful structures
        const byCog = {};
        const byAgent = {};
        const byCountry = {};
        let totalResolutions = 0;

        for (const row of (data.data || [])) {
            const count = row.resolution_count || 0;
            totalResolutions += count;

            const cogName = row.cog_name || 'unknown';
            byCog[cogName] = (byCog[cogName] || 0) + count;

            const agent = row.agent_category || 'unknown';
            byAgent[agent] = (byAgent[agent] || 0) + count;

            const country = row.country || 'XX';
            byCountry[country] = (byCountry[country] || 0) + count;
        }

        return json({
            namespace: publisher.namespace,
            period_days: days,
            total_resolutions: totalResolutions,
            by_cog: byCog,
            by_agent: byAgent,
            by_country: byCountry,
            raw_rows: data.data?.length || 0,
        });
    } catch (e) {
        return error(`Analytics error: ${e.message}`, 500);
    }
}
