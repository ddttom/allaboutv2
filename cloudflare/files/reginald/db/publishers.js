/**
 * Publisher database operations.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, publishers
 */

/**
 * Find a publisher by namespace.
 * @param {D1Database} db
 * @param {string} namespace
 * @returns {Promise<object|null>}
 */
export async function findByNamespace(db, namespace) {
    return db.prepare('SELECT * FROM publishers WHERE namespace = ?').bind(namespace).first();
}

/**
 * Find a publisher by ID.
 * @param {D1Database} db
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export async function findById(db, id) {
    return db.prepare('SELECT * FROM publishers WHERE id = ?').bind(id).first();
}

/**
 * Create a new publisher.
 * @param {D1Database} db
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function create(db, data) {
    const result = await db.prepare(
        `INSERT INTO publishers (namespace, name, domain, email, status, migrated_from)
         VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
        data.namespace,
        data.name,
        data.domain,
        data.email || null,
        data.status || 'pending',
        data.migrated_from || null
    ).run();

    return findById(db, result.meta.last_row_id);
}

/**
 * Update publisher status.
 * @param {D1Database} db
 * @param {number} id
 * @param {string} status
 */
export async function updateStatus(db, id, status) {
    await db.prepare(
        `UPDATE publishers SET status = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(status, id).run();
}
