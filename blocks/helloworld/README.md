---
title: "Hello World Block"
description: "Documentation for the helloworld EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Hello World Block

A minimal starter block demonstrating the fundamental structure and patterns for Adobe Edge Delivery Services (EDS) block development. This example serves as a learning resource and template for creating new blocks.

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

The Hello World block is the simplest possible EDS block implementation. It demonstrates the core concepts every block developer needs to understand: the decorate function pattern, DOM manipulation, and CSS styling conventions.

**Primary Use Cases:**

- Learning EDS block development fundamentals
- Template for creating new simple blocks
- Testing EDS block decoration workflow
- Demonstrating minimal viable block structure
- Training and onboarding new developers

**Block Name:** `helloworld`

**Location:** `/blocks/helloworld/`

**Files:**

- `helloworld.js` - Minimal decoration function (6 lines)
- `helloworld.css` - Basic styling demonstration
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Minimal Decoration Pattern**
   - Single div creation
   - Text content injection
   - DOM replacement
   - Demonstrates decorate function signature

2. **Basic Styling**
   - Centered text display
   - Background color application
   - Padding and spacing
   - Border radius for visual polish
   - Color and typography settings

3. **EDS Integration**
   - Standard block naming convention
   - Follows Content Driven Development principles
   - Compatible with EDS pipeline
   - Works with markdown table input

4. **Learning Resource**
   - Clear, commented code
   - Minimal complexity
   - Easy to understand flow
   - Template for new blocks

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function performs a simple transformation:

1. **Element Creation**: Creates a new `<div>` element to hold the greeting
2. **Content Injection**: Sets text content to "Hello World"
3. **DOM Clearing**: Removes all existing content from the block
4. **Element Append**: Adds the greeting div to the block

### Key Function: decorate()

`Default Export Function`
`export default function decorate(block) {`
`const greeting = document.createElement('div');`
`greeting.textContent = 'Hello World';`
`block.textContent = '';`
`block.appendChild(greeting);`
`}`

**Parameters:**

- `block` (HTMLElement) - The block container element automatically passed by EDS

**Return Value:** None (void function, modifies block in place)

**Purpose:** Transforms the initial markdown-generated HTML into the desired output structure

### CSS Architecture

The helloworld block uses simple CSS properties for visual presentation:

**Block Container:**

- `background-color: #f0f0f0` - Light gray background
- `padding: 20px` - Inner spacing
- `border-radius: 5px` - Rounded corners
- `text-align: center` - Centered text

**Typography:**

- `font-size: 24px` - Large, readable text
- `font-weight: bold` - Prominent display
- `color: #333` - Dark gray text (good contrast)

### Data Flow

`Content Authors Create Markdown`
`↓`
`EDS Pipeline Converts to HTML`
`↓`
`Block element created with .helloworld class`
`↓`
`decorate() function called automatically`
`↓`
`Creates greeting div`
`↓`
`Clears block content`
`↓`
`Appends greeting to block`
`↓`
`CSS applied for visual styling`
`↓`
`Final rendered "Hello World" display`

**Key Concept:** EDS automatically finds all elements with the `.helloworld` class and calls the `decorate()` function for each one.

---

## Usage

### Basic Markdown Structure

In Google Docs or your content authoring tool, create a table with the block name:

| HelloWorld |
|------------|

**Result:** A styled box displaying "Hello World" text.

### Alternative: With Content

You can add content in the table (though this simple block ignores it):

| HelloWorld |
|------------|
| Any content here will be replaced |

**Note:** The current implementation clears all content and replaces it with "Hello World". To use the original content, modify the JavaScript to preserve it.

### Markdown to HTML Transformation

**Input (Markdown):**

| HelloWorld |
|------------|

**Intermediate (EDS Generated):**
`<div class="helloworld block">`
`<!-- Empty or contains table content -->`
`</div>`

**Final Output (After Decoration):**
`<div class="helloworld block">`
`<div>Hello World</div>`
`</div>`

### Integration Points

**With other blocks:**

- Can appear anywhere on a page
- Works before, after, or between other blocks
- No dependencies on other blocks
- Completely standalone

**Content Model:**

- Accepts any content (currently ignored)
- No specific structure required
- Simple block name in table header

---

## Content Structure

### Expected Input (Markdown Table)

The simplest possible structure:

| HelloWorld |
|------------|

### Initial DOM (Before Decoration)

