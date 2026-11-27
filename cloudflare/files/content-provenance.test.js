/**
 * @file content-provenance.test.js
 * @description Tests for the CPS draft 0.4 endpoints and page transforms.
 *   The golden fixture test-fixtures/content-provenance-store.json is written
 *   by the MX-hub prototype (tests/test-content-provenance.js with
 *   CPS_STORE_OUT set), publishing one allabout.network page through a local
 *   REGINALD with a fixture key. It holds the origin page, the page as it must
 *   be served, and the store this worker reads.
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status draft
 * @mx:contentType script
 * @mx:tags test, content-provenance, cps, cloudflare
 * @mx:partOf mx-os
 */

import nodeCrypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, test, expect } from 'vitest';
import {
  isContentProvenanceRequest,
  handleContentProvenanceRequest,
  pagePathKey,
  pageObjectName,
  buildListingPage,
  listingLinkHeader,
  entryIsFresh,
  wrapFactSpans,
  applyContentProvenance,
  applyMarkdownFrontmatter,
  loadPageEntry,
} from './content-provenance.js';
import worker from './cloudflare-worker.js';

const GOLDEN = JSON.parse(readFileSync(new URL('./test-fixtures/content-provenance-store.json', import.meta.url), 'utf8'));
const LAST_MODIFIED = 'Thu, 04 Jun 2026 07:27:33 GMT';

const makeR2 = (objects = {}) => {
  const store = new Map(Object.entries(objects).map(([k, v]) => [k, new TextEncoder().encode(typeof v === 'string' ? v : JSON.stringify(v))]));
  return {
    store,
    async get(key) {
      const bytes = store.get(key);
      if (!bytes) return null;
      return { text: async () => new TextDecoder().decode(bytes), arrayBuffer: async () => bytes.slice().buffer };
    },
    async put(key, value) { store.set(key, new Uint8Array(value)); },
    async delete(key) { store.delete(key); },
  };
};

/** The golden store as R2 objects, under the names the publisher uploads. */
const goldenObjects = () => {
  const s = GOLDEN.store;
  const out = { 'site.json': s['site.json'], 'documents.json': s['documents.json'], 'keys.json': s['keys.json'] };
  for (const [id, annotation] of Object.entries(s.facts)) out[`facts/${id}.json`] = annotation;
  for (const [path, entry] of Object.entries(s.pages)) out[pageObjectName(path)] = entry;
  return out;
};

const get = (path, env) => handleContentProvenanceRequest(new Request(`https://allabout.network${path}`), env);

describe('content provenance: routing', () => {
  test('claims the well-known prefix and the upload prefix on allabout.network only', () => {
    expect(isContentProvenanceRequest(new URL('https://allabout.network/.well-known/content-provenance'))).toBe(true);
    expect(isContentProvenanceRequest(new URL('https://allabout.network/.well-known/content-provenance/keys'))).toBe(true);
    expect(isContentProvenanceRequest(new URL('https://www.allabout.network/api/v1/content-provenance/site.json'))).toBe(true);
    expect(isContentProvenanceRequest(new URL('https://allabout.network/.well-known/content-provenance-x'))).toBe(false);
    expect(isContentProvenanceRequest(new URL('https://reginald.allabout.network/.well-known/content-provenance'))).toBe(false);
    expect(isContentProvenanceRequest(new URL('https://allabout.network/.well-known/did.json'))).toBe(false);
  });

  test('page path keys match the publisher', () => {
    expect(pagePathKey('/')).toBe('/');
    expect(pagePathKey('/index.html')).toBe('/');
    expect(pagePathKey('/blogs/ddt/a-guide.md')).toBe('/blogs/ddt/a-guide');
    expect(pagePathKey('/blogs/ddt/')).toBe('/blogs/ddt');
    expect(pageObjectName('/')).toBe('pages/index.json');
    expect(pageObjectName('/blogs/ddt/a-guide')).toBe('pages/blogs/ddt/a-guide.json');
  });

  test('is inert without the bucket', async () => {
    const res = await get('/.well-known/content-provenance', {});
    expect(res.status).toBe(404);
  });
});

