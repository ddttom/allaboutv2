# Cloudflare Worker JSON-LD Generation Issue

**Date**: 2025-12-10
**Status**: Logic verified locally, production deployment needed
**Priority**: High - SEO feature not working in production

## Problem Statement

The Cloudflare Worker is not generating JSON-LD structured data for pages that have the `jsonld=article` metadata trigger, despite the worker executing and processing HTML correctly.

## Production Symptoms

### What's Working ✅
- Worker is executing (confirmed by meta tag removal)
- Trigger meta tag `<meta name="jsonld" content="article">` is being removed
- `longdescription` meta tag is being removed
- CORS headers are being added
- Origin hostname validation passes

### What's NOT Working ❌
- JSON-LD `<script type="application/ld+json">` is **not** being generated
- No JSON-LD appears in final HTML output

## Evidence

### Input HTML (from origin: main--allaboutv2--ddttom.aem.page)
```html
<head>
  <title>About DDT | Services | Digital transformation</title>
  <meta property="og:title" content="About DDT | Services | Digital transformation">
  <meta property="og:description" content="Meet Tom Cranstoun...">
  <meta property="og:url" content="https://allabout.network/">
  <meta property="og:image" content="https://allabout.network/media_174e3...png">
  <meta name="jsonld" content="article">        ← TRIGGER PRESENT
  <meta name="longdescription" content="...">  ← DESCRIPTION PRESENT
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
```

### Output HTML (from production: allabout.network)
```html
<head>
  <title>About DDT | Services | Digital transformation</title>
  <meta property="og:title" content="About DDT | Services | Digital transformation">
  <meta property="og:description" content="Meet Tom Cranstoun...">
  <meta property="og:url" content="https://allabout.network/">
  <meta property="og:image" content="https://allabout.network/media_174e3...png">
  <!-- jsonld meta tag REMOVED ✓ -->
  <!-- longdescription meta tag REMOVED ✓ -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- NO JSON-LD SCRIPT HERE ✗ -->
</head>
```

## Technical Analysis

### Worker Logic Flow
1. **Trigger Detection** (Line 153-161): Detects `<meta name="jsonld" content="article">` and sets `article.shouldGenerateJsonLd = true`
2. **Metadata Extraction** (Lines 175-239): Extracts og:title, og:description, longdescription, etc.
3. **JSON-LD Generation** (Lines 241-323): On viewport meta tag, generates JSON-LD if both conditions met:
   - `article.shouldGenerateJsonLd === true`
   - `article.title` is not null

### Hypothesis

The worker is:
- ✅ Setting `article.shouldGenerateJsonLd = true` (trigger removed = handler fired)
- ❌ NOT extracting `article.title` (JSON-LD not generated)

**Possible causes:**
1. HTMLRewriter handler for `meta[property="og:title"]` not firing
2. `getAttribute('content')` returning null/undefined
3. Closure issue with `article` object in HTMLRewriter context
4. Deployed code is old version without Trigger 2

## Local Testing Results

### ✅ All Tests Pass (30 tests)
- Unit tests confirm buildJsonLd() creates correct structure
- Integration tests confirm full HTML → JSON-LD workflow works
- Manual test script successfully extracts metadata and generates JSON-LD

### Test Commands
```bash
cd cloudflare/files
npm test                          # All 30 tests pass
node test-local.js               # Manual test confirms logic works
```

### Test Output (Manual Script)
```
✓ Trigger fired: shouldGenerateJsonLd = true
✓ Title extracted: About DDT | Services | Digital transformation
✓ Description extracted: This page introduces Tom Cranstoun...
✓ JSON-LD generation would proceed!

Generated JSON-LD:
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "About DDT | Services | Digital transformation",
  "description": "This page introduces Tom Cranstoun...",
  ...
}
```

## Code Changes Made

### 1. Added Debug Logging
**File**: `cloudflare-worker.js`
**Lines**: 179-182, 243-259, 304-312

```javascript
// Line 179-182: Log og:title extraction
if (DEBUG) {
  console.log('og:title extracted:', { content, hasContent: !!content });
}

// Line 243-250: Log viewport handler state
if (DEBUG) {
  console.log('Viewport handler:', {
    shouldGenerate: article.shouldGenerateJsonLd,
    hasTitle: !!article.title,
    title: article.title,
  });
}

// Line 254-259: Log why JSON-LD skipped
if (DEBUG) {
  console.log('JSON-LD skipped:', {
    reason: !article.shouldGenerateJsonLd ? 'no trigger' : 'no title',
  });
}
```

### 2. Fixed Hostname Validation
**File**: `cloudflare-worker.js`
**Line**: 102

