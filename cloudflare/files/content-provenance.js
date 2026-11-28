/**
 * @file content-provenance.js
 * @description Serves the Content Provenance Specification (draft 0.4)
 *   endpoints for allabout.network from R2, and applies the per-page Record
 *   to served HTML and the Markdown alternate. The publisher (MX-hub
 *   scripts/lib/content-provenance) canonicalises each page, has REGINALD
 *   attest the canonical Record digest, and uploads the store this module
 *   reads. The worker never signs and holds no private key.
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status draft
 * @mx:contentType script
 * @mx:tags content-provenance, cps, reginald, well-known, cloudflare
 * @mx:partOf mx-os
 *
 * Store layout in the CONTENT_PROVENANCE_R2 bucket:
 *   site.json            { siteUrl, generator }
 *   documents.json       the listing entries, in listing order
 *   keys.json            { keys: [...] } the verification keys
 *   facts/<id>.json      one Web Annotation per Fact
 *   pages/<path>.json    { documentUrl, sourceLastModified, headHtml, facts, frontmatter }
 *
 * Routes on allabout.network:
 *   GET /.well-known/content-provenance[?page=n]   the paginated listing
 *   GET /.well-known/content-provenance/keys       the key list
 *   GET /.well-known/content-provenance/keys/{id}  one key entry
 *   GET /.well-known/content-provenance/facts/{id} one Fact annotation
 *   PUT|DELETE /api/v1/content-provenance/<object> signed store upload
 *
 * Uploads reuse the RFC 9421 verifier of the public cog store with an upload
 * key of their own, separate from the REGINALD attesting key and absent from
 * the pages DID document (CPS_PUBLISHER_KEY_ID, CPS_PUBLISHER_PUBLIC_KEY). The
 * publisher runs on the operator's Mac and re-signs every page after any site
 * or worker deploy, since a deploy moves Last-Modified. Until the
 * bucket is bound the listing and key list are valid and empty, every other
 * route answers 404, and pages are served unchanged.
 */

import { verifyPublicCogRequest } from './public-cog-store.js';

export const CPS_WELL_KNOWN = '/.well-known/content-provenance';
export const CPS_UPLOAD_PREFIX = '/api/v1/content-provenance/';
export const CPS_HOSTS = ['allabout.network', 'www.allabout.network'];
export const CPS_PAGE_SIZE = 100;
export const CPS_MAX_UPLOAD_BYTES = 1024 * 1024;
export const CPS_CONTEXT = ['https://schema.org', 'https://cms-provenance.org/ns/v1'];
export const CPS_SPEC_VERSION = '0.4';
export const ANNOTATION_CONTENT_TYPE = 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"';

const READ_CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, HEAD, OPTIONS',
  'access-control-expose-headers': 'Link',
};
const JSON_TYPE = 'application/json; charset=utf-8';
const OBJECT_NAME = /^(site\.json|documents\.json|keys\.json|facts\/[A-Za-z0-9._~-]+\.json|pages\/(?:[a-z0-9][a-z0-9._-]*\/)*[a-z0-9][a-z0-9._-]*\.json)$/;

/**
 * The site description used until the publisher uploads site.json: the
 * listing is then valid and empty rather than missing.
 */
export const CPS_DEFAULT_SITE = Object.freeze({
  siteUrl: 'https://allabout.network',
  generator: 'Adobe Edge Delivery Services (ddttom/allaboutv2) + mx-content-provenance 0.1.0',
});

const trimSlash = (u) => String(u).replace(/\/+$/, '');

const jsonResponse = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': JSON_TYPE, ...READ_CORS, ...headers },
});

/** True when this request is a content provenance endpoint or upload. */
export const isContentProvenanceRequest = (url) => CPS_HOSTS.includes(url.hostname)
  && (url.pathname === CPS_WELL_KNOWN
    || url.pathname.startsWith(`${CPS_WELL_KNOWN}/`)
    || url.pathname.startsWith(CPS_UPLOAD_PREFIX));

