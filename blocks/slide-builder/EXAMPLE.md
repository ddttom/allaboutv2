# Slide Builder Examples

## Basic Usage

The Slide Builder block automatically fetches slides from `/slides/query-index.json` and requires no content in the markdown table.

### Example 1: Simple Slide Builder

| Slide Builder |
|---------------|

**Result:** Creates an interactive slide gallery with all slides from the query-index.json file.

---

## With Section Styling

You can add section-level styling using metadata tables below the block.

### Example 2: With Background Gradient

| Slide Builder |
|---------------|

---

| Metadata      |               |
|---------------|---------------|
| style         | background: linear-gradient(to bottom, #f0f0f0, #ffffff); padding: 2rem 0; |

**Result:** Slide gallery with a subtle gradient background and extra padding.

---

## Multiple Instances

You can use multiple Slide Builder blocks on the same page.

### Example 3: Two Slide Builders

# Featured Slides

| Slide Builder |
|---------------|

---

# More Content

| Slide Builder |
|---------------|

**Result:** Two independent slide galleries, both fetching from the same query-index.json source.

**Note:** To show different content in each instance, you would need to create a block variation or modify the fetch URL.

---

## Full Page Example

Here's a complete page example with heading, description, and slide builder:

# Explore York

Discover the historic city of York through our interactive slide gallery. Click any slide to learn more about these amazing attractions.

| Slide Builder |
|---------------|

---

| Metadata      |               |
|---------------|---------------|
| style         | background: #f9f9f9; padding: 3rem 1rem; |

## Plan Your Visit

Use the slide gallery above to explore top attractions in York. Each slide provides detailed information about the location, history, and visitor tips.

**Result:** A complete landing page with context and styling around the Slide Builder block.

---

## Expected Data Structure

The block expects `/slides/query-index.json` to contain:

`query-index.json Structure`
`{`
`"data": [`
`{`
`"path": "/slides/york-minster",`
`"title": "York Minster",`
`"description": "A magnificent Gothic cathedral",`
`"image": "https://allabout.network/media_123.png",`
`"lastModified": 1234567890`
`},`
`{`
`"path": "/slides/the-shambles",`
`"title": "The Shambles",`
`"description": "A picturesque medieval street",`
`"image": "https://allabout.network/media_456.jpeg",`
`"lastModified": 1234567891`
`}`
`]`
`}`

Each slide page (e.g., `/slides/york-minster.md`) should contain:

- An `<h2>` heading
- At least one paragraph after the h2 (becomes "supporting text")
- Full content to display in the panel overlay

---

## Responsive Behavior

### Desktop (width > 799px)

- All slide HTML content is pre-fetched on page load
- Supporting text (first paragraph) is visible below description
- Panel opens instantly when clicked

### Mobile (width ≤ 799px)

- HTML content is fetched on-demand when slide is clicked
- Supporting text is hidden for cleaner layout
- Panel opens with slight delay while content loads

---

## Styling Tips

### Custom Background Colors

| Slide Builder |
|---------------|

---

| Metadata      |               |
|---------------|---------------|
| style         | background: #1a1a1a; |

**Result:** Dark background behind slides (works well with image overlays).

---

### Full-Width Layout

| Slide Builder |
|---------------|

---

| Metadata      |               |
|---------------|---------------|
| style         | width: 100vw; margin-left: calc(50% - 50vw); padding: 2rem calc(50vw - 50%); |

**Result:** Breaks out of content container for full-width slide gallery.

---

### Centered with Max Width

| Slide Builder |
|---------------|

---

| Metadata      |               |
|---------------|---------------|
| style         | max-width: 1200px; margin: 0 auto; |

**Result:** Constrains slide gallery to 1200px width and centers it.

---

## Content Authoring Notes

### Creating Slide Pages

1. Create a new markdown file in `/slides/` directory
2. Add frontmatter (not shown in panel, used by query-index.json)
3. Start content with an `<h2>` heading
4. Write at least one paragraph after the h2 (this becomes supporting text)
5. Add remaining content (images, text, etc.)

`Example Slide Page (/slides/castle-museum.md)`
`---`
`title: Castle Museum`
`description: A fascinating journey through Victorian life`
`image: https://allabout.network/media_789.jpeg`
`---`
``
`## Castle Museum History`
``
`Step back in time at York Castle Museum, where recreated Victorian streets bring history to life.`
``
`The museum features authentic period rooms, vintage toys, and the famous Dick Turpin cell. Visitors can explore centuries of York's social history through interactive exhibits and carefully preserved artifacts.`
``
`### Visitor Information`
``
`- **Opening Hours**: 10am - 5pm daily`
`- **Admission**: Adults £12, Children £6`
`- **Location**: Eye of York, York YO1 9RY`

**Result:**

- **Title in grid**: "Castle Museum"
- **Description in grid**: "A fascinating journey through Victorian life"
- **Supporting text in grid**: "Step back in time at York Castle Museum..."
- **Panel content**: Full page content including all headings, paragraphs, and lists

---

## Troubleshooting Examples

### No Slides Appearing

**Check these files:**

1. Does `/slides/query-index.json` exist?
2. Is the JSON valid?
3. Are there items in the `data` array?

**Console errors to look for:**

- `Failed to fetch` - JSON file doesn't exist or is inaccessible
- `Unexpected token` - JSON syntax error
- CORS errors - Server configuration issue

---

### Images Not Loading

**Possible causes:**

1. Image URLs in query-index.json are broken
2. CORS headers missing on image server
3. WebP not supported (should fall back to original)

**Debug steps:**

1. Check browser console for image errors
2. Verify image URL works when opened directly
3. Test in different browsers (check WebP support)

---

### Panel Content Not Showing

**Possible causes:**

1. `.plain.html` file doesn't exist for slide path
2. Path in query-index.json has trailing slash (shouldn't)
3. Fetch error (check console)

**Debug steps:**

1. Check if `{path}.plain.html` exists (e.g., `/slides/york-minster.plain.html`)
2. Verify path format: `/slides/slide-name` (no trailing slash)
3. Test fetch URL manually in browser

---

## Advanced Customization

### Custom Fetch URL

To fetch slides from a different source, modify line 18 in `slide-builder.js`:

`Default Fetch`
`const response = await fetch("/slides/query-index.json");`

`Custom Source`
`const response = await fetch("/custom-content/query-index.json");`

---

### Custom Image Optimization

To change image optimization parameters, modify lines 50-52 in `slide-builder.js`:

`Current Settings`
`const finalImageUrl = supportsWebP`
`? \`\${imageUrl}?width=2000&format=webply&optimize=medium\``
`  : imageUrl;`

`High Quality Settings`
`const finalImageUrl = supportsWebP`
`? \`\${imageUrl}?width=3000&format=webply&optimize=high\``
`  : imageUrl;`

---

## Performance Notes

### Desktop Performance

- **Initial load**: Fetches query-index.json + all slide HTML (parallel)
- **Image loading**: Lazy loaded via IntersectionObserver
- **Panel display**: Instant (HTML already cached)

### Mobile Performance

- **Initial load**: Fetches only query-index.json
- **Image loading**: Lazy loaded via IntersectionObserver
- **Panel display**: Slight delay (fetches HTML on-demand)

### Recommendations

- Keep slide HTML content under 50KB for fast mobile loading
- Optimize images before upload (don't rely solely on query params)
- Limit number of slides to 20-30 for best performance
- Use WebP format for images when possible (automatic fallback included)

---

## Accessibility Considerations

### Current Features

- Close button has `aria-label="Close panel"`
- Semantic HTML structure (h2, p tags)
- High contrast text overlays

### Recommended Enhancements

1. Add keyboard navigation (Escape key to close)
2. Add focus trap when panel is open
3. Add `role="dialog"` to panel
4. Add `aria-label` to slide items
5. Add keyboard navigation between slides

---

## Related Examples

### Cards Block

Similar grid layout but with simpler content model:

| Cards |
|-------|
| Title 1 |
| Description 1 |
| Title 2 |
| Description 2 |

### Carousel Block

Alternative presentation with navigation:

| Carousel |
|----------|
| Slide 1 content |
| Slide 2 content |

### Gallery Block

Image-focused alternative:

| Gallery |
|---------|
| ![Image 1](image1.jpg) |
| ![Image 2](image2.jpg) |
