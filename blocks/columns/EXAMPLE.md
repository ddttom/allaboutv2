# Columns Block - Usage Examples

This document shows how to use the columns block in Google Docs to create flexible multi-column layouts. Perfect for side-by-side text and image displays, feature comparisons, and organized content presentation.

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

Create a simple two-column layout in Google Docs:

| Columns |
|---------|
| ![Hero Image](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) | **Welcome to Our Platform**\n\nDiscover powerful features designed to streamline your workflow. Our platform combines simplicity with advanced capabilities to help you achieve more. |

**Result:** Image on left, text on right (desktop). Image above text (mobile). Equal-width columns with 32px gap.

---

## Basic Usage

### Minimal Two-Column Example

The simplest columns block with text in both columns:

| Columns |
|---------|
| Column 1 content | Column 2 content |

**Output:** Two equal-width columns side-by-side on desktop, stacked on mobile.

### Text and Image Layout

Most common use case - combining text with imagery:

| Columns |
|---------|
| ![Feature](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) | **Lightning Fast Performance**\n\nExperience blazing fast load times with our edge delivery network. Optimized caching and global distribution ensure your content reaches users instantly. |

**Output:** Image left, text right on desktop. Image first on mobile (better UX).

---

## Common Patterns

### Pattern 1: Image + Text (Standard)

Perfect for hero sections, feature highlights, and product showcases:

| Columns |
|---------|
| ![Product](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) | **Innovative Design**\n\nOur product combines form and function with an intuitive interface. Built for professionals who demand both power and simplicity in their tools. |

**Use when:**
- Introducing a feature or product
- Creating visual interest
- Balancing text with imagery

### Pattern 2: Text + Image (Reversed)

Same as Pattern 1 but image on right:

