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
* @version 1.4.0
 */

// --- REGINALD API imports (write-side handlers) ---
import { handleSubscribe } from './reginald/handlers/subscribe.js';
import { handleStripeWebhook } from './reginald/handlers/stripe-webhook.js';
import { handleRegister } from './reginald/handlers/register.js';
import { handleStatus } from './reginald/handlers/status.js';
import { handleTokenRotate } from './reginald/handlers/token-rotate.js';
import { handlePublisherAnalytics } from './reginald/handlers/publisher-analytics.js';
import { handlePublisherAliveness } from './reginald/handlers/publisher-aliveness.js';
import { handlePublisherCogs } from './reginald/handlers/publisher-cogs.js';
import * as subscriptionsDb from './reginald/db/subscriptions.js';
import * as publishersDb from './reginald/db/publishers.js';
import * as audit from './reginald/db/audit.js';
import { runAlivenessChecks } from './reginald/lib/aliveness.js';

// Worker version - hardcoded for compatibility
// Update this when package.json version changes
export const WORKER_VERSION = '1.4.0';

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
 * @file cloudflare-worker.js
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os

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
  const monthNamePattern = /(\d{1,2})[\s/-]+([a-zA-Z]+)[\s,/-]+(\d{2,4})|([a-zA-Z]+)[\s/-]+(\d{1,2})[\s,/-]+(\d{2,4})/i;
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
  const replacement = `<img src="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL}" alt="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT}">`;

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

/**
 * Parses an Accept-Language HTTP header into a sorted array of language preferences.
 * Pure function - fully testable without Cloudflare Workers runtime.
 * @param {string} header - Accept-Language header value (e.g., "es-MX,es;q=0.9,en;q=0.8")
 * @returns {Array<{full: string, base: string, quality: number}>} Sorted by quality descending
 */
export const parseAcceptLanguage = (header) => {
  if (!header || typeof header !== 'string') return [];

  return header
    .split(',')
    .map((lang) => {
      const parts = lang.trim().split(';q=');
      const code = parts[0].trim().toLowerCase();
      if (!code) return null;
      return {
        full: code,
        base: code.split('-')[0],
        quality: parts[1] ? parseFloat(parts[1]) : 1.0,
      };
    })
    .filter((entry) => entry !== null && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality);
};

/**
 * Detects the best matching language from an Accept-Language header.
 * Cascading match: exact regional → base language → default.
 * Pure function - fully testable without Cloudflare Workers runtime.
 * @param {string} acceptLanguageHeader - Raw Accept-Language header value
 * @param {string[]} availableLanguages - Array of supported language codes (e.g., ["es", "en"])
 * @param {string} defaultLanguage - Fallback language code
 * @returns {string} Best matching language code
 */
export const detectLanguage = (acceptLanguageHeader, availableLanguages, defaultLanguage) => {
  const preferences = parseAcceptLanguage(acceptLanguageHeader);

  for (const pref of preferences) {
    // Try exact regional match first (es-mx)
    if (availableLanguages.includes(pref.full)) {
      return pref.full;
    }
    // Try base language match (es)
    if (availableLanguages.includes(pref.base)) {
      return pref.base;
    }
  }

  return defaultLanguage;
};

/**
 * Finds a registered language site matching the given pathname.
 * Pure function - fully testable without Cloudflare Workers runtime.
 * @param {string} pathname - Request pathname (e.g., "/mx/demo/salva/")
 * @param {Array<{pathPrefix: string}>} sites - Registered site configurations
 * @returns {{site: object, remainingPath: string}|null} Matched site and remaining path, or null
 */
export const findLanguageSite = (pathname, sites) => {
  if (!sites || !Array.isArray(sites)) return null;

  for (const site of sites) {
    const prefix = site.pathPrefix;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const remainingPath = pathname.slice(prefix.length) || '/';
      return { site, remainingPath };
    }
  }

  return null;
};

/**
 * Checks whether a path (relative to site prefix) should trigger a language redirect.
 * Pure function - fully testable without Cloudflare Workers runtime.
 * @param {string} remainingPath - Path after the site prefix (e.g., "/", "/index.html", "/assets/style.css")
 * @param {object} site - Site configuration with redirectPaths and excludePaths
 * @returns {boolean} True if this path should be redirected
 */
