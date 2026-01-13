# Slide Builder Block

## Purpose

The Slide Builder block creates an interactive slide gallery that fetches content from `/slides/query-index.json` and displays slides as clickable cards with background images. When a slide is clicked, it opens a full-page panel overlay displaying the complete HTML content from the slide's page.

## Features

- Fetches slides dynamically from query-index.json
- Lazy loads background images using IntersectionObserver
- Supports WebP format with automatic fallback
- Responsive behavior (desktop vs mobile)
- Click-to-expand panels with full HTML content
- Pre-fetches content on desktop for faster interaction
- On-demand loading on mobile for performance
- Numbered roundels for slide identification
- Supporting text extraction from slide HTML

## Content Model

The block does not require content in the markdown table - it automatically fetches slides from `/slides/query-index.json`.

**Simple usage:**

| Slide Builder |
|---------------|
|               |

**Alternative (explicit empty cell):**

| Slide Builder |
|---------------|
| &nbsp;        |

## Data Structure

The block expects `/slides/query-index.json` to contain an array of slide objects with the following structure:

`JSON Structure`
`{`
`"data": [`
`{`
`"path": "/slides/slide-name",`
`"title": "Slide Title",`
`"description": "Brief description of the slide",`
`"image": "https://example.com/image.jpg",`
`"lastModified": 1234567890`
`}`
`]`
`}`

**Required fields:**

- `path` - URL path to the slide page (used to fetch `.plain.html`)
- `title` - Displayed as the slide heading
- `description` - Displayed as bold text below title
- `image` - Background image URL (optimized with query params)

**Optional fields:**

- `lastModified` - Unix timestamp (not used by block but standard in query-index.json)

## How It Works

### 1. Slide Fetching

On page load, the block:

1. Fetches `/slides/query-index.json`
2. Parses the JSON data
3. **Desktop (>799px)**: Pre-fetches HTML content for all slides
4. **Mobile (≤799px)**: Skips HTML pre-fetching for performance

### 2. Slide Rendering

For each slide, the block creates a slide item with:

- Background image (lazy loaded via IntersectionObserver)
- Numbered roundel (position indicator)
- Text container with title and description
- Supporting text (first paragraph after h2 in HTML content)

### 3. Image Optimization

Images are optimized based on WebP support:

- **WebP supported**: Adds `?width=2000&format=webply&optimize=medium`
- **WebP not supported**: Uses original image URL
- Lazy loading with 100px root margin for smoother experience

### 4. Supporting Text Extraction

The block extracts supporting text from each slide's HTML:

1. Parses the HTML content using DOMParser
2. Finds the first `<h2>` element
3. Extracts the first `<p>` tag after the h2
4. Displays the paragraph text below the description
5. **Mobile**: Hidden via CSS for cleaner layout

### 5. Panel Interaction

When a slide is clicked:

1. Creates a full-page overlay panel
2. Fetches HTML content if not already loaded (mobile)
3. Displays the complete slide HTML in a scrollable container
4. Provides a close button (× symbol) to dismiss the panel

### 6. Responsive Behavior

**Desktop (width > 799px):**

- Pre-fetches all HTML content on load
- Shows supporting text below description
- Instant panel display on click

**Mobile (width ≤ 799px):**

- Defers HTML fetching until needed
- Hides supporting text (CSS)
- Fetches on-demand when slide is clicked

## Technical Implementation

### JavaScript Architecture

**Main Function: decorate(block)**
Entry point that orchestrates the entire block functionality.

**Helper Functions:**

1. `fetchSlideHtml(path)` - Fetches `.plain.html` content from slide path
2. `fetchSlides()` - Retrieves and processes query-index.json data
3. `fetchSupportingText(html)` - Extracts first paragraph after h2
4. `setSlideBackground(slideItem, imageUrl)` - Handles lazy image loading
5. `createPanel(slideData)` - Creates and displays overlay panel
6. `createSlideItem(slideData, index)` - Builds individual slide card

### WebP Detection

`WebP Support Detection`
`const supportsWebP = window.createImageBitmap`
`&& window.createImageBitmap.toString().includes("native code");`

This feature detection ensures WebP images are only used when natively supported by the browser.

### IntersectionObserver

The block uses IntersectionObserver for lazy loading images:

