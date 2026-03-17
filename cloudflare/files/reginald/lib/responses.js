/**
 * JSON response helpers for the Worker.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags http, responses, json
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Return a JSON response.
 * @param {object} data
 * @param {number} status
 * @returns {Response}
 */
export function json(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
        },
    });
}

/**
 * Return an error response.
 * @param {string} message
 * @param {number} status
 * @param {string[]} details
 * @returns {Response}
 */
export function error(message, status = 400, details = []) {
    return json({ error: message, ...(details.length > 0 && { details }) }, status);
}

/**
 * Return a CORS preflight response.
 * @returns {Response}
 */
export function corsPreflight() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
