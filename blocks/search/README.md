# Search Block

A powerful site-wide search block that provides real-time search functionality with intelligent ranking and result highlighting. The block fetches data from query-index.json, filters results based on search terms, and displays them with visual highlighting of matched terms.

## Features

- **Real-Time Search**: Results update as users type with intelligent debouncing
- **Smart Ranking**: Results ranked by relevance - header matches before meta matches
- **Result Highlighting**: Search terms highlighted with `<mark>` elements in results
- **Responsive Design**: Grid layout adapts from mobile to desktop
- **Multiple Variations**: Standard card-based view or minimal list view
- **Query Persistence**: Search terms persist in URL for sharing and bookmarking
- **Accessible Interface**: ARIA labels and semantic HTML for screen readers
- **Image Support**: Optional result thumbnails with optimized picture elements
- **Minimum Character Threshold**: Prevents empty searches with 3-character minimum
- **Clear Search**: ESC key clears search and removes URL parameters

## Technical Implementation

### Search Algorithm

The search block uses a two-tier ranking algorithm:

1. **Header/Title Matching**: Results with search terms in title or header fields
2. **Meta Content Matching**: Results with terms in title, description, or path

Within each tier, results are sorted by the position of the first match (earlier matches rank higher).

### Data Source

The block fetches data from query-index.json (configurable via block content):

**Default source**: `/query-index.json`
**Custom source**: Provide a link in the block content

Expected data structure:

```json
{
  "data": [
    {
      "path": "/page-path",
      "title": "Page Title",
      "header": "Page Header",
      "description": "Page description text",
      "image": "/path/to/image.jpg",
      "lastModified": "1234567890"
    }
  ]
}
```

### Highlighting Algorithm

The `highlightTextElements` function:

1. Searches text content for all search terms (case-insensitive)
2. Records match positions and original term casing
3. Sorts matches by position to avoid overlap
4. Creates document fragments with `<mark>` elements wrapping matched terms
5. Preserves original text casing in highlights

### URL State Management

Search terms are synchronized with URL query parameters:

- Searching updates URL: `?q=search+terms`
- URL parameters populate search on page load
- Clearing search removes URL parameters
- Enables sharing search results via URL

### DOM Structure

**Input (from EDS):**

```html
<div class="search">
  <div>
    <p><a href="/custom-query-index.json">Custom Source</a></p>
  </div>
</div>
```

**Output (after decorate):**

```html
<div class="search">
  <div class="search-box">
    <span class="icon icon-search"></span>
    <input type="search" class="search-input" placeholder="Search..." aria-label="Search...">
  </div>
  <ul class="search-results" data-h="H2">
    <li>
      <a href="/page-path">
        <div class="search-result-image">
          <picture>...</picture>
        </div>
        <h2 class="search-result-title">
          <a href="/page-path">Page <mark>Title</mark></a>
        </h2>
        <p>Page <mark>description</mark> text</p>
      </a>
    </li>
  </ul>
</div>
```

## Usage

### Basic Search

Add a search block to any page:

```
| Search |
|--------|
```

This uses the default `/query-index.json` data source.

### Custom Data Source

Specify a custom query-index.json location:

```
| Search |
|--------|
| /blog/query-index.json |
```

Or use a full URL:

```
| Search |
|--------|
| https://example.com/data/query-index.json |
```

### Minimal Variation

Use the `minimal` variation for a compact list view:

```
| Search (minimal) |
|-------------------|
```

**Features:**

- List-style results (not grid)
- Small circular thumbnails on the left
- Link-colored titles with underline on hover
- More compact spacing

## CSS Customization

### Search Box Styling

Customize the search input appearance:

```css
main .search .search-box input {
    border: 2px solid var(--primary-color);
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 1.1rem;
}
```

### Grid Layout

Adjust result card columns:

```css
main .search ul.search-results {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
}
```

For fixed columns:

