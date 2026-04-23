/**
 * @file test-markdown-for-agents.js
 * @description Live probe: verify Cloudflare Markdown for Agents on allabout.network.
 *   Fetches /llms.txt twice — once as a browser (no Accept header) and once as an
 *   AI agent (Accept: text/markdown) — and asserts the expected behaviour for each.
 *
 * Run with: npm run test:live
 *
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags test, cloudflare, markdown-for-agents
 * @mx:partOf mx-os
 */

const BASE_URL = 'https://allabout.network';
const PATH = '/llms.txt';
const SNIPPET_CHARS = 300;

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓  ${label}`);
    passed += 1;
  } else {
    console.error(`  ✗  ${label}${detail ? `\n       ${detail}` : ''}`);
    failed += 1;
  }
}

function printHeaders(headers) {
  const interesting = [
    'content-type',
    'vary',
    'x-markdown-tokens',
    'content-signal',
    'cf-cache-status',
    'cfw',
  ];
  for (const key of interesting) {
    const val = headers.get(key);
    if (val) console.log(`       ${key}: ${val}`);
  }
}

async function fetchProbe(label, url, headers = {}) {
  console.log(`\n── ${label}`);
  console.log(`   GET ${url}`);
  if (Object.keys(headers).length) {
    for (const [k, v] of Object.entries(headers)) {
      console.log(`   ${k}: ${v}`);
    }
  }

  const res = await fetch(url, { headers });
  const body = await res.text();

  console.log(`\n   Response status : ${res.status}`);
  console.log('   Response headers:');
  printHeaders(res.headers);
  console.log(`\n   Body snippet (first ${SNIPPET_CHARS} chars):`);
  console.log('   ' + body.slice(0, SNIPPET_CHARS).replace(/\n/g, '\n   '));

  return { res, body };
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Markdown for Agents — live probe');
  console.log(`  Target: ${BASE_URL}${PATH}`);
  console.log('═══════════════════════════════════════════════════════════');

  // ── Test 1: Browser request (no Accept header) ───────────────────────────
  // The Worker wraps llms.txt in an HTML document for Common Crawl ingestion.
  // A plain request should receive text/html with the <pre class="llms-txt"> wrapper.
  const { res: htmlRes, body: htmlBody } = await fetchProbe(
    'Browser request (no Accept header)',
    `${BASE_URL}${PATH}`,
  );

  console.log('\n   Assertions:');
  assert(
    'status 200',
    htmlRes.status === 200,
    `got ${htmlRes.status}`,
  );
  assert(
    'Content-Type is text/html',
    (htmlRes.headers.get('content-type') || '').includes('text/html'),
    `got "${htmlRes.headers.get('content-type')}"`,
  );
  assert(
    'body is HTML (contains <html)',
    htmlBody.includes('<html'),
    'expected <html> tag in body',
  );
  assert(
    'Worker llms.txt wrapper present (<pre class="llms-txt">)',
    htmlBody.includes('llms-txt'),
    'expected Worker HTML wrapper; wrapLlmsTxtAsHtml did not run',
  );
  assert(
    'content-type header is NOT text/markdown (no conversion on browser request)',
    !(htmlRes.headers.get('content-type') || '').includes('text/markdown'),
    'unexpected markdown conversion on browser request',
  );

  // ── Test 2: AI agent request (Accept: text/markdown) ─────────────────────
  // The Worker's pass-through guard fires before wrapLlmsTxtAsHtml, so the
  // origin's raw llms.txt text is returned directly.  Cloudflare's Markdown for
  // Agents converter operates on text/html; since the origin returns text/plain
  // the converter does not re-encode the body — the agent receives the raw
  // llms.txt content, which is already clean plain text.
  // Either text/plain or text/markdown in Content-Type is acceptable here.
  const { res: mdRes, body: mdBody } = await fetchProbe(
    'AI agent request (Accept: text/markdown)',
    `${BASE_URL}${PATH}`,
    { Accept: 'text/markdown' },
  );

  console.log('\n   Assertions:');
  assert(
    'status 200',
    mdRes.status === 200,
    `got ${mdRes.status}`,
  );
  assert(
    'body does NOT contain HTML wrapper — pass-through guard fired',
    !mdBody.includes('<pre class="llms-txt">'),
    'Worker HTML wrapper found; pass-through guard did not fire',
  );
  assert(
    'body does NOT start with <html — raw content returned',
    !mdBody.trimStart().startsWith('<html'),
    'full HTML document returned; expected raw llms.txt text',
  );
  assert(
    'body contains llms.txt content (has https:// links)',
    mdBody.includes('https://'),
    'expected llms.txt link content in body',
  );
  const mdContentType = mdRes.headers.get('content-type') || '';
  assert(
    'Content-Type is text/plain or text/markdown (raw or CF-converted)',
    mdContentType.includes('text/plain') || mdContentType.includes('text/markdown'),
    `got "${mdContentType}"`,
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  const total = passed + failed;
  console.log(`  Result: ${passed}/${total} passed${failed ? ` — ${failed} FAILED` : ' — all good'}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('\nFatal error running live probe:', err.message);
  process.exit(1);
});
