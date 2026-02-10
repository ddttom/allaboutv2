---
title: "Centreblock - Usage Examples"
description: "Usage examples for the centreblock EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Centreblock - Usage Examples

This document shows how to use the centreblock in Google Docs to create centered content sections with consistent vertical spacing. Perfect for hero sections, feature highlights, call-to-action elements, and standalone announcements.

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

Create a simple centered content section in Google Docs:

| Centreblock |
|-------------|
| Welcome to Our Platform |

**Result:** Centered text with 100px spacing above and below, creating a visually prominent section.

---

## Basic Usage

### Minimal Example

The simplest centreblock with just text:

| Centreblock |
|-------------|
| Your centered content here |

**Output:** Text appears centered horizontally with generous vertical spacing.

### Standard Example

Centreblock with a heading:

| Centreblock |
|-------------|
| ### Our Mission |
| Building better experiences through thoughtful design |

**Output:** Centered heading with centered paragraph below, both with proper vertical spacing.

---

## Common Patterns

### Pattern 1: Hero Headline

Perfect for main page headlines or section titles:

| Centreblock |
|-------------|
| ### Transform Your Business |
| Discover powerful tools that help you work smarter and grow faster |

**Best for:** Landing pages, section headers, marketing messages

### Pattern 2: Feature Highlight

Showcase a key feature or benefit:

| Centreblock |
|-------------|
| ### Lightning Fast Performance |
| Experience load times under 1 second with our edge delivery network |

**Best for:** Product pages, feature sections, benefits listings

### Pattern 3: Call-to-Action

Drive user action with centered CTAs:

| Centreblock |
|-------------|
| ### Ready to Get Started? |
| Join thousands of satisfied customers today |

**Best for:** Conversion sections, signup prompts, action drivers

### Pattern 4: Announcement

Make important announcements stand out:

| Centreblock |
|-------------|
| ### New Feature Launch |
| We're excited to announce our latest innovation |

**Best for:** Product launches, updates, news

### Pattern 5: Quote or Testimonial

Center impactful quotes:

| Centreblock |
|-------------|
| ### "This platform changed how we work" |
| Sarah Johnson, CEO at TechCorp |

**Best for:** Testimonials, quotes, social proof

### Pattern 6: Simple Message

Clean, focused messaging:

| Centreblock |
|-------------|
| Join our newsletter for weekly tips and insights |

**Best for:** Newsletter signups, simple messages, notifications

---

## Content Requirements

### Text Content

**Recommended:**

- Keep content concise (1-3 lines works best)
- Use clear, impactful language
- Include headings for emphasis
- Break up longer text into paragraphs

**Why this matters:**

- Centered text is most effective when brief
- Long paragraphs can be hard to read when centered
- Visual impact comes from simplicity
- Whitespace enhances the centered effect

**Good content examples:**

- "Transform Your Business Today"
- "Experience the difference quality makes"
- "Join 10,000+ happy customers"

**Avoid:**

- Very long paragraphs (hard to read centered)
- Multiple unrelated messages
- Complex layouts (use other blocks)
- Dense technical content

### Heading Levels

**Supported headings:**

- H1 through H6 all work
- H3 gets special styling (inline-block with padding)
- Use proper heading hierarchy
- Don't skip heading levels

**Heading recommendations:**

```
H1: Page title (use sparingly in centreblock)
H2: Major section headings
H3: Feature highlights (best for centreblock)
H4-H6: Subheadings within content
```

### Images

Images can be included in centreblock:

| Centreblock |
|-------------|
| ![](logo.png) |
| ### Welcome to Our Platform |

**Image guidelines:**

- Use appropriate sizes (not too large)
- Provide alt text for accessibility
- Center-aligned images work best
- Consider image dimensions on mobile

### Multiple Elements

You can combine headings, text, and images:

| Centreblock |
|-------------|
| ![](icon.png) |
| ### Feature Name |
| Brief description of the feature |

**Result:** Icon, heading, and text all centered vertically.

---

## Styling Guidelines

### Visual Consistency

**Default appearance:**

- Text horizontally centered
- 100px vertical spacing (top and bottom)
- H3 headings with 0.5rem padding
- Clean, minimal presentation

**Spacing behavior:**

- Generous whitespace creates visual emphasis
- Content feels important and prominent
- Clear separation from surrounding content
- Professional, polished appearance

### Responsive Behavior

**Mobile (< 600px):**

- Text remains centered
- Vertical spacing maintained
- Content reflows naturally
- Consider adding horizontal padding in custom CSS

**Tablet (600px - 1024px):**

- Default styles work well
- Centered layout feels natural
- Good balance of whitespace

**Desktop (> 1024px):**

- Full vertical spacing (100px)
- Consider max-width for very wide screens
- Centered content provides visual focus

