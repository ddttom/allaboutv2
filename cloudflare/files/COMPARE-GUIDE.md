# Before/After Comparison Guide

## Overview

This guide shows you how to see **exactly what transformations** the Cloudflare worker applies to requests and responses. You can compare the origin response (before) with the worker response (after).

## Tools Available

### 1. Terminal Comparison Tool (Detailed)

**File:** `compare-responses.sh`
**Command:** `npm run compare`

**Features:**
- Compares headers (CORS, age, x-robots-tag)
- Analyzes HTML body transformations
- Counts JSON-LD scripts (before/after)
- Tracks metadata removal
- Shows file size changes
- Generates detailed summary

**Usage:**
```bash
# Start dev server first
npm run dev

# In another terminal, run comparison
npm run compare

# Or compare specific page
npm run compare /blogs/ddt/ai/aem-sidekick-copilot
```

### 2. Visual Comparison Tool (Interactive)

**File:** `compare-visual.html`
**Command:** `npm run compare:visual`

**Features:**
- Beautiful dark-themed UI
- Side-by-side comparison
- Real-time fetching
- Interactive stats
- Color-coded changes
- Transformation summary

**Usage:**
```bash
# Start dev server first
npm run dev

# Open visual tool (macOS)
npm run compare:visual

# Or open manually in browser
open compare-visual.html
```

## Quick Start

### Step 1: Start Dev Server

```bash
cd cloudflare/files
npm run dev
```

Wait for: `⛅️ wrangler 3.80.0`

### Step 2: Run Comparison

**Option A: Terminal (detailed analysis)**
```bash
npm run compare
```

**Option B: Visual (interactive UI)**
```bash
npm run compare:visual
```

## What Gets Compared

### Headers

**BEFORE (Origin):**
- No CORS headers
- Has `age` header
- Has `x-robots-tag` header
- Standard content-type

**AFTER (Worker):**
- ✅ CORS headers added
- ❌ `age` header removed
- ❌ `x-robots-tag` header removed
- Same content-type

### HTML Body

**BEFORE (Origin):**
```html
<!-- Error script from authoring issue -->
<script type="application/ld+json"
  data-error="error in json-ld: Unexpected token 'a', &quot;article&quot; is not valid JSON">
</script>

<!-- Metadata that will be removed -->
<meta name="author" content="Tom Cranstoun">
<meta name="description" content="Article description">
<meta name="longdescription" content="Detailed description">
<meta name="publication-date" content="2024-12-10">

<!-- Social media tags (preserved) -->
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Description">
```

**AFTER (Worker):**
```html
<!-- Valid JSON-LD generated -->
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
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

<!-- Metadata removed (author, description, dates) -->
<!-- Social media tags preserved -->
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Description">
```

## Example Output (Terminal Tool)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Cloudflare Worker Before/After Comparison
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Dev server is running

Test page: /blogs/ddt/ai/aem-sidekick-copilot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. FETCHING RESPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fetching BEFORE (direct origin)...
✓ Origin response saved

Fetching AFTER (through worker)...
✓ Worker response saved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. HEADERS COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE (Origin):
────────────────
content-type: text/html; charset=utf-8
age: 123

AFTER (Worker):
───────────────
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: Content-Type
content-type: text/html; charset=utf-8

🔍 Key Differences:
──────────────────
✓ CORS headers added
✓ 'age' header removed
✓ 'x-robots-tag' header removed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. HTML BODY COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE (Origin):
────────────────
JSON-LD scripts found: 1
JSON-LD error scripts: 1
Sample error script:
data-error="error in json-ld: Unexpected token 'a', &quot;article&quot; is not valid JSON"

AFTER (Worker):
───────────────
JSON-LD scripts found: 1
Valid JSON-LD scripts: 1
Sample valid JSON-LD:
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Building an AEM Sidekick Copilot",
  "description": "Detailed guide on creating an AI assistant...",
  "author": {
    "@type": "Person",
    "name": "Tom Cranstoun"
  }
}</script>

Metadata Cleanup:
─────────────────
name="author" meta tags:
  Before: 1
  After:  0
  ✓ Removed

name="longdescription" meta tags:
  Before: 1
  After:  0
  ✓ Removed

name="description" meta tags:
  Before: 1
  After:  0
  ✓ Removed

property="og:*" meta tags:
  Before: 8
  After:  8
  ✓ Preserved (social media tags kept)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. FILE SIZE COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before: 52,341 bytes
