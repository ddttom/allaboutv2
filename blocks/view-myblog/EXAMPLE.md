# View MyBlog Block - Google Docs Example

## How to Use in Google Docs

### Simple Usage (Recommended)

Create a table with just the block name:

| view-myblog |
|-------------|

The block will automatically:
- Fetch data from `/my-blog.json`
- Display the blog header with stats
- Show latest posts section
- Show most visited section
- Display category map
- Add back-to-top button

### Expected Output

When you use this block, it will render:

1. **Header Section**
   - Blog title
   - Subtitle
   - Statistics (article count, category count)

2. **Latest Posts Section**
   - 3 most recent blog posts
   - Blue gradient background
   - Post titles, descriptions, and links

3. **Most Visited Section**
   - 3 most popular blog posts
   - Orange gradient background
   - Post titles, descriptions, and links

4. **Category Map**
   - Table with all blog categories
   - Article counts per category
   - Clickable links to category sections
   - Category descriptions

5. **Back to Top Button**
   - Fixed position button
   - Smooth scroll to top

## Visual Example

```
┌─────────────────────────────────────────────┐
│         Tom Cranstoun's Blog                │
│   I mostly write about AEM, EDS and AI      │
│        91 Articles  |  6 Categories         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Latest Posts                                │
├─────────────────────────────────────────────┤
│ • Live Jupyter Notebook                     │
│   Description...                            │
│                                             │
│ • AI-Powered Adobe EDS Development          │
│   Description...                            │
│                                             │
│ • Living Documentation...                   │
│   Description...                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Most Visited                                │
├─────────────────────────────────────────────┤
│ • Adobe EDS Full Guide...                   │
│   Description...                            │
│                                             │
│ • Creating an llms.txt                      │
│   Description...                            │
│                                             │
│ • The EDS Developer's Dilemma...            │
│   Description...                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│       Category Map, click one to jump       │
├─────────────────────────────────────────────┤
│ Category          | Count | Focus Area      │
├─────────────────────────────────────────────┤
│ EDS & Integrations|  22   | Adobe EDS...    │
│ Core AI/LLM       |  20   | Language models │
│ AEM / CMS Focus   |   6   | Adobe Experience│
│ Developer Guide   |  13   | Step-by-step... │
│ Content Creator   |   3   | Authoring guides│
│ General Blog      |  27   | Development...  │
│ Additional        |  13   | Quick links...  │
└─────────────────────────────────────────────┘

                            [Back to Top ↑]
```

## Notes for Authors

- **Zero Configuration**: Just add the block name, everything else is automatic
- **Dynamic Content**: Content is loaded from `/my-blog.json` at runtime
- **No Manual Updates**: Edit the JSON file to update blog content
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: Keyboard navigation and screen reader friendly

## Common Issues

### Block Not Loading
- Ensure `/my-blog.json` exists and is accessible
- Check browser console for errors
- Verify JSON syntax is valid

### Content Not Displaying
- Check that the JSON structure matches the expected format
- Verify URLs in the JSON are correct
- Ensure the block name is exactly "view-myblog" (lowercase with hyphen)

## For Developers

If you need to customize the data source or error messages, edit the configuration in `view-myblog.js`:

```javascript
const config = {
  dataUrl: '/my-blog.json',
  errorMessage: 'Unable to load blog content'
};
```
