# Adobe EDS Cloudflare Worker

A Cloudflare Worker for Adobe Edge Delivery Services that adds CORS headers and generates JSON-LD structured data from page metadata.

## Overview

This Worker extends Adobe's standard EDS Cloudflare Worker template to:

1. Add CORS headers to all responses
2. Generate Article schema JSON-LD from page metadata
3. Remove EDS error tags and non-social metadata after processing
4. Replace "Picture Here" placeholders with author images
5. Remove all HTML comments from HTML responses
6. Maintain all standard Adobe EDS functionality

## Features

### Version Header

The worker includes a version header in all responses:
- **Header name**: `cfw` (CloudflareWorker)
- **Format**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Current version**: `1.1.4`
- **Usage**: Track deployed worker version for debugging and monitoring

**Version Management:**
- **MUST increment** the version number for ALL changes to `cloudflare-worker.js`
- Use semantic versioning:
  - **MAJOR** (x.0.0): Breaking changes or major feature additions
  - **MINOR** (1.x.0): New features, backward-compatible changes
  - **PATCH** (1.0.x): Bug fixes, documentation updates
- Update the `WORKER_VERSION` constant at the top of `cloudflare-worker.js`
- Version is validated by automated tests

**Check deployed version:**
```bash
curl -I https://yourdomain.com | grep cfw
# Output: cfw: 1.0.0
```

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
- `author` → author (Person name)
- `author-url` → author (Person url) - optional (falls back to `linkedin` meta if not provided)
- `publication-date` or `published-date` → datePublished (auto-formatted to ISO 8601)
- `modified-date` or `last-modified` → dateModified (auto-formatted to ISO 8601)
- **Publisher organization** → Uses the public-facing hostname from the request (e.g., `allabout.network`), not the EDS origin

**Note:** The `ORIGIN_HOSTNAME` environment variable is used to fetch content from the EDS origin, but the JSON-LD publisher organization always uses the public-facing domain from the incoming request. This ensures search engines see the correct canonical domain.

The JSON-LD script is inserted into the page `<head>`.

**Date formatting:**
Dates are automatically converted to ISO 8601 format (YYYY-MM-DD). Supports multiple input formats with both 2-digit and 4-digit years:

**4-digit years (recommended):**
- ISO 8601: `2024-12-10` (passed through unchanged)
- UK numeric: `10/12/2024` (day/month/year)
- Month names: `10 December 2024`, `Dec 10 2024`, `10-Dec-2024`

**2-digit years (with century inference):**
- UK numeric: `12/12/25` → `2025-12-12`, `25/12/99` → `1999-12-25`
- Month names: `12 Dec 25` → `2025-12-12`, `25 December 99` → `1999-12-25`
- Hyphen format: `12-Dec-25` → `2025-12-12`, `25-March-99` → `1999-03-25`
- Slash with month names: `12/dec/25` → `2025-12-12`, `25/December/99` → `1999-12-25` *(user-friendly)*
- US format: `Dec 12, 25` → `2025-12-12`, `dec/12/25` → `2025-12-12`

**Century inference rules:**
- Years `00-49` → `2000-2049` (e.g., `25` → `2025`, `00` → `2000`)
- Years `50-99` → `1950-1999` (e.g., `99` → `1999`, `50` → `1950`)
- Valid range: `1950-2049` (dates outside this range are rejected)

**Note:** Invalid dates are omitted from JSON-LD rather than causing errors

### Metadata Cleanup

**Removes these elements after extraction:**
- `<script type="application/ld+json" data-error>` (EDS error scripts)
- `<meta data-error>` (any meta tags with errors)
- `name="description"`
- `name="longdescription"`
- `name="author-url"`
- `name="publication-date"` / `name="published-date"`
- `name="modified-date"` / `name="last-modified"`

**Keeps these for social media & attribution:**
- All `og:*` properties
- All `twitter:*` properties
- `name="linkedin"` (used as fallback for author-url)
- `name="author"` (preserved for attribution)

**Why preserve author metadata?**
The `author` tag is kept in the HTML for proper attribution and accessibility, similar to how social media tags (LinkedIn, Twitter, Open Graph) are preserved. The author information is still extracted for JSON-LD generation, but the original meta tag remains for compatibility with tools and crawlers that expect standard author metadata.

### Picture Placeholder Replacement

Automatically replaces placeholder text with author images in HTML content.

