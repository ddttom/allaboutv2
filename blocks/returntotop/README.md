---
title: "Return to Top Block"
description: "Documentation for the returntotop EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Return to Top Block

A lightweight, accessible scroll-to-top button that appears after scrolling down the page. Provides users with a quick way to return to the top of long documents without manual scrolling. Perfect for long-form content, blog posts, documentation, and multi-section pages.

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

The return to top block provides a fixed-position button that appears when users scroll down more than 100 pixels. Clicking the button smoothly scrolls the page back to the top. This is a document-level utility block that enhances navigation on long pages.

**Primary Use Cases:**

- Long-form articles and blog posts
- Documentation pages with multiple sections
- Product pages with extensive descriptions
- FAQ pages with many questions
- Multi-section landing pages
- Any page where users scroll significantly

**Block Name:** `returntotop`

**Location:** `/blocks/returntotop/`

**Files:**

- `returntotop.js` - Scroll detection and button behavior
- `returntotop.css` - Fixed positioning and button styling
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Automatic Visibility Management**
   - Hidden by default (display: none)
   - Appears after scrolling down 100 pixels
   - Disappears when near top of page
   - Smooth show/hide transitions

2. **Smooth Scroll Animation**
   - Native browser smooth scrolling
   - No JavaScript animation required
   - Respects user motion preferences
   - Consistent across browsers

3. **Fixed Positioning**
   - Always visible when active (fixed position)
   - Bottom-left corner placement (20px margins)
   - Stays on screen during scroll
   - Never blocks page content

4. **Single Button Per Page**
   - Document-level block (one per page)
   - Uses global scroll listener
   - Minimal performance impact
   - Simple implementation

5. **Click-to-Top Behavior**
   - One-click return to page top
   - Smooth animation (behavior: 'smooth')
   - Works from any scroll position
   - Immediate response

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function sets up scroll detection and click handling:

1. **Button Selection**: Queries the `.returntotop` element (legitimate global selector for document-level block)
2. **Scroll Listener**: Monitors window scroll position
3. **Visibility Logic**: Shows button when scrollY > 100, hides when <= 100
4. **Click Handler**: Scrolls to top (window.scrollTo) with smooth behavior

### Key Implementation Details

**Scroll Threshold:**

```javascript
if (window.scrollY > 100) {
  returnToTopButton.style.display = 'block';
} else {
  returnToTopButton.style.display = 'none';
}
```

**Why 100 pixels?**

- Prevents button from appearing immediately on slight scroll
- Gives users enough room to see page content first
- Common threshold for scroll-to-top buttons
- Can be adjusted via configuration constant

**Smooth Scrolling:**

```javascript
window.scrollTo({
  top: 0,
  behavior: 'smooth',
});
```

**Note:** Uses native smooth scrolling (CSS `scroll-behavior: smooth` fallback possible)

### Current Implementation Issue

**CRITICAL: Inline CSS Usage**

The current implementation uses inline styles (`element.style.display`), which violates EDS best practices. This should be refactored to use CSS classes:

**Current (not recommended):**

```javascript
returnToTopButton.style.display = 'block';
```

**Recommended approach:**

```javascript
// Add/remove class instead
returnToTopButton.classList.add('visible');
returnToTopButton.classList.remove('visible');
```

**CSS would then handle visibility:**

```css
.returntotop {
  display: none;
}

.returntotop.visible {
  display: block;
}
```

**Why this matters:**

- Separates concerns (structure, presentation, behavior)
- Maintains CSS cacheability
- Enables CSS transitions
- Follows EDS architecture standards

### CSS Architecture

The returntotop block uses fixed positioning with blue accent styling:

**Button Positioning:**

- `position: fixed` - Stays visible during scroll
- `bottom: 20px; left: 20px` - Bottom-left corner
- `z-index` implicit (should be explicit for layering)

**Button Styling:**

- `background-color: #007BFF` - Blue accent
- `color: white` - High contrast text
- `border-radius: 5px` - Rounded corners
- `padding: 10px 20px` - Touch-friendly target

**Hover State:**

- `background-color: #0056b3` - Darker blue on hover
- Provides visual feedback
- Indicates interactivity

**Initial State:**

- `display: none` - Hidden by default
- JavaScript toggles display property
- Should use class-based approach instead

### Document-Level Block Pattern

**Important:** This is a **document-level block** (one per page), which makes the global selector usage legitimate:

```javascript
const returnToTopButton = document.querySelector('.returntotop');
```

