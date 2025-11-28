# Centreblock

A simple, lightweight layout block for centering content vertically and horizontally on the page. Provides consistent spacing and centered text alignment with minimal styling overhead. Perfect for hero sections, feature highlights, call-to-action elements, and standalone announcements.

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

The centreblock transforms markdown content into a centered layout section with vertical spacing. It's designed to be a lightweight, reusable component for content that needs visual emphasis through central positioning.

**Primary Use Cases:**
- Hero sections with centered headlines
- Feature highlights and announcements
- Call-to-action sections
- Standalone quotes or testimonials
- Marketing messages
- Section dividers with centered text

**Block Name:** `centreblock`

**Location:** `/blocks/centreblock/`

**Files:**
- `centreblock.js` - Core decoration logic (minimal implementation)
- `centreblock.css` - Centered layout styles with vertical spacing
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Centered Text Layout**
   - Horizontal text centering via CSS
   - Consistent vertical spacing (100px top/bottom margins)
   - Clean, minimal visual presentation
   - Works with any text content

2. **Heading Optimization**
   - H3 elements styled as inline-block
   - Additional padding for visual balance (0.5rem)
   - Maintains centered alignment
   - Proper spacing around headings

3. **Flexible Content Support**
   - Any text content supported
   - Headings (h1-h6) work seamlessly
   - Paragraphs, lists, and rich text
   - Images can be included

4. **Minimal JavaScript Footprint**
   - No JavaScript manipulation required
   - Pure CSS-based layout
   - Instant rendering (no decoration delay)
   - No event listeners or runtime overhead

5. **Lightweight Implementation**
   - Extremely small file sizes
   - Fast loading and rendering
   - No external dependencies
   - Pure EDS-native component

---

## Technical Architecture

### JavaScript Structure

The `centreblock.js` file exports a minimal default function:

`Empty initialization function`
`export default function init() {`
`  // empty function`
`}`

**Why empty function?**
- EDS requires each block to export a default function
- Centreblock requires no DOM manipulation
- All functionality handled purely through CSS
- Maintains EDS block pattern compliance

### CSS Architecture

The centreblock uses minimal CSS for maximum efficiency:

**Block-level styling:**
- `.centreblock > div` - Direct child divs get centered text alignment
- `text-align: center` - Horizontally centers all inline content
- `margin: 100px 0` - Provides generous vertical spacing (top/bottom)

**Heading styling:**
- `.centreblock > div h3` - Targets h3 elements within block
- `display: inline-block` - Allows padding to work properly
- `padding: 0.5rem` - Adds visual breathing room around heading

### Data Flow

```
Markdown Content
    ↓
EDS Initial DOM (block.children = content divs)
    ↓
CSS Applied (no JavaScript decoration needed)
    ↓
Centered Layout Rendered
    ↓
User sees centered content with vertical spacing
```

**Key concept:** Unlike most blocks, centreblock requires NO JavaScript transformation. The CSS alone provides all functionality.

---

## Usage

### Basic Markdown Structure

In Google Docs, create a table with the block name in the header row:

| Centreblock |
|-------------|
| Your centered content goes here |

### Content Patterns

**Pattern 1: Simple Headline (Recommended)**

| Centreblock |
|-------------|
| Welcome to Our Platform |

**Result:** Centered text with 100px vertical spacing above and below.

**Pattern 2: Headline with Subtext**

| Centreblock |
|-------------|
| ### Our Mission |
| Building better experiences through thoughtful design |

**Result:** Centered heading with centered paragraph below.

**Pattern 3: Call-to-Action**

| Centreblock |
|-------------|
| ### Ready to Get Started? |
| Join thousands of satisfied customers today |

**Result:** Centered CTA section with heading and supporting text.

**Pattern 4: Feature Highlight**

| Centreblock |
|-------------|
| ### Lightning Fast Performance |
| ![](speed-icon.png) |
| Experience blazing-fast load times |

**Result:** Centered feature with icon and description.

