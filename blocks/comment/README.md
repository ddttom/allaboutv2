# Comment Block

A special-purpose authoring utility block for adding editorial comments, notes, and annotations to content documents that are visible in the authoring environment but completely hidden from the published website. Perfect for content planning, collaboration notes, and internal documentation.

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

The comment block is an authoring-only utility that allows content authors to embed notes, reminders, and editorial comments directly within document content. These comments are visible in the authoring interface but automatically hidden from the published website through CSS display rules.

**Primary Use Cases:**

- Editorial notes and reminders for content authors
- Collaboration comments between team members
- Content planning and workflow notes
- Temporary placeholders during content development
- Internal documentation not intended for public viewing
- Version notes and change tracking comments

**Block Name:** `comment`

**Location:** `/blocks/comment/`

**Files:**

- `comment.js` - Empty (no JavaScript decoration required)
- `comment.css` - Single rule hiding block from display
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

**Key Characteristic:** This block requires no JavaScript processing. The CSS rule `display: none;` ensures comments never render in the browser, regardless of the content.

---

## Features

### Core Capabilities

1. **Authoring Visibility**
   - Visible in content authoring environment
   - Helps authors track notes and reminders
   - Supports collaboration between content teams
   - Maintains context during content creation

2. **Production Invisibility**
   - Completely hidden from published website
   - No DOM rendering in browser
   - Zero performance impact
   - No accessibility concerns
   - Safe for sensitive internal notes

3. **Content Flexibility**
   - Accepts any markdown content
   - Supports text, links, lists, tables
   - No content restrictions
   - Simple block syntax
   - Easy to add and remove

4. **Zero Processing**
   - No JavaScript execution
   - No DOM manipulation
   - No network requests
   - No event listeners
   - Minimal CSS footprint

5. **Universal Compatibility**
   - Works with all EDS content types
   - Compatible with all other blocks
   - No conflicts or side effects
   - Consistent behavior across environments

---

## Technical Architecture

### CSS Implementation

The comment block uses a single, simple CSS rule to hide all content:

`CSS Display Rule`
`.comment {`
`display: none;`
`}`

**Why This Works:**

- `display: none` removes element from render tree
- No space allocated in layout
- No visibility to screen readers
- No user interaction possible
- Optimal browser performance

### JavaScript Implementation

The comment block requires no JavaScript decoration:

`JavaScript File`
`// Empty file - no decoration needed`
`// CSS handles all functionality`

**Why No JavaScript:**

- CSS display rule is sufficient
- No DOM manipulation needed
- No event handling required
- Reduces code complexity
- Improves reliability

### Block Processing Flow

1. **Authoring Environment:**
   - Author creates Comment block in markdown
   - Content visible in authoring UI
   - Can include any markdown elements
   - Used for notes and reminders

2. **Build Process:**
   - EDS transforms markdown to HTML
   - Block receives `.comment` class
   - Content wrapped in block structure
   - No JavaScript decoration occurs

3. **Browser Rendering:**
   - CSS rule `display: none` applied
   - Element removed from render tree
   - No visual output
   - No accessibility impact

### DOM Structure

When a comment block is processed (but not rendered), it has this structure:

`HTML Structure`
`<div class="comment">`
`<div>`
`<!-- Author's comment content -->`
`<!-- Never visible in browser -->`
`</div>`
`</div>`

---

## Usage

### Basic Comment

Add editorial notes visible only to content authors:

**Markdown:**

`Basic Comment Block`
`| Comment |`
`| --- |`
`| TODO: Update this section with Q4 data |`

**Result:** Content authors see the note in authoring environment, but it never appears on the published website.

### Multi-Line Notes

Use comments for longer editorial content:

**Markdown:**

`Multi-Line Comment`
`| Comment |`
`| --- |`
`| **Content Review Notes** |`
`| - Check all dates before publishing |`
`| - Update hero image to match brand guidelines |`
`| - Verify all links are working |`
`| - Legal review completed: 2025-11-15 |`

### Collaboration Notes

Leave notes for other team members:

**Markdown:**

`Collaboration Comment`
`| Comment |`
`| --- |`
`| @Sarah: Please review technical accuracy of code examples |`
`| @Marketing: Approve messaging before go-live |`

### Workflow Placeholders

Mark sections for future development:

**Markdown:**

`Workflow Comment`
`| Comment |`
`| --- |`
`| PLACEHOLDER: Add customer testimonials section here |`
`| Waiting on: Marketing team testimonial collection |`
`| Target date: 2025-12-01 |`

---

## Content Structure

### Block Format

The comment block uses standard EDS table syntax:

**Required Elements:**

- Table with single column
- Header cell: `Comment`
- Body cells: Any content

**Markdown Structure:**

`Standard Format`
`| Comment |`
`| --- |`
`| Your comment content here |`

### Content Guidelines

**What to Include:**

- Editorial notes and reminders
- Collaboration instructions
- Workflow status updates
- Internal links and references
- Change tracking notes
- Review checklists

