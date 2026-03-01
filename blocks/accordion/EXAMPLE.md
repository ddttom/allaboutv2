---
title: "Accordion Block - Usage Examples"
description: "Usage examples for the accordion EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Accordion Block - Usage Examples

This document shows how to use the accordion block in Google Docs to create collapsible content sections. Perfect for FAQs, documentation, step-by-step guides, and any content that benefits from progressive disclosure.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)
- [Accessibility Features](#accessibility-features)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create a simple accordion in Google Docs:

| Accordion |
|-----------|
| What is Edge Delivery Services? |
| Edge Delivery Services (EDS) is a composable platform that enables highly performant websites by combining document-based content authoring with developer flexibility. |
| How do I get started? |
| Begin by exploring our comprehensive documentation and tutorials. You can start creating content using familiar tools like Google Docs. |
| Where can I find support? |
| Join our community forums, check the documentation, or contact our support team for assistance. |

**Result:** Three collapsible sections that expand/collapse when clicked. Only one section open at a time provides a clean, focused reading experience.

---

## Basic Usage

### Minimal Example

The simplest accordion with one item:

| Accordion |
|-----------|
| Question goes here |
| Answer text appears when expanded |

**Output:** A single collapsible section with question as label and answer as expandable content.

### Standard Example

Multiple accordion items:

| Accordion |
|-----------|
| First Question |
| Detailed answer to the first question with all necessary information. |
| Second Question |
| Another detailed response providing helpful context and guidance. |
| Third Question |
| Additional information addressing this common inquiry. |

**Output:** Three accordion items, each independently collapsible.

---

## Common Patterns

### Pattern 1: FAQ Section

Perfect for frequently asked questions:

| Accordion |
|-----------|
| What browsers are supported? |
| Modern browsers including Chrome, Firefox, Safari, and Edge (last 2 versions) are fully supported. Internet Explorer 11 is not supported. |
| Can I customize the styling? |
| Yes! The accordion uses CSS variables for colors and spacing. Override these in your project's CSS file to match your brand. |
| Is the accordion accessible? |
| Absolutely. We use native HTML5 details/summary elements which are fully accessible by default, with keyboard navigation and screen reader support. |
| How do I add images to accordion items? |
| Include images in either the label or body using standard markdown image syntax: ![alt text](image-url) |
| What happens on mobile devices? |
| The accordion works identically on mobile, providing an excellent touch experience with clear tap targets and smooth animations. |

**Best for:** Help pages, support documentation, product FAQs

### Pattern 2: Step-by-Step Instructions

Guide users through a process:

| Accordion |
|-----------|
| Step 1: Create Your Document |
| Open Google Docs and create a new document. Add your content using simple markdown tables with the Accordion block name in the first row. |
| Step 2: Format Your Content |
| Each row of the table becomes an accordion item. The first cell is the question/label, the second cell is the answer/content. |
| Step 3: Preview and Publish |
| Save your document and preview it on your staging site. Once satisfied, publish to production. |
| Step 4: Test Functionality |
| Click through each accordion item to ensure proper expansion and collapse behavior. Test on mobile devices. |

**Best for:** Onboarding guides, tutorials, process documentation

### Pattern 3: Product Features

Expandable feature descriptions:

| Accordion |
|-----------|
| Lightning Fast Performance |
| Built on edge computing infrastructure, your content loads in milliseconds. Optimized delivery ensures exceptional user experience across all devices and network conditions. |
| Easy Content Authoring |
| Content creators use familiar tools like Google Docs. No technical knowledge required. Write in markdown, publish with one click. |
| Global Scale & Reliability |
| Deployed to hundreds of edge locations worldwide for unlimited scalability. 99.99% uptime guarantee backed by enterprise-grade infrastructure. |
| Developer Friendly |
| Modern JavaScript, vanilla ES6 modules, extensive APIs. Build custom blocks, integrate with any service, maintain full control. |

**Best for:** Landing pages, product pages, feature comparisons

### Pattern 4: Documentation Sections

Organize technical documentation:

| Accordion |
|-----------|
| Installation |
| To install the required dependencies, run: npm install. Ensure you have Node.js version 18 or higher installed on your system. |
| Configuration |
| Create a config directory in your project root. Add environment-specific configuration files following the provided templates. |
| Development Workflow |
| Start the development server with npm run dev. Make changes to blocks in the /blocks directory. Hot reload is enabled by default. |
| Deployment |
| Build for production with npm run build. Deploy the dist directory to your hosting provider. Configure CDN settings as needed. |

**Best for:** API documentation, developer guides, technical specs

### Pattern 5: Rich Content Accordion

Accordion items with formatted content:

| Accordion |
|-----------|
| Understanding EDS Architecture |
| Edge Delivery Services follows a composable architecture with these key components: Content Layer (Google Docs, SharePoint), Edge Layer (CDN, Fastly), and Rendering Layer (client-side JavaScript blocks). This separation enables optimal performance and flexibility. |
| Block Development Best Practices |
| When creating custom blocks, follow these principles: Keep code DRY and modular. Use semantic HTML. Implement proper error handling. Test across browsers and devices. Document thoroughly. |
| Performance Optimization |
| Achieve perfect Lighthouse scores by implementing lazy loading, optimizing images, minimizing JavaScript, using CSS variables efficiently, and following the E-L-D (Eager-Lazy-Delayed) loading pattern. |

**Best for:** Educational content, blog posts, knowledge bases

---

## Content Requirements

### Label (Question/Heading) Requirements

**Recommended:**

- Length: 3-12 words
- Format: Plain text or simple formatting
- Style: Clear, descriptive, question-based or topic-based
- Structure: Use consistent capitalization

**Why this matters:**

- Labels are always visible and guide users
- They should be scannable at a glance
- Clear labels improve accessibility
- Consistent formatting looks professional

**Label best practices:**

1. Start with strong keywords
2. Use questions for FAQs (What, How, Why)
3. Use topics for documentation (Installation, Setup)
4. Keep concise but descriptive
5. Avoid unnecessary words

### Body (Answer/Content) Requirements

**Recommended:**

- Length: 1-5 sentences (50-300 characters)
- Format: Paragraphs, lists, or formatted text
- Structure: Can include links, bold, italic
- Images: Supported but use sparingly

**Why this matters:**

- Body content is hidden until expanded
- Users expect concise, relevant answers
- Longer content should be in regular sections
- Progressive disclosure works best with brief content

**Body content tips:**

1. Answer the question directly
2. Front-load important information
3. Use formatting for readability
4. Include links to detailed documentation
5. Keep paragraphs short

### Accessibility Requirements

**Always provide:**

- Descriptive labels that make sense out of context
- Clear, concise body content
- Sufficient color contrast (handled by CSS)
- Logical reading order
- Keyboard-accessible controls (native HTML)

---

## Styling Guidelines

### Visual Appearance

**Accordion Item:**

- 1px border using `--dark-color` CSS variable
- 16px vertical spacing between items
- Smooth expand/collapse animation
- Animated chevron indicator

**Label (Summary):**

- Padding: 0 16px (with 48px right padding for icon)
- Background: Transparent (default)
- Background: `--light-color` (when open)
- Background: `--dark-color` (on hover/focus)
- Cursor: pointer
- Animated chevron rotates 180° when open

**Body Content:**

- Padding: 0 16px
- Border-top: 1px solid `--dark-color` (when open)
- Background: `--background-color` (when open)
- Overflow: visible
- Smooth height transition

### Interactive States

**Closed State:**

- Border around item
- Chevron points down (↓)
- Content hidden
- Label clickable

**Open State:**

- Border around item
- Chevron points up (↑)
- Content visible with border-top
- Background color applied

**Hover State:**

- Dark background color
- Visual feedback on mouse over
- Applies to label only
- Smooth transition (0.2s)

**Focus State:**

- Same as hover (for keyboard navigation)
- Clear focus indicator
- Accessible tab order
- Native browser outline

### CSS Variables Used

The accordion uses these CSS variables (define in your theme):

`CSS Variable Configuration`
`:root {`
`--dark-color: #333;         /* Borders, hover background */`
`--light-color: #f5f5f5;     /* Open state background */`
`--background-color: #fff;   /* Body content background */`
`}`

---

## Best Practices

### Content Strategy

**1. Use accordion for the right content**

- FAQs and help documentation ✓
- Step-by-step instructions ✓
- Optional/supplementary information ✓
- Content users can skip ✓
- Long lists of related items ✓

**2. Avoid accordion for:**

- Critical information users must see ✗
- Very short content (doesn't need hiding) ✗
- Primary navigation ✗
- Complex interactive content ✗
- Content better suited to tabs ✗

**3. Structure your accordion items**

- Order by importance (most common first)
- Group related items together
- Limit to 5-10 items per accordion
- Use multiple accordions for different topics
- Consider search functionality for many items

**4. Write effective labels**

- Use question format for FAQs
- Use topic format for documentation
- Front-load keywords for scanning
- Keep under 10 words when possible
- Be specific and descriptive

### Performance Optimization

**Native HTML Benefits:**

- No JavaScript required for basic functionality
- Browser-optimized expand/collapse
- Hardware-accelerated CSS transitions
- Minimal memory footprint
- Excellent performance on mobile

**CSS Best Practices:**

- Uses efficient CSS Grid and Flexbox
- Smooth transitions (0.2s duration)
- No layout thrashing
- Proper will-change hints
- Optimized for 60fps animations

### Accessibility First

**Native details/summary advantages:**

- WAI-ARIA compliant by default
- Keyboard accessible (Enter/Space to toggle)
- Screen reader support built-in
- Focus management automatic
- Semantic HTML structure

**Additional accessibility:**

- Clear focus indicators on keyboard navigation
- Sufficient color contrast ratios
- No motion for users with motion preferences
- Works without CSS or JavaScript
- Progressive enhancement approach

### When NOT to Use Accordion

**Avoid accordion for:**

- **Critical information** - Users might not expand items and miss important content
- **Short content** - If everything fits on screen comfortably, don't hide it
- **Navigation** - Use proper nav elements instead
- **Forms** - Breaking forms into accordion steps confuses users
- **Images galleries** - Better suited to lightbox/modal patterns

**Better alternatives:**

- **Tabs block** - For mutually exclusive content sections
- **Modal block** - For focused overlays and dialogs
- **Columns block** - For side-by-side content
- **Regular sections** - For content that should always be visible

---

## Accessibility Features

### Keyboard Navigation

**Built-in keyboard support (native HTML):**

- **Tab** - Navigate between accordion items
- **Shift + Tab** - Navigate backwards
- **Enter** - Toggle accordion item open/closed
- **Space** - Toggle accordion item open/closed

**No custom JavaScript required** - Native `<details>` element handles all keyboard interaction.

### Screen Reader Support

**Semantic HTML structure:**

- `<details>` element announces as "disclosure widget" or "expandable section"
- `<summary>` element announces as button with "collapsed" or "expanded" state
- Content revealed when expanded
- Natural reading order maintained

**ARIA attributes:**

- No ARIA needed - native HTML semantics provide full accessibility
- Browser handles state announcements
- Focus management automatic

### Motion and Animation

**Respects user preferences:**

- Smooth transitions for visual users
- Can be disabled via CSS `prefers-reduced-motion`
- No essential information conveyed through motion
- Animations enhance but aren't required

`Reduce Motion Support`
`@media (prefers-reduced-motion: reduce) {`
`.accordion details summary {`
`transition: none;`
`}`
`.accordion details summary::after {`
`transition: none;`
`}`
`}`

### Color Contrast

**Meets WCAG AA standards:**

- Border colors provide sufficient contrast
- Hover/focus states clearly visible
- Text remains readable in all states
- No information conveyed by color alone

---

## Troubleshooting

### Issue: Accordion items not collapsing

**Problem:** Clicking on labels doesn't expand/collapse content.

**Cause:** JavaScript or CSS conflict, or improper HTML structure.

**Solutions:**

1. **Verify HTML structure in DevTools:**
   - Each item should be `<details class="accordion-item">`
   - Label should be `<summary class="accordion-item-label">`
   - Body should be `<div class="accordion-item-body">`

2. **Check for CSS conflicts:**
   - Inspect in DevTools
   - Look for `display: none !important` overrides
   - Verify no `pointer-events: none` on summary

3. **Test in clean environment:**
   - Open browser's private/incognito mode
   - Disable browser extensions
   - Check if works in different browser

### Issue: Styling not applied

**Problem:** Accordion has no borders, colors, or styling.

**Cause:** CSS variables not defined or CSS file not loaded.

**Solutions:**

1. **Define CSS variables in your theme:**
   `CSS Variable Definitions`
   `:root {`
   `--dark-color: #333333;`
   `--light-color: #f5f5f5;`
   `--background-color: #ffffff;`
   `}`

2. **Verify CSS file loaded:**
   - Check Network tab in DevTools
   - Look for `/blocks/accordion/accordion.css`
   - Ensure no 404 errors

3. **Override styles directly if needed:**
   `.accordion details {`
   `border: 1px solid #333;`
   `}`

### Issue: Multiple accordions interfering

**Problem:** Opening one accordion closes another.

**Cause:** This is actually expected behavior for `<details>` elements with same `name` attribute. Our implementation doesn't use `name`, so items are independent.

**Solutions:**

1. **Verify no `name` attribute:**
   - Inspect details elements
   - Should have no `name="..."` attribute
   - Each item should open/close independently

2. **If you WANT exclusive behavior:**
   Add custom JavaScript to make only one item open at a time

3. **Separate accordion blocks:**
   Create separate accordion blocks for unrelated content

### Issue: Content clipping or overflow

**Problem:** Long content in accordion body is cut off or overflows.

**Cause:** CSS conflicts with overflow or height properties.

**Solutions:**

1. **Check overflow CSS:**
   `.accordion details .accordion-item-body {`
   `overflow: visible; /* Should be visible, not hidden */`
   `}`

2. **Remove height restrictions:**
   - No fixed heights should be applied
   - Content should expand naturally
   - Check for parent containers with height limits

3. **Test with varying content lengths:**
   - Add very long content to test
   - Resize window to test responsive behavior
   - Check on mobile devices

### Issue: Icon/chevron not displaying

**Problem:** No arrow/chevron indicator next to labels.

**Cause:** CSS not applied or browser doesn't support ::after pseudo-element.

**Solutions:**

1. **Verify CSS pseudo-element:**
   - Inspect summary element in DevTools
   - Look for `::after` pseudo-element
   - Should have border creating chevron shape

2. **Check browser support:**
   - Test in modern browser (Chrome, Firefox, Safari)
   - IE11 may have issues

3. **Override chevron styling:**
   `.accordion details summary::after {`
   `content: "";`
   `display: block;`
   `width: 9px;`
   `height: 9px;`
   `border: 2px solid currentColor;`
   `border-width: 2px 2px 0 0;`
   `}`

### Issue: Accordion not responsive

**Problem:** Layout breaks on mobile or doesn't adapt to small screens.

**Cause:** Container width issues or fixed widths in CSS.

**Solutions:**

1. **Ensure no fixed widths:**
   - Accordion should be 100% width
   - No min-width restrictions
   - Parent containers should be flexible

2. **Test at various widths:**
   - Resize browser window
   - Use DevTools device toolbar
   - Test on actual mobile devices

3. **Check label overflow:**
   `.accordion details summary {`
   `overflow: auto; /* Allows text to wrap */`
   `word-wrap: break-word;`
   `}`

---

## Advanced Techniques

### Custom Styling Per Accordion

Add variation classes for different styles:

| Accordion (featured) |
|---------------------|
| Important Question |
| Priority information that stands out |

Then style with CSS:

`Featured Accordion Variation`
`.accordion.featured details {`
`border: 2px solid #0066cc;`
`border-left-width: 5px;`
`}`

### Nested Accordions

Accordions within accordions for hierarchical content:

| Accordion |
|-----------|
| Main Category |
| Content with another accordion nested inside: [nested accordion table here] |

**Note:** Use sparingly - deep nesting can confuse users.

### Accordion with Images

Include images in labels or bodies:

| Accordion |
|-----------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) Feature Name |
| Detailed description of this feature with comprehensive information. |

**Result:** Image appears in the label, making items more visually distinctive.

### Mixed Content Formatting

Use rich formatting in accordion bodies:

| Accordion |
|-----------|
| How do I format content? |
| You can use **bold**, *italic*, [links](https://example.com), and even code snippets. Lists work too: 1. First item 2. Second item |

### Pre-Expanded Accordion Items

Add the `open` attribute via custom JavaScript if you need items expanded by default:

`Pre-expanded First Item`
`document.querySelector('.accordion details').setAttribute('open', '');`

### Linking to Specific Accordion Items

Add IDs to accordion items for direct linking:

`Add ID to first item`
`const firstAccordion = document.querySelector('.accordion details');`
`firstAccordion.id = 'faq-pricing';`

Then link: `https://example.com/page#faq-pricing`

---

## Testing Your Accordion

### Visual Testing Checklist

After creating accordion in Google Docs:

1. **Preview on staging site:**
   - All items appear ✓
   - Labels are clickable ✓
   - Content expands/collapses ✓
   - Styling is correct ✓

2. **Interaction testing:**
   - Click each item to expand ✓
   - Click again to collapse ✓
   - Multiple items can be open ✓
   - Smooth animations ✓

3. **Keyboard testing:**
   - Tab to navigate between items ✓
   - Enter/Space toggles items ✓
   - Focus indicator visible ✓
   - Logical tab order ✓

4. **Mobile testing:**
   - Tap targets large enough ✓
   - Text readable at mobile size ✓
   - No horizontal scrolling ✓
   - Animations smooth ✓

5. **Accessibility testing:**
   - Screen reader announces correctly ✓
   - State changes announced ✓
   - Works without CSS ✓
   - Works without JavaScript ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions) ✓
- Firefox (last 2 versions) ✓
- Safari (last 2 versions) ✓
- iOS Safari (last 2 versions) ✓
- Android Chrome (last 2 versions) ✓

**Not fully supported:** Internet Explorer 11 (degraded experience)

---

## Performance Metrics

### Expected Performance

**Rendering metrics:**

- JavaScript execution: < 5ms (minimal decoration)
- CSS parsing: < 2ms
- DOM transformation: < 10ms per item
- Total render: < 20ms for typical accordion

**Animation performance:**

- Transitions: Hardware-accelerated CSS
- Frame rate: 60fps on modern devices
- No layout thrashing
- Smooth on mobile devices

### Lighthouse Scores

With properly implemented accordion:

- **Performance:** 95-100 ✓
- **Accessibility:** 100 ✓
- **Best Practices:** 100 ✓
- **SEO:** 100 ✓

### Optimization Tips

**1. Content efficiency:**

- Limit to 10-15 items per accordion
- Keep body content concise
- Avoid large images in accordion items
- Use lazy loading for media

**2. CSS optimization:**

- Use CSS variables for theming
- Avoid complex selectors
- Minimize animation complexity
- Use hardware-accelerated properties

**3. Accessibility optimization:**

- Use semantic HTML (done by default)
- Ensure proper heading hierarchy
- Test with keyboard only
- Verify screen reader compatibility

---

## Integration Examples

### Accordion After Hero Section

Combine hero and accordion for effective content hierarchy:

| Hero |
|------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Frequently Asked Questions |
| Find answers to common questions |

| Accordion |
|-----------|
| What is your pricing? |
| Pricing starts at $29/month for basic plans. Enterprise pricing available. |
| How do I get started? |
| Sign up for a free trial and explore our onboarding tutorials. |

### Multiple Accordion Sections

Organize FAQs into categories:

### General Questions

| Accordion |
|-----------|
| [General FAQ items...] |

### Technical Questions

| Accordion |
|-----------|
| [Technical FAQ items...] |

### Billing Questions

| Accordion |
|-----------|
| [Billing FAQ items...] |

### Accordion with Call-to-Action

Follow accordion with CTA:

| Accordion |
|-----------|
| [FAQ items...] |

### Still have questions?

[Contact our support team](https://example.com/contact) for personalized assistance.

---

## Related Blocks

**Similar functionality:**

- **Tabs** - Mutually exclusive content sections
- **Modal** - Overlay dialogs for focused content
- **Cards** - Grid layout for scannable content

**Complementary blocks:**

- **Hero** - Prominent introduction before accordion
- **Quote** - Testimonials or highlights between sections
- **Text** - Regular content sections

---

## Version History

- **v1.0** (Current) - Initial accordion implementation
  - Native HTML5 details/summary elements
  - Animated chevron indicator
  - Full keyboard and screen reader support
  - CSS variable theming
  - No JavaScript dependencies

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Accessibility Guide](../../docs/for-ai/guidelines/frontend-guidelines.md)** - Accessibility best practices

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Designers
