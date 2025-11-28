# Columns Block

A flexible multi-column layout system for organizing content side-by-side. Automatically detects column count and creates responsive layouts that stack on mobile and display horizontally on desktop. Perfect for feature comparisons, text + image layouts, and multi-column content organization.

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

The columns block transforms markdown table content into flexible multi-column layouts using CSS flexbox. The block automatically detects the number of columns in the first row and applies appropriate styling, with special handling for image-only columns.

**Primary Use Cases:**
- Side-by-side text and image layouts
- Feature comparison displays
- Multi-column content organization
- Hero sections with text + media
- Service or product showcases
- Before/after comparisons

**Block Name:** `columns`

**Location:** `/blocks/columns/`

**Files:**
- `columns.js` - Core decoration logic with column detection
- `columns.css` - Flexbox layout and responsive styles
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Automatic Column Detection**
   - Counts columns from first row
   - Adds CSS class: `columns-N-cols` (e.g., `columns-2-cols`)
   - Supports any number of columns
   - Dynamic class application

2. **Image Column Recognition**
   - Detects picture-only columns
   - Adds `columns-img-col` class
   - Special ordering on mobile (images first)
   - Optimized image display

3. **Responsive Layout**
   - Mobile: Vertical stack (images first)
   - Desktop: Horizontal flex layout
   - 900px breakpoint for switching
   - Equal column widths with `flex: 1`

4. **Flexible Content Support**
   - Any HTML content in columns
   - Text, images, headings, lists
   - Mixed content types
   - No fixed column constraints

5. **Smart Image Handling**
   - Full-width images in columns
   - Block-level display for image-only columns
   - Maintains aspect ratio
   - Optimized for responsive images

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function performs these transformations:

1. **Column Count Detection**: Reads number of children in first row
2. **Class Application**: Adds `columns-N-cols` class to block
3. **Image Column Detection**:
   - Queries each column for `<picture>` elements
   - Checks if picture is only content in column
   - Adds `columns-img-col` class if true
4. **DOM Structure**: Preserves markdown table structure as nested divs

**Key Functions:**

`decorate(block)`
- **Purpose**: Main decoration function
- **Parameters**: `block` - The columns block div element
- **Returns**: void (modifies DOM in place)
- **Process**:
  1. Extract first row's children to count columns
  2. Add column count class to block
  3. Iterate through all rows and columns
  4. Detect and mark image-only columns
  5. Apply `columns-img-col` class where appropriate

### CSS Structure

**Base Layout:**
```
.columns > div
  - display: flex
  - flex-direction: column (mobile)
  - flex-direction: unset (desktop)
```

**Column Styling:**
```
.columns > div > div
  - flex: 1 (equal width on desktop)
  - order: 1 (text columns)
```

**Image Column Styling:**
```
.columns > div > .columns-img-col
  - order: 0 (appears first on mobile)
  - display: block (for images)
```

### DOM Transformation

**Markdown Input:**
```
| Columns |
|---------|
| Column 1 | Column 2 |
```

**HTML Output:**
```
<div class="columns columns-2-cols block">
  <div>
    <div>Column 1</div>
    <div>Column 2</div>
  </div>
</div>
```

**With Image:**
```
<div class="columns columns-2-cols block">
  <div>
    <div class="columns-img-col">
      <picture>...</picture>
    </div>
    <div>Text content</div>
  </div>
</div>
```

---

## Usage

### Basic Two-Column Layout

**Markdown:**
```
| Columns |
|---------|
| ![Image](path/to/image.jpg) | Text content describing the image and providing context. |
```

**Result:** Two equal-width columns on desktop. Image first on mobile, side-by-side on desktop.

### Three-Column Layout

**Markdown:**
```
| Columns |
|---------|
| Column 1 | Column 2 | Column 3 |
```

**Result:** Three equal-width columns on desktop. Stacked vertically on mobile.

### Text-Only Columns

**Markdown:**
```
| Columns |
|---------|
| ## Feature 1\n\nDescription here | ## Feature 2\n\nDescription here |
```

**Result:** Side-by-side text columns with equal widths.

---

## Content Structure

### Markdown Table Format

The columns block uses EDS standard markdown table format:

```
| Columns |
|---------|
| Cell 1 | Cell 2 | Cell 3 | ... |
```

**Rules:**
- First row header: `| Columns |`
- Separator row: `|---------|`
- Content row: Pipe-separated columns
- Number of columns: Detected from first content row
- Multiple rows: Each row becomes a separate column group

### Content Recommendations

**Text Columns:**
- Use headings for section titles
- Keep text length balanced across columns
- Paragraphs, lists, and formatting supported

**Image Columns:**
- Images should be properly sized
- Use EDS image optimization
- Alt text for accessibility

**Mixed Content:**
- Combine text, images, headings
- No restrictions on HTML content
- Nested blocks NOT supported

---

## Styling & Customization

### CSS Variables

The columns block inherits global CSS variables:

```
--body-font-family
--heading-font-family
--body-font-size
--background-color
--text-color
```

### Custom Styling

Override styles using block-specific selectors:

