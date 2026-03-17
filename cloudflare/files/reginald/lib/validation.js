/**
 * Manifest and registration request validation.
 * Ported from mx-reginald/scripts/registration-webhook.js
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags validation, manifest, registration
 */

const REQUIRED_MANIFEST_FIELDS = ['manifest_version', 'publisher', 'cogs', 'generated'];
const REQUIRED_PUBLISHER_FIELDS = ['namespace', 'name', 'domain'];
const REQUIRED_COG_FIELDS = ['name', 'version', 'description', 'canonical_url', 'content_hash'];

/**
 * Validate a registration request payload.
 * @param {object} body
 * @returns {string[]} Array of error messages (empty = valid)
 */
export function validateRegistrationRequest(body) {
    const errors = [];

    if (!body.namespace || typeof body.namespace !== 'string') {
        errors.push('namespace is required (lowercase alphanumeric + hyphens)');
    } else if (!/^[a-z][a-z0-9-]*$/.test(body.namespace)) {
        errors.push('namespace must start with lowercase letter, contain only lowercase alphanumeric and hyphens');
    }

    if (!body.manifest_url || typeof body.manifest_url !== 'string') {
        errors.push('manifest_url is required');
    } else {
        try {
            const url = new URL(body.manifest_url);
            if (url.protocol !== 'https:') {
                errors.push('manifest_url must use HTTPS');
            }
            if (!url.pathname.endsWith('/mx-cogs.json')) {
                errors.push('manifest_url must end with /mx-cogs.json (expected .well-known/mx-cogs.json)');
            }
        } catch {
            errors.push('manifest_url is not a valid URL');
        }
    }

    if (!body.domain || typeof body.domain !== 'string') {
        errors.push('domain is required');
    }

    return errors;
}

/**
 * Validate manifest structure against the REGINALD schema.
 * @param {object} manifest
 * @returns {string[]} Array of error messages (empty = valid)
 */
export function validateManifest(manifest) {
    const errors = [];

    for (const field of REQUIRED_MANIFEST_FIELDS) {
        if (!(field in manifest)) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    if (manifest.manifest_version !== '1.0') {
        errors.push(`Unsupported manifest_version: ${manifest.manifest_version} (expected 1.0)`);
    }

    if (manifest.publisher) {
        for (const field of REQUIRED_PUBLISHER_FIELDS) {
            if (!(field in manifest.publisher)) {
                errors.push(`Missing publisher field: ${field}`);
            }
        }
    }

    if (Array.isArray(manifest.cogs)) {
        for (let i = 0; i < manifest.cogs.length; i++) {
            const cog = manifest.cogs[i];
            for (const field of REQUIRED_COG_FIELDS) {
                if (!(field in cog)) {
                    errors.push(`COG ${i} missing field: ${field}`);
                }
            }
            if (cog.content_hash && !/^sha256:[a-f0-9]{64}$/.test(cog.content_hash)) {
                errors.push(`COG ${i} (${cog.name}): invalid content_hash format`);
            }
        }
    } else if (manifest.cogs !== undefined) {
        errors.push('cogs must be an array');
    }

    return errors;
}

/**
 * Verify manifest_hash matches the cogs array.
 * Uses Web Crypto API for SHA-256.
 * @param {object} manifest
 * @returns {Promise<boolean>}
 */
export async function verifyManifestHash(manifest) {
    if (!manifest.manifest_hash || !manifest.cogs) return true;

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(manifest.cogs));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computed = 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return manifest.manifest_hash === computed;
}

/**
 * Fetch and validate a publisher manifest.
 * @param {string} manifestUrl
 * @returns {Promise<object>} Validated manifest
 * @throws {Error} On fetch or validation failure
 */
export async function fetchAndValidateManifest(manifestUrl) {
    const response = await fetch(manifestUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(`Manifest returned HTTP ${response.status}`);
    }

    let manifest;
    try {
        manifest = await response.json();
    } catch (e) {
        throw new Error(`Manifest is not valid JSON: ${e.message}`);
    }

    const errors = validateManifest(manifest);
    if (errors.length > 0) {
        throw new Error(`Manifest validation failed: ${errors.join('; ')}`);
    }

    const hashValid = await verifyManifestHash(manifest);
    if (!hashValid) {
        throw new Error('manifest_hash does not match computed hash of cogs array');
    }

    return manifest;
}