**What to Avoid:**

- Sensitive security information (use private channels)
- Personal data (even hidden, it's in source)
- Large binary content (markdown only)
- Production configuration (use config files)

### Multiple Comments

You can add multiple comment blocks throughout a document:

`Multiple Comments Example`
`| Comment |`
`| --- |`
`| Section 1 notes: Review introduction |`
`
`[Regular content here]`
`
`| Comment |`
`| --- |`
`| Section 2 notes: Update statistics |`

---

## Styling & Customization

### CSS Configuration

The comment block requires only one CSS rule:

`Required CSS`
`.comment {`
`display: none;`
`}`

**Important:** Do NOT modify this rule. Changing `display: none` to any other value will make internal comments visible to website visitors.

### Why No Customization

**Security:** Comments may contain sensitive information not intended for public viewing.

**Performance:** `display: none` is the most efficient way to hide content.

**Reliability:** Simple rule minimizes risk of comments accidentally appearing.

**Consistency:** All comment blocks behave identically across the site.

### Authoring Environment Styling

The authoring environment (not the published site) may apply its own styling to comment blocks for visibility. This is controlled by the authoring tool, not the block CSS.

---

## Responsive Behavior

### All Viewports

The comment block has identical behavior across all screen sizes:

**Desktop:** Hidden via `display: none`
**Tablet:** Hidden via `display: none`
**Mobile:** Hidden via `display: none`

### No Media Queries

The comment block requires no responsive CSS rules:

`CSS (Complete)`
`.comment {`
`display: none;`
`}`

This single rule applies universally across all devices and viewport sizes.

---

## Accessibility

### Screen Reader Impact

**None.** The comment block has zero accessibility impact:

- `display: none` removes element from accessibility tree
- Screen readers do not announce hidden comments
- No ARIA attributes needed
- No keyboard navigation issues
- No focus management required

### Semantic HTML

The comment block has no semantic meaning in the published document:

- Not part of document outline
- Not included in page structure
- Not indexed by assistive technology
- Not discoverable by users

### Best Practices

**Do:**

- Use comments freely for authoring notes
- Include workflow instructions
- Add collaboration reminders

**Don't:**

- Add content intended for screen reader users (use proper content blocks)
- Include accessibility instructions (document separately)
- Rely on comments for user-facing information

---

## Performance

### Impact Analysis

The comment block has minimal performance impact:

**Zero JavaScript:**

- No script execution
- No event listeners
- No DOM manipulation
- No memory allocation

**Minimal CSS:**

- Single CSS rule (8 bytes gzipped)
- No layout calculations
- No paint operations
- No composite layers

**No Network:**

- No external resources
- No font loading
- No image requests
- No API calls

### Core Web Vitals

**LCP (Largest Contentful Paint):** No impact - element not rendered

**FID (First Input Delay):** No impact - no JavaScript execution

**CLS (Cumulative Layout Shift):** No impact - no layout space allocated

**Performance Score:** Comment blocks do not affect Lighthouse performance scores.

### Build Performance

**Author-time:** Comments visible in authoring environment may slightly increase authoring tool memory usage.

**Build-time:** Comments processed normally during markdown-to-HTML transformation.

**Runtime:** Zero performance impact in browser.

---

## Browser Support

### Universal Compatibility

The comment block works in all browsers supporting CSS:

**Modern Browsers:**

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Legacy Browsers:**

- Internet Explorer 6+ (CSS display:none supported since IE 4)
- Any browser with CSS support

### CSS Display Support

The `display: none` property is universally supported:

**Specification:** CSS 1 (1996)
**Support:** All browsers ever released with CSS support
**Polyfill:** Not needed

---

## Troubleshooting

### Comments Visible on Website

**Problem:** Comment block content appears on published website.

**Cause:** CSS rule not loaded or overridden.

**Solution:**

1. Verify `comment.css` is loaded: Check browser DevTools Network tab
2. Check CSS rule exists: Search for `.comment { display: none; }`
3. Check for CSS override: Inspect element for conflicting rules
4. Clear browser cache: Force reload with Ctrl+Shift+R (Cmd+Shift+R on Mac)

**Verify Fix:**

`Browser Console Check`
`const style = getComputedStyle(document.querySelector('.comment'));`
`console.log(style.display); // Should output: "none"`

### Comments Not Visible in Authoring

**Problem:** Comment blocks don't appear in authoring environment.

**Cause:** Authoring tool may not be rendering blocks correctly.

**Solution:**

1. Check authoring tool documentation
2. Verify Comment block syntax is correct
3. Try refreshing authoring interface
4. Contact authoring tool support

**Note:** This is an authoring tool issue, not a block issue.

### Content in Comments Breaking Build

**Problem:** Build process fails with comment block content.

**Cause:** Special characters or markdown syntax causing parser issues.

**Solution:**

1. Escape special characters in comment content
2. Avoid complex nested structures
3. Use plain text for problematic content
4. Test build after adding comments

**Best Practice:** Keep comment content simple to avoid parser edge cases.

---

## Testing

### Manual Testing

**Test Case 1: Basic Visibility**

1. Add comment block to test page
2. Publish page
3. Verify comment not visible in browser
4. Check with DevTools that `.comment { display: none; }` is applied

**Expected:** Comment block has no visual presence.

**Test Case 2: Accessibility**

1. Add comment block to test page
2. Use screen reader (NVDA, JAWS, VoiceOver)
3. Navigate through page content
4. Verify comment not announced

**Expected:** Screen reader skips comment block entirely.

**Test Case 3: Multiple Comments**

1. Add 5-10 comment blocks throughout page
2. Publish page
3. Check page performance (Lighthouse)
4. Verify no performance degradation

**Expected:** Comments have zero performance impact.

### Browser Testing

Test in multiple browsers to verify universal hiding:

**Desktop:**

- Chrome (Windows/Mac)
- Firefox (Windows/Mac)
- Safari (Mac)
- Edge (Windows)

**Mobile:**

- Safari (iOS)
- Chrome (Android)

**Test Script:**

`Browser Console Test`
`// Verify all comment blocks are hidden`
`const comments = document.querySelectorAll('.comment');`
`console.log('Total comments:', comments.length);`
`
`comments.forEach((comment, index) => {`
`  const style = getComputedStyle(comment);`
`  console.log('Comment', index, 'display:', style.display);`
`  if (style.display !== 'none') {`
`    console.error('FAIL: Comment visible!');`
`  }`
`});`

### Automated Testing

**Test File:** `test.html` (included with block)

**Test Coverage:**

- Comment block hidden from view
- CSS rule properly applied
- No JavaScript errors
- No accessibility issues
- No performance impact

**Running Tests:**

1. Open `/blocks/comment/test.html` in browser
2. Open browser DevTools console
3. Verify all tests pass
4. Check for errors or warnings

---

## Dependencies

### Core Dependencies

**Required:**

- EDS core library (`/scripts/aem.js`)
- Standard EDS block decoration system

**CSS Framework:**

- None required
- Single CSS rule
- No variables or mixins

**JavaScript Libraries:**

- None required
- No external dependencies
- No utility libraries

### EDS Platform

**Minimum EDS Version:** Any version supporting block decoration

**Required Features:**

- Block class application (`.comment`)
- CSS loading
- Standard markdown-to-HTML transformation

### Browser APIs

**Required APIs:**

- None (CSS only)

**Optional APIs:**

- None

---

## Future Enhancements

### Potential Improvements

**1. Authoring-Time Validation**

- Warn when sensitive information in comments
- Suggest moving configuration to proper files
- Check for accidental inclusion of production data

**2. Comment Categories**

- Different comment types (TODO, REVIEW, NOTE)
- Color-coding in authoring environment
- Filtering and search in authoring tool

**3. Workflow Integration**

- Link comments to task management systems
- Automatic comment expiration dates
- Comment resolution tracking

**4. Build-Time Processing**

- Extract comments into separate documentation
- Generate author notes report
- Validate comment format and content

**5. Collaboration Features**

- Author attribution
- Comment threading
- Timestamp tracking
- Change history

### Implementation Notes

**Priority:** Low (block serves its purpose effectively as-is)

**Compatibility:** Any enhancements must maintain backward compatibility

**Core Principle:** Keep published website behavior unchanged (always hidden)

### Non-Goals

The following are explicitly NOT planned:

- Making comments visible on published site
- Adding JavaScript decoration
- Conditional display based on user roles
- Client-side comment processing
- Interactive comment features

**Reason:** The comment block's purpose is to remain hidden. Features that compromise this are out of scope.

---

## Version History

**Current Version:** 1.0.0

**Changes:**

- Initial implementation with CSS-only hiding
- Empty JavaScript file (no decoration needed)
- Universal browser compatibility

**Future Versions:** No major changes planned. Block design is intentionally minimal and stable.

---

## Related Documentation

**EDS Documentation:**

- [EDS Fundamentals Guide](/docs/for-ai/eds.md)
- [Block Architecture Standards](/docs/for-ai/implementation/block-architecture-standards.md)
- [Content Driven Development](/docs/for-ai/implementation/design-philosophy-guide.md)

**Testing Documentation:**

- [EDS Testing Guide](/docs/for-ai/testing/EDS-Architecture-and-Testing-Guide.md)
- [Testing Standards](/docs/for-ai/testing/eds-native-testing-standards.md)

**Author Resources:**

- [EXAMPLE.md](EXAMPLE.md) - Author usage guide
- [EDS Authoring Documentation](https://www.aem.live/docs/authoring)

---

## Support

**Issues:** Report block issues in project repository

**Questions:** Contact development team

**Contributions:** Follow project contribution guidelines

**Updates:** Check project changelog for updates