export const shouldLanguageRedirect = (remainingPath, site) => {
  // Check excluded paths first
  if (site.excludePaths) {
    for (const excluded of site.excludePaths) {
      if (remainingPath.startsWith(excluded)) {
        return false;
      }
    }
  }

  // Check if path is in the redirect list
  if (site.redirectPaths) {
    return site.redirectPaths.includes(remainingPath);
  }

  return false;
};

/**
 * Categorise an AI agent or browser from User-Agent string.
 * Pure function - fully testable without Cloudflare Workers runtime.
 * @param {string} userAgent - User-Agent header value
 * @returns {string} Agent category
 */
export const categoriseAgent = (userAgent) => {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('chatgpt') || ua.includes('openai')) return 'chatgpt';
  if (ua.includes('claude') || ua.includes('anthropic')) return 'claude';
  if (ua.includes('perplexity')) return 'perplexity';
  if (ua.includes('gptbot')) return 'gptbot';
  if (ua.includes('googlebot') || ua.includes('google-extended')) return 'googlebot';
  if (ua.includes('bingbot')) return 'bingbot';
  if (ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari')) return 'browser';
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'bot';
  return 'unknown';
};

/**
 * Handles requests for MX subdomains (content.allabout.network, reginald.allabout.network).
 * Routes to the mx-outputs Cloudflare Pages origin with path prefix mapping.
 * @param {Request} request - Incoming request
 * @param {URL} url - Parsed URL
 * @param {string} subdomain - 'content' or 'reginald'
 * @param {string} mxOutputsHostname - mx-outputs Pages hostname
 * @returns {Response} Proxied response from mx-outputs origin
 */
