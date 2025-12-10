# Testing Guide for Cloudflare Worker

## Overview

This testing suite treats `cloudflare-worker.js` as **read-only** and tests its behavior through multiple approaches:

1. **Unit Tests** - Test isolated helper functions
2. **Integration Tests** - Test worker behavior in simulated environment
3. **Manual Tests** - Test through Wrangler dev server
4. **Production Tests** - Test deployed worker

## Test Environment Setup

### Prerequisites

```bash
cd cloudflare/files
npm install
```

### Configuration

Ensure `wrangler.toml` has `ORIGIN_HOSTNAME` configured:

```toml
[vars]
ORIGIN_HOSTNAME = "main--allaboutv2--ddttom.aem.live"
DEBUG = "true"
```

## Running Tests

### 1. Unit Tests (Fast)

Tests helper functions extracted from worker code:

```bash
npm test
```

**What it tests:**
- `getExtension()` - File extension extraction
- `isMediaRequest()` - Media URL pattern matching
- `isRUMRequest()` - RUM endpoint detection
- Environment variable validation
- Debug flag handling
- Error scenarios

**Output:**
```
✓ cloudflare-worker.test.js (21 tests) 20ms

Test Files  1 passed (1)
     Tests  21 passed (21)
```

### 2. Integration Tests (Simulated Environment)

Tests worker behavior with mocked Cloudflare runtime:

```bash
npm run test:integration
```

**What it tests:**
- CORS header generation
- URL sanitization logic
- JSON-LD structure validation
- HTMLRewriter behavior
- Request flow
- Error handling
- Response status codes

**Coverage:**
- Environment variable validation ✅
- CORS headers ✅
- URL sanitization (media, JSON) ✅
- JSON-LD generation ✅
- Debug logging ✅
- Error handling ✅

### 3. All Tests (Combined)

Run both unit and integration tests:

```bash
npm run test:all
```

### 4. Test Server Suite (Automated)

Runs unit tests, linter, and provides dev server instructions:

```bash
npm run test:server
```

**What it does:**
1. Checks dependencies installed
2. Runs unit tests
3. Runs linter
4. Provides next steps for manual testing

## Manual Testing

### Start Development Server

```bash
npm run dev
```

Worker runs at: `http://localhost:8787`

Features:
- Hot reload on file changes
- Debug logging in terminal
- Request/response inspection
- Environment variable injection

### Manual Test Script

```bash
npm run test:manual
```

**Tests performed:**
1. Basic GET request
2. CORS headers presence
3. OPTIONS preflight request
4. Media request with query params
5. JSON request with query params
6. Draft request blocking (404)
7. Port redirect handling

**Example output:**
```
✓ Dev server is running

Test 1: Basic GET request
HTTP/1.1 200 OK

Test 2: CORS headers presence
✓ access-control-allow-origin: *

Test 3: OPTIONS preflight request
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```

### Manual Testing Commands

```bash
# Test basic request
curl -I http://localhost:8787/

# Test CORS headers
curl -I http://localhost:8787/ | grep -i access-control

# Test OPTIONS preflight
curl -X OPTIONS http://localhost:8787/ \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET"

# Test media request
curl -I http://localhost:8787/media_1234567890abcdef1234567890abcdef12345678.png?format=webp&width=800

# Test JSON request
curl -I http://localhost:8787/data.json?limit=10&offset=5

# Test draft blocking
curl -I http://localhost:8787/drafts/test-page
```

## Production Testing

### Deploy to Staging

```bash
npx wrangler deploy --env staging
```

### View Production Logs

```bash
npm run tail
```

### Test Production Worker

```bash
# Test CORS headers
curl -I https://allabout.network | grep -i access-control

# Test OPTIONS preflight
curl -X OPTIONS https://allabout.network \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET"

# Test JSON-LD generation
curl -s https://allabout.network/blog/article | grep -i "application/ld+json"
```

### Google Rich Results Test

