import fs from 'fs';
import path from 'path';

const CONFIG = {
  SITEMAP_FILE: 'eds-sitemap.xml',
  CONCURRENCY: 5,
  TIMEOUT_MS: 10000,
  CLEAN_TARGETS: [
    { file: 'eds-sitemap.xml', type: 'xml' },
    { file: 'blogs/ddt/ai/my-blog.json', type: 'json' },
    { file: 'blogs/ddt/my-blog.json', type: 'json' },
    { file: 'blogs/ddt/ai/llms.txt', type: 'txt' },
    { file: 'blogs/ddt/llms.txt', type: 'txt' },
  ],
};

// ANSI colour helpers (tty-aware)
const isTTY = process.stdout.isTTY;
const green = (s) => (isTTY ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s) => (isTTY ? `\x1b[31m${s}\x1b[0m` : s);
const yellow = (s) => (isTTY ? `\x1b[33m${s}\x1b[0m` : s);
const cyan = (s) => (isTTY ? `\x1b[36m${s}\x1b[0m` : s);
const bold = (s) => (isTTY ? `\x1b[1m${s}\x1b[0m` : s);

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    const redirectTo = res.redirected ? res.url : null;
    return { url, status: res.status, redirectTo };
  } catch (err) {
    clearTimeout(timeoutId);
    return { url, status: 'ERROR', error: err.message };
  }
}

async function checkBatch(urls) {
  const results = [];
  process.stdout.write(`Checking ${urls.length} URLs`);
  for (let i = 0; i < urls.length; i += CONFIG.CONCURRENCY) {
    const batch = urls.slice(i, i + CONFIG.CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    process.stdout.write('.');
  }
  process.stdout.write('\n');
  return results;
}

function removeXmlEntries(filePath, deadUrls) {
  let xml = fs.readFileSync(filePath, 'utf-8');
  let removed = 0;
  for (const url of deadUrls) {
    // Match the full <url>...</url> block containing this loc
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `\\s*<url>\\s*<loc>${escaped}<\\/loc>[^]*?<\\/url>`,
      'g',
    );
    const before = xml;
    xml = xml.replace(pattern, '');
    if (xml !== before) removed += 1;
  }
  fs.writeFileSync(filePath, xml, 'utf-8');
  return removed;
}

function removeJsonEntries(filePath, deadUrls) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  let removed = 0;

  function pruneArray(arr) {
    const before = arr.length;
    const filtered = arr.filter((item) => {
      if (item && typeof item.url === 'string') {
        const full = item.url.startsWith('http')
          ? item.url
          : `https://allabout.network${item.url}`;
        return !deadUrls.includes(full);
      }
      return true;
    });
    removed += before - filtered.length;
    return filtered;
  }

  function walk(obj) {
    if (Array.isArray(obj)) return pruneArray(obj).map(walk);
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, walk(v)]));
    }
    return obj;
  }

  const cleaned = walk(data);
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');
  return removed;
}

function removeTxtLines(filePath, deadUrls) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const filtered = lines.filter((line) => !deadUrls.some((u) => line.includes(u)));
  const removed = lines.length - filtered.length;
  fs.writeFileSync(filePath, filtered.join('\n'), 'utf-8');
  return removed;
}

function cleanFiles(deadUrls) {
  console.log(`\n${bold('Cleaning dead URLs from content files...')}`);
  for (const target of CONFIG.CLEAN_TARGETS) {
    if (!fs.existsSync(target.file)) {
      console.log(`  ${yellow('skip')} ${target.file} (not found)`);
      continue;
    }
    let removed = 0;
    if (target.type === 'xml') removed = removeXmlEntries(target.file, deadUrls);
    else if (target.type === 'json') removed = removeJsonEntries(target.file, deadUrls);
    else if (target.type === 'txt') removed = removeTxtLines(target.file, deadUrls);

    if (removed > 0) {
      console.log(`  ${green('✓')} ${target.file} — removed ${removed} entr${removed === 1 ? 'y' : 'ies'}`);
    } else {
      console.log(`  ${cyan('–')} ${target.file} — nothing to remove`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doClean = args.includes('--clean');
  const fileArg = args.find((a) => a.startsWith('--file='));
  const sitemapFile = fileArg ? fileArg.split('=')[1] : CONFIG.SITEMAP_FILE;

  if (!fs.existsSync(sitemapFile)) {
    console.error(red(`Error: sitemap file not found: ${sitemapFile}`));
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapFile, 'utf-8');
  const urls = extractUrls(xml);

  if (urls.length === 0) {
    console.error(red('No <loc> URLs found in sitemap.'));
    process.exit(1);
  }

  const results = await checkBatch(urls);

  const ok = results.filter((r) => r.status === 200);
  const redirects = results.filter((r) => typeof r.status === 'number' && r.status >= 300 && r.status < 400);
  const notFound = results.filter((r) => r.status === 404);
  const errors = results.filter((r) => r.status === 'ERROR' || (typeof r.status === 'number' && r.status >= 400 && r.status !== 404));

  console.log(`\n${bold('=== Sitemap Check Results ===')} (${path.resolve(sitemapFile)})`);
  console.log(`  ${green('✓ OK (200):       ')} ${ok.length}`);
  console.log(`  ${yellow('→ Redirects (3xx):')} ${redirects.length}`);
  console.log(`  ${red('✗ Not found (404):')} ${notFound.length}`);
  console.log(`  ${red('! Errors:         ')} ${errors.length}`);

  if (redirects.length > 0) {
    console.log(`\n${bold('Redirected URLs (consider updating sitemap to canonical):')}`);;
    redirects.forEach((r) => console.log(`  ${yellow(r.status)} ${r.url}${r.redirectTo ? ` → ${r.redirectTo}` : ''}`));
  }

  if (notFound.length > 0) {
    console.log(`\n${bold('404 URLs (dead — remove from sitemap):')}`);
    notFound.forEach((r) => console.log(`  ${red('✗')} ${r.url}`));
  }

  if (errors.length > 0) {
    console.log(`\n${bold('Errors:')}`);
    errors.forEach((r) => console.log(`  ${red('!')} ${r.url}  [${r.status}${r.error ? ` — ${r.error}` : ''}]`));
  }

  if (notFound.length === 0 && errors.length === 0) {
    console.log(`\n${green(bold('All URLs are healthy.'))}`);
  }

  if (doClean) {
    if (notFound.length === 0) {
      console.log(`\n${cyan('Nothing to clean — no 404 URLs found.')}`);
    } else {
      cleanFiles(notFound.map((r) => r.url));
    }
  } else if (notFound.length > 0) {
    console.log(`\nRun ${cyan('npm run sitemap:clean')} to remove dead entries from sitemap and content files.`);
  }

  process.exit(notFound.length > 0 && !doClean ? 1 : 0);
}

main();
