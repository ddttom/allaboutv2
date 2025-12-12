# Testing Guide for Cloudflare Worker

## ⚠️ CRITICAL: The Two-File Rule

**This is the most important testing principle for the Cloudflare worker.**

### The Rule

**File 1:** `cloudflare-worker.js` - Production worker code
**File 2:** `cloudflare-worker.test.js` - Single unified test file (unit + integration tests)

**NO other test files are allowed.** All tests must be in `cloudflare-worker.test.js`.

### Core Principle: Pure Functions

**All worker functionality MUST be implemented as pure JavaScript functions that can be tested without Cloudflare Workers runtime.**

**Why?**
- Cloudflare Workers runtime provides APIs (like `HTMLRewriter`) that don't exist in Node.js
- Using runtime-specific APIs for core logic makes code **untestable**
- Pure functions (string input → string output) are **fully testable** in any environment

### Production Bug Example (2025-12-12)

This code caused a production failure because it violated the two-file rule:

```javascript
// ❌ WRONG - Requires Cloudflare runtime, untestable in Node.js
export const handlePicturePlaceholder = (element) => {
  let textContent = '';

  element.ontext((text) => {
    textContent += text.text;
  });

  element.onendtag(() => {
    if (textContent.includes('Picture Here')) {
      element.replace('<img src="..." alt="...">');
    }
  });
};

// Test fails with: TypeError: element.ontext is not a function
```

**The problem:** `element.ontext()` and `element.onendtag()` are HTMLRewriter element handler methods that only exist in Cloudflare Workers runtime, not in Node.js.

### Correct Approach: Pure String Functions

```javascript
// ✅ CORRECT - Pure function, fully testable
export const replacePicturePlaceholder = (html) => {
  const pattern = /<div>\s*<div>([^<]*Picture Here[^<]*)<\/div>\s*<\/div>/g;
  const replacement = `<div><img src="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL}" `
    + `alt="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT}"></div>`;

  return html.replace(pattern, replacement);
};

// Test works perfectly in Node.js - no runtime needed
test('replaces Picture Here with image', () => {
  const html = '<div><div>Picture Here</div></div>';
  const result = replacePicturePlaceholder(html);

  expect(result).toContain('<img');
  expect(result).toContain(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
  expect(result).not.toContain('Picture Here');
});
```

### Processing Flow Pattern

**When you need both string operations and HTMLRewriter:**

```javascript
export default {
  async fetch(request, env) {
    // 1. Fetch response from origin
    let resp = await fetch(request);

    // Only process HTML responses
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {

      // 2. Extract HTML text (consumes body stream)
      let htmlText = await resp.text();

      // 3. Apply pure string operations (TESTABLE without runtime)
      htmlText = replacePicturePlaceholder(htmlText);
      htmlText = applyOtherTransformations(htmlText);

      // 4. Create new Response with processed text
      resp = new Response(htmlText, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });

      // 5. NOW apply HTMLRewriter for runtime-specific features
      resp = new HTMLRewriter()
        .on('meta[property="og:title"]', handleOgTitle)
        .on('meta[name="description"]', handleDescription)
        .transform(resp);
    }

    // 6. Add CORS headers and return
    return new Response(resp.body, {
      ...resp,
      headers: {
        ...resp.headers,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
```

**Key insight:** Pure string functions run BEFORE HTMLRewriter, making them testable.

### Test Structure Requirements

**All tests must follow this structure in `cloudflare-worker.test.js`:**

```javascript
import { describe, test, expect } from 'vitest';
import worker, {
  replacePicturePlaceholder,
  handleOgTitle,
  WORKER_VERSION,
} from './cloudflare-worker.js';

// Unit Tests - Test pure functions with string input/output
describe('Pure Functions (Unit Tests)', () => {
  test('replacePicturePlaceholder replaces exact match', () => {
    const html = '<div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);
    expect(result).toContain('<img');
    expect(result).not.toContain('Picture Here');
  });

  test('replacePicturePlaceholder handles multiple occurrences', () => {
    const html = '<div><div>Picture Here</div></div><p>Text</p>'
      + '<div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);

    const imgCount = (result.match(/<img/g) || []).length;
    expect(imgCount).toBe(2);
  });
});

// Integration Tests - Test request flow with mocked APIs
describe('Integration Tests', () => {
  test('handleRequest processes HTML responses', async () => {
    // Mock global APIs
    global.HTMLRewriter = MockHTMLRewriter;
    global.Response = MockResponse;
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await worker.fetch(mockRequest, mockEnv);

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('x-worker-version')).toBe(WORKER_VERSION);
  });
});
```

