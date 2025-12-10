# Adobe EDS Cloudflare Worker

A Cloudflare Worker for Adobe Edge Delivery Services that adds CORS headers and generates JSON-LD structured data from page metadata.

## Overview

This Worker extends Adobe's standard EDS Cloudflare Worker template to:

1. Add CORS headers to all responses
2. Generate Article schema JSON-LD from page metadata
3. Remove EDS error tags and non-social metadata after processing
4. Maintain all standard Adobe EDS functionality

## Features

### Trigger Mechanisms

The Worker supports **three trigger mechanisms** for JSON-LD generation:

#### Recommended: Clean Metadata

**Use this for all new pages:**

```
| jsonld | article |
```

Generates clean HTML:
```html
<meta name="jsonld" content="article">
```

Simple, clean markup.

#### Legacy: json-ld Metadata

Still supported for existing pages:

```
| json-ld | article |
```

Note: Some EDS versions generate an error element with this metadata name, which the worker also detects and handles.

#### Future-Proofing: Existing JSON-LD Scripts

If pages already have JSON-LD scripts:

```html
<script type="application/ld+json">{...}</script>
```

The Worker regenerates from fresh metadata to ensure consistency.

#### How All Three Work

Regardless of trigger:
1. Worker detects the trigger element
2. Extracts current metadata from page (og:title, author, description, etc.)
3. Generates fresh JSON-LD from that metadata
4. Removes/replaces the trigger element
5. Inserts new JSON-LD script in `<head>`

This ensures **always using latest metadata**, never stale JSON-LD.

### CORS Headers

Adds these headers to all responses:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

Handles OPTIONS preflight requests properly.

### JSON-LD Generation

Extracts metadata from your EDS pages and creates schema.org Article structured data:

**Metadata sources:**
- `og:title` → headline
- `og:description` or `longdescription` → description
- `og:url` → url
- `og:image` + `og:image:alt` → image object
- `author` → author (Person)
- `publication-date` or `published-date` → datePublished
- `modified-date` or `last-modified` → dateModified

The JSON-LD script is inserted into the page `<head>`.

### Metadata Cleanup

**Removes these elements after extraction:**
- `<script type="application/ld+json" data-error>` (EDS error scripts)
- `<meta data-error>` (any meta tags with errors)
- `name="description"`
- `name="longdescription"`
- `name="author"`
- `name="publication-date"` / `name="published-date"`
- `name="modified-date"` / `name="last-modified"`

**Keeps these for social media:**
- All `og:*` properties
- All `twitter:*` properties
- `name="linkedin"`

## Getting Started

### Local Development Setup

**Install dependencies**:
```bash
cd cloudflare/files
npm install
```

**Configure environment**:
Edit `wrangler.toml` and set your `ORIGIN_HOSTNAME`:
```toml
[vars]
ORIGIN_HOSTNAME = "main--project--owner.aem.live"
DEBUG = "true"
```

**Start local dev server**:
```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

### Quick Start Commands

```bash
# Local development with hot reload
npm run dev

# Run all tests (Unit + Integration)
npm test

# Run tests with coverage report
npm run test:coverage

# Deploy to Cloudflare (production)
npm run deploy

# View live logs from deployed worker
npm run tail

# Lint JavaScript code
npm run lint
```

## Deployment

### Prerequisites

- Cloudflare account with Workers enabled
- Adobe EDS project configured
- Node.js 18+ installed
- Wrangler CLI configured (via `npm install`)

### Required Environment Variables

Set these in your Cloudflare Worker settings:

- `ORIGIN_HOSTNAME` - **Required**. Your EDS origin (e.g., `main--project--org.hlx.live`)
- `ORIGIN_AUTHENTICATION` - (Optional) Auth token for EDS
- `PUSH_INVALIDATION` - Set to `disabled` to turn off push invalidation
- `DEBUG` - (Optional) Set to `true` to enable debug logging in Cloudflare logs

**Important**: The worker validates that `ORIGIN_HOSTNAME` is set. If missing, it returns a 500 error with a clear message.

### Deploy Steps

**Option 1: Deploy with Wrangler CLI (Recommended)**:
```bash
# Login to Cloudflare
npx wrangler login

