/**
 * AI Attribution usage accounting.
 *
 * Records one row per /api/v1/ai-attribution query for rate-limiting and
 * future billing aggregation. Keeps the hot path fast — fire-and-forget.
 *
 * @file reginald/db/ai-attribution-usage.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, ai-attribution, billing
 */

const FREE_TIER_MONTHLY_QUERIES = 1000;

export async function record(db, { publisherId, hostname, httpStatus, ipHash }) {
    await db.prepare(
        `INSERT INTO ai_attribution_usage (publisher_id, hostname, queried_at, http_status, ip_hash)
         VALUES (?, ?, ?, ?, ?)`
    ).bind(
        publisherId || null,
        hostname || '',
        Date.now(),
        httpStatus || null,
        ipHash || null,
    ).run();
}

/**
 * Count queries for a publisher in the current calendar month.
 * @param {D1Database} db
 * @param {number} publisherId
 * @returns {Promise<number>}
 */
export async function monthlyCount(db, publisherId) {
    const monthStart = Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        1,
    );
    const { results = [] } = await db.prepare(
        `SELECT COUNT(*) AS count
         FROM ai_attribution_usage
         WHERE publisher_id = ? AND queried_at >= ?`
    ).bind(publisherId, monthStart).all();
    return results[0]?.count || 0;
}

export { FREE_TIER_MONTHLY_QUERIES };
