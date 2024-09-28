# Showcaser

The Showcaser block displays a visually appealing showcase for code snippets in a book-like format.

## Usage

To use the Showcaser block, add the following markdown table to your Franklin document:

| Showcaser |
|-----------|

For a compact version, use:

| Showcaser (compact) |
|---------------------|

The block automatically collects all `<pre>` elements from the current page and displays them in the showcase.

## Authoring

1. Create your content in Google Docs or Microsoft Word.
2. Use `<pre>` tags to wrap your code snippets.
3. The first line of each `<pre>` block becomes the title for that snippet.

Example:

`<pre>
Hello World Example
console.log("Hello, World!");
</pre>`

## Styling

The Showcaser block uses CSS variables for easy customization. Override these variables in your project's CSS:

`.showcaser {
  --showcaser-bg-color: #f5f5f5;
  --showcaser-text-color: #333;
  --showcaser-title-color: #0066cc;
  --showcaser-border-color: #ddd;
  --showcaser-active-bg: #e6f2ff;
  --showcaser-font-family: Arial, sans-serif;
  --showcaser-title-font-size: 1.2rem;
  --showcaser-content-font-size: 1rem;
}`

## Behavior

- Collects all `<pre>` elements from the current page
- Creates a book-like interface with clickable titles on the left and content on the right
- Clicking a title displays the corresponding code snippet on the right page
- The first snippet is displayed by default
- Responsive layout adjusts for mobile devices

## Accessibility

- Uses semantic HTML structure for better screen reader compatibility
- Clickable titles have appropriate cursor styles and hover effects
- Maintains color contrast ratios for readability

## Variations

- **Compact**: A more condensed version of the showcaser, suitable for smaller spaces or when displaying many code snippets.
