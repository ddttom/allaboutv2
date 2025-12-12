# Bio Block

The bio block displays author or team member biographies with profile images and biographical text. It features automatic image link conversion, responsive layouts, author name extraction, and multiple variations for different presentation needs.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Content Structure](#content-structure)
4. [Block Variations](#block-variations)
5. [Author Name Extraction](#author-name-extraction)
6. [Configuration](#configuration)
7. [Styling and Appearance](#styling-and-appearance)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Performance](#performance)
11. [Browser Compatibility](#browser-compatibility)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)
14. [Related Documentation](#related-documentation)

---

## Overview

The bio block is an EDS-native component designed to display author biographies in a consistent, visually appealing format. It automatically handles image link conversion, extracts author names from multiple sources, and provides responsive layouts that work across all device sizes.

**Use cases:**
- Blog post author bylines
- Team member profiles
- Guest contributor information
- Speaker biographies
- Editorial staff listings

**Key capabilities:**
- Automatic image link → `<img>` element conversion
- Smart author name extraction (alt attribute → meta tag fallback)
- Expression variable support for dynamic content
- Mobile-first responsive design
- Multiple presentation variations

---

## Features

### Automatic Image Link Conversion

The block intelligently detects image links in the first cell and converts them to actual `<img>` elements:

**Supported image formats:**
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

**How it works:**
1. Scans the first cell for `<a>` tags pointing to image files
2. Creates an `<img>` element with the link's URL as `src`
3. Uses link text as `alt` attribute (if text is not a URL)
4. Replaces the link atomically using `.replaceWith()`
5. Preserves other cell content

**Why this matters:**
- Authors can paste image URLs directly in Google Docs
- No need for complex image insertion workflows
- Consistent image handling across all bio instances
- Proper semantic HTML in production

### "Picture Here" Placeholder Text (Handled by Cloudflare Worker)

**Important:** The "Picture Here" placeholder functionality has been moved to the Cloudflare worker (v1.1.0+) for global HTML transformation. This block no longer handles placeholder replacement.

**How it works:**
1. Type "Picture Here" (case-sensitive) in the first cell in Google Docs/markdown
2. EDS transforms to: `<div><div>Picture Here</div></div>`
3. Cloudflare worker automatically replaces with author image before page delivery
4. Bio block receives already-replaced `<img>` tag

**Replacement performed by:**
- **Cloudflare Worker** (v1.1.0+) - Server-side HTML transformation
- Configuration: `cloudflare/files/cloudflare-worker.js`
- Image URL: `https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png`
- Alt text: "Author: Tom Cranstoun"

**Example usage:**

`Bio with Placeholder`
`| bio                                    |                                                           |`
`|----------------------------------------|-----------------------------------------------------------|`
`| Picture Here                           | Web development doesn't need complex tooling...           |`

**What the block receives:**
```html
<div class="bio">
  <div>
    <div><img src="..." alt="Author: Tom Cranstoun"></div>
    <div>Web development doesn't need complex tooling...</div>
  </div>
</div>
```

**Why this changed:**
- Centralized placeholder handling across all blocks (not just bio)
- Eliminated duplicate logic and config management
- Consistent behavior site-wide
- Worker-level transformation more efficient than per-block JavaScript

**For developers:**
- The bio block's `getProfileImage()`, `getConfigValue()`, and `nameToSlug()` functions have been removed (v3.1)
- Placeholder matching logic removed from decorate function
- Block now focuses solely on image link conversion and author name extraction

### Author Name Extraction

The block automatically adds the author's name in a `<strong>` element below the bio:

**Extraction priority:**
1. **Image alt attribute** (highest priority)
2. **Page meta tag** (`<meta name="author" content="Name">`)

**URL detection logic:**
- If link text is a URL (starts with `http://` or `https://`), it's ignored
- Fallback to meta tag prevents "https://example.com/photo.jpg" from appearing as author name
- Ensures clean, professional presentation

### Expression Processing

The block integrates with the expressions plugin for dynamic content:

**Example usage:**

`Dynamic Bio Content`
`{{expand,$profile:name$}} is a developer at {{expand,$profile:company$}}.`

**Requirements:**
- Expressions plugin must be loaded
- `$system:enableprofilevariables$` set to 'y'
- Profile variables defined

**Note:** Expression processing only occurs if `.bio-wrapper` element exists (production environment). Test environments function normally without expressions.

---

## Content Structure

### Basic Markdown Table

Create a two-column table in Google Docs or markdown:

`Basic Bio Structure`
`| bio                                    |                                                           |`
`|----------------------------------------|-----------------------------------------------------------|`
`| https://example.com/author-image.jpg   | Jane Doe is a senior developer with 10 years experience. |`

**Structure breakdown:**
- **Column 1**: Image URL or pasted image
- **Column 2**: Biographical text

### EDS HTML Transformation

EDS converts the markdown table to this HTML structure:

`HTML Output Structure`
`<div class="bio-wrapper">`
`  <div class="bio block">`
`    <div>`
`      <div><img src="..." alt="..."></div>`
`      <div>Bio text content</div>`
`    </div>`
`    <strong>Author Name</strong>`
`  </div>`
`</div>`

**CSS targets:**
- `.bio` - Main block container
- `.bio > div` - Flexbox wrapper
- `.bio > div > div:first-child` - Image container
- `.bio > div > div:last-child` - Text container
- `.bio strong` - Author name

---

## Block Variations

### Default (Standard)

Standard bio block with image, text, and author name.

`Standard Bio Example`
`| bio                                    |                                                           |`
`|----------------------------------------|-----------------------------------------------------------|`
`| https://example.com/author-image.jpg   | Jane Doe is a senior developer with 10 years experience. |`

**Features:**
- Image link converted to `<img>` element
- Author name extracted and displayed
- Circular 80px image (desktop)
- Horizontal layout on desktop

---

### Hide Author Variation

Use `(hide-author)` to suppress image conversion and author name display:

`Hide Author Example`
`| bio (hide-author)                      |                                                           |`
`|----------------------------------------|-----------------------------------------------------------|`
`| https://example.com/author-image.jpg   | Brief bio without author name displayed below.            |`

**Behavior:**
- Image links remain as `<a>` tags (not converted)
- No `<strong>` author name element added
- All author extraction logic skipped

**Use cases:**
- Anonymous contributors
- Bios where name is already in the text
- Placeholder content

**Implementation:** When `block.classList.contains('hide-author')` is true, the entire decoration function returns early.

---

### Highlighted Variation

Use `(highlighted)` to add a 2px blue border around the image:

`Highlighted Bio Example`
`| bio (highlighted)                      |                                                           |`
`|----------------------------------------|-----------------------------------------------------------|`
`| https://example.com/vip-author.jpg     | Dr. Emily Roberts is the lead researcher in AI.          |`

**Styling:**
- 2px solid blue border
- `box-sizing: border-box` prevents size increase
- Useful for featured authors, VIP guests, or keynote speakers

**CSS implementation:**

`.bio.highlighted img { border: 2px solid blue; box-sizing: border-box; }`

---

## Author Name Extraction

### Extraction Logic

The block uses a two-tier fallback system for author names:

**Priority 1: Image Alt Attribute**

`Alt Attribute Priority`
`const imgElement = block.querySelector('img');`
`if (imgElement && imgElement.getAttribute('alt')) {`
`  author = imgElement.getAttribute('alt');`
`}`

**Priority 2: Page Meta Tag**

`Meta Tag Fallback`
`if (!author) {`
`  const metaAuthor = document.querySelector('meta[name="author"]');`
`  if (metaAuthor) {`
`    author = metaAuthor.getAttribute('content');`
`  }`
`}`

### URL Detection Protection

To prevent URLs from appearing as author names:

`URL Detection Logic`
`const linkText = link.textContent || '';`
`const isLinkTextUrl = linkText.startsWith('http://') || linkText.startsWith('https://');`
`img.alt = isLinkTextUrl ? '' : linkText || 'Bio image';`

**Why this matters:**
- In Google Docs, users often paste URLs as link text
- Without detection, "https://example.com/photo.jpg" would appear as author name
- Empty alt triggers fallback to meta tag
- Ensures professional, clean presentation

### Best Practices

**For authors creating content:**
1. **Option A (Recommended)**: Use author name as link text
   ```
   Link text: "Jane Doe"
   Link URL: https://example.com/photo.jpg
   Result: "Jane Doe" appears as author name
   ```

2. **Option B**: Add alt text to pasted images
   - Right-click image → Alt text → Enter name

3. **Option C**: Add meta tag to page
   ```html
   <meta name="author" content="Jane Doe">
   ```

**Priority recommendation:** Alt attribute > Meta tag for best author-side control.

---

## Configuration

### Block Configuration Object

The bio block uses a `BIO_CONFIG` object for centralized JavaScript configuration:

`BIO_CONFIG Object`
`const BIO_CONFIG = {`
`  DEFAULT_ALT_TEXT: 'Bio image',`
`  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],`
`};`

**Configuration options:**

| Option | Default | Purpose |
|--------|---------|---------|
| `DEFAULT_ALT_TEXT` | `'Bio image'` | Alt text for images when author name not available |
| `IMAGE_EXTENSIONS` | `['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']` | Supported image file extensions for link detection |

**Customization:**
- Add new formats to `IMAGE_EXTENSIONS` array for additional image type support
- Modify `DEFAULT_ALT_TEXT` if different fallback alt text needed

**Note:** "Picture Here" placeholder configuration has moved to the Cloudflare worker. See the ["Picture Here" Placeholder Text](#picture-here-placeholder-text-handled-by-cloudflare-worker) section above.

### Expression Plugin Integration

The block supports dynamic expressions through plugin integration:

`Expression Processing`
`renderExpressions(document.querySelector('.bio-wrapper'));`

**Configuration requirements:**
- Expressions plugin loaded (`/plusplus/plugins/expressions/src/expressions.js`)
- `$system:enableprofilevariables$` = 'y'
- Profile variables defined in appropriate namespace

**Error handling:**
- Plugin import uses `/* eslint-disable import/no-unresolved */`
- Graceful degradation if plugin unavailable
- No errors thrown in test environments

---

## Styling and Appearance

### Image Styling

**Default circular images:**

`.bio-wrapper .bio.block img {`
`  border-radius: 50%;`
`  object-fit: cover;`
`  width: 80px;`
`  height: 80px;`
`}`

**Properties explained:**
- `border-radius: 50%` - Creates perfect circle
- `object-fit: cover` - Crops to fill circle without distortion
- Fixed dimensions ensure consistency

### Highlighted Variation

**Blue border for featured authors:**

`.bio-wrapper .bio.block.highlighted img {`
`  border: 2px solid blue;`
`  box-sizing: border-box;`
`}`

### Layout Structure

**Desktop flexbox layout:**

`.bio > div {`
`  display: flex;`
`  align-items: center;`
`  gap: 20px;`
`}`

**Container behavior:**

`.bio > div > div:first-child {`
`  flex-shrink: 0;  /* Image container never shrinks */`
`}`
`.bio > div > div:last-child {`
`  flex-grow: 1;    /* Text container takes remaining space */`
`}`

---

## Responsive Design

### Breakpoint Strategy

The bio block uses mobile-first responsive design with two breakpoints:

**Tablet (≤768px):**
- Image size: 60×60px
- Layout: Vertical stack, centered
- Gap: 15px

**Mobile (≤480px):**
- Image size: 50×50px
- Layout: Vertical stack, centered
- Gap: 12px

### Tablet Styles

`Tablet Responsive Styles`
`@media (max-width: 768px) {`
`  .bio-wrapper .bio.block img {`
`    width: 60px;`
`    height: 60px;`
`  }`
`  .bio > div {`
`    gap: 15px;`
`    flex-direction: column;`
`    text-align: center;`
`  }`
`}`

### Mobile Styles

`Mobile Responsive Styles`
`@media (max-width: 480px) {`
`  .bio-wrapper .bio.block img {`
`    width: 50px;`
`    height: 50px;`
`  }`
`  .bio > div {`
`    gap: 12px;`
`    flex-direction: column;`
`    text-align: center;`
`  }`
`}`

### Testing Responsive Behavior

**Manual testing:**
1. Open test page or live page
2. Use browser DevTools responsive mode
3. Test at 1200px (desktop), 768px (tablet), 480px (mobile)
4. Verify layout changes, image sizes, text alignment

**Automated testing:**
- Use Playwright with viewport configurations
- Test all three breakpoints
- Verify computed styles match specifications

---

## Accessibility

### Image Alt Text

**Automatic alt attribute handling:**
- Link text becomes alt text (if not a URL)
- Fallback to "Bio image" if no text provided
- Empty alt if URL detected (prevents reading URLs)

**Best practices:**
- Always provide descriptive alt text
- Include author name in alt attribute
- Example: "Jane Doe, Senior Developer"

### Semantic HTML

The block uses proper semantic markup:

**Author name element:**

`<strong>Author Name</strong>`

**Why `<strong>`:**
- Semantic meaning (importance/emphasis)
- Better than unstyled `<div>` or `<span>`
- Screen readers understand emphasis
- SEO benefits

### Keyboard Navigation

**Interactive elements:**
- No buttons or interactive elements by default
- If bio text contains links, they are keyboard accessible
- Tab order follows DOM order

### Screen Reader Considerations

**Element announcement order:**
1. Image (with alt text)
2. Bio text content
3. Author name (`<strong>` element)

**ARIA attributes:**
- Not required for basic bio block (native semantics sufficient)
- Consider `role="complementary"` for sidebar bios
- Consider `aria-labelledby` for complex layouts

---

## Performance

### Image Optimization

**Recommended specifications:**
- Format: WebP (fallback to JPG/PNG)
- Dimensions: 200×200px (square)
- File size: <50KB
- Compression: 80-85% quality

**Why these specifications:**
- Block displays at 80px max (desktop)
- 200×200px provides 2.5× resolution for Retina displays
- Small file size ensures fast loading
- WebP provides best compression with quality

### DOM Manipulation Efficiency

**Atomic operations:**

`Efficient DOM Replacement`
`link.replaceWith(img);  // Single DOM mutation`

**Why `.replaceWith()` is efficient:**
- Single DOM operation (not multiple appends/removes)
- Preserves siblings automatically
- No reflow between steps
- Modern browser optimization

### Lazy Loading Consideration

**Current implementation:**
- Images load immediately (eager loading)
- Appropriate for above-the-fold bios

**Future enhancement:**
- Add `loading="lazy"` for below-fold bios
- Consider intersection observer for large bio lists

### Core Web Vitals Impact

**LCP (Largest Contentful Paint):**
- Bio images are small (80px max)
- Minimal LCP impact
- Use above-the-fold for critical bios

**CLS (Cumulative Layout Shift):**
- Fixed image dimensions prevent shift
- Author name added to end (minimal shift)
- CSS ensures consistent layout

**FID (First Input Delay):**
- No JavaScript blocking user interaction
- Decoration runs asynchronously
- No impact on interactivity

---

## Browser Compatibility

### JavaScript Features

**ES6+ features used:**
- `async`/`await` - Supported in all modern browsers
- Arrow functions - Fully supported
- `const`/`let` - Fully supported
- Template literals - Fully supported
- `.replaceWith()` - Supported in all modern browsers (including IE11 with polyfill)

**Minimum browser versions:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### CSS Features

**Modern CSS used:**
- Flexbox - Universal support
- `border-radius: 50%` - Universal support
- `object-fit: cover` - IE11 needs polyfill
- `gap` property - Modern browsers only (graceful degradation)

**IE11 considerations:**
- `object-fit` polyfill required
- `gap` property not supported (use margin alternative)
- Flexbox supported but buggy (test thoroughly)

### Image Format Support

**Format compatibility:**
- JPG/JPEG - Universal support
- PNG - Universal support
- WebP - Modern browsers (95%+ support)
- SVG - Universal support
- GIF - Universal support

**Recommendation:** Use WebP with JPG/PNG fallback for best compatibility.

---

## Testing

### Test Files

**Comprehensive test suite:**

1. **test.html** - Browser-based visual testing
   - 8 test cases covering all variations
   - Console logging with detailed validation
   - Manual visual inspection
   - Located: `/blocks/bio/test.html`

2. **EXAMPLE.md** - Content authoring guide
   - Google Docs authoring examples
   - Best practices for authors
   - Troubleshooting guide
   - Located: `/blocks/bio/EXAMPLE.md`

### Running Tests

**Start development server:**

`npm run debug`

**Open test page:**
- URL: `http://localhost:3000/blocks/bio/test.html`
- Browser: Chrome, Firefox, Safari
- DevTools Console: View detailed test results

### Test Cases Covered

The test.html file validates:

1. **Image Link Conversion** - Primary functionality
   - Link with image URL converts to `<img>`
   - Original `<a>` tag removed completely
   - Alt text preserved from link text

2. **Regular Picture Element** - Standard `<picture>` tags
   - Image displayed correctly
   - Alt attribute extracted for author name

3. **Different Image Extensions** - .png, .jpg, .gif, etc.
   - All supported formats handled
   - Extension detection case-insensitive

4. **Hide Author Variant** - `hide-author` class
   - Link NOT converted
   - Author name NOT added

5. **Multiple Bio Blocks** - Block scoping
   - Each block processed independently
   - No cross-contamination between instances

6. **Non-Image Link** - Regular URLs
   - Links without image extensions preserved
   - No conversion attempted

7. **Highlighted Variant** - Blue border styling
   - CSS class applied correctly
   - Visual styling verified

8. **URL as Link Text** - Production bug fix
   - URL link text ignored
   - Fallback to meta tag
   - Prevents "https://..." as author name

### Test Results Interpretation

**Console output format:**

`Test Results Example`
`🧪 BIO BLOCK TEST SUITE`
`Found 8 bio blocks to test`
`Test 1: Standard`
`  📸 Image link found: https://picsum.photos/200/200.jpg`
`  📊 Results:`
`    Image created: true`
`    Link removed: true`
`    Author added: true`
`  ✅ PASSED`

**Success criteria:**
- All 8 tests pass
- No JavaScript errors in console
- Visual rendering matches expectations

### Automated Testing

**Playwright test example:**

`Automated Test Structure`
`import { test, expect } from '@playwright/test';`
`test('bio block converts image links', async ({ page }) => {`
`  await page.goto('http://localhost:3000/blocks/bio/test.html');`
`  const img = await page.locator('.bio img').first();`
`  await expect(img).toBeVisible();`
`  const link = await page.locator('.bio a[href$=".jpg"]').first();`
`  await expect(link).not.toBeVisible();`
`});`

---

## Troubleshooting

### Issue: Image link not converting

**Symptoms:**
- Link remains as `<a>` tag
- No image displayed

**Possible causes:**
1. Using `hide-author` class (intentional behavior)
2. Link doesn't end in image extension (.jpg, .png, etc.)
3. JavaScript error preventing decoration

**Solutions:**
- Remove `hide-author` class if not needed
- Ensure URL ends with valid image extension
- Check browser console for JavaScript errors
- Verify link is in first cell of block

**Validation:**

`Check DOM in DevTools`
`// Should see <img>, not <a>`
`document.querySelector('.bio img')`
`// Should return null`
`document.querySelector('.bio a[href$=".jpg"]')`

---

### Issue: Author name shows as URL

**Symptoms:**
- Author name displays as "https://example.com/photo.jpg"

**Cause:**
- Link text was the URL (not author name)
- No meta tag on page for fallback

**Solutions:**
1. **Option A**: Change link text to author name in Google Docs
2. **Option B**: Add meta tag to page:
   ```html
   <meta name="author" content="Author Name">
   ```

**Why this happens:**
- Older bio blocks converted link text directly to alt
- Bug fix now detects URLs and ignores them
- Fallback to meta tag ensures clean presentation

---

### Issue: No author name appears

**Symptoms:**
- Image displays correctly
- No `<strong>` element with author name

**Possible causes:**
1. Image has no alt text
2. No meta tag on page
3. Using `hide-author` class

**Solutions:**
- Add alt text to image in Google Docs
- Add `<meta name="author" content="Name">` to page
- Remove `hide-author` class if not intended

**Validation:**

`Check author extraction`
`// Should show author name`
`document.querySelector('.bio strong').textContent`

---

### Issue: Multiple blocks showing wrong content

**Symptoms:**
- All bio blocks show same author name
- Images appear in wrong blocks

**Cause:**
- Using global selectors (`document.querySelector('.bio')`)
- Should use block-scoped selectors

**Solution:**
This is a code-level issue. The current implementation correctly uses `block.querySelector()`, not `document.querySelector()`.

**If implementing custom modifications:**
- Always use `block` parameter
- Never query `document` directly
- Example: `block.querySelector('img')` not `document.querySelector('.bio img')`

---

### Issue: Image too large or small

**Symptoms:**
- Image doesn't match 80px (desktop) size
- Appears pixelated or blurry

**Cause:**
- CSS not loading correctly
- Image source too low resolution

**Solutions:**
1. Verify CSS loaded: Check DevTools → Network → bio.css
2. Upload higher resolution image (minimum 200×200px)
3. Check for CSS conflicts with custom styles

**Expected computed styles:**

`Expected Image Styles`
`width: 80px (desktop), 60px (tablet), 50px (mobile)`
`height: 80px (desktop), 60px (tablet), 50px (mobile)`
`border-radius: 50%`
`object-fit: cover`

---

### Issue: Layout broken on mobile

**Symptoms:**
- Horizontal layout persists on mobile
- Image not centered

**Cause:**
- CSS media queries not applied
- Conflicting custom styles

**Solutions:**
1. Check viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Verify bio.css loading correctly
3. Check for `!important` rules overriding media queries

**Expected mobile behavior:**
- `flex-direction: column` (not row)
- `text-align: center`
- Smaller image dimensions

---

### Issue: "Picture Here" placeholder not working

**Symptoms:**
- Text "Picture Here" remains visible instead of showing image
- No image replacement occurring

**Cause:**
- Cloudflare worker not deployed or not running correctly
- Worker v1.1.0+ required for placeholder replacement

**Solutions:**
1. **Verify worker deployment:**
   ```bash
   curl -I https://allabout.network | grep cfw
   # Should show: cfw: 1.1.0 or higher
   ```

2. **Check worker configuration:**
   - Worker must be deployed to Cloudflare Dashboard
   - Route must match your domain pattern
   - Environment variables must be set (`ORIGIN_HOSTNAME`)

3. **Test in production:**
   - Placeholder replacement only works on pages served through Cloudflare
   - Local development (localhost:3000) will show "Picture Here" text
   - Use production URL for testing: `https://allabout.network/your-page`

**For local development:**
- Placeholder text will remain visible (expected)
- Use actual image URLs instead of "Picture Here"
- Or test on production/staging environment

**See also:** [Cloudflare Worker Documentation](../../cloudflare/files/README.md#picture-placeholder-replacement)

---

## Related Documentation

### Internal Documentation

**Block-specific:**
- [EXAMPLE.md](EXAMPLE.md) - Complete Google Docs authoring guide with examples
- [test.html](test.html) - Comprehensive test suite (8 test cases)

**EDS Architecture:**
- [EDS Fundamentals Guide](../../docs/for-ai/eds.md) - Core EDS concepts and patterns
- [Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md) - Development standards
- [Raw EDS Blocks Guide](../../docs/for-ai/implementation/raw-eds-blocks-guide.md) - Critical patterns and pitfalls

**Development Guidelines:**
- [Frontend Guidelines](../../docs/for-ai/guidelines/frontend-guidelines.md) - General frontend best practices
- [Security Checklist](../../docs/for-ai/guidelines/security-checklist.md) - Security considerations

### External Resources

**Adobe Edge Delivery Services:**
- [EDS Documentation](https://www.aem.live/docs/) - Official documentation
- [Block Development](https://www.aem.live/developer/block-collection) - Block collection and examples

**Web Standards:**
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) - Flexbox layout guide
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) - Responsive design patterns
- [MDN: Image Alt Text](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#alt) - Accessibility best practices

---

## Version History

**Current version:** 3.1 (2025-12-12)

**Recent changes:**
- **BREAKING:** Removed "Picture Here" placeholder logic (now handled by Cloudflare worker v1.1.0+)
- Removed `getProfileImage()` function (no longer needed)
- Removed `getConfigValue()` function (no longer needed)
- Removed `nameToSlug()` function (no longer needed)
- Removed `PLACEHOLDER_TEXT` and `CONFIG_URL` from BIO_CONFIG
- Simplified block to focus on image link conversion and author name extraction
- Updated documentation to reflect Cloudflare worker integration

**Previous version:** 3.0 (2025-12-08)
- Added intelligent profile image fetching from author profiles
- Moved default image URL to centralized config (`/config/defaults.json`)
- Added `getProfileImage()` function for automatic author image lookup
- Added `nameToSlug()` function for URL slug generation
- Fixed case-insensitive placeholder matching (Test Case 10)
- Improved cell selection to avoid multi-cell text content issues
- Added config caching for improved performance
- Enhanced fallback chain: Profile → Config → Error

**Previous version:** 2.0 (2024-11-26)
- Added URL detection to prevent URLs as author names
- Improved image link conversion with `.replaceWith()`
- Enhanced test suite with 11 comprehensive test cases
- Added expressions plugin integration
- Improved responsive design (768px, 480px breakpoints)

**Known limitations:**
- Expressions plugin requires production environment
- No built-in lazy loading (manual implementation needed)
- IE11 requires polyfills for `object-fit` and `replaceWith()`
- "Picture Here" placeholder replacement requires Cloudflare worker v1.1.0+ (not available in local development)

---

## Contributing

When modifying the bio block:

1. **Test thoroughly** - Run all 8 test cases
2. **Maintain block scoping** - Always use `block.querySelector()`, never `document.querySelector('.bio')`
3. **Follow EDS patterns** - Use single JS file, CSS variations, no inline styles
4. **Update documentation** - Keep README.md, EXAMPLE.md, and tests in sync
5. **Consider accessibility** - Test with screen readers, verify alt text
6. **Check responsiveness** - Test at 1200px, 768px, 480px breakpoints

**Questions or issues?** See [Related Documentation](#related-documentation) or review test.html for implementation examples.
