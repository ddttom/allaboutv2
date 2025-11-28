# View MyBlog Block - Author Guide

Complete guide for content authors using the View MyBlog block in Google Docs or SharePoint.

## Quick Start

### Basic Usage

Create a simple two-row table with the block name:

| View MyBlog |
| --- |

The block will automatically load your blog content from `/my-blog.json`.

### Custom Data Source

To use a different JSON file location:

| View MyBlog |
| --- |
| /custom-path/blog-data.json |

## What You'll Get

When you add the View MyBlog block to your page, it displays:

### 1. Latest Posts Section

Shows the 3 most recent blog posts automatically:
- Blue gradient background for visual emphasis
- Post titles as clickable links
- Brief descriptions
- Automatically updated when you add new posts

`Example Display`
`┌─────────────────────────────────────┐`
`│ Latest Posts                        │`
`├─────────────────────────────────────┤`
`│ • Your Newest Post                  │`
`│   Brief description...              │`
`│                                     │`
`│ • Second Newest Post                │`
`│   Brief description...              │`
`│                                     │`
`│ • Third Newest Post                 │`
`│   Brief description...              │`
`└─────────────────────────────────────┘`

### 2. Most Visited Section

Highlights your popular content:
- Orange gradient background
- Manually curated (you control what appears)
- Perfect for showcasing best content
- Optional (only shows if you provide it)

`Example Display`
`┌─────────────────────────────────────┐`
`│ Most Visited                        │`
`├─────────────────────────────────────┤`
`│ • Your Most Popular Post            │`
`│   Why readers love this...          │`
`│                                     │`
`│ • Second Most Popular               │`
`│   Another reader favorite...        │`
`└─────────────────────────────────────┘`

### 3. Category Map

Interactive navigation table:
- Shows all your blog categories
- Article count per category
- Click to jump to that category section
- Focus area descriptions

`Example Display`
`┌────────────────────────────────────────────────┐`
`│     Category Map, click one to jump            │`
`├────────────────────────────────────────────────┤`
`│ Category        │ Count │ Focus Area           │`
`├────────────────────────────────────────────────┤`
`│ Development     │  15   │ Web dev tutorials    │`
`│ Design          │   8   │ UI/UX best practices │`
`│ Tools           │  12   │ Developer tools      │`
`└────────────────────────────────────────────────┘`

### 4. Category Sections

Full blog archive organized by category:
- Each category has its own section
- All posts with titles, descriptions, dates
- Posts sorted by date (newest first by default)
- Optional oldest-first sorting for tutorial series

## Usage Examples

### Example 1: Default Blog Page

`Standard blog landing page`
`# Tom's Blog`
``
`Welcome to my blog about web development and design.`
``
`| View MyBlog |`
`| --- |`

**Result:** Full blog viewer with all sections, loading from `/my-blog.json`

### Example 2: Custom Data Location

`Blog with custom JSON location`
`# Project Blog`
``
`Updates and articles about our project.`
``
`| View MyBlog |`
`| --- |`
`| /projects/myproject/blog.json |`

**Result:** Blog viewer loading from custom JSON file

### Example 3: Subdomain Blog

`Blog on subdomain with full URL`
`# Company News`
``
`| View MyBlog |`
`| --- |`
`| https://blog.company.com/posts.json |`

**Result:** Blog viewer loading from external URL

## Single Category Mode

When your blog has only one category, the block automatically simplifies:

**Hidden:**
- Latest Posts section (no point when all posts are in one category)
- Category Map (no need to navigate between categories)

**Shown:**
- Most Visited section (if provided)
- Single category section with all posts

This creates a cleaner, more focused layout for single-topic blogs.

## Content Management

### JSON Data Structure

Your blog content lives in a JSON file (typically `/my-blog.json`). Here's what it looks like:

`Minimal JSON Example`
`{`
`  "categories": [`
`    {`
`      "id": "tutorials",`
`      "name": "Tutorials",`
`      "posts": [`
`        {`
`          "title": "Getting Started",`
`          "url": "/blog/getting-started",`
`          "description": "Learn the basics",`
`          "lastModified": "2025-11-20"`
`        }`
`      ]`
`    }`
`  ]`
`}`

### Best Practices

