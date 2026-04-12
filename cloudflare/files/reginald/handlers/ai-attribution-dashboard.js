/**
 * AI Attribution dashboard — read-only HTML/CSS/JS served directly from the
 * worker at reginald.allabout.network/admin/ai-attribution. Three assets:
 *
 *   GET /admin/ai-attribution        → HTML shell
 *   GET /admin/ai-attribution.css    → styles
 *   GET /admin/ai-attribution.js     → client (fetches /api/v1/ai-attribution)
 *
 * All three live as template literals in this file so there's no bundler
 * config required. Keep the three blocks edit-friendly; they're small.
 *
 * @file reginald/handlers/ai-attribution-dashboard.js
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 * @mx:tags api, ai-attribution, dashboard, admin
 */

const HTML = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="Reginald AI Attribution dashboard — visualise AI crawler and AI-referred traffic captured by the Cloudflare worker.">
  <meta name="author" content="Tom Cranstoun">
  <meta name="mx:status" content="active">
  <meta name="mx:contentType" content="dashboard">
  <title>Reginald — AI Attribution</title>
  <link rel="stylesheet" href="/admin/ai-attribution.css">
</head>
<body>
  <header class="page-header">
    <h1>AI Attribution</h1>
    <p class="lede">Live counts of AI crawlers and AI-referred human visits, captured by the worker.</p>
  </header>
  <main class="dashboard">
    <section class="controls">
      <label for="host">Host</label>
      <select id="host">
        <option value="allabout.network">allabout.network</option>
        <option value="mx.allabout.network">mx.allabout.network</option>
        <option value="content.allabout.network">content.allabout.network</option>
        <option value="reginald.allabout.network">reginald.allabout.network</option>
        <option value="cognovamx.com">cognovamx.com</option>
      </select>
      <label for="window">Window</label>
      <select id="window">
        <option value="1">last 24 hours</option>
        <option value="7">last 7 days</option>
        <option value="30" selected>last 30 days</option>
        <option value="90">last 90 days</option>
      </select>
      <label for="groupBy">Group by</label>
      <select id="groupBy">
        <option value="agent_key" selected>agent</option>
        <option value="event_type">event type</option>
        <option value="path">path</option>
        <option value="day">day</option>
      </select>
      <button type="button" id="refresh">Refresh</button>
    </section>
    <section class="totals" aria-live="polite">
      <article class="stat"><h2>Total</h2><p class="stat-value" id="total">—</p></article>
      <article class="stat"><h2>Crawlers</h2><p class="stat-value" id="crawlers">—</p></article>
      <article class="stat"><h2>Referrals</h2><p class="stat-value" id="referrals">—</p></article>
    </section>
    <section class="buckets">
      <h2>Breakdown</h2>
      <table id="buckets-table">
        <thead><tr><th>Bucket</th><th>Event type</th><th>Count</th></tr></thead>
        <tbody id="buckets-body"><tr><td colspan="3" class="placeholder">No data yet.</td></tr></tbody>
      </table>
    </section>
    <p class="status" id="status" aria-live="polite"></p>
  </main>
  <footer class="page-footer">
    <p>Data: <code>/api/v1/ai-attribution</code>. Capture runs in the Cloudflare worker.</p>
  </footer>
  <script src="/admin/ai-attribution.js" type="module"></script>
