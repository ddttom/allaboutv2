# Cards Block

A flexible, responsive grid component for displaying content cards with images, headings, and body text. Ideal for blog listings, product showcases, feature grids, and content galleries.

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

The cards block transforms markdown table content into a responsive grid of cards, each containing an optional image, heading, and body text. It automatically handles image optimization and maintains a consistent layout across different screen sizes.

**Primary Use Cases:**
- Blog post listings with featured images
- Product catalogs and showcases
- Feature grids with icons/images
- Team member profiles
- Service offerings
- Portfolio galleries

**Block Name:** `cards`

**Location:** `/blocks/cards/`

**Files:**
- `cards.js` - Core decoration logic
- `cards.css` - Grid layout and card styling
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Responsive Grid Layout**
   - Auto-fill columns based on available space
   - Minimum column width: 278px
   - Seamless adaptation from mobile to desktop

2. **Image Optimization**
   - Automatic image optimization via `createOptimizedPicture()`
   - Fixed 4:3 aspect ratio for consistency
   - 750px width optimization target
   - Object-fit cover for proper image scaling

3. **Flexible Content Structure**
   - Optional images (cards work with text-only)
   - Heading and body text support
   - Automatic content detection and classification

4. **Semantic HTML Output**
   - Unordered list (`<ul>`) container
   - List item (`<li>`) for each card
   - Proper picture element structure

5. **CSS Variable Support**
   - Uses `--dark-color` for borders
   - Uses `--background-color` for card backgrounds
   - Easy theming through CSS variables

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function performs the following transformations:

1. **Container Creation**: Creates a `<ul>` element as the card container
2. **Row Processing**: Iterates through markdown table rows (block children)
3. **Card Generation**: Converts each row into a `<li>` card
4. **Content Classification**:
   - Divs containing only a picture → `.cards-card-image`
   - All other divs → `.cards-card-body`
5. **Image Optimization**: Applies `createOptimizedPicture()` to all images
6. **DOM Replacement**: Replaces original block content with structured list

### CSS Architecture

The cards block uses a mobile-first approach with grid-based layout:

**Grid System:**
- `display: grid`
- `grid-template-columns: repeat(auto-fill, minmax(278px, 1fr))`
- `grid-gap: 16px`

**Card Structure:**
- Border: `1px solid var(--dark-color)`
- Background: `var(--background-color)`
- Image: Full-width, 4:3 aspect ratio
- Body: 16px margin on all sides

**Responsive Behavior:**
- 1 column on mobile (< 278px wide)
- 2 columns on tablets (~600px)
- 3-4 columns on desktop (> 900px)
- Automatically adjusts based on container width

### Data Flow

```
Markdown Table
    ↓
EDS Initial DOM (block.children = rows)
    ↓
decorate() function
    ↓
DOM Restructuring (ul > li structure)
    ↓
Content Classification (image vs body)
    ↓
Image Optimization (createOptimizedPicture)
    ↓
Final Rendered Cards
```

---

## Usage

### Basic Markdown Structure

In Google Docs, create a table with the block name in the header row:

```
| Cards |
|-------|
| ![Image](image1.jpg) |
| Heading 1 |
| Description text for card 1 |
| ![Image](image2.jpg) |
| Heading 2 |
| Description text for card 2 |
```

### Content Patterns

**Pattern 1: Image + Heading + Body (Recommended)**
```
| Cards |
|-------|
| ![Product](product.jpg) |
| Product Name |
| Brief product description with key features |
```

**Pattern 2: Text-Only Cards**
```
| Cards |
|-------|
| Feature Title |
| Feature description without image |
```

**Pattern 3: Multiple Content Elements**
```
| Cards |
|-------|
| ![](image.jpg) |
| Heading Text |
| Paragraph 1 of description |
| Paragraph 2 with more details |
```

### Integration Points

**With query-index.json:**
The cards block does NOT automatically fetch data - it works with static content only. For dynamic blog listings, use the `bloglist` block instead.

