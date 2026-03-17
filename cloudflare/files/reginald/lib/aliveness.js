/**
 * Aliveness check engine.
 * Monthly cron: fetches registry index, checks each COG's canonical_url,
 * verifies content_hash via SHA-256, records results to D1.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags aliveness, health-check, cron
 */

import * as alivenessDb from '../db/aliveness.js';
import * as audit from '../db/audit.js';

const CHECK_TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const INTER_CHECK_DELAY_MS = 500;

/**
 * Run aliveness checks for all COGs in the registry.
 * Called by monthly cron trigger.
 * @param {object} env - Worker environment bindings
 */
export async function runAlivenessChecks(env) {
    const repoPath = env.MX_OUTPUTS_REPO_PATH || '/Digital-Domain-Technologies-Ltd/MX-outputs/main';
    const indexUrl = `https://${env.MX_OUTPUTS_HOSTNAME}${repoPath}/reginald/api/v1/index.json`;

    let index;
    try {
        const resp = await fetch(indexUrl);
        if (!resp.ok) {
            console.error(`Aliveness: failed to fetch index.json — HTTP ${resp.status}`);
            return;
        }
        index = await resp.json();
    } catch (e) {
        console.error(`Aliveness: failed to fetch index.json — ${e.message}`);
        return;
    }

    const cogs = index.cogs || index.entries || [];
    let passed = 0;
    let failed = 0;

    for (const cog of cogs) {
        const namespace = cog.namespace || cog.publisher?.namespace;
        const name = cog.name;

        if (!namespace || !name) continue;

        // Fetch the COG's latest.json to get canonical_url and content_hash
        const latestUrl = `https://${env.MX_OUTPUTS_HOSTNAME}${repoPath}/reginald/cogs/${namespace}/${name}/latest.json`;
        let latest;
        try {
            const latestResp = await fetch(latestUrl);
            if (!latestResp.ok) {
                await recordFailure(env.DB, namespace, name, latestUrl, null, null, `latest.json HTTP ${latestResp.status}`);
                failed++;
                continue;
            }
            latest = await latestResp.json();
        } catch (e) {
            await recordFailure(env.DB, namespace, name, latestUrl, null, null, `latest.json fetch: ${e.message}`);
            failed++;
            continue;
        }

        const canonicalUrl = latest.canonical_url;
        const expectedHash = latest.content_hash;

        if (!canonicalUrl) {
            await recordFailure(env.DB, namespace, name, 'unknown', null, null, 'No canonical_url in latest.json');
            failed++;
            continue;
        }

        // Check the canonical URL
        const result = await checkUrl(canonicalUrl, expectedHash);

        await alivenessDb.recordCheck(env.DB, {
            cog_namespace: namespace,
            cog_name: name,
            canonical_url: canonicalUrl,
            http_status: result.status,
            response_time_ms: result.responseTime,
            hash_match: result.hashMatch,
            error_message: result.error,
        });

        if (result.ok) {
            await alivenessDb.resetFailure(env.DB, namespace, name);
            passed++;
        } else {
            await alivenessDb.incrementFailure(env.DB, namespace, name, result.error || `HTTP ${result.status}`);
            failed++;
        }

        // Rate limit: don't overwhelm publisher servers
        await delay(INTER_CHECK_DELAY_MS);
    }

    await audit.log(env.DB, null, 'aliveness_run', {
        total: cogs.length,
        passed,
        failed,
    });

    console.log(`Aliveness: checked ${cogs.length} COGs — ${passed} passed, ${failed} failed`);
}

/**
 * Check a single URL with retries.
 * @param {string} url - Canonical URL to check
 * @param {string} expectedHash - Expected sha256:hex hash
 * @returns {Promise<{ok: boolean, status: number, responseTime: number, hashMatch: boolean, error: string|null}>}
 */
async function checkUrl(url, expectedHash) {
    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const start = Date.now();

            // Try HEAD first (lighter), fall back to GET
            let resp = await fetch(url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
            });

            // If HEAD returns error, try GET (some servers don't support HEAD)
            if (!resp.ok && attempt === MAX_RETRIES - 1) {
                resp = await fetch(url, {
                    method: 'GET',
                    signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
                });
            }

            const responseTime = Date.now() - start;

            if (!resp.ok) {
                lastError = `HTTP ${resp.status}`;
                if (attempt < MAX_RETRIES - 1) {
                    await delay(RETRY_DELAY_MS);
                    continue;
                }
                return { ok: false, status: resp.status, responseTime, hashMatch: false, error: lastError };
            }

            // Hash verification (only if we have content and expected hash)
            let hashMatch = true;
            if (expectedHash && resp.method !== 'HEAD') {
                try {
                    const body = await resp.text();
                    const computed = await computeHash(body);
                    hashMatch = (expectedHash === computed);
                } catch {
                    // Hash check is best-effort; HEAD responses have no body
                    hashMatch = true;
                }
            }

            return { ok: true, status: resp.status, responseTime, hashMatch, error: null };
        } catch (e) {
            lastError = e.message;
            if (attempt < MAX_RETRIES - 1) {
                await delay(RETRY_DELAY_MS);
            }
        }
    }

    return { ok: false, status: null, responseTime: null, hashMatch: false, error: lastError };
}

/**
 * Compute SHA-256 hash of content.
 * @param {string} content
 * @returns {Promise<string>} sha256:hex format
 */
async function computeHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Record a failure when we can't even fetch latest.json.
 */
async function recordFailure(db, namespace, name, url, status, responseTime, errorMsg) {
    await alivenessDb.recordCheck(db, {
        cog_namespace: namespace,
        cog_name: name,
        canonical_url: url,
        http_status: status,
        response_time_ms: responseTime,
        error_message: errorMsg,
    });
    await alivenessDb.incrementFailure(db, namespace, name, errorMsg);
}

/**
 * Simple delay helper.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
