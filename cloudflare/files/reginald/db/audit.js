/**
 * Audit log database operations.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, audit, logging
 */

/**
 * Log an audit event.
 * @param {D1Database} db
 * @param {number|null} publisherId
 * @param {string} action
 * @param {object} detail
 */
export async function log(db, publisherId, action, detail = {}) {
    await db.prepare(
        'INSERT INTO audit_log (publisher_id, action, detail) VALUES (?, ?, ?)'
    ).bind(publisherId, action, JSON.stringify(detail)).run();
}