**With other blocks:**
- Can be preceded by hero or header blocks
- Works well after intro text sections
- Compatible with any block structure

---

## Content Structure

### Expected Input (Markdown Table)

The EDS pipeline converts a markdown table into this initial DOM structure:

```html
<div class="cards block">
  <!-- Row 1: Image -->
  <div>
    <div>
      <picture>
        <img src="image1.jpg" alt="Card 1">
      </picture>
    </div>
  </div>
  <!-- Row 2: Heading -->
  <div>
    <div>
      <h3>Card Title</h3>
    </div>
  </div>
  <!-- Row 3: Body -->
  <div>
    <div>
      <p>Card description text</p>
    </div>
  </div>
</div>
```

### Output Structure (After Decoration)

The `decorate()` function transforms it into:

```html
<div class="cards block">
  <ul>
    <li>
      <div class="cards-card-image">
        <picture>
          <!-- Optimized picture with srcset -->
          <img src="image1.jpg" alt="Card 1">
        </picture>
      </div>
      <div class="cards-card-body">
        <h3>Card Title</h3>
        <p>Card description text</p>
      </div>
    </li>
    <!-- More list items... -->
  </ul>
</div>
```

### Card Grouping Logic

The block does NOT automatically group rows into cards. Each row becomes content within a single `<li>`. To create multiple cards, you need to use **separate table cells** or **multiple tables**.

**Important:** The current implementation puts ALL table rows into a single card. For multiple cards, authors should create separate instances of the block or use a different content model.

---

## Styling & Customization

### CSS Variables

Customize the cards block through CSS variables:

```css
:root {
  --dark-color: #333;           /* Border color */
  --background-color: #fff;     /* Card background */
}
```

### Custom Styling

Override default styles in your project's CSS:

```css
/* Adjust card spacing */
.cards > ul {
  grid-gap: 24px;
}

/* Change minimum card width */
.cards > ul {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

/* Add card hover effects */
.cards > ul > li {
  transition: transform 0.2s, box-shadow 0.2s;
}

.cards > ul > li:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Customize image aspect ratio */
.cards > ul > li img {
  aspect-ratio: 16 / 9; /* Change from default 4:3 */
}
```

### Variations

The cards block currently has **no built-in variations**. All customization is done through CSS overrides.

**Future variation ideas:**
- `cards (compact)` - Smaller cards with reduced spacing
- `cards (featured)` - Larger first card for emphasis
- `cards (grid-2)` - Fixed 2-column layout
- `cards (horizontal)` - Horizontal card layout

---

## Responsive Behavior

### Breakpoint Strategy

The cards block uses **content-based responsive design** rather than fixed breakpoints:

- Grid automatically adjusts based on container width
- Minimum card width: 278px
- Maximum columns: As many as fit in available space
- No media queries needed

### Mobile Behavior (< 600px)

- Single column layout (cards stack vertically)
- Full-width images
- 16px gap between cards
- Touch-friendly tap targets

### Tablet Behavior (600px - 1024px)

- 2 columns (depending on container width)
- Maintains aspect ratio and spacing
- Comfortable reading width

### Desktop Behavior (> 1024px)

- 3-4 columns (depending on container width)
- Consistent grid gaps
- Optimal information density

### Testing Responsive Behavior

1. Open `test.html` in a browser
2. Resize browser window to various widths
3. Observe grid reflow at natural breakpoints
4. Verify images maintain 4:3 aspect ratio
5. Check spacing remains consistent

---

## Accessibility

### Semantic HTML

The cards block uses proper semantic markup:

- `<ul>` - Unordered list container (semantically correct for card grid)
- `<li>` - List items (each card is a list item)
- Heading tags (`<h2>`, `<h3>`, etc.) - Proper heading hierarchy
- `<picture>` and `<img>` - Native image elements with alt text

### Screen Reader Support