`Lazy Loading Implementation`
`const observer = new IntersectionObserver(`
`(entries, observer) => {`
`entries.forEach((entry) => {`
`if (entry.isIntersecting) {`
`const slideItem = entry.target;`
`const imageUrl = slideItem.dataset.bg;`
`setSlideBackground(slideItem, imageUrl);`
`observer.unobserve(slideItem);`
`}`
`});`
`},`
`{ rootMargin: "100px" }`
`);`

The 100px root margin starts loading images slightly before they enter the viewport.

### Panel Creation

Panels are created dynamically and appended to `document.body`:

`Panel Structure`
`<div class="slide-panel">`
`<div class="slide-panel-content">`
`<div class="slide-panel-body">`
`<!-- HTML content injected here -->`
`</div>`
`</div>`
`<button class="slide-panel-close" aria-label="Close panel">&times;</button>`
`</div>`

The close button has `z-index: 1001` to ensure it stays above panel content.

## CSS Structure

### Layout Classes

**Block Container:**

- `.slide-builder` - Full width container

**Slide Items:**

- `.slide-builder-item` - Individual slide card (600px height)
- `.slide-builder-item::before` - Numbered roundel (pseudo-element)
- `.slide-builder-item div` - Text container with semi-transparent background
- `.text-container` - Wrapper for title, description, and supporting text
- `.supporting-text` - First paragraph from slide HTML (hidden on mobile)

**Panel Overlay:**

- `.slide-panel` - Full-screen overlay backdrop (z-index: 1000)
- `.slide-panel-content` - White content container (80% max width/height)
- `.slide-panel-body` - Scrollable HTML content area
- `.slide-panel-close` - Close button (z-index: 1001)

### Responsive Design

**Mobile (max-width: 800px):**

- Supporting text hidden via `display: none`
- HTML content fetched on-demand
- Same panel behavior as desktop

**Desktop (min-width: 801px):**

- Supporting text visible
- HTML pre-fetched on load
- Faster panel display

### CSS Variables

The block uses semi-transparent backgrounds for text overlays:

`Text Overlay Styling`
`.slide-builder-item div {`
`background: rgba(0, 0, 0, 0.5);`
`color: white;`
`padding: 1em;`
`margin: 1em;`
`position: absolute;`
`bottom: 1em;`
`left: 1em;`
`}`

`Roundel Background`
`.slide-builder-item::before {`
`background-color: rgba(0, 0, 0, 0.7);`
`color: white;`
`border-radius: 50%;`
`width: 40px;`
`height: 40px;`
`}`

## Error Handling

The block includes comprehensive error handling:

**Fetch Errors:**

- Logs error to console if slide HTML fetch fails
- Returns `null` to prevent block from breaking
- Continues rendering other slides even if one fails

**Image Loading Errors:**

- Logs error to console if image fails to load
- Slide remains visible with title/description
- No fallback image to avoid layout shift

**Panel Creation:**

- Checks if HTML content exists before creating panel
- Fetches on-demand if not pre-loaded (mobile scenario)
- Logs error and aborts panel creation if fetch fails

## Performance Optimizations

1. **Lazy Image Loading** - Images load only when near viewport
2. **Conditional Pre-fetching** - Desktop pre-fetches, mobile defers
3. **WebP Format** - Smaller file sizes for supported browsers
4. **IntersectionObserver** - Efficient scroll-based loading
5. **Image Optimization Params** - `width=2000&format=webply&optimize=medium`
6. **DOM Reuse** - Panel elements removed on close (no memory leaks)

## Accessibility

- Close button has `aria-label="Close panel"` for screen readers
- Semantic HTML structure (h2, p tags)
- Keyboard-accessible close button
- High contrast text overlays (semi-transparent black backgrounds)

**Future Improvements:**

- Add keyboard navigation (Escape key to close panel)
- Add focus trap in open panel
- Add ARIA attributes for slide items (role, aria-label)

## Browser Compatibility

**Minimum Requirements:**

- ES6+ (async/await, arrow functions)
- IntersectionObserver API
- DOMParser API
- Fetch API

**Tested Browsers:**

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**WebP Support:**

- Chrome 23+
- Firefox 65+
- Edge 18+
- Safari 14+

## Dependencies

**Core EDS:**

- No dependencies on other blocks
- Uses standard EDS decoration pattern
- Works with EDS query-index.json format

**External Libraries:**

- None - vanilla JavaScript only

**Browser APIs:**

- IntersectionObserver
- DOMParser
- Fetch API
- createImageBitmap (for WebP detection)

## Common Issues

### Images Not Loading

