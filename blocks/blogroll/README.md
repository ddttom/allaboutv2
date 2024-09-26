# Blogroll Block

The Blogroll block displays a list of blog posts grouped by series.

## Usage

To use the Blogroll block, add the following to your Franklin document:

| Blogroll |
|----------|
| path1    |
| path2    |

Each row after the first represents a path filter. If no paths are specified, all blog posts will be displayed.

## Variations

### Compact

To use the compact variation, which adds a floating icon with "Blogroll" text and a slide-out panel:

| Blogroll (compact) |
|--------------------|
| path1              |
| path2              |

In compact mode, a floating icon (📚) with the text "Blogroll" appears in the top-left corner of the viewport. Clicking on either the icon or the text opens a slide-out panel containing the blogroll.

The compact panel also includes a "Show All Posts" button at the bottom. When clicked, it toggles between showing all available blog posts and the filtered view. The button text changes to "Show Filtered Posts" when displaying all posts.

If no paths are specified in compact mode, the block will default to showing posts from the current page's folder path and page name (without any part number). The filtering is case-insensitive.

## Styling

The block uses CSS variables for easy customization. See the CSS file for available variables.

## Behavior

The block fetches blog posts from the query-index.json file, groups them by series, and displays them in order. In compact mode, it adds a floating icon and text that opens a slide-out panel when clicked. The panel can be closed by clicking outside, pressing the Escape key, or clicking the close button (×).

## Accessibility

The compact variation includes keyboard navigation support (Escape key to close) and uses ARIA attributes for better screen reader compatibility.