**What works well:**
- List is announced as "list with N items"
- Each card is a distinct list item
- Headings are navigable via heading shortcuts
- Images have alt attributes (from markdown)

**Best practices for authors:**
1. Always provide alt text for images
2. Use descriptive headings
3. Keep body text concise and clear
4. Maintain logical reading order

### Keyboard Navigation

- All cards are keyboard accessible
- If cards contain links, they're in tab order
- No keyboard traps
- Focus indicators visible (inherited from global styles)

### ARIA Considerations

**No additional ARIA needed** - the semantic HTML structure provides sufficient accessibility information.

---

## Performance

### Image Optimization

The block uses `createOptimizedPicture()` which:
- Generates responsive srcset attributes
- Targets 750px width for optimization
- Uses webp format where supported (via aem.js)
- Implements lazy loading automatically

### Network Efficiency

**Per card:**
- 1 image request (optimized)
- No external API calls
- No additional resource loading

**Total overhead:**
- JavaScript: ~500 bytes (minified)
- CSS: ~300 bytes (minified)
- Images: Depends on number of cards

### Loading Strategy

Cards block loads as part of EDS's default loading pattern:
- Blocks are decorated on page load
- Images use lazy loading (via aem.js)
- No render-blocking resources

### Lighthouse Impact

Expected Lighthouse scores with cards block:
- Performance: 95-100 (depends on image optimization)
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## Browser Support

### Supported Browsers

- Chrome/Edge: Last 2 versions ✓
- Firefox: Last 2 versions ✓
- Safari: Last 2 versions ✓
- iOS Safari: Last 2 versions ✓
- Android Chrome: Last 2 versions ✓

### CSS Grid Support

Requires CSS Grid support (all modern browsers):
- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

**No IE11 support** - CSS Grid is not supported in Internet Explorer.

### Image Format Support

- JPEG: All browsers ✓
- PNG: All browsers ✓
- WebP: Chrome, Firefox, Safari 14+, Edge ✓
- AVIF: Chrome 85+, Firefox 93+ (partial support)

The `createOptimizedPicture()` function handles format fallbacks automatically.

---

## Troubleshooting

### Issue: Cards not appearing

**Symptoms:**
- Blank space where cards should be
- Original table structure still visible
- Console errors

**Solutions:**

1. **Check JavaScript loaded:**
   - Open DevTools Console (F12)
   - Look for errors related to `cards.js`
   - Verify `/blocks/cards/cards.js` returns 200 status

2. **Verify CSS loaded:**
   - Check Network tab for `cards.css`
   - Look for 404 errors
   - Ensure `/blocks/cards/cards.css` is accessible

3. **Inspect DOM structure:**
   - Use Elements panel in DevTools
   - Verify `.cards.block` element exists
   - Check if `<ul>` was created inside block

### Issue: Images not displaying

**Symptoms:**
- Cards show text but no images
- Broken image icons
- Alt text visible but no image

**Solutions:**

1. **Check image URLs:**
   - Verify image paths are correct
   - Test images in new browser tab
   - Ensure images are accessible from domain

2. **Inspect picture elements:**
   - Open DevTools Elements panel
   - Find `.cards-card-image` elements
   - Check `<img src="">` attribute
   - Look for CORS errors in Console

3. **Test image optimization:**
   - Check if `createOptimizedPicture()` is working
   - Look for srcset attributes on images
   - Verify aem.js is loaded

### Issue: Grid layout not working

**Symptoms:**
- Cards stack vertically even on desktop
- No grid columns appearing
- Cards too narrow or too wide

**Solutions:**

1. **Check browser support:**
   - Verify browser supports CSS Grid
   - Test in different browser
   - Check for CSS overrides

2. **Inspect grid CSS:**
   - Use DevTools to inspect `.cards > ul`
   - Verify `display: grid` is applied
   - Check for conflicting styles

3. **Test container width:**
   - Ensure parent container has width
   - Check for `width: 0` or `display: none`
   - Verify no overflow issues

