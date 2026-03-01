---
title: "Raw Block"
description: "Documentation for the raw EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Raw Block

## 1. Purpose

The Raw block enables safe insertion of unprocessed HTML content directly into EDS pages while maintaining security through content sanitization and validation. It's designed for use cases requiring custom HTML structures, embedded widgets, or trusted iframe content that cannot be easily achieved through standard EDS blocks.

**Key Features:**

- Sanitized HTML content insertion with XSS prevention
- Automatic HTML entity decoding
- Quote-wrapped content handling
- Trusted domain iframe embedding
- HTML structure validation
- Error handling and reporting

## 2. Use Cases

**Primary Use Cases:**

- Embedding third-party widgets and iframes from trusted domains (e.g., video players, presentation tools)
- Inserting custom HTML structures not supported by standard blocks
- Displaying pre-formatted HTML content from external systems
- Creating specialized layouts requiring specific HTML markup
- Embedding multimedia content with custom controls

**Example Scenarios:**

- Embedding presentation tools (mmhmm, Loom, etc.)
- Inserting complex data visualizations
- Adding custom forms or interactive elements
- Including legacy HTML content in modern pages

## 3. Content Model

The Raw block uses a single-cell content model:

| Raw |
|-----|
| HTML content here |

**Content Model Details:**

- **Row 1**: Block identifier "Raw"
- **Row 2**: Raw HTML content (can be quote-wrapped, may contain HTML entities)

**Content Structure:**

- Single cell containing the HTML string
- Supports quoted content: `"<div>content</div>"`
- Handles encoded entities: `&lt;div&gt;` becomes `<div>`
- Multi-line HTML supported

## 4. Authoring Guidelines

### Basic Usage

Create a table with "Raw" in the first row and your HTML content in the second row:

| Raw |
|-----|
| `<div class="custom-wrapper"><h2>Title</h2><p>Content here</p></div>` |

### With Quotes

If your HTML is quote-wrapped (common when copying from other systems):

| Raw |
|-----|
| "`<div class="alert">Important message</div>`" |

### With HTML Entities

Encoded HTML entities are automatically decoded:

| Raw |
|-----|
| `&lt;p&gt;This will be decoded to proper HTML tags&lt;/p&gt;` |

### Embedding Iframes

Embed iframes from trusted domains:

| Raw |
|-----|
| `<iframe src="https://ooo.mmhmm.app/embed/xyz" width="640" height="360" frameborder="0" allowfullscreen></iframe>` |

**Author Checklist:**

- Ensure HTML is well-formed (matching opening/closing tags)
- Use trusted sources only for iframe embeds
- Avoid inline JavaScript (will be removed by sanitization)
- Test content structure in isolation before adding to page
- Consider accessibility requirements for custom HTML

## 5. Implementation Details

### HTML Processing Flow

1. **Extract Content**: Read innerHTML from block element
2. **Remove Quotes**: Strip surrounding quotes if present
3. **Decode Entities**: Convert HTML entities to actual characters
4. **Sanitize**: Remove harmful elements and attributes
5. **Validate**: Check HTML structure validity
6. **Insert**: Add sanitized content back to block

### Security Measures

**Removed Elements:**

- `<script>` tags (JavaScript execution)
- `<object>` tags (embedded objects)
- `<embed>` tags (plugin content)

**Removed Attributes:**

- `onerror`, `onload`, `onclick`, `onmouseover` (event handlers)
- Any other `on*` event attributes

**Iframe Handling:**

- Whitelist-based domain validation
- Only specific attributes allowed: `src`, `width`, `height`, `frameborder`, `allowfullscreen`, `allow`
- Source URL must match trusted domains list

**Current Trusted Domains:**

- `ooo.mmhmm.app` (mmhmm presentation tool)

### Code Architecture

The block uses four helper functions:

**`decodeHTMLEntities(text)`**

- Decodes HTML entities using textarea element
- Converts `&lt;` to `<`, `&amp;` to `&`, etc.

**`sanitizeHTML(html)`**

- Removes harmful elements and attributes
- Validates iframe sources against trusted domains
- Returns cleaned HTML string

**`isValidHTML(html)`**

- Uses DOMParser to check HTML structure
- Returns false if parser errors detected

**`reportIssue(type, details)`**

- Logs issues to console
- Hook for custom reporting/monitoring integration

## 6. Styling

The block uses minimal CSS as it displays raw HTML content that should bring its own styling:

`Default Styling`
`.raw {`
`/* Add any specific styling for the raw block if needed */`
`}`

**Styling Recommendations:**

- Keep block-level styles minimal to avoid conflicts
- Let inserted HTML control its own presentation
- Add container constraints only if needed (max-width, etc.)
- Consider using CSS variables for theme integration

## 7. Dependencies

**Core Dependencies:**

- `/scripts/aem.js` - EDS core library (imported but `createOptimizedPicture` currently unused)

**Browser APIs:**

- `DOMParser` - HTML structure validation
- `document.createElement` - HTML entity decoding
- `insertAdjacentHTML` - Safe HTML insertion

**No External Libraries Required**

## 8. Browser Compatibility

**Supported Browsers:**

- Chrome/Edge 90+ (DOMParser, insertAdjacentHTML)
- Firefox 88+ (DOMParser, insertAdjacentHTML)
- Safari 14+ (DOMParser, insertAdjacentHTML)

