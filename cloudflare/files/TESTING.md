# Testing Guide for Cloudflare Worker

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

## Manual Testing (Local Dev)

You can still run the worker locally with Wrangler to test against real URLs.

### Start Development Server

```bash
npm run dev
```

Worker runs at: `http://localhost:8787` (or similar port).

**Note:** If specific port redirects are active in the worker code, you may need to disable them temporarily for local browser testing, or rely on `npm test` which bypasses network-level redirects.

### Manual Test Commands

```bash
# Test basic request
curl -I http://localhost:8787/

# Test generated JSON-LD (requires valid triggers on origin)
curl -s http://localhost:8787/path/to/page | grep "application/ld+json"
```

## Production Testing

### Deploy to Staging

```bash
npx wrangler deploy --env staging
```

### Test Production Worker

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
