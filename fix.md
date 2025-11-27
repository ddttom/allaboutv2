# EDS Blocks Standards Compliance Fixes

**Date:** 2025-11-27
**Author:** Claude Code + Tom Cranstoun
**Status:** In Progress

## Summary

This document tracks all fixes applied to EDS blocks to ensure compliance with standards documented in:
- `.claude/skills/eds-block-development/SKILL.md`
- `docs/for-ai/implementation/block-architecture-standards.md`
- `CLAUDE.md`

## Baseline Violations (From validate-blocks.sh)

**Total violations detected:** 40+

### By Type
- **Reserved class names:** 4 violations (CRITICAL)
  - blogroll, dashboard, showcaser, dam
- **Global selectors:** Multiple blocks (CRITICAL) - validation script excludes legitimate uses
- **Inline CSS:** 200+ instances (HIGH)
  - 3dcube, code-expander, dps, floating-alert, index, returntotop, and others
- **Missing CONFIG objects:** 40 blocks (MEDIUM)
- **Async without try/catch:** 14 blocks (MEDIUM)

### By Severity
- **CRITICAL:** Reserved class names + global selectors
- **HIGH:** Inline CSS violations
- **MEDIUM:** Missing CONFIG objects, poor error handling
- **LOW:** Minor issues

## Fix Statistics (Updated As We Go)

### Violations by Type
- Reserved class names: 0 fixed / 4 total
- Global selectors: 0 fixed / TBD total
- Inline CSS: 0 fixed / 200+ total
- Missing CONFIG: 0 fixed / 40 total
- Poor error handling: 0 fixed / 14 total

### Violations by Severity
- CRITICAL: 0 fixed
- HIGH: 0 fixed
- MEDIUM: 0 fixed
- LOW: 0 fixed

---

## Phase 1: CRITICAL Fixes

**Goal:** Fix production-breaking violations in 9 critical blocks

**Timeline:** Days 1-3 (ASAP mode)

**Blocks to fix:**
1. ipynb-viewer
2. showcaser
3. blogroll
4. hero
5. index
6. dps
7. returntotop
8. floating-alert
9. dashboard

---

### Block: showcaser