**Compatibility Notes:**

- DOMParser is universally supported in modern browsers
- insertAdjacentHTML has excellent compatibility (IE11+)
- No polyfills required for target browser versions

**Testing Recommendations:**

- Test complex HTML structures in target browsers
- Verify iframe embed behavior across platforms
- Check mobile rendering for embedded content

## 9. Performance Considerations

**Performance Optimizations:**

- Minimal DOM manipulation (single insertAdjacentHTML call)
- No network requests (unless embedded iframes)
- Lightweight sanitization process
- No external library overhead

**Loading Behavior:**

- Block content renders synchronously
- Embedded iframes load asynchronously
- No blocking operations

**Best Practices:**

- Keep raw HTML concise for faster parsing
- Avoid deeply nested structures
- Consider lazy loading for iframe content
- Monitor embedded content size/complexity

## 10. Accessibility

**Accessibility Considerations:**

**Author Responsibility:**

- Authors must ensure inserted HTML follows WCAG 2.1 guidelines
- Semantic HTML structure required
- Proper heading hierarchy
- Alt text for images
- ARIA labels where appropriate

**Block-Level Support:**

- No automatic accessibility enhancements
- Preserves author-provided semantic markup
- Does not modify ARIA attributes

**Testing Requirements:**

- Run automated accessibility audits on pages with Raw blocks
- Manual keyboard navigation testing
- Screen reader compatibility verification

**Common Issues:**

- Custom HTML may lack proper ARIA roles
- Embedded iframes may need title attributes
- Interactive elements need keyboard accessibility

## 11. Security

**Security Architecture:**

**XSS Prevention:**

- Script tag removal (no inline JavaScript)
- Event handler attribute removal (no inline event handlers)
- Object/embed tag removal (no plugin content)

**Iframe Security:**

- Whitelist-based domain validation
- Attribute filtering (only safe attributes allowed)
- Source URL validation against trusted domains

**Content Validation:**

- HTML structure validation before insertion
- Malformed HTML rejected with console warnings
- Error reporting for debugging

**Security Best Practices:**

- Only use Raw block for trusted content sources
- Regularly review trusted domains list
- Monitor console for security warnings
- Avoid user-generated content without additional validation

**Limitations:**

- Cannot safely execute JavaScript in embedded content
- Iframes limited to pre-approved domains
- Some HTML5 features may be restricted

## 12. Known Issues and Limitations

**Current Limitations:**

1. **JavaScript Execution**: All inline JavaScript is removed for security
2. **Iframe Domains**: Only pre-configured trusted domains allowed (requires code change to add new domains)
3. **HTML5 Features**: Some advanced HTML5 elements may be filtered
4. **Styling Conflicts**: Raw HTML styles may conflict with page-level CSS
5. **No EDS Processing**: Content bypasses EDS image optimization and link handling

**Known Issues:**

- Complex nested structures may encounter sanitization edge cases
- Very large HTML strings may impact page performance
- Embedded iframe resize behavior depends on source implementation

**Workarounds:**

- For JavaScript needs, consider separate custom blocks
- Request trusted domain additions through code updates
- Test complex HTML in isolation before page integration

## 13. Development and Testing

**Development Setup:**

1. Create test content in `/blocks/raw/test.html`
2. Run local development server: `npm run debug`
3. Navigate to `http://localhost:3000/blocks/raw/test.html`
4. Verify content rendering and sanitization

**Testing Scenarios:**

**Basic HTML Insertion:**

- Simple div/span structures
- Headings and paragraphs
- Lists and tables

**Security Testing:**

- Script tags (should be removed)
- Event handlers (should be removed)
- Malicious iframes (should be blocked)

**Edge Cases:**

- Quote-wrapped content
- HTML entity encoding
- Malformed HTML structure
- Empty content
- Very large HTML strings

**Testing Tools:**

- Browser DevTools console (monitor warnings/errors)
- Network tab (verify iframe loading)
- Accessibility auditors (aXe, Lighthouse)

## 14. Examples and Variations

### Example 1: Custom Alert Box

| Raw |
|-----|
| `<div style="padding: 1rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;"><strong>Notice:</strong> This is a custom alert message.</div>` |

### Example 2: Embedded Video (mmhmm)

| Raw |
|-----|
| `<iframe src="https://ooo.mmhmm.app/embed/abc123" width="640" height="360" frameborder="0" allowfullscreen></iframe>` |

### Example 3: Complex Layout

| Raw |
|-----|
| `<div class="feature-grid"><div class="feature-item"><h3>Feature One</h3><p>Description here</p></div><div class="feature-item"><h3>Feature Two</h3><p>Description here</p></div></div>` |

### Example 4: Data Table

| Raw |
|-----|
| `<table class="data-table"><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>Item 1</td><td>100</td></tr><tr><td>Item 2</td><td>200</td></tr></tbody></table>` |

### Example 5: Quote-Wrapped Content

| Raw |
|-----|
| "`<div class="quote-box"><blockquote>This content was copied with quotes</blockquote></div>`" |

---

**Block Metadata:**

- **Version**: 1.0
- **Last Updated**: 2025-11-28
- **Author**: Tom Cranstoun
- **Status**: Production Ready
- **Security Level**: High (sanitized content only)
