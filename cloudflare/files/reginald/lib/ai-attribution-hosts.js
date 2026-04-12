/**
 * Shared allowlist for AI-attribution capture and read endpoints.
 *
 * Kept in a standalone module so both the worker (writer) and the
 * ai-attribution read handler can import it without creating a circular
 * dependency with cloudflare-worker.js. Adding a new operated domain is a
 * one-line change here.
 *
 * @file reginald/lib/ai-attribution-hosts.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags ai-attribution, config
 */

export const AI_ATTRIBUTION_HOSTS = [
    'allabout.network',
    'cognovamx.com',
];

/**
 * Does the given hostname match our operated-domain allowlist?
 * Pure function.
 * @param {string} hostname
 * @returns {boolean}
 */
export const isAttributionHost = (hostname) => {
    if (!hostname) return false;
    const h = hostname.toLowerCase();
    return AI_ATTRIBUTION_HOSTS.some((root) => h === root || h.endsWith(`.${root}`));
};
