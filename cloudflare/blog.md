# Case Study: Architecting Testable Cloudflare Workers for Adobe EDS

**A pattern for building robust, maintenance-free edge logic.**

Adobe Edge Delivery Services (EDS) provides an incredibly fast foundation for websites. However, real-world requirements often necessitate custom edge logic—whether for SEO enhancement, security headers, or API integration.

**The Semantic Challenge**
A primary objective was **transforming raw metadata into semantic JSON-LD**. We needed a system that could read standard EDS Metadata fields (like "Article") and automatically map them to rich `schema.org` objects (like `Article` or `NewsArticle`). This "Metadata-to-JSON" pipeline allows authors to focus on content while the worker handles the semantic plumbing, ensuring search engines receive perfectly structured data without manual authoring errors.

When tasked with building this worker to handle **CORS headers**, **JSON-LD generation**, and **Metadata cleanup**, we decided to move beyond standard "script-kiddie" implementations. We wanted an architecture that was **production-ready**, **testable**, and **operationally simple**.

This document outlines the architectural pattern we developed: **"Two-File Simplicity"**.

## The Architecture Pattern

The core philosophy of this pattern is strict separation of concerns between **Business Logic** and the **Cloudflare Runtime**.

### 1. The Pure Core (Business Logic)

Most Worker tutorials encourage writing logic directly inside the `fetch` event listener. This makes testing difficult because you have to mock the entire Request/Response cycle just to test a string parsing function.

Instead, we extract logic into **Pure Functions** that know nothing about Cloudflare.

**Pattern:**
```javascript
// ✅ Pure Function
// Input: Data Object. Output: Data Object.
// No dependency on 'Request', 'Response', or 'HTMLRewriter'.
export const buildJsonLd = (articleData, hostname) => {
  if (!articleData.title) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    publisher: {
      '@type': 'Organization',
      name: hostname
    }
  };
};
```

By keeping these functions pure, we can write **Unit Tests** that run in milliseconds without any test harness overhead.

### 2. The Thin Shell (Runtime Integration)

The `fetch` handler acts only as a router and orchestrator. It parses the incoming request, calls the pure functions, and applies the results using the Cloudflare `HTMLRewriter`.

We also extracted specific `HTMLRewriter` handlers into standalone functions.

**Pattern:**
```javascript
// ✅ Testable Handler
// Input: DOM Element Mock. Output: Side effects on element.
export const handleViewport = (element, state) => {
  if (state.shouldGenerateJsonLd) {
     element.after('<script>...</script>', { html: true });
  }
};
```

## The Testing Strategy

With logic extracted, we adopted a unified **Unit + Integration** testing strategy, contained in a single test file.

### Layer A: Unit Tests (The "Micro" View)
We import the pure functions and handlers directly. We don't verify if Cloudflare works; we verify if *our logic* works.

*   Does `buildJsonLd` handle missing titles per requirements?
*   Does `handleViewport` insert the script tag when the flag is set?
*   Does `getExtension` correctly parse `.tar.gz` files?

These tests are fast, deterministic, and cover 90% of the cognitive complexity.

### Layer B: Mocked Integration Tests (The "Macro" View)
To ensure the pieces fit together, we use a lightweight **Mock HTMLRewriter**. We don't need a full browser or a local Wrangler instance for this. We simple verify the *wiring*.

**The Mock:**
```javascript
class MockHTMLRewriter {
  on(selector, handler) {
    this.activeHandlers.push({ selector, handler }); // Record registration
    return this;
  }
  transform(response) { return response; } // Pass-through
}
```

**The Test:**
```javascript
test('Request triggers correct handlers', async () => {
  // Simulate a request
  await worker.fetch(mockRequest, mockEnv);
  
  // Verify that the worker registered a handler for the viewport meta tag
  const hasHandler = MockHTMLRewriter.activeHandlers
    .some(h => h.selector === 'meta[name="viewport"]');
    
  expect(hasHandler).toBe(true);
});
```

This confirms that if a request comes in, the logic *would* be applied, without the overhead of actually spinning up a server.

## Handling Edge-Specifics: Port Redirects

A common production requirement is normalizing traffic. Cloudflare Workers often respond on non-standard ports internally. We implemented logic to redirect these:

```javascript
if (url.port) {
  // Redirect to clean URL (no port)
  return Response.redirect(cleanUrl, 301);
}
```

In a traditional "spin up a server" test strategy, this blocks local testing because local dev servers *always* use ports (e.g., `localhost:8787`). Our mock-based strategy completely sidelines this issue. We test the logic that *runs* the redirect, but our test runner doesn't get *caught* in the redirect loop.

## Why This Matters

This pattern delivers three significant benefits for engineering teams:

1.  **Zero "It Works on My Machine":** Tests run against compiled logic, not environmental side-effects.
2.  **Maintenance-Free:** The test suite doesn't rely on fragile E2E setups or specific port bindings. It works today, and it will work in 2 years.
3.  **High Velocity:** Developers can refactor the core logic with confidence, knowing the unit tests cover the rules and the integration tests cover the delivery.

By adopting this "Two-File" architecture (One Logic File, One Test File), we turned what is often a fragile, opaque part of the stack into the most robust component of the system.
