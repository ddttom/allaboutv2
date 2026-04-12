/**
 * AI Attribution API — read endpoint.
 *
 * Returns aggregated ai_visits data for a given hostname since a given
 * timestamp. Open read for hostnames we operate (matched against
 * AI_ATTRIBUTION_HOSTS in the worker); 404 otherwise.
 *
 * Query params:
 *   host      — hostname to query (required)
 *   since     — ISO-8601 or epoch ms (optional, defaults to 30 days ago)
 *   group_by  — 'agent_key' (default) | 'event_type' | 'path' | 'day'
 *
 * @file reginald/handlers/ai-attribution.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags api, ai-attribution, read
 */

import * as aiVisitsDb from '../db/ai-visits.js';
import * as usageDb from '../db/ai-attribution-usage.js';
import { FREE_TIER_MONTHLY_QUERIES } from '../db/ai-attribution-usage.js';
import * as publishersDb from '../db/publishers.js';
import { isAttributionHost } from '../lib/ai-attribution-hosts.js';

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
    },
});

/**
 * Derive an access tier from the request.
 *
 * Tiers (in priority order):
 *   - 'open'       — hostname is in AI_ATTRIBUTION_HOSTS (we operate it); no auth
 *   - 'authed'     — Bearer token resolves to a publisher whose verified hostname
 *                    matches the query. Subject to free/paid tier limits
 *   - 'denied'     — neither applies
 *
 * @returns {Promise<{ tier: string, publisher?: object, reason?: string }>}
 */
async function resolveTier(request, env, host) {
    if (isAttributionHost(host)) {
        return { tier: 'open' };
    }
    if (!env.DB || !publishersDb.findByToken) {
        return { tier: 'denied', reason: 'publisher auth not configured' };
    }
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
        return { tier: 'denied', reason: 'no auth token' };
    }
    try {
        const publisher = await publishersDb.findByToken(env.DB, token);
        if (!publisher) return { tier: 'denied', reason: 'invalid token' };
        const verifiedHosts = (publisher.verified_hostnames || '').split(',').map((h) => h.trim().toLowerCase());
        if (!verifiedHosts.includes(host)) {
            return { tier: 'denied', reason: 'hostname not verified for publisher' };
        }
        return { tier: 'authed', publisher };
    } catch {
        return { tier: 'denied', reason: 'auth lookup failed' };
    }
}

async function hashIp(ip) {
    if (!ip) return null;
    try {
        const enc = new TextEncoder().encode(ip);
        const buf = await crypto.subtle.digest('SHA-256', enc);
        return Array.from(new Uint8Array(buf)).slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
}

export async function handleAiAttribution(request, env) {
    const url = new URL(request.url);
    const host = (url.searchParams.get('host') || '').toLowerCase();
    const sinceParam = url.searchParams.get('since');
    const groupBy = url.searchParams.get('group_by') || 'agent_key';

    if (!host) {
        return jsonResponse({ error: 'host query param required' }, 400);
    }
    if (!env.DB) {
        return jsonResponse({ error: 'database unavailable' }, 503);
    }

    const tier = await resolveTier(request, env, host);
    if (tier.tier === 'denied') {
        return jsonResponse({ error: 'hostname not instrumented', reason: tier.reason }, 404);
    }

    // Rate limit authed publishers against the free-tier monthly cap.
    // Paid-tier publishers (publisher.ai_attribution_paid = 1) bypass the cap.
    if (tier.tier === 'authed' && !tier.publisher?.ai_attribution_paid) {
        const used = await usageDb.monthlyCount(env.DB, tier.publisher.id);
        if (used >= FREE_TIER_MONTHLY_QUERIES) {
            return jsonResponse({
                error: 'free tier monthly quota exhausted',
                used,
                limit: FREE_TIER_MONTHLY_QUERIES,
                upgrade: 'https://reginald.allabout.network/api/v1/books/checkout?product=ai-attribution',
            }, 429);
        }
    }

    let since;
    if (sinceParam) {
        const asNum = Number(sinceParam);
        since = Number.isFinite(asNum) && asNum > 10_000_000_000 ? asNum : Date.parse(sinceParam);
        if (!Number.isFinite(since)) {
            return jsonResponse({ error: 'since must be ISO-8601 or unix ms' }, 400);
        }
    } else {
        since = Date.now() - (30 * 24 * 60 * 60 * 1000);
    }

    try {
        const [totals, buckets] = await Promise.all([
            aiVisitsDb.totals(env.DB, { hostname: host, since }),
            aiVisitsDb.aggregate(env.DB, { hostname: host, since, groupBy }),
        ]);
        const body = {
            host,
            since: new Date(since).toISOString(),
            tier: tier.tier,
            totals,
            groupBy,
            buckets,
        };
        // Record usage (fire-and-forget)
        usageDb.record(env.DB, {
            publisherId: tier.publisher?.id || null,
            hostname: host,
            httpStatus: 200,
            ipHash: await hashIp(request.headers.get('cf-connecting-ip')),
        }).catch(() => {});
        return jsonResponse(body);
    } catch (err) {
        return jsonResponse({ error: 'query failed', detail: String(err && err.message) }, 500);
    }
}
