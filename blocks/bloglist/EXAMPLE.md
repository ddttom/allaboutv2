# Bloglist Block - Usage Examples

This document shows how to use the bloglist block in Google Docs. The bloglist block automatically displays a curated list of blog posts from the site's query-index.json.

## Table of Contents

- [Basic Example](#basic-example)
- [How It Works](#how-it-works)
- [Display Format](#display-format)
- [Customization Options](#customization-options)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Basic Example

Create a simple single-cell table in Google Docs:

| Bloglist |
|----------|

**That's it!** The block requires no configuration - it automatically fetches and displays relevant blog posts.

---

## How It Works

The bloglist block automatically:

1. **Fetches** data from `/query-index.json` (EDS standard query index)
2. **Filters** for items containing "developer-guide" in the path
3. **Excludes** the current page (prevents showing current article in the list)
4. **Excludes** template and test pages (paths containing "template" or "test")
5. **Sorts** by last modified date (newest first)
6. **Limits** to 4 most recent items
7. **Displays** each item with:
   - Blog post image
   - Title (linked to the article)
   - Description
   - Last modified date (formatted as DD/Month/YYYY)

**No configuration needed** - the block handles everything automatically.

---

## Display Format

Each blog item is displayed as a card with:

- **Image**: Full-width card image (280px height, cover fit)
- **Title**: Bold, linked to the blog post
- **Description**: Brief summary of the content
- **Last Modified Date**: Formatted as "Last Modified: DD/Month/YYYY"
  - Example: "Last Modified: 15/November/2024"

The list uses a responsive grid layout:

- **Desktop**: Auto-fit columns with minimum 300px width
- **Mobile**: Single column layout (≤600px)

---

## Customization Options

### Currently Available

The bloglist block has **no variations** - it provides one consistent display format.

All styling and behavior are handled automatically:

- Filter: Hardcoded to "developer-guide" path
- Limit: Hardcoded to 4 items
- Sort: Always by lastModified (newest first)
- Exclusions: Always excludes current page and template/test pages

### Future Enhancements

If you need different filters or limits, consider:

- Creating a variation: `Bloglist (recent-5)` for 5 items
- Creating a variation: `Bloglist (category-tech)` for tech category
- Adding configuration support via block config

---

## Best Practices

### 1. Page Placement

**Where to use the bloglist block:**

- ✅ Blog post pages (shows related articles)
- ✅ Landing pages (shows recent content)
- ✅ Category pages (shows category articles)
- ✅ About/profile pages (shows author's articles)

**Where NOT to use:**

- ❌ Article list pages (use dedicated article-list block)
- ❌ Search results pages (conflicts with search functionality)
- ❌ Homepage (may want more control over featured content)

### 2. Content Requirements

**For the block to work, ensure:**

1. Your site has `/query-index.json` file (EDS automatically generates this)
2. Blog posts have "developer-guide" in their path
3. Blog posts have required metadata:
   - `title` - Article title
   - `path` - URL path to article
   - `image` - Featured image URL
   - `description` - Brief summary
   - `lastModified` - Unix timestamp

### 3. Performance Considerations

The block fetches data client-side:

- **Fast**: query-index.json is cached by EDS
- **Lightweight**: JSON file is typically <500KB
- **No server load**: All processing happens in browser

**Best practice**: The 4-item limit keeps the block performant.

### 4. Mobile Responsiveness

The block automatically adjusts for mobile:

- Grid changes to single column (≤600px)
- Card layout remains the same
- Images maintain aspect ratio
- Touch-friendly tap targets

**No additional configuration needed** for mobile.

---

## Complete Example

### Example: Developer Guide Landing Page

Create this in Google Docs:

| Bloglist |
|----------|

**Result on page:**

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│ [Blog Image 1]                      │  │ [Blog Image 2]                      │
│                                     │  │                                     │
│ **Building Your First EDS Block**  │  │ **Advanced Block Patterns**         │
│                                     │  │                                     │
│ Learn how to create custom EDS     │  │ Explore advanced patterns for       │
│ blocks from scratch...             │  │ complex interactions...             │
│                                     │  │                                     │
│ Last Modified: 15/November/2024    │  │ Last Modified: 10/November/2024    │
└─────────────────────────────────────┘  └─────────────────────────────────────┘

┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│ [Blog Image 3]                      │  │ [Blog Image 4]                      │
│                                     │  │                                     │
│ **EDS Testing Best Practices**     │  │ **Performance Optimization**        │
│                                     │  │                                     │
│ Master testing strategies for EDS  │  │ Optimize your EDS blocks for        │
│ development...                     │  │ maximum performance...             │
│                                     │  │                                     │
│ Last Modified: 05/November/2024    │  │ Last Modified: 01/November/2024    │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

## Styling Notes

The bloglist block includes:

### Desktop Layout (>600px)

- **Grid**: Auto-fit columns, minimum 300px per column
- **Gap**: 20px between cards
- **Card Padding**: 20px inside each card
- **Image**: Full-width, 280px height, object-fit cover
- **Border**: 1px solid #ccc around each card

### Mobile Layout (≤600px)

- **Grid**: Single column
- **Same styling** as desktop (no size adjustments)
- **Touch-friendly**: Cards easy to tap

### Date Separator

- Top border above "Last Modified" date
- Extends beyond card padding (left: -20px, right: -20px)
- Creates visual separation from description

---

## Testing Your Bloglist

After adding the block to your page:

1. **Preview on the staging site** to verify:
   - 4 blog items appear
   - Images load correctly
   - Titles link to correct articles
   - Dates format properly (DD/Month/YYYY)
   - Current page is excluded from the list

2. **Test data fetching:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for `/query-index.json` request
   - Verify it returns 200 status

3. **Check responsive behavior:**
   - Resize browser window
   - Verify grid changes to single column at 600px
   - Check that cards remain readable

4. **Validate filtering:**
   - Check that only "developer-guide" posts appear
   - Verify no template or test pages appear
   - Confirm items are sorted by date (newest first)

---

## Troubleshooting

### Issue: No blog items appear

**Possible causes:**

- `/query-index.json` file not found (404 error)
- No blog posts with "developer-guide" in path
- JavaScript error in browser console

**Solution:**

1. Open DevTools Console and check for errors
2. Verify `/query-index.json` exists and loads
3. Check that blog posts have "developer-guide" in their path
4. Ensure blog posts have all required metadata (title, path, image, description, lastModified)

### Issue: Wrong blog posts appear

**Possible causes:**

- Filter is hardcoded to "developer-guide" in path
- Blog posts don't have expected path structure

**Solution:**

1. Check the path structure of your blog posts
2. Verify they contain "developer-guide" substring
3. If you need different filtering, modify `bloglist.js` line 12-13

### Issue: Current page appears in list

**This should not happen** - the block explicitly excludes the current page.

**If it does happen:**

1. Check `window.location.pathname` in DevTools Console
2. Verify it matches the `path` value in query-index.json
3. File a bug report (this is a serious issue)

### Issue: More or fewer than 4 items appear

**The block is hardcoded to show 4 items** (line 22 in bloglist.js).

**If you need a different number:**

1. Modify line 22: `const limitedBlogItems = sortedBlogItems.slice(0, 4);`
2. Change `4` to your desired number
3. Consider creating a variation for different limits

### Issue: Dates format incorrectly

**Expected format**: DD/Month/YYYY (e.g., "15/November/2024")

**If dates are wrong:**

1. Check that `lastModified` in query-index.json is a Unix timestamp (seconds)
2. Verify browser console for date parsing errors
3. The block multiplies timestamp by 1000 (line 36) for JavaScript Date object

### Issue: Images don't load

**Possible causes:**

- Image URLs are invalid or broken
- Images are blocked by CORS policy
- Missing `image` field in query-index.json

**Solution:**

1. Check image URLs in query-index.json
2. Verify images are accessible (try opening in new tab)
3. Check DevTools Network tab for failed image requests
4. Ensure images are hosted on the same domain or have proper CORS headers

---

## Query-Index.json Structure

For reference, the expected structure of `/query-index.json`:

`Expected Structure`
`{`
`"total": 10,`
`"offset": 0,`
`"limit": 10,`
`"data": [`
`{`
`"path": "/blogs/developer-guide/my-article",`
`"title": "My Article Title",`
`"image": "/media/image.jpg",`
`"description": "Brief summary of the article",`
`"lastModified": "1700000000"`
`}`
`],`
`"type": "sheet"`
`}`

**Required fields for each data item:**

- `path` (string) - URL path, must contain "developer-guide"
- `title` (string) - Article title
- `image` (string) - Featured image URL
- `description` (string) - Brief summary
- `lastModified` (string/number) - Unix timestamp in seconds

---

## Integration with Other Blocks

The bloglist block works well with:

- **Bio Block**: Show author info above the bloglist
- **Raw Block**: Add custom HTML/headings before the list
- **Overlay Block**: Link to articles in overlay mode

**Avoid combining with:**

- Multiple bloglist blocks on same page (creates confusion)
- Article-list blocks (redundant functionality)

---

## Accessibility Notes

The bloglist block is accessible:

- ✅ Semantic HTML structure
- ✅ Links have descriptive text (article titles)
- ✅ Images have alt attributes (from article titles)
- ✅ Keyboard navigable
- ✅ Screen reader friendly

**No additional ARIA needed** - the block uses standard HTML elements.

---

## SEO Considerations

The bloglist block is SEO-friendly:

- ✅ All links are standard `<a>` tags (crawlable)
- ✅ Content is rendered in HTML (no JavaScript-only content)
- ✅ Image alt attributes populated
- ✅ No duplicate content issues (only shows excerpts)

**Note**: Content is fetched client-side, so:

- Search engines may not see the list in initial HTML
- Consider using server-side rendering for critical SEO pages
- Or use static HTML for main navigation/sitemaps

---

## Performance Metrics

Expected performance characteristics:

- **Load time**: <100ms (after query-index.json loads)
- **File size**: ~2KB (JS + CSS combined)
- **Network requests**: 1 (query-index.json) + 4 (images)
- **Rendering**: <50ms (grid layout + cards)

**Lighthouse scores should remain 100** with this block.

---

## Version History

- **v1.0** (Initial) - Basic bloglist with hardcoded filters
  - Filter: "developer-guide" in path
  - Limit: 4 items
  - Sort: lastModified descending
  - Exclusions: Current page, template/test pages

---

## Future Roadmap

Potential enhancements:

1. **Configurable filters** - Accept filter parameter from block config
2. **Configurable limits** - Accept limit parameter (e.g., 3, 5, 6)
3. **Multiple filter options** - OR/AND logic for path filters
4. **Category filtering** - Filter by taxonomy or tags
5. **Custom sort options** - Title, author, custom fields
6. **Pagination** - "Load more" or numbered pagination
7. **Variation support** - Different card layouts
8. **Author filtering** - Show posts by specific author

**Current focus**: Keep it simple and performant.
