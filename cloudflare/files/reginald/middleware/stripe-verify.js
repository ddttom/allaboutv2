/**
 * Stripe webhook signature verification.
 * Uses Web Crypto API HMAC-SHA256.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags stripe, webhook, hmac, signature
 */

/**
 * Verify a Stripe webhook signature.
 * @param {string} payload - Raw request body
 * @param {string} sigHeader - Stripe-Signature header value
 * @param {string|string[]} secrets - Webhook signing secret(s) (whsec_...).
 *   Pass an array to accept signatures from multiple endpoints (e.g. live and
 *   test mode); the request is valid if any one of them matches.
 * @returns {Promise<boolean>}
 */
export async function verifyStripeSignature(payload, sigHeader, secrets) {
    if (!sigHeader || !secrets) return false;

    const secretList = (Array.isArray(secrets) ? secrets : [secrets]).filter(Boolean);
    if (secretList.length === 0) return false;

    const parts = {};
    for (const item of sigHeader.split(',')) {
        const [key, value] = item.split('=');
        parts[key.trim()] = value;
    }

    const timestamp = parts.t;
    const signature = parts.v1;

    if (!timestamp || !signature) return false;

    // Reject signatures older than 5 minutes.
    const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
    if (age > 300) return false;

    const encoder = new TextEncoder();
    const signedPayload = `${timestamp}.${payload}`;

    for (const secret of secretList) {
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
        const expected = Array.from(new Uint8Array(mac))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (timingSafeEqual(expected, signature)) return true;
    }

    return false;
}

/**
 * Constant-time string comparison.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
