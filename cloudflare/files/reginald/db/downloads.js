/**
 * Download link database operations.
 * Manages time-limited, count-limited PDF download tokens.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, downloads, books
 */

/**
 * Create a new download link record.
 * @param {D1Database} db
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function create(db, data) {
    const result = await db.prepare(
        `INSERT INTO download_links
         (token_hash, download_token, book_id, email, name, source, stripe_session_id, max_downloads, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.tokenHash,
        data.downloadToken || null,
        data.bookId || 'handbook',
        data.email || null,
        data.name || null,
        data.source || 'manual',
        data.stripeSessionId || null,
        data.maxDownloads || 4,
        data.expiresAt,
    ).run();

    return db.prepare('SELECT * FROM download_links WHERE id = ?')
        .bind(result.meta.last_row_id).first();
}

/**
 * Find an active download link by its token hash.
 * @param {D1Database} db
 * @param {string} tokenHash
 * @returns {Promise<object|null>}
 */
export async function findByHash(db, tokenHash) {
    return db.prepare(
        'SELECT * FROM download_links WHERE token_hash = ? AND status = ?'
    ).bind(tokenHash, 'active').first();
}

/**
 * Find an active download link by Stripe checkout session ID.
 * Used by the success-page polling endpoint to retrieve the download URL
 * after the webhook has minted the token.
 * @param {D1Database} db
 * @param {string} sessionId
 * @returns {Promise<object|null>}
 */
export async function findBySessionId(db, sessionId) {
    return db.prepare(
        'SELECT * FROM download_links WHERE stripe_session_id = ? AND status = ? ORDER BY id DESC LIMIT 1'
    ).bind(sessionId, 'active').first();
}

/**
 * Increment download count and update last_downloaded_at.
 * @param {D1Database} db
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function incrementDownload(db, id) {
    await db.prepare(
        `UPDATE download_links
         SET download_count = download_count + 1,
             last_downloaded_at = datetime('now')
         WHERE id = ?`
    ).bind(id).run();
}

/**
 * Expire links that have passed their expiry date.
 * @param {D1Database} db
 * @returns {Promise<number>} Number of links expired
 */
export async function expireStale(db) {
    const result = await db.prepare(
        `UPDATE download_links
         SET status = 'expired'
         WHERE status = 'active' AND expires_at < datetime('now')`
    ).run();
    return result.meta.changes;
}

/**
 * Revoke a specific download link.
 * @param {D1Database} db
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function revoke(db, id) {
    await db.prepare(
        "UPDATE download_links SET status = 'revoked' WHERE id = ?"
    ).bind(id).run();
}