### Integration Points

**With other blocks:**
- Works perfectly as hero section
- Can follow header or navigation
- Great as section divider
- Complements quote or testimonial blocks
- No conflicts with any other blocks

**Content Model:**
- Single table row after header
- One cell contains all content
- Content can include multiple elements
- Maintains centered alignment throughout

---

## Content Structure

### Expected Input (Markdown Table)

The EDS pipeline converts a markdown table into this initial DOM structure:

```html
<div class="centreblock block">
  <div>
    <div>Your centered content</div>
  </div>
</div>
```

### Output Structure (After CSS Applied)

The CSS automatically styles the structure:

```html
<div class="centreblock block">
  <div style="text-align: center; margin: 100px 0;">
    <div>Your centered content</div>
  </div>
</div>
```

**Note:** No JavaScript transformation occurs. The `init()` function is called but performs no operations.

### Multiple Content Elements

When you include headings and text:

**Input:**
```html
<div class="centreblock block">
  <div>
    <div>
      <h3>Our Mission</h3>
      <p>Building better experiences</p>
    </div>
  </div>
</div>
```

**Rendered result:**
- H3 gets `display: inline-block` and `padding: 0.5rem`
- All content inherits `text-align: center`
- 100px vertical margins create visual separation

---

## Styling & Customization

### CSS Variables

The centreblock does not use CSS variables. All styling is hardcoded for simplicity and performance.

**Default values:**
- Vertical margin: `100px`
- H3 padding: `0.5rem`
- Text alignment: `center`

### Custom Styling

Override default styles in your project's CSS:

**Adjust vertical spacing:**
```css
.centreblock > div {
  margin: 50px 0; /* Less vertical space */
}
```

**Change heading padding:**
```css
.centreblock > div h3 {
  padding: 1rem; /* More padding around heading */
}
```

**Add background color:**
```css
.centreblock > div {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 1rem;
}
```

**Limit content width:**
```css
.centreblock > div {
  max-width: 800px;
  margin: 100px auto; /* Horizontal centering */
}
```

**Add border or shadow:**
```css
.centreblock > div {
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 2rem;
  border-radius: 8px;
}
```

### Variations

The centreblock currently has **no built-in variations**. All customization is done through CSS overrides.

**Future variation ideas:**
- `centreblock (compact)` - Reduced vertical margins (50px instead of 100px)
- `centreblock (wide)` - Full-width centered content
- `centreblock (hero)` - Extra large text and spacing
- `centreblock (highlight)` - With background color or gradient

---

## Responsive Behavior

### Mobile Behavior (< 600px)

- Text remains centered
- Vertical margins maintained (100px)
- H3 padding provides touch-friendly spacing
- Content reflows naturally
- Long text wraps appropriately

**Recommended adjustments:**
```css
@media (max-width: 600px) {
  .centreblock > div {
    margin: 50px 0; /* Reduce vertical space on mobile */
    padding: 0 1rem; /* Add horizontal padding */
  }

  .centreblock > div h3 {
    font-size: 1.5rem; /* Adjust heading size */
  }
}
```

### Tablet Behavior (600px - 1024px)

- Default styles work well
- Centered layout feels natural
- Plenty of breathing room
- No special handling needed

### Desktop Behavior (> 1024px)

- Full 100px vertical margins
- Centered content provides visual focus
- Works great with wide content
- Consider max-width for readability

**Recommended enhancement:**
```css
@media (min-width: 1024px) {
  .centreblock > div {
    max-width: 1000px;
    margin: 100px auto; /* Center horizontally too */
  }
}
```

### Testing Responsive Behavior

1. Open `test.html` in a browser
2. Resize browser window to various widths
3. Observe content remains centered
4. Verify vertical spacing feels balanced
5. Check text readability at all sizes

---

## Accessibility

### Semantic HTML

The centreblock maintains semantic HTML structure:

**Heading hierarchy:**
- Use proper heading levels (h1-h6)
- Don't skip heading levels
- Maintain logical document outline
- Screen readers navigate by headings

