# Return to Top Block - Usage Examples

This document shows how to use the returntotop block in Google Docs to add a scroll-to-top button on long pages. Perfect for long-form articles, documentation, blog posts, and multi-section pages where users scroll significantly.

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

Create a simple return-to-top button in Google Docs:

| ReturnToTop |
|-------------|
| ↑ Top       |

**Result:** A blue button labeled "↑ Top" that appears in the bottom-left corner after scrolling down 100 pixels. Clicking it smoothly scrolls the page back to the top.

---

## Basic Usage

### Minimal Example

The simplest returntotop block with text label:

| ReturnToTop |
|-------------|
| Back to Top |

**Output:** A button labeled "Back to Top" that appears after scrolling.

### Simple Arrow

Use a single arrow symbol for minimal design:

| ReturnToTop |
|-------------|
| ↑           |

**Output:** A button with just an up arrow symbol.

### Icon + Text

Combine icon with descriptive text:

| ReturnToTop |
|-------------|
| ↑ Top       |

**Output:** A button with arrow and "Top" label (most common pattern).

---

## Common Patterns

### Pattern 1: Text-Only Button

Descriptive text label for clarity:

| ReturnToTop |
|-------------|
| Back to Top |

**Best for:** Pages where icon meaning might be unclear, international audiences who prefer text labels.

### Pattern 2: Arrow Symbol

Simple arrow for minimal design:

| ReturnToTop |
|-------------|
| ↑           |

**Best for:** Clean, minimalist design, pages with limited space, when button should be subtle.

### Pattern 3: Caret Symbol

Alternative arrow using caret character:

| ReturnToTop |
|-------------|
| ^ Top       |

**Best for:** ASCII-friendly content, text-based designs, compatibility with all fonts.

### Pattern 4: Emoji Icon

Use emoji for modern, colorful look:

| ReturnToTop |
|-------------|
| ⬆️ Top       |

**Best for:** Casual or playful content, modern web apps, mobile-first designs.

### Pattern 5: Compact Label

Very short label for space-saving:

| ReturnToTop |
|-------------|
| ↑           |

**Best for:** Mobile-optimized pages, minimal UI design, floating action buttons.

---

## Content Requirements

### Button Text Guidelines

**Recommended text:**

- Length: 1-3 words maximum
- Clear and descriptive
- Universal symbols (↑, ⬆️, ^)
- Action words ("Top", "Back")

**Why this matters:**

- Button text becomes the visible label
- Displays in fixed position (limited space)
- Should be immediately recognizable
- Works across all screen sizes

**Good button labels:**

- "↑ Top" (icon + text)
- "Back to Top" (descriptive)
- "↑" (minimal)
- "⬆️ Top" (emoji + text)
- "^ Top" (ASCII symbol)

**Avoid:**

- Long sentences ("Click here to scroll back to top")
- Multiple lines (breaks button layout)
- Complex formatting (not supported)
- Images (button should be lightweight)

### Placement Requirements

**Where to place:**

- At the end of page (after all content)
- One per page (document-level block)
- Can be on any page type
- Works with all other blocks

**Page structure example:**

```
| Hero |
|------|
| Welcome Section |

Long content here...

More content...

| ReturnToTop |
|-------------|
| ↑ Top       |
```

### When to Use This Block

**Effective on:**

- Long articles (> 2 screen heights)
- Multi-section landing pages
- Documentation with many topics
- Blog posts with extensive content
- FAQ pages with many questions
- Product pages with detailed descriptions

**Not needed on:**

- Short pages (< 2 screen heights)
- Single-screen landing pages
- Modal dialogs or popups
- Mobile pages with brief content

---

## Styling Guidelines

### Visual Appearance

**Button characteristics:**