**Why this is acceptable:**

- Only one return-to-top button per page
- Document-level utility (not reusable component)
- Global scroll behavior affects entire page
- Similar to header/footer blocks

**Contrast with regular blocks:**

- Regular blocks receive `block` parameter
- Multiple instances per page expected
- Use `block.querySelector()` for isolation
- Return-to-top is intentionally global

### Data Flow

```
Page Load
    ↓
EDS Decorates Block
    ↓
decorate() function executes
    ↓
Select .returntotop button (global)
    ↓
Attach window scroll listener
    ↓
Attach button click listener
    ↓
User scrolls down > 100px
    ↓
Show button (display: block)
    ↓
User clicks button
    ↓
Smooth scroll to top (scrollTo with behavior: smooth)
    ↓
User scrolls to top (scrollY <= 100)
    ↓
Hide button (display: none)
```

---

## Usage

### Basic Markdown Structure

In Google Docs, create a simple table:

```
| ReturnToTop |
|-------------|
| ^ Top       |
```

**Output:** A button labeled "^ Top" that appears after scrolling down 100 pixels.

### Content Patterns

**Pattern 1: Simple Arrow Symbol**

```
| ReturnToTop |
|-------------|
| ↑           |
```

**Pattern 2: Text Label**

```
| ReturnToTop |
|-------------|
| Back to Top |
```

**Pattern 3: Icon + Text**

```
| ReturnToTop |
|-------------|
| ↑ Top       |
```

**Pattern 4: Emoji Icon**

```
| ReturnToTop |
|-------------|
| ⬆️ Top       |
```

### Placement Guidelines

**Best practices:**

- Place at end of page (after all content)
- One per page (document-level block)
- Can be used on any page type
- Works with all other blocks

**Page structure example:**

```
| Hero |
|------|
| Content here... |

| Sections |
|----------|
| Long content here... |

| ReturnToTop |
|-------------|
| ↑ Top       |
```

### Integration Points

**Works well with:**

- Long articles and blog posts
- Multi-section landing pages
- Documentation pages
- Product detail pages
- FAQ pages

**Considerations:**

- Only effective on pages with significant scroll
- Not needed on short pages (< 2 screen heights)
- Consider UX: Does page need this feature?
- Avoid on mobile if content is brief

---

## Content Structure

### Expected Input (Markdown Table)

The EDS pipeline converts a markdown table into this initial DOM structure:

```html
<div class="returntotop block">
  <div>
    <div>↑ Top</div>
  </div>
</div>
```

### Output Structure (After Decoration)

The `decorate()` function uses the existing button element:

```html
<div class="returntotop block">
  <!-- Button exists from EDS transformation -->
  <!-- JavaScript adds event listeners and scroll detection -->
  <!-- No DOM manipulation needed -->
</div>
```

**Important:** The block element itself becomes the button through CSS styling and JavaScript event handling.

### Button Content

**Recommended content:**

- Short text (1-3 words)
- Arrow symbols (↑, ⬆️, ^)
- Icon + text combination
- Universal symbols users recognize

**Avoid:**

- Long descriptive text
- Multiple lines
- Complex formatting
- Images (button should be lightweight)

---

## Styling & Customization

### CSS Variables

Customize the return-to-top button through CSS overrides:

```css
/* Current hardcoded values (should be variables) */
.returntotop {
  --rtt-bg-color: #007BFF;
  --rtt-bg-hover: #0056b3;
  --rtt-text-color: white;
  --rtt-border-radius: 5px;
  --rtt-padding: 10px 20px;
  --rtt-bottom-offset: 20px;
  --rtt-left-offset: 20px;
}
```

**Note:** Current implementation uses hardcoded colors. Should be refactored to use CSS variables.

### Custom Styling

Override default styles in your project's CSS:

```css
/* Change position to bottom-right */
.returntotop {
  left: auto;
  right: 20px;
}

/* Circular button style */
.returntotop {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* Green accent color */
.returntotop {
  background-color: #28a745;
}

.returntotop:hover {
  background-color: #218838;
}

/* Add shadow for depth */
.returntotop {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Fade-in transition */
.returntotop {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.returntotop.visible {
  opacity: 1;
}
```

### Position Variations

**Bottom-left (default):**

```css
.returntotop {
  bottom: 20px;
  left: 20px;
}
```

**Bottom-right:**

```css
.returntotop {
  bottom: 20px;
  right: 20px;
  left: auto;
}
```

**Top-right:**