describe('content provenance: endpoints from the golden store', () => {
  const env = { CONTENT_PROVENANCE_R2: makeR2(goldenObjects()) };

  test('the listing has the reference shape, headers and Link', async () => {
    const res = await get('/.well-known/content-provenance', env);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('access-control-expose-headers')).toBe('Link');
    expect(res.headers.get('cache-control')).toBe('public, max-age=300');
    const site = GOLDEN.store['site.json'].siteUrl;
    expect(res.headers.get('link')).toBe(`<${site}/.well-known/content-provenance?page=1>; rel="first", <${site}/.well-known/content-provenance?page=1>; rel="last"`);
    const body = await res.json();
    expect(Object.keys(body)).toEqual(['@context', 'specVersion', 'generator', 'cpsConformance', 'site', 'totalItems', 'page', 'pageSize', 'documents']);
    expect(body.documents).toEqual(GOLDEN.store['documents.json']);
    expect(body.cpsConformance).toBe(2);
  });

  test('a page beyond the last, or not a number, is the reference 404', async () => {
    for (const q of ['?page=2', '?page=0', '?page=x']) {
      const res = await get(`/.well-known/content-provenance${q}`, env);
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: 'page out of range' });
    }
  });

  test('the key list and one key entry, addressed by its percent-encoded DID URL', async () => {
    const list = await (await get('/.well-known/content-provenance/keys', env)).json();
    expect(list).toEqual(GOLDEN.store['keys.json']);
    const [key] = list.keys;
    const res = await get(`/.well-known/content-provenance/keys/${encodeURIComponent(key.keyId)}`, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(key);
    expect((await get('/.well-known/content-provenance/keys/nope', env)).status).toBe(404);
  });

  test('a Fact annotation, and the reference 404 for an unknown one', async () => {
    const [id] = Object.keys(GOLDEN.store.facts);
    const res = await get(`/.well-known/content-provenance/facts/${id}`, env);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"');
    expect(await res.json()).toEqual(GOLDEN.store.facts[id]);
    const missing = await get('/.well-known/content-provenance/facts/nope', env);
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ error: 'unknown fact' });
  });

  test('writes on the read routes are refused', async () => {
    const res = await handleContentProvenanceRequest(new Request('https://allabout.network/.well-known/content-provenance', { method: 'POST' }), env);
    expect(res.status).toBe(405);
  });

  test('pagination over more than one page', () => {
    const entries = Array.from({ length: 150 }, (_, i) => ({ url: `https://allabout.network/p${i}`, cpsConformance: i === 7 ? 1 : 2 }));
    const site = { siteUrl: 'https://allabout.network', generator: 'g' };
    const p2 = buildListingPage(site, entries, 2);
    expect(p2.body.documents).toHaveLength(50);
    expect(p2.body.cpsConformance).toBe(1);
    expect(listingLinkHeader(site.siteUrl, 2, 2)).toContain('rel="prev"');
    expect(buildListingPage(site, entries, 3)).toBeNull();
  });
});

