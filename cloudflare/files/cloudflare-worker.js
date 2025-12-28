/*
 * Based on Adobe's Cloudflare Worker template
 * Original copyright 2022 Adobe. Licensed under Apache License, Version 2.0
 * Modified by Digital Domain Technologies Ltd
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @version 1.1.5
 */

// Worker version - hardcoded for compatibility
// Update this when package.json version changes
export const WORKER_VERSION = '1.1.5';

// Picture placeholder configuration
export const PICTURE_PLACEHOLDER_CONFIG = {
  TRIGGER_TEXT: 'Picture Here',
  IMAGE_URL: 'https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png',
  IMAGE_ALT: 'Author: Tom Cranstoun',
};

export const getExtension = (path) => {
  const basename = path.split('/').pop();
  const pos = basename.lastIndexOf('.');
  return (basename === '' || pos < 1) ? '' : basename.slice(pos + 1);
};

export const isMediaRequest = (url) => (
  /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/.test(url.pathname)
);

export const isRUMRequest = (url) => /\/\.(rum|optel)\/.*/.test(url.pathname);

/**
 * Converts 2-digit year to 4-digit year using century inference
 * Years 00-49 -> 2000-2049, Years 50-99 -> 1950-1999
 * @param {number} year - 2 or 4-digit year
 * @returns {number} 4-digit year
 */
export const normalizeYear = (year) => {
  if (year >= 100) return year; // Already 4-digit
  if (year <= 49) return 2000 + year; // 00-49 -> 2000-2049
  return 1900 + year; // 50-99 -> 1950-1999
};

/**
 * Formats a date string to ISO 8601 format (YYYY-MM-DD)
 * Handles UK date format (dd/mm/yyyy or dd/mm/yy) as default and month names (Dec, December)
 * Supports both 2-digit and 4-digit years with century inference
 * @param {string} dateString - Date string in various formats
 * @returns {string|null} ISO 8601 formatted date or null if invalid
 */
export const formatISO8601Date = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;

  const trimmed = dateString.trim();
  if (!trimmed) return null;

  // If already ISO 8601 format (YYYY-MM-DD), return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Month name mapping (full and abbreviated)
  const months = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    sept: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };

  let day;
  let month;
  let year;

  // Try to parse dates with month names first
  // Patterns: "10 December 2024", "December 10, 2024", "10 Dec 25", "12/dec/25"
  // eslint-disable-next-line max-len
  const monthNamePattern = /(\d{1,2})[\s/-]*([a-zA-Z]+)[\s,/-]*(\d{2,4})|([a-zA-Z]+)[\s/-]*(\d{1,2})[\s,/-]*(\d{2,4})/i;
  const monthMatch = trimmed.match(monthNamePattern);

  if (monthMatch) {
    if (monthMatch[1]) {
      // Pattern: day month year (10 December 2024, 10-Dec-2024, 10 Dec 25, 12/dec/25)
      day = parseInt(monthMatch[1], 10);
      month = months[monthMatch[2].toLowerCase()];
      year = normalizeYear(parseInt(monthMatch[3], 10));
    } else {
      // Pattern: month day year (December 10 2024, Dec 10 2024, Dec 10 25, dec/10/25)
      month = months[monthMatch[4].toLowerCase()];
      day = parseInt(monthMatch[5], 10);
      year = normalizeYear(parseInt(monthMatch[6], 10));
    }
  } else {
    // Try numeric format: assume UK format (dd/mm/yyyy or dd/mm/yy) by default
    const numericPattern = /(\d{1,2})[/\s-](\d{1,2})[/\s-](\d{2,4})/;
    const numericMatch = trimmed.match(numericPattern);

    if (numericMatch) {
      // UK format: day/month/year (supports 2 or 4-digit year)
      day = parseInt(numericMatch[1], 10);
      month = parseInt(numericMatch[2], 10) - 1; // Convert to 0-indexed
      year = normalizeYear(parseInt(numericMatch[3], 10));
    } else {
      // Unable to parse
      return null;
    }
  }

  // Validate parsed values
  if (month === undefined || month < 0 || month > 11) return null;
  if (!day || day < 1 || day > 31) return null;
  if (!year || year < 1950 || year > 2049) return null;

  // Create date object and validate it's a real date
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  // Format as ISO 8601 (YYYY-MM-DD)
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Builds JSON-LD object from article metadata
 * @param {Object} article - Article metadata
 * @param {string} hostname - Publisher hostname
 * @returns {Object} JSON-LD object
 */