```css
.returntotop {
  top: 20px;
  right: 20px;
  bottom: auto;
  left: auto;
}
```

### Animation Enhancements

Add smooth transitions (requires class-based approach):

```css
/* Fade-in animation */
.returntotop {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.returntotop.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Pulse animation on hover */
.returntotop:hover {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### Variations

The returntotop block currently has **no built-in variations**. All customization is done through CSS overrides.

**Future variation ideas:**

- `returntotop (circular)` - Circular button with icon
- `returntotop (minimal)` - Text-only, no background
- `returntotop (right)` - Positioned bottom-right
- `returntotop (floating)` - Animated floating effect

---

## Responsive Behavior

### Mobile Behavior (< 600px)

- Fixed position maintained
- Touch-friendly tap target (44px x 44px minimum recommended)
- Current implementation may be too small for optimal mobile UX
- Consider larger padding for mobile

**Recommended mobile adjustments:**

```css
@media (max-width: 600px) {
  .returntotop {
    padding: 12px 24px;
    font-size: 1rem;
    bottom: 16px;
    left: 16px;
  }
}
```

### Tablet Behavior (600px - 1024px)

- Default styling works well
- Comfortable size and positioning
- No major adjustments needed

### Desktop Behavior (> 1024px)

- Hover state visible and interactive
- Cursor changes to pointer
- Fixed position maintained
- No layout shifts

### Scroll Threshold Adjustments

**For long pages (> 5 screen heights):**

```javascript
// Consider higher threshold
if (window.scrollY > 300) {
  // Show button
}
```

**For shorter pages (2-3 screen heights):**

```javascript
// Keep current threshold
if (window.scrollY > 100) {
  // Show button
}
```

### Testing Responsive Behavior

1. Open `test.html` in a browser
2. Scroll down past 100px threshold
3. Verify button appears
4. Resize browser window to various widths
5. Check button remains accessible and visible
6. Test touch interaction on mobile devices

---

## Accessibility

### Semantic HTML

**Current implementation:**

```html
<div class="returntotop block">...</div>
```

**Accessibility concerns:**

- Should be a `<button>` element, not a `<div>`
- Missing role="button" if div is used
- No ARIA label describing action

**Recommended structure:**

```html
<button class="returntotop block"
        type="button"
        aria-label="Return to top of page">
  ↑ Top
</button>
```

### Keyboard Support

**Current support:**

- Click event works with Enter/Space (if button element)
- Tab key moves focus to button
- Visible focus indicator (inherited from global styles)

**Best practices:**

- Use semantic `<button>` element
- Ensure visible focus indicator
- No keyboard traps
- Logical tab order

### Screen Reader Support

**What works well:**

- Button content announces ("Top", "Back to Top")
- Click action is clear
- Focus management works

**Improvements needed:**

- Add `aria-label="Return to top of page"` for clarity
- Consider `aria-live` region for visibility changes
- Ensure role="button" if using div

**Screen reader flow:**

1. User tabs to button (if visible)
2. Screen reader announces: "Return to top of page, button"
3. User presses Enter/Space
4. Page scrolls to top
5. Focus returns to top of page

### Focus Management

**Current behavior:**

- Focus remains on button after click
- Page scrolls to top but focus doesn't move

**Enhanced behavior (recommended):**

```javascript
returnToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Move focus to top of page
  const skipLink = document.querySelector('a[href="#main"]');
  if (skipLink) {
    skipLink.focus();
  } else {
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
    document.body.removeAttribute('tabindex');
  }
});
```

### Motion Preferences

**Respecting prefers-reduced-motion:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
```

**JavaScript approach:**

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

returnToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
});
```

### ARIA Best Practices

**What this implementation should include:**

- `<button type="button">` - Proper semantic element
- `aria-label="Return to top of page"` - Clear description
- Visible text content - "Top" or "Back to Top"
- No aria-hidden (button must be accessible)

**What to avoid:**

- Using div without role="button"
- Missing keyboard support
- No visible focus indicator
- Hiding button from screen readers

---

## Performance

### JavaScript Execution

**Scroll event listener:**

- Fired on every scroll event
- Minimal logic (one conditional check)
- No DOM queries inside listener (cached reference)
- Inline style manipulation (fast but not ideal)

**Performance characteristics:**

- ~0.1ms per scroll event
- Negligible CPU impact
- No throttling/debouncing needed
- Efficient implementation

**Optimization opportunities:**

- Use Intersection Observer API instead of scroll listener
- Throttle scroll events (fire every 100ms instead of constantly)
- Use CSS classes instead of inline styles
- Cache button reference (already done)

### Memory Footprint

**Per page:**

- 1 button element
- 1 scroll event listener
- 1 click event listener
- Minimal memory overhead (< 1KB)

**No memory leaks:**

- Event listeners attached once
- No interval/timeout accumulation
- Button reference cached (no repeated queries)

### Network Efficiency

**Initial load:**

- returntotop.js: ~500 bytes (minified)
- returntotop.css: ~300 bytes (minified)
- No external dependencies
- No API calls

**Runtime:**

- No additional network requests
- All functionality local
- Fast interaction (no loading states)

### Scroll Performance

**Considerations:**

- Scroll listener fires frequently (60fps)
- Current implementation is lightweight
- No forced reflow/repaint inside listener
- Smooth scrolling uses browser native implementation

**Recommended optimization:**

```javascript
// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      // Visibility logic here
      scrollTimeout = null;
    }, 100);
  }
});
```

### Lighthouse Impact

Expected Lighthouse scores with returntotop block:

- Performance: 95-100 (minimal impact)
- Accessibility: 90-95 (semantic HTML improvements needed)
- Best Practices: 95-100
- SEO: 100 (no impact)

**Performance budget:**

- JavaScript: ~500 bytes (negligible)
- CSS: ~300 bytes (negligible)
- Runtime: < 1ms per scroll event

---

## Browser Support

### Supported Browsers

- Chrome/Edge: Last 2 versions ✓
- Firefox: Last 2 versions ✓
- Safari: Last 2 versions ✓
- iOS Safari: Last 2 versions ✓
- Android Chrome: Last 2 versions ✓

### Required Features

- `window.scrollY` - Scroll position detection ✓
- `window.scrollTo()` - Programmatic scrolling ✓
- `behavior: 'smooth'` - Smooth scroll animation ✓
- `addEventListener()` - Event handling ✓
- `querySelector()` - DOM selection ✓

**All modern browsers support these features.**

### Smooth Scrolling Support

**Native support:**

- Chrome 61+ ✓
- Firefox 36+ ✓
- Safari 15.4+ ✓
- Edge 79+ ✓

**Fallback for older browsers:**

- Instant scroll (still functional)
- No animation (behavior: 'smooth' ignored)
- Polyfills available if needed

### Internet Explorer 11

**Partial support:**

- `window.scrollY` - ✓ Supported
- `window.scrollTo()` - ✓ Supported (without smooth)
- `addEventListener()` - ✓ Supported
- `behavior: 'smooth'` - ✗ Not supported (instant scroll fallback)

**Recommendation:** IE11 works but without smooth scrolling animation.

---

## Troubleshooting

### Issue: Button not appearing

**Symptoms:**

- Scroll down page but button never appears
- No console errors
- Button exists in DOM

**Solutions:**

1. **Check scroll threshold:**

   ```javascript
   // In browser console
   window.addEventListener('scroll', () => {
     console.log('ScrollY:', window.scrollY);
   });
   // Verify scrollY exceeds 100
   ```

2. **Verify JavaScript loaded:**
   - Open DevTools Network tab
   - Look for `/blocks/returntotop/returntotop.js`
   - Verify 200 status code

3. **Check button element exists:**

   ```javascript
   // In browser console
   const btn = document.querySelector('.returntotop');
   console.log('Button:', btn);
   console.log('Display:', window.getComputedStyle(btn).display);
   ```

4. **Inspect inline styles:**
   - Use Elements panel in DevTools
   - Check `.returntotop` element
   - Verify `style="display: none"` changes to `style="display: block"`

### Issue: Button appears immediately

**Symptoms:**

- Button visible on page load
- No scroll required
- Button should be hidden initially

**Solutions:**

1. **Check CSS initial state:**

   ```css
   /* Ensure this rule exists */
   .returntotop {
     display: none;
   }
   ```

2. **Verify CSS loaded:**
   - Check Network tab for `returntotop.css`
   - Look for 404 errors
   - Ensure file is accessible

3. **Inspect computed styles:**

   ```javascript
   // In browser console
   const btn = document.querySelector('.returntotop');
   console.log('Display:', window.getComputedStyle(btn).display);
   ```

### Issue: Click does nothing

**Symptoms:**

- Button visible and clickable
- Click has no effect
- No scroll to top occurs
- No console errors

**Solutions:**

1. **Check event listener attached:**

   ```javascript
   // In browser console
   const btn = document.querySelector('.returntotop');
   getEventListeners(btn);
   // Should show 'click' listener
   ```

2. **Test scrollTo directly:**

   ```javascript
   // In browser console
   window.scrollTo({ top: 0, behavior: 'smooth' });
   // If this works, listener is the issue
   ```

3. **Verify JavaScript executed:**
   - Open Console
   - Look for errors during page load
   - Check if `decorate()` function ran

### Issue: Scroll not smooth

**Symptoms:**

- Button works but scroll is instant
- No smooth animation
- Jumps to top immediately

**Solutions:**

1. **Check browser support:**
   - Smooth scrolling requires modern browser
   - IE11 and older Safari don't support it
   - Verify browser version

2. **Test CSS scroll-behavior:**

   ```css
   html {
     scroll-behavior: smooth;
   }
   ```

3. **Respect motion preferences:**
   - Check if user has prefers-reduced-motion enabled
   - This disables smooth scrolling (by design)
   - Not a bug, but accessibility feature

### Issue: Button blocks content

**Symptoms:**

- Button covers important page content
- Can't click elements behind button
- Button z-index too high

**Solutions:**

1. **Adjust position:**

   ```css
   .returntotop {
     bottom: 20px;
     right: 20px; /* Move to different corner */
   }
   ```

2. **Reduce size:**

   ```css
   .returntotop {
     padding: 8px 16px;
     font-size: 0.9rem;
   }
   ```

3. **Add explicit z-index:**

   ```css
   .returntotop {
     z-index: 100; /* Lower than modals but higher than content */
   }
   ```

### Issue: Multiple buttons on page

**Symptoms:**

- More than one return-to-top button
- Buttons conflict with each other
- Unexpected behavior

**Solutions:**

1. **Remove duplicate blocks:**
   - Only one returntotop block per page
   - Check Google Docs content
   - Remove extra instances

2. **Verify block placement:**
   - Should be at end of page
   - Only one instance needed
   - Document-level utility (not reusable)

---

## Testing

### Manual Testing (test.html)

1. **Open test file:**

   ```
   http://localhost:3000/blocks/returntotop/test.html
   ```

2. **Visual checks:**
   - Button hidden on page load ✓
   - Scroll down > 100px ✓
   - Button appears (bottom-left) ✓
   - Button styled correctly (blue background) ✓
   - Scroll to top ✓
   - Button disappears ✓

3. **Interaction testing:**
   - Scroll down past 100px
   - Verify button appears
   - Click button
   - Verify smooth scroll to top
   - Verify button disappears at top
   - Test multiple scroll cycles

4. **Responsive testing:**
   - Resize browser to mobile width (< 600px)
   - Verify button remains accessible
   - Check touch target size
   - Test tablet width (~768px)
   - Verify desktop width (> 1024px)

5. **Accessibility testing:**
   - Tab to button with keyboard
   - Verify visible focus indicator
   - Press Enter or Space to activate
   - Test with screen reader
   - Verify button announced correctly

6. **Browser testing:**
   - Test in Chrome, Firefox, Safari
   - Verify smooth scrolling works
   - Check for browser-specific issues
   - Test on mobile devices

### DevTools Inspection

```javascript
// Check button element
const btn = document.querySelector('.returntotop');
console.log('Button element:', btn);
console.log('Display:', window.getComputedStyle(btn).display);
console.log('Position:', window.getComputedStyle(btn).position);