describe('content provenance: the served page', () => {
  const entry = GOLDEN.store.pages[GOLDEN.path];

  test('applying the entry to the origin page gives exactly the page the publisher verified', () => {
    expect(applyContentProvenance(GOLDEN.origin, entry, LAST_MODIFIED)).toBe(GOLDEN.served);
  });

  test('a stale entry is not applied (fail closed)', () => {
    expect(entryIsFresh(entry, 'Fri, 05 Jun 2026 07:27:33 GMT')).toBe(false);
    expect(applyContentProvenance(GOLDEN.origin, entry, 'Fri, 05 Jun 2026 07:27:33 GMT')).toBe(GOLDEN.origin);
    expect(applyContentProvenance(GOLDEN.origin, entry, null)).toBe(GOLDEN.origin);
    expect(applyContentProvenance(GOLDEN.origin, null, LAST_MODIFIED)).toBe(GOLDEN.origin);
  });

  test('loads the entry for a page path from the bucket', async () => {
    const env = { CONTENT_PROVENANCE_R2: makeR2(goldenObjects()) };
    expect(await loadPageEntry(env, `${GOLDEN.path}`)).toEqual(entry);
    expect(await loadPageEntry(env, '/no/such/page')).toBeNull();
    expect(await loadPageEntry({}, GOLDEN.path)).toBeNull();
  });

  test('a Fact is wrapped where EDS writes an ampersand as a hexadecimal reference', () => {
    const html = '<html><head></head><body><main><p>Tom &#x26; Jerry met.</p></main></body></html>';
    const out = wrapFactSpans(html, [{ id: 'met', text: 'Tom & Jerry met' }]);
    expect(out).toContain('<span id="fact-met" class="cps-fact" itemscope itemtype="https://schema.org/Claim"><span itemprop="text">Tom &#x26; Jerry met</span></span>');
  });

  test('a Fact is not wrapped inside an attribute, script or comment', () => {
    const html = '<html><head></head><body><img alt="alpha"><script>alpha</script><!-- alpha --><p>beta</p></body></html>';
    expect(wrapFactSpans(html, [{ id: 'a', text: 'alpha' }])).toBe(html);
  });

  test('the Markdown alternate gains the frontmatter once', () => {
    const md = '# A guide\n\nText.\n';
    const out = applyMarkdownFrontmatter(md, entry, LAST_MODIFIED);
    expect(out.startsWith(`${entry.frontmatter}\n`)).toBe(true);
    expect(out.endsWith(md)).toBe(true);
    expect(applyMarkdownFrontmatter(out, entry, LAST_MODIFIED)).toBe(out);
    expect(applyMarkdownFrontmatter(md, entry, 'Fri, 05 Jun 2026 07:27:33 GMT')).toBe(md);
  });
});