**Files Modified:**
- `blocks/showcaser/showcaser.css`
- `blocks/showcaser/showcaser.js`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.showcaser-container` (CSS line 24, JS line 100)
2. ⚠️  INTENTIONAL: Global selectors `document.querySelector('header')` and `document.querySelectorAll('pre > code')` - this block operates on document-level elements by design
3. ❌ HIGH: Inline CSS using `element.style.display` (6 instances)
4. ✅ Has CONFIG object

**Changes Made:**

**CSS Changes:**

1. Reserved class name fix (line 24):
```diff
- .showcaser-container {
+ .showcaser-main {
    background-color: var(--showcaser-bg-color);
    /* ... rest of styles ... */
  }
```

2. Added CSS classes for show/hide states:
```css
/* Added after line 283 */
.showcaser-returntomenu.visible {
  display: block;
}

/* Added after line 121 */
.showcaser-snippet.hidden {
  display: none;
}

/* Added at end of file */
.hidden {
  display: none;
}

.showcaser-original-code.hidden {
  display: none;
}
```

**JavaScript Changes:**

1. Updated class name reference (line 100):
```diff
- container.className = 'showcaser-container';
+ container.className = 'showcaser-main';
```

2. Added comments for intentional global selectors (lines 115-117, 188-190):
```javascript
// INTENTIONAL: This block operates on document-level elements
// It needs to access the global header to calculate scroll position
const header = document.querySelector('header');

// INTENTIONAL: This block operates on document-level elements
// Showcaser collects ALL code snippets from the entire document,
// not just within the block, to create a code snippet viewer
const codeElements = document.querySelectorAll('pre > code');
```

3. Replaced inline CSS with classList (6 locations):
```diff
// Lines 163, 172, 174 - Return to menu button
- returnToMenuButton.style.display = 'none';
- returnToMenuButton.style.display = 'block';
- returnToMenuButton.style.display = 'none';
+ (removed - uses CSS default display: none)
+ returnToMenuButton.classList.add('visible');
+ returnToMenuButton.classList.remove('visible');

// Line 299 - Hide original code
- preElement.style.display = 'none';
+ preElement.classList.add('showcaser-original-code', 'hidden');

// Line 323 - Hide snippet containers
- snippetContainer.style.display = 'none';
+ snippetContainer.classList.add('hidden');

// Lines 334-336 - Show/hide snippets
- snippet.style.display = i === index ? 'block' : 'none';
+ if (i === index) {
+   snippet.classList.remove('hidden');
+ } else {
+   snippet.classList.add('hidden');
+ }
```

**Testing Notes:**
- [ ] Visual inspection - verify no layout changes
- [ ] Single instance test - showcaser displays correctly
- [ ] Test return-to-menu button visibility on scroll
- [ ] Test snippet navigation (clicking titles shows correct code)
- [ ] Test toggle button for left panel collapse
- [ ] Verify code snippets are collected from entire document
- [ ] Test compact variation
- [ ] Console check - no errors

**Special Notes:**
- **Global selectors are INTENTIONAL** - This block is designed to operate on document-level elements
- It collects code snippets from the entire page, not just within the block
- Header access needed for scroll position calculations
- This is a legitimate exception to the "no global selectors" rule

**Risk Level:** MEDIUM
- Reserved class name fix: LOW risk (simple rename)
- Inline CSS fix: MEDIUM risk (state management changes)
- Global selectors: NO CHANGE (intentional design)

**Status:** ✅ Complete - Ready for testing

---

### Block: blogroll

**Files Modified:**
- `blocks/blogroll/blogroll.css`
- `blocks/blogroll/blogroll.js`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.blogroll-container` (CSS line 22, JS line 360)

**Changes Made:**

**CSS Changes (line 22):**
```diff
- .blogroll-container {
+ .blogroll-content {
    font-family: var(--blogroll-font-family);
    max-width: var(--blogroll-max-width);
    margin: 0 auto;
    padding: var(--blogroll-padding);
  }
```

**JavaScript Changes (line 360):**
```diff
- blogrollContainer.className = 'blogroll-container';
+ blogrollContainer.className = 'blogroll-content';
```

**Testing Notes:**
- [ ] Visual inspection - verify no layout changes
- [ ] Single instance test - blogroll displays correctly
- [ ] Test standard mode (full blogroll list)
- [ ] Test compact mode (icon + panel)
- [ ] Test with path filters (path=*, path=value)
- [ ] Test with acceptList filters
- [ ] Test empty results messaging
- [ ] Console check - no errors

**Risk Level:** LOW
- Simple class rename with no layout impact
- No behavioral changes

**Status:** ✅ Complete - Ready for testing

---

### Block: hero

**Files Modified:**
- `blocks/hero/hero.css`
- `blocks/hero/hero.js`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.hero-container` (CSS lines 4, 8)
2. ❌ CRITICAL: Global selectors `document.querySelector('.hero ...')` (JS lines 2, 3)

**Changes Made:**

**CSS Changes:**

1. Reserved class name fix (lines 4, 8):
```diff
/* Hero container styles */
- main .hero-container > div {
+ main .hero-main > div {
    max-width: unset;
  }

- main .hero-container {
+ main .hero-main {
    padding: 0;
  }
```

**JavaScript Changes:**

1. Global selectors → Block parameter scoping (lines 2-3):
```diff
  export default function decorate(block) {
-   const firstPicture = document.querySelector('.hero > div:first-of-type picture');
-   const secondPicture = document.querySelector('.hero > div:first-of-type > div:nth-of-type(2) picture');
+   // Use block parameter to scope selectors to current block instance
+   const firstPicture = block.querySelector('div:first-of-type picture');
+   const secondPicture = block.querySelector('div:first-of-type > div:nth-of-type(2) picture');
```

**Testing Notes:**
- [ ] Visual inspection - verify hero displays correctly
- [ ] Single instance test - hero block works
- [ ] Multiple instance test - multiple hero blocks work independently
- [ ] Test picture swapping logic (first and second pictures)
- [ ] Test responsive images
- [ ] Console check - no errors

**Risk Level:** LOW
- Reserved class rename: Simple CSS update
- Global selector fix: Standard pattern, improves multi-instance support

**Status:** ✅ Complete - Ready for testing

---

### Block: index

**Files Modified:**
- `blocks/index/index.css`
- `blocks/index/index.js`

**Violations Found:**
1. ⚠️  INTENTIONAL: Global selectors `document.querySelectorAll('h1, h2, h3, h4, h5, h6')` - this block operates on document-level elements by design
2. ❌ HIGH: Inline CSS using `element.style.display` (6 instances - lines 26, 30, 33)
3. ❌ HIGH: Inline CSS using `element.style.transform` (2 instances - lines 31, 34)
4. ❌ HIGH: Inline CSS using `element.style.marginLeft` (1 instance - line 45)
5. ❌ MEDIUM: Missing CONFIG object

**Changes Made:**

**JavaScript Changes:**

1. Added CONFIG object (lines 4-7):
```javascript
const INDEX_CONFIG = {
  HEADER_TITLE: 'Index',
  INDENT_PER_LEVEL: 20, // px
};
```

2. Added comments for intentional global selectors (lines 10-13):
```javascript
// INTENTIONAL: This block operates on document-level elements
// It collects ALL headings from the entire document to create a table of contents,
// not just headings within the block itself
const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
```

3. Replaced inline CSS with classList (lines 28-44):
```diff
- indexContent.style.display = 'none';
- if (indexContent.style.display === 'none') {
-   indexContent.style.display = 'block';
-   indexHeader.querySelector('.arrow').style.transform = 'rotate(-135deg)';
- } else {
-   indexContent.style.display = 'none';
-   indexHeader.querySelector('.arrow').style.transform = 'rotate(45deg)';
- }
+ // Toggle visibility using classes instead of inline styles
+ const isHidden = indexContent.classList.contains('hidden');
+ const arrow = indexHeader.querySelector('.arrow');
+
+ if (isHidden) {
+   indexContent.classList.remove('hidden');
+   arrow.classList.add('up');
+ } else {
+   indexContent.classList.add('hidden');
+   arrow.classList.remove('up');
+ }
```

4. Fixed inline marginLeft with CSS custom property (lines 53-56):
```diff
- li.style.marginLeft = `${(parseInt(header.tagName[1], 10) - 1) * 20}px`;
+ // Use CSS custom property instead of inline style
+ const level = parseInt(header.tagName[1], 10) - 1;
+ li.style.setProperty('--indent-level', level);
+ li.className = 'index-item';
```

5. Simplified buildIndex to use block-scoped indexContent reference (line 48):
```diff
- const indexContent2 = document.querySelector('.index-content');
- indexContent2.innerHTML = '';
- indexContent2.appendChild(ul);
+ // Use the indexContent reference from outer scope
+ indexContent.innerHTML = '';
+ indexContent.appendChild(ul);
```

**CSS Changes:**

1. Added hidden state class (lines 34-36):
```css
.index-content.hidden {
  display: none;
}
```

2. Added arrow up state (lines 29-32):
```css
.arrow.up {
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}
```

3. Added indentation using CSS custom property (lines 58-60):
```css
.index-item {
  margin-left: calc(var(--indent-level, 0) * 20px);
}
```

**Testing Notes:**
- [ ] Visual inspection - verify index displays correctly
- [ ] Single instance test - index block works
- [ ] Test header click to expand/collapse
- [ ] Test arrow rotation animation
- [ ] Verify all heading levels are captured (h1-h6) from entire document
- [ ] Test indentation based on heading level
- [ ] Test clicking index links navigates to headings
- [ ] Console check - no errors

**Special Notes:**
- **Global selectors are INTENTIONAL** - This block is designed to operate on document-level elements
- It collects ALL headings from the entire page to create a table of contents
- This is a legitimate exception to the "no global selectors" rule

**Risk Level:** LOW
- Global selectors: NO CHANGE (intentional design)
- Inline CSS fix: LOW risk (proper CSS class approach)
- CONFIG object: LOW risk (simple refactoring)
- CSS custom property for indentation: LOW risk (modern CSS approach)

**Status:** ✅ Complete - Ready for testing

---

### Block: dps

**Files Modified:**
- `blocks/dps/dps.js`
- `blocks/dps/dps.css`

**Violations Found:**
1. ✅ Has CONFIG object (lines 7-17)
2. ⚠️  INTENTIONAL: Extensive global selectors - this is a fullscreen presentation system that needs to manipulate document-level elements (header, footer, body, main) by design
3. ❌ HIGH: Extensive inline CSS violations (20+ instances throughout the 2000+ line file)

**Analysis:**

This block is a **Digital Presentation System** that takes over the entire viewport to create a fullscreen presentation experience. The global selectors are **INTENTIONAL** because:
- It hides the site header/footer (lines 46-48)
- It forces fullscreen mode on body (line 123)
- It manipulates main element styling (lines 48-57)
- It queries slides, navigation, presenter notes throughout

**Inline CSS Violations (Major instances):**
- Lines 50-56: `existingHeader.style.display`, `existingFooter.style.display`, `existingMain.style` - Hiding/styling document elements
- Lines 656-657, 663-664: `slide.style.display` - Show/hide slide transitions
- Line 903: `navBar.style.display` - Navigation bar toggle
- Line 991: `timer.style.color` - Timer warning color
- Lines 1004-1007: `container.style.backgroundColor` - Flash warning effect
- Lines 1039-1085: Extensive presenter mode inline styling (width, height, position, etc.)

**Recommendation:**

Given the complexity (2044 lines), extensive inline CSS usage, and the fact that **all CSS is already defined in the JavaScript** (lines 1271-2040 with addStyles() function), the proper fix would require:

1. Moving all inline style manipulations to CSS classes
2. Creating state classes like `.dps-hidden`, `.slide-active`, `.presenter-mode-active`, etc.
3. Replacing all `element.style.X` with `element.classList` operations

This would be a **substantial refactoring** affecting presentation transitions, animations, and state management throughout the entire block.

**Status:** ⏸️ Deferred - Requires comprehensive refactoring

**Special Notes:**
- **Global selectors are INTENTIONAL** - This is a fullscreen presentation system that legitimately needs document-level control
- All CSS is dynamically injected via JavaScript (addStyles() function)
- Inline CSS is used extensively for dynamic state management
- Fixing would require careful testing of all presentation features (slides, sequences, presenter notes, timer, navigation)

**Risk Level:** HIGH
- Any changes to this block could break presentation transitions, animations, or state management
- Recommended approach: Create a separate refactoring task with comprehensive testing

---

### Block: returntotop

**Files Modified:**
- `blocks/returntotop/returntotop.js`
- `blocks/returntotop/returntotop.css`

**Violations Found:**
1. ❌ CRITICAL: Global selector `document.querySelector('.returntotop')` (JS line 3)
2. ❌ HIGH: Inline CSS using `element.style.display` (2 instances - lines 6, 8)
3. ❌ MEDIUM: Missing CONFIG object

**Changes Made:**

**JavaScript Changes:**

1. Added CONFIG object (lines 3-5):
```javascript
const RETURNTOTOP_CONFIG = {
  SCROLL_THRESHOLD: 100, // pixels
};
```

2. Fixed global selector (line 9):
```diff
- const returnToTopButton = document.querySelector('.returntotop');
+ // Use block parameter instead of global selector
+ const returnToTopButton = block;
```

3. Replaced inline CSS with classList (lines 11-17):
```diff
  window.addEventListener('scroll', () => {
-   if (window.scrollY > 100) {
-     returnToTopButton.style.display = 'block';
+   if (window.scrollY > RETURNTOTOP_CONFIG.SCROLL_THRESHOLD) {
+     returnToTopButton.classList.add('visible');
    } else {
-     returnToTopButton.style.display = 'none';
+     returnToTopButton.classList.remove('visible');
    }
  });
```

**CSS Changes:**

1. Added visible state class (lines 16-18):
```css
.returntotop.visible {
  display: block;
}
```

**Testing Notes:**
- [ ] Visual inspection - button displays correctly
- [ ] Single instance test - button works
- [ ] Test scroll threshold (appears after 100px scroll)
- [ ] Test click - smooth scroll to top
- [ ] Test hover state
- [ ] Console check - no errors

**Risk Level:** LOW
- Simple global selector fix (block parameter scoping)
- Inline CSS fix: LOW risk (standard show/hide pattern)
- CONFIG object: LOW risk (simple refactoring)

**Status:** ✅ Complete - Ready for testing

---

### Block: floating-alert

**Files Modified:**
- `blocks/floating-alert/floating-alert.js`
- `blocks/floating-alert/floating-alert.css`

**Violations Found:**
1. ✅ Has CONFIG object (FLOATING_ALERT_CONFIG)
2. ❌ HIGH: Inline CSS in sparkle effect (2 instances)
3. ⚠️  INTENTIONAL: Global selectors `document.body.appendChild(overlay)` and `document.addEventListener('keydown')` - this block creates a modal overlay that needs document-level positioning and keyboard handling

**Changes Made:**

**JavaScript Changes:**

1. Inline CSS fix in `createSparkle()` function (lines 16-17):

**Before:**
```javascript
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-alert-sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  return sparkle;
}
```

**After:**
```javascript
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-alert-sparkle';
  // Use CSS custom properties for dynamic positioning
  sparkle.style.setProperty('--sparkle-left', `${Math.random() * 100}%`);
  sparkle.style.setProperty('--sparkle-top', `${Math.random() * 100}%`);
  return sparkle;
}
```

**CSS Changes:**

1. Added CSS custom properties for sparkle positioning (lines 103-104):

**Before:**
```css
.floating-alert-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--alert-sparkle-color);
  border-radius: 50%;
  pointer-events: none;
  animation: floating-alert-sparkle 1s ease-out forwards;
}
```

**After:**
```css
.floating-alert-sparkle {
  position: absolute;
  left: var(--sparkle-left, 50%);
  top: var(--sparkle-top, 50%);
  width: 4px;
  height: 4px;
  background: var(--alert-sparkle-color);
  border-radius: 50%;
  pointer-events: none;
  animation: floating-alert-sparkle 1s ease-out forwards;
}
```

**Rationale:**

The floating-alert block creates a modal overlay with decorative sparkle effects. The sparkles need random positioning, which requires dynamic values. Instead of using `element.style.left/top` (inline CSS violation), we use CSS custom properties (`--sparkle-left`, `--sparkle-top`) which:

1. Maintain separation of concerns (CSS handles positioning)
2. Allow dynamic values through custom properties
3. Support fallback values (50% default)
4. Enable easier theming and customization

**Global Selectors - INTENTIONAL:**

This block legitimately needs global selectors because:
- Modal overlay must be positioned at document level (`document.body.appendChild`)
- ESC key handling needs document-level event listener (`document.addEventListener('keydown')`)
- Modal overlays by design exist outside the normal block flow
- This is standard modal pattern, not a violation

**Testing Notes:**
- [ ] Visual inspection - sparkles should appear at random positions
- [ ] Single instance test - alert displays correctly
- [ ] Multiple instances test - N/A (only one alert per page by design)
- [ ] Sparkle animation - verify random positioning works
- [ ] Console errors checked
- [ ] ESC key dismissal works
- [ ] Click outside dismissal works
- [ ] localStorage persistence works

**Risk Level:** LOW

**Reasoning:**
- Simple CSS pattern change (inline styles → custom properties)
- No logic changes
- Fallback values ensure graceful degradation
- Sparkle positioning is decorative (non-critical feature)

**Status:** ✅ Complete - Ready for testing

---

### Block: dashboard

**Files Modified:**
- `blocks/dashboard/dashboard.js`
- `blocks/dashboard/dashboard.css`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.dashboard-container` (JS line 2)
2. ❌ CRITICAL: Global selectors throughout (21+ instances)
3. ❌ HIGH: Inline CSS violations (5 instances for popup display/positioning and row filtering)
4. ❌ MEDIUM: Missing CONFIG object
5. ❌ MEDIUM: No try/catch error handling in fetch

**Changes Made:**

**JavaScript Changes:**

1. Added DASHBOARD_CONFIG object (lines 1-15):

```javascript
const DASHBOARD_CONFIG = {
  JSON_URL: '/query-index.json',
  DASHBOARD_TITLE: 'Edge Delivery Services Content Dashboard',
  FILTER_LABEL: 'Filter by status: ',
  STATUS_OPTIONS: ['All', 'Green', 'Amber', 'Red'],
  TABLE_HEADERS: ['Title', 'Path', 'Description', 'Last Modified', 'Review', 'Expiry'],
  PATH_TRUNCATE_LENGTH: 20,
  PATH_TRUNCATE_SUFFIX: '...',
  REVIEW_PERIOD_FALLBACK: 300, // days
  EXPIRY_PERIOD_FALLBACK: 365, // days
  RESPONSIVE_BREAKPOINT: 1024, // px
  POPUP_OFFSET: 10, // px
  IMAGE_POPUP_MAX_SIZE: 300, // px
  ERROR_MESSAGE: 'Error fetching data',
};
```

2. Fixed reserved class name (line 18):

**Before:**
```javascript
const dashboardContainer = block.querySelector('.dashboard-container') || block;
```

**After:**
```javascript
const dashboardContainer = block;
```

3. Converted fetch to async/await with proper error handling (lines 25-50):

**Before:**
```javascript
fetch(jsonUrl)
  .then(response => response.json())
  .then(jsonData => {
    // ...
  })
  .catch(error => console.error('Error fetching data:', error));
```

**After:**
```javascript
async function init() {
  try {
    const response = await fetch(DASHBOARD_CONFIG.JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    // ...
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`${DASHBOARD_CONFIG.ERROR_MESSAGE}:`, error);
  }
}
init();
```

4. Fixed all global selectors to use `block` parameter:

**Before:**
```javascript
document.querySelector('.content-table th[data-column="0"]')
document.getElementById('status-filter')
document.querySelectorAll('.path-link')
document.querySelectorAll('.content-table th')
```

**After:**
```javascript
block.querySelector('.content-table th[data-column="0"]')
block.querySelector('#status-filter')
block.querySelectorAll('.path-link')
block.querySelectorAll('.content-table th')
```

5. Fixed inline CSS for popup visibility (lines 280-312):

**Before:**
```javascript
popup.style.display = 'block';
popup.style.display = 'none';
popup.style.left = `${left}px`;
popup.style.top = `${top}px`;
```

**After:**
```javascript
popup.classList.add('visible');
popup.classList.remove('visible');
popup.style.setProperty('--popup-left', `${left}px`);
popup.style.setProperty('--popup-top', `${top}px`);
```

6. Fixed inline CSS for row filtering (lines 340-344):

**Before:**
```javascript
row.style.display = showRow ? '' : 'none';
```

**After:**
```javascript
if (showRow) {
  row.classList.remove('hidden');
} else {
  row.classList.add('hidden');
}
```

**CSS Changes:**

1. Added CSS custom properties for popup positioning (lines 102-103):

```css
.image-popup {
  display: none;
  position: fixed;
  left: var(--popup-left, 0);
  top: var(--popup-top, 0);
  /* ... rest of styles ... */
}
```

2. Added `.visible` class for popup display (lines 112-114):

```css
.image-popup.visible {
  display: block;
}
```

3. Added `.hidden` class for row filtering (line 198):

```css
.hidden { display: none; }
```

**Rationale:**

The dashboard block is a complex data table component with multiple interactive features (sorting, filtering, image popups). The fixes ensure:

1. **Block scoping**: All queries use the `block` parameter instead of global `document` selectors, allowing multiple dashboard instances on the same page
2. **Configuration centralization**: All magic numbers and strings moved to DASHBOARD_CONFIG for easy maintenance
3. **Proper error handling**: Async/await with try/catch for robust fetch error handling
4. **Inline CSS elimination**: Dynamic values use CSS custom properties, state changes use classes
5. **Reserved class fix**: Removed `.dashboard-container` fallback (not needed, block parameter is always the container)

**Global Selectors - Exceptions:**

Two global selectors are legitimately needed:
- `document.addEventListener('mousemove')` - Required for tracking mouse position for image popup positioning (line 256)
- `window.addEventListener('resize')` - Required for responsive layout handling (line 251)

These are acceptable because they handle document-level events, not block-specific queries.

**Testing Notes:**
- [ ] Visual inspection - table renders correctly
- [ ] Single instance test - sorting, filtering, image popups work
- [ ] Multiple instances test - each dashboard works independently
- [ ] Responsive layout - card view activates at < 1024px
- [ ] Filter dropdown - filters by status correctly
- [ ] Table sorting - click headers to sort by column
- [ ] Image popups - hover over paths to see preview images
- [ ] Popup positioning - popups stay within viewport bounds
- [ ] Error handling - graceful degradation if fetch fails
- [ ] Console errors checked

**Risk Level:** MEDIUM

**Reasoning:**
- Extensive refactoring (CONFIG, async/await, global selector fixes)
- Complex interactive features (sorting, filtering, popups)
- Responsive layout logic must work correctly
- Higher risk due to number of changes, but all follow established patterns

**Status:** ✅ Complete - Ready for testing

---

## Phase 2: HIGH PRIORITY Fixes

**Goal:** Fix multi-violation blocks

**Timeline:** Days 4-5

**Blocks to fix:**
10. bio
11. inline-svg
12. fragment
13. header
14. dam
15. code-expander
16. dfs
17. tags

---

### Block: bio

**Files Modified:**
- `blocks/bio/bio.js`
- `blocks/bio/bio.css`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.bio-wrapper` used in CSS (4 instances)
2. ❌ CRITICAL: Global selector `document.querySelector('.bio-wrapper')` (JS line 63)
3. ✅ ACCEPTABLE: Global selector `document.querySelector('meta[name="author"]')` - meta tags are document-level elements
4. ❌ MEDIUM: Missing CONFIG object
5. ❌ MEDIUM: Hard-coded values (image extensions, sizes)

**Changes Made:**

**JavaScript Changes:**

1. Added BIO_CONFIG object (lines 5-10):

```javascript
const BIO_CONFIG = {
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DEFAULT_ALT_TEXT: 'Bio image',
  HIDE_AUTHOR_CLASS: 'hide-author',
  META_AUTHOR_SELECTOR: 'meta[name="author"]',
};
```

2. Fixed global selector for renderExpressions (lines 71-75):

**Before:**
```javascript
renderExpressions(document.querySelector('.bio-wrapper'));
```

**After:**
```javascript
// Find the wrapper element relative to the block (traverse up to find the wrapper)
const wrapper = block.closest('.bio-wrapper') || block.parentElement?.closest('.bio-wrapper');
if (wrapper) {
  renderExpressions(wrapper);
}
```

3. Used CONFIG throughout:

```javascript
// Image extensions
const isImageLink = BIO_CONFIG.IMAGE_EXTENSIONS.some(ext =>
  link.href.toLowerCase().includes(ext)
);

// Default alt text
img.alt = isLinkTextUrl ? '' : linkText || BIO_CONFIG.DEFAULT_ALT_TEXT;

// Hide author class
if (!block.classList.contains(BIO_CONFIG.HIDE_AUTHOR_CLASS)) {

// Meta selector with INTENTIONAL comment
// INTENTIONAL: Meta tags are document-level elements
const metaAuthor = document.querySelector(BIO_CONFIG.META_AUTHOR_SELECTOR);
```

**CSS Changes:**

1. Removed `.bio-wrapper` reserved class usage (lines 1, 8, 29, 46):

**Before:**
```css
.bio-wrapper .bio.block img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.bio-wrapper .bio.block.highlighted img {
  border: 2px solid blue;
}

@media (max-width: 768px) {
  .bio-wrapper .bio.block img {
    width: 60px;
    height: 60px;
  }
}
```

**After:**
```css
.bio img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.bio.highlighted img {
  border: 2px solid blue;
}

@media (max-width: 768px) {
  .bio img {
    width: 60px;
    height: 60px;
  }
}
```

**Rationale:**

The bio block displays author information with an image and name. The fixes ensure:

1. **Reserved class removal**: CSS no longer uses `.bio-wrapper` which is auto-generated by EDS
2. **Block-scoped queries**: The `renderExpressions` call now traverses up from the block to find the wrapper instead of using a global selector
3. **Configuration centralization**: Image extensions, alt text, and selectors moved to BIO_CONFIG
4. **Meta tag exception**: Document-level meta tag query is documented as INTENTIONAL and acceptable

**Global Selectors - Acceptable:**

The `document.querySelector('meta[name="author"]')` global selector is acceptable because:
- Meta tags are document-level elements by definition
- They exist in `<head>`, not within block scope
- This is standard practice for accessing document metadata
- Documented with INTENTIONAL comment

**Testing Notes:**
- [ ] Visual inspection - author info displays correctly
- [ ] Single instance test - image and name render
- [ ] Multiple instances test - each bio works independently
- [ ] hide-author variation - author name hidden when class present
- [ ] highlighted variation - blue border appears on image
- [ ] Responsive layout - image resizes at 768px and 480px breakpoints
- [ ] Expression rendering - plusplus expressions work correctly
- [ ] Meta tag fallback - author name from meta tag when alt empty
- [ ] Console errors checked

**Risk Level:** LOW

**Reasoning:**
- Simple CSS selector changes (no logic impact)
- Global selector fix uses `closest()` which safely traverses DOM
- CONFIG addition is straightforward refactoring
- Wrapper fallback ensures compatibility if closest() fails

**Status:** ✅ Complete - Ready for testing

---

### Block: inline-svg

**Files Modified:**
- `blocks/inline-svg/inline-svg.js`
- `blocks/inline-svg/inline-svg.css`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.inline-svg-wrapper` used in CSS
2. ❌ MEDIUM: Missing CONFIG object
3. ❌ MEDIUM: Hard-coded values (icon path, svg attributes, alt text)
4. ✅ No global selectors
5. ✅ No inline CSS

**Changes Made:**

**JavaScript Changes:**

1. Added INLINE_SVG_CONFIG object (lines 1-9):

```javascript
const INLINE_SVG_CONFIG = {
  ICONS_PATH: '/icons/',
  ICON_FILE_EXTENSION: '.svg',
  ICON_CLASS_PREFIX: 'icon-',
  SVG_WIDTH: '100%',
  SVG_HEIGHT: '100%',
  ALT_TEXT_SUFFIX: ' illustration',
  ERROR_MESSAGE: 'No valid icon or SVG content found in the block',
};
```

2. Used CONFIG throughout for icon paths, alt text, SVG attributes, and error messages

**CSS Changes:**

1. Replaced reserved class `.inline-svg-wrapper` with variation class:

**Before:**
```css
.inline-svg-wrapper {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
```

**After:**
```css
.inline-svg.fullwidth {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
```

**Rationale:**

Simple fixes for reserved class and missing CONFIG. Uses standard EDS variation pattern (`.inline-svg.fullwidth`) instead of reserved wrapper class.

**Testing Notes:**
- [ ] Icon mode - span with icon class loads SVG from /icons/
- [ ] SVG mode - inline SVG markup renders
- [ ] Fullwidth variation works correctly
- [ ] Alt text generated with illustration suffix

**Risk Level:** LOW - Simple CONFIG addition and CSS class rename

**Status:** ✅ Complete - Ready for testing

---

### Block: fragment

**Files Modified:**
- `blocks/fragment/fragment.js`
- `blocks/fragment/fragment.css`

**Violations Found:**
1. ❌ CRITICAL: Reserved class `.fragment-wrapper` used in CSS (3 instances)
2. ❌ CRITICAL: Global selector `block.closest('.fragment')` instead of using block parameter
3. ❌ MEDIUM: Missing CONFIG object
4. ❌ MEDIUM: Hard-coded values (file extensions, selectors)
5. ✅ No inline CSS

**Changes Made:**

**JavaScript Changes:**

1. Added FRAGMENT_CONFIG object (lines 15-19):

```javascript
const FRAGMENT_CONFIG = {
  PLAIN_HTML_EXTENSION: '.plain.html',
  MEDIA_PREFIX: './media_',
  SECTION_SELECTOR: ':scope .section',
};
```

2. Fixed global selector in decorate function (lines 57-62):

**Before:**
```javascript
block.closest('.section').classList.add(...fragmentSection.classList);
block.closest('.fragment').replaceWith(...fragment.childNodes);
```

**After:**
```javascript
const section = block.closest('.section');
if (section) {
  section.classList.add(...fragmentSection.classList);
}
// Use block parameter instead of class selector
block.replaceWith(...fragment.childNodes);
```

3. Used CONFIG throughout loadFragment function for file extension and media prefix

**CSS Changes:**

1. Replaced reserved class `.fragment-wrapper` with `.fragment`:

**Before:**
```css
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

**After:**
```css
.fragment > .section {
  padding-left: 0;
  padding-right: 0;
}

.fragment > .section:first-of-type {
  padding-top: 0;
}

.fragment > .section:last-of-type {
  padding-bottom: 0;
}
```

**Rationale:**

The fragment block loads external HTML content and injects it into the page. The fixes ensure:

1. **Reserved class removal**: CSS uses `.fragment` instead of `.fragment-wrapper`
2. **Block-scoped operations**: Uses `block` parameter directly instead of querying by class name
3. **Configuration centralization**: File extensions and selectors moved to FRAGMENT_CONFIG
4. **Safety**: Added null check for section before adding classes

**Testing Notes:**
- [ ] Fragment loads correctly from path
- [ ] Section classes transferred to parent section
- [ ] Nested section padding suppressed correctly
- [ ] Media paths resolved correctly with fragment base
- [ ] Block replaces itself with fragment content
- [ ] Console errors checked

**Risk Level:** LOW

**Reasoning:**
- Simple CONFIG addition and CSS class rename
- Global selector fix uses block parameter directly (safer)
- Added null safety check for section
- No logic changes to fragment loading

**Status:** ✅ Complete - Ready for testing

---

### Block: header

**Files Modified:**
- `blocks/header/header.js`
- `blocks/header/header.css`

**Violations Found:**
1. ❌ **Missing CONFIG object** - No centralized configuration for constants
2. ❌ **Inline CSS** - `document.body.style.overflowY` directly manipulates body overflow
3. ⚠️ **Global selectors** - Multiple document-level queries (INTENTIONAL for this block)
4. ❌ **Hard-coded values** - Magic strings for nav ID, paths, keys, aria labels

**Changes Made:**

**1. Added HEADER_CONFIG object:**
```javascript
const HEADER_CONFIG = {
  NAV_ID: 'nav',
  NAV_PATH_DEFAULT: '/nav',
  NAV_META_KEY: 'nav',
  DESKTOP_BREAKPOINT: '(min-width: 900px)',
  NAV_CLASS_NAMES: ['brand', 'sections', 'tools'],
  ARIA_LABEL_OPEN: 'Open navigation',
  ARIA_LABEL_CLOSE: 'Close navigation',
  ESCAPE_KEY: 'Escape',
  ENTER_KEY: 'Enter',
  SPACE_KEY: 'Space',
};
```

**2. Fixed inline CSS - Added CSS class for body scroll control:**

Before:
```javascript
document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
```

After (CSS):
```css
/* Prevent body scroll when mobile nav is open */
body.nav-open-no-scroll {
  overflow-y: hidden;
}
```

After (JavaScript):
```javascript
// INTENTIONAL: Header is a document-level component, controls body scroll when mobile nav is open
if (expanded || isDesktop.matches) {
  document.body.classList.remove('nav-open-no-scroll');
} else {
  document.body.classList.add('nav-open-no-scroll');
}
```

**3. Updated all hard-coded values to use CONFIG:**

Navigation metadata and path:
```javascript
// Before
const navMeta = getMetadata('nav');
const navPath = navMeta ? new URL(navMeta).pathname : '/nav';

// After
const navMeta = getMetadata(HEADER_CONFIG.NAV_META_KEY);
const navPath = navMeta ? new URL(navMeta).pathname : HEADER_CONFIG.NAV_PATH_DEFAULT;
```

Navigation ID and classes:
```javascript
// Before
nav.id = 'nav';
const classes = ['brand', 'sections', 'tools'];
classes.forEach((c, i) => { ... });

// After
nav.id = HEADER_CONFIG.NAV_ID;
HEADER_CONFIG.NAV_CLASS_NAMES.forEach((c, i) => { ... });
```

Aria labels:
```javascript
// Before
hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">`;
button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

// After
hamburger.innerHTML = `<button type="button" aria-controls="${HEADER_CONFIG.NAV_ID}" aria-label="${HEADER_CONFIG.ARIA_LABEL_OPEN}">`;
button.setAttribute('aria-label', expanded ? HEADER_CONFIG.ARIA_LABEL_OPEN : HEADER_CONFIG.ARIA_LABEL_CLOSE);
```

**4. Documented INTENTIONAL global selectors:**

The header block legitimately needs document-level access:
```javascript
// INTENTIONAL: Header is a document-level component, needs to access global nav element
const nav = document.getElementById(HEADER_CONFIG.NAV_ID);

// INTENTIONAL: Header is a document-level component, needs to access currently focused element
const focused = document.activeElement;

// INTENTIONAL: Header is a document-level component, controls body scroll when mobile nav is open
document.body.classList.add/remove('nav-open-no-scroll');
```

**Rationale:**

The header block is a document-level navigation component that requires special considerations:

1. **CONFIG centralization**: All configuration values (paths, IDs, labels, keys) now in one place for easy maintenance and localization
2. **Inline CSS elimination**: Body overflow control moved to CSS class pattern, maintaining separation of concerns
3. **INTENTIONAL global selectors**: Header operates at document level by design:
   - Global nav element with fixed ID
   - Document-level keyboard event handling (ESC, Enter, Space)
   - Body scroll control for mobile navigation
   - Focus management across document
4. **Improved maintainability**: Configuration values easy to update, no magic strings scattered through code

**Testing Notes:**
- [ ] Desktop navigation displays correctly
- [ ] Mobile hamburger menu opens/closes
- [ ] Body scroll prevented when mobile nav open
- [ ] Body scroll restored when mobile nav closed or on desktop
- [ ] ESC key closes dropdowns (desktop) and menu (mobile)
- [ ] Enter/Space keys open nav dropdowns
- [ ] Keyboard navigation works (tab, focus)
- [ ] Aria labels correct (Open/Close navigation)
- [ ] Nav sections toggle correctly
- [ ] Window resize transitions correctly between mobile/desktop
- [ ] Navigation fragment loads from metadata or default path
- [ ] Console errors checked

**Risk Level:** LOW-MEDIUM

**Reasoning:**
- CONFIG addition is non-breaking (values unchanged)
- Inline CSS → CSS class pattern is standard and safe
- Body scroll control logic preserved (same behavior)
- Global selectors are INTENTIONAL and documented
- Header is a critical component but changes are conservative
- All hard-coded values replaced systematically

**Status:** ✅ Complete - Ready for testing

---

### Block: dam

**Files Modified:**
- `blocks/dam/dam.css`

**Violations Found:**
1. ❌ **Reserved class name** - `.dam-wrapper` in CSS

**Changes Made:**

**1. Fixed reserved class name:**

Before:
```css
.dam-wrapper {
  margin: var(--dam-margin) 0;
}
```

After:
```css
.dam {
  margin: var(--dam-margin) 0;
}
```

**Rationale:**

The dam block was already well-structured with:
- DAM_CONFIG object present with all configuration
- No global selectors
- No inline CSS
- Proper error handling

The only violation was the reserved class name `.dam-wrapper` which is automatically added by EDS. The fix removes this and uses `.dam` directly for the margin styling.

**Testing Notes:**
- [ ] DAM block renders JSON output correctly
- [ ] Code display has correct styling (background, border, padding)
- [ ] Responsive design works (mobile font size adjustment)
- [ ] Focus visible outline appears on code element
- [ ] Error handling works for invalid block structure
- [ ] Accessibility attributes present (role, aria-label, tabindex)
- [ ] Console errors checked

**Risk Level:** VERY LOW

**Reasoning:**
- Single CSS class rename
- Block already has CONFIG object
- No JavaScript changes needed
- Simple margin style application
- No logic changes whatsoever

**Status:** ✅ Complete - Ready for testing

---

### Block: code-expander

**Files Modified:**
- `blocks/code-expander/code-expander.js`

**Violations Found:**
1. ⚠️ **Global selectors** - Multiple document-level queries (INTENTIONAL for this block)

**Changes Made:**

**1. Documented INTENTIONAL global selectors:**

The code-expander block legitimately needs document-level access:

```javascript
// INTENTIONAL: Code-expander is a document-level enhancer that processes all code blocks on the page
// Find all code elements in the document
const codeElements = document.querySelectorAll('pre code');

// INTENTIONAL: Tooltips must be added to document body for proper positioning and z-index
if (!document.body.contains(tooltip)) {
  document.body.appendChild(tooltip);
}

// INTENTIONAL: Temporary download anchor must be added to document body to trigger download
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

**Rationale:**

The code-expander block was already well-structured with:
- CODE_EXPANDER_CONFIG object present with all configuration
- No inline CSS (uses CSS classes and custom properties)
- No reserved class names
- Proper error handling

The block legitimately needs global selectors because it:
1. **Enhances all code blocks**: Operates on all `<pre><code>` elements in the document (document-level enhancer)
2. **Modal and tooltip positioning**: Requires document.body for proper z-index and positioning
3. **Download functionality**: Needs temporary anchor in document.body to trigger file downloads

This is the intended behavior - adding INTENTIONAL comments documents this design decision.

**Testing Notes:**
- [ ] All code blocks on page are enhanced
- [ ] Syntax highlighting works for all supported languages
- [ ] Copy to clipboard functionality works
- [ ] Raw/formatted view toggle works
- [ ] Download as file works with correct extensions
- [ ] Expand/collapse works for long code blocks
- [ ] Keyboard navigation works (arrow keys)
- [ ] Info tooltip displays and positions correctly
- [ ] Filename prompt modal works
- [ ] Mobile responsive design works
- [ ] Console errors checked

**Risk Level:** VERY LOW

**Reasoning:**
- Only added INTENTIONAL comments (no logic changes)
- Block already has CONFIG object
- No CSS changes needed
- Global selectors are by design (document-level enhancer)
- No functionality changes whatsoever

**Status:** ✅ Complete - Ready for testing

---

### Block: dfs (FAQ block)

**Files Modified:**
- `blocks/dfs/dfs.js`

**Violations Found:**
1. ❌ **Inline CSS** - Multiple instances of `element.style.display`, `element.style.transform` for show/hide animations (NOT FIXED - documented for future refactoring)
2. ⚠️ **Global selector** - `document.getElementById('faq-live-region')`, `document.body.appendChild` (INTENTIONAL for accessibility)

**Changes Made:**

**1. Documented INTENTIONAL global selector:**

```javascript
// INTENTIONAL: Live region for screen readers must be at document level for accessibility
let liveRegion = document.getElementById('faq-live-region');

if (!liveRegion) {
  liveRegion = document.createElement('div');
  liveRegion.id = 'faq-live-region';
  liveRegion.className = 'sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  document.body.appendChild(liveRegion);
}
```

**2. Inline CSS - Documented for future refactoring:**

The DFS block uses inline CSS extensively for show/hide animations:
- `content.style.display = 'block'` / `'none'` (toggle FAQ visibility)
- `icon.style.transform = 'rotate(180deg)'` / `'rotate(0)'` (toggle icon)
- `item.style.display = 'block'` / `'none'` (filter FAQ items)
- `section.style.display = 'block'` / `'none'` (filter categories)
- `emptyMessage.style.display = 'none'` / `'block'` (show/hide empty message)

**Why not fixed now:**
- Extensive refactoring needed (10+ inline style locations)
- Working animation system with complex state management
- Risk of breaking existing functionality
- Would require CSS-only solution with class-based toggles
- Better handled in dedicated refactoring task

**Future refactoring approach:**
- Add CSS classes: `.faq-visible`, `.faq-hidden`, `.faq-open`, `.icon-rotated`
- Use `classList.add/remove` instead of inline styles
- Leverage CSS transitions for animations
- Update filterFaqs() to use class-based toggling

**Rationale:**

The DFS block was already structured with:
- CONFIG object present with all configuration
- No reserved class names
- Complex interactive FAQ system with search/filter

The global selector is legitimately needed for:
1. **ARIA live region**: Must be at document level for screen readers to announce search results
2. **Accessibility requirement**: This is standard pattern for live announcements

The inline CSS is a known issue but fixing it requires substantial refactoring that could introduce bugs in the complex show/hide logic. Documented for future dedicated refactoring task.

**Testing Notes:**
- [ ] FAQ questions expand/collapse correctly
- [ ] Search functionality filters FAQs
- [ ] Category filter works
- [ ] Search highlighting works
- [ ] Screen reader announcements work (ARIA live region)
- [ ] External links open in new tabs
- [ ] Internal fragment links scroll correctly
- [ ] Keyboard navigation works (Enter/Space on questions)
- [ ] Mobile responsive design works
- [ ] Analytics tracking works (if dataLayer present)
- [ ] Console errors checked

**Risk Level:** VERY LOW (documentation-only changes)

**Reasoning:**
- Only added INTENTIONAL comment for global selector
- No functional changes
- No logic modifications
- Inline CSS documented for future work (not blocking)
- Block functionality unchanged

**Status:** ✅ Complete - Ready for testing (inline CSS refactoring deferred)

---

### Block: tags

**Files Modified:**
- `blocks/tags/tags.js`

**Violations Found:**
1. ❌ **Missing CONFIG object** - No centralized configuration
2. ❌ **Global selector** - `document.querySelector('.tags.block')` should use `block` parameter
3. ⚠️ **Global object** - `window.siteConfig` (INTENTIONAL - global configuration)

**Changes Made:**

**1. Added TAGS_CONFIG object:**

```javascript
const TAGS_CONFIG = {
  META_KEYS: {
    CONTENT_TECHNOLOGY: '$meta:contenttechnology$',
    CATEGORY: '$meta:category$',
  },
  CSS_CLASSES: {
    TAG: 'card-tag',
    TAG_ALT: 'card-tag alt',
  },
};
```

**2. Fixed global selector - Use block parameter:**

Before:
```javascript
const tagsBlock = document.querySelector('.tags.block');
// ...
tagsBlock.innerHTML = tagsHTML;
block.appendChild(tagsBlock);
```

After:
```javascript
// Use block parameter directly instead of document.querySelector
block.innerHTML = tagsHTML;
```

**3. Documented INTENTIONAL global object:**

```javascript
// INTENTIONAL: window.siteConfig is a global configuration object
if (window.siteConfig && window.siteConfig[TAGS_CONFIG.META_KEYS.CONTENT_TECHNOLOGY]) {
  // ...
}
```

**4. Used CONFIG throughout:**

```javascript
// Before
tagsHTML += `<span class='card-tag'>${window.siteConfig['$meta:contenttechnology$']}</span>`;
tagsHTML += `<span class='card-tag alt'>${window.siteConfig['$meta:category$']}</span>`;

// After
tagsHTML += `<span class='${TAGS_CONFIG.CSS_CLASSES.TAG}'>${window.siteConfig[TAGS_CONFIG.META_KEYS.CONTENT_TECHNOLOGY]}</span>`;
tagsHTML += `<span class='${TAGS_CONFIG.CSS_CLASSES.TAG_ALT}'>${window.siteConfig[TAGS_CONFIG.META_KEYS.CATEGORY]}</span>`;
```

**Rationale:**

The tags block displays metadata tags from global site configuration:

1. **CONFIG centralization**: Meta keys and CSS classes now in one place for easy maintenance
2. **Fixed global selector**: Uses `block` parameter directly instead of `document.querySelector('.tags.block')`
3. **Simplified logic**: Removed unnecessary `tagsBlock` variable and `appendChild` call
4. **INTENTIONAL global object**: `window.siteConfig` is a legitimate global configuration object

**Testing Notes:**
- [ ] Tags display correctly when siteConfig has content technology
- [ ] Tags display correctly when siteConfig has category
- [ ] Both tags display when both meta keys present
- [ ] No tags display when siteConfig missing or empty
- [ ] Tag styling correct (red border for technology, blue for category)
- [ ] Console errors checked

**Risk Level:** LOW

**Reasoning:**
- Simple CONFIG addition (non-breaking)
- Fixed global selector to use block parameter (cleaner, safer)
- Simplified logic (removed unnecessary steps)
- No functionality changes
- Tags still display from same global configuration

**Status:** ✅ Complete - Ready for testing

---

## Phase 2: Summary

**Completed:** All 8 Phase 2 blocks fixed
- bio, inline-svg, fragment, header, dam, code-expander, dfs, tags

**Key Achievements:**
- Added CONFIG objects where missing
- Fixed reserved class names
- Fixed global selectors (or documented INTENTIONAL)
- Removed inline CSS (or documented for future refactoring)
- All changes committed to `fix/eds-blocks-standards-compliance` branch

**Next Steps:** Phase 3 - MEDIUM PRIORITY Fixes (single-violation blocks)

---

## Phase 3: MEDIUM PRIORITY Fixes

**Goal:** Fix single-violation blocks

**Timeline:** Days 6-8

**Blocks to fix:**
18. text
19. dynamic
20. bloglist
21. embed
22. modal
23. slide-builder
24. footer

[Details to be added as fixes progress]

---

## Phase 4-5: CONFIG & Error Handling

**Goal:** Add CONFIG objects and improve error handling for remaining blocks

**Timeline:** Days 9-14

**Blocks:** 25-50 (remaining blocks)

[Details to be added as fixes progress]

---

## Testing Summary

**Tools Used:**
- `validate-blocks.sh` - Automated standards validation
- `test-block-fixes.ipynb` - Interactive testing with verification functions
- Browser testing - Visual inspection in Chrome, Firefox, Safari
- Multiple instance testing - Verify no global selector issues

**Test Approach:**
1. Run `validate-blocks.sh` before fixes (baseline)
2. Fix block violations
3. Run verification functions in `test-block-fixes.ipynb`
4. Generate visual preview with `saveBlockHTML()`
5. Test with multiple instances
6. Run `validate-blocks.sh` after fixes (validation)

---

## Rollback Instructions

If issues are discovered during or after fixes:

### Immediate Rollback (Single Block)
```bash
# Rollback specific block
git checkout HEAD -- blocks/blockname/

# Or restore from git history
git log --oneline blocks/blockname/
git checkout <commit-sha> -- blocks/blockname/
```

### Rollback All Recent Fixes
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git log --oneline
git revert <commit-sha>
```

### Emergency Rollback (All Phases)
```bash
# Hard reset to before fixes (DANGEROUS - only if no push yet)
git reset --hard <commit-before-fixes>

# Safe revert of multiple commits
git revert <oldest-commit>..<newest-commit>
```

---

## Lessons Learned

[To be updated as fixes progress]

**Patterns Discovered:**
- [Common violation patterns]
- [Best practices that work well]
- [Mistakes to avoid]

**Challenges:**
- [Difficult fixes]
- [Unexpected issues]
- [Blocks requiring special handling]

---

## Future Improvements

[To be updated at end of project]

**Prevention:**
- Add validation script to CI/CD pipeline
- Create ESLint rules for EDS patterns
- Add pre-commit hooks
- Update block creation templates

**Documentation:**
- Update CLAUDE.md with new learnings
- Add examples to eds-block-development skill
- Create troubleshooting guide for common issues

**Tools:**
- Automated fix scripts for simple patterns
- Visual regression testing setup
- Performance benchmarking suite

---

## References

- **Plan:** `/Users/tomcranstoun/.claude/plans/noble-herding-sonnet.md`
- **Validation Script:** `/Users/tomcranstoun/Documents/GitHub/allaboutV2/validate-blocks.sh`
- **Testing Notebook:** `/Users/tomcranstoun/Documents/GitHub/allaboutV2/test-block-fixes.ipynb`
- **EDS Block Development Guide:** `.claude/skills/eds-block-development/SKILL.md`
- **Block Architecture Standards:** `docs/for-ai/implementation/block-architecture-standards.md`

---

**Last Updated:** 2025-11-27
**Next Update:** After first block fix is complete
