---
title: "Hello World Block - Usage Examples"
description: "Usage examples for the helloworld EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Hello World Block - Usage Examples

This document shows how to use the Hello World block in Google Docs as a learning tool for Adobe Edge Delivery Services (EDS) block development. This is the simplest possible block, perfect for understanding EDS fundamentals.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create the simplest block in Google Docs:

| HelloWorld |
|------------|

**Result:** A styled gray box displaying "Hello World" in bold centered text.

**What happens:**

1. EDS sees the "HelloWorld" table
2. Creates a `<div class="helloworld block">` element
3. Calls the decorate function
4. Function replaces content with "Hello World"
5. CSS styles the display

---

## Basic Usage

### Minimal Example

The absolute simplest block:

| HelloWorld |
|------------|

**Output:** Gray box with "Hello World" text, centered and bold.

**Technical details:**

- Creates one div element
- Text: "Hello World" (hardcoded)
- Background: Light gray (#f0f0f0)
- Padding: 20px all sides
- Border radius: 5px

### With Content (Currently Ignored)

You can add content, but this simple version ignores it:

| HelloWorld |
|------------|
| This content will be replaced |

**Output:** Same as minimal example - shows "Hello World", not the table content.

**Why?** The current JavaScript implementation clears all content and replaces it with "Hello World". This demonstrates the most basic decoration pattern.

**To use the content:** You would need to modify the JavaScript (see [Advanced Techniques](#advanced-techniques)).

---

## Common Patterns

### Pattern 1: Single Block on Page

Place one Hello World block anywhere on your page:

## Welcome Section

Some introductory text about your page or product.

| HelloWorld |
|------------|

More content continues here after the block.

**Best for:** Testing EDS setup, learning block basics, placeholder content

### Pattern 2: Multiple Blocks

You can have multiple Hello World blocks on the same page:

| HelloWorld |
|------------|

Some content between blocks.

| HelloWorld |
|------------|

More content.

| HelloWorld |
|------------|

**Result:** Three separate gray boxes, each displaying "Hello World".

**Note:** Each block is decorated independently by EDS.

### Pattern 3: Mixed with Other Blocks

Combine Hello World with other EDS blocks:

| HelloWorld |
|------------|

| Tabs |
|------|
| Tab 1 |
| Content for first tab |
| Tab 2 |
| Content for second tab |

| HelloWorld |
|------------|

**Result:** Hello World blocks appear before and after the Tabs block, demonstrating that blocks work independently.

---

## Content Requirements

### Block Name Requirements

**Required:**

- Table header must contain "HelloWorld" (case-sensitive)
- Spelling must be exact
- No spaces or special characters

**Why this matters:**

- EDS converts table header to CSS class
- "HelloWorld" becomes `.helloworld`
- Class name triggers JavaScript decoration
- Wrong spelling = block won't work

**Correct:**

| HelloWorld |
|------------|

**Incorrect:**

- "Hello World" (space) - Won't work
- "helloworld" (wrong case) - Won't work
- "HelloWold" (typo) - Won't work

### Content Requirements

**Current implementation:**

- No content required (any content is replaced)
- Table can be empty or have content
- Content is cleared by decoration function

**Example with empty table:**

| HelloWorld |
|------------|

**Example with content (ignored):**

| HelloWorld |
|------------|
| Any text here |
| More text here |
| All replaced with "Hello World" |

### Variations Support

**Not currently implemented** but could be added:

| HelloWorld (large) |
|--------------------|

| HelloWorld (blue, large) |
|--------------------------|

**To enable variations:** Add CSS for variation classes and detect them in JavaScript.

---

## Styling Guidelines

### Default Visual Appearance

**Container styling:**

- Background: Light gray (#f0f0f0)
- Padding: 20px on all sides
- Border radius: 5px (slightly rounded corners)
- Text alignment: Center

**Text styling:**

- Font size: 24px (large, prominent)
- Font weight: Bold
- Color: Dark gray (#333)
- Good contrast ratio: 8.59:1 (WCAG AAA compliant)

### Visual Examples

**On page, the block appears as:**

```
┌─────────────────────────────┐
│                             │
│      Hello World           │
│                             │
└─────────────────────────────┘
```

**Styled box with:**

- Gray background
- Centered bold text
- Comfortable padding
- Rounded corners

### Responsive Behavior

**Mobile (< 600px):**

- Same styling as desktop
- Text remains 24px (readable on mobile)
- Padding maintains comfortable spacing
- No layout changes needed

**Tablet (600px - 1024px):**

- Identical to mobile
- No breakpoint-specific changes

**Desktop (> 1024px):**

- Same as tablet/mobile
- Block width controlled by parent container

**Why so simple?** This block demonstrates that not every block needs complex responsive behavior. Consistent, readable design works everywhere.

---

## Best Practices

### Content Strategy

**1. Use for learning**

- First block for new EDS developers
- Understand decorate function pattern
- See markdown to HTML transformation
- Learn block decoration pipeline

**2. Use for testing**

- Test EDS setup and configuration
- Verify block decoration works
- Debug CSS and JavaScript loading
- Confirm build pipeline functions

**3. Use as template**

- Copy structure for new blocks
- Understand file organization
- See minimal viable implementation
- Learn documentation patterns

### Development Best Practices

**1. Keep it simple**

- This block is intentionally minimal
- Only 6 lines of JavaScript
- Basic CSS styling
- Easy to understand

**2. Follow patterns**

- Export default decorate function
- Receive block element as parameter
- Modify DOM in place
- No return value needed

**3. Document thoroughly**

- README.md for technical details
- EXAMPLE.md for content authors
- test.html for validation
- Clear, educational comments

### When NOT to Use

**Avoid this block for:**

- Production websites (it's a learning tool)
- Real content display (text is hardcoded)
- Complex interactions (no functionality)
- Dynamic data (no API integration)

**Better alternatives for production:**

- Create custom blocks for real use cases
- Use this as a starting template only
- Build on these fundamentals
- Add real functionality

---

## Troubleshooting

### Issue: Block Doesn't Display

**Problem:** You don't see "Hello World" on the page.

**Check these:**

1. **Correct spelling:** Table header must be "HelloWorld" exactly
2. **JavaScript loaded:** Check browser console (F12) for errors
3. **CSS loaded:** Verify helloworld.css loads in Network tab
4. **EDS working:** Check other blocks work on the page

**Common mistakes:**

- "Hello World" with space - Won't work
- "helloworld" lowercase - Won't work
- Missing files - JavaScript or CSS not found

### Issue: No Styling Applied

**Problem:** "Hello World" appears but has no gray background or styling.

**Causes:**

- CSS file not loaded
- Wrong class name on element
- CSS cache issue
- Selector not matching

**Solutions:**

1. Check Network tab for `helloworld.css` (200 status)
2. Inspect element - should have `.helloworld` class
3. Clear browser cache (Cmd/Ctrl + Shift + R)
4. Check browser console for CSS errors

### Issue: Wrong Content Shows

**Problem:** Original markdown content shows instead of "Hello World".

**This means:**

- JavaScript decoration not running
- Decorate function not called
- JavaScript error preventing execution

**Solutions:**

1. Check console for JavaScript errors
2. Verify decorate function exports correctly
3. Add console.log to test if function runs
4. Check EDS pipeline configuration

### Issue: Appears Multiple Times

**Problem:** "Hello World" displays more than once unexpectedly.

**Causes:**

- Multiple HelloWorld tables in content
- Decoration called multiple times
- Multiple script includes

**Solutions:**

1. Count HelloWorld blocks in your content
2. Verify only one decoration per block
3. Check for duplicate script loads
4. Inspect DOM for multiple elements

---

## Advanced Techniques

### Technique 1: Use Markdown Content

Modify JavaScript to use the table content instead of "Hello World":

`Modified decorate function`
`export default function decorate(block) {`
`const message = block.textContent.trim() || 'Hello World';`
`block.textContent = '';`
`const greeting = document.createElement('div');`
`greeting.textContent = message;`
`block.appendChild(greeting);`
`}`

**Then you can use:**

| HelloWorld |
|------------|
| Welcome to our site! |

**Output:** Shows "Welcome to our site!" instead of "Hello World"

### Technique 2: Add Variations

Add CSS for variations and detect them in JavaScript:

**CSS for variations:**
`.helloworld.large {`
`font-size: 36px;`
`padding: 40px;`
`}`

`.helloworld.blue {`
`background-color: #e3f2fd;`
`color: #1565c0;`
`}`

**Detect variation in JavaScript:**
`export default function decorate(block) {`
`const isLarge = block.classList.contains('large');`
`const greeting = document.createElement('div');`
`greeting.textContent = isLarge ? 'HELLO WORLD!' : 'Hello World';`
`block.textContent = '';`
`block.appendChild(greeting);`
`}`

**Usage:**

| HelloWorld (large, blue) |
|--------------------------|

### Technique 3: Add Icon or Image

Include an icon with the greeting:

`Enhanced decorate function`
`export default function decorate(block) {`
`block.textContent = '';`
`  `
`const icon = document.createElement('span');`
`icon.textContent = '👋';`
`icon.className = 'greeting-icon';`
`  `
`const greeting = document.createElement('div');`
`greeting.textContent = 'Hello World';`
`  `
`block.appendChild(icon);`
`block.appendChild(greeting);`
`}`

**CSS for icon:**
`.helloworld .greeting-icon {`
`font-size: 48px;`
`display: block;`
`margin-bottom: 10px;`
`}`

**Result:** Wave emoji above "Hello World" text

### Technique 4: Add Animation

Make the greeting fade in:

**CSS animation:**
`.helloworld {`
`animation: fadeIn 0.5s ease-in;`
`}`

`@keyframes fadeIn {`
`from {`
`opacity: 0;`
`transform: translateY(-10px);`
`}`
`to {`
`opacity: 1;`
`transform: translateY(0);`
`}`
`}`

**Result:** Block fades in smoothly when page loads

### Technique 5: Multiple Languages

Support internationalization:

`Internationalized decorate function`
`const MESSAGES = {`
`en: 'Hello World',`
`es: 'Hola Mundo',`
`fr: 'Bonjour le Monde',`
`de: 'Hallo Welt',`
`ja: 'こんにちは世界'`
`};`

`export default function decorate(block) {`
`const lang = document.documentElement.lang || 'en';`
`const message = MESSAGES[lang] || MESSAGES.en;`
`  `
`const greeting = document.createElement('div');`
`greeting.textContent = message;`
`block.textContent = '';`
`block.appendChild(greeting);`
`}`

**Result:** Shows greeting in page language

---

## Testing Your Block

### Visual Testing Checklist

After adding Hello World to a page:

1. **Block appears:** ✓
2. **Text reads "Hello World":** ✓
3. **Gray background visible:** ✓
4. **Text is centered:** ✓
5. **Text is bold:** ✓
6. **Rounded corners visible:** ✓
7. **Comfortable padding:** ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge: Latest version ✓
- Firefox: Latest version ✓
- Safari: Latest version ✓
- iOS Safari: Test on device ✓
- Android Chrome: Test on device ✓

### Responsive Testing

Test at different viewport widths:

- Mobile (375px): Readable and styled ✓
- Tablet (768px): Proper display ✓
- Desktop (1440px): Correct appearance ✓

### Developer Testing

Check technical implementation:

- Console: No JavaScript errors ✓
- Network: JS and CSS files load ✓
- Elements: Correct DOM structure ✓
- Styles: CSS rules applied ✓

---

## Learning Exercises

### Exercise 1: Basic Modification

**Task:** Change "Hello World" to your name.

**Steps:**

1. Open `helloworld.js`
2. Find `greeting.textContent = 'Hello World';`
3. Change to `greeting.textContent = 'Hello [Your Name]';`
4. Save and test

**Expected result:** Block displays your name instead of "Hello World"

### Exercise 2: Style Customization

**Task:** Change the background color to blue.

**Steps:**

1. Open `helloworld.css`
2. Find `background-color: #f0f0f0;`
3. Change to `background-color: #e3f2fd;`
4. Find `color: #333;`
5. Change to `color: #1565c0;`
6. Save and test

**Expected result:** Blue background with blue text

### Exercise 3: Use Content

**Task:** Make the block display content from the markdown table.

**Steps:**

1. Implement the code from Technique 1 above
2. Create markdown with content:

   | HelloWorld |
   |------------|
   | Custom message here! |

3. Test and verify custom message displays

**Expected result:** Block shows your custom message

### Exercise 4: Add Variation

**Task:** Create a "large" variation with bigger text.

**Steps:**

1. Add CSS for `.helloworld.large` class
2. Test with: | HelloWorld (large) |
3. Verify larger font size and padding

**Expected result:** Bigger version of the block

### Exercise 5: Create New Block

**Task:** Use Hello World as a template to create a new block.

**Steps:**

1. Copy helloworld directory
2. Rename to your block name (e.g., "greeting")
3. Update all references from "helloworld" to "greeting"
4. Modify functionality as desired
5. Create test content and verify

**Expected result:** New working block based on Hello World template

---

## Related Documentation

**For developers:**

- [README.md](./README.md) - Complete technical documentation
- [test.html](./test.html) - Browser-based testing file
- [Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)
- [EDS Fundamentals Guide](../../docs/for-ai/eds.md)

**For learning:**

- [Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)
- [Getting Started Guide](../../docs/for-ai/getting-started-guide.md)
- [Content Driven Development](../../docs/for-ai/implementation/design-philosophy-guide.md)

---

## Version History

- **v1.0** (Current) - Initial Hello World implementation
  - Minimal decoration function
  - Basic CSS styling
  - Complete documentation
  - Browser-based testing

---

## Additional Resources

**Code examples:**

- [JavaScript file](./helloworld.js) - 6 lines of code
- [CSS file](./helloworld.css) - 9 style declarations
- [Test file](./test.html) - Browser-based validation

**Community:**

- Share your variations and improvements
- Help others learning EDS development
- Contribute documentation enhancements

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, New Developers, EDS Learners
**Difficulty Level:** Beginner (Getting Started)