</body>
</html>`;

const CSS = `:root {
  --color-bg: #fafafa;
  --color-fg: #111;
  --color-muted: #666;
  --color-accent: #035fe6;
  --color-border: #e5e5e5;
  --color-surface: #fff;
  --spacing: 1rem;
  --radius: 0.5rem;
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
* { box-sizing: border-box; }
body { margin: 0; padding: 0; font-family: var(--font-sans); color: var(--color-fg); background: var(--color-bg); line-height: 1.5; }
.page-header, .page-footer { max-width: 960px; margin: 0 auto; padding: calc(var(--spacing) * 1.5) var(--spacing); }
.page-header h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
.lede { margin: 0; color: var(--color-muted); }
.dashboard { max-width: 960px; margin: 0 auto; padding: 0 var(--spacing) var(--spacing); display: grid; gap: calc(var(--spacing) * 1.5); }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; padding: var(--spacing); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
.controls label { font-weight: 600; font-size: 0.9rem; }
.controls select, .controls button { font-family: inherit; font-size: 0.95rem; padding: 0.4rem 0.75rem; border: 1px solid var(--color-border); border-radius: calc(var(--radius) / 2); background: var(--color-surface); color: var(--color-fg); }
.controls button { background: var(--color-accent); color: #fff; border-color: var(--color-accent); cursor: pointer; }
.controls button:hover { filter: brightness(0.95); }
.totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing); }
.stat { padding: var(--spacing); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); text-align: center; }
.stat h2 { margin: 0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
.stat-value { margin: 0.5rem 0 0; font-family: var(--font-mono); font-size: 2rem; font-weight: 700; }
.buckets { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--spacing); }
.buckets h2 { margin: 0 0 0.75rem; font-size: 1.1rem; }
.buckets table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.buckets th, .buckets td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: left; }
.buckets th { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
.buckets td:last-child, .buckets th:last-child { text-align: right; font-family: var(--font-mono); }
.placeholder { color: var(--color-muted); font-style: italic; text-align: center; }
.status { min-height: 1.5em; margin: 0; font-size: 0.9rem; color: var(--color-muted); }
.page-footer { border-top: 1px solid var(--color-border); color: var(--color-muted); font-size: 0.85rem; }
code { font-family: var(--font-mono); background: var(--color-surface); padding: 0.1em 0.35em; border-radius: calc(var(--radius) / 2); border: 1px solid var(--color-border); }
@media (max-width: 600px) { .totals { grid-template-columns: 1fr; } }`;

const JS = `const CONFIG = {
  API_BASE: '/api/v1/ai-attribution',
  DEFAULT_WINDOW_DAYS: 30,
  MESSAGES: {
    LOADING: 'Loading…',
    EMPTY: 'No AI visits in this window yet. Capture starts at deploy time.',
    ERROR: 'Could not load data.',
    NOT_INSTRUMENTED: 'This host is not yet instrumented for AI attribution capture.',
  },
};
const els = {
  host: document.getElementById('host'),
  window: document.getElementById('window'),
  groupBy: document.getElementById('groupBy'),
  refresh: document.getElementById('refresh'),
  total: document.getElementById('total'),
  crawlers: document.getElementById('crawlers'),
  referrals: document.getElementById('referrals'),
  bucketsBody: document.getElementById('buckets-body'),
  status: document.getElementById('status'),
};
function formatNumber(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-GB');
}
function renderBuckets(buckets, groupBy) {
  els.bucketsBody.replaceChildren();
  if (!buckets || buckets.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.classList.add('placeholder');
    td.textContent = CONFIG.MESSAGES.EMPTY;
    tr.appendChild(td);
    els.bucketsBody.appendChild(tr);
    return;
  }
  const labelKey = groupBy === 'day' ? 'day' : groupBy;
  for (const row of buckets) {
    const tr = document.createElement('tr');
    const tdBucket = document.createElement('td');
    tdBucket.textContent = row[labelKey] ?? '—';
    const tdEvent = document.createElement('td');
    tdEvent.textContent = row.event_type ?? '—';
    const tdCount = document.createElement('td');
    tdCount.textContent = formatNumber(row.count);
    tr.append(tdBucket, tdEvent, tdCount);
    els.bucketsBody.appendChild(tr);
  }
}
function resetCounts() {
  els.total.textContent = '—';
  els.crawlers.textContent = '—';
  els.referrals.textContent = '—';
}
async function loadData() {
  resetCounts();
  els.status.textContent = CONFIG.MESSAGES.LOADING;
  const host = els.host.value;
  const windowDays = Number(els.window.value) || CONFIG.DEFAULT_WINDOW_DAYS;
  const groupBy = els.groupBy.value;
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({ host, since, group_by: groupBy });
  const url = CONFIG.API_BASE + '?' + params;
  try {
    const resp = await fetch(url, { headers: { Accept: 'application/json' } });
    if (resp.status === 404) {
      els.status.textContent = CONFIG.MESSAGES.NOT_INSTRUMENTED;
      renderBuckets([], groupBy);
      return;
    }
    if (!resp.ok) {
      els.status.textContent = CONFIG.MESSAGES.ERROR + ' (HTTP ' + resp.status + ')';
      renderBuckets([], groupBy);
      return;
    }
    const data = await resp.json();
    els.total.textContent = formatNumber(data?.totals?.total ?? 0);
    els.crawlers.textContent = formatNumber(data?.totals?.crawler ?? 0);
    els.referrals.textContent = formatNumber(data?.totals?.referral ?? 0);
    renderBuckets(data?.buckets || [], groupBy);
    els.status.textContent = 'Showing ' + host + ' since ' + new Date(since).toLocaleString('en-GB') + '.';
  } catch (err) {
    els.status.textContent = CONFIG.MESSAGES.ERROR + ' ' + err.message;
    renderBuckets([], groupBy);
  }
}
els.refresh.addEventListener('click', loadData);
els.host.addEventListener('change', loadData);
els.window.addEventListener('change', loadData);
els.groupBy.addEventListener('change', loadData);
loadData();`;

const assetResponse = (body, contentType) => new Response(body, {
    status: 200,
    headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
    },
});

/**
 * Route handler for /admin/ai-attribution[.css|.js].
 * @param {Request} request
 * @param {URL} url
 * @returns {Response|null}
 */
export function handleAiAttributionDashboard(request, url) {
    if (request.method !== 'GET') return null;
    const p = url.pathname;
    if (p === '/admin/ai-attribution' || p === '/admin/ai-attribution/') {
        return assetResponse(HTML, 'text/html; charset=utf-8');
    }
    if (p === '/admin/ai-attribution.css') {
        return assetResponse(CSS, 'text/css; charset=utf-8');
    }
    if (p === '/admin/ai-attribution.js') {
        return assetResponse(JS, 'application/javascript; charset=utf-8');
    }
    return null;
}
