# Blogroll Block

## Description
The Blogroll block displays a list of blog posts, categorized by series. It includes a floating icon that opens a side panel with a compact version of the blogroll.

## Usage
To use the Blogroll block, simply add it to your page using the appropriate Franklin syntax.

## Authoring
In your Google Docs or Microsoft Word document, create a table with the following structure:

| Blogroll |
|----------|
| Series Name |
| Blog Post Title | YYYY-MM-DD | Description |
| ... |

## Styling
The block uses CSS variables for easy customization. The main content and the panel have different styles for optimal readability.

## Behavior
- The main page displays a full-width blogroll with larger text and block-level dates.
- Clicking the floating icon opens a side panel with a compact version of the blogroll.
- The panel version has smaller text and inline dates for a more condensed view.

## Accessibility
- The floating icon and panel are keyboard accessible.
- ARIA attributes are used to improve screen reader compatibility.

## Notes
- The compact version of the blogroll only appears in the side panel, not on the main page.
- CSS variables can be adjusted to customize the appearance of both the main blogroll and the panel version.
