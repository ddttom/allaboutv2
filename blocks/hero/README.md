# Hero Block

A responsive hero block that displays large banner images with optional text overlays. The block intelligently handles responsive images by merging mobile and desktop image sources into a single picture element.

## Features

- **Responsive Image Handling**: Automatically combines two images (mobile + desktop) into a single responsive picture element
- **Text Overlay Support**: Display centered or left-aligned text content over hero images
- **Multiple Variations**: Style variations for different use cases (manual, techem, embolden)
- **Full-Width Display**: Hero images span the full viewport width with customizable height
- **Flexible Positioning**: Control text alignment and positioning within the hero area
- **Background Image Pattern**: Images display as full-coverage backgrounds with absolute positioning

## Technical Implementation

### Image Merging Logic

The hero block uses a unique approach to responsive images:

1. **Accepts Two Images**: Authors provide two separate images in the content
2. **Extracts Sources**: The block locates the second source element from each picture
3. **Merges Sources**: Replaces the first picture's second source with the second picture's second source
4. **Removes Duplicate**: Deletes the second picture element after merging
5. **Result**: Single picture element with responsive sources for mobile and desktop

This approach allows authors to visually see both images in the authoring environment while producing a clean, single-picture output in production.

### DOM Structure

**Input (from EDS):**

```html
<div class="hero">
  <div>
    <picture>
      <source media="(min-width: 768px)" srcset="desktop1.jpg">
      <img src="mobile1.jpg">
    </picture>
  </div>
  <div>
    <picture>
      <source media="(min-width: 768px)" srcset="desktop2.jpg">
      <img src="mobile2.jpg">
    </picture>
  </div>
  <div>
    <h1>Hero Title</h1>
    <p>Hero description text</p>
  </div>
</div>
```

**Output (after decorate):**

```html
<div class="hero">
  <div>
    <picture>
      <source media="(min-width: 768px)" srcset="desktop2.jpg">
      <img src="mobile1.jpg">
    </picture>
  </div>
  <div>
    <h1>Hero Title</h1>
    <p>Hero description text</p>
  </div>
</div>
```

The block keeps the mobile image from the first picture and the desktop image from the second picture.

## Usage

### Basic Hero

Add a hero block with two images (mobile and desktop):

```
| Hero |
|------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| # Welcome to Our Site |
| Discover amazing content |
```

The block will merge the two images into a single responsive picture element.

### Hero with Text Overlay

```
| Hero |
|------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| ## Your Journey Starts Here |
| Experience the difference |
```

### Manual Variation

Use the `manual` variation for custom styling with white text and increased top padding:

```
| Hero (manual) |
|---------------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| ## Manual Style Hero |
| Custom formatted content |
```

**Features:**

- White text color
- 100px top padding
- Custom line height (69px) for h2 elements
- No horizontal padding on headings

### Techem Variation

Use the `techem` variation for centered text layout:

```
| Hero (techem) |
|---------------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| ### Centered Hero Content |
| Perfectly centered messaging |
```

**Features:**

- Center-aligned text
- Maximum width constraint (77pc)
- Large h3 font size (3rem)
- Custom line height (4rem)
- White text color

### Embolden Variation

Use the `embolden` variation for bold text emphasis:

```
| Hero (embolden) |
|-----------------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| # Bold Statement |
| Make an impact |
```

**Features:**

- Bolder font weight for all text
- Combines with other variations

## CSS Customization

### Container Override

The hero block removes the standard EDS max-width constraint:

```css
main .hero-container > div {
    max-width: unset;
}
```

This allows hero images to span the full viewport width.

### Custom Height

Default minimum height is 1000px. Override in your project's styles:

```css
main .hero {
    min-height: 600px; /* Shorter hero */
}
```

Or use responsive heights:

```css
main .hero {
    min-height: 400px;
}

@media (min-width: 768px) {
    main .hero {
        min-height: 800px;
    }
}
```

### Text Positioning

Default text alignment is left with vertical centering. Customize positioning:

```css
main .hero {
    justify-content: center; /* Center horizontally */
    align-items: flex-start; /* Top alignment */
    text-align: center; /* Center text */
}
```

### Image Styling

Hero images use absolute positioning with full coverage:

```css
main .hero picture {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    object-fit: cover;
}
```

The `z-index: -1` ensures images stay behind text content.

## Variations Reference

### Available Variations

- **manual**: White text, increased padding, custom line heights
- **techem**: Centered text, large headings, white color scheme
- **embolden**: Bold text weight throughout

### Combining Variations

Variations can be combined for compound effects:

```
| Hero (manual, embolden) |
|-------------------------|
| ![Mobile Hero](mobile-hero.jpg) |
| ![Desktop Hero](desktop-hero.jpg) |
| ## Bold Manual Hero |
```

This combines the manual variation's padding and line heights with embolden's bold text weight.