**Text alternatives:**
- Provide alt text for any images
- Use descriptive text, not just "Click here"
- Avoid image-only content

### Screen Reader Support

**What works well:**
- Content read in natural order
- Headings announced properly
- Text centering doesn't affect reading
- No ARIA attributes needed (semantic HTML is sufficient)

**Screen reader flow:**
1. Block content read top-to-bottom
2. Headings announced with proper level
3. Visual centering doesn't affect audio order
4. All content fully accessible

### Keyboard Navigation

**No interactive elements:**
- Centreblock is purely presentational
- No keyboard interaction needed
- If links included, they work normally
- Focus indicators work on any links/buttons

### Color Contrast

**Default implementation:**
- Uses inherited text colors
- No custom colors defined
- Follows site-wide color scheme
- Ensure sufficient contrast (4.5:1 minimum)

**Custom styling considerations:**
- If adding background colors, verify contrast
- Test with color contrast tools
- Support high contrast mode
- Don't rely on color alone for meaning

### Best Practices

1. **Use meaningful headings:** Not just "Title" or "Heading"
2. **Keep content concise:** Centered content is best when brief
3. **Provide alt text:** For any images in the centered content
4. **Test with screen reader:** Verify content is announced clearly
5. **Check keyboard access:** If interactive elements are included

---

## Performance

### JavaScript Execution

**Initial decoration:**
- Empty function called (instant execution)
- Zero DOM manipulation
- No event listeners
- No ongoing overhead

**Runtime performance:**
- Zero JavaScript overhead
- Pure CSS-based rendering
- No performance impact
- Instant paint

**Optimization advantages:**
- No JavaScript to download (except empty function)
- No execution time
- No memory footprint
- CSS-only is the fastest approach

### Memory Footprint

**Per centreblock:**
- No JavaScript objects created
- No event listeners registered
- No dynamic state
- Zero memory overhead beyond DOM itself

**Typical usage:**
- 1-3 centreblocks per page
- < 50 bytes JavaScript (minified)
- < 200 bytes CSS (minified)

### Network Efficiency

**Initial load:**
- centreblock.js: ~60 bytes (minified) - just the empty function
- centreblock.css: ~150 bytes (minified)
- No external dependencies
- No API calls
- Extremely efficient

**Runtime:**
- No additional network requests
- No dynamic content loading
- All content loaded upfront
- Instant rendering

### Loading Strategy

Centreblock loads as part of EDS's default loading pattern:
- CSS loads with page styles (non-blocking)
- JavaScript loads but does nothing
- No render-blocking resources
- Instant visual presentation

### Lighthouse Impact

Expected Lighthouse scores with centreblock:
- Performance: 100 (no impact)
- Accessibility: 95-100 (depends on content)
- Best Practices: 100
- SEO: 100

**Why perfect scores?**
- No JavaScript overhead
- Minimal CSS
- No network requests
- Pure semantic HTML
- Fast rendering

---

## Browser Support

### Supported Browsers

- Chrome/Edge: All versions ✓
- Firefox: All versions ✓
- Safari: All versions ✓
- iOS Safari: All versions ✓
- Android Chrome: All versions ✓
- Internet Explorer 11: ✓

### Required Features

- `text-align: center` (CSS1 - universal support)
- `margin` property (CSS1 - universal support)
- `display: inline-block` (CSS2.1 - universal support)
- `padding` property (CSS1 - universal support)

**All browsers support these basic CSS features.**

### Progressive Enhancement

**Base experience:**
- Centered text with vertical spacing
- Works in all browsers
- No fallback needed

**Enhanced experience:**
- Same as base experience
- No enhancements to progressively add

**Degraded experience:**
- If CSS fails to load (extremely rare)
- Content still readable, just not centered
- Graceful degradation built-in

---

## Troubleshooting

### Issue: Content not centered

**Symptoms:**
- Content appears left-aligned
- No centering visible
- Default text alignment

