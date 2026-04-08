/**
 * Book download handlers.
 * Manages secure, time-limited, count-limited PDF downloads.
 *
 * Routes:
 *   GET  /api/v1/books/download/:token      — Landing page
 *   GET  /api/v1/books/download/:token/file  — PDF download (decrements count)
 *   POST /api/v1/books/generate-link         — Generate download link (auth required)
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags books, downloads, pdf
 */

import { json, error } from '../lib/responses.js';
import { hashToken, extractToken } from '../lib/token.js';
import * as tokensDb from '../db/tokens.js';
import * as downloadsDb from '../db/downloads.js';
import * as audit from '../db/audit.js';

const DOWNLOAD_TOKEN_BYTES = 8; // 16 hex chars
const DEFAULT_MAX_DOWNLOADS = 4;
const DEFAULT_EXPIRY_DAYS = 14;

const BOOK_METADATA = {
    handbook: {
        title: 'MX: The Handbook',
        subtitle: 'The Machine Experience Handbook',
        author: 'Tom Cranstoun',
        isbn: '978-1-067638-40-5',
        filename: 'MX-The-Handbook.pdf',
        r2Key: 'handbook/mx-handbook.pdf',
        coverUrl: 'https://mx.allabout.network/books/images/handbook-cover.jpg',
    },
    protocols: {
        title: 'MX: The Protocols',
        subtitle: 'Designing the Web for AI Agents and Everyone Else',
        author: 'Tom Cranstoun',
        isbn: '978-1-067638-39-9',
        filename: 'MX-The-Protocols.pdf',
        r2Key: 'protocols/mx-protocols.pdf',
        coverUrl: 'https://mx.allabout.network/books/images/protocols-cover.jpg',
    },
    introduction: {
        title: 'MX: The Introduction',
        subtitle: 'Understanding the machines reading your website',
        author: 'Tom Cranstoun',
        isbn: '',
        filename: 'MX-Introduction-Chapter.pdf',
        r2Key: 'introduction/mx-introduction-chapter.pdf',
        coverUrl: 'https://mx.allabout.network/books/images/intro-cover.jpg',
    },
};

/**
 * Handle GET /api/v1/books/download/:token — landing page.
 */