**Pattern Detection:**
```html
<!-- Input HTML -->
<div>
  <div>Picture Here</div>
</div>

<!-- Output HTML -->
<div>
  <img src="https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png" alt="Author: Tom Cranstoun">
</div>
```

**Behavior:**
- Detects all `<div>` elements containing exactly "Picture Here" text
- Replaces matching divs with author image tag
- Case-sensitive matching with whitespace trimming
- Multiple occurrences on same page are all replaced
- Outer div wrapper is preserved
- Non-matching divs are unaffected

**Configuration:**
The feature is configured via `PICTURE_PLACEHOLDER_CONFIG` constant in the worker:
```javascript
{
  TRIGGER_TEXT: 'Picture Here',
  IMAGE_URL: 'https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png',
  IMAGE_ALT: 'Author: Tom Cranstoun',
  MATCH_CASE_SENSITIVE: true,
  TRIM_WHITESPACE: true
}
```

**Use Cases:**
- Placeholder images in blog posts
- Author profile pictures in article templates
- Consistent author branding across pages
- Dynamic image replacement without manual HTML edits

### HTML Comment Removal

Automatically removes all HTML comments from HTML responses for cleaner output and reduced page size.

**Behavior:**
- Removes all `<!-- comment -->` patterns from HTML
- Handles multiline comments
- Handles multiple comments per page
- Pure string replacement (fully testable)
- Does not affect JavaScript `//` or `/* */` comments

**Example:**
```html
<!-- Input HTML -->
<html>
  <!-- This is a comment -->
  <body>
    <div>Content</div>
    <!-- Another comment
         spanning multiple lines -->
  </body>
</html>

<!-- Output HTML -->
<html>

  <body>
    <div>Content</div>

  </body>
</html>
```

**Use Cases:**
- Reduce HTML payload size
- Remove development/debugging comments from production
- Clean up comments left by content authors
- Improve HTML cleanliness for scrapers and bots

## Getting Started

### Local Development Setup

**Install dependencies**:
```bash
cd cloudflare/files
npm install
```

### Quick Start Commands

```bash
# Run all tests (Unit + Integration)
npm test

# Run tests with coverage report
npm run test:coverage

# Lint JavaScript code
npm run lint
```

## Deployment

### Prerequisites

- Cloudflare account with Workers enabled
- Adobe EDS project configured
- Node.js 18+ installed

### Required Environment Variables

Set these in your Cloudflare Worker settings (Dashboard):

- `ORIGIN_HOSTNAME` - **Required**. Your EDS origin (e.g., `main--project--org.hlx.live`)
- `ORIGIN_AUTHENTICATION` - (Optional) Auth token for EDS
- `PUSH_INVALIDATION` - Set to `disabled` to turn off push invalidation
- `DEBUG` - (Optional) Set to `true` to enable debug logging in Cloudflare logs

**Important**: The worker validates that `ORIGIN_HOSTNAME` is set. If missing, it returns a 500 error with a clear message.

### Deploy Steps

**Cloudflare Dashboard Deployment**:

1. Navigate to **Cloudflare Dashboard** → **Workers & Pages**
2. Create new Worker or select existing "aem-worker"
3. Copy contents of `cloudflare-worker.js`
4. Paste into Dashboard code editor
5. Click **"Save and Deploy"**

**Configure Environment Variables** (in Dashboard):
- Settings → Variables → Add variable
- `ORIGIN_HOSTNAME` = `main--allaboutv2--ddttom.aem.page` (Required)
- `DEBUG` = `true` (Optional - enables logging)
- `ORIGIN_AUTHENTICATION` = token (Optional)
- `PUSH_INVALIDATION` = `disabled` (Optional)

**Configure Routes** (in Dashboard):
- Settings → Triggers → Add Route
- `yourdomain.com/*`
- `www.yourdomain.com/*`

**Post-Deployment**:
```bash
# Test worker is responding
curl -I https://yourdomain.com

# Verify JSON-LD generation
curl -s https://yourdomain.com/ | grep -A 10 'application/ld+json'

# Check CORS headers
curl -I https://yourdomain.com | grep -i access-control
```

## How It Works

### Request Flow

