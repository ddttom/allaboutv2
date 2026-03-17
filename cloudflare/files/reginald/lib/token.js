/**
 * Token generation and hashing utilities.
 * Uses Web Crypto API (available in Cloudflare Workers).
 *
 * Token format: reg_ + 64 hex chars (32 random bytes)
 * Storage: SHA-256 hash of raw token
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags auth, token, crypto
 */

const TOKEN_PREFIX = 'reg_';

/**
 * Generate a new API token.
 * @returns {Promise<{raw: string, hash: string, prefix: string}>}
 */
export async function generateToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);

    const hex = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const raw = TOKEN_PREFIX + hex;
    const hash = await hashToken(raw);
    const prefix = raw.substring(0, 12);

    return { raw, hash, prefix };
}

/**
 * Hash a raw token for storage/lookup.
 * @param {string} raw - The raw token string
 * @returns {Promise<string>} SHA-256 hex digest
 */
export async function hashToken(raw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Extract token from Authorization header.
 * @param {string} header - Authorization header value
 * @returns {string|null} Raw token or null
 */
export function extractToken(header) {
    if (!header) return null;
    const match = header.match(/^Bearer\s+(reg_[a-f0-9]{64})$/i);
    return match ? match[1] : null;
}
