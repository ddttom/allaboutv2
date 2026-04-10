/**
 * Stripe API client using raw fetch().
 * No SDK — keeps Worker under 1MB size limit.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags stripe, payments, api
 */

const STRIPE_API = 'https://api.stripe.com/v1';

/**
 * Make an authenticated request to Stripe API.
 * @param {string} secretKey - Stripe secret key
 * @param {string} method - HTTP method
 * @param {string} endpoint - API path (e.g., '/checkout/sessions')
 * @param {object} params - Form-encoded parameters
 * @returns {Promise<object>} Parsed JSON response
 */
async function stripeRequest(secretKey, method, endpoint, params = {}) {
    const url = STRIPE_API + endpoint;
    const headers = {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const options = { method, headers };

    if (method !== 'GET' && Object.keys(params).length > 0) {
        options.body = encodeParams(params);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        const msg = data.error?.message || `Stripe API error: ${response.status}`;
        throw new Error(msg);
    }

    return data;
}

/**
 * Encode nested params to x-www-form-urlencoded format.
 * Stripe uses bracket notation for nested objects: metadata[namespace]=foo
 * @param {object} params
 * @param {string} prefix
 * @returns {string}
 */
function encodeParams(params, prefix = '') {
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        const fullKey = prefix ? `${prefix}[${key}]` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            parts.push(encodeParams(value, fullKey));
        } else {
            parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
        }
    }
    return parts.join('&');
}

/**
 * Create a Stripe Checkout session for annual subscription.
 * @param {string} secretKey
 * @param {object} options
 * @returns {Promise<object>} Checkout session
 */
export async function createCheckoutSession(secretKey, { priceId, namespace, email, successUrl, cancelUrl }) {
    return stripeRequest(secretKey, 'POST', '/checkout/sessions', {
        mode: 'subscription',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(email && { customer_email: email }),
        'metadata[namespace]': namespace,
        'subscription_data[metadata][namespace]': namespace,
    });
}

/**
 * Create a Stripe Checkout session for a one-time book purchase.
 * @param {string} secretKey
 * @param {object} options
 * @returns {Promise<object>} Checkout session
 */
export async function createBookCheckoutSession(secretKey, { priceId, email, bookId, productType, successUrl, cancelUrl, shippingCountries }) {
    const params = {
        mode: 'payment',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        success_url: successUrl,
        cancel_url: cancelUrl,
        'metadata[type]': 'book_purchase',
        'metadata[book_id]': bookId,
        'metadata[product_type]': productType,
    };

    if (email) {
        params.customer_email = email;
    }

    // shippingCountries: array of ISO codes for the allowed shipping zones, or
    // null for digital products. Stripe requires an explicit country list.
    if (Array.isArray(shippingCountries) && shippingCountries.length > 0) {
        shippingCountries.forEach((code, i) => {
            params[`shipping_address_collection[allowed_countries][${i}]`] = code;
        });
    }

    return stripeRequest(secretKey, 'POST', '/checkout/sessions', params);
}

/**
 * Retrieve a Stripe Checkout session (with shipping details expanded).
 * @param {string} secretKey
 * @param {string} sessionId
 * @returns {Promise<object>}
 */
export async function getCheckoutSession(secretKey, sessionId) {
    return stripeRequest(secretKey, 'GET', `/checkout/sessions/${sessionId}`);
}

/**
 * Retrieve a Stripe subscription.
 * @param {string} secretKey
 * @param {string} subscriptionId
 * @returns {Promise<object>}
 */
export async function getSubscription(secretKey, subscriptionId) {
    return stripeRequest(secretKey, 'GET', `/subscriptions/${subscriptionId}`);
}

/**
 * Cancel a Stripe subscription at period end.
 * @param {string} secretKey
 * @param {string} subscriptionId
 * @returns {Promise<object>}
 */
export async function cancelSubscription(secretKey, subscriptionId) {
    return stripeRequest(secretKey, 'POST', `/subscriptions/${subscriptionId}`, {
        cancel_at_period_end: 'true',
    });
}
