# Dashboard Block - Usage Examples

This document shows how to use the dashboard block to create content management dashboards with sortable tables, filterable status indicators, and image preview popups. Perfect for content governance, editorial calendars, and site-wide content auditing.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Understanding the Dashboard](#understanding-the-dashboard)
- [Filtering Content](#filtering-content)
- [Sorting Data](#sorting-data)
- [Image Previews](#image-previews)
- [Configuration](#configuration)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Techniques](#advanced-techniques)

---

## Quick Start

Create a content dashboard in Google Docs:

| Dashboard |
|-----------|

That's it! The block automatically fetches and displays all site content from `query-index.json` with sortable columns, filterable statuses, and image previews.

**Result:** A full-featured dashboard showing all pages with their titles, paths, descriptions, last modified dates, review dates, and expiry dates. Color-coded status indicators (green/amber/red) show content health at a glance.

---

## Basic Usage

### Minimal Example

The simplest dashboard implementation:

| Dashboard |
|-----------|

**Output:** Complete content management dashboard with:

- Title, Path, Description columns
- Last Modified, Review, Expiry date columns
- Sortable headers (click to sort)
- Status filter dropdown (Red, Amber, Green, All)
- Image preview popups (hover over path links)
- Responsive layout (table on desktop, cards on mobile)

### Standard Example

Dashboard with page context:

# Content Management Dashboard

Monitor site-wide content health and review cycles. Use the filters and sort options to find content that needs attention.

| Dashboard |
|-----------|

**Output:** Dashboard with introductory text explaining its purpose.

---

## Understanding the Dashboard

### What the Dashboard Shows

The dashboard displays data from `query-index.json` with calculated review and expiry dates:

**Columns:**

1. **Title** - Page title from query-index.json
2. **Path** - Page URL (clickable link)
3. **Description** - Page description or summary
4. **Last Modified** - Original last modified date
5. **Review** - Calculated review date (Last Modified + 300 days default)
6. **Expiry** - Calculated expiry date (Last Modified + 365 days default)

**Status Indicators:**

- **Green** - Review/expiry date is 30+ days away (healthy)
- **Amber** - Review/expiry date is 0-30 days away (warning)
- **Red** - Review/expiry date has passed (overdue)

### How Dates are Calculated

**Review Date:**

- Formula: `Last Modified + defaultreviewperiod days`
- Default period: 300 days (10 months)
- Configurable via site settings

**Expiry Date:**

- Formula: `Last Modified + defaultexpiryperiod days`
- Default period: 365 days (1 year)
- Configurable via site settings

**Example:**

- Last Modified: January 1, 2024
- Review Date: October 27, 2024 (300 days later)
- Expiry Date: January 1, 2025 (365 days later)

### Status Color Logic

**Green status:**

- Review or Expiry date is more than 30 days in the future
- Content is healthy and doesn't need immediate attention

**Amber status:**

- Review or Expiry date is 0-30 days in the future
- Content needs attention soon (warning)

**Red status:**

- Review or Expiry date has passed (negative days)
- Content is overdue and needs immediate attention

---

## Filtering Content

### Using the Status Filter

The dashboard includes a dropdown to filter by status:

**Filter options:**

- **All** - Show all content (default)
- **Green** - Show only healthy content (30+ days)
- **Amber** - Show content needing attention soon (0-30 days)
- **Red** - Show overdue content (past due date)

**How to filter:**

1. Locate "Filter by status:" dropdown at top of dashboard
2. Click dropdown to see options
3. Select desired status (All, Green, Amber, Red)
4. Table updates instantly to show matching rows

**Filter logic:**

- Applies to BOTH review and expiry columns
- Row shows if EITHER review OR expiry matches selected status
- Example: Selecting "Red" shows rows where review date OR expiry date is red

### Filter Use Cases

**Find content needing review:**

1. Select "Amber" from filter dropdown
2. Review the filtered list
3. Prioritize pages with amber status
4. Click path links to update content

**Find overdue content:**

1. Select "Red" from filter dropdown
2. See all overdue content immediately
3. Click path links to review and update
4. Track progress as red items turn amber/green

**Check overall content health:**

1. Select "Green" to see healthy content
2. Note which pages are in good standing
3. Use as baseline for content governance

---

## Sorting Data

### How to Sort

Click any column header to sort by that column:

**Sort behavior:**

- **First click:** Sort ascending (A-Z, earliest-to-latest) - Shows ↑ arrow
- **Second click:** Sort descending (Z-A, latest-to-earliest) - Shows ↓ arrow
- **Third click:** Returns to previous sort state

**Sortable columns:**

- Title (alphabetical)
- Path (alphabetical)
- Description (alphabetical)
- Last Modified (chronological)
- Review (chronological)
- Expiry (chronological)

**Default sort:**
Dashboard loads sorted by Title (ascending).

### Sort Use Cases

**Find oldest content:**

1. Click "Last Modified" header
2. First click shows oldest content at top (ascending)
3. Review pages that haven't been updated recently
4. Plan content refresh strategy

**Find newest content:**

1. Click "Last Modified" header
2. Second click shows newest content at top (descending)
3. Review recently updated pages
4. Verify recent changes

**Find soonest expiry:**

1. Click "Expiry" header
2. First click shows earliest expiry dates at top
3. Focus on content expiring soonest
4. Prioritize updates accordingly

**Alphabetical navigation:**

1. Click "Title" or "Path" header
2. Navigate content alphabetically
3. Find specific pages quickly
4. Organize by naming conventions

---

## Image Previews

### How Image Popups Work

Hover over any path link to see a preview image (if available):

**Behavior:**

1. Move mouse over a path link (blue underlined text)
2. If page has an image, popup appears
3. Popup follows mouse cursor automatically
4. Move mouse away to hide popup

**Popup features:**

- Appears near mouse cursor (avoids viewport edges)
- Shows page's preview image from query-index.json
- Non-intrusive (doesn't block content)
- Quick visual reference for content identification

### When Popups Appear

**Images required:**
Popups only appear if the page has an `image` property in `query-index.json`. If no image exists, hovering does nothing (no error, no popup).

**Example query-index.json:**

`JSON with image`
`{`
`"data": [`
`{`
`"title": "Home Page",`
`"path": "/",`
`"image": "/media_abc123.png"  ← Image popup will show`
`},`
`{`
`"title": "About",`
`"path": "/about",`
`// No image property → no popup`
`}`
`]`
`}`

### Using Image Previews

**Quick content identification:**

- Hover over path links to see page visuals
- Identify pages by hero images or screenshots
- Verify correct page before clicking through
- Useful for visual content audits

**Best practices:**

- Ensure important pages have preview images
- Use representative images (hero images, featured graphics)
- Optimize image sizes (<100KB recommended)
- Use consistent image aspect ratios

---

## Configuration

### Default Configuration

The dashboard works out-of-the-box with these defaults:

- **Review period:** 300 days (10 months)
- **Expiry period:** 365 days (1 year)
- **Data source:** `/query-index.json`
- **Responsive breakpoint:** 1024px (table vs. card layout)

### Custom Review and Expiry Periods

Override defaults by setting `window.siteConfig`:

`Custom periods (6 months review, 2 years expiry)`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 180,  // 6 months`
`'$co:defaultexpiryperiod': 730   // 2 years`
`};`

**Where to set:**
Add to `head.html` or early in page load (before dashboard block loads).

**Example in head.html:**

`head.html configuration`
`<script>`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 300,`
`'$co:defaultexpiryperiod': 365`
`};`
`</script>`

### Configuration Use Cases

**Short review cycles (news sites):**

`90-day review period`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 90,   // 3 months`
`'$co:defaultexpiryperiod': 180   // 6 months`
`};`

**Long review cycles (evergreen content):**

`Long-term content`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 540,  // 18 months`
`'$co:defaultexpiryperiod': 1095  // 3 years`
`};`

**Compliance-driven (strict governance):**

`Strict review cycles`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 180,  // 6 months review`
`'$co:defaultexpiryperiod': 365   // 1 year expiry`
`};`

---

## Common Patterns

### Pattern 1: Editorial Calendar Dashboard

Content team dashboard for tracking review cycles:

# Editorial Calendar

Track all content review and expiry dates. Green = healthy, Amber = attention needed soon, Red = overdue.

| Dashboard |
|-----------|

**Use this for:**

- Content team daily workflow
- Editorial planning meetings
- Content governance compliance
- Review cycle tracking

**Workflow:**

1. Open dashboard daily
2. Filter by "Amber" to see upcoming reviews
3. Filter by "Red" to see overdue content
4. Sort by "Review" to prioritize by date
5. Click path links to update content
6. Refresh dashboard to see updated statuses

### Pattern 2: Content Audit Dashboard

Site-wide content audit for governance:

# Content Audit Dashboard

Complete inventory of all site content with health indicators. Use filters to identify content needing updates.

**Total Content:** [Shown in table]
**Status Indicators:** Green (healthy) | Amber (review soon) | Red (overdue)

| Dashboard |
|-----------|

**Use this for:**

- Quarterly content audits
- Compliance reporting
- Content inventory management
- Stakeholder reports

**Workflow:**

1. Sort by "Last Modified" ascending (oldest first)
2. Identify stale content (old modification dates)
3. Review red status items (overdue for update)
4. Plan content refresh initiatives
5. Export filtered lists (future feature)

### Pattern 3: Content Health Monitoring

Real-time content health dashboard:

# Content Health Monitor

Monitor site-wide content freshness. Filter by status to identify content needing attention.

| Dashboard |
|-----------|

**Use this for:**

- Real-time content monitoring
- Content freshness tracking
- Proactive content management
- Team performance metrics

**Workflow:**

1. Check dashboard weekly
2. Note trend in red/amber/green distribution
3. Set team goals (e.g., "reduce red items by 50%")
4. Track progress over time
5. Celebrate when red items turn green

### Pattern 4: Admin Content Overview

Administrative overview for site managers:

# Site Content Overview

Administrative dashboard showing all site content with sortable columns and status indicators.

**Instructions:**

- Click column headers to sort
- Use filter dropdown to focus on specific statuses
- Hover over paths to preview page images
- Click paths to navigate to pages

| Dashboard |
|-----------|

**Use this for:**

- Site administrator daily checks
- High-level content overview
- Quick content navigation
- Status reporting to leadership

---

## Best Practices

### Content Governance

**1. Establish review cycles**

- Set appropriate `defaultreviewperiod` for your content type
- News sites: 90-180 days
- Marketing sites: 180-365 days
- Documentation sites: 365-540 days
- Compliance sites: Follow regulatory requirements

**2. Monitor regularly**

- Check dashboard weekly or daily
- Filter by "Red" status first (most urgent)
- Then check "Amber" status (upcoming)
- Plan review cycles proactively

**3. Assign ownership**

- Use dashboard to identify content needing attention
- Assign content owners for red/amber items
- Track progress in team meetings
- Celebrate when items turn green

**4. Set realistic periods**

- Don't set review periods too short (creates overhead)
- Don't set too long (allows content to become stale)
- Balance between freshness and team capacity
- Adjust based on content type and importance

### Dashboard Usage

**1. Use sorting strategically**

- Sort by "Review" or "Expiry" to prioritize by urgency
- Sort by "Last Modified" to find stale content
- Sort by "Title" or "Path" for navigation
- Combine with filters for focused views

**2. Leverage filters effectively**

- Start with "Red" filter (most urgent)
- Review "Amber" filter (upcoming deadlines)
- Use "Green" filter to verify healthy content
- Use "All" for complete overview

**3. Enable image previews**

- Add `image` property to query-index.json entries
- Use representative images (hero images, screenshots)
- Helps quickly identify content visually
- Especially useful for large sites

**4. Responsive usage**

- Desktop: Full table view for detailed analysis
- Mobile: Card view for quick status checks
- Touch-friendly interface on mobile
- All functionality available in both layouts

### Performance Optimization

**1. Limit data size**

- Keep query-index.json under 100KB
- Consider pagination for 500+ pages
- Compress JSON with gzip
- Use CDN for faster loading

**2. Optimize images**

- Compress preview images (<100KB each)
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Consider lazy loading for popups (future enhancement)

**3. Browser caching**

- Set appropriate cache headers for query-index.json
- Balance between freshness and performance
- Use versioning or cache-busting for updates

---

## Troubleshooting

### Issue: Dashboard shows no data

**Problem:** Dashboard displays empty table or "No data" message.

**Cause:** query-index.json is empty, missing, or incorrectly formatted.

**Solution:**

1. **Verify JSON exists:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for `/query-index.json` request
   - Check status code (should be 200, not 404)

2. **Check JSON format:**
   - Click on query-index.json in Network tab
   - View Response tab
   - Verify structure has `data` array
   - Ensure array is not empty

3. **Test JSON directly:**
   - Open `https://yoursite.com/query-index.json` in browser
   - Verify it loads and shows content
   - Check for syntax errors (use JSON validator)

### Issue: Dates showing "Invalid Date"

**Problem:** Date columns display "Invalid Date" with red backgrounds.

**Cause:** `lastModified` values in query-index.json are in unsupported format.

**Solutions:**

1. **Check date format:**
   - Open query-index.json in browser
   - Inspect `lastModified` values
   - Supported formats:
     - Unix timestamps: `1640995200` (seconds)
     - Unix timestamp strings: `"1640995200"`
     - ISO 8601 strings: `"2024-01-01T00:00:00Z"`

2. **Convert to supported format:**
   - Use Unix timestamps (recommended)
   - Or ISO 8601 strings with timezone
   - Avoid custom date strings

3. **Test date parsing:**
   - Open browser Console (F12)
   - Run: `new Date(1640995200 * 1000)`
   - Should show valid date (not "Invalid Date")

### Issue: All dates are red

**Problem:** All review and expiry dates show red status (overdue).

**Cause:** Content is genuinely overdue OR review/expiry periods are too short.

**Solutions:**

1. **Check actual dates:**
   - Review the "Last Modified" column
   - Check if dates are very old
   - Content may genuinely need updating

2. **Adjust review periods:**
   - If periods are too short, increase them
   - Example: Change from 180 to 300 days

`Increase periods`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 300,`
`'$co:defaultexpiryperiod': 365`
`};`

1. **Update content:**
   - Review and update old content
   - Modify files to update `lastModified` timestamps
   - Rebuild query-index.json

### Issue: Filter not working

**Problem:** Selecting filter options doesn't change visible rows.

**Cause:** JavaScript error or incorrect status classes.

**Solutions:**

1. **Check Console for errors:**
   - Open DevTools Console (F12)
   - Look for JavaScript errors
   - Fix any reported issues

2. **Verify status classes:**
   - Inspect date cells in DevTools Elements panel
   - Check for `.green`, `.amber`, or `.red` classes
   - Classes should be present on date cells

3. **Test manually:**
   - Open Console
   - Run: `filterTable()`
   - Check if function exists and executes

### Issue: Sort not working

**Problem:** Clicking column headers doesn't sort the table.

**Cause:** Event listeners not attached or JavaScript error.

**Solutions:**

1. **Check for errors:**
   - Open Console (F12)
   - Look for JavaScript errors
   - Fix any reported issues

2. **Verify headers are clickable:**
   - Inspect `<th>` elements in DevTools
   - Check for `data-column` attributes (should be 0-5)
   - Verify `class="sortable"` exists

3. **Test sorting manually:**
   - Open Console
   - Run: `sortTable(0, true)` (sort by first column, ascending)
   - Check if table reorders

### Issue: Image popups not showing

**Problem:** Hovering over path links shows no image popup.

**Cause:** Pages have no `image` property in query-index.json.

**Solutions:**

1. **Verify image data:**
   - Open query-index.json in browser
   - Check if items have `image` property
   - Example: `"image": "/media_abc123.png"`

2. **Add images to query-index.json:**
   - Edit source data to include image URLs
   - Rebuild query-index.json
   - Refresh dashboard

3. **Test with known image:**
   - Find an item with `image` property
   - Hover over that item's path link
   - Popup should appear for that item

### Issue: Responsive layout not switching

**Problem:** Table stays in desktop mode on mobile devices.

**Cause:** Viewport width detection issue or CSS not loaded.

**Solutions:**

1. **Check viewport width:**
   - Open Console
   - Run: `console.log(window.innerWidth)`
   - Should be less than 1024 for mobile layout

2. **Verify CSS loaded:**
   - Check Network tab for `dashboard.css`
   - Ensure 200 status code
   - Check for CSS load errors

3. **Force layout switch:**
   - Open Console
   - Run: `handleResponsiveLayout()`
   - Check if classes `.card-view` and `.card-layout` are added

---

## Advanced Techniques

### Custom Status Periods

Set different review and expiry periods for different content types:

`Mixed content types`
`// Default periods for most content`
`window.siteConfig = {`
`'$co:defaultreviewperiod': 300,`
`'$co:defaultexpiryperiod': 365`
`};`
``
`// For news content, use shorter periods`
`// (Requires custom implementation)`

**Note:** Current dashboard uses global periods. Per-page periods require custom development (see [Future Enhancements](./README.md#future-enhancements)).

### Dashboard with Custom Styling

Add custom CSS to match your brand:

`Custom dashboard colors`
`.dashboard h1 {`
`color: #2c3e50;`
`font-size: 28px;`
`font-weight: 700;`
`}`
``
`.content-table th {`
`  background-color: #3498db;`
`  color: white;`
`}`
``
`.content-table tr:hover {`
`background-color: #ecf0f1;`
`}`

### Dashboard in Iframe

Embed dashboard in other pages via iframe:

`Iframe embedding`
`<iframe src="/admin/dashboard" width="100%" height="800" frameborder="0">`
`Your browser doesn't support iframes.`
`</iframe>`

**Use cases:**

- Embed in main admin page
- Include in editorial workflows
- Display in content management tools

### Multiple Dashboards

Create multiple dashboard pages with different contexts:

**Blog Dashboard:** `/blog/dashboard`

# Blog Content Dashboard

Track blog posts and articles.

| Dashboard |
|-----------|

**Marketing Dashboard:** `/marketing/dashboard`

# Marketing Content Dashboard

Monitor marketing pages and campaigns.

| Dashboard |
|-----------|

**Note:** All dashboards show ALL content from query-index.json. Filtering to specific sections requires custom development.

---

## Testing Your Dashboard

### Visual Testing Checklist

After creating the dashboard:

1. **Initial load:**
   - Dashboard appears with title, filter, and table ✓
   - All columns display correctly ✓
   - Data loads from query-index.json ✓
   - Initial sort by Title applied ✓

2. **Sort testing:**
   - Click each column header ✓
   - Verify ascending sort (↑ arrow) ✓
   - Click again for descending sort (↓ arrow) ✓
   - Check data reorders correctly ✓

3. **Filter testing:**
   - Select "Green" - only green status rows show ✓
   - Select "Amber" - only amber status rows show ✓
   - Select "Red" - only red status rows show ✓
   - Select "All" - all rows show ✓

4. **Image preview testing:**
   - Hover over path links with images ✓
   - Popup appears near cursor ✓
   - Popup follows mouse movement ✓
   - Popup hides when mouse leaves link ✓
   - Popup stays within viewport (doesn't go offscreen) ✓

5. **Responsive testing:**
   - Desktop view (≥1024px): Table layout ✓
   - Mobile view (<1024px): Card layout ✓
   - All functionality works in both layouts ✓
   - Data labels appear in card view ✓

6. **Date testing:**
   - Green backgrounds for dates 30+ days away ✓
   - Amber backgrounds for dates 0-30 days away ✓
   - Red backgrounds for past dates ✓
   - Dates formatted correctly (MMM DD, YYYY) ✓

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (mobile)
- Android Chrome (mobile)

### Data Testing

Test with various data scenarios:

1. **Small dataset:** 10-20 rows
2. **Medium dataset:** 50-100 rows
3. **Large dataset:** 200+ rows
4. **Mixed dates:** Recent, old, and very old dates
5. **With/without images:** Some items with images, some without
6. **Edge cases:** Empty descriptions, very long titles, special characters

---

## Performance Metrics

### Expected Load Times

With typical query-index.json (50KB, 100 rows):

- Initial load: 100-300ms
- Sort operation: 10-50ms
- Filter operation: 5-20ms
- Layout switch: 10-30ms

### Optimization Tips

**1. Reduce JSON size:**

- Keep descriptions concise
- Remove unnecessary metadata
- Use shorter paths where possible
- Compress with gzip

**2. Optimize images:**

- Compress preview images (<100KB)
- Use appropriate formats
- Consider image sprites (future enhancement)

**3. Limit rows:**

- For 500+ rows, consider pagination
- Filter data server-side if possible
- Use virtual scrolling (future enhancement)

---

## Integration Examples

### Dashboard in Admin Section

Create admin section with navigation:

# Admin

Site administration and content management tools.

**Quick Links:**

- [User Management](/admin/users)
- [Content Dashboard](/admin/dashboard)
- [Settings](/admin/settings)

### Dashboard in Navigation

Include dashboard link in main navigation:

| Navigation |
|------------|
| [Home](/) |
| [Blog](/blog) |
| [Dashboard](/dashboard) |
| [About](/about) |

### Dashboard with Instructions

Add user instructions above dashboard:

# Content Dashboard

**How to use this dashboard:**

1. **Sort:** Click column headers to sort (click again to reverse)
2. **Filter:** Use dropdown to show only Red, Amber, or Green statuses
3. **Preview:** Hover over path links to see page images
4. **Navigate:** Click path links to open pages

| Dashboard |
|-----------|

---

## Related Blocks

**Similar functionality:**

- **Table** - Generic data table (no dashboard features)
- **Bloglist** - Blog-specific content listing
- **Navigation** - Site navigation menus

**Complementary blocks:**

- **Hero** - Page header above dashboard
- **Cards** - Alternative visual layout for content
- **Tabs** - Organize multiple dashboards in tabs

---

## Version History

- **v1.0** (Current) - Initial dashboard implementation
  - Sortable 6-column table
  - RAG status filtering
  - Image preview popups
  - Responsive card layout
  - Configurable review/expiry periods

---

## Additional Resources

- **[README.md](./README.md)** - Technical documentation and architecture details
- **[test.html](./test.html)** - Browser-based testing file
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS development patterns
- **[query-index.json Pattern](../../docs/for-ai/eds.md#query-indexjson-pattern)** - Understanding query-index structure

---

**Last Updated:** 2025-11-28
**Document Version:** 1.0
**Target Audience:** Content Authors, Editorial Teams, Site Administrators