1. Request comes in for a page
2. Worker handles CORS preflight if needed
3. Sanitises URL parameters based on request type
4. Forwards request to EDS origin
5. For HTML responses:
   - Extracts HTML text from response body
   - Applies pure string operations:
     - Replaces picture placeholders with author images
     - Removes all HTML comments
   - Creates new Response with processed HTML
   - HTMLRewriter processes the response stream:
     - Detects malformed error script containing "article" (authoring error workaround)
     - Removes error scripts and error meta tags
     - Extracts metadata from meta tags (triggers, titles, dates, authors, etc.)
     - When `</head>` closing tag is reached, generates and inserts JSON-LD (if triggered)
     - Removes non-social meta tags during extraction
6. Creates new Response object for header modifications
7. Adds CORS headers
8. Returns response

### Critical Implementation Detail

The Worker must process HTMLRewriter **before** creating a new Response object for header modifications. This is because creating a new Response consumes the body stream, making it unavailable for HTMLRewriter:

```javascript
// CORRECT order with string operations + HTMLRewriter:
resp = await fetch(req);
let htmlText = await resp.text();           // Extract HTML text
htmlText = replacePicturePlaceholder(htmlText);  // Pure string op
htmlText = removeHtmlComments(htmlText);    // Pure string op
resp = new Response(htmlText, resp);        // Create new Response
resp = new HTMLRewriter().transform(resp);  // Then HTMLRewriter
resp = new Response(resp.body, resp);       // Finally modify headers

// WRONG order (HTMLRewriter before string ops):
resp = await fetch(req);
resp = new HTMLRewriter().transform(resp);  // Body consumed
let htmlText = await resp.text();           // Nothing left to read
```

### HTMLRewriter Timing and Insertion Point

HTMLRewriter processes elements **as they appear** in the HTML stream. This creates a timing challenge for JSON-LD generation:

- The `<head>` tag appears before meta tags
- Handlers on `<head>` fire before metadata is extracted
- Therefore, trying to insert JSON-LD at `<head>` results in empty data

**Solution**: Insert JSON-LD at the `</head>` closing tag, which appears after all meta tags:

```
HTML Stream Order:
1. <head>           ← Too early - meta tags not processed yet
2. <title>
3. og:title         ← Extract title
4. og:description   ← Extract description
5. All other meta tags processed
6. </head>          ← Perfect insertion point - all metadata extracted
```

This ensures all `<head>` metadata is available when generating the JSON-LD script.

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
- Inserts the JSON-LD script right before `</head>` closes (after all meta tags processed)
- Only includes fields that have values in the JSON-LD
- Removes specified meta tags during extraction