**DO:**
- Let the block auto-generate Latest Posts (don't include `latestPosts` in JSON)
- Manually curate Most Visited to highlight best content
- Use descriptive category names and descriptions
- Include lastModified dates for automatic sorting
- Keep descriptions brief (1-2 sentences)

**DON'T:**
- Don't include index pages in your blog posts
- Don't manually maintain Latest Posts (let it auto-generate)
- Don't create empty categories
- Don't use overly long descriptions

## Special Features

### Auto-Generated Latest Posts

The block automatically creates Latest Posts by:
1. Looking at all posts across all categories
2. Sorting by lastModified date (newest first)
3. Taking the top 3 most recent posts
4. Filtering out index pages

**Why this is great:**
- Always shows your newest content
- No manual maintenance required
- Updates automatically when you add posts

### Index Page Filtering

The block automatically filters out index/landing pages that end with:
- `/` (e.g., `/blog/`)
- `/index`
- `/index.html` or `/index.htm`

**Why this matters:**
- Shows only actual blog posts
- Prevents duplicate navigation pages
- Keeps content focused

### Category Sorting

Categories can be sorted two ways:

**Newest First (default):**
- Most recent posts at the top
- Best for news, updates, announcements
- No configuration needed

**Oldest First:**
- Earliest posts at the top
- Perfect for tutorial series (Part 1, Part 2, Part 3...)
- Add `"sortOrder": "oldest-first"` to category in JSON

`Oldest-First Example`
`{`
`  "id": "tutorial-series",`
`  "name": "Complete Tutorial Series",`
`  "sortOrder": "oldest-first",`
`  "posts": [ ... ]`
`}`

### Additional Resources

Special category type for external links:

`External Links Example`
`{`
`  "id": "resources",`
`  "name": "Additional Resources",`
`  "links": [`
`    {`
`      "title": "Official Documentation",`
`      "url": "https://example.com/docs"`
`    }`
`  ]`
`}`

**Features:**
- Displays as bullet list
- Opens in new tabs
- Perfect for external references
- Different from blog posts

## Responsive Design

The block automatically adapts to screen size:

**Desktop:**
- Wide layout with generous spacing
- Full-width category table
- Larger text sizes

**Tablet:**
- Medium spacing
- Responsive table
- Adjusted margins

**Mobile:**
- Compact spacing
- Smaller fonts
- Touch-friendly links
- Scrollable table

## Accessibility Features

The block is built with accessibility in mind:

**Screen Readers:**
- Proper heading hierarchy (H2 for sections, H3 for posts)
- Navigation landmarks
- Descriptive link text

**Keyboard Users:**
- All links keyboard accessible
- Logical tab order
- Focus indicators

**Visual:**
- High contrast text and links
- Clear color distinctions
- Readable font sizes

## Troubleshooting for Authors

### Block Not Showing Content

**Check these:**
1. Is the JSON file accessible at the specified URL?
2. Is the JSON properly formatted? (Use a JSON validator)
3. Check browser console for error messages
4. Verify the block name is exactly `View MyBlog`

### Latest Posts Not Appearing

**Possible reasons:**
1. Only one category exists (single-category mode hides Latest Posts)
2. Fewer than 3 posts total
3. All posts are index pages (filtered out)
4. Posts missing lastModified dates

### Category Map Missing

**Possible reasons:**
1. Only one category exists (map hidden in single-category mode)
2. All categories are empty after filtering
3. categoryMap array missing from JSON

### Links Not Working

**Check these:**
1. URLs in JSON are complete and correct
2. URLs don't have typos
3. External links include https://
4. Internal links start with /

## Tips for Content Authors

1. **Keep Descriptions Short:** 1-2 sentences per post
2. **Update Dates:** Always include lastModified for proper sorting
3. **Use Categories:** Group related content together
4. **Feature Best Content:** Use Most Visited for your top articles
5. **Test Regularly:** Preview changes before publishing
6. **Monitor Performance:** Check which posts get most clicks
7. **Clean URLs:** Use clear, descriptive URLs for posts

## Related Documentation

- **Technical Guide:** README.md (for developers)
- **Test File:** test.html (for testing locally)
- **Sample Data:** /my-blog.json (for reference)

## Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Validate your JSON file syntax
3. Review the EXAMPLE.md file (this document)
4. Contact your development team
5. Test with the sample data first

## Quick Reference Table

| Feature | Configuration | Default Behavior |
| --- | --- | --- |
| Data Source | Optional URL parameter | /my-blog.json |
| Latest Posts | Auto-generated | Top 3 newest posts |
| Most Visited | Must be in JSON | Not shown if missing |
| Category Sorting | sortOrder in JSON | Newest first |
| Index Filtering | Automatic | Always active |
| Single Category Mode | Automatic detection | Simplifies UI |
| Mobile Responsive | Automatic | Breakpoint at 768px |
| External Links | target="_blank" | Opens new tab |
| Category Map | Automatic when >1 category | Hidden if 1 category |

## Version History

**v1.0** - Initial release
- Auto-generated Latest Posts
- Index page filtering
- Single category mode
- Dynamic category map
- Responsive design
