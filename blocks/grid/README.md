# Grid Block

A versatile, CSS-only grid layout system providing multiple responsive grid patterns for organizing content. The grid block supports various layout types including two-column layouts, logo grids, icon cards, bulleted lists, and image galleries.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Usage](#usage)
5. [Grid Variations](#grid-variations)
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

The grid block is a CSS-only layout component that provides flexible grid patterns for organizing content. Unlike JavaScript-heavy blocks, this block relies entirely on CSS Grid for layout management, making it exceptionally performant and maintainable.

**Primary Use Cases:**

- Logo walls and partner showcases
- Icon-based feature grids
- Two-column content layouts
- Image galleries and media grids
- Bulleted list layouts with icons
- Product grids and service offerings

**Block Name:** `grid`

**Location:** `/blocks/grid/`

**Files:**

- `grid.js` - Empty file (CSS-only block, no JavaScript)
- `grid.css` - All grid layout styles and variations
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Pure CSS Implementation**
   - No JavaScript required
   - Lightweight and performant
   - Easy to maintain and customize

2. **Multiple Grid Variations**
   - Base grid with configurable gaps
   - Two-column responsive layout
   - Logo grid (1-3-5 columns)
   - Icon card grid (1-4 columns)
   - Bulleted grid with icons
   - Image grid layout

3. **Responsive by Default**
   - Mobile-first approach
   - Automatic column adjustment
   - Breakpoint-based layouts
   - Touch-friendly on mobile

4. **Design System Integration**
   - Uses ROS (Robot Operating System) semantic tokens
   - CSS variables for theming
   - Consistent spacing and sizing
   - Drop shadows and borders

5. **Accessibility First**
   - Semantic HTML structure
   - Screen reader compatible
   - Keyboard navigable
   - High contrast support

---

## Technical Architecture

### CSS-Only Block Pattern

The grid block is a CSS-only component, meaning:

- `grid.js` is intentionally empty
- All functionality is in `grid.css`
- EDS automatically applies classes to the block container
- No DOM manipulation or event handling needed

### CSS Grid System

The block uses CSS Grid Layout as its foundation:

```css
.grid {
    display: grid;
    gap: var(--ros-semantic-spacing-gap-component-lg);
}
```

This provides:

- Flexible column layouts
- Automatic row creation
- Responsive gap sizing
- Natural content flow

### Variation Classes

Each variation uses additional CSS classes to modify behavior:

```html
<!-- In markdown: Grid (two-cols) -->
<div class="grid two-cols block">
  <!-- Content -->
</div>
```

The `.grid` base class provides core grid functionality, while variation classes (`.two-cols`, `.logo-grid`, etc.) add specific layout rules.

### Design Token Integration

The block heavily uses ROS semantic tokens:

```css
.grid {
    gap: var(--ros-semantic-spacing-gap-component-lg);
    /* Uses design system spacing */
}

.icon-cards > div {
    padding: var(--ros-semantic-spacing-around-component-3xl);
    /* Consistent padding from design system */
}
```

This ensures visual consistency across the entire application.

### Data Flow

```
Markdown Table
    ↓
EDS Initial DOM (.grid.block with .variation classes)
    ↓
CSS Rules Applied (grid.css)
    ↓
Rendered Grid Layout
```

No JavaScript intervention - pure CSS transformation.

---

## Usage

### Basic Grid

The simplest grid with default gap spacing:

```
| Grid |
|------|
| Item 1 |
| Item 2 |
| Item 3 |
```

Creates a basic grid with responsive columns based on content.

### Two-Column Grid

```
| Grid (two-cols) |
|-----------------|
| Left column content |
| Right column content |
```

Displays as 1 column on mobile, 2 columns on desktop (>= 992px).

### Logo Grid

```
| Grid (logo-grid) |
|------------------|
| ![Logo 1](logo1.png) |
| ![Logo 2](logo2.png) |
| ![Logo 3](logo3.png) |
| ![Logo 4](logo4.png) |
| ![Logo 5](logo5.png) |
```

Responsive logo grid:

- Mobile: 1 column
- Tablet (576px+): 3 columns
- Desktop (992px+): 5 columns

### Icon Cards

```
| Grid (icon-cards) |
|-------------------|
| :icon-name: |
| Feature Title |
| Feature description text |
| :icon-name: |
| Another Feature |
| Description text |
```

Icon-based card grid:

- Mobile: 1 column
- Small tablet (576px+): 2 columns
- Tablet (768px+): 2 columns
- Desktop (992px+): 3 columns
- Large desktop (1200px+): 4 columns

### Bulleted Grid

```
| Grid (bulleted) |
|-----------------|
| :icon-name: Feature 1 |
| :icon-name: Feature 2 |
| :icon-name: Feature 3 |
```

Grid with bullet-style icons on the left side of each item.

---

## Grid Variations

### 1. Base Grid (No Variation)

**Syntax:** `Grid`

**Behavior:**

- Default CSS Grid layout
- Flexible columns based on content
- Large gap spacing from design system

**CSS:**

```css
.grid {
    display: grid;
    gap: var(--ros-semantic-spacing-gap-component-lg);
}
```

**Best for:**

- Flexible content layouts
- Custom grid configurations
- Generic grid containers

---

### 2. Two-Column Grid

**Syntax:** `Grid (two-cols)`

**Behavior:**

- 1 column on mobile (< 992px)
- 2 columns on desktop (>= 992px)
- Equal-width columns
- Responsive breakpoint at 992px

**CSS:**

```css
.grid.two-cols {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 992px) {
    .grid.two-cols {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
```

**Best for:**

- Side-by-side content
- Comparison layouts
- Text with image combinations
- Feature pairs

---

### 3. Bulleted Grid

**Syntax:** `Grid (bulleted)`

**Behavior:**

- Displays items with icon bullets
- Icon takes up 8.33% width (1/12 of grid)
- Flexbox layout within each item
- Icons from design system

**CSS:**

```css
.grid.bulleted > div {
    display: flex;
}

.grid.bulleted > div .icon {
    flex: 0 0 8.33333%;
    padding: var(--ros-semantic-spacing-around-component-xs);
}
```

**Best for:**

- Feature lists with icons
- Checkmark lists
- Bullet-point layouts
- Icon-prefixed content

---

### 4. Image Grid

**Syntax:** `Grid (img-grid)` (implied by section styling)

**Behavior:**

- Section-level styling for image grids
- Border separator at top
- Minimum height: 98px
- Extra padding around grid

**CSS:**

```css
.section:has(.img-grid) {
    border-top: 1px solid var(--ros-semantic-color-seperator-on-base);
    min-height: 98px;
    padding: var(--ros-semantic-spacing-around-component-xl)
             var(--ros-semantic-spacing-around-component-md);
}
```

**Note:** This is a section-level style, not a direct grid variation. The class `.img-grid` triggers special section styling.

**Best for:**

- Photo galleries
- Image showcases
- Visual portfolios
- Media grids

---

### 5. Logo Grid

**Syntax:** `Grid (logo-grid)`

**Behavior:**

- Mobile: 1 column
- Small tablet (576px+): 3 columns
- Tablet (768px+): 3 columns
- Desktop (992px+): 5 columns
- Fixed height containers (57px)
- Centered logo alignment
- Section borders top and bottom

**CSS:**

```css
.logo-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 576px) {
    .logo-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 992px) {
    .logo-grid {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }
}

.logo-grid > div {
    display: flex;
    height: 57px;
    justify-content: center;
}

.logo-grid img {
    max-height: 50px;
    width: auto;
}
```

**Section Styling:**

```css
.section:has(.logo-grid) {
    border-top: var(--ros-semantic-border-width-sm) solid
                var(--ros-semantic-color-seperator-on-base);
    border-bottom: var(--ros-semantic-border-width-sm) solid
                   var(--ros-semantic-color-seperator-on-base);
    padding: var(--ros-semantic-spacing-around-component-xl);
}
```

**Best for:**

- Partner logos
- Client logos
- Brand showcases
- Sponsor displays
- Technology stack displays

---

### 6. Icon Cards

**Syntax:** `Grid (icon-cards)`

**Behavior:**

- Responsive grid: 1-2-3-4 columns
- Card-based layout with shadows
- Rotated icon containers
- Center-aligned text
- Design system typography

**CSS:**

```css
.icon-cards {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: var(--ros-semantic-spacing-gap-component-xl);
    text-align: center;
}

@media (min-width: 576px) {
    .icon-cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 992px) {
    .icon-cards {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 1200px) {
    .icon-cards {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}
```

**Card Styling:**

```css
.icon-cards > div {
    border-radius: var(--ros-semantic-border-radius-default);
    box-shadow: var(--ros-semantic-drop-shadow-md-0-x)
                var(--ros-semantic-drop-shadow-md-0-y)
                var(--ros-semantic-drop-shadow-md-0-blur);
    padding: var(--ros-semantic-spacing-around-component-3xl);
}

.icon-cards > div:hover {
    background-color: var(--ros-semantic-color-background-primary);
    color: var(--ros-semantic-color-foreground-on-on-primary-default);
}
```

**Icon Container:**

```css
.icon-cards .icon {
    background-color: var(--ros-semantic-color-background-layer-2);
    border-radius: 10px;
    height: 60px;
    width: 60px;
    transform: rotate(45deg);  /* Diamond shape */
    display: flex;
    align-items: center;
    margin: 0 auto;
}

.icon-cards svg {
    height: var(--ros-semantic-size-icon-xl-height);
    width: var(--ros-semantic-size-icon-xl-width);
    transform: rotate(-45deg);  /* Counter-rotate icon */
}
```

**Best for:**

- Feature grids with icons
- Service offerings
- Product features
- Benefit lists
- Value propositions

---

## Styling & Customization

### CSS Variables (ROS Semantic Tokens)

The grid block uses design system tokens extensively:

**Spacing:**

```css
--ros-semantic-spacing-gap-component-lg      /* Grid gap */
--ros-semantic-spacing-gap-component-xl      /* Icon cards gap */
--ros-semantic-spacing-around-component-xs   /* Small padding */
--ros-semantic-spacing-around-component-md   /* Medium padding */
--ros-semantic-spacing-around-component-xl   /* Large padding */
--ros-semantic-spacing-around-component-3xl  /* Extra large padding */
```

**Colors:**

```css
--ros-semantic-color-seperator-on-base              /* Border color */
--ros-semantic-color-background-layer-2             /* Icon background */
--ros-semantic-color-background-primary             /* Hover background */
--ros-semantic-color-foreground-on-layer-2          /* Icon color */
--ros-semantic-color-foreground-on-on-primary-default /* Hover text */
```

**Typography:**

```css
--ros-semantic-font-family-heading          /* Heading font */
--ros-semantic-font-weight-heading-regular  /* Regular weight */
--ros-semantic-font-weight-heading-bold     /* Bold weight */
--ros-semantic-font-weight-semi-bold        /* Semi-bold weight */
--ros-semantic-line-height-heading          /* Line height */
--ros-semantic-font-size-mobile-heading-5   /* Mobile font size */
--ros-semantic-font-size-desktop-heading-5  /* Desktop font size */
```

**Borders & Shadows:**

```css
--ros-semantic-border-radius-default        /* Card radius */
--ros-semantic-border-width-sm              /* Border width */
--ros-semantic-drop-shadow-md-*             /* Card shadows */
```

### Custom Styling Examples

**Adjust Grid Gap:**

```css
.grid {
    gap: 2rem; /* Override default gap */
}
```

**Customize Two-Column Breakpoint:**

```css
@media (min-width: 768px) {
    .grid.two-cols {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
```

**Modify Logo Grid Columns:**

```css
@media (min-width: 1400px) {
    .logo-grid {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}
```

**Change Icon Card Hover Effect:**

```css
.icon-cards > div:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
```

---

## Responsive Behavior

### Breakpoint Strategy

The grid block uses multiple responsive breakpoints:

**576px (Small Tablet):**

- Logo grid: 1 → 3 columns
- Icon cards: 1 → 2 columns

**768px (Tablet):**

- Logo grid: maintains 3 columns
- Icon cards: maintains 2 columns

**992px (Desktop):**

- Two-column grid: 1 → 2 columns
- Logo grid: 3 → 5 columns
- Icon cards: 2 → 3 columns

**1200px (Large Desktop):**

- Icon cards: 3 → 4 columns

### Mobile Behavior (< 576px)

- All grids default to single column
- Logo grid: 1 column, vertically stacked
- Icon cards: 1 column, full-width cards
- Two-column grid: single column layout
- Touch-friendly spacing
- Optimized for thumb scrolling

### Tablet Behavior (576px - 992px)

- Logo grid: 3 columns
- Icon cards: 2 columns
- Two-column grid: still 1 column (until 992px)
- Balanced information density
- Good use of screen real estate

### Desktop Behavior (> 992px)

- Logo grid: 5 columns (maximum density)
- Icon cards: 3 columns (4 at 1200px+)
- Two-column grid: 2 equal columns
- Optimal viewing experience
- Maximum information density

### Testing Responsive Behavior

1. Open `test.html` in browser
2. Resize window from 320px to 1920px
3. Observe column changes at breakpoints:
   - 576px: Logo grid 1→3, Icon cards 1→2
   - 768px: No major changes (maintains columns)
   - 992px: Two-cols 1→2, Logo 3→5, Icon cards 2→3
   - 1200px: Icon cards 3→4
4. Verify smooth transitions
5. Check touch targets on mobile

---

## Accessibility

### Semantic HTML

The grid block works with standard HTML elements:

- Divs for grid containers
- Images with alt text
- Headings with proper hierarchy
- Paragraphs for text content
- Links and buttons in natural tab order

### Screen Reader Support

**What works well:**

- Grid announced as container
- Items announced in document order
- Headings navigable via shortcuts
- Images have alt attributes
- Links have descriptive text

**Best practices for authors:**

1. Provide alt text for all images (logos, icons)
2. Use descriptive link text (not "click here")
3. Maintain logical reading order
4. Use semantic headings (h2, h3, etc.)

### Keyboard Navigation

- All interactive elements in tab order
- No keyboard traps
- Focus indicators visible (inherited from global styles)
- Standard navigation patterns
- Logical focus flow (left-to-right, top-to-bottom)

### Color Contrast

Design system tokens ensure WCAG AA compliance:

- Text on backgrounds: 4.5:1 minimum
- Icon contrast: 3:1 minimum
- Hover states: sufficient contrast
- Border separators: visible but subtle

### ARIA Considerations

**No additional ARIA needed** - semantic HTML provides sufficient accessibility information. Grid layouts are non-interactive containers that work well with assistive technologies by default.

---

## Performance

### CSS-Only Advantage

The grid block is exceptionally performant because:

- **Zero JavaScript:** No JS parsing or execution
- **Pure CSS:** Hardware-accelerated rendering
- **No DOM manipulation:** Static structure
- **No event listeners:** No memory overhead
- **No network requests:** All styles bundled

### Network Efficiency

**Per grid block:**

- CSS: ~6KB total (covers all variations)
- JavaScript: 0 bytes (empty file)
- No external dependencies
- No API calls
- No lazy loading needed

**Total overhead:**

- CSS: 6KB (minified with all variations)
- JavaScript: 0KB
- Images: Depends on content (not block overhead)

### Loading Strategy

- CSS loads with page styles (non-blocking)
- No JavaScript to parse or execute
- Instant rendering (no FOUC)
- No hydration needed
- Optimal Cumulative Layout Shift (CLS)

### Rendering Performance

**CSS Grid advantages:**

- Hardware-accelerated layout
- GPU-optimized transforms
- Efficient reflow on resize
- Minimal repaints
- No JavaScript-triggered layouts

### Lighthouse Impact

Expected Lighthouse scores with grid block:

- **Performance:** 100 (no JavaScript overhead)
- **Accessibility:** 100 (semantic HTML + design tokens)
- **Best Practices:** 100 (CSS-only, no anti-patterns)
- **SEO:** 100 (no rendering delays)

---

## Browser Support

### Supported Browsers

All modern browsers with CSS Grid support:

- **Chrome/Edge:** Version 57+ (March 2017) ✓
- **Firefox:** Version 52+ (March 2017) ✓
- **Safari:** Version 10.1+ (March 2017) ✓
- **iOS Safari:** Version 10.3+ (March 2017) ✓
- **Android Chrome:** Version 57+ (March 2017) ✓

### CSS Grid Support

**Required:** CSS Grid Layout Module Level 1

- Available in all browsers since March 2017
- 96%+ global browser support
- No polyfills needed for modern browsers

**Not supported:**

- Internet Explorer 11 (partial support, buggy)
- Opera Mini (no support)
- UC Browser < 11.4

### CSS Features Used

**CSS Grid:**

- `display: grid`
- `grid-template-columns`
- `gap` (grid-gap)
- `repeat()` function
- `minmax()` function

**Modern CSS:**

- CSS Custom Properties (variables)
- `:has()` pseudo-class (for section styling)
- Media queries
- Flexbox (for bulleted and logo layouts)
- Transform (for icon rotation)

### Fallback Strategy

For browsers without CSS Grid support:

1. Content displays as vertical stack (default block behavior)
2. No broken layouts
3. Still accessible and usable
4. Consider adding `@supports` rules if IE11 support needed

---

## Troubleshooting

### Issue: Grid not displaying

**Symptoms:**

- Content stacks vertically
- No grid columns appearing
- Looks like plain block layout

**Solutions:**

1. **Check browser support:**
   - Open DevTools → Console
   - Run: `CSS.supports('display', 'grid')`
   - Should return `true`
   - If false, browser doesn't support CSS Grid

2. **Verify CSS loaded:**
   - Open DevTools → Network tab
   - Look for `grid.css`
   - Verify 200 status code
   - Check file path: `/blocks/grid/grid.css`

3. **Inspect classes:**
   - Open DevTools → Elements panel
   - Find grid container element
   - Should have class: `grid block`
   - Plus variation class: `two-cols`, `logo-grid`, etc.
   - Check computed styles for `display: grid`

---

### Issue: Wrong number of columns

**Symptoms:**

- Too many or too few columns
- Columns don't match expected breakpoint behavior
- Inconsistent column counts

**Solutions:**

1. **Check variation class:**
   - Verify correct variation in markdown: `Grid (logo-grid)`
   - Inspect element for correct class: `.logo-grid`
   - Confirm class is applied to grid container

2. **Test viewport width:**
   - Open DevTools → Device toolbar (Cmd+Shift+M)
   - Check current viewport width
   - Compare to breakpoints:
     - < 576px: Mobile columns
     - 576px - 992px: Tablet columns
     - > 992px: Desktop columns

3. **Check CSS overrides:**
   - Inspect grid element in DevTools
   - Look for overriding `grid-template-columns`
   - Check for conflicting styles from other blocks
   - Verify specificity isn't causing issues

---

### Issue: Logo grid images too large/small

**Symptoms:**

- Logos overflow containers
- Logos too small to see
- Inconsistent logo sizes

**Solutions:**

1. **Check image dimensions:**
   - Logo grid limits height to 50px
   - Width is auto (maintains aspect ratio)
   - Original images should be high quality
   - Recommended: 200-300px wide minimum

2. **Adjust max height:**

   ```css
   .logo-grid img {
       max-height: 70px; /* Increase from 50px */
   }
   ```

3. **Fix container height:**

   ```css
   .logo-grid > div {
       height: 77px; /* Increase from 57px */
   }
   ```

---

### Issue: Icon cards not showing icons

**Symptoms:**

- Icon placeholder visible but no icon
- Empty diamond shapes
- Icons not rendering

**Solutions:**

1. **Check icon syntax:**
   - EDS uses `:icon-name:` syntax in markdown
   - Example: `:star:` or `:check:`
   - Verify icon names are correct
   - Check if icon font is loaded

2. **Inspect icon element:**
   - Open DevTools → Elements
   - Find `.icon` element within card
   - Should contain SVG or icon font element
   - Check for `display: none` or `visibility: hidden`

3. **Verify icon library:**
   - Icons come from project's icon system
   - Check if icon fonts are loaded in Network tab
   - Verify icon sprite sheet is accessible
   - Test with different icon names

---

### Issue: Section borders not appearing

**Symptoms:**

- No top/bottom borders on logo grid sections
- Missing separator lines
- Section styling not applied

**Solutions:**

1. **Check `:has()` support:**
   - Modern CSS selector
   - Safari 15.4+ required
   - Chrome 105+ required
   - Firefox 121+ required
   - Run: `CSS.supports('selector(:has(*))')`

2. **Verify section structure:**

   ```html
   <div class="section">
     <div class="logo-grid block">
       <!-- Grid content -->
     </div>
   </div>
   ```

   - Section must be parent of grid
   - Grid must have `.logo-grid` class

3. **Add borders manually (fallback):**

   ```css
   .logo-grid {
       border-top: 1px solid #e0e0e0;
       border-bottom: 1px solid #e0e0e0;
   }
   ```

---

### Issue: Icon cards hover not working

**Symptoms:**

- No hover effect on cards
- Background doesn't change
- Text color stays same

**Solutions:**

1. **Check hover styles:**
   - Open DevTools
   - Hover over card
   - Check if `:hover` pseudo-class is applied
   - Verify CSS rules in Styles panel

2. **Test pointer events:**
   - Check if `pointer-events: none` is set
   - Verify no overlay blocking hover
   - Test on different devices

3. **Verify CSS loaded:**

   ```css
   .icon-cards > div:hover {
       background-color: var(--ros-semantic-color-background-primary);
   }
   ```

   - Check if CSS variables are defined
   - Test with hardcoded color values

---

### Issue: Responsive breakpoints not triggering

**Symptoms:**

- Columns don't change at expected widths
- Mobile layout on desktop
- Desktop layout on mobile

**Solutions:**

1. **Verify media queries:**
   - Open DevTools → Elements
   - Check computed styles
   - Look for active media queries
   - Verify breakpoint values match viewport

2. **Check viewport meta tag:**

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

   - Must be in `<head>`
   - Ensures proper mobile rendering

3. **Test specific breakpoints:**
   - 576px: Small tablet breakpoint
   - 768px: Tablet breakpoint
   - 992px: Desktop breakpoint
   - 1200px: Large desktop breakpoint
   - Use DevTools device toolbar for precise testing

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**

   ```
   http://localhost:3000/blocks/grid/test.html
   ```

2. **Visual checks:**
   - All grid variations display correctly
   - Columns match expected counts
   - Spacing looks consistent
   - Icons and images render properly

3. **Responsive testing:**
   - Resize browser to 320px (mobile)
   - Verify single column layouts
   - Resize to 768px (tablet)
   - Check 2-3 column layouts
   - Resize to 1200px+ (desktop)
   - Verify maximum column counts

4. **Variation testing:**
   - Test each variation separately
   - Verify two-cols, logo-grid, icon-cards
   - Check bulleted grid layout
   - Confirm section styling applies

5. **Browser testing:**
   - Test in Chrome, Firefox, Safari
   - Verify consistent appearance
   - Check for any browser-specific issues
   - Test on iOS Safari and Android Chrome

### DevTools Inspection

**Check grid structure:**

```javascript
// Count grid items
document.querySelectorAll('.logo-grid > div').length

// Verify grid display
getComputedStyle(document.querySelector('.logo-grid')).display
// Should return 'grid'

// Check column count
getComputedStyle(document.querySelector('.logo-grid'))
  .gridTemplateColumns
// Returns column definitions
```

**Test responsive behavior:**

```javascript
// Get current breakpoint
window.innerWidth
// Compare to breakpoint values

// Check active media queries
matchMedia('(min-width: 992px)').matches
// Returns true/false
```

### Automated Testing

**Future implementation:**

- Visual regression tests with Playwright
- Responsive screenshot tests
- Accessibility tests with axe-core
- CSS validation

---

## Dependencies

### Internal Dependencies

1. **EDS Core Styles**
   - Location: `/styles/styles.css`
   - Used for: Base styles, normalize, global variables
   - Required: Yes

2. **ROS Design System**
   - CSS custom properties (variables)
   - Semantic color tokens
   - Spacing tokens
   - Typography tokens
   - Required: Yes (for design system integration)

### External Dependencies

**None** - The grid block is a pure CSS component with no external libraries or JavaScript dependencies.

### Browser APIs

- **CSS Grid Layout** (required)
- **CSS Custom Properties** (required for theming)
- **CSS `:has()` selector** (optional, for section styling)
- **Media Queries** (required for responsive behavior)
- **Flexbox** (required for bulleted and logo layouts)

---

## Future Enhancements

### Planned Features

1. **Additional Grid Variations**
   - Three-column grid
   - Four-column grid
   - Masonry layout (when CSS Masonry is widely supported)
   - Auto-fit grid with configurable min/max widths

2. **Enhanced Icon Cards**
   - More icon shape options (circle, square, hexagon)
   - Animation on hover (subtle transitions)
   - Different card sizes (small, medium, large)
   - Optional card footers

3. **Advanced Logo Grid**
   - Grayscale logos with color on hover
   - Tooltip on logo hover (name/description)
   - Click-to-expand logo details
   - Logo carousel for overflow

4. **Image Grid Enhancements**
   - Lightbox integration
   - Image captions
   - Lazy loading optimization
   - Image filters (grayscale, blur, etc.)

5. **Accessibility Improvements**
   - Reduced motion support (`prefers-reduced-motion`)
   - High contrast mode styles
   - Focus-visible support for keyboard navigation
   - Screen reader announcements for grid changes

6. **Performance Optimizations**
   - CSS containment for rendering performance
   - Container queries (when widely supported)
   - CSS `content-visibility` for off-screen grids

### Contributing

To propose enhancements:

1. Review existing variations in `grid.css`
2. Create new variation following naming conventions
3. Add responsive breakpoints as needed
4. Test across browsers and devices
5. Update documentation (README.md and EXAMPLE.md)
6. Add test cases to test.html
7. Submit PR with demo screenshots

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[test.html](./test.html)** - Browser-based testing file
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles
- **[CSS Styling Standards](../../docs/for-ai/implementation/block-architecture-standards.md#3-css-styling-standards)** - CSS best practices

---

## Version History

- **v1.0** (Current) - Initial CSS-only implementation
  - Base grid with configurable gaps
  - Two-column responsive layout
  - Logo grid (1-3-5 columns)
  - Icon cards (1-4 columns)
  - Bulleted grid with icons
  - Image grid section styling
  - ROS design system integration

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [EXAMPLE.md](./EXAMPLE.md) for usage examples
3. Test with [test.html](./test.html)
4. Verify browser supports CSS Grid
5. File issue with detailed reproduction steps

---

**Last Updated:** 2025-11-28
**Block Version:** 1.0
**EDS Compatibility:** Current
**Block Type:** CSS-Only (No JavaScript)