- Fixed position (always visible when active)
- Bottom-left corner (20px from edges)
- Blue background (#007BFF)
- White text
- Rounded corners (5px)
- Hover effect (darker blue)

**Visibility behavior:**

- Hidden on page load
- Appears after scrolling down 100 pixels
- Disappears when scrolling back to top (< 100px)
- Smooth show/hide transitions

### Scroll Threshold

**Default behavior:**

- Button appears when scrollY > 100px
- 100 pixels = approximately 1-2 scroll wheel clicks
- Prevents button from appearing on slight scroll
- Gives users room to see content first

**Why 100 pixels?**

- Common industry standard
- Balances visibility vs. intrusion
- Works well on most page types
- Can be customized if needed

### Button Positioning

**Default position (bottom-left):**

```css
bottom: 20px
left: 20px
```

**Can be customized to:**

- Bottom-right corner
- Bottom-center
- Different offsets from edges
- Different z-index for layering

---

## Best Practices

### Content Strategy

**1. Use on appropriate pages**

- Only on pages with significant scroll
- Not needed on short pages
- Consider user experience
- Don't overuse on every page

**2. Keep button text concise**

- 1-3 words maximum
- Use universal symbols
- Clear action ("Top", "Back")
- Avoid complete sentences

**3. Place at end of content**

- After all page content
- One per page
- Consistent placement across site
- Easy for users to predict location

**4. Test on mobile devices**

- Ensure button doesn't block content
- Touch target large enough (44px minimum)
- Positioned where thumb can reach
- Works with both hands

### Accessibility First

**1. Semantic meaning**

- Button text describes action
- "Top" or "Back to Top" is clear
- Avoid ambiguous labels
- Consider screen reader users

**2. Keyboard accessible**

- Tab key moves to button
- Enter/Space activates button
- Visible focus indicator
- Logical tab order maintained

**3. Visual clarity**

- High contrast (blue on white)
- Clear button boundaries
- Visible hover state
- Sufficient size for clicking

**4. Motion preferences**

- Smooth scrolling respects user settings
- Falls back to instant scroll if needed
- Respects prefers-reduced-motion
- No jarring animations

### Performance Optimization

**Efficient implementation:**

- Lightweight JavaScript (~500 bytes)
- Minimal CSS (~300 bytes)
- No external dependencies
- No API calls or network requests

**Scroll performance:**

- Event listener is lightweight
- Minimal CPU impact
- No DOM queries in scroll handler
- Fast interaction response

### When NOT to Use Return to Top

**Avoid on:**

- Short pages (< 2 screen heights)
- Single-section landing pages
- Modal dialogs or overlays
- Pages with sticky navigation (redundant)

**Better alternatives:**

- **Sticky header** - For persistent navigation
- **Anchor links** - For jumping to specific sections
- **Table of contents** - For structured navigation
- **Pagination** - For long lists or articles

---

## Troubleshooting

### Issue: Button never appears

**Problem:** You scroll down but button doesn't show up.

**Cause:** Page might not be scrolling enough, or JavaScript not loaded.

**Solution:**

1. Scroll down more than 100 pixels (about 2-3 scroll wheel clicks)
2. Check that page content is long enough to scroll
3. Verify JavaScript is enabled in browser
4. Check browser console for errors (F12)

### Issue: Button appears immediately

**Problem:** Button is visible on page load without scrolling.

**Cause:** CSS not loaded properly, or initial scroll position is > 100px.

**Solution:**

1. Check that CSS file is loaded (Network tab in DevTools)
2. Verify page loads at top (scrollY = 0)
3. Clear browser cache and reload
4. Check for CSS conflicts

### Issue: Button doesn't scroll smoothly

**Problem:** Clicking button jumps to top instead of smooth scroll.

**Cause:** Browser doesn't support smooth scrolling, or user has reduced motion enabled.

**Solution:**

1. **This is expected behavior in some cases:**
   - IE11 doesn't support smooth scrolling (works but no animation)
   - Users with prefers-reduced-motion get instant scroll (accessibility)
   - Older Safari versions may not animate
2. **This is not a bug** - it's working as designed
3. Smooth scrolling is an enhancement, instant scroll is the fallback

### Issue: Button blocks page content

**Problem:** Button covers important content or interactive elements.

**Cause:** Button position conflicts with page layout.

**Solutions:**

1. **Change button position** (requires CSS customization):
   - Move to bottom-right corner
   - Adjust offset from edges
   - Consider page layout needs
2. **Keep button small and unobtrusive**:
   - Use minimal text (just arrow)
   - Default position rarely conflicts
   - Test on actual content pages

### Issue: Multiple buttons appear

**Problem:** More than one return-to-top button on page.

**Cause:** Block was added multiple times in Google Docs.

**Solution:**

1. Check Google Docs content
2. Remove duplicate returntotop blocks
3. Keep only one instance (usually at end of page)
4. This is a document-level block (one per page)

### Issue: Button doesn't work on mobile

**Problem:** Tapping button on mobile device has no effect.

**Cause:** Touch target too small, or JavaScript error on mobile.

**Solutions:**

1. Check browser console on mobile device
2. Verify button is large enough for touch (44px minimum)
3. Test with different mobile browsers
4. Check for JavaScript errors specific to mobile

---

## Advanced Techniques

### Customizing Button Text

Use different button labels for different contexts:

**For documentation pages:**

| ReturnToTop |
|-------------|
| ↑ Contents  |

**For blog posts:**

| ReturnToTop |
|-------------|
| ⬆️ Start     |

**For product pages:**

| ReturnToTop |
|-------------|
| ^ Overview  |

**Result:** Button label matches page context and content type.

### Combining with Other Blocks

Use returntotop with long-form content blocks:

**Example: Long article with sections**

| Hero |
|------|
| Article Title |
| By Author Name |

## Introduction Section

Long introduction content here...

| Sections |
|----------|
| Main Content |

Multiple paragraphs of content...

## Conclusion Section

Closing thoughts...

| ReturnToTop |
|-------------|
| ↑ Top       |

**Result:** Smooth navigation for long articles with return-to-top convenience.

### Testing Button Behavior

**Visual testing checklist:**

1. **Load page:**
   - Button is hidden ✓
   - No visual elements visible ✓

2. **Scroll down > 100px:**
   - Button appears in bottom-left ✓
   - Blue background with white text ✓
   - Rounded corners visible ✓

3. **Hover over button:**
   - Background darkens to #0056b3 ✓
   - Cursor changes to pointer ✓

4. **Click button:**
   - Page smoothly scrolls to top ✓
   - Animation takes ~1 second ✓
   - Button disappears at top ✓

5. **Scroll down again:**
   - Button reappears after 100px ✓
   - Behavior is consistent ✓

### Mobile Optimization

**Mobile-specific considerations:**

1. **Touch target size:**
   - Minimum 44px x 44px (iOS guideline)
   - Current default may be small for some users
   - Consider larger padding for mobile

2. **Positioning:**
   - Bottom-left works for most users
   - Doesn't interfere with navigation
   - Easy to reach with thumb

3. **Performance:**
   - Lightweight (no performance impact)
   - Works on slow connections
   - No API calls or resources

**Testing on mobile:**

- Use real devices when possible
- Test with both hands (left/right)
- Try different screen sizes
- Check landscape orientation

### Custom Styling Examples

**Note:** These require CSS customization in your project's stylesheet.

`Change button position to bottom-right`
`.returntotop {`
`left: auto;`
`right: 20px;`
`}`

`Circular button style`
`.returntotop {`
`width: 50px;`
`height: 50px;`
`border-radius: 50%;`
`padding: 0;`
`display: flex;`
`align-items: center;`
`justify-content: center;`
`}`

`Green accent color`
`.returntotop {`
`background-color: #28a745;`
`}`
`.returntotop:hover {`
`background-color: #218838;`
`}`

`Add shadow for depth`
`.returntotop {`
`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);`
`}`

Then apply by adding CSS to your project's styles.css file.

---

## Testing Your Button

### Visual Testing Checklist

After creating the returntotop block in Google Docs:

1. **Preview on staging site:**
   - Button hidden on page load ✓
   - Scroll down > 100px ✓
   - Button appears in bottom-left ✓
   - Blue background, white text ✓
   - Rounded corners ✓

2. **Interaction testing:**
   - Hover shows darker blue ✓
   - Click scrolls to top ✓
   - Smooth animation works ✓
   - Button disappears at top ✓

3. **Mobile testing (< 600px):**
   - Button visible and accessible ✓
   - Touch target large enough ✓
   - Doesn't block content ✓
   - Smooth scroll works ✓

4. **Keyboard testing:**
   - Tab key moves to button ✓
   - Enter/Space activates button ✓
   - Focus indicator visible ✓
   - Scrolls to top on activation ✓

5. **Accessibility testing:**
   - Screen reader announces button ✓
   - Button action is clear ✓
   - Keyboard navigation works ✓
   - High contrast visibility ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

**Expected behavior:**

- Smooth scrolling in modern browsers ✓
- Instant scroll in IE11 (fallback) ✓
- Works consistently across browsers ✓

---

## Content Examples

### Example 1: Minimal Arrow

| ReturnToTop |
|-------------|
| ↑           |

**Use case:** Minimal design, clean UI, subtle button

### Example 2: Text Label

| ReturnToTop |
|-------------|
| Back to Top |

**Use case:** Clear description, accessibility-focused, international audiences

### Example 3: Icon + Text

| ReturnToTop |
|-------------|
| ↑ Top       |

**Use case:** Most common pattern, balanced clarity and brevity

### Example 4: Emoji Arrow

| ReturnToTop |
|-------------|
| ⬆️ Top       |

**Use case:** Modern design, colorful accent, mobile-friendly

### Example 5: ASCII Symbol

| ReturnToTop |
|-------------|
| ^ Top       |

**Use case:** Text-based design, ASCII-friendly, all fonts supported

---

## Integration Examples

### After Long Article

| Hero |
|------|
| Article Headline |
| Subtitle and author info |

Long article content with multiple sections...

| ReturnToTop |
|-------------|
| ↑ Top       |

### After Documentation Sections

| Sections |
|----------|
| Documentation Content |

Multiple documentation topics...

| ReturnToTop |
|-------------|
| ⬆️ Contents  |

### After Product Description

| Columns |
|---------|
| Product Details |
| Features and specs |

Extensive product information...

| ReturnToTop |
|-------------|
| ↑ Overview  |

---

## Related Blocks

**Similar functionality:**

- **Sticky Header** - Persistent navigation at top
- **Anchor Links** - Jump to specific sections
- **Table of Contents** - Structured navigation

**Complementary blocks:**

- **Hero** - Large introductory section at page top
- **Sections** - Long-form content organization
- **Footer** - Page-level navigation and info

**When to use what:**

- **Return to Top** - For general page navigation
- **Sticky Header** - For persistent access to navigation
- **Anchor Links** - For jumping to specific content
- **TOC** - For structured document navigation

---

## Version History

- **v1.0** (Current) - Initial returntotop block implementation
  - Scroll detection (100px threshold)
  - Smooth scroll animation
  - Fixed bottom-left positioning
  - Click-based interaction
  - Blue accent styling with hover effect

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[Design Philosophy Guide](../../docs/for-ai/implementation/design-philosophy-guide.md)** - Content-driven development principles
- **[Frontend Guidelines](../../docs/for-ai/guidelines/frontend-guidelines.md)** - Development best practices

---

## Frequently Asked Questions

**Q: Can I change the scroll threshold (100px)?**
A: Currently requires code modification. Future versions will support configuration.

**Q: Can I position the button on the right side?**
A: Yes, with CSS customization. Add styles to override default left position.

**Q: Does it work on mobile?**
A: Yes, works on all devices. Touch-friendly and responsive.

**Q: Why doesn't smooth scrolling work in IE11?**
A: IE11 doesn't support smooth scrolling. Button works but scrolls instantly.

**Q: Can I use multiple buttons on one page?**
A: Not recommended. This is a document-level block (one per page).

**Q: Does it affect page performance?**
A: No. Extremely lightweight (~800 bytes total) with minimal CPU impact.

**Q: Can I customize the button color?**
A: Yes, with CSS customization. Override `.returntotop` styles in your stylesheet.

**Q: Why does the button disappear at the top?**
A: By design. Button only needed when scrolled down. Automatically hides at top.

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Marketing Teams, Designers
