/**
 * AI traffic attribution — D1 operations.
 *
 * Writes come from the worker's request hot-path via ctx.waitUntil — the insert
 * is fire-and-forget so a D1 slowdown never delays a response. Reads come from
 * the /api/v1/ai-attribution endpoint.
 *
 * @file reginald/db/ai-visits.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, ai-attribution, analytics
 */

/**
 * Insert a single AI visit row.
 * @param {D1Database} db
 * @param {object} row - { ts, hostname, path, eventType, agentKey, ua, referer, country, status, backfilled }
 * @returns {Promise<void>}
 */
export async function insert(db, row) {
    await db.prepare(
        `INSERT INTO ai_visits
         (ts, hostname, path, event_type, agent_key, ua, referer, country, status, backfilled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        row.ts,
        row.hostname,
        row.path,
        row.eventType,
        row.agentKey,
        row.ua || null,
        row.referer || null,
        row.country || null,
        row.status != null ? row.status : null,
        row.backfilled ? 1 : 0,
    ).run();
}

/**
 * Aggregate visit counts for a hostname since a given timestamp.
 * Supports grouping by agent_key, event_type, path, or day.
 * @param {D1Database} db
 * @param {object} opts - { hostname, since (unix ms), groupBy }
 * @returns {Promise<Array<object>>}
 */
export async function aggregate(db, opts) {
    const { hostname, since, groupBy = 'agent_key' } = opts;
    const allowedGroupBy = {
        agent_key: 'agent_key',
        event_type: 'event_type',
        path: 'path',
        day: "strftime('%Y-%m-%d', ts / 1000, 'unixepoch')",
    };
    const expr = allowedGroupBy[groupBy] || allowedGroupBy.agent_key;
    const label = groupBy === 'day' ? 'day' : groupBy;

    const sql = `
        SELECT
            ${expr} AS bucket,
            event_type,
            COUNT(*) AS count
        FROM ai_visits
        WHERE hostname = ? AND ts >= ?
        GROUP BY bucket, event_type
        ORDER BY count DESC
        LIMIT 500
    `;

    const { results = [] } = await db.prepare(sql).bind(hostname, since).all();
    return results.map((r) => ({ [label]: r.bucket, event_type: r.event_type, count: r.count }));
}

/**
 * Total visit count for a hostname since a given timestamp, split by event type.
 * @param {D1Database} db
 * @param {object} opts - { hostname, since }
 * @returns {Promise<{ crawler: number, referral: number, total: number }>}
 */
export async function totals(db, opts) {
    const { hostname, since } = opts;
    const { results = [] } = await db.prepare(
        `SELECT event_type, COUNT(*) AS count
         FROM ai_visits
         WHERE hostname = ? AND ts >= ?
         GROUP BY event_type`
    ).bind(hostname, since).all();

    const out = { crawler: 0, referral: 0, total: 0 };
    for (const row of results) {
        if (row.event_type === 'crawler') out.crawler = row.count;
        if (row.event_type === 'referral') out.referral = row.count;
        out.total += row.count;
    }
    return out;
}
