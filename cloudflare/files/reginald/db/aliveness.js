/**
 * Aliveness check database operations.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, aliveness, health-check
 */

/**
 * Record an aliveness check result.
 * @param {D1Database} db
 * @param {object} data
 * @returns {Promise<void>}
 */
export async function recordCheck(db, data) {
    await db.prepare(
        `INSERT INTO aliveness_checks
         (publisher_id, cog_namespace, cog_name, canonical_url, http_status, response_time_ms, hash_match, error_message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.publisher_id || null,
        data.cog_namespace,
        data.cog_name,
        data.canonical_url,
        data.http_status || null,
        data.response_time_ms || null,
        data.hash_match !== undefined ? (data.hash_match ? 1 : 0) : null,
        data.error_message || null
    ).run();
}

/**
 * Increment consecutive failure count for a COG.
 * Auto-hides from resolution after 3 consecutive failures.
 * @param {D1Database} db
 * @param {string} namespace
 * @param {string} name
 * @param {string} errorMessage
 * @returns {Promise<void>}
 */
export async function incrementFailure(db, namespace, name, errorMessage) {
    // Upsert failure record
    await db.prepare(
        `INSERT INTO aliveness_failures (cog_namespace, cog_name, consecutive_failures, last_failure_at, last_error)
         VALUES (?, ?, 1, datetime('now'), ?)
         ON CONFLICT(cog_namespace, cog_name)
         DO UPDATE SET
           consecutive_failures = consecutive_failures + 1,
           last_failure_at = datetime('now'),
           last_error = ?,
           hidden_from_resolution = CASE WHEN consecutive_failures + 1 >= 3 THEN 1 ELSE hidden_from_resolution END`
    ).bind(namespace, name, errorMessage, errorMessage).run();
}

/**
 * Reset failure count on successful check.
 * @param {D1Database} db
 * @param {string} namespace
 * @param {string} name
 * @returns {Promise<void>}
 */
export async function resetFailure(db, namespace, name) {
    await db.prepare(
        `UPDATE aliveness_failures
         SET consecutive_failures = 0, hidden_from_resolution = 0
         WHERE cog_namespace = ? AND cog_name = ?`
    ).bind(namespace, name).run();
}

/**
 * Find all failures for a namespace.
 * @param {D1Database} db
 * @param {string} namespace
 * @returns {Promise<object[]>}
 */
export async function findFailuresByNamespace(db, namespace) {
    const result = await db.prepare(
        'SELECT * FROM aliveness_failures WHERE cog_namespace = ? ORDER BY consecutive_failures DESC'
    ).bind(namespace).all();
    return result.results;
}

/**
 * Find recent checks for a namespace.
 * @param {D1Database} db
 * @param {string} namespace
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
export async function findChecksByNamespace(db, namespace, limit = 50) {
    const result = await db.prepare(
        'SELECT * FROM aliveness_checks WHERE cog_namespace = ? ORDER BY checked_at DESC LIMIT ?'
    ).bind(namespace, limit).all();
    return result.results;
}

/**
 * Get aliveness summary for a namespace.
 * @param {D1Database} db
 * @param {string} namespace
 * @returns {Promise<object>}
 */
export async function getSummary(db, namespace) {
    const checks = await db.prepare(
        `SELECT
           COUNT(*) as total_checks,
           SUM(CASE WHEN http_status = 200 THEN 1 ELSE 0 END) as passed,
           SUM(CASE WHEN http_status != 200 OR http_status IS NULL THEN 1 ELSE 0 END) as failed,
           SUM(CASE WHEN hash_match = 0 THEN 1 ELSE 0 END) as hash_mismatches,
           AVG(response_time_ms) as avg_response_time
         FROM aliveness_checks
         WHERE cog_namespace = ?
         AND checked_at > datetime('now', '-31 days')`
    ).bind(namespace).first();

    const hidden = await db.prepare(
        'SELECT COUNT(*) as count FROM aliveness_failures WHERE cog_namespace = ? AND hidden_from_resolution = 1'
    ).bind(namespace).first();

    return {
        ...checks,
        hidden_cogs: hidden?.count || 0,
    };
}