### Red Flags (Violations)

**❌ Creating separate test files:**
- `cloudflare-worker.unit.test.js` ← WRONG
- `cloudflare-worker.integration.test.js` ← WRONG
- Only `cloudflare-worker.test.js` is allowed

**❌ Using runtime-specific APIs for core logic:**
- `element.ontext()` ← Untestable
- `element.onendtag()` ← Untestable
- `element.replace()` ← Untestable

**❌ Skipping tests because "it needs the runtime":**
- If you can't test it, refactor to pure functions

**✅ Correct patterns:**
- Pure functions for all transformations
- String operations (regex, replace, substring)
- Single unified test file
- HTMLRewriter only for features that absolutely require it

### Enforcement Checklist

**Before committing any worker changes:**

1. ✅ All core logic implemented as pure functions
2. ✅ All pure functions have unit tests with string input/output
3. ✅ Only one test file: `cloudflare-worker.test.js`
4. ✅ All tests pass: `npm test`
5. ✅ Test coverage maintained: `npm run test:coverage`
6. ✅ No HTMLRewriter used for testable logic

**Use `/check-cloudflare-tests` command to validate test structure.**

## Overview

This testing suite ensures the reliability of the Cloudflare Worker through a unified test file `cloudflare-worker.test.js` that covers both unit-level logic and integration-level wiring.

## Test Environment Setup

### Prerequisites

```bash
cd cloudflare/files
npm install
```

## Running Tests

### All Tests (Unit + Integration)

Run the full test suite with Vitest:

```bash
npm test
```

**Output:**
```
✓ cloudflare-worker.test.js (19+ tests)
  ✓ Helper Functions
  ✓ Handler Functions
  ✓ Integration Tests
```

## Strategy

### 1. Unit Tests (Handlers)
We extract individual handler functions (e.g., `handleJsonLdMeta`, `handleOgTitle`) from `cloudflare-worker.js` and test them in isolation. This allows us to pass mock elements and verify that the logic modifies the `article` state or the DOM as expected.

### 2. Integration Tests (Wiring)
We test the main `fetch` handler by mocking `HTMLRewriter` and `fetch`. This ensures that:
- The worker registers the correct handlers for the correct selectors.
- The request flow (CORS, URL sanitization) works as expected.
- The `article` state is correctly built and passed to `buildJsonLd`.

## Manual Testing (Production)

Since the worker is deployed via Cloudflare Dashboard, manual testing is done against the deployed worker.

### Test Production Worker

```bash
# Test CORS headers
curl -I https://allabout.network | grep -i access-control

# Test JSON-LD generation
curl -s https://allabout.network/blog/article | grep -i "application/ld+json"

# Test specific page
curl -s https://allabout.network/path/to/page | grep "application/ld+json"
```

### Verify Environment Variables

Test that the worker validates environment variables:
1. Temporarily remove `ORIGIN_HOSTNAME` from Dashboard settings
2. Request any page - should return 500 with clear error message
3. Re-add `ORIGIN_HOSTNAME` and verify recovery

## Production Testing

### View Logs

View logs in Cloudflare Dashboard:
1. Workers & Pages → aem-worker
2. Click "Logs" tab
3. View real-time logs with DEBUG=true enabled

### Verify Production Deployment

```bash
# Test CORS headers
curl -I https://allabout.network | grep -i access-control

# Test JSON-LD generation
curl -s https://allabout.network/blog/article | grep -i "application/ld+json"
```

## Test Coverage

**Status:** ✅ All tests passing

- **Functions:** 100% coverage of exported helpers.
- **Handlers:** 100% coverage of extracted handlers.
- **Integration:** Core flow covered by mock integration test.

## Troubleshooting

### Tests Failing
If tests fail, check:
1. Did you change a handler logic? Update the unit test.
2. Did you change a selector? Update the integration test expectations.

### "No test files found"
Ensure your test file is named `cloudflare-worker.test.js` so Vitest picks it up automatically.
