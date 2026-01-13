# Fragment Block

A content reuse component that enables embedding shared content from one page into multiple pages. Perfect for common sections like headers, footers, disclaimers, announcements, and reusable content blocks that need to appear consistently across multiple pages.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Usage](#usage)
5. [Content Structure](#content-structure)
6. [Styling & Customization](#styling--customization)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)
9. [Performance](#performance)
10. [Browser Support](#browser-support)
11. [Troubleshooting](#troubleshooting)
12. [Testing](#testing)
13. [Dependencies](#dependencies)
14. [Future Enhancements](#future-enhancements)

---

## Overview

The fragment block enables content reuse across multiple pages by fetching and embedding content from a separate fragment document. This allows maintaining a single source of truth for shared content - update once, reflect everywhere.

**Primary Use Cases:**

- Reusable disclaimers or legal notices
- Site-wide announcements or banners
- Standardized contact information sections
- Common call-to-action blocks
- Shared navigation or menu sections
- Product feature comparisons used across pages
- Marketing content that appears on multiple pages

**Block Name:** `fragment`

**Location:** `/blocks/fragment/`

**Files:**

- `fragment.js` - Core decoration logic with fragment loading
- `fragment.css` - Minimal section padding suppression
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Remote Content Loading**
   - Fetches fragment content from separate page
   - Loads `.plain.html` version of fragment page
   - Supports any valid EDS page path
   - Handles loading errors gracefully

2. **Complete Block Decoration**
   - Applies full EDS decoration to fragment content
   - Processes all blocks within fragment
   - Maintains block functionality and styling
   - Preserves nested section structure

3. **Media Path Resolution**
   - Automatically resolves relative media paths
   - Converts `./media_*` paths to absolute URLs
   - Fixes image `src` and `source` `srcset` attributes
   - Ensures media loads correctly from fragment location

4. **Section Class Inheritance**
   - Transfers section classes from fragment to parent
   - Maintains styling and layout context
   - Preserves section-level variations
   - Seamless visual integration

5. **Flexible Content Support**
   - Any EDS blocks within fragment work
   - Multiple sections supported
   - Rich content with images, links, formatting
   - Nested block structures preserved

---

## Technical Architecture

### JavaScript Structure

The fragment block has two main functions:

1. **loadFragment(path)** - Exported utility function
   - Fetches fragment HTML from path
   - Creates main element container
   - Resolves media paths relative to fragment
   - Decorates and loads blocks
   - Returns decorated main element

2. **decorate(block)** - Block decoration function
   - Extracts fragment path from link or text
   - Calls loadFragment() to fetch content
   - Extracts first section from fragment
   - Transfers section classes to parent section
   - Replaces fragment block with actual content

### Key Functions

**loadFragment(path)**
Fetches and prepares fragment content:

`Fetch fragment HTML`
`const resp = await fetch(path + '.plain.html');`

`Create container and parse HTML`
`const main = document.createElement('main');`
`main.innerHTML = await resp.text();`

`Resolve relative media paths`
`main.querySelectorAll('img[src^="./media_"]').forEach(elem => {`
`elem.src = new URL(elem.getAttribute('src'), new URL(path, window.location)).href;`
`});`

`Decorate and load blocks`
`decorateMain(main);`
`await loadBlocks(main);`

**Purpose:** Provides reusable fragment loading for any context, not just fragment blocks.

### Data Flow

```
Fragment Block in Page
    ↓
Extract Fragment Path (from link or text)
    ↓
Fetch Fragment HTML (.plain.html)
    ↓
Create Main Container
    ↓
Parse Fragment HTML
    ↓
Resolve Media Paths (./media_* → absolute URLs)
    ↓
Apply EDS Decoration (decorateMain)
    ↓
Load All Blocks (loadBlocks)
    ↓
Extract First Section
    ↓
Transfer Section Classes to Parent
    ↓
Replace Fragment Block with Content
    ↓
Seamless Content Integration
```

### CSS Architecture

The fragment block has minimal CSS focused on padding suppression:

**Section Padding Removal:**

- `.fragment-wrapper > .section` - Removes left/right padding
- `.fragment-wrapper > .section:first-of-type` - Removes top padding from first section
- `.fragment-wrapper > .section:last-of-type` - Removes bottom padding from last section

**Why this matters:**

- Fragment content should blend seamlessly with parent page
- Section padding would create visual gaps
- Parent section controls overall spacing
- Fragment sections inherit parent styling

### Path Resolution Strategy

**Media paths in fragments use relative syntax:**

- Fragment at `/fragments/disclaimer`
- Media in fragment: `./media_abc123.png`
- Resolved to: `/fragments/media_abc123.png`

**How it works:**

1. Fragment HTML contains relative paths (`./media_*`)
2. `resetAttributeBase()` finds all media elements
3. Creates absolute URL using fragment path as base
4. Updates `src` or `srcset` attribute with resolved path

This ensures media loads from fragment's directory, not parent page directory.

---

## Usage

### Basic Markdown Structure

In Google Docs, create a table with the block name and fragment path:

```
| Fragment |
|----------|
| /fragments/disclaimer |
```

### Fragment Path Formats

**Absolute path (recommended):**

```
| Fragment |
|----------|
| /fragments/announcement |
```

**With link:**

```
| Fragment |
|----------|
| https://www.example.com/fragments/footer |
```

**Plain text path:**

```
| Fragment |
|----------|
| /fragments/cta-section |
```

### Creating Fragment Pages

**Fragment pages are regular EDS pages stored in a fragments directory:**

1. Create folder: `/fragments/` in your site
2. Create fragment page: `/fragments/announcement.docx` in Google Docs
3. Add content using any EDS blocks
4. Publish to site
5. Reference in fragment block: `/fragments/announcement`

**Fragment page example (announcement.docx):**

```
## Special Offer!

Get 50% off all products this week only. Use code SAVE50 at checkout.

[Shop Now](#)
```

### Content Patterns

**Pattern 1: Simple Text Fragment**

```
| Fragment |
|----------|
| /fragments/disclaimer |
```

**Fragment content (/fragments/disclaimer):**

```
*Legal disclaimer: This content is for informational purposes only.
Consult a professional for specific advice.*
```

**Pattern 2: Rich Content Fragment**

```
| Fragment |
|----------|
| /fragments/contact-info |
```

**Fragment content (/fragments/contact-info):**

```
### Contact Us

Email: support@example.com
Phone: 1-800-555-0100

Office Hours: Monday-Friday, 9am-5pm EST
```

**Pattern 3: Complex Fragment with Blocks**

```
| Fragment |
|----------|
| /fragments/feature-comparison |
```

**Fragment content (/fragments/feature-comparison) - contains cards block:**

```
| Cards |
|-------|
| ![](feature1.png) |
| Feature One |
| Description of feature one |
| ![](feature2.png) |
| Feature Two |
| Description of feature two |
```

### Integration Points

**With other blocks:**

- Can appear anywhere on page
- Works within sections
- Compatible with all other blocks
- Fragment can contain any EDS blocks

**Content Model:**

- Single-cell table with fragment path
- Path must start with `/`
- Fragment page must exist at path
- Fragment content fully decorated before insertion

---

## Content Structure

### Expected Input (Markdown Table)

The EDS pipeline converts markdown into this initial DOM structure:

```html
<div class="fragment block">
  <div>
    <div>
      <a href="/fragments/announcement">Fragment Link</a>
    </div>
  </div>
</div>
```

**Or with plain text path:**

```html
<div class="fragment block">
  <div>
    <div>/fragments/announcement</div>
  </div>
</div>
```

### Output Structure (After Decoration)

The fragment block is replaced with the actual fragment content:

**Before decoration:**

```html
<section class="fragment-container">
  <div class="fragment-wrapper">
    <div class="fragment block">
      <div>
        <div>/fragments/announcement</div>
      </div>
    </div>
  </div>
</section>
```

**After decoration:**

```html
<section class="fragment-container announcement-section">
  <!-- Fragment block replaced with fragment content -->
  <div class="announcement-section">
    <h2>Special Offer!</h2>
    <p>Get 50% off all products this week only. Use code SAVE50 at checkout.</p>
    <a href="#">Shop Now</a>
  </div>
</section>
```

**Note:** The parent section inherits classes from the fragment's first section.

### Fragment Page Structure

**Fragment pages are standard EDS pages:**

```
/fragments/
├── announcement.docx        (Google Docs source)
├── announcement.html        (Published HTML)
├── announcement.plain.html  (Plain HTML loaded by fragment block)
└── media_abc123.png        (Media assets in same directory)
```

**Fragment content can include:**

- Plain text and paragraphs
- Headings and formatting
- Images with relative paths
- Links and lists
- Any EDS blocks (cards, tabs, accordion, etc.)
- Multiple sections

---

## Styling & Customization

### CSS Variables

The fragment block uses minimal styling. Fragment content inherits styles from parent page:

```css
/* Fragment wrapper suppresses section padding */
.fragment-wrapper > .section {
  padding-left: 0;
  padding-right: 0;
}

.fragment-wrapper > .section:first-of-type {
  padding-top: 0;
}

.fragment-wrapper > .section:last-of-type {
  padding-bottom: 0;
}
```

### Custom Styling

**Fragment content styling happens in two places:**

1. **Fragment page styles** - Applied to fragment content itself
2. **Parent page styles** - Applied to section containing fragment

**Example: Styling fragment announcement:**

```css
/* On parent page - style section containing fragment */
.announcement-section {
  background-color: var(--color-accent, #f0f0f0);
  border: 2px solid var(--color-primary, #333);
  padding: 2rem;
  border-radius: 8px;
}

/* In fragment page - style fragment content */
.announcement-section h2 {
  color: var(--color-primary, #333);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
```

### Section Class Transfer

**How section classes are transferred:**

1. Fragment has section with class: `<section class="announcement-section">`
2. Parent section receives class: `<section class="fragment-container announcement-section">`
3. Fragment block is replaced with fragment's child nodes
4. Parent section now styled with fragment's section classes

**This enables:**

- Fragment defines its own styling context
- Parent page respects fragment styling
- Seamless visual integration
- Consistent appearance across pages

### Variations

The fragment block currently has **no built-in variations**. Variations are controlled by fragment content and section classes.

**Creating variation-like behavior:**

```
| Fragment |
|----------|
| /fragments/cta-primary |
```

```
| Fragment |
|----------|
| /fragments/cta-secondary |
```

Different fragment pages = different variations.

---

## Responsive Behavior

### Mobile Behavior (< 600px)

- Fragment content reflows naturally
- Images scale to container width
- Text remains readable
- Blocks within fragment respond as designed

### Tablet Behavior (600px - 1024px)

- Fragment content uses tablet layouts
- Blocks within fragment adapt to tablet width
- No specific fragment-level responsive behavior
- Fragment styling comes from content and parent page

### Desktop Behavior (> 1024px)

- Fragment content uses desktop layouts
- Full width or constrained by parent section
- Blocks within fragment use desktop styling
- No specific fragment-level responsive behavior

### Responsive Strategy

**Fragment block itself has no responsive CSS** - responsive behavior comes from:

- Fragment content blocks (cards, tabs, etc. respond naturally)
- Parent section styling (controls overall layout)
- Global site styles (typography, spacing, colors)

**Testing responsive fragments:**

1. Test fragment page in isolation first
2. Verify blocks within fragment respond correctly
3. Test parent page with embedded fragment
4. Check section padding and spacing
5. Verify media loads at all viewport sizes

---

## Accessibility

### Semantic HTML

The fragment block preserves semantic HTML from fragment content:

**Fragment content structure maintained:**

- Heading hierarchy preserved
- Landmark roles maintained (if present)
- Link text and alt text carried over
- Semantic markup from blocks retained

**Accessibility attributes:**

- All ARIA attributes from fragment preserved
- Role attributes maintained
- State attributes (aria-expanded, etc.) functional
- Relationship attributes (aria-labelledby, etc.) preserved

### Screen Reader Support

**What works well:**

- Fragment content read in natural order
- Headings announced with correct level
- Blocks within fragment fully accessible
- Links and interactive elements functional

**Screen reader flow:**

1. Encounters fragment content seamlessly
2. No indication content came from fragment (good!)
3. All content read as if native to page
4. Interactive elements work as expected

### Keyboard Navigation

**Supported interaction:**

- All interactive elements in fragment accessible via keyboard
- Tab order preserved from fragment content
- No keyboard traps created
- Focus management maintained

**Focus order:**

- Fragment content inserted into document flow
- Tab order follows visual order
- No focus disruption at fragment boundaries

### ARIA Best Practices

**Fragment block implementation:**

- No ARIA attributes added by fragment block itself
- Fragment content ARIA preserved completely
- Section-level roles maintained
- Landmark regions carried over from fragment

**Why this matters:**

- Fragment content appears native to page
- No accessibility seams or boundaries
- Screen readers announce content naturally
- Keyboard navigation flows smoothly

---

## Performance

### JavaScript Execution

**Initial decoration:**

- One fetch request per fragment
- `.plain.html` format loads quickly
- Full block decoration applied to fragment
- Async/await pattern prevents blocking

**Loading sequence:**

1. Page loads with fragment block placeholder
2. Fragment path extracted from block
3. Async fetch initiated for fragment HTML
4. Fragment content decorated (blocks loaded)
5. Fragment content inserted into page
6. Parent section classes updated

**Performance impact:**

- One additional HTTP request per fragment
- Fragment content cached by browser
- Subsequent page loads faster (cached fragment)
- Fragment decoration adds ~50-100ms per block in fragment

### Memory Footprint

**Per fragment block:**

- One fetch request (fragment HTML)
- Fragment DOM tree (size varies by content)
- Block decoration overhead (depends on blocks in fragment)
- Minimal additional memory (<1KB per fragment)

**Typical usage:**

- 1-3 fragments per page
- Fragment size: 1-10KB HTML
- Total overhead: <50KB per page

### Network Efficiency

**Initial load:**

- fragment.js: ~1.5KB (minified)
- fragment.css: ~200 bytes (minified)
- Fragment HTML: 1-10KB per fragment (cached)
- No external dependencies

**Runtime:**

- One fetch per unique fragment path
- Browser caching applied to `.plain.html`
- Subsequent loads use cached fragment
- No polling or repeated requests

### Caching Strategy

**Fragment caching:**

- `.plain.html` content cached by browser
- Standard HTTP cache headers apply
- Fragment updates require cache invalidation
- Consider cache TTL for frequently updated fragments

**Best practices:**

- Use fragments for stable content
- Frequent updates? Consider inline content
- Cache-busting query params for urgent updates: `/fragments/announcement?v=2`
- Monitor fragment cache hit rates

### Loading Strategy

Fragment block loads as part of EDS's default loading pattern:

- Blocks decorated on page load
- Fragment fetch during decoration (async)
- No render-blocking resources
- Progressive enhancement friendly

**Loading indicators:**

- Fragment block replaced after loading
- No built-in loading spinner
- Content appears when ready
- Consider adding custom loading indicator for long fragments

### Lighthouse Impact

Expected Lighthouse scores with fragment block:

- Performance: 90-100 (depends on fragment content)
- Accessibility: 95-100 (depends on fragment content)
- Best Practices: 100
- SEO: 100 (fragment content indexed with parent page)

**Performance optimization tips:**

- Keep fragments small (< 10KB HTML)
- Optimize images in fragments
- Limit blocks within fragments
- Cache fragments aggressively
- Preload critical fragments with `<link rel="preload">`

---

## Browser Support

### Supported Browsers

- Chrome/Edge: Last 2 versions ✓
- Firefox: Last 2 versions ✓
- Safari: Last 2 versions ✓
- iOS Safari: Last 2 versions ✓
- Android Chrome: Last 2 versions ✓

### Required Features

- Fetch API (fragment loading)
- Promises/async-await (JavaScript)
- URL API (media path resolution)
- DOM manipulation (createElement, querySelector)
- ES6 modules (import/export)

**All modern browsers support these features.**

### Internet Explorer 11

**Not supported** - Fragment block requires:

- Fetch API (NOT supported in IE11)
- URL API (NOT supported in IE11)
- Async/await (requires transpilation)

**Recommendation:** IE11 is not officially supported. Use at your own risk with extensive polyfills.

---

## Troubleshooting

### Issue: Fragment not appearing

**Symptoms:**

- Empty space where fragment should be
- Fragment block placeholder visible
- No content loaded
- Console errors

**Solutions:**

1. **Check fragment path:**
   - Verify path starts with `/`
   - Ensure fragment page exists at path
   - Test path in browser: `https://yoursite.com/fragments/name.plain.html`

2. **Check console errors:**
   - Open DevTools Console (F12)
   - Look for fetch errors (404, 500, etc.)
   - Verify fragment HTML is valid

3. **Verify fragment page published:**
   - Fragment must be published to site
   - `.plain.html` version must exist
   - Check fragment page loads independently

### Issue: Fragment media not loading

**Symptoms:**

- Broken image icons
- Missing media in fragment content
- 404 errors for media files
- Console errors for image paths

**Solutions:**

1. **Check media paths in fragment:**
   - Use relative paths: `./media_abc123.png`
   - NOT absolute paths: `/media_abc123.png`
   - Verify media files exist in fragment directory

2. **Test media URLs:**
   - Copy media URL from network tab
   - Open in browser directly
   - Verify file exists and is accessible

3. **Check media resolution logic:**
   `Test media resolution`
   `// In browser console`
   `const imgs = document.querySelectorAll('img');`
   `imgs.forEach(img => console.log(img.src));`
   `// Verify URLs are absolute, not relative`

### Issue: Fragment styles not applied

**Symptoms:**

- Fragment content unstyled or poorly styled
- Different appearance than fragment page
- Missing colors, fonts, or layout

**Solutions:**

1. **Check section class transfer:**
   - Inspect parent section in DevTools
   - Verify section classes from fragment were added
   - Look for class names from fragment's first section

2. **Verify CSS loaded:**
   - Check if fragment page CSS is loaded on parent page
   - Fragment styling may require CSS from fragment page
   - Consider moving fragment styles to global CSS

3. **Test fragment page directly:**
   - Open fragment page URL in browser
   - Verify content styled correctly in isolation
   - Compare to embedded version

### Issue: Fragment blocks not working

**Symptoms:**

- Blocks within fragment not decorated
- Cards/tabs/accordion not functional
- Plain HTML visible instead of decorated blocks
- Console errors about missing block JS

**Solutions:**

1. **Check block decoration:**
   - Verify `loadBlocks(main)` called in loadFragment()
   - Check console for block loading errors
   - Ensure block JS files are accessible

2. **Test fragment page blocks:**
   - Open fragment page directly
   - Verify blocks work in isolation
   - If blocks fail on fragment page, fix there first

3. **Check async/await:**
   `Ensure await is used`
   `await loadBlocks(main);  // ✓ Correct`
   `loadBlocks(main);        // ✗ Wrong - blocks not ready`

### Issue: Multiple fragments slow page load

**Symptoms:**

- Page loads slowly
- Multiple fragment fetch requests
- Lighthouse performance score drops
- Delayed content appearance

**Solutions:**

1. **Reduce fragment count:**
   - Combine related fragments into one
   - Use inline content for frequently updated sections
   - Limit to 2-3 fragments per page

2. **Optimize fragment content:**
   - Keep fragments small (< 5KB HTML)
   - Optimize images in fragments
   - Minimize blocks within fragments

3. **Implement preloading:**
   `Preload critical fragments`
   `<!-- In page head -->`
   `<link rel="preload" href="/fragments/announcement.plain.html" as="fetch">`

4. **Cache fragments aggressively:**
   - Set long cache TTL for stable fragments
   - Use CDN to cache fragment HTML
   - Monitor cache hit rates

### Issue: Fragment content causes layout shift

**Symptoms:**

- Content jumps when fragment loads
- Layout shift visible to users
- Poor CLS (Cumulative Layout Shift) score
- Content moves down when fragment appears

**Solutions:**

1. **Reserve space for fragment:**
   `Reserve minimum height`
   `/* In parent page styles */`
   `.fragment-wrapper {`
   `min-height: 200px; /* Approximate fragment height */`
   `}`

2. **Use skeleton/placeholder:**
   - Add placeholder content in fragment block
   - Replaced when actual fragment loads
   - Matches approximate fragment dimensions

3. **Measure fragment height:**
   - Test fragment page to determine height
   - Set min-height on parent section
   - Update as fragment content changes

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**

   ```
   http://localhost:3000/blocks/fragment/test.html
   ```

2. **Visual checks:**
   - Fragment content appears in place of block
   - Media loads correctly with absolute URLs
   - Blocks within fragment are decorated
   - Section classes transferred to parent

3. **Interaction testing:**
   - Click links within fragment
   - Test interactive blocks (tabs, accordion, etc.)
   - Verify all functionality works
   - Check keyboard navigation

4. **Path resolution testing:**
   - Inspect image `src` attributes
   - Verify absolute URLs (not relative)
   - Check media loads from fragment directory
   - Test with various media types

5. **Error handling:**
   - Test with invalid fragment path
   - Check 404 handling (fragment not found)
   - Verify graceful failure (no JS errors)

### DevTools Inspection

`Check fragment loading`
`// In browser console`
`const fragments = document.querySelectorAll('.fragment.block');`
`console.log('Fragment blocks:', fragments.length);`

`Monitor fetch requests`
`// In Network tab, filter by "plain.html"`
`// Verify fragment fetched successfully`
`// Check response status and content`

`Verify media resolution`
`const imgs = document.querySelectorAll('img[src*="media_"]');`
`imgs.forEach(img => {`
`console.log('Image src:', img.src);`
`console.log('Is absolute?', img.src.startsWith('http'));`
`});`

`Check section class transfer`
`const section = document.querySelector('.fragment-container');`
`console.log('Section classes:', section.className);`
`// Should include classes from fragment's first section`

### Automated Testing

**Future implementation:**

- Jest tests for loadFragment() function
- Test media path resolution logic
- Test section class transfer
- Test error handling (404, invalid path)
- Test with various fragment content structures
- Integration tests with different blocks

**Example test cases:**
`Fragment Block Tests`
`describe('Fragment Block', () => {`
`test('loads fragment from valid path', async () => {});`
`test('resolves relative media paths to absolute', async () => {});`
`test('transfers section classes to parent', async () => {});`
`test('decorates blocks within fragment', async () => {});`
`test('handles 404 gracefully', async () => {});`
`test('handles empty fragment', async () => {});`
`});`

### Testing Checklist

**Fragment creation:**

- [ ] Create test fragment page in `/fragments/`
- [ ] Add content with images and blocks
- [ ] Publish fragment page
- [ ] Verify `.plain.html` is accessible

**Fragment embedding:**

- [ ] Add fragment block to test page
- [ ] Use correct fragment path
- [ ] Publish parent page
- [ ] Test on staging site

**Visual testing:**

- [ ] Fragment content appears correctly
- [ ] Media loads from fragment directory
- [ ] Styling matches fragment page
- [ ] Blocks within fragment work

**Technical testing:**

- [ ] Check Network tab for fragment fetch
- [ ] Verify 200 status for `.plain.html`
- [ ] Inspect media URLs (absolute paths)
- [ ] Check section classes transferred

**Error scenarios:**

- [ ] Test with non-existent fragment path
- [ ] Test with invalid path format
- [ ] Test with empty fragment
- [ ] Verify graceful failure (no errors)

---

## Dependencies

### Internal Dependencies

1. **aem.js** (formerly lib-franklin.js)
   - Location: `/scripts/aem.js`
   - Used for: `loadBlocks()` function (loads blocks in fragment)
   - Required: Yes

2. **scripts.js**
   - Location: `/scripts/scripts.js`
   - Used for: `decorateMain()` function (decorates fragment HTML)
   - Required: Yes

3. **styles.css**
   - Location: `/styles/styles.css`
   - Used for: Global styling applied to fragment content
   - Required: No (but recommended for consistent styling)

### External Dependencies

**None** - The fragment block is a pure EDS-native component with no external libraries.

### Browser APIs

- Fetch API (fragment HTML loading)
- URL API (media path resolution)
- DOM manipulation (createElement, querySelector, appendChild)
- Promises and async/await (asynchronous loading)

### Fragment Page Dependencies

**Fragment pages may have their own dependencies:**

- Blocks used within fragment (cards, tabs, etc.)
- Block-specific CSS and JS files
- Media assets in fragment directory
- Custom styling or scripts

**These are loaded automatically when fragment content is decorated.**

---

## Future Enhancements

### Planned Features

1. **Loading Indicators**
   - Add built-in loading spinner
   - Configurable loading state UI
   - Progress indication for slow fragments
   - Skeleton placeholders

2. **Error Handling UI**
   - User-friendly error messages
   - Retry mechanism for failed loads
   - Fallback content when fragment unavailable
   - Developer-mode detailed errors

3. **Caching Improvements**
   - Client-side fragment cache
   - Service worker integration
   - Preload/prefetch support
   - Cache invalidation strategies

4. **Performance Optimization**
   - Fragment preloading
   - Lazy loading for below-fold fragments
   - Fragment bundling (multiple fragments in one request)
   - Differential loading (mobile vs desktop fragments)

5. **Enhanced Path Resolution**
   - Query parameter support: `/fragments/cta?variant=blue`
   - Hash navigation: `/fragments/faq#question-5`
   - Dynamic path substitution: `/fragments/cta-{locale}`
   - Wildcard paths: `/fragments/footer-*`

6. **Content Versioning**
   - Versioned fragment URLs: `/fragments/announcement?v=2`
   - Cache busting for updates
   - A/B testing support
   - Scheduled fragment changes

7. **Developer Tools**
   - Fragment inspector overlay
   - Fragment dependency graph
   - Performance metrics per fragment
   - Fragment usage analytics

### Contributing

To propose enhancements:

1. Create test fragment page
2. Implement feature in fragment.js
3. Add test cases to test.html
4. Update documentation
5. Submit PR with demo link

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[test.html](./test.html)** - Browser-based testing file
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles
- **[AEM Fragment Documentation](https://www.aem.live/developer/block-collection/fragment)** - Official fragment block docs

---

## Version History

- **v1.0** (Current) - Initial implementation
  - Fragment loading from remote paths
  - Media path resolution (relative to absolute)
  - Full block decoration within fragments
  - Section class transfer to parent
  - Minimal section padding suppression

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [EXAMPLE.md](./EXAMPLE.md) for usage examples
3. Test with [test.html](./test.html)
4. File issue with detailed reproduction steps

---

**Last Updated:** 2025-11-28
**Block Version:** 1.0
**EDS Compatibility:** Current
**Based On:** AEM Block Collection Fragment