## Content Authoring Guidelines

### Image Selection

**Mobile Image (First):**

- Portrait orientation recommended
- Focus subject in center
- Minimum width: 375px
- Optimized file size for mobile bandwidth

**Desktop Image (Second):**

- Landscape orientation recommended
- Wider field of view
- Minimum width: 1920px
- Higher resolution acceptable for desktop

### Text Overlay Best Practices

1. **Contrast**: Ensure text is readable against your images
2. **Brevity**: Keep hero text concise and impactful
3. **Hierarchy**: Use heading levels to establish visual hierarchy
4. **Readability**: Consider adding text shadows or dark overlays if needed

### Text Readability Enhancement

If text is difficult to read over images, add a semi-transparent overlay:

```css
main .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: -1;
}
```

Or use text shadows for better contrast:

```css
main .hero h1,
main .hero h2,
main .hero p {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
```

## Responsive Behavior

### Default Breakpoint

The block respects standard EDS responsive image breakpoints:

- Mobile: `< 768px` uses the first image's source
- Desktop: `>= 768px` uses the second image's source (merged from second picture)

### Height Adjustments

The CSS includes responsive height adjustments:

```css
/* Default */
.hero-wrapper .hero {
    height: 32.5rem;
}

/* Can be overridden for mobile */
@media (max-width: 767px) {
    .hero-wrapper .hero {
        height: 24rem;
    }
}
```

## Accessibility

### Image Alt Text

Always provide meaningful alt text for hero images:

```
| Hero |
|------|
| ![Sunset over mountains with person hiking](mobile-hero.jpg) |
| ![Wide landscape view of mountain range at golden hour](desktop-hero.jpg) |
| # Adventure Awaits |
```

Alt text should:

- Describe the image content meaningfully
- Avoid redundant phrases like "image of"
- Be concise but descriptive
- Convey the mood or message of the image

### Text Contrast

Ensure text has sufficient contrast (WCAG AA minimum 4.5:1 ratio):

- Use high-contrast text colors
- Add semi-transparent overlays if needed
- Test with contrast checking tools

### Heading Structure

Maintain proper heading hierarchy:

- Use h1 for primary hero message (if it's the page's main heading)
- Use h2 or h3 for secondary hero text
- Don't skip heading levels

## Performance Considerations

### Image Optimization

1. **Format**: Use modern formats (WebP with JPEG fallback)
2. **Compression**: Optimize images before upload (70-80% quality)
3. **Dimensions**:
   - Mobile: Max width 768px
   - Desktop: Max width 2560px
4. **File Size**:
   - Mobile: < 200KB recommended
   - Desktop: < 500KB recommended

### Loading Strategy

The hero block loads with the page (not lazy-loaded) as it's typically above-the-fold content.

## Troubleshooting

### Images Not Merging

**Problem**: Both images display instead of merging.

**Solution**: Ensure you have exactly two picture elements in the first div:

```
| Hero |
|------|
| ![Mobile](mobile.jpg) |
| ![Desktop](desktop.jpg) |
| # Title |
```

### Text Not Visible

**Problem**: Text is hidden or not displaying.

**Solution**: Check z-index values. Hero images have `z-index: -1`, so text should have default stacking context.

### Wrong Image Showing

**Problem**: Mobile image shows on desktop or vice versa.

**Solution**: The block uses the mobile image from the FIRST picture and desktop image from the SECOND picture. Ensure images are in correct order.

### Height Too Tall/Short

**Problem**: Hero is too tall or too short for your content.

**Solution**: Override the `min-height` property in your custom CSS:

```css
main .hero {
    min-height: 500px; /* Adjust as needed */
}
```

## Examples

### Standard Hero

```
| Hero |
|------|
| ![Mobile landscape](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) |
| ![Desktop landscape](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |
| # Explore Nature |
| Discover the great outdoors |
```

### Centered Hero (Techem)

```
| Hero (techem) |
|---------------|
| ![Mobile city](mobile-city.jpg) |
| ![Desktop city](desktop-city.jpg) |
| ### Urban Innovation |
| Building tomorrow's cities today |
```

### Bold Hero (Manual, Embolden)

```
| Hero (manual, embolden) |
|-------------------------|
| ![Mobile product](mobile-product.jpg) |
| ![Desktop product](desktop-product.jpg) |
| ## Premium Quality |
| Uncompromising excellence |
```

## Related Blocks

- **Banner**: Similar to hero but with simpler image handling
- **Section**: Container block for organizing page content
- **Cards**: For multi-item hero alternatives

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Picture element support required
- Flexbox support required
- CSS absolute positioning required

## Version History

- Initial implementation: Responsive image merging pattern
- Recent fix (2025-11-28): Changed from `document.querySelector` to `block.querySelector` for proper scoping

## Author

Developer: Tom Cranstoun
Company: tom
Block Type: EDS Native (Simple)