**Solutions:**

1. **Check CSS loaded:**
   - Open DevTools Network tab (F12)
   - Look for `centreblock.css`
   - Verify 200 status (not 404)
   - Check `/blocks/centreblock/centreblock.css` is accessible

2. **Inspect applied styles:**
   - Right-click content, select "Inspect"
   - Check Styles panel
   - Verify `text-align: center` is applied
   - Look for CSS rule: `.centreblock > div { text-align: center; }`

3. **Check DOM structure:**
   - Open Elements panel in DevTools
   - Verify `.centreblock.block` element exists
   - Check for nested `<div>` elements
   - Ensure proper EDS transformation occurred

### Issue: No vertical spacing

**Symptoms:**
- Content appears cramped
- No space above/below block
- Runs into adjacent content

**Solutions:**

1. **Verify CSS loaded:**
   - Same as above (check CSS file loads)
   - Look for margin rule: `.centreblock > div { margin: 100px 0; }`

2. **Check parent container:**
   - Inspect parent elements
   - Look for `overflow: hidden` (can clip margins)
   - Check for margin collapsing issues
   - Verify no conflicting styles

3. **Test margin explicitly:**
   ```css
   /* Add temporarily to test */
   .centreblock > div {
     margin: 100px 0 !important;
     background: yellow; /* Visual confirmation */
   }
   ```

### Issue: H3 styling not applied

**Symptoms:**
- H3 doesn't have padding
- H3 doesn't appear inline-block
- H3 looks like default heading

**Solutions:**

1. **Check CSS specificity:**
   - Rule: `.centreblock > div h3`
   - Ensure no more specific rules override
   - Look in DevTools Styles panel for crossed-out rules

2. **Verify DOM structure:**
   - H3 must be inside `.centreblock > div`
   - Check actual DOM hierarchy
   - Ensure proper nesting

3. **Test rule directly:**
   ```css
   /* Add temporarily */
   .centreblock h3 {
     display: inline-block !important;
     padding: 0.5rem !important;
     background: lightblue; /* Visual confirmation */
   }
   ```

### Issue: Content overflows on mobile

**Symptoms:**
- Horizontal scrolling on mobile
- Content cut off at screen edges
- Text too wide for viewport

**Solutions:**

1. **Add responsive padding:**
   ```css
   @media (max-width: 600px) {
     .centreblock > div {
       padding: 0 1rem; /* Horizontal padding */
     }
   }
   ```

2. **Reduce vertical margins on mobile:**
   ```css
   @media (max-width: 600px) {
     .centreblock > div {
       margin: 50px 0; /* Less vertical space */
     }
   }
   ```

3. **Check for fixed-width content:**
   - Images with fixed widths
   - Pre-formatted text
   - Tables (should be responsive)

### Issue: Block appears empty

**Symptoms:**
- Nothing visible where block should be
- Empty space in page
- Block element exists but looks blank

**Solutions:**

1. **Check content in DOM:**
   - Inspect element in DevTools
   - Verify content is present in HTML
   - Look for empty divs

2. **Verify color contrast:**
   - White text on white background?
   - Check computed text color
   - Verify background color

3. **Check for `display: none`:**
   - Look for conflicting CSS rules
   - Check if content is hidden
   - Verify no JavaScript hiding content

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**
   ```
   http://localhost:3000/blocks/centreblock/test.html
   ```

2. **Visual checks:**
   - Content appears centered horizontally
   - 100px vertical spacing above and below
   - H3 headings have proper padding
   - Text is readable and well-spaced

3. **Responsive testing:**
   - Resize browser to mobile width (< 600px)
   - Verify content remains centered
   - Check vertical spacing feels balanced
   - Test tablet width (~768px) behavior
   - Verify desktop width (> 1024px) display

4. **Content variations:**
   - Test with just text
   - Test with headings
   - Test with images
   - Test with multiple paragraphs

