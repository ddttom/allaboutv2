/**
 * Token database operations.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, tokens, auth
 */

/**
 * Find an active token by its hash.
 * @param {D1Database} db
 * @param {string} tokenHash
 * @returns {Promise<object|null>}
 */
export async function findByHash(db, tokenHash) {
    return db.prepare(
        'SELECT * FROM tokens WHERE token_hash = ? AND status = ?'
    ).bind(tokenHash, 'active').first();
}

/**
 * Create a new token record.
 * @param {D1Database} db
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function create(db, data) {
    const result = await db.prepare(
        'INSERT INTO tokens (token_hash, publisher_id, prefix, status) VALUES (?, ?, ?, ?)'
    ).bind(data.token_hash, data.publisher_id, data.prefix, 'active').run();

    return db.prepare('SELECT * FROM tokens WHERE id = ?').bind(result.meta.last_row_id).first();
}

/**
 * Revoke all active tokens for a publisher.
 * @param {D1Database} db
 * @param {number} publisherId
 */
export async function revokeAll(db, publisherId) {
    await db.prepare(
        "UPDATE tokens SET status = 'revoked' WHERE publisher_id = ? AND status = 'active'"
    ).bind(publisherId).run();
}

/**
 * Update last_used_at timestamp.
 * @param {D1Database} db
 * @param {number} tokenId
 */
export async function touchLastUsed(db, tokenId) {
    await db.prepare(
        "UPDATE tokens SET last_used_at = datetime('now') WHERE id = ?"
    ).bind(tokenId).run();
}
