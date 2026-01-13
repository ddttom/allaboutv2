# Inline SVG Block

A versatile block for embedding SVG content directly in EDS pages, supporting both icon references and inline SVG markup. Provides automatic SVG manipulation, consistent sizing, and responsive behavior.

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

The inline-svg block handles SVG icons and content in a standardized way, converting various input formats into consistent, responsive SVG elements. It supports both icon library references (via icon spans) and direct SVG markup embedding.

**Primary Use Cases:**

- Embedding decorative SVG icons from the `/icons/` directory
- Displaying inline SVG graphics and illustrations
- Adding scalable vector content to pages
- Creating full-width SVG banners or dividers
- Embedding custom SVG animations

**Block Name:** `inline-svg`

**Location:** `/blocks/inline-svg/`

**Files:**

- `inline-svg.js` - SVG processing and decoration logic
- `inline-svg.css` - Responsive layout and sizing
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Dual Input Support**
   - Icon spans: `<span class="icon icon-name"></span>`
   - Direct SVG markup: `<svg>...</svg>`
   - Automatic format detection and processing

2. **Icon Library Integration**
   - Loads SVG files from `/icons/` directory
   - Extracts icon name from class attributes
   - Creates optimized img elements with proper alt text
   - Pattern: `/icons/{name}.svg`

3. **Inline SVG Processing**
   - Parses raw SVG markup from content
   - Automatically sets width and height to 100%
   - Maintains aspect ratio and viewBox
   - Preserves all SVG attributes and styles

4. **Responsive Sizing**
   - Full-width container with flexbox centering
   - SVG scales to container width
   - Maintains aspect ratio automatically
   - Optional full-viewport width via wrapper

5. **Error Handling**
   - Console warnings for invalid content
   - Graceful degradation on missing icons
   - Clear error messages for debugging

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function processes SVG content through two pathways:

**Path 1: Icon Span Processing**

1. Searches for `span[class^="icon icon-"]` elements
2. Extracts icon name from class (e.g., `icon-arrow` → `arrow`)
3. Clears block content
4. Creates `<img>` element with source `/icons/{name}.svg`
5. Sets alt text: `{name} illustration`
6. Appends image and empty paragraph to block

**Path 2: Inline SVG Processing**

1. Checks block text content for `<svg` opening tag
2. Creates temporary container for SVG parsing
3. Extracts SVG element via `querySelector('svg')`
4. Sets SVG width and height attributes to 100%
5. Appends processed SVG directly to block

### CSS Architecture

The inline-svg block uses flexbox for centering and responsive sizing:

**Container (.inline-svg):**

- `width: 100%` - Full container width
- `max-width: 100%` - Prevents overflow
- `display: flex` - Flexbox layout
- `justify-content: center` - Horizontal centering
- `align-items: center` - Vertical centering

**SVG Element (.inline-svg svg):**

- `width: 100%` - Scales to container
- `height: auto` - Maintains aspect ratio
- `max-width: 100%` - Prevents overflow

**Full-Width Wrapper (.inline-svg-wrapper):**

- `width: 100vw` - Full viewport width
- `margin-left: calc(50% - 50vw)` - Breaks out of container
- `margin-right: calc(50% - 50vw)` - Edge-to-edge display

### Data Flow

```
Icon Span Input                    Inline SVG Input
      ↓                                   ↓
Extract icon name              Parse SVG markup
      ↓                                   ↓
Create <img> element           Extract <svg> element
      ↓                                   ↓
Set src to /icons/{name}.svg   Set width/height to 100%
      ↓                                   ↓
    Append to block              Append to block
```

---

## Usage

### Method 1: Icon Spans

Reference an icon from the `/icons/` directory:

`Basic Icon Reference`
`| Inline SVG |`
`|------------|`
`| :icon-arrow: |`

The `:icon-name:` syntax creates an icon span that the block converts to an image reference.

### Method 2: Direct SVG Markup

Embed complete SVG code:

`Inline SVG Markup`
`| Inline SVG |`
`|------------|`
`| <svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"></circle></svg> |`

### Method 3: Complex SVG Graphics

`Multi-Element SVG`
`| Inline SVG |`
`|------------|`
`| <svg viewBox="0 0 200 200"><rect x="10" y="10" width="180" height="180" fill="blue" /><circle cx="100" cy="100" r="50" fill="yellow" /></svg> |`

### Full-Width Variation

For edge-to-edge SVG display (note: this requires the wrapper class to be applied by EDS):

`Full-Width SVG`
`The .inline-svg-wrapper class creates full viewport width`

---

## Content Structure

### Icon Span Structure (Input)

When using icon spans, EDS transforms markdown icons into:

```html
<span class="icon icon-arrow">
  <!-- Icon placeholder -->
</span>
```

The block then transforms this to:

```html
<div class="inline-svg">
  <img src="/icons/arrow.svg" alt="arrow illustration">
  <p></p>
</div>
```

### Inline SVG Structure (Input)

Direct SVG markup in the markdown table:

```html
<div class="inline-svg">
  <svg>...</svg>
</div>
```

Becomes:

```html
<div class="inline-svg">
  <svg width="100%" height="100%">
    <!-- Original SVG content preserved -->
  </svg>
</div>
```

---

## Styling & Customization

### CSS Variables

The block uses minimal CSS variables for integration:

- `--dark-color` - Not directly used, available for custom styles
- `--background-color` - Not directly used, available for custom styles

### Custom Styling

Override default styles in your site's CSS:

`Custom SVG Sizing`
`.inline-svg {`
`max-width: 600px;`
`margin: 2rem auto;`
`}`

`Custom SVG Colors (via CSS)`
`.inline-svg svg {`
`fill: var(--color-primary);`
`stroke: var(--color-secondary);`
`}`

`Add Shadow Effects`
`.inline-svg svg {`
`filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));`
`}`

### Animation Support

Add CSS animations to SVG elements:

`Rotate Animation`
`.inline-svg svg {`
`animation: rotate 3s linear infinite;`
`}`
`@keyframes rotate {`
`from { transform: rotate(0deg); }`
`to { transform: rotate(360deg); }`
`}`

---

## Responsive Behavior

### Desktop (> 900px)

- SVG scales to container width
- Maintains aspect ratio
- Centers horizontally and vertically
- Full-width option available via wrapper

### Tablet (600px - 899px)

- Same behavior as desktop
- SVG adapts to available width
- Flexbox centering maintained

### Mobile (< 600px)

- SVG scales to mobile container
- Maintains full responsiveness
- No horizontal scrolling
- Touch-friendly display

### Viewport Width Handling

The `.inline-svg-wrapper` class enables edge-to-edge display:

```css
.inline-svg-wrapper {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
```

This breaks out of content containers for full-width SVG banners.

---

## Accessibility

### Current Implementation

**Icon Images:**

- Alt text automatically generated: `{icon-name} illustration`
- Semantic img elements for icon references
- Screen reader compatible

**Inline SVG:**

- SVG elements preserve original attributes
- Title and desc elements respected if present
- ARIA attributes maintained from source

### Recommended Enhancements

For decorative SVGs:

```html
<svg aria-hidden="true" role="img">...</svg>
```

For meaningful SVGs:

```html
<svg role="img" aria-labelledby="title">
  <title id="title">Descriptive title</title>
  <desc>Longer description if needed</desc>
  ...
</svg>
```

### Keyboard Navigation

- SVG content is non-interactive by default
- No keyboard focus required for static graphics
- Interactive SVG elements should include proper ARIA attributes

---

## Performance

### Loading Strategy

**Icon Images:**

- Browser handles image loading
- Can leverage browser caching for repeated icons
- No JavaScript required after initial processing

**Inline SVG:**

- No external requests (embedded in HTML)
- Immediate rendering
- Larger initial HTML payload for complex SVGs

### Optimization Tips

1. **Icon Library:**
   - Optimize SVG files in `/icons/` directory
   - Remove unnecessary metadata and comments
   - Use SVGO or similar tools

2. **Inline SVG:**
   - Minify SVG markup before embedding
   - Remove unused elements and attributes
   - Simplify paths and shapes

3. **Size Considerations:**
   - Icons: ~1-5 KB per file (external request)
   - Inline SVG: Variable (embedded in HTML)
   - Trade-off: HTTP requests vs HTML size

### Performance Metrics

- **JavaScript execution:** < 5ms per block
- **DOM operations:** Minimal (single block update)
- **Reflow impact:** Low (flexbox layout)
- **Paint complexity:** Depends on SVG complexity

---

## Browser Support

### Fully Supported

- **Chrome/Edge:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **iOS Safari:** 14+
- **Android Chrome:** 90+

### SVG Feature Support

All modern browsers support:

- Inline SVG rendering
- SVG as img source
- CSS styling of SVG
- Responsive SVG sizing
- ViewBox attribute

### Fallback Behavior

For older browsers:

- Icon images degrade gracefully (img element)
- Inline SVG renders with basic support
- Flexbox fallback to block layout in IE11

---

## Troubleshooting

### Issue: Icon Not Displaying

**Symptoms:** Empty space where icon should appear

**Causes:**

1. Icon file missing from `/icons/` directory
2. Incorrect icon name in class
3. SVG file corrupted or invalid

**Solutions:**

- Verify file exists: `/icons/{name}.svg`
- Check icon class: `icon-{name}` matches filename
- Test SVG file directly in browser
- Check browser console for 404 errors

### Issue: SVG Overflowing Container

**Symptoms:** SVG extends beyond block boundaries

**Causes:**

1. Missing `width` and `height` attributes
2. Invalid `viewBox` in SVG
3. CSS conflicts with parent elements

**Solutions:**

- Verify SVG has `viewBox` attribute
- Check CSS: `.inline-svg { max-width: 100%; }`
- Inspect computed styles in DevTools
- Ensure no `position: absolute` conflicts

### Issue: SVG Not Rendering