| Columns |
|---------|
| **Seamless Integration**\n\nConnect with your existing tools and workflows effortlessly. Our platform supports all major integrations and provides flexible API access for custom solutions. | ![Integration](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |

**Use when:**
- Creating visual rhythm (alternate left/right)
- Matching reading direction preference
- Balancing page layout

### Pattern 3: Three Equal Columns

Great for feature comparisons or service offerings:

| Columns |
|---------|
| **Performance**\n\nOptimized for speed with perfect Lighthouse scores. Edge delivery ensures fast load times globally. | **Authoring**\n\nContent creators use familiar tools. No technical knowledge required. Simple and intuitive. | **Scalability**\n\nHandle unlimited traffic with ease. Built on robust infrastructure for global scale. |

**Use when:**
- Comparing features side-by-side
- Listing three key benefits
- Creating balanced layouts

### Pattern 4: Two Text Columns

Traditional multi-column text layout:

| Columns |
|---------|
| **Getting Started**\n\nBegin your journey with our comprehensive onboarding guide. We'll walk you through setup, configuration, and your first project in minutes. | **Advanced Features**\n\nUnlock powerful capabilities as you grow. Explore automation, custom integrations, and enterprise-grade features designed for scale. |

**Use when:**
- Dense text content
- Documentation sections
- Newsletters or articles

### Pattern 5: Four Columns (Features Grid)

Showcase multiple features or services:

| Columns |
|---------|
| **Fast**\n\nLightning quick delivery | **Simple**\n\nEasy to use | **Secure**\n\nEnterprise ready | **Scalable**\n\nGrows with you |

**Use when:**
- Feature highlights (brief)
- Icon + label layouts
- Service offerings
- Quick comparisons

---

## Content Requirements

### Markdown Structure

**Basic Format:**
```
| Columns |
|---------|
| Column 1 | Column 2 | Column 3 |
```

**Rules:**
1. First row must be: `| Columns |`
2. Second row must be: `|---------|`
3. Third row contains your column content, separated by `|`
4. Number of `|` pipes determines column count

### Supported Content Types

**Text Content:**
- Plain text paragraphs
- Headings (##, ###, ####)
- Bold (`**text**`) and italic (`*text*`)
- Lists (ordered and unordered)
- Links (`[text](url)`)

**Image Content:**
- Standard markdown images: `![alt](url)`
- EDS optimized images
- Full-width images in columns
- Picture elements (auto-generated)

**Rich Content:**
- Multiple paragraphs (use `\n\n`)
- Headings + text combinations
- Lists within columns
- Any valid markdown

**Not Supported:**
- Nested columns blocks
- Tables within columns
- Other blocks within columns

---

## Styling Guidelines

### Column Width

Columns are automatically equal width on desktop:
- 2 columns = 50% each
- 3 columns = 33.33% each
- 4 columns = 25% each

**Custom widths:** Not supported by default (requires CSS override)

### Spacing

**Gap between columns:** 32px (desktop only)

**Vertical spacing:** Controlled by parent section margins

**Internal padding:** None (add via section settings if needed)

### Text Formatting

**Headings:** Use `##` or `###` for column titles
- `##` → H2 (larger, more prominent)
- `###` → H3 (medium size)
- `####` → H4 (smaller)

**Paragraphs:** Separate with `\n\n` in markdown

**Bold/Italic:** Standard markdown syntax works

### Image Sizing

**Full-width images:** Automatically applied
- Mobile: 100% of screen width
- Desktop: 100% of column width

**Aspect ratio:** Preserved automatically

**Optimization:** Use EDS image optimization

---

## Best Practices

### Content Organization

1. **Put most important content first** (left column on desktop, top on mobile)
2. **Balance text length** across columns for visual harmony
3. **Use images strategically** to break up text-heavy sections
4. **Limit columns** to 3-4 for readability (2 is ideal)

### Image Selection

1. **Use high-quality images** (EDS will optimize)
2. **Match aspect ratios** when using multiple images
3. **Provide descriptive alt text** for accessibility
4. **Consider mobile view** (images appear first)

### Text Guidelines

1. **Keep headings concise** (3-5 words ideal)
2. **Limit text per column** (2-3 short paragraphs max)
3. **Use headings for structure** within columns
4. **Balance content length** across columns

### Mobile Considerations

1. **Images appear first** on mobile (by design)
2. **Columns stack vertically** (top to bottom)
3. **Order matters** for mobile reading flow
4. **Test on actual devices** before publishing

### Accessibility

1. **Always include alt text** for images
2. **Use proper heading hierarchy** (don't skip levels)
3. **Ensure sufficient contrast** for text
4. **Avoid text over images** (readability issues)

---

## Troubleshooting

### Issue: Columns not appearing side-by-side

**Possible Causes:**
- Viewing on mobile device (< 900px width)
- Browser window too narrow
- CSS not loaded

**Solutions:**
1. Check browser width (must be >= 900px for side-by-side)
2. Refresh page to ensure CSS loads
3. Test on desktop browser
4. Check browser console for errors

### Issue: Images too small or too large

**Possible Causes:**
- Original image dimensions
- Display size settings

**Solutions:**
1. Upload higher resolution images (EDS will optimize)
2. Let images be full-width (default behavior)
3. Use landscape orientation for side-by-side layouts
4. Verify image URLs are correct

### Issue: Unequal column widths

**Possible Causes:**
- Custom CSS overrides
- Browser compatibility

**Solutions:**
1. Remove any custom styling
2. Test in different browser
3. Check for conflicting CSS
4. Verify columns block is properly applied

### Issue: Wrong stacking order on mobile

**Possible Causes:**
- Markdown column order

**Solutions:**
1. Reorder columns in markdown (left to right = top to bottom on mobile)
2. Image columns automatically appear first (by design)
3. Test on actual mobile device
4. Consider mobile reading flow when authoring

### Issue: Too much or too little spacing

**Possible Causes:**
- Section padding settings
- Default gap (32px)

**Solutions:**
1. Adjust section padding in Google Docs
2. Use custom CSS to modify gap (requires developer)
3. Check surrounding content spacing
4. Use dividers between sections if needed

---

## Advanced Techniques

### Creating Visual Rhythm

Alternate image positions for engaging layouts:

**Row 1 (Image Left):**
| Columns |
|---------|
| ![Left](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) | Text content here |

**Row 2 (Image Right):**
| Columns |
|---------|
| Text content here | ![Right](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |

**Result:** Alternating left-right pattern creates visual interest.

### Combining with Other Blocks

**Above Columns:** Use hero block for page header

**Below Columns:** Use cards block for additional content

**Between Columns:** Use section dividers for separation

### Feature Comparison Layout

Three-column comparison with headings and lists:

| Columns |
|---------|
| **Starter**\n\n- Basic features\n- 5 projects\n- Email support\n- $9/month | **Professional**\n\n- Advanced features\n- Unlimited projects\n- Priority support\n- $29/month | **Enterprise**\n\n- Custom features\n- Unlimited everything\n- Dedicated support\n- Contact us |

**Result:** Clear side-by-side comparison with structured information.

### Hero Section with CTA

Large image with text and call-to-action:

| Columns |
|---------|
| ![Hero](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) | **Transform Your Workflow**\n\nDiscover how our platform can help you work smarter, not harder. Join thousands of satisfied users today.\n\n[Get Started Free](#) |

**Result:** Engaging hero section with visual impact and clear action.

### Content-Heavy Layouts

Two-column text with multiple sections:

| Columns |
|---------|
| **Section 1: Introduction**\n\nFirst paragraph of content here.\n\n**Section 2: Details**\n\nSecond paragraph with additional information. | **Section 3: Benefits**\n\nList of key benefits and features.\n\n**Section 4: Conclusion**\n\nFinal thoughts and next steps. |

**Result:** Organized, readable text presentation.

---

**Tips for Success:**

1. Start simple with two columns
2. Test on mobile before publishing
3. Balance text and images
4. Use headings for structure
5. Keep content concise
6. Provide descriptive alt text
7. Consider reading order (left to right, top to bottom)
8. Preview at different screen sizes

**Need Help?**

- Check README.md for technical details
- Review test.html for working examples
- Contact development team for custom styling
- Test across devices before launch
