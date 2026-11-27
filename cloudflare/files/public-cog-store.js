/**
 * @file public-cog-store.js
 * @description Public cog body store for allabout.network. Serves the exact
 * bytes of public-fact cogs from R2 at /cogs/public/<path>.cog.md so a third
 * party can hash them against the REGINALD attestation, and accepts signed
 * PUT / DELETE from the publisher.
 *
 * Authentication is the RFC 9421 profile the MX hub uses (Ed25519 over
 * @method, @path, content-digest and mx-signed-at). The signature-base
 * builder, Signature-Input parser and base58btc decoder are ported from the
 * hub's REGINALD verifier; they are kept byte-compatible so a signature made
 * by the hub's signSubmission verifies here.
 *
 * Pure functions plus one request handler; no Cloudflare-only APIs beyond
 * WebCrypto and an R2 binding passed in through env.
 *
 * @author Tom Cranstoun
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 */

export const PUBLIC_COG_PREFIX = '/cogs/public/';
export const PUBLIC_COG_SUFFIX = '.cog.md';
export const PUBLIC_COG_SLUG_PATH = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
export const PUBLIC_COG_MAX_BYTES = 262144;
export const PUBLIC_COG_MAX_SKEW_SECONDS = 300;
export const PUBLIC_COG_REQUIRED_COVERED = ['@method', '@path', 'content-digest', 'mx-signed-at'];
export const PUBLIC_COG_HOSTS = ['allabout.network', 'www.allabout.network'];
const CONTENT_TYPE = 'text/markdown; charset=utf-8';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_MAP = new Map([...BASE58_ALPHABET].map((c, i) => [c, i]));

/** Decode base58btc (no multibase prefix) to bytes. */
export const decodeBase58 = (str) => {
  if (str.length === 0) return new Uint8Array(0);
  let zeros = 0;
  while (zeros < str.length && str[zeros] === '1') zeros += 1;
  const bytes = [];
  for (let i = zeros; i < str.length; i += 1) {
    const value = BASE58_MAP.get(str[i]);
    if (value === undefined) throw new Error(`invalid base58 character '${str[i]}'`);
    let carry = value;
    for (let j = 0; j < bytes.length; j += 1) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  const out = new Uint8Array(zeros + bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[zeros + bytes.length - 1 - i] = bytes[i];
  return out;
};

/** Decode a z-prefixed (base58btc) multibase string. */
export const decodeMultibaseZ = (str) => {
  if (typeof str !== 'string' || str[0] !== 'z') throw new Error('expected z-prefixed multibase');
  return decodeBase58(str.slice(1));
};

const b64ToBytes = (b64) => {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
};

const bytesToB64 = (bytes) => {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
};

const bytesToHex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');

/** SHA-256 of bytes, as raw bytes. */
export const sha256Bytes = async (bytes) => new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));

/** content-digest header value for a body: sha-256=:<base64>: */
export const contentDigestOf = async (bytes) => `sha-256=:${bytesToB64(await sha256Bytes(bytes))}:`;

/**
 * Parse Signature-Input: sig1=("@method" "@path" ...);keyid="...";alg="ed25519"
 * (same grammar as the hub's parseSignatureInput).
 */
export const parseSignatureInput = (signatureInput) => {
  const m = /^([A-Za-z0-9_-]+)=\((.*?)\)(.*)$/.exec(String(signatureInput).trim());
  if (!m) throw new Error('malformed Signature-Input');
  const [, label, inner, tail] = m;
  const covered = inner.split(/\s+/).filter(Boolean).map((s) => s.replace(/^"|"$/g, ''));
  const keyid = /keyid="([^"]+)"/.exec(tail)?.[1];
  const alg = /alg="([^"]+)"/.exec(tail)?.[1];
  return { label, covered, keyid, alg, raw: `(${inner})${tail}` };
};

/**
 * Build the RFC 9421 signature base (same as the hub's signatureBase).
 * req: { method, path, headers } with lowercase header names.
 */
export const signatureBase = (req, covered, paramsValue) => {
  const lines = [];
  for (const c of covered) {
    let value;
    if (c === '@method') value = req.method.toUpperCase();
    else if (c === '@path') value = req.path;
    else value = req.headers[c];
    if (value === undefined || value === null) {
      throw new Error(`covered component "${c}" not present on request`);
    }
    lines.push(`"${c}": ${value}`);
  }
  lines.push(`"@signature-params": ${paramsValue}`);
  return lines.join('\n');
};