/**
 * The path key of a page, as the publisher writes it: no .html, no trailing
 * slash, /index for the home page.
 */
export const pagePathKey = (pathname) => {
  const p = `/${String(pathname || '').replace(/^\/+/, '')}`
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
    .replace(/(.)\/$/, '$1');
  return p || '/';
};

/** The R2 object name holding one page's entry. */
export const pageObjectName = (pathname) => {
  const key = pagePathKey(pathname);
  return `pages${key === '/' ? '/index' : key}.json`;
};

const readJson = async (bucket, name) => {
  const obj = await bucket.get(name);
  if (!obj) return null;
  try {
    return JSON.parse(await obj.text());
  } catch {
    return null;
  }
};

/** The URL of listing page n, always with ?page=n as the reference does. */
export const listingPageUrl = (siteUrl, n) => `${trimSlash(siteUrl)}${CPS_WELL_KNOWN}?page=${n}`;

/** An RFC 8288 Link header naming first, prev, next and last. */
export const listingLinkHeader = (siteUrl, page, lastPage) => {
  const links = [`<${listingPageUrl(siteUrl, 1)}>; rel="first"`];
  if (page > 1) links.push(`<${listingPageUrl(siteUrl, page - 1)}>; rel="prev"`);
  if (page < lastPage) links.push(`<${listingPageUrl(siteUrl, page + 1)}>; rel="next"`);
  links.push(`<${listingPageUrl(siteUrl, lastPage)}>; rel="last"`);
  return links.join(', ');
};

/**
 * One page of the listing (CPS Section 3.4), or null when the page number is
 * out of range. The site claims the lowest level among its Documents.
 */