`Customize column gap`
`.columns > div { gap: 2rem; }`

`Adjust column width ratio`
`.columns > div > div:first-child { flex: 2; }`
`.columns > div > div:last-child { flex: 1; }`

`Add borders between columns`
`.columns > div > div { border-right: 1px solid #eee; }`
`.columns > div > div:last-child { border-right: none; }`

### Column Count Classes

The block automatically adds classes based on column count:

- `.columns-2-cols` - Two columns
- `.columns-3-cols` - Three columns
- `.columns-4-cols` - Four columns
- `.columns-N-cols` - N columns

**Use these for column-specific styling:**

`Two-column specific`
`.columns.columns-2-cols > div { gap: 3rem; }`

`Three-column specific`
`.columns.columns-3-cols > div > div { min-width: 200px; }`

---

## Responsive Behavior

### Breakpoint Strategy

**Mobile (< 900px):**
- Columns stack vertically
- `flex-direction: column`
- Image columns appear first (`order: 0`)
- Text columns appear second (`order: 1`)
- Full-width content

**Desktop (>= 900px):**
- Horizontal flexbox layout
- `flex-direction: unset`
- Equal column widths (`flex: 1`)
- 32px gap between columns
- Vertically centered (`align-items: center`)

### Responsive Images

Images automatically scale:
- Mobile: Full container width
- Desktop: Constrained by column width
- Maintains aspect ratio
- `width: 100%` applied to all images

### Testing Responsive Behavior

1. Start at desktop width (> 900px)
2. Verify columns display side-by-side
3. Resize to mobile width (< 900px)
4. Verify columns stack vertically
5. Check image-first ordering on mobile
6. Test at exactly 900px for breakpoint accuracy

---

## Accessibility

### Semantic HTML

The block maintains semantic HTML structure:
- Divs for layout only
- Images include alt text (from markdown)
- Headings maintain hierarchy
- No ARIA required (layout only)

### Screen Reader Support

- Content reads in DOM order
- Mobile: Images first, then text
- Desktop: Left-to-right column order
- No hidden content
- All content accessible

### Keyboard Navigation

- No interactive elements in block itself
- Links/buttons within columns remain keyboard accessible
- Tab order follows DOM structure
- Focus indicators inherit from global styles

### Color Contrast

- No text overlaid on images
- Background colors inherit from theme
- Text colors meet WCAG AA standards
- User can override with custom CSS

### Accessibility Best Practices

1. **Alt Text**: Always provide descriptive alt text for images
2. **Heading Hierarchy**: Maintain proper heading levels (H2, H3, etc.)
3. **Link Context**: Ensure links have meaningful text
4. **Content Order**: Most important content in first column (mobile first)

---

## Performance

### Core Web Vitals Impact

**Largest Contentful Paint (LCP):**
- Minimal JavaScript execution
- No layout shift from decoration
- Images can be optimized via EDS

**Cumulative Layout Shift (CLS):**
- No layout shift after decoration
- CSS applied before JavaScript runs
- Stable column heights

**First Input Delay (FID):**
- No event listeners attached
- Decoration runs in < 1ms
- No blocking operations

### Optimization Strategies

1. **Image Optimization**
   - Use EDS image optimization
   - Serve responsive images
   - Lazy load images below fold

2. **CSS Loading**
   - Inline critical CSS
   - Load columns.css as needed
   - Use E-L-D pattern for delayed blocks

3. **JavaScript Efficiency**
   - Minimal DOM manipulation
   - No loops over large datasets
   - Runs once per block

### Performance Metrics

- **JavaScript Size**: 568 bytes (unminified)
- **CSS Size**: 425 bytes (unminified)
- **Decoration Time**: < 1ms per block
- **Memory Usage**: Negligible
- **No External Dependencies**: Zero network requests

---

## Browser Support

### Supported Browsers

**Desktop:**
- Chrome/Edge 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓

**Mobile:**
- iOS Safari 14+ ✓
- Android Chrome 90+ ✓
- Samsung Internet 14+ ✓

### Feature Requirements

**CSS Flexbox:**
- Required for layout
- Supported in all modern browsers
- Fallback: Content stacks vertically

**CSS Media Queries:**
- Required for responsive behavior
- `@media (width >= 900px)` syntax
- Widely supported

**JavaScript ES6:**
- Spread operator: `[...block.children]`
- Arrow functions
- `querySelector` / `querySelectorAll`

### Polyfills

No polyfills required for modern browsers. For legacy browser support:

- **IE11**: Requires Babel transpilation for spread operator
- **CSS Grid Fallback**: Not needed (flexbox is standard)

### Known Browser Issues

**Safari < 14:**
- May not support `width >=` media query syntax
- Use `min-width: 900px` as fallback

**IE11:**
- No native spread operator support
- Requires transpilation

---

## Troubleshooting

### Common Issues

**Issue: Columns not appearing side-by-side**

**Symptoms:**
- Columns stack vertically on desktop
- No horizontal layout

**Solutions:**
1. Check browser width is >= 900px
2. Verify `columns.css` is loaded
3. Check for CSS conflicts with `flex-direction`
4. Inspect element for `.columns` class

