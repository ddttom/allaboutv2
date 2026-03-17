/**
 * Subscription database operations.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags db, subscriptions, stripe
 */

/**
 * Find subscription by publisher ID.
 * @param {D1Database} db
 * @param {number} publisherId
 * @returns {Promise<object|null>}
 */
export async function findByPublisher(db, publisherId) {
    return db.prepare(
        'SELECT * FROM subscriptions WHERE publisher_id = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(publisherId).first();
}

/**
 * Find subscription by Stripe customer ID.
 * @param {D1Database} db
 * @param {string} customerId
 * @returns {Promise<object|null>}
 */
export async function findByStripeCustomer(db, customerId) {
    return db.prepare(
        'SELECT * FROM subscriptions WHERE stripe_customer_id = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(customerId).first();
}

/**
 * Find subscription by Stripe subscription ID.
 * @param {D1Database} db
 * @param {string} subscriptionId
 * @returns {Promise<object|null>}
 */
export async function findByStripeSubscription(db, subscriptionId) {
    return db.prepare(
        'SELECT * FROM subscriptions WHERE stripe_subscription_id = ?'
    ).bind(subscriptionId).first();
}

/**
 * Create a new subscription.
 * @param {D1Database} db
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function create(db, data) {
    const result = await db.prepare(
        `INSERT INTO subscriptions
         (publisher_id, stripe_customer_id, stripe_subscription_id, status, current_period_start, current_period_end, grace_period_end)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.publisher_id,
        data.stripe_customer_id || null,
        data.stripe_subscription_id || null,
        data.status || 'incomplete',
        data.current_period_start || null,
        data.current_period_end || null,
        data.grace_period_end || null
    ).run();

    return db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(result.meta.last_row_id).first();
}

/**
 * Update subscription from Stripe event.
 * @param {D1Database} db
 * @param {string} stripeSubscriptionId
 * @param {object} data
 */
export async function updateByStripeId(db, stripeSubscriptionId, data) {
    const fields = [];
    const values = [];

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.current_period_start !== undefined) { fields.push('current_period_start = ?'); values.push(data.current_period_start); }
    if (data.current_period_end !== undefined) { fields.push('current_period_end = ?'); values.push(data.current_period_end); }
    if (data.grace_period_end !== undefined) { fields.push('grace_period_end = ?'); values.push(data.grace_period_end); }

    fields.push("updated_at = datetime('now')");
    values.push(stripeSubscriptionId);

    await db.prepare(
        `UPDATE subscriptions SET ${fields.join(', ')} WHERE stripe_subscription_id = ?`
    ).bind(...values).run();
}

/**
 * Find all subscriptions past their grace period.
 * @param {D1Database} db
 * @returns {Promise<object[]>}
 */
export async function findExpiredGrace(db) {
    const result = await db.prepare(
        `SELECT s.*, p.namespace FROM subscriptions s
         JOIN publishers p ON s.publisher_id = p.id
         WHERE s.status = 'past_due'
         AND s.grace_period_end IS NOT NULL
         AND s.grace_period_end < datetime('now')`
    ).all();
    return result.results;
}