export const buildListingPage = (site, entries, page, pageSize = CPS_PAGE_SIZE) => {
  const lastPage = Math.max(1, Math.ceil(entries.length / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > lastPage) return null;
  const levels = entries.map((e) => e.cpsConformance).filter(Number.isInteger);
  return {
    lastPage,
    body: {
      '@context': [...CPS_CONTEXT],
      specVersion: CPS_SPEC_VERSION,
      generator: site.generator,
      cpsConformance: levels.length ? Math.min(...levels) : 1,
      site: { url: `${trimSlash(site.siteUrl)}/`, keys: `${trimSlash(site.siteUrl)}${CPS_WELL_KNOWN}/keys` },
      totalItems: entries.length,
      page,
      pageSize,
      documents: entries.slice((page - 1) * pageSize, page * pageSize),
    },
  };
};

const handleRead = async (request, env, url) => {
  const bucket = env.CONTENT_PROVENANCE_R2;
  const cache = { 'cache-control': 'public, max-age=300' };
  const rest = url.pathname.slice(CPS_WELL_KNOWN.length);

  if (rest === '' || rest === '/') {
    // Without the bucket, site.json or documents.json the listing is valid
    // and empty (totalItems 0), never a 404.
    const stored = bucket ? await readJson(bucket, 'site.json') : null;
    const site = stored && stored.siteUrl && stored.generator ? stored : CPS_DEFAULT_SITE;
    const listed = bucket ? await readJson(bucket, 'documents.json') : null;
    const entries = Array.isArray(listed) ? listed : [];
    const raw = url.searchParams.get('page');
    const page = raw === null ? 1 : (/^[0-9]+$/.test(raw) ? Number(raw) : NaN);
    const built = buildListingPage(site, entries, page);
    if (!built) return jsonResponse(404, { error: 'page out of range' }, cache);
    return jsonResponse(200, built.body, { ...cache, link: listingLinkHeader(site.siteUrl, page, built.lastPage) });
  }

  if (rest === '/keys') {
    const keys = bucket ? await readJson(bucket, 'keys.json') : null;
    return jsonResponse(200, keys && Array.isArray(keys.keys) ? keys : { keys: [] }, cache);
  }

  if (rest.startsWith('/keys/')) {
    let keyId;
    try {
      keyId = decodeURIComponent(rest.slice('/keys/'.length));
    } catch {
      return jsonResponse(404, { error: 'unknown key' });
    }
    const keys = bucket ? await readJson(bucket, 'keys.json') : null;
    const entry = keys && Array.isArray(keys.keys) ? keys.keys.find((k) => k.keyId === keyId) : null;
    if (!entry) return jsonResponse(404, { error: 'unknown key' });
    return jsonResponse(200, entry, cache);
  }

  if (rest.startsWith('/facts/')) {
    const id = rest.slice('/facts/'.length);
    const annotation = bucket && /^[A-Za-z0-9._~-]+$/.test(id) ? await readJson(bucket, `facts/${id}.json`) : null;
    if (!annotation) return jsonResponse(404, { error: 'unknown fact' });
    return jsonResponse(200, annotation, { ...cache, 'content-type': ANNOTATION_CONTENT_TYPE });
  }

  return jsonResponse(404, { error: 'not found' });
};

const handleUpload = async (request, env, url, method) => {
  const name = url.pathname.slice(CPS_UPLOAD_PREFIX.length);
  if (!OBJECT_NAME.test(name)) return jsonResponse(400, { error: 'invalid object name' });
  if (!env.CONTENT_PROVENANCE_R2) return jsonResponse(503, { error: 'content provenance store is not configured' });
  const body = new Uint8Array(await request.arrayBuffer());
  if (method === 'PUT' && body.length > CPS_MAX_UPLOAD_BYTES) {
    return jsonResponse(413, { error: `body exceeds ${CPS_MAX_UPLOAD_BYTES} bytes` });
  }
  if (method === 'DELETE' && body.length > 0) return jsonResponse(400, { error: 'DELETE takes an empty body' });
  const headers = {};
  request.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
  const verdict = await verifyPublicCogRequest(
    { method, path: url.pathname, headers, body },
    { PUBLIC_COG_KEY_ID: env.CPS_PUBLISHER_KEY_ID, PUBLIC_COG_PUBLIC_KEY: env.CPS_PUBLISHER_PUBLIC_KEY },
  );
  if (!verdict.ok) {
    if (verdict.misconfigured) return jsonResponse(503, { error: verdict.reason });
    return jsonResponse(401, { error: 'unauthorised', reason: verdict.reason });
  }
  if (method === 'DELETE') {
    await env.CONTENT_PROVENANCE_R2.delete(name);
    return jsonResponse(200, { object: name, deleted: true });
  }
  try {
    JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body));
  } catch {
    return jsonResponse(400, { error: 'body is not UTF-8 JSON' });
  }
  await env.CONTENT_PROVENANCE_R2.put(name, body, {
    httpMetadata: { contentType: JSON_TYPE },
    customMetadata: { signedAt: verdict.signedAt },
  });
  return jsonResponse(201, { object: name });
};

/**
 * Handle a request under /.well-known/content-provenance or the upload
 * prefix. Never falls through to other routing.
 */
export const handleContentProvenanceRequest = async (request, env, url = new URL(request.url)) => {
  const method = request.method.toUpperCase();
  const upload = url.pathname.startsWith(CPS_UPLOAD_PREFIX);
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: upload
        ? {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, content-digest, signature, signature-input, mx-signed-at',
          'access-control-max-age': '86400',
        }
        : { ...READ_CORS, 'access-control-max-age': '86400' },
    });
  }
  if (upload) {
    if (method !== 'PUT' && method !== 'DELETE') {
      return jsonResponse(405, { error: 'method not allowed' }, { allow: 'PUT, DELETE, OPTIONS' });
    }
    return handleUpload(request, env, url, method);
  }
  if (method !== 'GET' && method !== 'HEAD') {
    return jsonResponse(405, { error: 'method not allowed' }, { allow: 'GET, HEAD, OPTIONS' });
  }
  const resp = await handleRead(request, env, url);
  return method === 'HEAD' ? new Response(null, { status: resp.status, headers: resp.headers }) : resp;
};

