---
title: "View MyBlog Block"
description: "Documentation for the view-myblog EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# View MyBlog Block

A dynamic blog viewer that fetches and displays blog content from a structured JSON feed. Automatically generates latest posts, filters index pages, provides category navigation, and adapts layout based on content structure. Perfect for blog landing pages, content hubs, and documentation portals.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Usage](#usage)
5. [Content Structure](#content-structure)
6. [Styling & Customization](#styling--customization)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)
9. [Performance](#performance)
10. [Browser Support](#browser-support)
11. [Troubleshooting](#troubleshooting)
12. [Testing](#testing)
13. [Dependencies](#dependencies)
14. [Future Enhancements](#future-enhancements)

---

## Overview

The view-myblog block dynamically loads and displays blog content from a JSON data source (typically `my-blog.json`). It intelligently organizes content into featured sections (Latest Posts, Most Visited), provides category navigation, and displays categorized blog posts with descriptions and metadata.

**Primary Use Cases:**

- Blog landing pages with featured content
- Multi-category content hubs
- Documentation portals with organized sections
- Resource libraries with quick navigation
- Publication showcases with external links
- Any site requiring dynamic blog content display

**Block Name:** `view-myblog`

**Location:** `/blocks/view-myblog/`

**Files:**

- `view-myblog.js` - Data fetching and content rendering
- `view-myblog.css` - Layout, styling, and responsive design
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Auto-Generated Latest Posts**
   - Automatically creates latest posts section if not provided
   - Collects posts from all categories
   - Sorts by lastModified date (newest first)
   - Returns top 3 most recent posts
   - Filters out index pages automatically

2. **Intelligent Index Page Filtering**
   - Removes URLs ending with `/`
   - Filters paths ending with `/index`, `/index.html`, `/index.htm`
   - Case-insensitive URL matching
   - Applied across all sections (latest, categories, map)
   - Ensures only content pages are displayed

3. **Single Category Mode**
   - Detects when only one active category exists
   - Hides Latest Posts section in single-category mode
   - Hides Category Map when not needed
   - Simplifies UI for focused content
   - Reduces visual clutter

4. **Dynamic Category Map**
   - Interactive navigation table
   - Shows category name, article count, focus area
   - Click-to-jump anchor navigation
   - Recalculates counts after index filtering
   - Only displayed with multiple active categories

5. **Featured Sections**
   - Latest Posts section (newest 3 articles)
   - Most Visited section (popular content)
   - Gradient backgrounds for visual distinction
   - Blue gradient for Latest Posts
   - Orange gradient for Most Visited

6. **Category Sorting Options**
   - Default: newest-first (as received from JSON)
   - Optional: oldest-first (sorts by lastModified ascending)
   - Configured per category via `sortOrder` metadata
   - Useful for tutorial series or sequential content

7. **Additional Resources Support**
   - Special category type with external links
   - Displays as quick links list
   - Opens in new tabs with security attributes
   - Hover effects for link interaction
   - Different rendering from blog posts

8. **Empty Category Hiding**
   - Automatically hides categories with zero posts
   - Occurs after index page filtering
   - Improves UI cleanliness
   - Prevents broken navigation

---

## Technical Architecture

### JavaScript Structure

The block follows a modular function-based architecture with helper functions for each component type:

**Main Flow:**

1. `decorate(block)` - Entry point, fetches data and orchestrates rendering
2. `generateLatestPosts()` - Creates latest posts from categories
3. `isIndexPage()` - Filters index page URLs
4. `createBlogEntry()` - Renders individual post article
5. `createFeaturedSection()` - Builds Latest/Most Visited sections
6. `createCategoryMap()` - Generates navigation table
7. `createCategorySection()` - Renders category with posts

### Configuration Pattern

The block uses inline configuration within the decorate function:

`Configuration Object`
`const config = {`
`dataUrl: blockContent || '/my-blog.json',`
`errorMessage: 'Unable to load blog content. Please try again later.'`
`};`

**Configuration Values:**

- `dataUrl` - JSON feed location (default: `/my-blog.json`)
- `errorMessage` - User-friendly error text

### Index Page Detection

The `isIndexPage()` function filters out index pages that should not appear in blog listings:

`Index Page Patterns`
`function isIndexPage(url) {`
`const urlPath = url.toLowerCase();`
`return urlPath.endsWith('/') ||`
`urlPath.endsWith('/index') ||`
`urlPath.endsWith('/index.html') ||`
`urlPath.endsWith('/index.htm');`
`}`

**Why this matters:**

- Index pages are navigation pages, not content
- Prevents duplicate listings
- Improves content quality
- Reduces noise in featured sections

### Auto-Generation Logic

The `generateLatestPosts()` function creates a latest posts section when not provided:

`Latest Posts Generation`
`function generateLatestPosts(categories) {`
`const allPosts = [];`
`categories.forEach((category) => {`
`if (category.posts) {`
`category.posts.forEach((post) => {`
`if (!isIndexPage(post.url)) {`
`allPosts.push(post);`
`}`
`});`
`}`
`});`
`allPosts.sort((a, b) => {`
`const dateA = new Date(a.lastModified || '1970-01-01');`
`const dateB = new Date(b.lastModified || '1970-01-01');`
`return dateB - dateA;`
`});`
`return allPosts.slice(0, 3);`
`}`

**Algorithm:**

1. Collect all posts from all categories
2. Filter out index pages
3. Sort by lastModified (newest first)
4. Return top 3 posts

### Single Category Detection

The block counts active categories to determine display mode:

`Active Category Counting`
`let activeCategoryCount = 0;`
`data.categories.forEach((category) => {`
`if (category.posts) {`
`const nonIndexPosts = category.posts.filter(`
`post => !isIndexPage(post.url)`
`);`
`if (nonIndexPosts.length > 0) {`
`activeCategoryCount++;`
`}`
`} else if (category.links) {`
`activeCategoryCount++;`
`}`
`});`

**Display Logic:**

- `activeCategoryCount === 1` - Hide Latest Posts and Category Map
- `activeCategoryCount > 1` - Show all navigation features

### Category Sorting

Categories can specify sort order via metadata:

`Category Sort Order`
`let posts = [...category.posts];`
`if (category.sortOrder === 'oldest-first') {`
`posts.sort((a, b) => {`
`const dateA = new Date(a.lastModified || '1970-01-01');`
`const dateB = new Date(b.lastModified || '1970-01-01');`
`return dateA - dateB;`
`});`
`}`

**Options:**

- `newest-first` (default) - No sorting needed
- `oldest-first` - Ascending date sort

### Additional Resources Pattern

The block handles link-based categories differently from post categories:

`Link-Based Category Rendering`
`if (category.links) {`
`const linksList = document.createElement('ul');`
`category.links.forEach((link) => {`
`const li = document.createElement('li');`
`const a = document.createElement('a');`
`a.href = link.url;`
`a.textContent = link.title;`
`a.target = '_blank';`
`a.rel = 'noopener noreferrer';`
`li.appendChild(a);`
`linksList.appendChild(li);`
`});`
`}`

**Security Attributes:**

- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Security headers

### Error Handling

The block uses try-catch with user-friendly error states:

`Error Handling Pattern`
`try {`
`block.innerHTML = '<p class="view-myblog-loading">Loading...</p>';`
`const response = await fetch(config.dataUrl);`
`if (!response.ok) {`
`throw new Error('HTTP ' + response.status);`
`}`
`const data = await response.json();`
`} catch (error) {`
`console.error('View MyBlog block failed:', error);`
`block.innerHTML = '<p class="view-myblog-error">' +`
`config.errorMessage + '</p>';`
`}`

**Error Flow:**

1. Show loading state immediately
2. Fetch data with error checking
3. On error, log to console and show user message
4. User sees friendly message, not technical details

### CSS Architecture

The block uses a comprehensive styling system with section-specific treatments:

**Base Layout:**

- `.view-myblog` - Base container with light gray background
- `.view-myblog-content` - Max-width 1400px, centered
- `.view-myblog-featured` - Featured sections container
- `.view-myblog-categories` - Category sections container

**Featured Section Styling:**

- `.view-myblog-section--latest` - Blue gradient background
- `.view-myblog-section--popular` - Orange gradient background
- Colored left borders (4px)
- Matching title colors

**Category Map:**

- `.view-myblog-category-map` - White card with shadow
- `.view-myblog-category-table` - Full-width responsive table
- Blue header background
- Centered article counts
- Hover effects on links

**Blog Entries:**

- `.view-myblog-entry` - White cards with shadows
- `.view-myblog-entry-title` - Blue links with hover effects
- `.view-myblog-entry-description` - Gray descriptive text
- `.view-myblog-entry-meta` - Small gray metadata

---

## Usage

### Basic Usage

To add a blog viewer to your page, use the View MyBlog block in your markdown:

`Basic Block Usage`
`| View MyBlog |`
`| --- |`

This will fetch data from the default location (`/my-blog.json`).

### Custom Data Source

To specify a different JSON data source:

`Custom Data URL`
`| View MyBlog |`
`| --- |`
`| /custom-path/blog-data.json |`

The block will fetch from the specified path instead of the default.

### Block Parameters

**Content Table Structure:**

- **Row 1:** Block name (`View MyBlog`)
- **Row 2:** Optional data URL (defaults to `/my-blog.json`)

### Placement Guidelines

**Best Practices:**

- Use as main content block on blog landing pages
- Place near top of page for visibility
- Avoid multiple instances per page (single viewer recommended)
- Ensure JSON data source is accessible
- Test with actual blog data before publishing

**Typical Page Structure:**

`Blog Landing Page Example`
`# My Blog`
``
`Welcome to my blog about web development and technology.`
``
`| View MyBlog |`
`| --- |`

---

## Content Structure

### JSON Feed Structure

The block expects a JSON feed with the following structure:

`Complete JSON Structure`
`{`
`"metadata": {`
`"last-updated": "2025-11-26"`
`},`
`"latestPosts": [`
`{`
`"title": "Article Title",`
`"url": "https://example.com/article",`
`"description": "Article summary text",`
`"lastModified": "2025-11-19"`
`}`
`],`
`"mostVisited": [`
`{`
`"title": "Popular Article",`
`"url": "https://example.com/popular",`
`"description": "Popular content summary"`
`}`
`],`
`"categoryMap": [`
`{`
`"id": "category-id",`
`"name": "Category Name",`
`"count": 10,`
`"description": "Category focus area"`
`}`
`],`
`"categories": [`
`{`
`"id": "category-id",`
`"name": "Category Name",`
`"sortOrder": "newest-first",`
`"posts": [`
`{`
`"title": "Post Title",`
`"url": "/path/to/post",`
`"description": "Post description",`
`"lastModified": "2025-11-15"`
`}`
`]`
`}`
`]`
`}`

### Required Fields

**Post Objects:**

- `title` (string) - Post title
- `url` (string) - Post URL
- `description` (string) - Post summary

**Optional Fields:**

- `lastModified` (string) - ISO date string

**Category Objects:**

- `id` (string) - Unique identifier for anchors
- `name` (string) - Display name
- `posts` (array) - Array of post objects
- `sortOrder` (string) - Optional: "oldest-first" or "newest-first"

**Link-Based Categories:**

- `id` (string) - Category identifier
- `name` (string) - Category name
- `links` (array) - Array of link objects

**Link Objects:**

- `title` (string) - Link text
- `url` (string) - Link destination

### Auto-Generated Fields

**latestPosts:**

- If not provided or empty, automatically generated
- Top 3 posts by lastModified across all categories
- Index pages filtered out

**categoryMap counts:**

- Recalculated after index page filtering
- Empty categories removed from map

---

## Styling & Customization

### CSS Variables

The block uses hardcoded colors that could be refactored to CSS variables:

`Potential Color Variables`
`--latest-gradient-start: #f5f7fa;`
`--latest-gradient-end: #c3cfe2;`
`--latest-border-color: #667eea;`
`--latest-title-color: #667eea;`
``
`--popular-gradient-start: #ffeaa7;`
`--popular-gradient-end: #fdcb6e;`
`--popular-border-color: #e17055;`
`--popular-title-color: #e17055;`

**Note:** These are not currently implemented as CSS variables but could be refactored for easier theming.

### Customization Points

**Color Scheme:**

- Featured section gradients (`.view-myblog-section--latest`, `.view-myblog-section--popular`)
- Link colors (`.view-myblog-entry-title a`)
- Category table header (`.view-myblog-category-table thead`)

**Spacing:**

- Section margins and padding
- Entry card spacing
- Mobile responsive adjustments

**Typography:**

- Font sizes for titles and descriptions
- Line heights and letter spacing
- Font weights

### Variation Support

The block currently does not support variations. All instances use the same styling.

**Potential Variations (Future):**

- Compact view (smaller cards, less spacing)
- Grid layout (multi-column category display)
- Timeline view (chronological with date headers)
- Minimal view (no gradients, simple list)

---

## Responsive Behavior

### Breakpoints

The block uses a single mobile breakpoint:

`Mobile Breakpoint`
`@media (max-width: 768px) {`
`/* Mobile styles */`
`}`

### Mobile Adaptations

**Layout Changes:**

- Reduced padding on all sections (1.5rem to 0.75rem)
- Smaller font sizes for titles
- Reduced table cell padding
- Adjusted margins for tighter spacing

**Typography:**

- Section titles: 1.4rem to 1.2rem
- Entry titles: 1.05rem to 1rem
- Table text: default to 0.85rem

**Spacing:**

- Featured section padding: 1.5rem to 0.75rem
- Category map padding: 1.25rem to 1rem
- Category map margins adjusted for narrower viewports

### Desktop Experience

**Optimal Viewing:**

- Max-width 1400px with centered layout
- Generous padding for readability
- Full-size category navigation table
- Larger touch targets for links

---

## Accessibility

### Semantic HTML

**Structure:**

- `<article>` for blog entries
- `<section>` for category groups
- `<nav>` for category map
- `<h2>` for section titles
- `<h3>` for entry titles

### ARIA Attributes

**Category Map:**

`Navigation Landmark`
`<nav class="view-myblog-category-map"`
`aria-label="Category navigation">`

This identifies the category table as a navigation landmark for screen readers.

### Keyboard Navigation

**Interactive Elements:**

- All links are keyboard accessible (tab navigation)
- Focus indicators on links (browser default)
- No keyboard traps
- Logical tab order (top to bottom)

### Link Accessibility

**External Links:**

- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Security headers

**Screen Reader Context:**

- Link text clearly describes destination
- Article titles are wrapped in heading elements
- Categories announced as navigation

### Color Contrast

**Current Implementation:**

- Blue links (#667eea) on white background
- High contrast for readability
- Hover states darken links (#764ba2)

**Recommendations:**

- Verify WCAG AA compliance (4.5:1 minimum)
- Test gradient backgrounds for text readability
- Ensure metadata text (#999) meets contrast requirements

### Loading States

**User Feedback:**

- "Loading blog content..." shown during fetch
- Clear error messages on failure
- No silent failures

---

## Performance

### Loading Strategy

**Lazy Loading:**

- Block uses EDS delayed loading by default
- Content loads when scrolled into viewport
- Reduces initial page load time

**Data Fetching:**

- Single fetch request for all blog data
- JSON response cached by browser
- No multiple API calls per category

### Rendering Optimization

**DOM Construction:**

- Elements created once and appended
- No repeated DOM queries
- Efficient `forEach` loops for rendering

**Index Page Filtering:**

- Filter operations performed once on data load
- Cached results used for all sections
- No repeated filtering during rendering

### Bundle Size

**JavaScript:**

- ~13KB unminified
- No external dependencies
- Pure vanilla JavaScript
- Minimal runtime overhead

**CSS:**

- ~5KB unminified
- Self-contained styles
- No CSS framework dependencies

### Network Considerations

**Single Request:**

- One JSON fetch for all content
- Browser caching applies
- CDN-friendly static JSON

**Image Loading:**

- No images loaded by block itself
- Linked pages load their own assets
- Reduces initial page weight

---

## Browser Support

### Modern Browsers

**Full Support:**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used:**

- ES6 async/await
- Template literals
- Arrow functions
- Array methods (forEach, filter, sort, slice, map)
- Spread operator (...)
- Optional chaining (?.) for metadata access

### Polyfill Requirements

**Not Required:**

- No polyfills needed for modern browsers
- All features widely supported

**Legacy Browser Support:**

- IE11: Not supported (uses ES6+ syntax)
- Older browsers require transpilation

### Progressive Enhancement

**Graceful Degradation:**

- Error states show friendly messages
- Failed fetches display error UI
- No silent failures

**No JavaScript:**

- Without JavaScript, block shows loading state
- EDS decorates blocks via JavaScript (required)
- Consider fallback static content

---

## Troubleshooting

### Common Issues

**Issue: Blog content not loading**

Symptoms:

- Loading spinner stays visible
- Error message appears
- Console shows fetch errors

Solutions:

1. Verify JSON data URL is correct and accessible
2. Check browser console for network errors
3. Ensure JSON is valid (use JSON validator)
4. Verify CORS headers if fetching from different domain
5. Check server returns correct content-type (application/json)

**Issue: No latest posts appearing**

Symptoms:

- Latest Posts section is empty
- Only category sections visible

Solutions:

1. Verify categories contain posts with lastModified dates
2. Check that posts are not all index pages
3. Ensure at least 3 non-index posts exist across categories
4. Verify multiple active categories exist (single-category mode hides latest posts)

**Issue: Category Map not showing**

Symptoms:

- Category navigation table missing
- Jump-to-category links not available

Solutions:

1. Check if only one active category exists (map hidden in single-category mode)
2. Verify categoryMap array exists in JSON
3. Ensure categories have non-zero post counts after filtering
4. Check categoryMap IDs match category IDs

**Issue: Empty categories displaying**

Symptoms:

- Category sections with no posts
- Blank category areas

Solutions:

1. Verify posts array is not empty in JSON
2. Check if all posts are index pages (filtered out)
3. Ensure post objects have required fields (title, url, description)

**Issue: Links not working**

Symptoms:

- Clicking links does nothing
- Console shows errors

Solutions:

1. Verify post URLs are valid and complete
2. Check for JavaScript errors in console
3. Ensure `target="_blank"` and `rel` attributes are correct
4. Test links directly in browser address bar

**Issue: Styling looks broken**

Symptoms:

- Layout is misaligned
- Colors are wrong
- Responsive design not working

Solutions:

1. Clear browser cache and reload
2. Check view-myblog.css is loading (Network tab)
3. Verify no CSS conflicts with global styles
4. Test in different browsers
5. Check for console errors blocking decoration

---

## Testing

### Browser Testing

**Test File:**
`test.html` provides a local testing environment with:

- EDS core integration (`aem.js`)
- Sample blog data
- Isolated block testing
- Multiple test scenarios

**Test Scenarios:**

1. **Full Data Test**
   - All sections present (Latest, Most Visited, Categories)
   - Multiple categories
   - Category Map displayed

2. **Single Category Test**
   - Only one active category
   - Latest Posts section hidden
   - Category Map hidden

3. **Index Page Filtering Test**
   - Mix of content and index pages
   - Verify index pages filtered out
   - Counts recalculated correctly

4. **Additional Resources Test**
   - Link-based category
   - External links open correctly
   - Hover effects working

5. **Error Handling Test**
   - Invalid JSON URL
   - Network failure simulation
   - Error message displays

### Manual Testing Checklist

**Visual Testing:**

- Latest Posts section displays top 3 articles
- Most Visited section shows popular content
- Category Map renders with correct counts
- Category sections display posts correctly
- Additional Resources shows as link list
- Gradients and colors render correctly
- White cards have shadows
- Links change color on hover

**Functional Testing:**

- JSON data loads successfully
- Index pages filtered from all sections
- Category Map links jump to correct sections
- External links open in new tabs
- Loading state shows during fetch
- Error state shows on fetch failure
- Single-category mode hides Latest Posts and Map

**Responsive Testing:**

- Mobile layout applies at 768px
- Table remains readable on mobile
- Padding and margins adjust correctly
- Font sizes scale appropriately
- Touch targets are adequately sized

**Accessibility Testing:**

- Screen reader announces sections correctly
- Tab navigation works through all links
- ARIA labels present on navigation
- Semantic HTML structure correct
- Color contrast meets WCAG standards

**Performance Testing:**

- Single JSON fetch occurs
- No layout shifts during load
- Rendering completes quickly (<100ms)
- Browser cache utilized on reload

### Development Server

Run the local development server:

`Development Server Command`
`npm run debug`

Navigate to: `http://localhost:3000/blocks/view-myblog/test.html`

---

## Dependencies

### External Dependencies

**None** - The block is fully self-contained with no external libraries.

### EDS Core Integration

**Required:**

- `/scripts/aem.js` - Core EDS decoration system
- `/scripts/scripts.js` - Global script initialization

**Block Registration:**
Blocks are automatically discovered and decorated by EDS core. No manual registration required.

### Browser APIs Used

**Fetch API:**

- `fetch()` - JSON data retrieval
- `Response.ok` - HTTP status checking
- `Response.json()` - JSON parsing

**DOM API:**

- `document.createElement()` - Element creation
- `Element.appendChild()` - DOM manipulation
- `Element.classList` - Class management
- `Element.innerHTML` - Content setting
- `Element.setAttribute()` - Attribute management

**JavaScript Built-ins:**

- `Array.forEach()` - Iteration
- `Array.filter()` - Filtering
- `Array.sort()` - Sorting
- `Array.slice()` - Array subsetting
- `Array.map()` - Data transformation
- `Date` - Date parsing and comparison
- `String` methods - URL manipulation

---

## Future Enhancements

### Planned Features

1. **Search and Filtering**
   - Client-side search across all posts
   - Filter by category
   - Filter by date range
   - Tag-based filtering

2. **Pagination**
   - Limit posts per category
   - "Load More" buttons
   - Infinite scroll option
   - Page number navigation

3. **Enhanced Sorting**
   - Sort by title (A-Z)
   - Sort by popularity (visit count)
   - Sort by relevance (if search added)
   - User-selectable sort order

4. **Visual Enhancements**
   - Featured images for posts
   - Author avatars
   - Read time estimates
   - Tag badges

5. **Interaction Improvements**
   - Smooth scroll to categories
   - Expand/collapse categories
   - Animated transitions
   - Skeleton loading states

6. **Configuration Options**
   - Configurable featured post count (currently 3)
   - Configurable scroll threshold
   - Show/hide sections via parameters
   - Custom color schemes via variations

7. **Analytics Integration**
   - Track link clicks
   - Measure category engagement
   - Monitor search usage
   - Export analytics data

8. **Accessibility Improvements**
   - Skip navigation links
   - Enhanced keyboard shortcuts
   - High contrast mode
   - Reduced motion support

### Refactoring Opportunities

**CSS Variables Implementation:**

- Replace hardcoded colors with CSS variables
- Centralize spacing values
- Create themeable color system

**Configuration Object Enhancement:**

- Move all configuration to top of file
- Support runtime configuration
- Enable per-instance customization

**Performance Optimizations:**

- Implement virtual scrolling for long lists
- Lazy load category images if added
- Debounce search input if added
- Optimize sort operations

**Code Organization:**

- Extract helper functions to shared utilities
- Create separate modules for rendering
- Implement component-based architecture
- Add JSDoc documentation

---

## Related Blocks

**Similar Blocks:**

- `blog-listing` - Alternative blog listing implementation
- `content-hub` - Multi-source content aggregation
- `resource-library` - Document and resource organization

**Complementary Blocks:**

- `search` - Add search capability to blog
- `tags` - Tag filtering system
- `author-bio` - Author information display
- `related-posts` - Contextual post recommendations

---

## Changelog

**v1.0.0 (Initial Release)**

- Dynamic JSON data loading
- Auto-generated latest posts
- Index page filtering
- Single category mode
- Category Map with navigation
- Featured sections (Latest, Most Visited)
- Additional Resources support
- Category sorting options
- Responsive mobile design
- Error handling and loading states

---

## License

This block is part of the AllAboutV2 EDS project and follows the project's licensing terms.

---

## Support

For issues, questions, or contributions:

- Create an issue in the project repository
- Review test.html for implementation examples
- Consult EDS documentation for core concepts
- Check EXAMPLE.md for content author guidance
