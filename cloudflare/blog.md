# Case Study: Architecting Testable Cloudflare Workers for Adobe EDS

**A pattern for building robust, maintenance-free edge logic that makes SEO effortless for authors.**

Adobe Edge Delivery Services (EDS) provides an incredibly fast foundation for websites. However, real-world requirements often necessitate custom edge logic—whether for SEO enhancement, security headers, or API integration.

## The Author Experience: From Metadata to SEO Gold

**The Problem Authors Face**: Search engines need structured data (JSON-LD) to understand your content, but manually creating it is error-prone and time-consuming. Miss a field, get the syntax wrong, or forget to update it when content changes—and your SEO suffers.

**The Solution**: A Cloudflare Worker that transforms simple metadata into perfect JSON-LD automatically.

**For Authors, It's This Simple**:

1. **Add one line to your document metadata**:
   ```
   | jsonld | article |
   ```

2. **Fill in your standard metadata** (you're already doing this):
   ```
   | og:title         | Your Article Title           |
   | og:description   | Your article description     |
   | author           | Your Name                    |
   | publication-date | 2025-12-10                   |
   ```

3. **Publish. Done.** The worker automatically generates perfect JSON-LD:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "Your Article Title",
     "description": "Your article description",
     "author": {
       "@type": "Person",
       "name": "Your Name"
     },
     "datePublished": "2025-12-10",
     "publisher": {
       "@type": "Organization",
       "name": "yourdomain.com"
     }
   }
   ```

**No JSON syntax to learn. No schema.org documentation to read. No manual updates when content changes.**

The worker reads your existing metadata and generates schema.org-compliant structured data automatically. Authors focus on content; the worker handles the SEO plumbing.

## The Technical Challenge

When tasked with building this worker to handle **CORS headers**, **JSON-LD generation**, and **Metadata cleanup**, we decided to move beyond standard implementations. We needed an architecture that was:

- **Author-friendly**: Simple metadata trigger, no technical knowledge required
- **Production-ready**: Handles edge cases, errors, and validates correctly
- **Testable**: Comprehensive test coverage without complex infrastructure
- **Operationally simple**: Deploy via Dashboard, no CLI tooling required

**The Metadata-to-JSON Pipeline**: The worker reads standard EDS metadata fields and automatically maps them to rich `schema.org` objects. This ensures search engines receive perfectly structured data without manual authoring errors or JSON syntax issues.

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

This pattern delivers significant benefits for **both authors and engineering teams**:

### For Content Authors

1. **Effortless SEO**: Add `| jsonld | article |` to metadata, publish, done
2. **Zero JSON Knowledge Required**: Never write or debug JSON-LD syntax
3. **Always Current**: JSON-LD regenerates from latest metadata on every publish
4. **Error-Free**: Worker validates and handles edge cases automatically
5. **Search Engine Ready**: Perfect schema.org compliance without technical expertise

### For Engineering Teams

1. **Zero "It Works on My Machine"**: Tests run against compiled logic, not environmental side-effects
2. **Maintenance-Free**: Test suite doesn't rely on fragile E2E setups or specific port bindings
3. **High Velocity**: Refactor core logic with confidence—unit tests cover rules, integration tests cover delivery
4. **Production Safety**: 19 automated tests ensure correctness before deployment
5. **Simple Operations**: Deploy via Dashboard copy/paste, no CLI tooling required

### The Business Impact

**Author Productivity**: What used to take 15-30 minutes per article (researching JSON-LD syntax, creating structured data, validating) now takes 5 seconds (adding one metadata line).

**SEO Quality**: Consistent, error-free structured data across all articles. Search engines get perfect schema.org objects every time.

**Operational Simplicity**: One worker file, 19 passing tests, Dashboard deployment. No build pipeline, no CLI tools, no deployment complexity.

By adopting this "Two-File" architecture (One Logic File, One Test File), we turned what is often a fragile, opaque part of the stack into the most robust component of the system—while making life dramatically easier for content authors.
