/**
 * Registration handler — authenticated manifest registration.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags registration, manifest, auth
 */

import { json, error } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegistrationRequest, fetchAndValidateManifest } from '../lib/validation.js';
import * as audit from '../db/audit.js';

/**
 * Handle POST /api/v1/register
 * Requires Bearer token authentication.
 *
 * Body: { namespace, domain, manifest_url }
 */
export async function handleRegister(request, env) {
    // Authenticate.
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher, subscription } = authResult;

    // Parse body.
    let body;
    try {
        body = await request.json();
    } catch {
        return error('Invalid JSON body', 400);
    }

    // Verify namespace matches token's publisher.
    if (body.namespace && body.namespace !== publisher.namespace) {
        return error(
            `Token is for namespace "${publisher.namespace}", not "${body.namespace}"`,
            403
        );
    }

    // Use publisher's namespace if not provided.
    body.namespace = publisher.namespace;

    // Validate request.
    const requestErrors = validateRegistrationRequest(body);
    if (requestErrors.length > 0) {
        return error('Invalid registration request', 400, requestErrors);
    }

    // Fetch and validate manifest.
    let manifest;
    try {
        manifest = await fetchAndValidateManifest(body.manifest_url);
    } catch (e) {
        return error('Manifest validation failed', 422, [e.message]);
    }

    // Verify namespace matches manifest.
    if (manifest.publisher.namespace !== publisher.namespace) {
        return error(
            'Namespace mismatch',
            400,
            [`Manifest publisher namespace "${manifest.publisher.namespace}" does not match "${publisher.namespace}"`]
        );
    }

    // Verify domain matches manifest.
    if (body.domain && manifest.publisher.domain !== body.domain) {
        return error(
            'Domain mismatch',
            400,
            [`Request domain "${body.domain}" does not match manifest publisher domain "${manifest.publisher.domain}"`]
        );
    }

    // Update publisher domain if first registration.
    if (!publisher.domain || publisher.domain === '') {
        await env.DB.prepare(
            "UPDATE publishers SET domain = ?, name = ?, updated_at = datetime('now') WHERE id = ?"
        ).bind(manifest.publisher.domain, manifest.publisher.name, publisher.id).run();
    }

    await audit.log(env.DB, publisher.id, 'registration_submitted', {
        manifest_url: body.manifest_url,
        cog_count: manifest.cogs.length,
        domain: manifest.publisher.domain,
    });

    return json({
        registered: true,
        status: 'pending',
        namespace: publisher.namespace,
        cog_count: manifest.cogs.length,
        listing_url: `/api/v1/namespaces/${publisher.namespace}/cogs.json`,
        message: 'Registration queued. Your manifest will be verified and added to the registry.',
    }, 202);
}