**Issue: Images not full width**

**Symptoms:**
- Images appear smaller than column width
- Inconsistent image sizing

**Solutions:**
1. Verify `.columns img { width: 100%; }` is applied
2. Check for inline width styles on images
3. Ensure picture element exists
4. Test with different image formats

**Issue: Image columns not ordered first on mobile**

**Symptoms:**
- Text appears before images on mobile
- Incorrect stacking order

**Solutions:**
1. Check if `columns-img-col` class is applied
2. Verify image is only content in column (no text)
3. Inspect CSS order values
4. Check for wrapper divs around picture

**Issue: Unequal column widths**

**Symptoms:**
- Columns have different widths on desktop
- Layout appears unbalanced

**Solutions:**
1. Check for custom CSS overriding `flex: 1`
2. Verify no fixed widths on columns
3. Test with different content lengths
4. Inspect flexbox properties in DevTools

**Issue: Column count class not applied**

**Symptoms:**
- No `.columns-N-cols` class on block
- Custom column-specific styles not working

**Solutions:**
1. Verify `columns.js` is loaded and executed
2. Check console for JavaScript errors
3. Inspect block element for class names
4. Verify first row has correct number of cells

---

## Testing

### Manual Testing Checklist

**Visual Testing:**
- [ ] Columns display correctly on desktop (>= 900px)
- [ ] Columns stack vertically on mobile (< 900px)
- [ ] Images are full width in their columns
- [ ] Equal spacing between columns (32px gap)
- [ ] Content is vertically centered on desktop

**Responsive Testing:**
- [ ] Test at 899px (just below breakpoint)
- [ ] Test at 900px (exactly at breakpoint)
- [ ] Test at 1200px (standard desktop)
- [ ] Test on actual mobile device
- [ ] Check iPad/tablet sizes

**Content Testing:**
- [ ] Two-column layout (text + image)
- [ ] Three-column layout (equal text)
- [ ] Image-only columns
- [ ] Text-only columns
- [ ] Mixed content (headings, lists, paragraphs)

**Accessibility Testing:**
- [ ] Screen reader reads content in correct order
- [ ] Images have alt text
- [ ] Heading hierarchy is preserved
- [ ] Keyboard navigation works through columns
- [ ] Focus indicators visible

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Automated Testing

**Unit Tests:**
```
Test column count detection
Test image column class application
Test DOM structure preservation
```

**Integration Tests:**
```
Test with EDS core decoration
Test E-L-D loading pattern
Test with multiple blocks on page
```

### Test Files

- `test.html` - Browser-based visual testing
- Located: `/blocks/columns/test.html`
- Run: `npm run debug` and navigate to `/blocks/columns/test.html`

---

## Dependencies

### EDS Core

The columns block depends on EDS core for:

**Markdown Transformation:**
- Converts markdown tables to nested divs
- Applied before block decoration
- Structure: `.block > div > div`

**Block Loading:**
- E-L-D pattern (Eager/Lazy/Delayed)
- Auto-decoration via `decorate()` export
- CSS auto-loading

**Image Optimization:**
- EDS handles image URLs
- Responsive image sizing
- Picture element generation

### External Dependencies

**None.** The columns block is self-contained:
- No third-party libraries
- No external CSS frameworks
- No icon sets or fonts
- Pure vanilla JavaScript and CSS

### Internal Dependencies

**CSS Variables:**
```
--body-font-family (from styles.css)
--text-color (from styles.css)
--background-color (from styles.css)
```

**Utility Functions:**
- None (block does not use aem.js utilities)

---

## Future Enhancements

### Planned Features

1. **Column Variations**
   - `Columns (narrow)` - Reduced gap between columns
   - `Columns (wide)` - Increased gap
   - `Columns (no-stack)` - Horizontal scroll on mobile

2. **Vertical Alignment Options**
   - `Columns (top)` - Align content to top
   - `Columns (bottom)` - Align content to bottom
   - Default: Center alignment

3. **Column Ratio Control**
   - `Columns (2:1)` - 2/3 + 1/3 split
   - `Columns (1:2)` - 1/3 + 2/3 split
   - `Columns (1:1:2)` - Custom ratios

4. **Background Options**
   - `Columns (highlight)` - Alternate column backgrounds
   - `Columns (bordered)` - Borders between columns
   - Custom background colors

5. **Advanced Image Handling**
   - Object-fit options (cover, contain)
   - Background image columns
   - Image aspect ratio control

### Contribution Ideas

- Add vertical dividers between columns
- Support for nested columns
- Animation on scroll reveal
- Parallax effects for image columns
- Dark mode specific styling

### Considerations

**Why Not Include Now:**
- Keep block simple and maintainable
- Avoid feature bloat
- Most use cases covered by current implementation
- Variations can be added as needed

**Implementation Strategy:**
- Use variation classes for options (e.g., `columns-narrow`)
- Maintain single JavaScript file
- Add CSS-only features where possible
- Preserve backward compatibility

---

**Version:** 1.0.0
**Last Updated:** 2025-11-28
**Maintained By:** Tom Cranstoun
