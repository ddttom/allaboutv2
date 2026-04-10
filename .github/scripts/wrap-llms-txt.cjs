#!/usr/bin/env node

/**
 * Generate llms.html from llms.txt — static equivalent of the Cloudflare
 * Worker's wrapLlmsTxtAsHtml function.
 *
 * Usage:
 *   node .github/scripts/wrap-llms-txt.js ddt-site
 *
 * Reads  <dir>/llms.txt
 * Writes <dir>/llms.html
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags llms, build, github-actions
 */

const fs = require('node:fs');
const path = require('node:path');

const siteDir = process.argv[2];
if (!siteDir) {
    console.error('Usage: node wrap-llms-txt.js <site-directory>');
    process.exit(1);
}

const inputPath = path.join(siteDir, 'llms.txt');
if (!fs.existsSync(inputPath)) {
    console.log(`No llms.txt found in ${siteDir} — skipping.`);
    process.exit(0);
}

const text = fs.readFileSync(inputPath, 'utf8');

// Read CNAME for canonical URL if present.
const cnamePath = path.join(siteDir, 'CNAME');
const host = fs.existsSync(cnamePath)
    ? fs.readFileSync(cnamePath, 'utf8').trim()
    : '';

const canonical = host ? `https://${host}/llms.txt` : '';

// HTML-escape the raw text.
const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Title from first heading, fallback to host.
const firstHeading = text.split('\n').find((l) => l.startsWith('# '));
const title = firstHeading
    ? firstHeading.replace(/^#\s+/, '').trim()
    : `llms.txt${host ? ` — ${host}` : ''}`;

const jsonLdObj = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: 'Agent directory file (llms.txt) served as HTML for crawler ingestion.',
    inLanguage: 'en-GB',
};
if (canonical) jsonLdObj.url = canonical;
const jsonLd = JSON.stringify(jsonLdObj);

const canonicalTag = canonical ? `<link rel="canonical" href="${canonical}">\n` : '';
const descHost = host || 'this site';

const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Agent directory file for ${descHost} — published as HTML so AI training crawlers can ingest it.">
<meta name="robots" content="index, follow">
<meta name="mx:status" content="active">
<meta name="mx:contentType" content="agent-directory">
<meta name="mx:audience" content="machines, humans">
${canonicalTag}<script type="application/ld+json">${jsonLd}</script>
<style>body{font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;max-width:80ch;margin:2rem auto;padding:0 1rem;color:#1a1a1a}pre.llms-txt{white-space:pre-wrap;word-wrap:break-word}</style>
</head>
<body>
<main>
<pre class="llms-txt">${safe}</pre>
</main>
</body>
</html>`;

const outputPath = path.join(siteDir, 'llms.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Generated ${outputPath} from ${inputPath}`);