After:  52,789 bytes
Change: +448 bytes (JSON-LD added)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transformations Applied:

✓ CORS headers added
✓ JSON-LD generated (1 scripts)
✓ Metadata cleaned up (3 meta tags removed)
✓ Headers cleaned up (2 headers removed)
✓ Social media tags preserved (8 og:* tags)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Example: Visual Tool

The visual tool provides:

1. **Side-by-side panels:**
   - Left: BEFORE (Origin) - Orange theme
   - Right: AFTER (Worker) - Green theme

2. **Stats cards:**
   - JSON-LD script counts
   - Metadata tag counts
   - File sizes
   - Color-coded changes (green=added, red=removed, blue=preserved)

3. **Transformation summary:**
   - ✓ Success items (green)
   - ⚠ Warnings (yellow)
   - ○ Info items (blue)

4. **Interactive:**
   - Enter custom test URLs
   - Fetches in real-time
   - View raw HTML in browser DevTools

## Troubleshooting

### Dev Server Not Running

**Error:** `❌ Dev server not running at http://localhost:8787`

**Solution:**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run comparison
npm run compare
```

### No Transformations Detected

**Possible causes:**
1. Page doesn't have `| json-ld | article |` metadata
2. Page doesn't have `og:title` meta tag
3. Worker not processing the page

**Check:**
```bash
# View page source directly
curl -s http://localhost:8787/your-page | grep -i "json-ld"
curl -s http://localhost:8787/your-page | grep -i "og:title"
```

### Visual Tool Not Opening

**macOS:**
```bash
open compare-visual.html
```

**Linux:**
```bash
xdg-open compare-visual.html
```

**Windows:**
```bash
start compare-visual.html
```

## Advanced Usage

### Compare Specific Headers

```bash
# Add custom header inspection
curl -I http://localhost:8787/test-page | grep -i "cache-control"
```

### View Raw HTML Diff

```bash
# Run comparison first
npm run compare

# Files are saved in temp directory (shown at end)
# Then diff them:
diff -u /tmp/before_body.html /tmp/after_body.html | less
```

### Test Different Pages

```bash
# Terminal tool
npm run compare /blogs/ddt/integrations/custom-page

# Visual tool - enter in UI
/blogs/ddt/integrations/custom-page
```

### Automated Comparison in CI

```bash
#!/bin/bash
# Save as: test-transformations.sh

npm run dev &
DEV_PID=$!
sleep 5  # Wait for dev server

npm run compare /test-page

kill $DEV_PID
```

## Understanding the Results

### Good Transformations

✅ **CORS headers added** - Enables cross-origin requests
✅ **JSON-LD generated** - Improves SEO with structured data
✅ **Metadata removed** - Cleans up non-social meta tags
✅ **Headers removed** - Removes age, x-robots-tag
✅ **Social media tags preserved** - Keeps og:*, twitter:* tags

### Expected Behavior

- **File size increase** - JSON-LD adds ~300-500 bytes
- **Same social tags** - og:*, twitter:* tags preserved
- **No description tag** - Removed after JSON-LD extraction
- **No author tag** - Removed after JSON-LD extraction

### Warning Signs

⚠️ **No JSON-LD generated** - Check trigger metadata
⚠️ **Social tags removed** - Bug in worker (shouldn't happen)
⚠️ **CORS not added** - Worker not processing request

## Integration with Testing

### Use in Test Workflow

```bash
# 1. Run automated tests
npm run test:all

# 2. Start dev server
npm run dev

# 3. Compare transformations
npm run compare

# 4. Manual testing
npm run test:manual
```

### Document Findings

When you run comparisons:
1. Screenshot the visual tool results
2. Save terminal output
3. Include in PR descriptions
4. Validate against requirements

## Related Documentation

- [TESTING.md](TESTING.md) - Complete testing guide
- [TEST-SUMMARY.md](TEST-SUMMARY.md) - Test environment overview
- [README.md](README.md) - Worker implementation details
- [SETUP.md](SETUP.md) - Quick reference guide

## Tips

1. **Always run dev server first** - Comparison tools require localhost:8787
2. **Test real pages** - Use actual blog posts for realistic comparisons
3. **Check both tools** - Terminal for details, visual for overview
4. **Compare production** - Test against live site after deployment
5. **Save results** - Document transformations for team review

---

**Need help?** See [TESTING.md](TESTING.md) for complete testing documentation.