describe('content provenance: signed upload', () => {
  const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const b58encode = (bytes) => {
    let zeros = 0;
    while (zeros < bytes.length && bytes[zeros] === 0) zeros += 1;
    const digits = [];
    for (let i = zeros; i < bytes.length; i += 1) {
      let carry = bytes[i];
      for (let j = 0; j < digits.length; j += 1) {
        carry += digits[j] << 8;
        digits[j] = carry % 58;
        carry = (carry / 58) | 0;
      }
      while (carry > 0) { digits.push(carry % 58); carry = (carry / 58) | 0; }
    }
    return '1'.repeat(zeros) + digits.reverse().map((d) => B58[d]).join('');
  };
  const KEY_ID = 'did:web:allabout.network:publishers:pages#upload-key-test';
  const { publicKey, privateKey } = nodeCrypto.generateKeyPairSync('ed25519');
  const der = publicKey.export({ format: 'der', type: 'spki' });
  const mb = `z${b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), der.subarray(der.length - 32)]))}`;

  const signed = (method, path, body = '') => {
    const digest = `sha-256=:${nodeCrypto.createHash('sha256').update(body).digest('base64')}:`;
    const signedAt = new Date().toISOString();
    const covered = ['@method', '@path', 'content-digest', 'mx-signed-at'];
    const params = `(${covered.map((c) => `"${c}"`).join(' ')});keyid="${KEY_ID}";alg="ed25519"`;
    const values = { '@method': method, '@path': path, 'content-digest': digest, 'mx-signed-at': signedAt };
    const base = [...covered.map((c) => `"${c}": ${values[c]}`), `"@signature-params": ${params}`].join('\n');
    const sig = nodeCrypto.sign(null, Buffer.from(base), privateKey);
    return new Request(`https://allabout.network${path}`, {
      method,
      body: body === '' && method === 'DELETE' ? undefined : body,
      headers: {
        'content-digest': digest, 'mx-signed-at': signedAt, 'signature-input': `sig1=${params}`, signature: `sig1=z${b58encode(sig)}`,
      },
    });
  };

  const envWith = () => ({ CONTENT_PROVENANCE_R2: makeR2(), CPS_PUBLISHER_KEY_ID: KEY_ID, CPS_PUBLISHER_PUBLIC_KEY: mb });

  test('a signed PUT stores the object and it is then served', async () => {
    const env = envWith();
    const keys = JSON.stringify(GOLDEN.store['keys.json']);
    const res = await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/keys.json', keys), env);
    expect(res.status).toBe(201);
    expect(await (await get('/.well-known/content-provenance/keys', env)).json()).toEqual(GOLDEN.store['keys.json']);
  });

  test('a signed DELETE removes the object', async () => {
    const env = envWith();
    await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/pages/blogs/x.json', '{}'), env);
    const res = await handleContentProvenanceRequest(signed('DELETE', '/api/v1/content-provenance/pages/blogs/x.json'), env);
    expect(res.status).toBe(200);
    expect(env.CONTENT_PROVENANCE_R2.store.has('pages/blogs/x.json')).toBe(false);
  });

  test('an unsigned PUT is 401 and stores nothing', async () => {
    const env = envWith();
    const res = await handleContentProvenanceRequest(new Request('https://allabout.network/api/v1/content-provenance/site.json', { method: 'PUT', body: '{}' }), env);
    expect(res.status).toBe(401);
    expect(env.CONTENT_PROVENANCE_R2.store.size).toBe(0);
  });

  test('a body that is not JSON, or an object name outside the layout, is 400', async () => {
    const env = envWith();
    expect((await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/site.json', 'not json'), env)).status).toBe(400);
    expect((await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/pages/Upper.json', '{}'), env)).status).toBe(400);
    expect((await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/other.json', '{}'), env)).status).toBe(400);
  });

  test('without the upload key configured, a signed PUT is 503', async () => {
    const env = { CONTENT_PROVENANCE_R2: makeR2(), CPS_PUBLISHER_KEY_ID: KEY_ID };
    const res = await handleContentProvenanceRequest(signed('PUT', '/api/v1/content-provenance/site.json', '{}'), env);
    expect(res.status).toBe(503);
  });
});

describe('content provenance: through the worker', () => {
  const run = async (path, { lastModified = LAST_MODIFIED, body = GOLDEN.origin, type = 'text/html; charset=utf-8', bucket = true } = {}) => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(body, { status: 200, headers: { 'content-type': type, 'last-modified': lastModified } });
    try {
      const env = { ORIGIN_HOSTNAME: 'main--allaboutv2--ddttom.aem.live' };
      if (bucket) env.CONTENT_PROVENANCE_R2 = makeR2(goldenObjects());
      const res = await worker.fetch(new Request(`https://allabout.network${path}`), env, { waitUntil: () => {} });
      return { res, text: await res.text() };
    } finally {
      globalThis.fetch = realFetch;
    }
  };

  test('a published page is served with its Record and Fact span', async () => {
    const { text } = await run(GOLDEN.path);
    expect(text).toContain(GOLDEN.store.pages[GOLDEN.path].headHtml);
    expect(text).toContain('id="fact-kickoff-2024"');
  });

  test('a page changed since signing is served without them', async () => {
    const { text } = await run(GOLDEN.path, { lastModified: 'Fri, 05 Jun 2026 07:27:33 GMT' });
    expect(text).not.toContain('"contentHash"');
    expect(text).not.toContain('id="fact-kickoff-2024"');
  });

  test('without the bucket nothing changes', async () => {
    const { text } = await run(GOLDEN.path, { bucket: false });
    expect(text).not.toContain('"contentHash"');
  });

  test('the Markdown alternate is served with the frontmatter', async () => {
    const { text } = await run(`${GOLDEN.path}.md`, { body: '# A guide\n', type: 'text/markdown; charset=utf-8' });
    expect(text.startsWith('---\n')).toBe(true);
    expect(text).toContain('contentHash:');
    expect(text.endsWith('# A guide\n')).toBe(true);
  });

  test('the listing is served by the worker before EDS routing', async () => {
    const { res, text } = await run('/.well-known/content-provenance');
    expect(res.status).toBe(200);
    expect(JSON.parse(text).totalItems).toBe(GOLDEN.store['documents.json'].length);
  });
});