const extractSignatureValue = (sigHeader, label) => {
  const m = new RegExp(`${label}=(:[^:]+:|[^,\\s]+)`).exec(sigHeader);
  return m ? m[1].replace(/^:|:$/g, '') : null;
};

/** Import a z6Mk... multibase Ed25519 public key as a WebCrypto verify key. */
export const importPublicKey = async (multibase) => {
  const decoded = decodeMultibaseZ(multibase);
  if (decoded.length !== 34 || decoded[0] !== 0xed || decoded[1] !== 0x01) {
    throw new Error('public key must be multicodec ed25519-pub (0xed01) plus 32 bytes');
  }
  return crypto.subtle.importKey('raw', decoded.subarray(2), { name: 'Ed25519' }, false, ['verify']);
};

const fail = (reason) => ({ ok: false, reason });

/**
 * Verify the signature on a PUT or DELETE.
 * @param {{method:string, path:string, headers:Record<string,string>, body:Uint8Array}} req
 * @param {{PUBLIC_COG_KEY_ID:string, PUBLIC_COG_PUBLIC_KEY:string}} env
 * @param {number} [nowMs]
 * @returns {Promise<{ok:boolean, reason?:string, signedAt?:string}>}
 */
export const verifyPublicCogRequest = async (req, env, nowMs = Date.now()) => {
  const h = req.headers;
  if (!h['signature-input'] || !h.signature) return fail('missing Signature or Signature-Input header');
  let parsed;
  try {
    parsed = parseSignatureInput(h['signature-input']);
  } catch (err) {
    return fail(err.message);
  }
  if (parsed.alg && parsed.alg !== 'ed25519') return fail(`unsupported alg ${parsed.alg}`);
  if (!parsed.keyid) return fail('no keyid in Signature-Input');
  if (parsed.keyid !== env.PUBLIC_COG_KEY_ID) return fail('keyid not accepted');
  for (const c of PUBLIC_COG_REQUIRED_COVERED) {
    if (!parsed.covered.includes(c)) return fail(`covered components must include ${c}`);
  }
  if (!h['content-digest']) return fail('missing content-digest header');
  if (h['content-digest'] !== await contentDigestOf(req.body)) {
    return fail('content-digest does not match body');
  }
  const signedAt = h['mx-signed-at'];
  if (!signedAt) return fail('missing mx-signed-at header');
  const t = Date.parse(signedAt);
  if (Number.isNaN(t)) return fail('mx-signed-at is not a valid time');
  if (Math.abs(nowMs - t) > PUBLIC_COG_MAX_SKEW_SECONDS * 1000) {
    return fail('mx-signed-at is outside the allowed window');
  }
  const sigValue = extractSignatureValue(h.signature, parsed.label);
  if (!sigValue) return fail(`no signature value for label ${parsed.label}`);
  let sigBytes;
  try {
    sigBytes = sigValue.startsWith('z') ? decodeMultibaseZ(sigValue) : b64ToBytes(sigValue);
  } catch {
    return fail('signature value is not decodable');
  }
  let base;
  try {
    base = signatureBase(req, parsed.covered, parsed.raw);
  } catch (err) {
    return fail(err.message);
  }
  let key;
  try {
    key = await importPublicKey(env.PUBLIC_COG_PUBLIC_KEY);
  } catch {
    return { ok: false, reason: 'server public key is not configured', misconfigured: true };
  }
  let valid = false;
  try {
    valid = await crypto.subtle.verify({ name: 'Ed25519' }, key, sigBytes, new TextEncoder().encode(base));
  } catch {
    valid = false;
  }
  return valid ? { ok: true, signedAt } : fail('Ed25519 verification failed');
};

/**
 * Map a request pathname to an R2 key, or null when it does not satisfy the
 * contract. pathname must start with /cogs/public/.
 */
export const publicCogKeyFromPathname = (pathname) => {
  if (!pathname.startsWith(PUBLIC_COG_PREFIX) || !pathname.endsWith(PUBLIC_COG_SUFFIX)) return null;
  const slug = pathname.slice(PUBLIC_COG_PREFIX.length, pathname.length - PUBLIC_COG_SUFFIX.length);
  if (!PUBLIC_COG_SLUG_PATH.test(slug)) return null;
  return { slug, key: `${slug}${PUBLIC_COG_SUFFIX}` };
};

