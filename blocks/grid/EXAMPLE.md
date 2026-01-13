# Grid Block - Usage Examples

This document shows how to use the grid block in Google Docs to create various responsive grid layouts. The grid block provides multiple layout patterns for organizing content including logo grids, icon cards, two-column layouts, and more.

## Table of Contents

- [Quick Start](#quick-start)
- [Grid Variations](#grid-variations)
- [Common Patterns](#common-patterns)
- [Content Requirements](#content-requirements)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

### Basic Grid

The simplest grid with default spacing:

| Grid |
|------|
| Item 1 |
| Item 2 |
| Item 3 |
| Item 4 |

**Result:** A flexible grid with automatic column layout based on content.

---

## Grid Variations

### 1. Two-Column Grid

Perfect for side-by-side content layouts:

| Grid (two-cols) |
|-----------------|
| Left column content with detailed information |
| Right column content with complementary details |

**Result:**

- Mobile: Single column (stacked)
- Desktop (992px+): Two equal-width columns

**Best for:**

- Comparison layouts
- Text with image combinations
- Feature pairs
- Before/after content

---

### 2. Logo Grid

Display partner, client, or technology logos in a responsive grid:

| Grid (logo-grid) |
|------------------|
| ![Partner 1](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Partner 2](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Partner 3](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| ![Partner 4](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| ![Partner 5](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |

**Result:**

- Mobile: 1 column
- Small tablet (576px+): 3 columns
- Desktop (992px+): 5 columns
- Logos centered and sized consistently (max 50px height)
- Section has top and bottom borders

**Best for:**

- Partner/client logos
- Technology stack showcases
- Sponsor displays
- Brand partnerships
- Trust indicators

---

### 3. Icon Cards

Feature grid with icons, headings, and descriptions:

| Grid (icon-cards) |
|-------------------|
| :star: |
| Premium Quality |
| Exceptional quality standards with rigorous testing and validation processes |
| :check: |
| Guaranteed Results |
| Proven methodologies that deliver measurable outcomes and success |
| :lightning: |
| Fast Performance |
| Lightning-fast delivery with optimized processes and efficient workflows |
| :shield: |
| Secure & Reliable |
| Enterprise-grade security with 99.99% uptime guarantee |

**Result:**

- Mobile: 1 column
- Small tablet (576px+): 2 columns
- Tablet (768px+): 2 columns
- Desktop (992px+): 3 columns
- Large desktop (1200px+): 4 columns
- Cards with shadow effects
- Hover effect changes background and text color
- Icons displayed in rotated diamond containers

**Best for:**

- Feature grids
- Service offerings
- Product benefits
- Value propositions
- Key differentiators

---

### 4. Bulleted Grid

Grid layout with icon bullets:

| Grid (bulleted) |
|-----------------|
| :check: Feature one with comprehensive description |
| :check: Feature two with detailed explanation |
| :check: Feature three with supporting information |
| :check: Feature four with additional context |

**Result:**

- Icons displayed as bullets on the left
- Content flows next to icons
- Flexible layout adapting to content
- Icon takes 8.33% width (1/12 of grid)

**Best for:**

- Feature lists
- Checklist layouts
- Benefit lists
- Requirements lists
- Step-by-step guides

---

## Common Patterns

### Pattern 1: Partner Logo Wall

Showcase partners, clients, or technology stack:

| Grid (logo-grid) |
|------------------|
| ![Adobe](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Microsoft](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Google](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| ![Amazon](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| ![IBM](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| ![Oracle](https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png) |
| ![SAP](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Salesforce](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Cisco](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| ![Intel](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |

**Use case:** Trust building section showing major partners or clients.

---

### Pattern 2: Service Features Grid

Highlight key features with icons and descriptions:

| Grid (icon-cards) |
|-------------------|
| :rocket: |
| Fast Deployment |
| Get up and running in minutes with our streamlined onboarding process |
| :users: |
| Team Collaboration |
| Work together seamlessly with real-time collaboration tools |
| :chart: |
| Analytics Dashboard |
| Track performance with comprehensive analytics and reporting |
| :lock: |
| Enterprise Security |
| Bank-level encryption and compliance with industry standards |
| :mobile: |
| Mobile Optimized |
| Full functionality on any device with responsive design |
| :support: |
| 24/7 Support |
| Round-the-clock assistance from our expert support team |

**Use case:** Product landing page highlighting key features.

---

### Pattern 3: Comparison Layout

Side-by-side content comparison:

| Grid (two-cols) |
|-----------------|
| **Before Our Solution** Traditional approaches lead to slow processes, high costs, manual workflows, limited scalability, and inconsistent results. |
| **After Our Solution** Modern technology enables fast automation, cost reduction, streamlined workflows, unlimited scale, and guaranteed outcomes. |

**Use case:** Before/after comparison or feature comparison.

---

### Pattern 4: Technology Stack

Display technologies used in your product:

| Grid (logo-grid) |
|------------------|
| ![React](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Node.js](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![PostgreSQL](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| ![Docker](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| ![Kubernetes](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |

**Use case:** Developer-focused page showing technology stack.

---

### Pattern 5: Feature Checklist

List features or benefits with checkmarks:

| Grid (bulleted) |
|-----------------|
| :check: Unlimited projects and workspaces |
| :check: Advanced analytics and reporting |
| :check: Priority customer support |
| :check: Custom integrations and API access |
| :check: Team collaboration tools |
| :check: Enterprise-grade security |

**Use case:** Pricing page or feature comparison showing included features.

---

## Content Requirements

### Logo Grid Requirements

**Logo Images:**

- Format: PNG with transparent background (recommended)
- Dimensions: 200-400px wide, any height
- File size: < 50KB per logo
- Aspect ratio: Any (width auto-adjusts)
- Display size: Maximum 50px height, width auto

**Why this matters:**

- Logos are centered in 57px tall containers
- Maximum display height is 50px
- Width automatically adjusts to maintain aspect ratio
- Transparent backgrounds work best for visual consistency

**Logo preparation tips:**

1. Use high-quality source files
2. Crop excess whitespace
3. Ensure sufficient padding in logo itself
4. Test on both light and dark backgrounds
5. Consider providing color and monochrome versions

---

### Icon Cards Requirements

**Icons:**

- Use standard icon syntax: `:icon-name:`
- Common icons: `:star:`, `:check:`, `:lightning:`, `:shield:`, `:rocket:`
- Icons display in diamond-shaped containers
- Icon size: XL (from design system)
- Icon rotates to counter diamond rotation

**Headings:**

- Length: 2-5 words
- Use H5 styling (from design system)
- Centered text alignment
- Semi-bold font weight

**Body Text:**

- Length: 1-2 sentences (aim for 50-150 characters)
- Centered text alignment
- Avoid overly long descriptions
- Focus on key benefits

---

### Two-Column Grid Requirements

**Content Balance:**

- Keep columns roughly equal in length
- Avoid one column significantly longer than other
- Use similar content types in each column
- Consider visual balance (text vs images)

**Column Content:**

- Each column is one table row
- Can include text, headings, images, lists
- Maintain consistent formatting
- Use semantic heading levels

---

### Bulleted Grid Requirements

**Icon Bullets:**

- Use consistent icon throughout list
- Common choice: `:check:` for checkmarks
- Icons appear on left side
- Icons take 8.33% of width

**Content:**

- Keep items concise
- Start with strong keywords
- Use parallel structure (all start with verb, noun, etc.)
- Aim for similar length across items

---

## Styling Guidelines

### Logo Grid Styling

**Automatic styling:**

- Section borders: Top and bottom separators
- Container height: 57px per logo
- Logo max height: 50px
- Logo width: Auto (maintains aspect ratio)
- Alignment: Centered horizontally and vertically

**Visual consistency:**

- All logos same max height
- Proportional widths
- Consistent spacing
- Clean, professional appearance

---

### Icon Cards Styling

**Automatic styling:**

- Card padding: Extra large (from design system)
- Card shadow: Medium drop shadow
- Border radius: Default (from design system)
- Text alignment: Center
- Icon container: Diamond shape (45° rotation)
- Icon size: XL

**Hover effects:**

- Background changes to primary color
- Text changes to on-primary color
- Smooth transition

**Responsive behavior:**

- Mobile: Full-width cards, vertical stack
- Tablet: 2 columns
- Desktop: 3 columns
- Large desktop: 4 columns

---

### Two-Column Grid Styling

**Automatic styling:**

- Equal-width columns on desktop
- Single column on mobile
- Gap spacing: Large (from design system)
- Breakpoint: 992px

**Content styling:**

- Inherits standard text styles
- Maintains heading hierarchy
- Supports images, text, lists
- Flexible content types

---

## Best Practices

### Logo Grid Best Practices

**1. Logo consistency**

- Use logos of similar visual weight
- Maintain consistent color treatment (all color or all monochrome)
- Ensure similar padding/whitespace in logo files
- Test visibility on your background color

**2. Optimal logo count**

- Mobile: 3-5 logos (displays as single column)
- Tablet: 6-9 logos (displays as 3 columns)
- Desktop: 10+ logos (displays as 5 columns)
- Avoid too many logos (overwhelming)

**3. Logo quality**

- Use vector formats when possible (SVG)
- Provide high-DPI versions for Retina displays
- Optimize file sizes (< 50KB)
- Use appropriate compression

**4. Logo links**
Wrap logos in links if needed:

| Grid (logo-grid) |
|------------------|
| [![Partner 1](logo1.png)](https://partner1.com) |
| [![Partner 2](logo2.png)](https://partner2.com) |

---

### Icon Cards Best Practices

**1. Icon selection**

- Use meaningful icons that represent the feature
- Be consistent with icon style (all outline or all filled)
- Choose recognizable icons (avoid obscure symbols)
- Limit icon variety (use design system icons)

**2. Content balance**

- Keep headings similar length (2-5 words)
- Write descriptions of similar length
- Aim for 3-6 cards per section (not too many)
- Group related features together

**3. Feature prioritization**

- Put most important features first
- Use visual hierarchy (icon + heading + description)
- Front-load key benefits
- Be specific and concrete

**4. Avoid common pitfalls**

- Don't use overly technical jargon
- Avoid vague descriptions ("great features")
- Don't mix benefit types (functional vs emotional)
- Keep descriptions scannable

---

### Two-Column Grid Best Practices

**1. Content pairing**

- Pair related content (image + text, before + after)
- Maintain logical left-to-right flow
- Keep columns balanced in length
- Use parallel structure

**2. Visual hierarchy**

- Use headings to introduce each column
- Maintain consistent formatting
- Consider image placement carefully
- Test on mobile (stacks vertically)

**3. Common uses**

- Text + image combinations
- Before/after comparisons
- Feature comparisons
- Step-by-step processes with visuals

---

### Bulleted Grid Best Practices

**1. List structure**

- Use consistent icon (usually `:check:`)
- Start items with strong keywords
- Use parallel grammatical structure
- Keep items concise (1-2 lines)

**2. Content organization**

- Group related items together
- Prioritize most important items first
- Use 3-8 items (not too few, not too many)
- Consider numbered lists for steps

**3. Writing style**

- Be specific and concrete
- Use active voice
- Avoid redundancy
- Focus on benefits, not features

---

## Troubleshooting

### Issue: Logo grid shows different column counts than expected

**Problem:** Not seeing 5 columns on desktop or 3 on tablet.

**Cause:** Viewport width doesn't match breakpoints.

**Solution:**

- Check viewport width:
  - < 576px: 1 column
  - 576px - 991px: 3 columns
  - 992px+: 5 columns
- Resize browser window to test
- Use browser DevTools device toolbar
- Verify no CSS overrides

---

### Issue: Logos too large or too small

**Problem:** Logos don't fit well in containers.

**Cause:** Logo image dimensions or container sizing.

**Solutions:**

1. **Adjust original images:**
   - Crop excess whitespace
   - Ensure logos are high resolution
   - Provide consistent aspect ratios

2. **Check logo dimensions:**
   - Max height is 50px
   - Width is auto (proportional)
   - Container height is 57px

3. **Custom styling (if needed):**
   - Contact developer to adjust max-height
   - Consider different logo grid variation
   - Test with different logo files

---

### Issue: Icon cards not showing icons

**Problem:** Icons don't appear or show as placeholder.

**Cause:** Icon syntax incorrect or icon not available.

**Solutions:**

1. **Check icon syntax:**
   - Use `:icon-name:` format
   - Examples: `:star:`, `:check:`, `:rocket:`
   - No spaces in icon name
   - Colons on both sides

2. **Verify icon availability:**
   - Check project's icon library
   - Test with common icons first
   - Confirm icon font is loaded

3. **Test with different icons:**
   - Try `:check:` (usually always available)
   - Switch to different icon if needed
   - Ask developer about available icons

---

### Issue: Two-column grid stays single column on desktop

**Problem:** Columns don't split on wide screens.

**Cause:** Viewport width below 992px breakpoint.

**Solutions:**

1. **Check viewport width:**
   - Must be 992px or wider
   - Browser window might be narrow
   - Test on full-screen browser

2. **Verify variation:**
   - Ensure using `Grid (two-cols)` not just `Grid`
   - Check markdown table header
   - Inspect element for `.two-cols` class

3. **Clear browser cache:**
   - Force refresh (Cmd+Shift+R or Ctrl+Shift+R)
   - Clear CSS cache
   - Try different browser

---

### Issue: Content overflows cards

**Problem:** Long text breaks card layout.

**Cause:** Text too long for card container.

**Solutions:**

1. **Shorten content:**
   - Aim for 1-2 sentences per card
   - Use concise language
   - Remove unnecessary words
   - Focus on key points

2. **Break into multiple cards:**
   - Split long content across cards
   - Use "Learn more" links
   - Create detail pages

3. **Check on different screen sizes:**
   - What looks good on desktop may overflow on mobile
   - Test responsive behavior
   - Adjust content accordingly

---

### Issue: Bulleted items not aligning properly

**Problem:** Icons and text don't line up.

**Cause:** Content structure or CSS issues.

**Solutions:**

1. **Check markdown structure:**
   - Each item should be one table row
   - Format: `| :icon: Text content |`
   - Icon and text in same cell

2. **Keep content consistent:**
   - Similar length items
   - Consistent formatting
   - Avoid complex nested content

3. **Test with simple content first:**
   - Start with basic text
   - Add complexity gradually
   - Identify what breaks layout

---

## Advanced Techniques

### Combining Grids with Other Blocks

**Grid after Hero:**

| Hero |
|------|
| ![Hero Image](hero.jpg) |
| Welcome to Our Platform |

| Grid (logo-grid) |
|------------------|
| ![Partner 1](logo1.png) |
| ![Partner 2](logo2.png) |
| ![Partner 3](logo3.png) |

---

**Icon Cards with Section Heading:**

### Our Key Features

Discover what makes our platform exceptional.

| Grid (icon-cards) |
|-------------------|
| :star: |
| Premium Quality |
| Exceptional standards |
| :check: |
| Guaranteed Results |
| Proven outcomes |

---

### Custom Logo Grid Styling

For specific branding needs, work with your developer to customize:

**Grayscale logos with color on hover:**

- Logos display in grayscale by default
- Color appears on hover
- Creates elegant, professional look

**Larger logos:**

- Increase max-height to 70px or 80px
- Adjust container height accordingly
- Maintain aspect ratios

**Different column counts:**

- Custom breakpoints
- Fixed column counts
- Specific layout requirements

---

### Responsive Content Strategy

**Mobile-first approach:**

1. Design for mobile first (single column)
2. Ensure content works vertically stacked
3. Add complexity for larger screens
4. Test on actual devices

**Content adaptation:**

- Mobile: Shorter descriptions, larger touch targets
- Tablet: Balanced content, 2-3 columns
- Desktop: Full details, maximum columns

**Visual hierarchy:**

- Most important content first
- Progressive disclosure
- Clear call-to-action
- Scannable layout

---

### Accessibility Considerations

**Alt text for logos:**

| Grid (logo-grid) |
|------------------|
| ![Adobe - Creative Cloud Partner](logo.png) |

- Describe the logo meaningfully
- Include company name
- Avoid "logo" in alt text (redundant)
- Be concise but descriptive

**Icon cards accessibility:**

- Icons are decorative (text provides meaning)
- Ensure sufficient color contrast
- Text should work without icons
- Test with screen readers

**Keyboard navigation:**

- All links in natural tab order
- Focus indicators visible
- No keyboard traps
- Logical flow (left-to-right, top-to-bottom)

---

## Testing Your Grid

### Visual Testing Checklist

After creating grid in Google Docs:

1. **Preview on staging site:**
   - Check all items appear
   - Verify spacing and alignment
   - Ensure icons/logos render correctly
   - Test hover effects (icon cards)

2. **Mobile testing (< 576px):**
   - Single column layout ✓
   - Content stacks vertically ✓
   - Touch targets large enough ✓
   - Text is legible ✓

3. **Tablet testing (576px - 992px):**
   - Appropriate column count ✓
   - Logo grid: 3 columns ✓
   - Icon cards: 2 columns ✓
   - Spacing looks good ✓

4. **Desktop testing (> 992px):**
   - Maximum column count ✓
   - Logo grid: 5 columns ✓
   - Icon cards: 3-4 columns ✓
   - Two-cols: 2 columns ✓

5. **Accessibility testing:**
   - Logos have alt text ✓
   - Headings are navigable ✓
   - Keyboard navigation works ✓
   - Color contrast sufficient ✓

---

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

**Not supported:** Internet Explorer 11

---

## Performance Tips

### Logo Grid Optimization

**Image optimization:**

1. Compress logo files to < 50KB
2. Use PNG with transparency
3. Consider SVG for vector logos
4. Provide appropriate dimensions (200-400px wide)

**Loading strategy:**

- Logos load with page (not lazy-loaded)
- Keep file sizes small
- Use image CDN if available
- Test load times on slow connections

---

### Icon Cards Performance

**Lightweight by default:**

- Icons from icon font (small file size)
- No external dependencies
- CSS-only hover effects
- Hardware-accelerated transforms

**Content strategy:**

- Limit to 6-8 cards per section
- Keep descriptions concise
- Use appropriate heading levels
- Avoid nested complexity

---

## Related Blocks

**Similar functionality:**

- **Cards** - Grid of content cards with images
- **Columns** - Multi-column text layouts
- **Hero** - Large banner with image and text

**Complementary blocks:**

- **Quote** - Testimonials between grid sections
- **Tabs** - Organize multiple grids in tabs
- **Accordion** - Collapsible sections with grids

---

## Version History

- **v1.0** (Current) - Initial CSS-only implementation
  - Base grid with configurable gaps
  - Two-column responsive layout
  - Logo grid (1-3-5 columns)
  - Icon cards (1-4 columns)
  - Bulleted grid with icons
  - ROS design system integration

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