const handleMxSubdomain = async (request, url, subdomain, env) => {
  // Map subdomain to directory in mx-outputs GitHub repo:
  // reginald.allabout.network/api/* → raw.githubusercontent.com/{repo}/main/reginald/api/*
  // content.allabout.network/cogs/* → raw.githubusercontent.com/{repo}/main/content/cogs/*

  // Bare root → serve index.html (GitHub raw doesn't serve directory listings)
  let subPath = url.pathname;
  if (subPath === '/' || subPath === '') {
    subPath = '/index.html';
  }

  const repoPath = env.MX_OUTPUTS_REPO_PATH || '/Digital-Domain-Technologies-Ltd/MX-outputs/main';
  const originUrl = new URL(url);
  originUrl.hostname = env.MX_OUTPUTS_HOSTNAME;
  originUrl.pathname = `${repoPath}/${subdomain}${subPath}`;

  const originReq = new Request(originUrl, {
    method: request.method,
    headers: request.headers,
  });

  let resp = await fetch(originReq, {
    cf: { cacheEverything: true, cacheTtl: 300 },
  });

  // Create mutable response for header modifications
  resp = new Response(resp.body, resp);

  // GitHub raw serves everything as text/plain — set correct Content-Type from extension
  const ext = getExtension(subPath);
  const contentTypes = {
    json: 'application/json',
    md: 'text/markdown',
    txt: 'text/plain',
    html: 'text/html',
    xml: 'application/xml',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    pem: 'application/x-pem-file',
    css: 'text/css',
    js: 'application/javascript',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    pdf: 'application/pdf',
  };
  // Filename-specific overrides (llms.txt served as HTML so browsers render it)
  const filename = subPath.split('/').pop();
  if (filename === 'llms.txt') {
    resp.headers.set('Content-Type', 'text/html; charset=utf-8');
  } else if (contentTypes[ext]) {
    const ct = contentTypes[ext];
    const isText = ct.startsWith('text/') || ct === 'application/json' || ct === 'application/xml' || ct === 'application/javascript';
    resp.headers.set('Content-Type', isText ? `${ct}; charset=utf-8` : ct);
  }

  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  resp.headers.set('X-Frame-Options', 'SAMEORIGIN');
  resp.headers.set('X-Content-Type-Options', 'nosniff');
  resp.headers.set('cfw', WORKER_VERSION);
  resp.headers.delete('age');

  // Resolution analytics: log COG resolutions to Analytics Engine (fire-and-forget)
  if (subdomain === 'reginald' && env.ANALYTICS) {
    try {
      const parts = subPath.split('/').filter(Boolean);
      let ns = '';
      let cog = '';
      if (parts[0] === 'cogs' && parts.length >= 3) {
        ns = parts[1];
        cog = parts[2];
      }
      env.ANALYTICS.writeDataPoint({
        blobs: [ns, cog, categoriseAgent(request.headers.get('User-Agent')), request.cf?.country || 'XX'],
        doubles: [resp.status],
        indexes: [ns],
      });
    } catch (_) { /* analytics never blocks response */ }
  }

  return resp;
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // --- Multi-origin routing: MX subdomains ---

  // reginald.allabout.network — write-side API routes (D1 + Stripe) + read-side (GitHub proxy)
  if (publicHostname === 'reginald.allabout.network') {
    const method = request.method;
    const path = url.pathname;

    // Write-side API routes (authenticated, D1-backed)
    if (method === 'POST' && path === '/api/v1/subscribe')       return handleSubscribe(request, env);
    if (method === 'POST' && path === '/api/v1/stripe/webhook')  return handleStripeWebhook(request, env);
    if (method === 'POST' && path === '/api/v1/register')        return handleRegister(request, env);
    if (method === 'GET'  && path === '/api/v1/publisher/status') return handleStatus(request, env);
    if (method === 'POST' && path === '/api/v1/publisher/token/rotate') return handleTokenRotate(request, env);

    // Dashboard API endpoints
    if (method === 'GET' && path === '/api/v1/publisher/analytics')  return handlePublisherAnalytics(request, env);
    if (method === 'GET' && path === '/api/v1/publisher/aliveness')  return handlePublisherAliveness(request, env);
    if (method === 'GET' && path === '/api/v1/publisher/cogs')       return handlePublisherCogs(request, env);

    // Subscription success/cancelled pages
    if (method === 'GET' && path === '/api/v1/subscribe/success') {
      const namespace = url.searchParams.get('namespace') || 'your namespace';
      return new Response(subscribeSuccessHTML(namespace), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    if (method === 'GET' && path === '/api/v1/subscribe/cancelled') {
      return new Response(subscribeCancelledHTML(), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // All other GET requests → GitHub proxy (read-side: static JSON, index.html, etc.)
    return handleMxSubdomain(request, url, 'reginald', env);
  }

  // content.allabout.network → GitHub raw mx-outputs repo (COG content files)
  if (env.MX_OUTPUTS_HOSTNAME) {
    if (publicHostname === 'content.allabout.network') {
      return handleMxSubdomain(request, url, 'content', env);
    }
  }

  // Backward-compatible redirect: allabout.network/reginald/* → reginald.allabout.network/*
  if (url.pathname.startsWith('/reginald/') || url.pathname === '/reginald') {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = 'reginald.allabout.network';
    redirectUrl.pathname = url.pathname.replace(/^\/reginald/, '') || '/';
    return new Response(null, {
      status: 301,
      headers: { Location: redirectUrl.toString() },
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

  // Root path redirect: bare domain → /index.html (GitHub-hosted homepage)
  if (url.pathname === '/' || url.pathname === '') {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = '/index.html';
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  }

  if (url.pathname.startsWith('/drafts/')) {
    return new Response('Not Found', { status: 404 });
  }

  // --- Language redirect (before origin fetch) ---
  // Fetch language config from mx-outputs (reginald API) with 1-hour edge cache
  try {
    const configUrl = new URL('/reginald/api/v1/language-config.json', url);
    configUrl.hostname = env.MX_OUTPUTS_HOSTNAME || env.ORIGIN_HOSTNAME;
    const configResp = await fetch(configUrl, { cf: { cacheTtl: 3600 } });
    if (configResp.ok) {
      const langConfig = await configResp.json();
      const match = findLanguageSite(url.pathname, langConfig.sites);
      if (match) {
        const { site, remainingPath } = match;
        // Skip if already on a language path
        const langPattern = new RegExp(`^/(${site.languages.join('|')})/`);
        if (!langPattern.test(remainingPath) && shouldLanguageRedirect(remainingPath, site)) {
          const acceptLang = request.headers.get('Accept-Language') || '';
          const targetLang = detectLanguage(acceptLang, site.languages, site.default);
          const redirectUrl = new URL(request.url);
          redirectUrl.pathname = `${site.pathPrefix}/${targetLang}/`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl.toString(),
              'Cache-Control': 'no-cache',
            },
          });
        }
      }
    }
  } catch (_langErr) {
    // Language redirect is non-critical — fall through to normal request handling
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
  // Request uncompressed from origin — the worker modifies HTML as text,
  // so compressed responses cause double-encoding issues with cacheEverything
  req.headers.set('Accept-Encoding', 'identity');
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

  // 404 fallback: redirect extensionless paths to index.html
  if (resp.status === 404 && !extension) {
    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = url.pathname.replace(/\/+$/, '') + '/index.html';
    return new Response(null, {
      status: 302,
      headers: {
        Location: fallbackUrl.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  }

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
    // Must strip content-encoding and content-length: resp.text() auto-decompresses
    // but the original headers still claim compressed encoding and size
    const processedHeaders = new Headers(resp.headers);
    processedHeaders.delete('content-encoding');
    processedHeaders.delete('content-length');
    resp = new Response(htmlText, {
      status: resp.status,
      statusText: resp.statusText,
      headers: processedHeaders,
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

  // Add security headers
  resp.headers.set('X-Frame-Options', 'SAMEORIGIN');
  resp.headers.set('X-Content-Type-Options', 'nosniff');

  // Add CSP for /mx/ pages (static HTML — no EDS dependencies)
  if (url.pathname.startsWith('/mx/') || url.pathname === '/mx') {
    resp.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' https://allabout.network; font-src 'self'; connect-src 'self' https://static.cloudflareinsights.com; frame-ancestors 'self'");
  }

  // Add worker version header
  resp.headers.set('cfw', WORKER_VERSION);

  // llms.txt served as HTML so browsers render it
  if (url.pathname.endsWith('/llms.txt') || url.pathname === '/llms.txt') {
    resp.headers.set('Content-Type', 'text/html; charset=utf-8');
  }

  return resp;
};

// --- REGINALD scheduled handlers ---

/**
 * Daily cron (02:00 UTC): suspend subscriptions past grace period.
 * @param {object} env
 */
async function runSubscriptionExpiry(env) {
  const expired = await subscriptionsDb.findExpiredGrace(env.DB);

  for (const sub of expired) {
    await subscriptionsDb.updateByStripeId(env.DB, sub.stripe_subscription_id, {
      status: 'suspended',
    });
    await publishersDb.updateStatus(env.DB, sub.publisher_id, 'suspended');
    await audit.log(env.DB, sub.publisher_id, 'subscription_suspended', {
      reason: 'grace_period_expired',
      grace_period_end: sub.grace_period_end,
    });
    console.log(`Suspended publisher ${sub.namespace} — grace period expired`);
  }

  if (expired.length > 0) {
    console.log(`Cron: suspended ${expired.length} expired subscription(s)`);
  }
}

// --- REGINALD success/cancelled HTML pages ---

function subscribeSuccessHTML(namespace) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MX-Reginald — Subscription Active</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 80px auto; padding: 0 20px; color: #333; }
    h1 { color: #1a7f37; }
    .warning { color: #9a6700; background: #fff8c5; border: 1px solid #d4a72c; border-radius: 6px; padding: 12px; margin: 16px 0; }
  </style>
</head>
<body>
  <h1>Subscription Active</h1>
  <p>Your MX-Reginald publisher listing for <strong>${namespace}</strong> is now active.</p>
  <p>Your API token has been generated. Check your email for setup instructions, or use the <code>/api/v1/publisher/status</code> endpoint to verify your subscription.</p>
  <div class="warning">
    <strong>Important:</strong> Store your API token securely. It cannot be retrieved again. If lost, use the token rotation endpoint to generate a new one.
  </div>
  <p><a href="https://reginald.allabout.network">Return to MX-Reginald</a></p>
</body>
</html>`;
}

function subscribeCancelledHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MX-Reginald — Checkout Cancelled</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 80px auto; padding: 0 20px; color: #333; }
  </style>
</head>
<body>
  <h1>Checkout Cancelled</h1>
  <p>Your subscription checkout was cancelled. No charges were made.</p>
  <p>You can restart the process at any time by calling <code>POST /api/v1/subscribe</code>.</p>
  <p><a href="https://reginald.allabout.network">Return to MX-Reginald</a></p>
</body>
</html>`;
}

export default {
  fetch: handleRequest,
  async scheduled(event, env, ctx) {
    // Daily at 02:00 UTC — suspend expired subscriptions
    if (event.cron === '0 2 * * *') {
      await runSubscriptionExpiry(env);
    }
    // Monthly on 1st at 03:00 UTC — run aliveness checks
    if (event.cron === '0 3 1 * *') {
      await runAlivenessChecks(env);
    }
  },
};