```css
@media (min-width: 768px) {
    main .search ul.search-results {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### Result Cards

Customize card appearance:

```css
main .search ul.search-results > li {
    border: 2px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

main .search ul.search-results > li:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Highlight Styling

Customize the `<mark>` element appearance:

```css
main .search mark {
    background-color: var(--highlight-color, yellow);
    color: var(--highlight-text-color, inherit);
    font-weight: bold;
    padding: 0 2px;
}
```

## Variations Reference

### Available Variations

- **Standard (default)**: Grid layout with card-based results
- **minimal**: Compact list layout with small thumbnails

### Standard Variation

Best for:

- Homepage search
- Feature pages
- Image-heavy content
- Browse-style search experiences

Layout:

- Responsive grid (auto-fill columns)
- Large result cards with images
- Image aspect ratio: 4:3
- Border around each card

### Minimal Variation

Best for:

- Documentation pages
- Sidebar search
- Text-heavy content
- Quick reference searches

Layout:

- Vertical list with left-aligned items
- Small circular thumbnails (24px)
- No borders around items
- Link-colored titles

## Content Authoring Guidelines

### Data Preparation

Ensure your query-index.json includes:

**Required Fields:**

- `path`: Absolute path to page
- `title`: Page title for display

**Recommended Fields:**

- `header`: Primary heading for better ranking
- `description`: Short description for previews
- `image`: Thumbnail path for visual results

**Optional Fields:**

- `lastModified`: Timestamp for sorting/filtering
- Any custom metadata fields

### Search Optimization

**Title Best Practices:**

1. Keep titles concise and descriptive
2. Include key terms users might search for
3. Avoid keyword stuffing
4. Use natural language

**Description Guidelines:**

1. Write clear, informative descriptions (100-160 characters)
2. Include relevant keywords naturally
3. Summarize page content accurately
4. Make descriptions actionable

**Image Selection:**

1. Use descriptive, relevant images
2. Optimize for web (WebP format)
3. Keep file sizes small (< 100KB)
4. Use consistent aspect ratios (4:3 recommended)

### Search Experience

**Placeholder Text:**
Customize via EDS placeholders in your placeholders.json:

```json
{
  "searchPlaceholder": "Search our site...",
  "searchNoResults": "No results found for your search."
}
```

## Responsive Behavior

### Breakpoints

The search block adapts across screen sizes:

**Mobile (< 768px):**

- Single column grid
- Full-width cards
- Larger touch targets
- Simplified layout

**Tablet (768px - 1024px):**

- 2-column grid
- Medium card sizes
- Balanced spacing

**Desktop (> 1024px):**

- 3+ column grid (auto-fill)
- Optimal card sizes
- Maximum readability

### Grid Responsiveness

The grid uses `auto-fill` with minimum card width (278px default):

```css
grid-template-columns: repeat(auto-fill, minmax(278px, 1fr));
```

This automatically adjusts column count based on viewport width.

## Accessibility

### Keyboard Navigation

**Supported Interactions:**

- `Tab`: Focus search input
- `Type`: Enter search terms
- `Escape`: Clear search and results
- `Tab`: Navigate through results
- `Enter`: Activate result link

### Screen Reader Support

The block includes:

- `aria-label` on search input
- Semantic HTML structure (`<ul>`, `<li>`, `<a>`)
- Proper heading hierarchy (data-h attribute)
- Descriptive link text
- Alt text on images

### Focus Management

Focus indicators are visible on:

- Search input field
- Result links
- Clear functionality (ESC key)

### ARIA Labels

Customize ARIA labels via placeholders:

```json
{
  "searchPlaceholder": "Search documentation"
}
```

The placeholder text is automatically used as the `aria-label`.

## Performance Considerations

### Data Loading

**Fetch Strategy:**

1. Data loads on first search (not on page load)
2. Results cached after first fetch
3. No repeated API calls during same session
4. Minimal initial page weight

### Optimization Tips

**query-index.json Size:**

- Keep under 500KB for best performance
- Consider paginating for very large sites
- Remove unnecessary fields
- Compress images referenced in data

**Image Loading:**

- Images lazy-load as results appear
- Uses `createOptimizedPicture` for responsive sources
- Width attribute (375px) controls image loading
- Consider WebP format for smaller file sizes

### Debouncing

The search input uses browser-native input event (no artificial debouncing), which provides:

- Natural typing feel
- Instant feedback
- Browser-optimized performance

## Troubleshooting

### No Results Showing

**Problem**: Search returns no results even with valid terms.

**Solution**: Check your query-index.json structure:

1. Verify `data` array exists at root level
2. Ensure `path` and `title` fields exist in each item
3. Check for CORS issues if using external JSON
4. Verify JSON is valid (use JSON validator)

### Highlighting Not Working

**Problem**: Search terms not highlighted in results.

**Solution**: The `highlightTextElements` function requires:

1. Text content in result elements
2. Valid search terms (non-empty)
3. Case-insensitive matching

If highlighting fails silently, check browser console for errors.

### Wrong Data Source

**Problem**: Block fetches from wrong query-index.json location.

**Solution**: The block determines source from:

1. First link (`<a href>`) in block content, OR
2. Default: `/query-index.json` at site root

Ensure your custom link is properly formatted:

```
| Search |
|--------|
| /custom/path/query-index.json |
```

### Search Persists After Navigation

**Problem**: Search results show when returning to page.

**Solution**: This is intentional behavior! The `?q=` parameter persists in URL for:

- Sharing search results
- Bookmarking searches
- Browser back/forward navigation

To clear, press ESC or remove `?q=` from URL.

### Images Not Displaying

**Problem**: Result thumbnails don't appear.

**Solution**: Check that:

1. `image` field exists in query-index.json data
2. Image paths are correct (absolute or relative to site root)
3. Images are accessible (check 404 errors in Network tab)
4. CORS allows image loading if hosted externally

### Minimum Character Issue

**Problem**: Results don't appear until 3 characters typed.

**Solution**: This is intentional to prevent:

- Empty searches
- Single-letter result overload
- Performance issues with broad searches

To change threshold, modify line 200 in search.js:

`Change from`
`if (searchValue.length < 3) {`
`To custom threshold`
`if (searchValue.length < 2) { // 2 characters minimum`

## Examples

### Homepage Search

```
| Search |
|--------|
```

### Blog Search

```
| Search |
|--------|
| /blog/query-index.json |
```

### Documentation Search (Minimal)

```
| Search (minimal) |
|-------------------|
| /docs/query-index.json |
```

### Product Search

```
| Search |
|--------|
| /products/query-index.json |
```

## Integration Examples

### With Hero Block

Combine search with hero for landing page:

```
| Hero |
|------|
| ![Mobile](mobile.jpg) |
| ![Desktop](desktop.jpg) |
| # Find What You Need |
| Search our comprehensive knowledge base |

---

| Search |
|--------|
```

### In Section Layout

Add search to a section:

```
| Section |
|---------|
| ## Search Our Site |
| Find articles, guides, and resources |
| Search |
```

### Sidebar Search

Use minimal variation in sidebar:

```
| Search (minimal) |
|-------------------|
| /blog/query-index.json |
```

## Related Blocks

- **Filter**: For faceted search with filtering
- **Tags**: For tag-based content discovery
- **Index**: For browsing content hierarchically
- **Blogroll**: For chronological content listing

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- Fetch API support required
- CSS Grid support required
- Input type="search" support recommended
- Mark element support required

## Security Considerations

### Input Sanitization

The block sanitizes user input by:

- Using `textContent` instead of `innerHTML` for user input
- Creating DOM elements programmatically (not via string templates)
- Properly escaping search terms in HTML output

### XSS Protection

Search terms are safe from XSS because:

- Input uses `textContent` property (auto-escapes)
- Results use `createTextNode` for text insertion
- Mark elements created programmatically
- No `innerHTML` with user data

### Data Validation

The block validates:

- JSON response structure (`json.data` exists)
- HTTP response status (400/500 errors caught)
- Empty responses logged as errors
- Malformed data handled gracefully

## Advanced Configuration

### Custom Heading Levels

The block intelligently determines heading levels for results based on page context using `findNextHeading` function.

**Automatic Detection:**

- Scans preceding elements for headings (H1-H6)
- Uses next level in hierarchy (e.g., after H2, uses H3)
- Falls back to H2 if no headings found
- Respects semantic HTML structure

**Override in CSS:**

```css
main .search .search-result-title {
    font-size: var(--heading-font-size-m);
}
```

### Custom Result Rendering

To customize result appearance, override the `renderResult` function or add CSS targeting specific elements:

```css
/* Custom result layout */
main .search ul.search-results > li > a {
    display: grid;
    grid-template-areas:
        "image title"
        "image description";
    grid-template-columns: 150px 1fr;
}

main .search .search-result-image {
    grid-area: image;
}

main .search .search-result-title {
    grid-area: title;
}

main .search ul.search-results > li p {
    grid-area: description;
}
```

## Version History

- Original implementation: Adobe block collection (basic search)
- Current implementation: Enhanced ranking, highlighting, and responsive design

## Author

Block Type: EDS Native (Simple)
Source: Adobe block collection
Enhanced for: allaboutV2 project
Developer: Tom Cranstoun
Company: tom
