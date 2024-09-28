# Showcaser Block

The Showcaser block is a Franklin component that displays a visually appealing showcase for code snippets on a page.

## Usage

To use the Showcaser block, simply add the following markdown table to your Franklin document:

| Showcaser |
|-----------|

For a compact version of the Showcaser, use:

| Showcaser (compact) |
|---------------------|

The block will automatically collect all `<pre>` elements from the current page, remove them from their original positions, and display them in an interactive book-like interface.

## Authoring

1. Create your code snippets using `<pre>` tags in your Google Docs or Microsoft Word document.
2. The first line of each `<pre>` block will be used as the title for that code snippet.
3. Add the Showcaser block table where you want the showcase to appear.

## Styling

The Showcaser block uses CSS variables for easy customization. You can override these variables in your project's CSS to change the appearance:

### Color variables
- `--showcaser-bg-color`: Background color of the showcaser
- `--showcaser-text-color`: Text color
- `--showcaser-title-color`: Color of the main title
- `--showcaser-button-bg`: Background color of title buttons
- `--showcaser-button-text`: Text color of title buttons
- `--showcaser-button-hover`: Background color of title buttons on hover
- `--showcaser-code-bg`: Background color of the code display area
- `--showcaser-border-color`: Color of borders

### Typography variables
- `--showcaser-font-family`: Font family for the showcaser

### Layout variables
- `--showcaser-border-radius`: Border radius for rounded corners
- `--showcaser-padding`: Padding for various elements

## Behavior

- The Showcaser block collects all `<pre>` elements from the page and displays them in an interactive interface.
- The left panel shows clickable titles for each code snippet.
- Clicking a title displays the corresponding code in the right panel.
- The first code snippet is displayed by default.
- The block is responsive and adjusts its layout for mobile devices.
- The compact variation displays the left and right panels stacked vertically.

## Accessibility

- The Showcaser uses semantic HTML elements for better screen reader compatibility.
- Interactive elements are keyboard-accessible.
- Color contrast ratios meet WCAG 2.1 Level AA standards.

## Error Handling

- If there's an error loading the code snippets, an error message will be displayed.
- Loading state is shown while collecting and processing code snippets.