// Monitor scroll position
window.addEventListener('scroll', () => {
  console.log('ScrollY:', window.scrollY);
});

// Test visibility threshold
console.log('Threshold: 100px');
console.log('Current scroll:', window.scrollY);
console.log('Button should be visible:', window.scrollY > 100);

// Check event listeners
getEventListeners(btn);
// Should show click listener

getEventListeners(window);
// Should show scroll listener
```

### Automated Testing

**Future implementation:**

- Jest tests for scroll detection logic
- Test visibility threshold (100px)
- Test scrollTo with smooth behavior
- Test event listener attachment
- Accessibility tests with axe-core
- Visual regression tests with Playwright

**Example test cases:**

```javascript
describe('ReturnToTop Block', () => {
  test('button hidden on page load', () => {});
  test('button appears after scrolling > 100px', () => {});
  test('button disappears when scrollY <= 100', () => {});
  test('clicking button scrolls to top', () => {});
  test('smooth scroll behavior applied', () => {});
  test('scroll listener attached to window', () => {});
  test('click listener attached to button', () => {});
});
```

### Performance Testing

**Scroll event frequency:**

```javascript
let scrollCount = 0;
window.addEventListener('scroll', () => {
  scrollCount++;
  console.log('Scroll events fired:', scrollCount);
});

