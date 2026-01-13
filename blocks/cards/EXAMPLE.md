# Cards Block - Usage Examples

This document shows how to use the cards block in Google Docs to create responsive grid layouts for content cards. Perfect for blog listings, product showcases, feature grids, and content galleries.

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

Create a simple cards grid in Google Docs:

| Cards |
|-------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Feature One |
| Description of the first feature with key benefits |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Feature Two |
| Description of the second feature and what it offers |

**Result:** A responsive grid that displays 1 column on mobile, 2 columns on tablet, and 3-4 columns on desktop.

---

## Basic Usage

### Minimal Example

The simplest cards block with text only:

| Cards |
|-------|
| Heading Text |
| Body content goes here |

**Output:** A single card with heading and body text, no image.

### Standard Example

Cards with images, headings, and descriptions:

| Cards |
|-------|
| ![Product 1](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| Product Name |
| Brief product description highlighting key features and benefits |
| ![Product 2](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| Another Product |
| Different product with its own unique description text |

**Output:** Two cards in a responsive grid, each with image, heading, and body.

---

## Common Patterns

### Pattern 1: Blog Post Cards

Perfect for showcasing recent blog posts or articles:

| Cards |
|-------|
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Understanding EDS Architecture |
| Learn the fundamentals of Edge Delivery Services and how to build modern web experiences with performance-first design principles. |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Block Development Guide |
| Step-by-step instructions for creating custom EDS blocks that integrate seamlessly with your content authoring workflow. |
| ![](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| Performance Optimization Tips |
| Discover proven techniques to achieve perfect Lighthouse scores and deliver lightning-fast user experiences at scale. |

**Best for:** Blog landing pages, article archives, content hubs

### Pattern 2: Product Showcase

Display products with images and descriptions:

| Cards |
|-------|
| ![](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| Premium Widget |
| High-quality widget with advanced features. Starting at $99. |
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Deluxe Package |
| Complete solution for enterprise needs. Contact for pricing. |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Starter Kit |
| Perfect for small teams getting started. Only $29/month. |

**Best for:** E-commerce pages, product catalogs, service offerings

### Pattern 3: Team Member Profiles

Showcase team members with photos and bios:

| Cards |
|-------|
| ![](https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png) |
| Tom Cranstoun |
| Developer and architect specializing in Edge Delivery Services and modern web technologies. |
| ![](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| Team Member 2 |
| Designer focused on user experience and accessible interfaces. |
| ![](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| Team Member 3 |
| Project manager with expertise in agile methodologies and client relations. |

**Best for:** About pages, team pages, staff directories

### Pattern 4: Feature Grid

Highlight product or service features:

| Cards |
|-------|
| ![](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| Fast Performance |
| Lightning-fast page loads with optimized delivery and caching strategies |
| ![](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| Easy Authoring |
| Content creators use familiar tools like Google Docs and Microsoft Word |
| ![](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| Scalable Architecture |
| Built on edge computing for unlimited scale and global distribution |

**Best for:** Landing pages, feature comparisons, service benefits

### Pattern 5: Text-Only Cards

Sometimes you don't need images:

| Cards |
|-------|
| Getting Started |
| Begin your journey with our comprehensive onboarding guide and tutorials |
| Documentation |
| Explore detailed technical documentation and API references |
| Community Support |
| Join our active community forums and get help from experts |

**Best for:** Navigation sections, quick links, informational grids

---

## Content Requirements

### Image Requirements

**Recommended:**

- Aspect ratio: 4:3 (e.g., 800x600, 1200x900)
- File format: JPEG or PNG
- File size: < 500KB per image
- Minimum width: 600px
- Maximum width: 2000px

**Why this matters:**

- Cards automatically resize images to 4:3 aspect ratio
- Larger images are optimized to 750px width
- Images use object-fit: cover (may crop edges)

**Image optimization tips:**

1. Use consistent aspect ratios for visual harmony
2. Optimize images before upload (compress, resize)
3. Provide descriptive alt text for accessibility
4. Use high-quality images (will be auto-optimized)

### Text Requirements

**Heading:**

- Length: 2-8 words
- Use H2, H3, or H4 tags (Google Docs heading styles)
- Keep concise and descriptive
- Avoid overly long titles

**Body Text:**

- Length: 1-3 sentences (aim for 50-150 characters)
- Use plain paragraph style
- Keep descriptions brief and scannable
- Highlight key benefits or features

**Accessibility:**

- Always provide alt text for images
- Use descriptive headings
- Ensure good color contrast
- Keep text readable at all sizes

---

## Styling Guidelines

### Visual Consistency

**Card Layout:**

- Each card has 1px border (uses `--dark-color` CSS variable)
- White background (uses `--background-color` CSS variable)
- 16px internal padding
- 16px gap between cards

**Image Display:**

- Full-width within card
- 4:3 aspect ratio maintained
- Object-fit: cover (fills space, may crop)
- Line-height: 0 (removes gap below image)

**Text Spacing:**

- 16px margin around body content
- First element margin-top removed
- Natural vertical rhythm

### Responsive Behavior

**Mobile (< 600px):**

- Single column layout
- Full-width cards
- Vertical stack
- Easy thumb scrolling

**Tablet (600px - 1024px):**

- 2 columns (auto-adjusts based on width)
- Maintains card proportions
- Comfortable reading distance

**Desktop (> 1024px):**

- 3-4 columns (based on container width)
- Maximum information density
- Consistent grid spacing

**How it works:**

- Grid uses `auto-fill` with `minmax(278px, 1fr)`
- No fixed breakpoints - adapts to content
- Cards never get smaller than 278px
- Optimal column count calculated automatically

---

## Best Practices

### Content Strategy

**1. Keep cards balanced**

- Use similar content lengths across cards
- Maintain consistent heading lengths
- Balance text-heavy and image-heavy cards
- Aim for 3-6 cards per section (not too many)

**2. Optimize for scanning**

- Front-load important information
- Use strong, descriptive headings
- Keep body text concise
- Include clear calls-to-action if needed

**3. Image selection**

- Use high-quality, relevant images
- Maintain consistent style (photos vs illustrations)
- Ensure good subject framing (center important elements)
- Test how images look when cropped to 4:3

**4. Accessibility first**

- Provide meaningful alt text
- Use semantic heading levels
- Ensure sufficient color contrast
- Test with screen readers

### Performance Optimization

**Image best practices:**

1. **Compress before upload** - Use tools like TinyPNG or ImageOptim
2. **Choose appropriate formats** - JPEG for photos, PNG for graphics
3. **Provide alt text** - Helps SEO and accessibility
4. **Use consistent dimensions** - Reduces layout shift

**Content loading:**

- Images are lazy-loaded automatically
- No JavaScript required for basic functionality
- CSS Grid provides hardware-accelerated layout
- Minimal render-blocking resources

### When NOT to Use Cards

**Avoid cards for:**

- Long-form content (use article blocks)
- Single items (just use regular content)
- Complex layouts (consider custom blocks)
- Interactive content (needs custom JavaScript)

**Better alternatives:**

- **Bloglist block** - For dynamic blog post listings from query-index.json
- **Hero block** - For prominent single feature with large image
- **Columns block** - For side-by-side content without card styling
- **Grid block** - For more complex grid layouts

---

## Troubleshooting

### Issue: All content appears in one card

**Problem:** You expected multiple cards but everything is in a single card.

**Cause:** The current cards block implementation puts all table rows into one card.

**Solution:** For multiple cards, you need to either:

**Option 1: Create separate card blocks**

```
| Cards |
|-------|
| ![](image1.jpg) |
| Card 1 Title |
| Card 1 description |

| Cards |
|-------|
| ![](image2.jpg) |
| Card 2 Title |
| Card 2 description |
```

**Option 2: Use a different block**
Consider using the `bloglist` block if you want dynamic cards from query-index.json.

**Note:** This is a known limitation. Future versions may support multi-card content models.

### Issue: Images appear distorted or cropped

**Problem:** Images look stretched, squashed, or important parts are cut off.

**Cause:** Cards force 4:3 aspect ratio with object-fit: cover.

**Solutions:**

1. **Use 4:3 aspect ratio images:**
   - Crop images to 800x600 or 1200x900 before upload
   - Ensure important content is centered

2. **Test cropping behavior:**
   - Preview on staging site
   - Check mobile and desktop views
   - Adjust image framing if needed

3. **Override aspect ratio** (advanced):

   ```css
   .cards > ul > li img {
     aspect-ratio: 16 / 9; /* Change to 16:9 */
   }
   ```

### Issue: Grid not responsive

**Problem:** Cards don't reflow on mobile or stay in fixed columns.

**Cause:** CSS Grid not working or CSS override conflict.

**Solutions:**

1. **Check browser support:**
   - Test in modern browser (Chrome, Firefox, Safari)
   - IE11 is NOT supported

2. **Inspect CSS:**
   - Open DevTools (F12)
   - Check `.cards > ul` element
   - Verify `display: grid` is applied
   - Look for conflicting styles

3. **Test container width:**
   - Ensure parent container has width
   - Check for `overflow: hidden` issues
   - Verify no width constraints

### Issue: Too much or too little spacing

**Problem:** Cards are cramped or too spread out.

**Cause:** Grid gap or card padding issues.

**Solutions:**

1. **Adjust grid gap** (CSS override):

   ```css
   .cards > ul {
     grid-gap: 24px; /* Increase from 16px */
   }
   ```

2. **Modify card padding:**

   ```css
   .cards .cards-card-body {
     margin: 24px; /* Increase from 16px */
   }
   ```

3. **Change minimum column width:**

   ```css
   .cards > ul {
     grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
   }
   ```

### Issue: Images not loading

**Problem:** Broken image icons or blank spaces where images should be.

**Cause:** Image URL issues or CORS errors.

**Solutions:**

1. **Verify image URLs:**
   - Check image links in Google Docs
   - Test URLs in new browser tab
   - Ensure images are accessible

2. **Check image hosting:**
   - Images must be on same domain or have CORS headers
   - Avoid hotlinking from external sites
   - Use project's media library

3. **Inspect Network tab:**
   - Open DevTools (F12) → Network
   - Look for failed image requests
   - Check response codes (404, 403, etc.)

### Issue: Border or background not showing

**Problem:** Cards have no border or wrong background color.

**Cause:** CSS variables not defined.

**Solutions:**

1. **Define CSS variables in your theme:**

   ```css
   :root {
     --dark-color: #333;
     --background-color: #fff;
   }
   ```

2. **Override card styles directly:**

   ```css
   .cards > ul > li {
     border: 1px solid #333;
     background-color: #fff;
   }
   ```

---

## Advanced Techniques

### Custom Card Styling

Add project-specific styles in your main CSS file:

`Custom hover effects`
`.cards > ul > li {`
`transition: transform 0.2s ease, box-shadow 0.2s ease;`
`}`
``
`.cards > ul > li:hover {`
`transform: translateY(-4px);`
`box-shadow: 0 8px 16px rgba(0,0,0,0.1);`
`}`

### Linking Entire Cards

Wrap card content in links for clickable cards:

| Cards |
|-------|
| [![](image.jpg)](https://example.com/page1) |
| [Card Title](https://example.com/page1) |
| [Description text with link](https://example.com/page1) |

**Result:** Entire card becomes clickable (image, heading, and text all link to same URL).

### Mixed Content Types

Combine different heading levels and content:

| Cards |
|-------|
| ![](image1.jpg) |
| Main Feature |
| Detailed description with multiple sentences providing comprehensive information about this feature. |
| ![](image2.jpg) |
| Secondary Item |
| Shorter description. |

**Result:** Cards adapt to content length, maintaining consistent visual weight.

### Custom Column Counts

Force specific column counts with CSS:

`Two-column layout`
`.cards > ul {`
`grid-template-columns: repeat(2, 1fr);`
`}`
``
`Three-column layout`
`.cards.three-col > ul {`
`  grid-template-columns: repeat(3, 1fr);`
`}`
``
`Four-column layout`
`.cards.four-col > ul {`
`grid-template-columns: repeat(4, 1fr);`
`}`

Then use variation classes in markdown: `Cards (three-col)`

---

## Testing Your Cards

### Visual Testing Checklist

After creating cards in Google Docs:

1. **Preview on staging site:**
   - Check all cards appear
   - Verify images load correctly
   - Ensure text is readable
   - Test responsive behavior

2. **Mobile testing (< 600px):**
   - Cards stack vertically ✓
   - Full-width images ✓
   - Text is legible ✓
   - Touch targets are large enough ✓

3. **Tablet testing (600px - 1024px):**
   - 2 columns display ✓
   - Proportions maintained ✓
   - Spacing looks good ✓

4. **Desktop testing (> 1024px):**
   - 3-4 columns depending on width ✓
   - Grid alignment consistent ✓
   - Images maintain aspect ratio ✓

5. **Accessibility testing:**
   - Screen reader announces list ✓
   - Headings are navigable ✓
   - Images have alt text ✓
   - Keyboard navigation works ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

**Not supported:** Internet Explorer 11

---

## Performance Metrics

### Expected Load Times

With properly optimized images:

- JavaScript execution: < 10ms
- CSS parsing: < 5ms
- Image loading: 100-500ms per image (depends on size)
- Total render: < 100ms (excluding images)

### Optimization Tips

**1. Image optimization:**

- Compress images to < 200KB each
- Use appropriate dimensions (600-1200px wide)
- Choose correct format (JPEG for photos)
- Provide alt text for SEO

**2. Content strategy:**

- Limit to 6-12 cards per page section
- Break up large card grids with other content
- Use lazy loading (automatic with EDS)

**3. Lighthouse scores:**

- Performance: 95-100 ✓
- Accessibility: 100 ✓
- Best Practices: 100 ✓
- SEO: 100 ✓

---

## Integration Examples

### Cards After Hero

Combine hero and cards for strong visual hierarchy:

| Hero |
|------|
| ![](hero-image.jpg) |
| Welcome to Our Platform |
| Discover amazing features |

| Cards |
|-------|
| ![](feature1.jpg) |
| Feature One |
| First key feature |
| ![](feature2.jpg) |
| Feature Two |
| Second key feature |

### Cards with Section Headings

Add context with text sections:

### Our Services

We offer comprehensive solutions for modern web development.

| Cards |
|-------|
| ![](service1.jpg) |
| Web Development |
| Custom websites and applications |
| ![](service2.jpg) |
| Consulting |
| Strategic guidance and planning |

### Multiple Card Sections

Create distinct sections with different card groups:

### Popular Articles

| Cards |
|-------|
| [Article content...] |

### Recent Posts

| Cards |
|-------|
| [Different content...] |

---

## Related Blocks

**Similar functionality:**

- **Bloglist** - Dynamic blog cards from query-index.json
- **Grid** - Flexible grid layouts without card styling
- **Columns** - Multi-column content layouts
- **Showcase** - Featured content with rich media

**Complementary blocks:**

- **Hero** - Large introductory section before cards
- **Quote** - Testimonials or highlights between card sections
- **Tabs** - Organize multiple card groups in tabs

---

## Version History

- **v1.0** (Current) - Initial cards block implementation
  - Grid-based responsive layout
  - Image optimization with 4:3 aspect ratio
  - Basic styling with CSS variables
  - No variations available

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
