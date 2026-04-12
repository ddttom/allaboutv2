/**
 * GA4 Measurement Protocol connector for ai_visits.
 *
 * Runs from the worker's scheduled handler. For each enabled row in
 * `ga4_connectors`, reads the last hour of `ai_visits` rows for that
 * hostname and POSTs them to GA4 as `ai_agent_visit` events with params:
 *   source, medium, agent_key, event_type, path
 *
 * Failure handling: log to the connector row (last_run_status / detail) and
 * skip — the next hourly run's timestamp window will pick up anything missed.
 *
 * @file reginald/lib/ga4-connector.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags ga4, connector, ai-attribution
 */

const MEASUREMENT_PROTOCOL_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const BATCH_SIZE = 25; // GA4 MP limit per request
const LOOKBACK_MS = 60 * 60 * 1000; // one hour

/**
 * Pure function — build a GA4 Measurement Protocol payload from a batch of
 * ai_visits rows. Testable without network.
 *
 * @param {Array<object>} rows
 * @returns {object}
 */
export function buildPayload(rows) {
    return {
        client_id: 'ai_attribution_connector',
        non_personalized_ads: true,
        events: rows.slice(0, BATCH_SIZE).map((row) => ({
            name: 'ai_agent_visit',
            params: {
                engagement_time_msec: 1,
                agent_key: row.agent_key,
                event_type: row.event_type,
                page_path: row.path,
                source: row.event_type === 'referral' ? row.agent_key : 'ai_crawler',
                medium: row.event_type === 'referral' ? 'ai_referral' : 'ai_crawler',
            },
        })),
    };
}

/**
 * List enabled connectors from the ga4_connectors table.
 */
async function listEnabledConnectors(db) {
    const { results = [] } = await db.prepare(
        'SELECT hostname, measurement_id, api_secret FROM ga4_connectors WHERE enabled = 1'
    ).all();
    return results;
}

/**
 * Fetch recent ai_visits rows for a hostname.
 */
async function fetchRecentVisits(db, hostname, sinceMs) {
    const { results = [] } = await db.prepare(
        `SELECT agent_key, event_type, path
         FROM ai_visits
         WHERE hostname = ? AND ts >= ?
         ORDER BY ts DESC
         LIMIT 500`
    ).bind(hostname, sinceMs).all();
    return results;
}

async function updateConnectorStatus(db, hostname, status, detail) {
    try {
        await db.prepare(
            'UPDATE ga4_connectors SET last_run_at = ?, last_run_status = ?, last_run_detail = ? WHERE hostname = ?'
        ).bind(Date.now(), status, detail || null, hostname).run();
    } catch (_) { /* status update is best-effort */ }
}

/**
 * Run one pass of the GA4 connector. Called from the worker's scheduled handler.
 * @param {object} env - worker env (needs env.DB)
 * @returns {Promise<{ run: number, succeeded: number, failed: number }>}
 */
export async function runGa4Connector(env) {
    const summary = { run: 0, succeeded: 0, failed: 0 };
    if (!env.DB) return summary;

    const connectors = await listEnabledConnectors(env.DB);
    const sinceMs = Date.now() - LOOKBACK_MS;

    for (const conn of connectors) {
        summary.run += 1;
        try {
            const rows = await fetchRecentVisits(env.DB, conn.hostname, sinceMs);
            if (rows.length === 0) {
                await updateConnectorStatus(env.DB, conn.hostname, 'ok', 'no new events');
                summary.succeeded += 1;
                continue;
            }
            const payload = buildPayload(rows);
            const url = `${MEASUREMENT_PROTOCOL_ENDPOINT}?measurement_id=${encodeURIComponent(conn.measurement_id)}&api_secret=${encodeURIComponent(conn.api_secret)}`;
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (resp.ok) {
                await updateConnectorStatus(env.DB, conn.hostname, 'ok', `sent ${payload.events.length} events`);
                summary.succeeded += 1;
            } else {
                await updateConnectorStatus(env.DB, conn.hostname, 'error', `GA4 MP returned ${resp.status}`);
                summary.failed += 1;
            }
        } catch (err) {
            await updateConnectorStatus(env.DB, conn.hostname, 'error', String(err && err.message));
            summary.failed += 1;
        }
    }
    return summary;
}