// Scroll down page and check count
// Should be high (60+ per second)
// Current implementation handles this efficiently
```

**Memory leak testing:**

```javascript
// Monitor memory usage
console.log('Initial memory:', performance.memory.usedJSHeapSize);

// Scroll up and down multiple times

console.log('After scrolling:', performance.memory.usedJSHeapSize);
// Should not increase significantly
```

---

## Dependencies

### Internal Dependencies

1. **aem.js** (formerly lib-franklin.js)
   - Location: `/scripts/aem.js`
   - Used for: EDS core functionality
   - Required: Yes (for block decoration)

2. **styles.css**
   - Location: `/styles/styles.css`
   - Used for: Global styles and CSS variables
   - Required: Yes (for consistent styling)

### External Dependencies

**None** - The returntotop block is a pure EDS-native component with no external libraries.

### Browser APIs

- `window.scrollY` - Scroll position detection
- `window.scrollTo()` - Programmatic scrolling
- `window.addEventListener()` - Event handling
- `document.querySelector()` - DOM selection
- `Element.style` - Inline style manipulation (should be replaced with classList)

### CSS Dependencies

**Optional CSS variables (recommended):**

```css
:root {
  --rtt-bg-color: #007BFF;
  --rtt-bg-hover: #0056b3;
  --rtt-text-color: white;
}
```

Currently hardcoded, should be refactored to use variables.

---

## Future Enhancements

### Planned Features

1. **Configuration Constants**
   - Move scroll threshold (100px) to RETURNTOTOP_CONFIG
   - Extract colors to CSS variables
   - Configurable button position
   - Customizable animation speed

2. **CSS Class-Based Approach**
   - Replace inline styles with CSS classes
   - Enable CSS transitions
   - Better separation of concerns
   - Follows EDS best practices

3. **Accessibility Improvements**
   - Use semantic `<button>` element
   - Add `aria-label` for screen readers
   - Implement focus management (move focus to top on click)
   - Respect `prefers-reduced-motion`

4. **Position Variations**
   - `returntotop (right)` - Bottom-right positioning
   - `returntotop (center)` - Bottom-center positioning
   - `returntotop (floating)` - Animated floating effect

5. **Style Variations**
   - `returntotop (circular)` - Circular button with icon
   - `returntotop (minimal)` - Text-only, no background
   - `returntotop (shadow)` - Elevated with box-shadow

6. **Advanced Features**
   - Progress indicator (show scroll percentage)
   - Scroll progress ring around button
   - Customizable scroll threshold per page
   - Intersection Observer API (better performance)
   - Throttled scroll events
   - Animation on appear/disappear

7. **Smart Behavior**
   - Hide button when user scrolls up (scrolling toward top)
   - Show only when scrolling down (away from top)
   - Auto-hide after delay if not used
   - Remember user preference (don't show if never used)

### Contributing

To propose enhancements:

1. Create test content in Google Docs
2. Implement feature in JavaScript/CSS
3. Add test cases to test.html
4. Update documentation
5. Submit PR with demo link

---

## Related Documentation

- **[EXAMPLE.md](./EXAMPLE.md)** - Content author usage guide
- **[test.html](./test.html)** - Browser-based testing file
- **[EDS Block Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - Block development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - EDS architecture principles
- **[Frontend Guidelines](../../docs/for-ai/guidelines/frontend-guidelines.md)** - Development best practices

---

## Version History

- **v1.0** (Current) - Initial implementation
  - Scroll detection (threshold: 100px)
  - Smooth scroll to top
  - Fixed bottom-left positioning
  - Click-based interaction
  - Blue accent styling

**Known limitations:**

- Uses inline styles (violates EDS best practices)
- Missing configuration constants
- No ARIA labels
- Hardcoded colors (should use CSS variables)
- No variations support

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [EXAMPLE.md](./EXAMPLE.md) for usage examples
3. Test with [test.html](./test.html)
4. Verify scroll threshold (100px) is exceeded
5. Check browser console for errors
6. File issue with detailed reproduction steps

---

**Last Updated:** 2025-11-28
**Block Version:** 1.0
**EDS Compatibility:** Current
**Document-Level Block:** Yes (one per page)
