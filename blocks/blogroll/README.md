# Blogroll Block

The Blogroll block displays a list of blog posts grouped by series and sorted by part number or title.

## Usage

This block fetches blog post data from a JSON file and organizes it into a structured list.

## Authoring

To use the Blogroll block in your content, add a table with "Blogroll" in the first cell:

| Blogroll |
|----------|

For a compact version without descriptions, use:

| Blogroll (compact) |
|--------------------|

No additional configuration is needed in the content document.

## Styling

The block uses CSS classes for styling. You can customize the appearance by modifying the `blogroll.css` file.

## Behavior

The block performs the following actions:
1. Fetches blog post data from a JSON file
2. Groups posts by series
3. Sorts posts within each series by part number or title
4. Displays the grouped and sorted posts in a structured list
5. In compact mode, only shows titles and dates

## Dependencies

This block depends on the `aem.js` script for the `createOptimizedPicture` function, although it's not currently used in this implementation.

## Accessibility

The block uses semantic HTML elements to ensure good accessibility:
- `<h2>` for series titles
- `<ul>` and `<li>` for list structure
- `<a>` tags for clickable post titles

## Suggestions for Improvement

1. Add pagination or "load more" functionality for large numbers of posts
2. Implement filtering options (e.g., by date, category)
3. Add a search feature to find specific posts
4. Include thumbnail images for each post (if available in the JSON data)
5. Add social sharing buttons for each post
