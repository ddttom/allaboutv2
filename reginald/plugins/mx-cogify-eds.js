/**
 * MX Cogify Block — EDS
 *
 * Drop this block into your EDS project's /blocks/ folder.
 * It self-executes on every page — no delayed.js edit needed.
 *
 * It reads existing page metadata and injects:
 * - MX carrier tags (mx:status, mx:contentType, mx:content-policy, etc.)
 * - Schema.org JSON-LD
 * - llms.txt discovery link
 *
 * Usage:
 *   1. Copy blocks/mx-cogify/ into your EDS project
 *   2. That's it — the block auto-runs on every page
 *
 * @mx:status draft
 * @mx:contentType script
 * @mx:tags eds, block, cogification, schema-org, mx-metadata
 */

function getMeta(name) {
  const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return el ? el.content : '';
}

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (el) {
    el.content = content;
  } else {
    el = document.createElement('meta');
    el.name = name;
    el.content = content;
    document.head.appendChild(el);
  }
}

/**
 * Inject MX carrier tags if not already present.
 */
function injectMXTags() {
  const defaults = {
    'mx:status': 'active',
    'mx:content-policy': 'extract-with-attribution',
    'mx:audience': 'humans',
  };

  Object.entries(defaults).forEach(([name, fallback]) => {
    if (!getMeta(name)) {
      setMeta(name, fallback);
    }
  });
}

/**
 * Inject llms.txt discovery link if not already present.
 */
function injectDiscovery() {
  if (!document.querySelector('link[rel="llms-txt"]')) {
    const link = document.createElement('link');
    link.rel = 'llms-txt';
    link.href = '/llms.txt';
    document.head.appendChild(link);
  }
}

/**
 * Map mx:contentType to Schema.org @type.
 */
function schemaType(contentType) {
  const map = {
    'blog-post': 'BlogPosting',
    article: 'TechArticle',
    product: 'Product',
    guide: 'HowTo',
    report: 'Report',
    reference: 'WebPage',
    'landing-page': 'WebPage',
  };
  return map[contentType] || 'WebPage';
}

/**
 * Generate and inject Schema.org JSON-LD from page metadata.
 */
function injectSchema() {
  if (document.querySelector('script[type="application/ld+json"]')) return;

  const contentType = getMeta('mx:contentType');
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType(contentType),
    headline: document.title.split(' | ')[0] || document.title,
    description: getMeta('description'),
    url: window.location.href,
    inLanguage: document.documentElement.lang || 'en-GB',
    dateModified: getMeta('article:modified_time')
      || getMeta('modified')
      || new Date().toISOString().split('T')[0],
  };

  const author = getMeta('author');
  if (author) {
    schema.author = { '@type': 'Person', name: author };
  }

  const siteName = getMeta('og:site_name');
  if (siteName) {
    schema.publisher = { '@type': 'Organization', name: siteName };
  }

  const image = getMeta('og:image');
  if (image) {
    schema.image = image;
  }

  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(schema);
  document.head.appendChild(el);
}

/**
 * Run MX injection. Waits for EDS to finish injecting metadata
 * from spreadsheets before reading it.
 */
function cogify() {
  injectMXTags();
  injectDiscovery();
  injectSchema();
}

/**
 * Decorate block (if an author adds an "MX Cogify" table to a page).
 * Shows MX status indicator for content editors.
 */
export default function decorate(block) {
  cogify();

  if (!block || !block.classList) return;

  const status = getMeta('mx:status') || 'active';
  const contentType = getMeta('mx:contentType') || 'page';
  const policy = getMeta('mx:content-policy') || 'extract-with-attribution';

  block.innerHTML = `
    <div class="mx-cogify-status">
      <p><strong>MX Cogify</strong></p>
      <ul>
        <li>Status: <code>${status}</code></li>
        <li>Type: <code>${contentType}</code></li>
        <li>Policy: <code>${policy}</code></li>
        <li>Schema: <code>${schemaType(contentType)}</code></li>
      </ul>
    </div>
  `;
}

/**
 * Auto-run on every page after EDS has finished loading metadata.
 * Uses requestIdleCallback to wait for EDS decoration pipeline,
 * falls back to a short delay for older browsers.
 */
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cogify);
  } else {
    window.setTimeout(cogify, 1000);
  }
}