/** The page entry for a pathname, or null when there is none or no store. */
export const loadPageEntry = async (env, pathname) => {
  if (!env.CONTENT_PROVENANCE_R2) return null;
  return readJson(env.CONTENT_PROVENANCE_R2, pageObjectName(pathname));
};

/**
 * The entry applies only to the bytes it was signed over: when the origin's
 * Last-Modified differs from the one the publisher saw, the page has changed
 * since signing and the worker serves it without a Record (fail closed).
 */
export const entryIsFresh = (entry, originLastModified) => {
  if (!entry || !entry.sourceLastModified) return false;
  const a = Date.parse(entry.sourceLastModified);
  const b = Date.parse(originLastModified || '');
  return !Number.isNaN(a) && a === b;
};

const TEXT_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

/**
 * The spellings a Fact's text may have in served HTML: the publisher's
 * escaping, and the hexadecimal reference EDS writes for an ampersand.
 */
const needlesFor = (text) => {
  const plain = String(text).replace(/[&<>]/g, (c) => TEXT_ESCAPES[c]);
  const eds = String(text).replace(/&/g, '&#x26;').replace(/</g, '&#x3C;').replace(/>/g, '&#x3E;');
  return plain === eds ? [plain] : [plain, eds];
};

/** True when offset i of html sits in text content, not in a tag, script, style, template or comment. */
const inText = (html, i) => {
  const lt = html.lastIndexOf('<', i);
  const gt = html.lastIndexOf('>', i);
  if (lt > gt) return false;
  const before = html.slice(0, i).toLowerCase();
  for (const raw of ['script', 'style', 'template']) {
    if (before.lastIndexOf(`<${raw}`) > before.lastIndexOf(`</${raw}`)) return false;
  }
  return before.lastIndexOf('<!--') <= before.lastIndexOf('-->');
};

/**
 * Wrap the first occurrence in body text of each Fact (CPS Section 3.3). The
 * wrapper adds no text, so the canonical text and the contentHash hold.
 */
export const wrapFactSpans = (html, facts) => {
  let out = html;
  const bodyAt = Math.max(0, out.search(/<body[\s>]/i));
  for (const fact of facts || []) {
    if (!fact || !fact.id || out.includes(`id="fact-${fact.id}"`)) continue;
    for (const needle of needlesFor(fact.text)) {
      let at = out.indexOf(needle, bodyAt);
      while (at >= 0 && !inText(out, at)) at = out.indexOf(needle, at + 1);
      if (at >= 0) {
        const span = `<span id="fact-${fact.id}" class="cps-fact" itemscope itemtype="https://schema.org/Claim"><span itemprop="text">${needle}</span></span>`;
        out = out.slice(0, at) + span + out.slice(at + needle.length);
        break;
      }
    }
  }
  return out;
};

/**
 * Apply a fresh page entry to served HTML: the Record and MX metadata into the
 * head, the Fact spans into the body. Anything else returns html unchanged.
 */
export const applyContentProvenance = (html, entry, originLastModified) => {
  if (!entryIsFresh(entry, originLastModified) || typeof entry.headHtml !== 'string') return html;
  const close = html.search(/<\/head\s*>/i);
  if (close < 0) return html;
  const withHead = `${html.slice(0, close)}${entry.headHtml}\n${html.slice(close)}`;
  return wrapFactSpans(withHead, entry.facts);
};

/**
 * Prepend the Markdown alternate's frontmatter, which points back to the
 * signed Record. A body that already opens with frontmatter is left alone.
 */
export const applyMarkdownFrontmatter = (markdown, entry, originLastModified) => {
  if (!entryIsFresh(entry, originLastModified) || typeof entry.frontmatter !== 'string') return markdown;
  if (/^---\r?\n/.test(markdown)) return markdown;
  return `${entry.frontmatter}\n${markdown}`;
};
