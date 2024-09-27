# Showcaser Block

The Showcaser block is a Franklin component that displays a visually appealing showcase for code snippets found on the page.

## Usage

To use the Showcaser block, simply add it to your Franklin page using the following structure:

| Showcaser |
|-----------|
| Optional introductory content |

The block will automatically collect all `<pre>` elements from the page, group them by language, and display them in a book-like interface.

## Authoring

1. Add the Showcaser block to your page.
2. (Optional) Add introductory content in the first cell of the block.
3. Ensure that your page contains `<pre>` elements with code snippets you want to showcase.

## Styling

The Showcaser block uses CSS variables for easy customization. You can override these variables in your project's CSS:
.showcaser {
--showcaser-bg-color: #ffffff;
--showcaser-text-color: #333333;
--showcaser-accent-color: #0077cc;
--showcaser-border-color: #dddddd;
--showcaser-font-family: Arial, sans-serif;
--showcaser-font-size: 16px;
--showcaser-line-height: 1.5;
}


## Behavior

- The block collects all `<pre>` elements from the page and removes them from their original location.
- Code snippets are grouped by language (based on the class of the `<code>` element inside the `<pre>`).
- The left column displays a list of code snippets, grouped by language.
- Clicking on a snippet title in the left column displays the code in the right panel.
- The first snippet is displayed by default in the right panel.
- The block is responsive and adjusts its layout for mobile devices.

## Accessibility

- The block uses semantic HTML structure for better screen reader compatibility.
- Code snippet titles are implemented as buttons for keyboard navigation.
- Color contrast ratios are maintained for readability.

## Suggestions for Improvement

1. Add syntax highlighting for code snippets.
2. Implement a search functionality to filter code snippets.
3. Add an option to copy code snippets to the clipboard.
4. Implement a fullscreen mode for the code display.
5. Add the ability to customize the order of code snippets.
