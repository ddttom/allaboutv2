/**
 * Token rotation handler — generate new token, revoke old.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags token, rotation, auth
 */

import { json } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';
import { generateToken } from '../lib/token.js';
import * as tokensDb from '../db/tokens.js';
import * as audit from '../db/audit.js';

/**
 * Handle POST /api/v1/publisher/token/rotate
 * Requires Bearer token authentication.
 * Revokes all existing tokens and issues a new one.
 */
export async function handleTokenRotate(request, env) {
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher } = authResult;

    // Revoke all existing tokens.
    await tokensDb.revokeAll(env.DB, publisher.id);

    // Generate new token.
    const { raw, hash, prefix } = await generateToken();
    await tokensDb.create(env.DB, {
        token_hash: hash,
        publisher_id: publisher.id,
        prefix,
    });

    await audit.log(env.DB, publisher.id, 'token_rotated', {
        new_prefix: prefix,
    });

    return json({
        token: raw,
        prefix,
        message: 'New token issued. Previous tokens have been revoked. Store this token securely — it cannot be retrieved again.',
    });
}