```javascript
// Before: Only .live domains
/^https:\/\/main--.*--.*\.(?:aem|hlx)\.live/

// After: Both .live and .page domains, http and https
/^https?:\/\/main--.*--.*\.(?:aem|hlx)\.(?:live|page)/
```

### 3. Refactored for Testing
**Files Created**:
- `worker-logic.js` - Extracted pure functions
- `worker-logic.test.js` - Unit tests (7 tests)
- `worker-integration.test.js` - Integration tests (2 tests)
- `test-local.js` - Manual test script
- `test-local.html` - Test HTML fixture

## Environment Configuration

### Local Development (wrangler.toml)
```toml
[vars]
ORIGIN_HOSTNAME = "main--allaboutv2--ddttom.aem.page"
DEBUG = "true"
```

### Production (Cloudflare Dashboard)
**Required Environment Variables**:
- `ORIGIN_HOSTNAME` = `main--allaboutv2--ddttom.aem.page` (or .aem.live)
- `DEBUG` = `true` (to enable logging)
- `PUSH_INVALIDATION` = `enabled` (optional)

## Recommended Next Steps

### 1. Deploy Updated Worker
```bash
cd cloudflare/files
npx wrangler login
npx wrangler deploy --env production
```

### 2. Enable Debug Logging in Production
Via Cloudflare Dashboard:
1. Go to Workers & Pages → aem-worker
2. Settings → Variables
3. Add/Update: `DEBUG` = `true`

### 3. Monitor Logs
```bash
npx wrangler tail
```

Then visit: https://allabout.network/

### 4. Look for Debug Output
Expected logs if working:
```
og:title extracted: { content: "About DDT...", hasContent: true }
Viewport handler: { shouldGenerate: true, hasTitle: true, title: "About DDT..." }
JSON-LD generated successfully: { url: "/", fields: [...], hasAuthor: false, hasImage: true }
```

Expected logs if failing:
```
Viewport handler: { shouldGenerate: true, hasTitle: false, title: null }
JSON-LD skipped: { reason: "no title" }
```

### 5. Verify Fix
After deployment, check:
```bash
curl -s 'https://allabout.network/' | grep -A 10 'application/ld+json'
```

Should see:
```html
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "About DDT | Services | Digital transformation",
  ...
}</script>
```

## Files Modified

### Production Files
- ✅ `cloudflare-worker.js` - Main worker (debug logging added, regex fixed)
- ⚠️ `cloudflare-worker-test.js` - Local test file (regex fixed, DO NOT DEPLOY)

### Test Files (NOT for deployment)
- `worker-logic.js` - Extracted functions for testing
- `worker-logic.test.js` - Unit tests
- `worker-integration.test.js` - Integration tests
- `test-local.js` - Manual test script
- `test-local.html` - Test HTML fixture

### Configuration
- `wrangler.toml` - Set DEBUG=true for local dev

## Critical Information for Debug Team

### HTMLRewriter Behavior
- Handlers fire as elements appear in HTML stream
- `article` object created in function scope (line 127-137)
- Handlers access `article` via closure
- Order: Triggers → Metadata → Viewport

### Key Code Locations

**cloudflare-worker.js**:
- Line 127-137: `article` object initialization
- Line 140: HTMLRewriter instantiation
- Line 153-161: Trigger 2 handler (jsonld meta)
- Line 175-184: og:title extraction handler ← **SUSPECT**
- Line 241-323: Viewport handler (generates JSON-LD)

### Questions to Answer

1. **Is the deployed code current?**
   - Check deployed worker matches local cloudflare-worker.js
   - Verify Trigger 2 handler (lines 153-161) exists in production

2. **What do the logs show?**
   - Does "og:title extracted" appear?
   - What values does "Viewport handler" show?
   - Does "JSON-LD skipped" appear? What reason?

3. **Is HTMLRewriter working correctly?**
   - Are handlers firing in correct order?
   - Is `article` object accessible in all handlers?
   - Does `getAttribute('content')` return expected values?

## Contact

**Repository**: https://github.com/[your-org]/allaboutV2
**Files**: `cloudflare/files/`
**Production Worker**: aem-worker
**Production Domain**: allabout.network

## Appendix: Expected JSON-LD Output

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "About DDT | Services | Digital transformation",
  "description": "This page introduces Tom Cranstoun and his company Digital Domain Technologies (DDT) as experts in Adobe Experience Manager (AEM) consulting...",
  "url": "https://allabout.network/",
  "image": {
    "@type": "ImageObject",
    "url": "https://allabout.network/media_174e3e1a2ea13297a33d07d684a725d4cbbe7b902.png"
  },
  "publisher": {
    "@type": "Organization",
    "name": "allabout.network"
  }
}
```