**Recommendation:** For mobile optimization, add custom CSS:

`Responsive padding for mobile`
`@media (max-width: 600px) {`
`.centreblock > div {`
`margin: 50px 0;`
`padding: 0 1rem;`
`}`
`}`

---

## Best Practices

### Content Strategy

**1. Keep it concise**

- 1-3 lines of text is ideal
- Short, impactful messages
- Avoid paragraphs longer than 2-3 sentences
- Use whitespace effectively

**2. Use clear hierarchy**

- Lead with a heading when appropriate
- Supporting text should be brief
- Visual hierarchy guides the eye
- Don't mix too many elements

**3. Consider visual weight**

- Centered content draws attention
- Use sparingly for impact
- Don't overuse on a single page
- Balance with other layout patterns

**4. Think about context**

- What comes before this section?
- What comes after?
- Does centering make sense here?
- Is this the right emphasis level?

### Accessibility First

**1. Use semantic headings**

- Proper heading levels (h1-h6)
- Don't skip levels
- Maintain logical document outline
- Screen readers navigate by headings

**2. Provide alt text**

- All images need descriptive alt text
- Don't use "image" or "picture" in alt text
- Describe the image content and purpose
- Keep alt text concise

**3. Ensure readability**

- Sufficient color contrast (4.5:1 minimum)
- Don't rely on color alone
- Use clear, simple language
- Avoid centering very long text

**4. Test with screen readers**

- Content read in natural order
- Headings announced properly
- No confusing reading flow
- All content accessible

### Performance Optimization

**Content loading:**

- All content loaded upfront
- No JavaScript required
- Pure CSS rendering
- Instant display (no loading states)

**Image optimization:**

- Compress images before upload
- Use appropriate dimensions
- WebP format when possible
- Provide proper alt text

### When NOT to Use Centreblock

**Avoid centreblock for:**

- Long-form content (use normal sections)
- Multiple unrelated messages
- Complex layouts (use columns or grid)
- Content that should be left-aligned

**Better alternatives:**

- **Hero block** - For large hero sections with images
- **Columns** - For side-by-side content
- **Quote block** - For styled testimonials
- **Sections** - For standard left-aligned content

---

## Troubleshooting

### Issue: Content appears left-aligned

**Problem:** Content is not centered horizontally.

**Cause:** CSS not loaded or conflicting styles.

**Solution:**

1. Verify table format in Google Docs is correct
2. Check that first row has "Centreblock" in it
3. Ensure CSS file is loaded on the page
4. Check browser console for errors (F12)

### Issue: No vertical spacing

**Problem:** Content runs into adjacent sections, no space above/below.

**Cause:** Margin collapsing or CSS not applied.

**Solution:**

1. Check CSS is loaded (Network tab in DevTools)
2. Inspect element to verify margin is applied
3. Look for parent containers with overflow: hidden
4. Test in different browser

### Issue: Too much spacing on mobile

**Problem:** 100px margins feel excessive on small screens.

**Cause:** Default desktop spacing not optimized for mobile.

**Solution - Add custom CSS:**

`Reduce spacing on mobile`
`@media (max-width: 600px) {`
`.centreblock > div {`
`margin: 50px 0;`
`}`
`}`

### Issue: Long text hard to read

**Problem:** Centered paragraphs difficult to read.

**Cause:** Long lines of centered text strain eye tracking.

**Solutions:**

1. **Shorten content** (best solution) - Keep to 1-3 lines
2. **Use different block** - Consider left-aligned section
3. **Add max-width** (custom CSS):

`Limit content width for readability`
`.centreblock > div {`
`max-width: 600px;`
`margin: 100px auto;`
`}`

### Issue: H3 doesn't look different

**Problem:** H3 heading appears the same as paragraph text.

**Cause:** Heading styles not defined in global CSS.

**Solution:**

- Check site-wide heading styles
- H3 gets inline-block and padding from centreblock CSS
- Additional styling comes from global styles.css
- Ensure heading styles are defined

### Issue: Content overflows on mobile

**Problem:** Horizontal scrolling on small screens.

**Cause:** Fixed-width content or no horizontal padding.

**Solution - Add horizontal padding:**

`Prevent horizontal overflow`
`@media (max-width: 600px) {`
`.centreblock > div {`
`padding: 0 1rem;`
`}`
`}`

---

## Advanced Techniques

### Centreblock with Icon

Include an icon or small image above text:

| Centreblock |
|-------------|
| ![](check-icon.png) |
| ### Verified Quality |
| Every product is tested and certified |

**Result:** Icon centered above heading and description.

### Centreblock with Background

Add background via custom CSS:

`Gradient background`
`.centreblock > div {`
`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
`color: white;`
`padding: 3rem 1rem;`
`border-radius: 8px;`
`}`

### Centreblock with Border

Create a boxed centered section:

`Bordered centreblock`
`.centreblock > div {`
`border: 2px solid #e0e0e0;`
`padding: 2rem;`
`border-radius: 8px;`
`box-shadow: 0 4px 12px rgba(0,0,0,0.1);`
`}`

### Multiple Centreblocks

Use multiple centreblocks for a vertical rhythm:

| Centreblock |
|-------------|
| ### Feature One |
| First feature description |

Regular paragraph content here...

| Centreblock |
|-------------|
| ### Feature Two |
| Second feature description |

More regular content...

**Result:** Alternating centered and regular sections create visual interest.

### Combining with Other Blocks

Create rich page layouts:

### Introduction

Regular left-aligned intro text...

| Centreblock |
|-------------|
| ### Our Mission |
| Building better experiences |

| Columns (3) |
|-------------|
| Feature 1 | Feature 2 | Feature 3 |

| Centreblock |
|-------------|
| ### Ready to Start? |
| Get started today |

**Result:** Centreblock provides visual breaks and emphasis between sections.

### Custom Heading Styles

Style all centreblock headings consistently:

`Custom heading appearance`
`.centreblock h3 {`
`font-size: 2rem;`
`font-weight: 700;`
`color: #667eea;`
`text-transform: uppercase;`
`letter-spacing: 0.1em;`
`}`

### Animated Entrance

Add subtle fade-in animation:

`Fade in on scroll`
`.centreblock {`
`opacity: 0;`
`animation: fadeIn 0.6s ease forwards;`
`}`
``
`@keyframes fadeIn {`
`to { opacity: 1; }`
`}`

---

## Testing Your Centreblock

### Visual Testing Checklist

After creating centreblock in Google Docs:

1. **Preview on staging site:**
   - Content appears centered ✓
   - 100px spacing above and below ✓
   - H3 headings styled properly ✓
   - Overall appearance looks clean ✓

2. **Responsive testing:**
   - Check mobile view (< 600px) ✓
   - Verify tablet view (600-1024px) ✓
   - Confirm desktop view (> 1024px) ✓
   - Test horizontal padding on mobile ✓

3. **Content testing:**
   - Text is readable ✓
   - Headings display correctly ✓
   - Images load and center properly ✓
   - No overflow issues ✓

4. **Browser testing:**
   - Chrome/Edge works ✓
   - Firefox works ✓
   - Safari works ✓
   - Mobile browsers work ✓

5. **Accessibility testing:**
   - Screen reader reads content ✓
   - Heading levels are correct ✓
   - Alt text provided for images ✓
   - Color contrast sufficient ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari
- Android Chrome

**Fully supported:** All modern browsers (including IE11)

---

## Content Examples

### Example 1: Simple Headline

| Centreblock |
|-------------|
| ### Transform Your Business |

### Example 2: Headline with Subtext

| Centreblock |
|-------------|
| ### Experience the Difference |
| Join thousands of satisfied customers who trust our platform |

### Example 3: Feature Highlight

| Centreblock |
|-------------|
| ![](speed-icon.png) |
| ### Lightning Fast |
| Load times under 1 second guaranteed |

### Example 4: Call-to-Action

| Centreblock |
|-------------|
| ### Ready to Get Started? |
| Sign up today and get 30 days free |

### Example 5: Testimonial Quote

| Centreblock |
|-------------|
| ### "Best platform we've ever used" |
| - Alex Martinez, Product Manager |

### Example 6: Simple Announcement

| Centreblock |
|-------------|
| New features launching next week |

---

## Integration Examples

### Centreblock After Hero

| Hero |
|------|
| ![](hero-image.jpg) |
| Welcome to Our Platform |

| Centreblock |
|-------------|
| ### Why Choose Us? |

Regular content sections follow...

### Centreblock as Section Divider

Regular paragraph content...

| Centreblock |
|-------------|
| ### Our Approach |

More regular content...

### Multiple Centreblocks in Sequence

| Centreblock |
|-------------|
| ### Step 1: Sign Up |
| Create your free account in minutes |

| Centreblock |
|-------------|
| ### Step 2: Customize |
| Tailor the platform to your needs |

| Centreblock |
|-------------|
| ### Step 3: Launch |
| Go live with confidence |

---

## Related Blocks

**Similar functionality:**

- **Hero** - Large hero sections with images
- **Quote** - Styled quote blocks with attribution
- **Banner** - Full-width announcement banners

**Complementary blocks:**

- **Columns** - Multi-column layouts
- **Cards** - Grid-based content organization
- **Accordion** - Collapsible content sections

---

## Version History

- **v1.0** (Current) - Initial centreblock implementation
  - Centered text layout
  - 100px vertical spacing
  - H3 inline-block styling
  - Pure CSS-based rendering

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Designers