**Why insert at `</head>` closing tag?** HTMLRewriter processes elements as it encounters them. The opening `<head>` tag appears before meta tags, so handlers on `<head>` fire before metadata is extracted. The closing `</head>` tag appears after all meta tags, ensuring all metadata has been processed before JSON-LD insertion.

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
  <meta name="author-url" content="https://allabout.network">
  <meta name="publication-date" content="10/12/2024">
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
      "name": "Tom Cranstoun",
      "url": "https://allabout.network"
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
| Metadata         | Value                      |
|------------------|----------------------------|
| jsonld           | article                    |
| author           | Tom Cranstoun              |
| author-url       | https://allabout.network   |
| publication-date | 10/12/2024                 |
| modified-date    | 10 December 2024           |
| longdescription  | Detailed text here         |
```

**Use `jsonld` (not `json-ld`)** - avoids EDS authoring errors, cleaner markup.

**Date formats:** You can use any format (UK numeric `10/12/2024`, month names `10 December 2024`, `Dec 10 2024`, etc.). The worker automatically converts to ISO 8601 format.

**Author URL fallback:** If you don't provide `author-url`, the worker will automatically use your `linkedin` meta tag as the author URL (if present). This keeps your LinkedIn meta for social media while also using it for structured data.

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
3. Worker detects trigger, extracts all metadata (author, dates, descriptions)
4. Worker removes non-social metadata tags during extraction (author-url, dates, descriptions)
5. Worker keeps social and attribution tags (og:*, twitter:*, linkedin, author)
6. Worker generates fresh JSON-LD from extracted metadata
7. Worker inserts JSON-LD right before `</head>` closes (after all meta tags processed)

**Note:** Worker always uses latest metadata from page, ensuring JSON-LD stays current.

## License

Based on Adobe's Cloudflare Worker template (Apache License 2.0)  
Modified by Digital Domain Technologies Ltd

## Limitations

- Only processes HTML responses
- Currently works around an authoring error that generates malformed JSON-LD scripts
- Requires at least `og:title` to generate JSON-LD
- Dates are automatically converted to ISO 8601; invalid dates are omitted
- Publisher name is derived from the public-facing request hostname (e.g., `allabout.network`)
- Author URL is optional and not validated (schema.org handles validation)

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

### HTTP Header Manipulation

The worker modifies response headers to handle edge cases in the double-CDN architecture (Cloudflare → Adobe Fastly → Adobe EDS):

**CSP Header Removal on 304 Responses**:
```javascript
if (resp.status === 304) {
  resp.headers.delete('Content-Security-Policy');
}
```

- **Why**: HTTP 304 (Not Modified) responses have no body content
- **Issue**: Content-Security-Policy header is only meaningful for responses with content
- **Solution**: Remove CSP header from 304 responses to keep headers clean

**Age Header Removal**:
```javascript
resp.headers.delete('age');
```

- **Why**: Double-CDN architecture issue
- **Flow**: Request → Cloudflare → Adobe Fastly → Adobe EDS
- **Issue**: Adobe's `age` header reflects time since Adobe's CDN cached it, not time since Cloudflare cached it
- **Problem**: End users see inaccurate cache age (doesn't include Cloudflare's cache time)
- **Solution**: Remove Adobe's `age` header so browsers don't receive misleading cache timing

**x-robots-tag Header Removal**:
```javascript
resp.headers.delete('x-robots-tag');
```

- **Why**: SEO control at edge rather than origin
- **Issue**: Adobe EDS might set `x-robots-tag` at origin
- **Solution**: Remove origin's robots directive to allow full SEO control at Cloudflare edge
- **Benefit**: Can implement custom SEO rules in worker without origin interference

These header modifications ensure clean, accurate responses that properly reflect the complete CDN architecture and provide maximum flexibility for edge-level optimizations.

## Troubleshooting

### JSON-LD not appearing in pages

1. **Check trigger**: View page source and look for `<script type="application/ld+json" data-error` containing "article"
2. **Check Worker is deployed**: Look for CORS headers in response (`access-control-allow-origin: *`)
3. **Verify routes**: Ensure `yourdomain.com/*` route is configured
4. **Clear cache**: Use Ctrl+Shift+R (or Cmd+Shift+R) to bypass cache
5. **Check metadata**: Page must have at least `og:title` meta tag
6. **View source**: Check raw HTML, not rendered page

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

### ⚠️ CRITICAL: The Two-File Rule

**This project MUST follow the two-file testing system** - this is non-negotiable.

**File 1:** `cloudflare-worker.js` - Production worker code
**File 2:** `cloudflare-worker.test.js` - Unified test file (unit + integration)

**Core Principle:** All worker functionality must be implemented as **pure JavaScript functions** that can be tested without Cloudflare Workers runtime.

**Why this matters:**
- Cloudflare Workers runtime provides APIs (like `HTMLRewriter`) that don't exist in Node.js
- Using runtime-specific APIs for core logic makes code untestable
- Pure functions (string input → string output) are fully testable

**Example of correct approach:**
```javascript
// ✅ CORRECT - Pure function, fully testable
export const replacePicturePlaceholder = (html) => {
  const pattern = /<div>\s*<div>([^<]*Picture Here[^<]*)<\/div>\s*<\/div>/g;
  return html.replace(pattern, replacement);
};

// Can be tested in Node.js without Cloudflare runtime
test('replaces Picture Here with image', () => {
  const result = replacePicturePlaceholder('<div><div>Picture Here</div></div>');
  expect(result).toContain('<img');
});
```

**Example of incorrect approach:**
```javascript
// ❌ WRONG - Requires Cloudflare runtime, untestable
export const handlePicturePlaceholder = (element) => {
  element.ontext((text) => {...});  // TypeError in Node.js tests
};
```

**See `TESTING.md` for complete two-file rule documentation.**

### Simple, Robust Testing

The project uses a single test file `cloudflare-worker.test.js` that covers both:
1. **Unit Tests**: Verifies pure functions with string input/output (no runtime needed)
2. **Integration Tests**: Verifies the entire `fetch` flow using mocked Cloudflare APIs

This two-file approach ensures:
- ✅ All core logic is testable without Cloudflare runtime
- ✅ Pure functions can be tested with simple string operations
- ✅ Integration tests verify correct wiring with mocked APIs
- ✅ No separate test files or complex test infrastructure needed

### Quick Test Commands

```bash
# Run all tests (Unit + Integration)
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

**Tests cover:**
- Worker version validation (2 tests)
- Helper functions (19+ tests)
- Environment validation
- CORS headers
- URL sanitization
- JSON-LD generation
- Picture placeholder replacement (6 unit tests)
- Debug logging
- Error handling
- Handler wiring (including div handler)
- Version header presence in responses (2 integration tests)

**Status:** ✅ 63 tests passing

For complete testing details, see [TESTING.md](TESTING.md).

### Local HTML Processing Test

**Validates HTML transformations using actual test.html file without Cloudflare runtime.**

The `test-local-html.js` script reads the actual `cloudflare/test.html` file and processes it through the worker's pure string handling functions to ensure HTML is properly transformed.

**Run the test:**
```bash
npm run test:local
```

**What it does:**
1. Reads actual `cloudflare/test.html` file
2. Processes through all pure string functions in correct order:
   - `replacePicturePlaceholder()` - replaces "Picture Here" text
   - `injectJsonLd()` - generates JSON-LD from metadata
   - `removeNonSocialMetadata()` - removes non-social meta tags
   - `removeHtmlComments()` - removes HTML comments
3. Validates all transformations with 20 comprehensive tests
4. Writes processed output to `cloudflare/test-rendered.html`

**Visual Testing with test-rendered.html:**

The generated `test-rendered.html` file serves as a **visual test artifact** that shows exactly how the worker transforms HTML. Open it locally (file://) to inspect:

- **HTML Transformation Tests** (Sections 3-6): Show the actual transformed content
  - ✓ JSON-LD script injected
  - ✓ Metadata cleaned up
  - ✓ Picture placeholders replaced
  - ✓ Comments removed

- **CORS/Header Tests** (Sections 1-2): Show helpful message when opened locally
  - ⚠️ "Requires Cloudflare Worker (headers added at request time, not in HTML)"
  - These tests only work when served via Cloudflare CDN (not in local file)

This makes it easy to visually verify that worker transformations are working correctly without deploying to Cloudflare.

**Test coverage:**
- HTML comment removal (3 tests)
- Picture placeholder replacement (3 tests)
- Combined processing (1 test)
- HTML structure integrity (5 tests)
- Output analysis and size reduction (1 test)

**Example output:**
```
🧪 LOCAL HTML PROCESSING TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Loaded 21365 characters

1️⃣  HTML Comment Removal
✓ Comments removed
✓ Trigger comment removed
✓ Hidden divs comment removed

2️⃣  Picture Placeholder Replacement
✓ Picture Here replaced
✓ Image tag inserted: URL: true, Alt: true
✓ Non-matching text preserved

3️⃣  Combined Processing
✓ Both transformations applied

4️⃣  HTML Structure Integrity
✓ DOCTYPE preserved
✓ HTML tags preserved
✓ Head section preserved
✓ Body section preserved
✓ Meta tags preserved

5️⃣  Output Analysis
Original size: 21365 bytes
Processed size: 21169 bytes
Reduction: 196 bytes (0.92%)
✓ Size reduced: 196 bytes saved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ ALL TESTS PASSED
Tests: 13/13 passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Processed HTML written to: test-rendered.html
💡 Compare with test.html to verify transformations
```

**Why this test matters:**
- Validates string operations work correctly in isolation
- Tests with real production HTML (not mocked data)
- No Cloudflare runtime dependency (runs in Node.js)
- Provides visual output for manual inspection
- Complements unit tests by using actual test file

**Compare output:**
```bash
# View original HTML
cat cloudflare/test.html

# View processed HTML
cat cloudflare/test-rendered.html

# Or diff them
diff cloudflare/test.html cloudflare/test-rendered.html
```

### Integration Testing

**Comprehensive Deployment Test Page**:

A complete test page is available at `/cloudflare/test.html` that validates all worker features:

1. Deploy worker to Cloudflare Dashboard
2. Wait 30 seconds for global propagation
3. Access: `https://allabout.network/cloudflare/test.html`
4. Tests auto-run and display results with visual indicators

**Tests performed:**
- ✅ Version header (`cfw`) with semantic versioning
- ✅ CORS headers (Access-Control-Allow-*)
- ✅ JSON-LD generation and schema structure
- ✅ Date formatting (ISO 8601)
- ✅ Metadata cleanup (non-social tags removed)

**Manual JSON-LD test**:
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
 