export const buildJsonLd = (article, hostname) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
  };

  // Only add fields that have values
  if (article.description) jsonLd.description = article.description;
  if (article.url) jsonLd.url = article.url;

  // Format dates to ISO 8601 before adding
  const formattedPublishDate = formatISO8601Date(article.publishDate);
  if (formattedPublishDate) jsonLd.datePublished = formattedPublishDate;

  const formattedModifiedDate = formatISO8601Date(article.modifiedDate);
  if (formattedModifiedDate) jsonLd.dateModified = formattedModifiedDate;

  if (article.author) {
    jsonLd.author = {
      '@type': 'Person',
      name: article.author,
    };
    // Add author URL if available
    if (article.authorUrl) {
      jsonLd.author.url = article.authorUrl;
    }
  }

  if (article.image) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: article.image,
    };
    if (article.imageAlt) {
      jsonLd.image.caption = article.imageAlt;
    }
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: hostname,
  };

  return jsonLd;
};

/**
 * Replaces picture placeholder pattern in HTML content
 * Detects <div><div>Picture Here</div></div> and replaces with author image
 * Pure string replacement - fully testable without Cloudflare Workers runtime
 * @param {string} html - HTML content to process
 * @returns {string} Processed HTML with placeholders replaced
 */
export const replacePicturePlaceholder = (html) => {
  // Build replacement: just the img tag (preserves outer div)
  const replacement = `<img src="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL}" `
    + `alt="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT}">`;

  // Case-insensitive comparison using trigger text from config
  // Escape special regex characters in trigger text
  const escapedTrigger = PICTURE_PLACEHOLDER_CONFIG.TRIGGER_TEXT
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Pattern matches only the inner div content, preserves outer div structure
  const pattern = new RegExp(
    `<div>([^<]*${escapedTrigger}[^<]*)</div>`,
    'gi',
  );
  return html.replace(pattern, replacement);
};

/**
 * Removes all HTML comments from content
 * Pure string replacement - fully testable without Cloudflare Workers runtime
 * @param {string} html - HTML content to process
 * @returns {string} Processed HTML with comments removed
 */
export const removeHtmlComments = (html) => (
  // Regex pattern: <!-- followed by any characters (non-greedy), then -->
  html.replace(/<!--[\s\S]*?-->/g, '')
);

/**
 * Removes non-social metadata tags from HTML
 * Keeps author and linkedin meta tags for social sharing
 * Removes: author-url, publication-date, modified-date, longdescription, jsonld
 * Pure string replacement - fully testable without Cloudflare Workers runtime
 * @param {string} html - HTML content to process
 * @returns {string} Processed HTML with non-social metadata removed
 */
export const removeNonSocialMetadata = (html) => {
  // List of meta tag names to remove (keeps author and linkedin)
  const tagsToRemove = [
    'author-url',
    'publication-date',
    'published-date',
    'modified-date',
    'last-modified',
    'longdescription',
    'jsonld',
  ];

  let result = html;

  // Remove each non-social meta tag
  tagsToRemove.forEach((tagName) => {
    // Match meta tag with name="tagName" and any attributes
    // Pattern: <meta name="tagName"...> including multiline
    const pattern = new RegExp(`\\s*<meta\\s+name="${tagName}"[^>]*>\\s*`, 'gi');
    result = result.replace(pattern, '');
  });

  return result;
};

