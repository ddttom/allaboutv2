# View MyBlog Block

## Overview

The View MyBlog block dynamically fetches and displays blog content from a JSON data source, reproducing the layout and functionality of `my-blog.html` as an EDS block.

### Block Variations

- **Standard** (`view-myblog`): Displays all blog posts organized by category
- **AI Filter** (`view-myblog (ai)`): Shows only AI-related posts

## Features

- **Dynamic Content Loading**: Fetches blog data from `/my-blog.json`
- **Responsive Design**: Mobile-first responsive layout
- **Featured Sections**: Displays "Latest Posts" and "Most Visited" sections
- **Category Navigation**: Interactive category map with jump links
- **Full Blog Archives**: Renders all blog posts organized by category
- **Flexible Sorting**: Categories can specify sort order (oldest-first for tutorials)
- **Back to Top**: Fixed position back-to-top button with white text
- **Error Handling**: Graceful error handling with user-friendly messages

## Usage

### In Google Docs

**Standard variation (default JSON file):**
| view-myblog |
|-------------|

**Standard variation (custom JSON file):**
| view-myblog |
|-------------|
| /path/to/custom-blog.json |

**AI variation (filters for AI-related posts only):**
| view-myblog (ai) |
|------------------|

**AI variation (custom JSON file):**
| view-myblog (ai) |
|------------------|
| /path/to/custom-blog.json |

### In HTML

**Standard variation:**
```html
<div class="view-myblog">
  <!-- Content will be loaded here -->
</div>
```

**Standard variation with custom JSON:**
```html
<div class="view-myblog">
  /path/to/custom-blog.json
</div>
```

**AI variation:**
```html
<div class="view-myblog ai">
  <!-- Content will be loaded here -->
</div>
```

**AI variation with custom JSON:**
```html
<div class="view-myblog ai">
  /path/to/custom-blog.json
</div>
```

## Configuration

### JSON Data Source

By default, the block loads data from `/my-blog.json`. You can specify a custom JSON file path by adding it as the block content:

**In Google Docs:**
```
| view-myblog |
|-------------|
| /path/to/custom-blog.json |
```

**In HTML:**
```html
<div class="view-myblog">
  /path/to/custom-blog.json
</div>
```

If no path is specified, the block defaults to `/my-blog.json`.

### Content Structure

The JSON file should have the following structure:

```json
{
  "latestPosts": [
    {
      "title": "Post Title",
      "url": "/path/to/post",
      "description": "Post description"
    }
  ],
  "mostVisited": [
    {
      "title": "Popular Post",
      "url": "/path/to/post",
      "description": "Post description"
    }
  ],
  "categoryMap": [
    {
      "id": "category-id",
      "name": "Category Name",
      "count": 10,
      "description": "Category description"
    }
  ],
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "sortOrder": "oldest-first",
      "posts": [
        {
          "title": "Post Title",
          "url": "/path/to/post",
          "description": "Post description",
          "lastModified": "2025-01-15"
        }
      ]
    }
  ]
}
```

#### Sort Order

Categories can optionally specify a `sortOrder` field:
- `"oldest-first"` - Sorts posts by date ascending (oldest to newest). Perfect for tutorial series like "Part 0, Part 1, Part 2..."
- Default (no sortOrder specified) - Posts display in the order they appear in JSON (typically newest first)

## Styling

The block includes comprehensive CSS that matches the original `my-blog.html` design:

- **Latest Posts**: Blue gradient section
- **Most Visited**: Orange gradient section
- **Category Map**: Clean table with hover effects
- **Blog Entries**: Compact card layout with minimal white space
- **Responsive**: Optimized for mobile, tablet, and desktop

## Customization

### Styling

Modify `view-myblog.css` to customize:

- Colors (gradients, text, borders)
- Spacing (padding, margins)
- Typography (font sizes, weights)
- Responsive breakpoints

## Development

### Local Testing

1. Start the development server:
   ```bash
   npm run debug
   ```

2. Open the test file:
   ```
   http://localhost:3000/blocks/view-myblog/test.html
   ```

### Browser Testing

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Accessibility

- Semantic HTML elements (`<nav>`, `<article>`, `<section>`)
- ARIA labels for navigation
- Keyboard accessible links and buttons
- Proper heading hierarchy (h2 for sections, h3 for entries)
- Color contrast meets WCAG AA standards

## Performance

- Async data loading
- Minimal DOM manipulation
- Efficient CSS with no external dependencies
- Lazy loading ready (can be enhanced with Intersection Observer)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API

## Related Files

- **JavaScript**: `view-myblog.js` - Block decoration logic
- **CSS**: `view-myblog.css` - Block styles
- **Data**: `/my-blog.json` - Blog content data
- **Test**: `test.html` - Local development test file

## Notes

- The block fetches data from `/my-blog.json` at runtime
- All blog content is defined in the JSON file
- Category links use hash anchors (e.g., `#eds-integrations`)
- Back-to-top button uses smooth scroll behavior
- Error handling displays user-friendly messages

## AI Variation Details

### How It Works

The AI variation filters and displays only AI-related posts:

1. **Class Detection**: The `decorate()` function checks if the block has the `ai` class
2. **Filtering**: Posts are filtered if they match ANY of these criteria:
   - URL path contains `/ai/` (e.g., `/blogs/ddt/ai/how-ai-models-think`)
   - Title contains 'AI' (case-insensitive)
   - Title contains 'LLM' (case-insensitive)
3. **Restructuring**: Creates a single "All AI & LLM Posts" category with filtered posts
4. **Sorting**: Orders posts by date (newest first)
5. **Featured Section**: Shows "Latest AI Posts" with the 3 most recent AI articles

### Implementation

The variation is implemented in the main `view-myblog.js` file:

```javascript
export default async function decorate(block) {
  // Check if this is the AI variation
  const isAIVariation = block.classList.contains('ai');

  // Fetch and filter data
  const rawData = await response.json();
  const data = isAIVariation ? filterAIContent(rawData) : rawData;

  // Render with conditional title
  const latestTitle = isAIVariation ? 'Latest AI Posts' : 'Latest Posts';
}
```

### Customizing the AI Filter

To modify which posts are considered "AI-related", edit the `isAIRelated()` function in `view-myblog.js`:

```javascript
function isAIRelated(post) {
  const urlLower = post.url.toLowerCase();
  const titleLower = post.title.toLowerCase();

  // Add your custom filtering logic
  if (urlLower.includes('/ai/')) return true;
  if (titleLower.includes('ai') || titleLower.includes('llm')) return true;
  if (titleLower.includes('machine learning')) return true; // Example addition

  return false;
}
```

## Maintenance

To update blog content:
1. Edit `/my-blog.json` with new posts or categories
2. Content updates automatically without code changes
3. No need to rebuild or redeploy the block code
4. AI variation automatically picks up new AI-related posts
