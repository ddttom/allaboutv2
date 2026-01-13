# Hero Block - Usage Examples

## Example 1: Basic Hero with Two Images

### Google Docs Table

| Hero |
|------|
| ![Mobile landscape view](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Desktop wide landscape](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| # Welcome to Our World |
| Discover amazing experiences |

### Result

Displays a full-width hero image that:

- Shows the first image on mobile devices (< 768px)
- Shows the second image on desktop devices (>= 768px)
- Overlays the heading and text on top of the image
- Centers text vertically and aligns left horizontally
- Uses a minimum height of 1000px

### Technical Note

The block merges the two picture elements by:

1. Taking the mobile source from the first picture
2. Taking the desktop source from the second picture
3. Creating a single responsive picture element
4. Removing the second picture to avoid duplication

---

## Example 2: Hero with Manual Variation

### Google Docs Table

| Hero (manual) |
|---------------|
| ![Mobile hero image](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Desktop hero image](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| ## Transform Your Business |
| Innovative solutions for modern challenges |

### Result

Displays a hero with manual variation styling:

- **White text color** for high contrast
- **100px top padding** for increased vertical spacing
- **Custom line height** (69px) for h2 headings
- **No horizontal padding** on headings
- Full-width responsive images
- Left-aligned text with vertical centering

### Use Case

Perfect for hero sections that need:

- High-contrast white text
- Extra spacing at the top
- Professional business presentations
- Dark background images

---

## Example 3: Hero with Techem Variation (Centered)

### Google Docs Table

| Hero (techem) |
|---------------|
| ![Mobile tech image](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Desktop tech image](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| ### Innovative Technology Solutions |
| Building the future together |

### Result

Displays a centered hero with techem styling:

- **Center-aligned text** for symmetrical layout
- **Maximum width constraint** (77pc) for readability
- **Large h3 headings** (3rem font size, 4rem line height)
- **White text color** throughout
- Full-width responsive images
- Centered content vertically and horizontally

### Use Case

Ideal for:

- Corporate landing pages
- Technology company homepages
- Centered marketing messages
- Balanced, symmetrical layouts

---

## Example 4: Hero with Embolden Variation

### Google Docs Table

| Hero (embolden) |
|-----------------|
| ![Mobile strong image](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| ![Desktop strong image](https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg) |
| # Make a Bold Statement |
| Stand out from the crowd |

### Result

Displays a hero with bold text emphasis:

- **Bolder font weight** applied to all text
- Standard hero layout (left-aligned, vertically centered)
- Full-width responsive images
- Increased visual impact through typography

### Use Case

Perfect for:

- Strong calls-to-action
- Brand statements
- Attention-grabbing headlines
- Emphasis-driven messaging

---

## Example 5: Combined Variations (Manual + Embolden)

### Google Docs Table

| Hero (manual, embolden) |
|-------------------------|
| ![Mobile bold hero](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Desktop bold hero](https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png) |
| ## Uncompromising Quality |
| Excellence in every detail |

### Result

Combines multiple variation effects:

- **Bold font weight** (from embolden)
- **White text color** (from manual)
- **100px top padding** (from manual)
- **Custom line heights** (from manual)
- Full-width responsive images
- Maximum visual impact

### Use Case

Ideal for:

- Premium product launches
- High-impact statements
- Luxury brand messaging
- Emphasis on quality and excellence

---

## Example 6: Simple Hero (Text Only)

### Google Docs Table

| Hero |
|------|
| ![Mobile background](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Desktop background](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| # Simple Message |

### Result

Minimal hero with single heading:

- Full-width responsive images
- Single heading overlaid on image
- Vertically centered, left-aligned
- Clean, focused presentation
- Minimum visual clutter

### Use Case

Best for:

- Minimalist design
- Simple landing pages
- Focus on imagery with subtle text
- Clean, modern aesthetics

---

## Example 7: Multi-Paragraph Hero

### Google Docs Table

| Hero |
|------|
| ![Mobile scene](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| ![Desktop scene](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |
| # Comprehensive Solutions |
| We provide end-to-end services for your business needs. |
| From strategy to execution, we're with you every step of the way. |

### Result

Hero with multiple text elements:

- Full-width responsive images
- Heading followed by two paragraphs
- All text vertically centered and left-aligned
- More detailed messaging
- Maintains readability with proper spacing

### Use Case

Suitable for:

- Detailed value propositions
- Service descriptions
- Multi-point messaging
- Comprehensive introductions

---

## Creating Hero Images

### Image Requirements

**Mobile Image (First):**

- Aspect ratio: 4:3 or 3:4 (portrait)
- Minimum width: 768px
- Recommended width: 768px - 1024px
- File format: JPEG or WebP
- File size: < 200KB (optimized)

**Desktop Image (Second):**

- Aspect ratio: 16:9 or 21:9 (landscape)
- Minimum width: 1920px
- Recommended width: 1920px - 2560px
- File format: JPEG or WebP
- File size: < 500KB (optimized)

### Image Content Guidelines

1. **Subject Placement**:
   - Mobile: Center the subject (safe area for portrait orientation)
   - Desktop: Can use wider composition with subject positioned left or right

2. **Text Overlay Area**:
   - Leave space for text overlay (typically left side or center)
   - Avoid busy backgrounds in text areas
   - Consider adding subtle gradient or overlay in image editing

3. **Contrast**:
   - Ensure sufficient contrast between image and text
   - Test with white and dark text
   - Use darker images for white text, lighter for dark text

4. **Focus Points**:
   - Identify key focal points that work in both orientations
   - Avoid important details at edges (may be cropped)
   - Test images at different viewport sizes

---

## Responsive Behavior

### Breakpoint Reference

| Viewport Width | Image Source | Typical Devices |
|----------------|--------------|-----------------|
| < 768px | Mobile image (first) | Phones, small tablets |
| >= 768px | Desktop image (second) | Tablets (landscape), laptops, desktops |

### Height Behavior

The hero block uses flexible height:

- **Default**: `min-height: 1000px`
- **Override**: Can be customized via CSS
- **Responsive**: Height adjusts based on content when content exceeds min-height
- **Flexible**: Use CSS media queries for responsive height changes

---

## Content Authoring Tips

### Writing Hero Text

1. **Keep It Concise**: Hero text should be brief and impactful
2. **Use Hierarchy**: Start with h1 or h2, followed by supporting text
3. **Action-Oriented**: Consider calls-to-action or value propositions
4. **Readable Length**: Aim for 5-15 words for headings, 15-30 for descriptions

### Image Selection

1. **Visual Impact**: Choose striking, high-quality images
2. **Brand Alignment**: Ensure images align with brand aesthetics
3. **Emotional Connection**: Select images that evoke desired emotions
4. **Text Compatibility**: Consider how text will overlay the image

### Variation Selection

| Variation | Best For | Text Style | Alignment |
|-----------|----------|------------|-----------|
| Default | General use | Standard | Left |
| Manual | Business/professional | White, padded | Left |
| Techem | Tech companies | Large, centered | Center |
| Embolden | Bold statements | Bold weight | Left |
| Manual + Embolden | Premium brands | Bold, white | Left |

---

## Testing Your Hero

### Visual Testing Checklist

- [ ] Test on mobile devices (< 768px)
- [ ] Test on tablets (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify text is readable on both images
- [ ] Check image transitions at breakpoint (768px)
- [ ] Confirm images cover full width
- [ ] Validate minimum height is appropriate
- [ ] Test with different text lengths
- [ ] Verify variation styles apply correctly
- [ ] Check accessibility (contrast, alt text)

### Performance Testing

- [ ] Measure image load times
- [ ] Verify image optimization
- [ ] Test with slow 3G connection
- [ ] Check Core Web Vitals (LCP < 2.5s)
- [ ] Validate image format (WebP with JPEG fallback)

---

## Common Patterns

### Pattern 1: Homepage Hero

`

| Hero (techem) |
|---------------|
| ![Mobile homepage](mobile-home.jpg) |
| ![Desktop homepage](desktop-home.jpg) |
| ### Welcome to [Brand Name] |
| Your tagline or value proposition here |
`

### Pattern 2: Product Launch

`

| Hero (manual, embolden) |
|-------------------------|
| ![Mobile product](mobile-product.jpg) |
| ![Desktop product](desktop-product.jpg) |
| ## Introducing [Product Name] |
| Revolutionary features that change everything |
`

### Pattern 3: Service Overview

`

| Hero |
|------|
| ![Mobile service](mobile-service.jpg) |
| ![Desktop service](desktop-service.jpg) |
| # [Service Name] |
| Professional solutions tailored to your needs |
`

### Pattern 4: Campaign Landing

`

| Hero (embolden) |
|-----------------|
| ![Mobile campaign](mobile-campaign.jpg) |
| ![Desktop campaign](desktop-campaign.jpg) |
| # [Campaign Title] |
| Join thousands of satisfied customers today |
`

---

## Advanced Customization

### Custom CSS Override Examples

**Adjust Height:**
`
main .hero {
    min-height: 600px;
}
`

**Add Text Shadow:**
`
main .hero h1,
main .hero h2 {
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
}
`

**Add Dark Overlay:**
`
main .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
}
`

**Center All Content:**
`
main .hero {
    justify-content: center;
    align-items: center;
    text-align: center;
}
`

---

## Accessibility Best Practices

### Alt Text Examples

**Good Alt Text:**

- "Mountain landscape at sunset with hiker silhouette"
- "Modern office space with collaborative workspace"
- "Close-up of product packaging on wooden surface"

**Bad Alt Text:**

- "image1.jpg"
- "hero image"
- "picture of something"

### Contrast Requirements

- WCAG AA: Minimum 4.5:1 ratio for normal text
- WCAG AAA: Minimum 7:1 ratio for normal text
- Large text (18px+): Minimum 3:1 ratio (AA)

### Keyboard Navigation

The hero block is non-interactive and doesn't require keyboard navigation. If you add interactive elements (buttons, links), ensure they are keyboard accessible.

---

## Troubleshooting Common Issues

### Issue: Both Images Display

**Solution:** Ensure exactly two picture elements are in the content:
`

| Hero |
|------|
| ![First image](mobile.jpg) |
| ![Second image](desktop.jpg) |
| # Title |
`

### Issue: Text Not Visible

**Solution:** Add text shadow or dark overlay:
`
main .hero h1 {
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
}
`

### Issue: Wrong Breakpoint

**Solution:** The 768px breakpoint is standard. Override if needed:
`
main .hero picture source {
    media: (min-width: 900px);
}
`

But note: This requires editing the generated HTML, not recommended.

### Issue: Hero Too Tall on Mobile

**Solution:** Add responsive height:
`
@media (max-width: 767px) {
    main .hero {
        min-height: 400px;
    }
}
`
