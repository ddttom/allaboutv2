/**
 * Publisher COGs endpoint.
 * Lists COGs for the authenticated publisher's namespace,
 * enriched with aliveness data.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags cogs, publisher, dashboard
 */

import { json, error } from '../lib/responses.js';
import { authenticate } from '../middleware/auth.js';
import * as alivenessDb from '../db/aliveness.js';

/**
 * Handle GET /api/v1/publisher/cogs
 * Requires Bearer token authentication.
 * Returns COGs registered under the publisher's namespace with aliveness status.
 */
export async function handlePublisherCogs(request, env) {
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;
    const { publisher } = authResult;

    // Fetch registry index from GitHub
    const repoPath = env.MX_OUTPUTS_REPO_PATH || '/Digital-Domain-Technologies-Ltd/MX-outputs/main';
    const indexUrl = `https://${env.MX_OUTPUTS_HOSTNAME}${repoPath}/reginald/api/v1/index.json`;

    let index;
    try {
        const resp = await fetch(indexUrl, { cf: { cacheTtl: 300 } });
        if (!resp.ok) {
            return error('Failed to fetch registry index', 502);
        }
        index = await resp.json();
    } catch (e) {
        return error(`Registry fetch error: ${e.message}`, 502);
    }

    // Filter COGs belonging to this publisher
    const allCogs = index.cogs || index.entries || [];
    const publisherCogs = allCogs.filter(cog => {
        const ns = cog.namespace || cog.publisher?.namespace;
        return ns === publisher.namespace;
    });

    // Get aliveness failures for enrichment
    const failures = await alivenessDb.findFailuresByNamespace(env.DB, publisher.namespace);
    const failureMap = {};
    for (const f of failures) {
        failureMap[f.cog_name] = f;
    }

    // Enrich COGs with aliveness status
    const enriched = publisherCogs.map(cog => {
        const failure = failureMap[cog.name];
        return {
            name: cog.name,
            version: cog.version,
            description: cog.description,
            canonical_url: cog.canonical_url,
            content_hash: cog.content_hash,
            aliveness: {
                status: !failure || failure.consecutive_failures === 0 ? 'healthy' :
                    failure.hidden_from_resolution ? 'hidden' : 'failing',
                consecutive_failures: failure?.consecutive_failures || 0,
                last_error: failure?.last_error || null,
            },
        };
    });

    return json({
        namespace: publisher.namespace,
        cog_count: enriched.length,
        cogs: enriched,
    });
}