export async function handleDownloadPage(request, env, token) {
    const link = await validateToken(env.DB, token);

    if (link.error) {
        return new Response(expiredPageHTML(link.error), {
            status: link.status,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    const book = BOOK_METADATA[link.book_id] || BOOK_METADATA.handbook;
    const remaining = link.max_downloads - link.download_count;
    const expiresDate = formatDate(link.expires_at);

    return new Response(landingPageHTML(book, token, remaining, link.max_downloads, expiresDate), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

/**
 * Handle GET /api/v1/books/download/:token/file — serve PDF.
 * Returns JSON with updated state so the landing page can refresh.
 */
export async function handleDownloadFile(request, env, token) {
    const link = await validateToken(env.DB, token);

    if (link.error) {
        return error(link.error, link.status);
    }

    const book = BOOK_METADATA[link.book_id] || BOOK_METADATA.handbook;

    // Increment download count before serving.
    await downloadsDb.incrementDownload(env.DB, link.id);

    // Fetch PDF from R2.
    const object = await env.BOOKS_R2.get(book.r2Key);
    if (!object) {
        return error('Book file not found in storage', 404);
    }

    const newRemaining = link.max_downloads - link.download_count - 1;

    return new Response(object.body, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${book.filename}"`,
            'Content-Length': object.size,
            'X-Robots-Tag': 'noindex, nofollow',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
            'X-Downloads-Remaining': String(newRemaining),
            'X-Downloads-Max': String(link.max_downloads),
        },
    });
}

/**
 * Handle GET /api/v1/books/download/:token/status — JSON status for fetch updates.
 */
export async function handleDownloadStatus(request, env, token) {
    const link = await validateToken(env.DB, token);

    if (link.error) {
        return json({ expired: true, message: link.error }, link.status);
    }

    return json({
        expired: false,
        remaining: link.max_downloads - link.download_count,
        maxDownloads: link.max_downloads,
        expiresAt: link.expires_at,
    });
}

/**
 * Handle POST /api/v1/books/generate-link — create a download link.
 * Requires Bearer token authentication.
 */
export async function handleGenerateLink(request, env) {
    // Authenticate with existing Reginald token.
    const authHeader = request.headers.get('Authorization');
    const rawToken = extractToken(authHeader);
    if (!rawToken) {
        return error('Missing or invalid Authorization header', 401);
    }

    const tokenHash = await hashToken(rawToken);
    const authToken = await tokensDb.findByHash(env.DB, tokenHash);
    if (!authToken) {
        return error('Invalid API token', 401);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return error('Invalid JSON body', 400);
    }

    const bookId = body.bookId || 'handbook';
    if (!BOOK_METADATA[bookId]) {
        return error(`Unknown book: ${bookId}`, 400);
    }

    const maxDownloads = body.maxDownloads || DEFAULT_MAX_DOWNLOADS;
    const expiryDays = body.expiryDays || DEFAULT_EXPIRY_DAYS;

    // Generate download token (shorter than API tokens — 16 hex chars).
    const bytes = new Uint8Array(DOWNLOAD_TOKEN_BYTES);
    crypto.getRandomValues(bytes);
    const downloadToken = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const downloadTokenHash = await hashToken(downloadToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const link = await downloadsDb.create(env.DB, {
        tokenHash: downloadTokenHash,
        bookId,
        email: body.email || null,
        name: body.name || null,
        source: body.source || 'manual',
        stripeSessionId: body.stripeSessionId || null,
        maxDownloads,
        expiresAt: expiresAt.toISOString(),
    });

    const downloadUrl = `https://reginald.allabout.network/api/v1/books/download/${downloadToken}`;

    await audit.log(env.DB, null, 'download_link_created', {
        book_id: bookId,
        email: body.email,
        source: body.source || 'manual',
        max_downloads: maxDownloads,
        expires_at: expiresAt.toISOString(),
    });

    return json({
        token: downloadToken,
        url: downloadUrl,
        bookId,
        maxDownloads,
        expiresAt: expiresAt.toISOString(),
        email: body.email || null,
        name: body.name || null,
    }, 201);
}

/**
 * Validate a download token. Returns link record or error object.
 */
async function validateToken(db, token) {
    // Expire stale links on each request (lightweight).
    await downloadsDb.expireStale(db);

    const tokenHash = await hashToken(token);
    const link = await downloadsDb.findByHash(db, tokenHash);

    if (!link) {
        return { error: 'This download link has expired or is invalid.', status: 404 };
    }

    if (new Date(link.expires_at) < new Date()) {
        return { error: 'This download link has expired.', status: 410 };
    }

    if (link.download_count >= link.max_downloads) {
        return { error: 'This download link has reached its maximum number of downloads.', status: 410 };
    }

    return link;
}

/**
 * Format ISO date to readable UK format.
 */
function formatDate(isoString) {
    const d = new Date(isoString);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Landing page HTML — MX-compliant branded download page.
 *
 * MX compliance:
 *   Layer 1: charset, viewport, title, description, author, canonical
 *   Layer 2: Open Graph (og:type product — digital download)
 *   Layer 4: robots noindex (private link), llms-txt
 *   Layer 5: MX carrier tags (status, contentType, content-policy)
 *   Layer 6: Schema.org JSON-LD (DigitalDocument)
 *   Layer 7: Styles in <head> only — zero inline styles in <body>
 *   Body: semantic HTML, ARIA labels, live region for counter updates
 *   Script: external pattern (inline in <head> for Worker-served page,
 *           no external file available — acceptable per MX guide)
 */
function landingPageHTML(book, token, remaining, maxDownloads, expiresDate) {
    const pageUrl = `https://reginald.allabout.network/api/v1/books/download/${token}`;
    return `<!DOCTYPE html>
<html lang="en-GB" dir="ltr">
<head>
  <!-- Layer 1: Document Fundamentals -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title} — Secure Download | CogNovaMX</title>
  <meta name="author" content="${book.author}">
  <meta name="description" content="Secure download page for ${book.title} by ${book.author}. Time-limited link with ${maxDownloads} downloads.">
  <link rel="canonical" href="${pageUrl}">

  <!-- Layer 2: Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="${book.title} — Secure Download">
  <meta property="og:description" content="Secure download page for ${book.title} by ${book.author}.">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="CogNovaMX">
  <meta property="og:locale" content="en_GB">

  <!-- Layer 4: Robots and Discovery -->
  <meta name="robots" content="noindex, nofollow">
  <link rel="llms-txt" href="/llms.txt">

  <!-- Layer 5: MX Carrier Tags -->
  <meta name="mx:status" content="active">
  <meta name="mx:contentType" content="document">
  <meta name="mx:content-policy" content="no-extraction">
  <meta name="mx:attribution" content="required">

  <!-- Layer 6: Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "name": "${book.title}",
    "description": "Secure PDF download — ${book.subtitle}",
    "author": {
      "@type": "Person",
      "name": "${book.author}",
      "url": "https://www.linkedin.com/in/tom-cranstoun/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CogNovaMX Ltd",
      "url": "https://allabout.network"
    },
    "inLanguage": "en-GB",
    "encodingFormat": "application/pdf",
    "isbn": "${book.isbn}",
    "url": "${pageUrl}"
  }
  </script>

  <!-- Layer 7: Styles (in <head> — zero inline styles in <body>) -->
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      color: #1a1a2e;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 480px;
      width: 100%;
      overflow: hidden;
    }
    .card-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 32px 24px;
      text-align: center;
    }
    .card-header h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 4px; }
    .card-header p { font-size: 0.9rem; opacity: 0.8; }
    .card-body { padding: 32px 24px; }
    .meta-table { width: 100%; border-collapse: collapse; }
    .meta-table th { color: #666; font-weight: 400; text-align: left; padding: 12px 0; border-bottom: 1px solid #eee; }
    .meta-table td { font-weight: 600; text-align: right; padding: 12px 0; border-bottom: 1px solid #eee; }
    .meta-table tr:last-child th,
    .meta-table tr:last-child td { border-bottom: none; }
    .remaining { color: #1a7f37; }
    .remaining-warning { color: #9a6700; }
    .remaining-exhausted { color: #cf222e; }
    .download-btn {
      display: block;
      width: 100%;
      padding: 16px;
      margin-top: 24px;
      background: #1a7f37;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: background 0.2s;
    }
    .download-btn:hover { background: #158a32; }
    .download-btn:disabled,
    .download-btn[aria-disabled="true"] {
      background: #ccc;
      cursor: not-allowed;
    }
    .status-msg {
      text-align: center;
      margin-top: 12px;
      font-size: 0.9rem;
      color: #666;
      min-height: 1.4em;
    }
    .card-footer {
      padding: 16px 24px;
      text-align: center;
      font-size: 0.8rem;
      color: #999;
      border-top: 1px solid #eee;
    }
    .card-footer a { color: #666; text-decoration: none; }
  </style>
</head>
<body>

  <main>
    <article class="card" itemscope itemtype="https://schema.org/DigitalDocument">
      <header class="card-header">
        <h1 itemprop="name">${book.title}</h1>
        <p>by <span itemprop="author">${book.author}</span></p>
      </header>

      <section class="card-body" aria-label="Download details">
        <table class="meta-table" aria-label="Book information">
          <tr>
            <th scope="row">Format</th>
            <td><span itemprop="encodingFormat">PDF</span></td>
          </tr>
          <tr>
            <th scope="row">ISBN</th>
            <td><span itemprop="isbn">${book.isbn}</span></td>
          </tr>
          <tr>
            <th scope="row">Downloads remaining</th>
            <td><span id="remaining" class="remaining" aria-live="polite" data-remaining="${remaining}" data-max="${maxDownloads}">${remaining} of ${maxDownloads}</span></td>
          </tr>
          <tr>
            <th scope="row">Link expires</th>
            <td><time datetime="${new Date().toISOString().split('T')[0]}">${expiresDate}</time></td>
          </tr>
        </table>

        <a href="/api/v1/books/download/${token}/file"
           id="download-btn"
           class="download-btn"
           role="button"
           aria-describedby="status-msg"
           download="${book.filename}">Download Now</a>

        <p id="status-msg" class="status-msg" aria-live="polite"></p>
      </section>

      <footer class="card-footer">
        <p>&copy; <a href="https://allabout.network">CogNovaMX Ltd</a> &mdash; Making the web work for everyone and everything that uses it.</p>
      </footer>
    </article>
  </main>

  <script>
  (function () {
    var btn = document.getElementById('download-btn');
    var remainEl = document.getElementById('remaining');
    var statusEl = document.getElementById('status-msg');
    var statusUrl = '/api/v1/books/download/${token}/status';
    var downloading = false;

    btn.addEventListener('click', function (e) {
      if (downloading) return;
      downloading = true;
      statusEl.textContent = 'Downloading\\u2026';

      // Allow the default link navigation (triggers PDF download).
      // After a short delay, fetch updated status from the API.
      setTimeout(function () {
        fetch(statusUrl)
          .then(function (r) { return r.json(); })
          .then(function (data) {
            downloading = false;
            if (data.expired) {
              remainEl.textContent = '0 of ' + remainEl.dataset.max;
              remainEl.className = 'remaining-exhausted';
              btn.setAttribute('aria-disabled', 'true');
              btn.removeAttribute('href');
              statusEl.textContent = data.message;
              return;
            }
            remainEl.dataset.remaining = data.remaining;
            remainEl.textContent = data.remaining + ' of ' + data.maxDownloads;
            if (data.remaining <= 0) {
              remainEl.className = 'remaining-exhausted';
              btn.setAttribute('aria-disabled', 'true');
              btn.removeAttribute('href');
              statusEl.textContent = 'All downloads used.';
            } else if (data.remaining === 1) {
              remainEl.className = 'remaining-warning';
              statusEl.textContent = 'Downloaded successfully. 1 download left.';
            } else {
              remainEl.className = 'remaining';
              statusEl.textContent = 'Downloaded successfully. ' + data.remaining + ' downloads left.';
            }
          })
          .catch(function () {
            downloading = false;
            statusEl.textContent = 'Download started. Refresh page to see updated count.';
          });
      }, 1500);
    });
  })();
  </script>

</body>
</html>`;
}

/**
 * Expired/invalid link page HTML — MX-compliant.
 */
function expiredPageHTML(message) {
    return `<!DOCTYPE html>
<html lang="en-GB" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Link Expired | CogNovaMX</title>
  <meta name="author" content="Tom Cranstoun">
  <meta name="description" content="This download link has expired or reached its maximum number of downloads.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="llms-txt" href="/llms.txt">
  <meta name="mx:status" content="active">
  <meta name="mx:contentType" content="document">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      color: #1a1a2e;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 480px;
      width: 100%;
      padding: 48px 24px;
      text-align: center;
    }
    .card h1 { font-size: 1.5rem; color: #cf222e; margin-bottom: 16px; }
    .card p { font-size: 1rem; color: #666; margin-bottom: 24px; }
    .card a { color: #1a7f37; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <main>
    <article class="card" role="alert">
      <h1>Link Expired</h1>
      <p>${message}</p>
      <p>If you think this is an error, please <a href="mailto:info@cognovamx.com?subject=Download%20link%20issue">contact us</a>.</p>
      <p><a href="https://mx.allabout.network/books/">View our books</a></p>
    </article>
  </main>
</body>
</html>`;
}