EDS creates this structure automatically:

`<div class="helloworld block">`
`<!-- May contain some initial content from markdown -->`
`</div>`

**Important:** The `.helloworld` class triggers decoration. The `block` class is added by EDS to all blocks.

### Output Structure (After Decoration)

After the `decorate()` function runs:

`<div class="helloworld block">`
`<div>Hello World</div>`
`</div>`

**Styled appearance:**

- Light gray background box
- Centered bold text reading "Hello World"
- Comfortable padding around text
- Slightly rounded corners

---

## Styling & Customization

### Default Visual Appearance

**Container:**

- Background: Light gray (#f0f0f0)
- Padding: 20px all sides
- Border radius: 5px
- Text alignment: Center

**Text:**

- Size: 24px (large, prominent)
- Weight: Bold
- Color: Dark gray (#333)
- Display: Centered

### Customization Options

#### Option 1: Modify CSS Variables

Create custom styling by overriding in your site's CSS:

`.helloworld {`
`background-color: #e3f2fd;`
`color: #1565c0;`
`font-size: 32px;`
`}`

#### Option 2: Add Variation Classes

Extend the block with variations:

`.helloworld.large {`
`font-size: 36px;`
`padding: 40px;`
`}`

`.helloworld.colorful {`
`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
`color: white;`
`}`

**Usage in markdown:**

| HelloWorld (large, colorful) |
|-------------------------------|

#### Option 3: Modify JavaScript

Change the greeting text:

`export default function decorate(block) {`
`const greeting = document.createElement('div');`
`greeting.textContent = 'Welcome to EDS!'; // Changed text`
`block.textContent = '';`
`block.appendChild(greeting);`
`}`

#### Option 4: Use Original Content

Preserve markdown content instead of replacing:

`export default function decorate(block) {`
`// Wrap existing content in a styled div`
`const wrapper = document.createElement('div');`
`wrapper.className = 'greeting-wrapper';`
`while (block.firstChild) {`
`wrapper.appendChild(block.firstChild);`
`}`
`block.appendChild(wrapper);`
`}`

---

## Responsive Behavior

### Mobile (< 600px)

- Text remains readable (24px is mobile-friendly)
- Padding maintains breathing room
- Background provides visual distinction
- No horizontal scrolling

### Tablet (600px - 1024px)

- Same appearance as mobile
- Comfortable reading experience
- No layout changes needed

### Desktop (> 1024px)

- Same appearance as tablet/mobile
- Block width controlled by parent container
- Text remains centered

**Why so simple?** This block demonstrates that not all blocks need complex responsive behavior. Simple, consistent design works across all devices.

---

## Accessibility

### Semantic HTML

**Current implementation:**

- Uses `<div>` elements (neutral containers)
- Text content is readable by screen readers
- No interactive elements (no keyboard navigation needed)

### Screen Reader Compatibility

**What screen readers announce:**

1. "Hello World" (the text content)
2. No special roles or labels needed for this simple block

### Keyboard Navigation

- Not applicable (no interactive elements)
- Block is pure presentational content

### Visual Accessibility

**Color contrast:**

- Text (#333) on background (#f0f0f0) = 8.59:1 ratio
- Exceeds WCAG AAA standard (7:1)
- Excellent readability for all users

**Font size:**

- 24px is larger than minimum recommended (16px)
- Bold weight improves legibility
- No accessibility concerns

### Improvements for Production

**For a real block, consider:**

1. **Semantic markup:** Use `<h2>`, `<p>`, or appropriate element instead of `<div>`
2. **ARIA labels:** Add context if the block has interactive elements
3. **Focus management:** Ensure keyboard users can access all functionality
4. **Alternative text:** Provide for any images or icons

---

## Performance

### Lighthouse Scores

**Expected scores:**

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Why?** This block is extremely lightweight with minimal code and no external dependencies.

### Performance Characteristics

**JavaScript:**

- Tiny function (6 lines)
- Executes in < 1ms
- No async operations
- No network requests
- No external dependencies

**CSS:**

- Minimal rules (9 declarations)
- No complex selectors
- No animations
- Fast parsing and rendering

**DOM Operations:**

- Creates 1 element
- Clears block content (fast)
- Appends 1 element
- No layout thrashing

### Loading Strategy

**E-L-D Pattern (Eager, Lazy, Delayed):**

This block can use any loading strategy:

- **Eager:** Load immediately (recommended for above-fold content)
- **Lazy:** Load when block enters viewport
- **Delayed:** Load after page interaction

**Recommendation:** Use eager loading - the block is so lightweight it has no performance impact.

### Optimization Tips

**Already optimized:**

- No images to compress
- No fonts to load
- No JavaScript libraries
- Minimal CSS and JS payload

**If expanding this block:**

1. Keep JavaScript minimal
2. Avoid heavy DOM manipulation
3. Use CSS for animations
4. Defer non-critical operations

---

## Browser Support

### Supported Browsers

**Full support (no polyfills needed):**

- Chrome/Edge 90+ (current - 2 versions)
- Firefox 88+ (current - 2 versions)
- Safari 14+ (current - 2 versions)
- iOS Safari 14+
- Android Chrome 90+

**Why such broad support?** This block uses only basic DOM methods that have been supported for years.

### API Compatibility

**JavaScript APIs used:**

- `document.createElement()` - Universal support
- `element.textContent` - Universal support
- `element.appendChild()` - Universal support

**No issues with:**

- ES6 modules (EDS handles transpilation if needed)
- Modern JavaScript features
- CSS properties (all basic, well-supported)

### Internet Explorer 11

**Not officially supported** but would work with EDS transpilation:

- Basic DOM methods work
- CSS properties supported
- No ES6 features that can't be transpiled

---

## Troubleshooting

### Issue: Block Doesn't Appear

**Problem:** You don't see "Hello World" on the page.

**Possible Causes:**

1. JavaScript file not loaded
2. CSS file not loaded
3. Block name mismatch
4. EDS decoration pipeline issue

**Solutions:**

1. Check browser console (F12) for errors
2. Verify `/blocks/helloworld/helloworld.js` loads (Network tab)
3. Verify `/blocks/helloworld/helloworld.css` loads
4. Check markdown table has "HelloWorld" (exact spelling)
5. Inspect element - should have `.helloworld` class

### Issue: Styling Not Applied

**Problem:** "Hello World" appears but has no styling.

**Cause:** CSS file not loaded or selector not matching.

**Solutions:**

1. Check Network tab for `helloworld.css` (should be 200 status)
2. Inspect element - verify `.helloworld` class exists
3. Check browser console for CSS errors
4. Clear browser cache and hard refresh (Cmd/Ctrl + Shift + R)

### Issue: JavaScript Errors

**Problem:** Console shows errors related to helloworld block.

**Common errors:**

- "decorate is not a function" - JavaScript file not exporting correctly
- "Cannot read property 'appendChild'" - Block element undefined
- "Unexpected token" - Syntax error in JavaScript

**Solutions:**

1. Verify `export default function decorate(block)` syntax
2. Check for missing semicolons or brackets
3. Ensure modern browser or proper transpilation
4. Test in different browser to isolate issue

### Issue: Content Not Replaced

**Problem:** Original markdown content shows instead of "Hello World".

**Cause:** JavaScript decoration not running.

**Solutions:**

1. Check that decorate function is called (add console.log)
2. Verify block has `.helloworld` class
3. Check EDS pipeline configuration
4. Look for JavaScript errors preventing execution

### Issue: Block Appears Multiple Times

**Problem:** "Hello World" displays more than once.

**Cause:** Multiple markdown blocks or decoration called multiple times.

**Solutions:**

1. Check your content - count HelloWorld blocks
2. Ensure only one table with HelloWorld header
3. Verify decorate function only called once per block
4. Check for duplicate script includes

---

## Testing

### Manual Testing Checklist

After creating or modifying the block:

1. **Visual verification:**
   - Block appears on page ✓
   - "Hello World" text displays ✓
   - Gray background visible ✓
   - Text is centered and bold ✓
   - Border radius applied ✓

2. **Browser testing:**
   - Chrome: Test in latest version ✓
   - Firefox: Verify appearance ✓
   - Safari: Check rendering ✓
   - Mobile Safari (iOS): Test on device ✓
   - Chrome Mobile (Android): Verify display ✓

3. **Responsive testing:**
   - Mobile (< 600px): Readable and styled ✓
   - Tablet (600-1024px): Proper display ✓
   - Desktop (> 1024px): Correct appearance ✓

4. **Console verification:**
   - No JavaScript errors ✓
   - helloworld.js loaded successfully ✓
   - helloworld.css loaded successfully ✓

### Automated Testing

Use `test.html` for browser-based testing:

1. Open `/blocks/helloworld/test.html` in browser
2. Verify multiple test scenarios
3. Check console output for validation
4. Test responsive behavior at different widths

### Testing Strategy

**Unit Testing (Future):**

- Test decorate function creates correct DOM
- Verify text content is "Hello World"
- Check element structure matches expected output

**Integration Testing:**

- Verify block works within EDS pipeline
- Test with other blocks on same page
- Ensure no CSS conflicts

**Visual Regression Testing:**

- Capture screenshots at multiple breakpoints
- Compare against baseline images
- Flag any unexpected visual changes

---

## Dependencies

### External Dependencies

**None** - This block is completely standalone.

### Internal Dependencies

**EDS Core:**

- Relies on EDS decoration pipeline
- Uses standard block naming convention
- Requires EDS to add `.block` class

**Scripts:**

- No dependency on `/scripts/aem.js` or other utilities
- No helper functions needed
- Pure vanilla JavaScript

**Styles:**

- Optional: May reference CSS variables from `/styles/styles.css`
- No required external styles
- Fully self-contained CSS

### Browser APIs

- `document.createElement()` - Universal support
- `Element.textContent` - Universal support
- `Element.appendChild()` - Universal support

---

## Future Enhancements

### Potential Improvements

**1. Use Content from Markdown**

Instead of hardcoding "Hello World", use the content from the markdown table:

`export default function decorate(block) {`
`const message = block.textContent.trim() || 'Hello World';`
`block.textContent = '';`
`const greeting = document.createElement('div');`
`greeting.textContent = message;`
`block.appendChild(greeting);`
`}`

**2. Add Configuration Options**

Support variations like color themes:

| HelloWorld (blue) |
|-------------------|
| Custom message |

**3. Add Animation**

Fade in or slide in the greeting:

`.helloworld {`
`animation: fadeIn 0.5s ease-in;`
`}`
`@keyframes fadeIn {`
`from { opacity: 0; }`
`to { opacity: 1; }`
`}`

**4. Support Multiple Languages**

Add internationalization:

`const MESSAGES = {`
`en: 'Hello World',`
`es: 'Hola Mundo',`
`fr: 'Bonjour le Monde'`
`};`

**5. Add Icon or Image**

Include a decorative element:

`const icon = document.createElement('span');`
`icon.textContent = '👋';`
`icon.className = 'greeting-icon';`
`block.insertBefore(icon, greeting);`

### Community Contributions

This block is intentionally kept simple for learning purposes. If you create an enhanced version:

1. Fork and create variations
2. Share improvements with the team
3. Document your changes
4. Consider creating a new block for complex features

### Educational Extensions

**For learning:**

1. Add data-attributes for testing
2. Create multiple variations
3. Implement error handling
4. Add console logging for debugging
5. Create comprehensive unit tests

---

## Learning Outcomes

### What This Block Teaches

**Core Concepts:**

1. **Block structure:** Every EDS block needs JS, CSS, and docs
2. **Decorate pattern:** The main function receives a block element
3. **DOM manipulation:** Create, clear, and append elements
4. **CSS naming:** Class names match block name
5. **Export pattern:** Default export of decorate function

**EDS Patterns:**

1. **Automatic decoration:** EDS finds and decorates blocks
2. **Class-based selection:** `.blockname` triggers decoration
3. **In-place modification:** Change block DOM directly
4. **No return value:** Decorate modifies element, doesn't return

**Best Practices:**

1. **Minimal code:** Keep blocks as simple as possible
2. **Clear structure:** Separate JS, CSS, documentation
3. **Vanilla JavaScript:** No framework dependencies
4. **Accessibility:** Consider contrast, semantics, keyboard use

### Next Steps for Learners

**After understanding this block:**

1. Create your own simple block
2. Add a variation (color, size, style)
3. Make it use markdown content
4. Add configuration options
5. Explore more complex blocks (tabs, accordion, cards)

**Recommended Reading:**

- [EDS Fundamentals Guide](/docs/for-ai/eds.md)
- [Block Architecture Standards](/docs/for-ai/implementation/block-architecture-standards.md)
- [Design Philosophy Guide](/docs/for-ai/implementation/design-philosophy-guide.md)
- [Content Driven Development](/docs/for-ai/getting-started-guide.md)

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Developers, Technical Learners, Block Creators
**Complexity Level:** Beginner (Minimal)