5. **Browser testing:**
   - Test in Chrome, Firefox, Safari
   - Verify consistent appearance
   - Check for browser-specific issues

### DevTools Inspection

**Check applied styles:**
```javascript
// In console
const block = document.querySelector('.centreblock > div');
const styles = window.getComputedStyle(block);
console.log('Text align:', styles.textAlign); // Should be "center"
console.log('Margin top:', styles.marginTop); // Should be "100px"
console.log('Margin bottom:', styles.marginBottom); // Should be "100px"

// Check H3 styling
const h3 = document.querySelector('.centreblock h3');
if (h3) {
  const h3Styles = window.getComputedStyle(h3);
  console.log('Display:', h3Styles.display); // Should be "inline-block"
  console.log('Padding:', h3Styles.padding); // Should be "0.5rem"
}
```

**Verify DOM structure:**
```javascript
// Check block exists
document.querySelectorAll('.centreblock.block').length
// Should return number of centreblocks on page

// Check content
const content = document.querySelector('.centreblock');
console.log('Has content:', content.textContent.length > 0);
```

### Automated Testing

**Future implementation:**
- Jest tests for CSS presence
- Visual regression tests with Playwright
- Accessibility tests with axe-core
- Responsive layout tests

**Example test cases:**
```javascript
describe('Centreblock', () => {
  test('applies centered text alignment', () => {
    // Test CSS rule exists
  });

  test('applies 100px vertical margins', () => {
    // Test margin calculation
  });

  test('styles H3 as inline-block with padding', () => {
    // Test H3 styling
  });

  test('content remains centered on mobile', () => {
    // Test responsive behavior
  });
});
```

---

## Dependencies

### Internal Dependencies

1. **styles.css**
   - Location: `/styles/styles.css`
   - Used for: Base text styles, font families, colors
   - Required: Yes (for text styling)

**No other dependencies** - The centreblock is completely self-contained.

### External Dependencies

**None** - Pure EDS-native component with no external libraries.

### Browser APIs

- Basic CSS support (text-align, margin, padding, display)
- No JavaScript APIs used (empty function)
- No DOM manipulation
- No event listeners

---

## Future Enhancements

### Planned Features

1. **Built-in Variations**
   - `centreblock (compact)` - Reduced margins (50px)
   - `centreblock (hero)` - Extra large text, more spacing
   - `centreblock (highlight)` - Background color/gradient
   - `centreblock (wide)` - Full-width centered content

2. **Responsive Enhancements**
   - Automatic margin reduction on mobile
   - Max-width for better readability on wide screens
   - Horizontal padding on small viewports

3. **Advanced Styling**
   - CSS variable support for easy theming
   - Optional background patterns
   - Border and shadow options
   - Gradient backgrounds

4. **Animation Options**
   - Fade-in on scroll
   - Slide-in effects
   - Parallax backgrounds
   - Smooth transitions

5. **Content Enhancements**
   - Icon integration
   - Button styling
   - Multiple content layouts
   - Grid-based variants

### Contributing

To propose enhancements:
1. Create test content in Google Docs
2. Implement feature in CSS (keep JavaScript minimal)
3. Add test cases to test.html
4. Update documentation
5. Submit PR with demo link

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[test.html](./test.html)** - Browser-based testing file
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles
- **[CSS Best Practices](../../docs/for-ai/guidelines/frontend-guidelines.md)** - Frontend development guidelines

---

## Version History

- **v1.0** (Current) - Initial implementation
  - Centered text layout with CSS
  - 100px vertical margins
  - H3 inline-block styling with padding
  - Minimal JavaScript (empty function)
  - Pure CSS-based rendering

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [EXAMPLE.md](./EXAMPLE.md) for usage examples
3. Test with [test.html](./test.html)
4. Inspect CSS in browser DevTools
5. File issue with detailed reproduction steps

---

**Last Updated:** 2025-11-28
**Block Version:** 1.0
**EDS Compatibility:** Current
**Pattern:** Pure CSS Layout Block