**Symptoms:** Blank space, no error messages

**Causes:**

1. Invalid SVG markup
2. Missing closing tags
3. Namespace issues in SVG

**Solutions:**

- Validate SVG markup in online validator
- Check for matching open/close tags
- Ensure SVG includes `xmlns="http://www.w3.org/2000/svg"`
- Test SVG in standalone HTML file

### Issue: Styling Not Applied

**Symptoms:** CSS styles don't affect SVG

**Causes:**

1. Inline styles in SVG override CSS
2. Specificity issues
3. SVG CSS properties differ from HTML

**Solutions:**

- Remove inline `style` attributes from SVG
- Use higher specificity: `.inline-svg svg path { }`
- Use SVG-specific properties: `fill`, `stroke`, not `background-color`

---

## Testing

### Browser Testing (test.html)

The block includes a `test.html` file for visual testing:

1. **Open test.html** in a browser
2. **Verify rendering** of different SVG types
3. **Test responsive behavior** by resizing window
4. **Check console** for JavaScript errors

### Manual Test Cases

**Test 1: Icon Reference**

- Create block with `:icon-name:` syntax
- Verify image loads from `/icons/` directory
- Check alt text is properly set

**Test 2: Inline SVG**

- Embed simple SVG markup
- Verify SVG renders correctly
- Check width/height set to 100%

**Test 3: Complex SVG**

- Embed multi-element SVG
- Verify all elements render
- Check responsive scaling

**Test 4: Error Handling**

- Use invalid icon name
- Use malformed SVG markup
- Verify console error messages

### Validation Checklist

- [ ] Icon images load correctly from `/icons/` directory
- [ ] Inline SVG renders with proper sizing
- [ ] Flexbox centering works on all viewport sizes
- [ ] Full-width wrapper breaks out of container
- [ ] Alt text generated for icon images
- [ ] Console errors displayed for invalid content
- [ ] No JavaScript errors in browser console
- [ ] Responsive behavior works on mobile/tablet/desktop

---

## Dependencies

### EDS Core Dependencies

- **aem.js:** Not directly used, but available for utilities
- **lib-franklin.js:** Legacy name for aem.js
- No image optimization functions used (direct SVG/img)

### External Dependencies

- **None:** Pure vanilla JavaScript implementation
- No third-party libraries required
- No build process or compilation needed

### Browser APIs Used

- `querySelector()` - DOM element selection
- `createElement()` - DOM element creation
- `setAttribute()` - SVG attribute manipulation
- `appendChild()` - DOM tree manipulation
- `classList` - CSS class operations
- `console.error()` - Error logging

### Icon Library Dependency

The block expects SVG icon files to be present in:

```
/icons/{name}.svg
```

Icons must be valid SVG files with proper structure.

---

## Future Enhancements

### Planned Features

1. **Lazy Loading for Icon Images**
   - Add `loading="lazy"` attribute option
   - Improve performance for below-fold icons
   - Configuration via block variation

2. **ARIA Label Support**
   - Add support for custom aria-label attributes
   - Distinguish decorative vs meaningful icons
   - Author-configurable accessibility text

3. **Icon Size Variants**
   - Small, medium, large, extra-large presets
   - CSS variable-based sizing system
   - Variation syntax: `Inline SVG (small)`

4. **Color Customization**
   - CSS variable integration for icon colors
   - Support for `fill` and `stroke` overrides
   - Theme-aware color selection

5. **Animation Support**
   - Built-in animation variations
   - Spin, pulse, bounce, fade options
   - CSS-based, no JavaScript animations

6. **SVG Optimization**
   - Automatic SVGO processing on load
   - Remove unnecessary metadata
   - Path simplification option

7. **Inline Style Stripping**
   - Option to remove inline styles from SVG
   - Enable full CSS control
   - Preserve important attributes

8. **Multiple Icon Sources**
   - Support for CDN icon libraries
   - External SVG sprite sheets
   - Data URI embedding option

### Code Improvements

1. **Configuration Object**
   - Add `INLINE_SVG_CONFIG` at top of file
   - Centralize error messages and paths
   - Improve maintainability

2. **Error Handling Enhancement**
   - User-friendly error display in DOM
   - Fallback icon for missing files
   - Retry mechanism for network errors

3. **Testing Automation**
   - Jest unit tests for SVG parsing
   - Playwright browser tests
   - Visual regression testing

4. **Documentation Expansion**
   - More usage examples
   - Video tutorials for authors
   - Common pattern cookbook

---

## Version History

**Current Version:** 1.0.0

**Last Updated:** 2025-11-28

**Author:** Tom Cranstoun

**License:** MIT

---

## Support

For issues, questions, or contributions:

- **GitHub Issues:** Use project issue tracker
- **Documentation:** See EXAMPLE.md for author guide
- **Testing:** Use test.html for validation

---

**Related Blocks:**

- [Icon Block](../icon/) - Dedicated icon display
- [Image Block](../image/) - Raster image handling
- [Embed Block](../embed/) - External content embedding