# Set your ORIGIN_HOSTNAME in wrangler.toml
# Edit wrangler.toml and uncomment/set ORIGIN_HOSTNAME

# Deploy to production
npm run deploy

# Or deploy to specific environment
npx wrangler deploy --env production
```

**Option 2: Manual Deploy via Cloudflare Dashboard**:
1. Create a new Worker in Cloudflare dashboard
2. Copy the contents of `cloudflare-worker.js`
3. Configure environment variables in Worker settings
4. Add routes in Worker settings:
   - `yourdomain.com/*`
   - `www.yourdomain.com/*`
5. Save and deploy

**Post-Deployment**:
```bash
# View live logs
npm run tail

# Test worker is responding
curl -I https://yourdomain.com
```

## How It Works

### Request Flow

1. Request comes in for a page
2. Worker handles CORS preflight if needed
3. Sanitises URL parameters based on request type
4. Forwards request to EDS origin
5. For HTML responses:
   - HTMLRewriter processes the response stream in order
   - Detects malformed error script containing "article" (authoring error workaround)
   - Removes error scripts and error meta tags
   - Extracts metadata from meta tags
   - When viewport meta is reached, generates and inserts JSON-LD (if triggered)
   - Removes non-social meta tags
6. Creates new Response object for header modifications
7. Adds CORS headers
8. Returns response

### Critical Implementation Detail

The Worker must process HTMLRewriter **before** creating a new Response object for header modifications. This is because creating a new Response consumes the body stream, making it unavailable for HTMLRewriter:

```javascript
// CORRECT order:
resp = await fetch(req);
resp = new HTMLRewriter().transform(resp);  // Process stream first
resp = new Response(resp.body, resp);       // Then modify headers

// WRONG order (body consumed before processing):
resp = await fetch(req);
resp = new Response(resp.body, resp);       // Body consumed here
resp = new HTMLRewriter().transform(resp);  // Nothing left to transform
```

### HTMLRewriter Timing and Insertion Point

HTMLRewriter processes elements **as they appear** in the HTML stream. This creates a timing challenge for JSON-LD generation:

- The `<head>` tag appears before meta tags
- Handlers on `<head>` fire before metadata is extracted
- Therefore, trying to insert JSON-LD at `<head>` results in empty data

**Solution**: Insert JSON-LD after the `viewport` meta tag, which always appears after OG tags in EDS:

```
HTML Stream Order:
1. <head>           ← Too early - meta tags not processed yet
2. <title>
3. og:title         ← Extract title
4. og:description   ← Extract description
5. viewport         ← Perfect insertion point - all metadata extracted
6. </head>
```

This ensures all metadata is available when generating the JSON-LD script.

### HTML Processing

Only HTML responses are processed through HTMLRewriter. Other content types (JSON, images, media) pass through unchanged.

HTMLRewriter processes the response as a stream, which means:
- It must receive the original response from `fetch()`
- It transforms the HTML as it flows through
- Elements are processed in the order they appear in the HTML
- A new Response object should only be created after transformation
- This allows efficient processing without loading entire pages into memory

The Worker:
- Reads meta tags as they appear in the stream
- Builds a JSON-LD object from available data
- Inserts the JSON-LD script after the `viewport` meta tag (which comes after all OG tags in EDS)
- Only includes fields that have values in the JSON-LD
- Removes specified meta tags

**Why insert after viewport meta?** HTMLRewriter processes elements as it encounters them. The `<head>` element appears before the meta tags, so handlers on `<head>` fire before metadata is extracted. The viewport meta tag always comes after the OG tags in EDS HTML, ensuring all metadata has been processed before JSON-LD insertion.

### Description Priority

The Worker uses this order for the JSON-LD description:

1. `longdescription` (if present)
2. `og:description` (if no longdescription)
3. Omitted (if neither exists)

## Examples

### Before Processing

```html
<head>
  <meta property="og:title" content="My Article">
  <meta property="og:description" content="Short description">
  <meta name="longdescription" content="Detailed description">
  <meta name="author" content="Tom Cranstoun">
  <meta name="publication-date" content="2024-12-10">
  <script type="application/ld+json" data-error="error in json-ld: Unexpected token 'a', &quot;article&quot; is not valid JSON"></script>
</head>
```

### After Processing

```html
<head>
  <meta property="og:title" content="My Article">
  <meta property="og:description" content="Short description">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "My Article",
    "description": "Detailed description",
    "author": {
      "@type": "Person",
      "name": "Tom Cranstoun"
    },
    "datePublished": "2024-12-10",
    "publisher": {
      "@type": "Organization",
      "name": "allabout.network"
    }
  }</script>
</head>
```

## Metadata Configuration

Add these properties to your EDS document metadata:

### Recommended (Clean Metadata)

```
| Metadata         | Value               |
|------------------|---------------------|
| jsonld           | article             |
| author           | Tom Cranstoun       |
| publication-date | 2024-12-10          |
| modified-date    | 2024-12-10          |
| longdescription  | Detailed text here  |
```

**Use `jsonld` (not `json-ld`)** - avoids EDS authoring errors, cleaner markup.

### Legacy (Backward Compatibility)

```
| Metadata         | Value               |
|------------------|---------------------|
| json-ld          | article             |
```

Still supported for existing pages. Generates EDS error script which worker detects and fixes.

### How It Works

1. Add `jsonld` or `json-ld` field with value `article`
2. EDS generates corresponding HTML (`<meta>` tag or error `<script>`)
3. Worker detects trigger, extracts all metadata
4. Worker generates fresh JSON-LD from metadata
5. Worker removes trigger and inserts JSON-LD

**Note:** Worker always uses latest metadata from page, ensuring JSON-LD stays current.

## License

Based on Adobe's Cloudflare Worker template (Apache License 2.0)  
Modified by Digital Domain Technologies Ltd

## Limitations

- Only processes HTML responses
- Currently works around an authoring error that generates malformed JSON-LD scripts
- Requires at least `og:title` to generate JSON-LD
- Requires `<meta name="viewport">` tag (standard in all EDS pages)
- Date formats should be ISO 8601 compatible
- Publisher name is derived from hostname

## Debugging and Error Handling

### Debug Logging

Enable debug logging to troubleshoot JSON-LD generation:

**Set environment variable**:
```
DEBUG=true
```

**View logs**:
1. Cloudflare Dashboard → Workers & Pages → aem-worker
2. Click "Logs" tab
3. Watch real-time logs or use `wrangler tail`

**Debug output includes**:
- JSON-LD generation success with field details
- Trigger detection failures (e.g., "trigger active but no title found")
- URL pathname for each generated JSON-LD

**Example debug log**:
```json
{
  "message": "JSON-LD generated successfully",
  "url": "/blog/my-article",
  "fields": ["@context", "@type", "headline", "description", "author"],
  "hasAuthor": true,
  "hasImage": false
}
```

### Error Handling

The worker includes robust error handling:

**Environment Variable Validation**:
- Returns 500 error if `ORIGIN_HOSTNAME` is missing
- Clear error message: "Configuration Error: Missing ORIGIN_HOSTNAME environment variable"

**JSON Serialization Protection**:
- Wrapped in try/catch to prevent worker crashes
- Logs errors to Cloudflare with context (URL, title, error message)
- Continues serving page even if JSON-LD generation fails

**Error log example**:
```json
{
  "message": "JSON-LD serialization failed",
  "error": "Converting circular structure to JSON",
  "url": "/blog/article",
  "title": "My Article"
}
```

## Troubleshooting

### JSON-LD not appearing in pages

1. **Check trigger**: View page source and look for `<script type="application/ld+json" data-error` containing "article"
2. **Check Worker is deployed**: Look for CORS headers in response (`access-control-allow-origin: *`)
3. **Verify routes**: Ensure `yourdomain.com/*` route is configured
4. **Clear cache**: Use Ctrl+Shift+R (or Cmd+Shift+R) to bypass cache
5. **Check metadata**: Page must have at least `og:title` meta tag
6. **Verify viewport meta**: Page must have `<meta name="viewport">` tag (standard in EDS)
7. **View source**: Check raw HTML, not rendered page

If you see the error script in the source but no JSON-LD, the Worker isn't processing it. Check deployment and routes.

### Worker not executing

1. **Check environment variables**: Ensure `ORIGIN_HOSTNAME` is set correctly
2. **Verify route pattern**: Route must match your domain exactly
3. **Check logs**: Use Cloudflare dashboard logs to see errors
4. **Test workers.dev URL**: Try `https://your-worker.workers.dev/path` directly

### Metadata not being removed

Check the meta tag names match exactly - the Worker removes:
- `name="description"` (not `property="description"`)
- `name="author"`
- `name="publication-date"` or `name="published-date"`
- `name="modified-date"` or `name="last-modified"`

---

## Journey to Production-Ready: The Blog Post

**Want to understand the entire development journey?** Read the comprehensive blog post:

**[Building a Production-Ready Cloudflare Worker for Adobe EDS](../blog.md)** (450+ lines)

This blog documents:
- **The Challenge**: Building a worker that enhances EDS with CORS, JSON-LD, and metadata cleanup
- **The Approach**: Read-only testing philosophy that treats production code as sacred
- **The Implementation**: Four key worker enhancements with code examples
- **The Testing Environment**: Three-layer test infrastructure (unit, integration, manual)
- **The Port Redirect Challenge**: How we handled a production feature that blocked local testing
- **The Results**: 42 tests passing, comprehensive documentation, 10:1 test-to-code ratio
- **Lessons Learned**: Four key insights about read-only testing, developer experience, documentation as testing, and production safety

**Key Metrics from the Journey:**
- 42 automated tests (100% passing)
- 3,000 lines of test infrastructure for 300-line worker (10:1 ratio)
- Zero technical debt
- Production-ready with read-only testing principle maintained throughout

---

## Testing

### Simple, Robust Testing

The project uses a single test file `cloudflare-worker.test.js` that covers both:
1. **Unit Tests**: Verifies individual handler functions (`handleJsonLdMeta`, `handleViewport`, etc.) using mock elements.
2. **Integration Tests**: Verifies the entire `fetch` flow using a mocked `HTMLRewriter` to ensure handlers are wired correctly using request/result mocks.

This approach allows comprehensive testing of the worker logic locally without needing a complex dev server setup or port redirects.

### Quick Test Commands

```bash
# Run all tests (Unit + Integration)
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

**Tests cover:**
- Helper functions (19+ tests)
- Environment validation
- CORS headers
- URL sanitization
- JSON-LD generation
- Debug logging
- Error handling
- Handler wiring

**Status:** ✅ All tests passing

For complete testing details, see [TESTING.md](TESTING.md).

### Local Testing with Wrangler

Test the worker locally before deploying:

**Method 1: Using npm scripts (recommended)**:
```bash
# Start local dev server (uses wrangler.toml config)
npm run dev

# Worker runs at http://localhost:8787
# Hot reload enabled - changes apply automatically
```

**Method 2: Direct wrangler commands**:
```bash
# Basic local testing
npx wrangler dev

# With environment variables
npx wrangler dev --var ORIGIN_HOSTNAME:main--project--org.aem.live --var DEBUG:true

# Test specific environment
npx wrangler dev --env development

# Test with remote mode (uses actual Cloudflare infrastructure)
npx wrangler dev --remote
```

**Testing the local worker**:
```bash
# Test basic response
curl http://localhost:8787/

# Test with specific path
curl http://localhost:8787/test-page

# View response headers
curl -I http://localhost:8787/

# Test CORS preflight
curl -X OPTIONS http://localhost:8787/ \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET"
```

**Wrangler features**:
- Hot reload on file changes
- Local debugging with console.log output
- Environment variable injection
- Request/response inspection
- Performance metrics

### Integration Testing

**Test JSON-LD generation**:
1. Deploy worker to Cloudflare
2. Create test page with metadata: `| json-ld | article |`
3. View page source and verify `<script type="application/ld+json">`
4. Use Google Rich Results Test: https://search.google.com/test/rich-results
5. Validate schema.org compliance

**Test CORS headers**:
```bash
# Check CORS headers are present
curl -I https://yourdomain.com | grep -i access-control

# Test OPTIONS preflight
curl -X OPTIONS https://yourdomain.com \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET"
```

**Test environment variable validation**:
1. Remove `ORIGIN_HOSTNAME` from worker settings
2. Request any page
3. Should return 500 with clear error message
4. Re-add `ORIGIN_HOSTNAME` and verify recovery