/**
 * Extracts meta tag content using regex
 * @param {string} html - HTML content
 * @param {string} selector - Meta tag selector (e.g., 'name="jsonld"', 'property="og:title"')
 * @returns {string|null} Content attribute value or null
 */
export const extractMetaContent = (html, selector) => {
  // Build regex pattern for meta tag with the given selector
  const pattern = new RegExp(`<meta\\s+${selector}\\s+content="([^"]*)"`, 'i');
  const match = html.match(pattern);
  return match ? match[1] : null;
};

/**
 * Checks if JSON-LD generation should be triggered
 * Looks for meta tag or error script that indicates JSON-LD is needed
 * @param {string} html - HTML content
 * @returns {boolean} True if JSON-LD should be generated
 */
export const shouldGenerateJsonLd = (html) => {
  // Check for meta tag trigger
  if (html.includes('<meta name="jsonld"') && html.includes('content="article"')) {
    return true;
  }
  // Check for error script trigger (authoring error workaround)
  if (html.includes('type="application/ld+json"') && html.includes('data-error')) {
    return true;
  }
  return false;
};

/**
 * Injects JSON-LD structured data into HTML
 * Pure string function - parses meta tags with regex and injects JSON-LD script
 * Fully testable without Cloudflare Workers runtime
 * @param {string} html - HTML content to process
 * @param {string} hostname - Publisher hostname for JSON-LD
 * @returns {string} Processed HTML with JSON-LD injected
 */
export const injectJsonLd = (html, hostname) => {
  // Check if JSON-LD generation is triggered
  if (!shouldGenerateJsonLd(html)) {
    return html;
  }

  // Extract article metadata from meta tags using regex
  const article = {
    title: extractMetaContent(html, 'property="og:title"'),
    description: extractMetaContent(html, 'property="og:description"')
      || extractMetaContent(html, 'name="description"')
      || extractMetaContent(html, 'name="longdescription"'),
    url: extractMetaContent(html, 'property="og:url"'),
    image: extractMetaContent(html, 'property="og:image"'),
    imageAlt: extractMetaContent(html, 'property="og:image:alt"'),
    author: extractMetaContent(html, 'name="author"'),
    authorUrl: extractMetaContent(html, 'name="author-url"')
      || extractMetaContent(html, 'name="linkedin"'),
    publishDate: extractMetaContent(html, 'name="publication-date"')
      || extractMetaContent(html, 'name="published-date"'),
    modifiedDate: extractMetaContent(html, 'name="modified-date"')
      || extractMetaContent(html, 'name="last-modified"'),
  };

  // Must have title to generate JSON-LD
  if (!article.title) {
    return html;
  }

  // Build JSON-LD object
  const jsonLd = buildJsonLd(article, hostname);

  // Create script tag
  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

  // Inject before </head> closing tag
  return html.replace('</head>', `${jsonLdScript}\n</head>`);
};

/**
 * Injects Speculation Rules API script into HTML for near-instant navigation
 * Pure string function - fully testable without Cloudflare Workers runtime
 * @param {string} html - HTML content to process
 * @returns {string} Processed HTML with speculation rules injected
 */
export const injectSpeculationRules = (html) => {
  // Create speculation rules script tag
  const speculationScript = `<script type="speculationrules">
  {
    "prerender": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }],
    "prefetch": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }]
  }
</script>`;

  // Inject before </head> closing tag
  return html.replace('</head>', `${speculationScript}\n</head>`);
};