Test JSON-LD structured data:
1. Navigate to: https://search.google.com/test/rich-results
2. Enter URL: `https://allabout.network/blog/article`
3. Verify Article schema is valid

## Test Coverage

### Current Coverage

**Unit Tests:** 21 tests ✅
- Helper functions: 100%
- Environment validation: 100%
- Debug flag handling: 100%

**Integration Tests:** 15 tests ✅
- CORS behavior: 100%
- URL sanitization: 100%
- JSON-LD structure: 100%
- Error handling: 100%

**Total:** 36 automated tests

### Test Matrix

| Feature | Unit | Integration | Manual | Production |
|---------|------|-------------|--------|------------|
| Environment validation | ✅ | ✅ | ✅ | ✅ |
| CORS headers | ✅ | ✅ | ✅ | ✅ |
| URL sanitization | ✅ | ✅ | ✅ | ✅ |
| JSON-LD generation | ✅ | ✅ | ⚠️ | ✅ |
| Debug logging | ✅ | ✅ | ✅ | ✅ |
| Error handling | ✅ | ✅ | ✅ | ✅ |
| HTMLRewriter | ❌ | ✅ | ⚠️ | ✅ |

Legend:
- ✅ Full coverage
- ⚠️ Partial coverage
- ❌ Not applicable

## Continuous Integration

### Pre-commit Checks

```bash
# Run all checks before committing
npm run test:server
```

### Pre-deployment Checks

```bash
# 1. Run all tests
npm run test:all

# 2. Run linter
npm run lint

# 3. Start dev server and test manually
npm run dev
# In another terminal:
npm run test:manual

# 4. Deploy to staging
npx wrangler deploy --env staging

# 5. Test staging deployment
curl -I https://your-worker-staging.workers.dev/
```

## Debugging Tests

### Enable Verbose Output

```bash
# Run tests with verbose logging
npm run test:all -- --reporter=verbose
```

### Run Single Test

```bash
# Run specific test file
npx vitest run cloudflare-worker.test.js

# Run specific test by name
npx vitest run -t "validates ORIGIN_HOSTNAME"
```

### Debug with Console Logs

```bash
# Enable debug mode in tests
DEBUG=true npm test
```

## Common Issues

### Dev Server Not Starting

**Problem:** Port 8787 already in use

**Solution:**
```bash
# Kill process on port 8787
lsof -i :8787 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Try again
npm run dev
```

### Tests Failing After Worker Changes

**Problem:** Tests fail after modifying worker code

**Solution:**
1. Update test expectations in `cloudflare-worker.test.js`
2. Re-run tests: `npm test`
3. If helper functions changed, update duplicated functions in test file

### HTMLRewriter Tests Not Working

**Problem:** HTMLRewriter is Cloudflare-specific

**Solution:**
- Use integration tests with mocked HTMLRewriter
- Test through Wrangler dev server
- Test in production deployment

## Test File Structure

```
cloudflare/files/
├── cloudflare-worker.js              # READ-ONLY worker code
├── cloudflare-worker.test.js         # Unit tests (21 tests)
├── cloudflare-worker.integration.test.js  # Integration tests (15 tests)
├── vitest.config.js                  # Vitest configuration
├── test-server.sh                    # Automated test runner
├── manual-test.sh                    # Manual testing script
└── TESTING.md                        # This file
```

## Best Practices

### Worker Code is Read-Only

**Important:** Never modify `cloudflare-worker.js` directly in tests. Instead:
- Mock Cloudflare globals (HTMLRewriter, Response, Request)
- Test through Wrangler dev server
- Validate behavior, not implementation

### Test Coverage Goals

- **Unit tests:** Cover all helper functions
- **Integration tests:** Cover worker behavior
- **Manual tests:** Verify real-world scenarios
- **Production tests:** Validate deployed worker

### Regression Testing

When adding new features:
1. Write tests first (TDD approach)
2. Update integration tests
3. Add manual test cases
4. Document in TESTING.md

## Resources

- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Vitest Documentation](https://vitest.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [HTMLRewriter API](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