/** True when this request belongs to the public cog store. */
export const isPublicCogRequest = (url) => PUBLIC_COG_HOSTS.includes(url.hostname)
  && url.pathname.startsWith(PUBLIC_COG_PREFIX);

const CORS = { 'access-control-allow-origin': '*' };

const text = (status, body, extra = {}) => new Response(body, {
  status,
  headers: { 'content-type': 'text/plain; charset=utf-8', ...CORS, ...extra },
});

const json = (status, obj) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json', ...CORS },
});

const readHeaders = (request) => {
  const out = {};
  request.headers.forEach((v, k) => { out[k.toLowerCase()] = v; });
  return out;
};

const objectHeaders = (obj) => {
  const hex = (obj.customMetadata?.sha256 || '').replace(/^sha256:/, '');
  const headers = {
    'content-type': CONTENT_TYPE,
    'cache-control': 'public, max-age=60',
    ...CORS,
  };
  if (hex) {
    headers.etag = `"sha256-${hex}"`;
    headers['x-content-sha256'] = `sha256:${hex}`;
  }
  return headers;
};

/**
 * Handle any request under /cogs/public/ on the main host. Never falls
 * through to other routing.
 */
export const handlePublicCogRequest = async (request, env, url = new URL(request.url)) => {
  const method = request.method.toUpperCase();
  const parsed = publicCogKeyFromPathname(url.pathname);

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...CORS,
        'access-control-allow-methods': 'GET, HEAD, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'content-type, content-digest, signature, signature-input, mx-signed-at',
        'access-control-max-age': '86400',
      },
    });
  }

  if (method === 'GET' || method === 'HEAD') {
    if (!parsed) return text(404, 'Not found');
    if (!env.PUBLIC_COGS_R2) return text(503, 'Public cog store is not configured');
    if (method === 'HEAD') {
      const head = await env.PUBLIC_COGS_R2.head(parsed.key);
      if (!head) return text(404, 'Not found');
      return new Response(null, {
        status: 200,
        headers: { ...objectHeaders(head), 'content-length': String(head.size) },
      });
    }
    const obj = await env.PUBLIC_COGS_R2.get(parsed.key);
    if (!obj) return text(404, 'Not found');
    const bytes = new Uint8Array(await obj.arrayBuffer());
    const headers = objectHeaders(obj);
    if (!headers.etag) {
      const hex = bytesToHex(await sha256Bytes(bytes));
      headers.etag = `"sha256-${hex}"`;
      headers['x-content-sha256'] = `sha256:${hex}`;
    }
    return new Response(bytes, { status: 200, headers });
  }

  if (method !== 'PUT' && method !== 'DELETE') {
    return text(405, 'Method not allowed', { allow: 'GET, HEAD, PUT, DELETE, OPTIONS' });
  }

  if (!parsed) return json(400, { error: 'invalid cog path' });
  if (!env.PUBLIC_COGS_R2) return text(503, 'Public cog store is not configured');

  const declared = Number(request.headers.get('content-length'));
  if (method === 'PUT' && Number.isFinite(declared) && declared > PUBLIC_COG_MAX_BYTES) {
    return json(413, { error: `body exceeds ${PUBLIC_COG_MAX_BYTES} bytes` });
  }
  const body = new Uint8Array(await request.arrayBuffer());
  if (method === 'PUT' && body.length > PUBLIC_COG_MAX_BYTES) {
    return json(413, { error: `body exceeds ${PUBLIC_COG_MAX_BYTES} bytes` });
  }
  if (method === 'DELETE' && body.length > 0) {
    return json(400, { error: 'DELETE takes an empty body' });
  }

  const verdict = await verifyPublicCogRequest(
    { method, path: url.pathname, headers: readHeaders(request), body },
    env,
  );
  if (!verdict.ok) {
    if (verdict.misconfigured) return json(503, { error: verdict.reason });
    return json(401, { error: 'unauthorised', reason: verdict.reason });
  }

  if (method === 'DELETE') {
    await env.PUBLIC_COGS_R2.delete(parsed.key);
    return json(200, { path: url.pathname, deleted: true });
  }

  const hex = bytesToHex(await sha256Bytes(body));
  await env.PUBLIC_COGS_R2.put(parsed.key, body, {
    httpMetadata: { contentType: CONTENT_TYPE },
    customMetadata: { sha256: `sha256:${hex}`, signedAt: verdict.signedAt },
  });
  return json(201, {
    path: url.pathname,
    digest: `sha256:${hex}`,
    url: `${url.origin}${url.pathname}`,
  });
};