const handleRequest = async (request, env, _ctx) => {
  // Validate required environment variables
  if (!env.ORIGIN_HOSTNAME) {
    return new Response('Configuration Error: Missing ORIGIN_HOSTNAME environment variable', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const url = new URL(request.url);
  const publicHostname = url.hostname; // Store public-facing domain for JSON-LD

  // Handle CORS preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (url.port) {
    // Cloudflare opens a couple more ports than 443, so we redirect visitors
    // to the default port to avoid confusion.
    // https://developers.cloudflare.com/fundamentals/reference/network-ports/#network-ports-compatible-with-cloudflares-proxy
    const redirectTo = new URL(request.url);
    redirectTo.port = '';
    return new Response(`Moved permanently to ${redirectTo.href}`, {
      status: 301,
      headers: {
        location: redirectTo.href,
      },
    });
  }

  if (url.pathname.startsWith('/drafts/')) {
    return new Response('Not Found', { status: 404 });
  }

  if (isRUMRequest(url)) {
    // only allow GET, POST, OPTIONS
    if (!['GET', 'POST', 'OPTIONS'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }
  }

  const extension = getExtension(url.pathname);
  // remember original search params
  const savedSearch = url.search;
  // sanitise search params
  const { searchParams } = url;
  if (isMediaRequest(url)) {
    Array.from(searchParams.keys()).forEach((key) => {
      if (!['format', 'height', 'optimize', 'width'].includes(key)) {
        searchParams.delete(key);
      }
    });
  } else if (extension === 'json') {
    Array.from(searchParams.keys()).forEach((key) => {
      if (!['limit', 'offset', 'sheet'].includes(key)) {
        searchParams.delete(key);
      }
    });
  } else {
    // neither media nor json request: strip search params
    url.search = '';
  }
  searchParams.sort();

  url.hostname = env.ORIGIN_HOSTNAME;
  if (!url.origin.match(/^https?:\/\/main--.*--.*\.(?:aem|hlx)\.(?:live|page)/)) {
    return new Response('Invalid ORIGIN_HOSTNAME', { status: 500 });
  }

  const req = new Request(url, request);
  req.headers.set('x-forwarded-host', req.headers.get('host'));
  req.headers.set('x-byo-cdn-type', 'cloudflare');
  if (env.PUSH_INVALIDATION !== 'disabled') {
    req.headers.set('x-push-invalidation', 'enabled');
  }
  if (env.ORIGIN_AUTHENTICATION) {
    req.headers.set('authorization', `token ${env.ORIGIN_AUTHENTICATION}`);
  }

  let resp = await fetch(req, {
    method: req.method,
    cf: {
      // cf doesn't cache html by default: need to override the default behaviour
      cacheEverything: true,
    },
  });

  // Only process HTML responses for content transformations
  const contentType = resp.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    // Get HTML text for pure string processing
    let htmlText = await resp.text();

    // CRITICAL ORDER: Apply transformations (ADD content) FIRST
    // 1. Transform: Replace picture placeholders
    htmlText = replacePicturePlaceholder(htmlText);

    // 2. Transform: Inject JSON-LD structured data
    htmlText = injectJsonLd(htmlText, publicHostname);

    // 3. Transform: Inject Speculation Rules for near-instant navigation
    htmlText = injectSpeculationRules(htmlText);

    // CRITICAL ORDER: Apply removals (DELETE content) LAST
    // 4. Clean: Remove non-social metadata tags
    htmlText = removeNonSocialMetadata(htmlText);

    // 5. Clean: Remove HTML comments (must be last to preserve triggers for transforms)
    htmlText = removeHtmlComments(htmlText);

    // Create new response with processed HTML
    resp = new Response(htmlText, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
    });
  }

  // Create new Response for header modifications
  resp = new Response(resp.body, resp);

  if (resp.status === 301 && savedSearch) {
    const location = resp.headers.get('location');
    if (location && !location.match(/\?.*$/)) {
      resp.headers.set('location', `${location}${savedSearch}`);
    }
  }

  if (resp.status === 304) {
    // 304 Not Modified - remove CSP header
    resp.headers.delete('Content-Security-Policy');
  }

  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');

  // Add CORS headers
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Add worker version header
  resp.headers.set('cfw', WORKER_VERSION);

  return resp;
};

export default {
  fetch: handleRequest,
};