### Issue: Card aspect ratio broken

**Symptoms:**
- Images stretched or squashed
- Inconsistent image heights
- Aspect ratio not maintained

**Solutions:**

1. **Check CSS rules:**
   - Inspect `.cards > ul > li img`
   - Verify `aspect-ratio: 4 / 3` is applied
   - Check for conflicting `height` rules

2. **Test object-fit:**
   - Ensure `object-fit: cover` is working
   - Try `object-fit: contain` if images are cropped incorrectly

3. **Verify image dimensions:**
   - Check original image aspect ratios
   - Use images with similar dimensions
   - Ensure images are not too small

### Issue: Cards have no spacing

**Symptoms:**
- Cards touching each other
- No gaps between rows/columns
- Cramped layout

**Solutions:**

1. **Check grid-gap:**
   - Inspect `.cards > ul`
   - Verify `grid-gap: 16px` is applied
   - Look for overriding CSS

2. **Test body margin:**
   - Check `.cards-card-body` has `margin: 16px`
   - Verify margin is not collapsed

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**
   ```
   http://localhost:3000/blocks/cards/test.html
   ```

2. **Visual checks:**
   - Cards display in grid layout
   - Images load and maintain aspect ratio
   - Text is readable and properly styled
   - Borders and backgrounds appear correctly

3. **Responsive testing:**
   - Resize browser to mobile width (< 600px)
   - Verify single column layout
   - Test tablet width (~768px) for 2 columns
   - Check desktop width (> 1024px) for 3+ columns

4. **Browser testing:**
   - Test in Chrome, Firefox, Safari
   - Verify consistent appearance
   - Check for any browser-specific issues

### DevTools Inspection

```javascript
// Check card structure
document.querySelectorAll('.cards > ul > li').length
// Should return number of cards

// Verify image optimization
document.querySelectorAll('.cards-card-image picture')
// Should have srcset attributes

// Test grid layout
getComputedStyle(document.querySelector('.cards > ul'))
// Check display: grid and grid-template-columns
```

### Automated Testing

**Future implementation:**
- Jest tests for DOM transformation
- Visual regression tests with Playwright
- Accessibility tests with axe-core

---

## Dependencies

### Internal Dependencies

1. **aem.js** (formerly lib-franklin.js)
   - Location: `/scripts/aem.js`
   - Used for: `createOptimizedPicture()` function
   - Required: Yes

2. **styles.css**
   - Location: `/styles/styles.css`
   - Used for: CSS variables (`--dark-color`, `--background-color`)
   - Required: Yes (for theming)

### External Dependencies

**None** - The cards block is a pure EDS-native component with no external libraries.

### Browser APIs

- CSS Grid Layout
- Picture element
- ES6 Modules (for JavaScript import)

---

## Future Enhancements

### Planned Features

1. **Card Variations**
   - `cards (compact)` - Reduced spacing and smaller cards
   - `cards (featured)` - First card larger/emphasized
   - `cards (horizontal)` - Side-by-side image and text
   - `cards (overlay)` - Text overlays on images

2. **Dynamic Content Support**
   - Fetch cards from query-index.json
   - Filter and sort options
   - Pagination support

3. **Enhanced Interactions**
   - Hover animations
   - Click-to-expand details
   - Link wrapping entire card

4. **Customization Options**
   - Configurable column counts
   - Custom aspect ratios
   - Image position options (top, left, right)

5. **Accessibility Improvements**
   - ARIA labels for card regions
   - Live region announcements
   - High contrast mode support

### Contributing

To propose enhancements:
1. Create test content in Google Docs
2. Implement variation in CSS/JS
3. Add test cases to test.html
4. Update documentation
5. Submit PR with demo link

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles

---

## Version History

- **v1.0** (Current) - Initial implementation
  - Grid-based card layout
  - Image optimization
  - Responsive design
  - Basic styling with CSS variables

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
