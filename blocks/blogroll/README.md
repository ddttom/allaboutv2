# Blogroll Block

The Blogroll block displays a list of blog posts, grouped by series and sorted by part number or title.

## Usage

To use the Blogroll block, add the following to your Franklin document:

| Blogroll |
|----------|
| /path/to/filter |

You can add multiple rows to filter posts from different paths.

## Authoring

In Google Docs or Microsoft Word, create a table with one column. The first row should contain "Blogroll", and subsequent rows can contain paths to filter the blog posts.

## Styling

The Blogroll block uses CSS variables for easy customization. You can override these variables in your project's CSS:
:root {
--blogroll-text-color: #333;
--blogroll-link-color: #0066cc;
--blogroll-date-color: #666;
--blogroll-background: #f5f5f5;
--blogroll-border-color: #ddd;
--blogroll-icon-size: 24px;
--blogroll-panel-width: 300px;
}
## Behavior

The Blogroll block fetches blog posts from the `/query-index.json` file and displays them grouped by series. In compact mode, it creates a floating icon that opens a panel with the blogroll content.

## Variations

1. Default: Displays the blogroll as a full-width block on the page.

2. Highlight:
   - Usage: `| Blogroll (highlight) |`
   - Applies a highlighted background to the blogroll.
   - Changes the background color to a light blue (#e6f3ff) and the border color to #99ccff.

3. Compact:
   - Usage: `| Blogroll (compact) |`
   - Enables compact mode with a floating icon and panel.
   - Creates a small icon (📚) in the bottom-right corner of the page.
   - Clicking the icon opens a panel with the blogroll content.
   - The panel can be closed by clicking outside or pressing the Escape key.

## Accessibility

- The compact mode panel can be closed using the Escape key.
- ARIA labels are used for the close button in compact mode.
- Keyboard navigation is supported for opening and closing the panel.

## Suggestions for Improvement

1. Add pagination for large numbers of posts.
2. Implement lazy loading for better performance with many posts.
3. Add options for different sorting methods (e.g., by date, alphabetical).
4. Create a search functionality within the blogroll.