**Problem:** Background images don't appear
**Solution:**

- Check `/slides/query-index.json` is accessible
- Verify image URLs are valid
- Check browser console for CORS errors
- Ensure WebP fallback works (test in older browsers)

### Panel Content Empty

**Problem:** Panel opens but shows no content
**Solution:**

- Verify `.plain.html` files exist for each slide path
- Check browser console for fetch errors
- Ensure slide path doesn't have trailing slash
- Test path construction: `${path}.plain.html`

### Supporting Text Not Showing

**Problem:** Only title/description visible, no supporting text
**Solution:**

- Verify slide HTML contains an `<h2>` tag
- Ensure there's a `<p>` tag after the h2
- Check browser width (hidden on mobile <800px)
- Inspect HTML structure in browser dev tools

### Panel Close Button Not Working

**Problem:** Can't close the panel overlay
**Solution:**

- Check z-index of close button (should be 1001)
- Verify click event listener is attached
- Ensure button is visible (white color on dark background)
- Check console for JavaScript errors

## Usage Examples

### Basic Implementation

`Basic Slide Builder`
`| Slide Builder |`
`|---------------|`

This creates a slide gallery fetching from `/slides/query-index.json`.

### With Section Metadata

`Slide Builder with Metadata`
`| Slide Builder |`
`|---------------|`
``
`---`
``
`| Metadata      |               |`
`|---------------|---------------|`
`| style         | background: linear-gradient(to bottom, #f0f0f0, #ffffff); |`

You can add section-level styling using metadata tables.

### Multiple Instances

You can have multiple Slide Builder blocks on the same page - each will independently fetch and render slides:

`Page with Multiple Slide Builders`
`# Gallery Section`
``
`| Slide Builder |`
`|---------------|`
``
`---`
``
`# Related Content`
``
`| Slide Builder |`
`|---------------|`

**Note:** Both instances will fetch the same `/slides/query-index.json` data. For different content, you would need to create a variation or modify the fetch URL.

## Development Notes

### Adding Slide Content

To add new slides:

1. Create slide page in `/slides/` directory (e.g., `/slides/new-slide.md`)
2. Add frontmatter with title, description, and image
3. Write slide content with at least one `<h2>` and paragraph
4. Publish to update `query-index.json`
5. Slide appears automatically in Slide Builder

### Customizing Image Optimization

To change image optimization parameters, modify the `setSlideBackground` function:

`Current Optimization`
`const finalImageUrl = supportsWebP`
`? \`\${imageUrl}?width=2000&format=webply&optimize=medium\``
`  : imageUrl;`

**Available parameters:**

- `width` - Image width in pixels (default: 2000)
- `format` - Image format (webply, webp, jpg, png)
- `optimize` - Optimization level (low, medium, high)

### Modifying Responsive Breakpoint

The 799px breakpoint is used in two places:

1. **JavaScript** - Line 23: `if (window.innerWidth > 799)`
2. **CSS** - Line 50: `@media (max-width: 800px)`

**To change breakpoint:**

- Update both values consistently
- Consider common device widths (768px for tablets, 1024px for small laptops)
- Test on actual devices

### Customizing Panel Behavior

The panel overlay can be customized by modifying the `createPanel` function:

**Add animation:**

```javascript
panel.style.opacity = '0';
document.body.appendChild(panel);
setTimeout(() => panel.style.opacity = '1', 10);
```

**Add keyboard support:**

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') panel.remove();
});
```

**Add backdrop click to close:**

```javascript
panel.addEventListener('click', (e) => {
  if (e.target === panel) panel.remove();
});
```

## File Structure

`Block Files`
`/blocks/slide-builder/`
`├── slide-builder.js       # Main block logic (159 lines)`
`├── slide-builder.css      # Block styles (89 lines)`
`├── README.md             # This documentation`
`├── EXAMPLE.md            # Usage examples`
`└── test.html             # Browser testing file`

## Version History

- **v1.0** - Initial implementation with basic slide grid
- **v1.1** - Added panel overlay functionality
- **v1.2** - Added responsive behavior and supporting text
- **v1.3** - Fixed block parameter usage (was using document.querySelector)

## Related Blocks

- **Cards** - Similar grid layout but simpler content model
- **Carousel** - Alternative slide presentation with navigation
- **Gallery** - Image-focused alternative without text overlays

## Author

Tom Cranstoun (tom)

## License

Part of the AllAboutV2 EDS project.
