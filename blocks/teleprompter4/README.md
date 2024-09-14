# Teleprompter4

The Teleprompter4 block is an advanced Franklin component that provides a customizable teleprompter functionality for web pages.

## Usage

To use the Teleprompter4 block, simply add it to your Franklin page using the following structure:

| Teleprompter4 |
| ------------- |
|               |

No additional content is needed within the block as it automatically processes the page content.

## Authoring

No specific authoring is required for this block in Google Docs or Microsoft Word. The teleprompter will automatically use all the text content from the main body of the page.

## Styling

The block comes with default styling, but you can customize its appearance using CSS variables or by modifying the `teleprompter4.css` file.

## Behavior

1. A clickable icon appears in the top-left corner of the viewport when the page loads.
2. Clicking the icon activates the teleprompter, which displays page content in a scrollable format.
3. Use mouse wheel or arrow keys to navigate through the content.
4. Press spacebar to pause/resume the teleprompter.
5. Press Esc to close the teleprompter.
6. The teleprompter window is draggable for repositioning.

## Dependencies

This block relies on the `aem.js` script for the `createOptimizedPicture` function.

## Accessibility

- The teleprompter icon and content area are keyboard accessible.
- ARIA labels are used for better screen reader support.
- Color contrast adheres to WCAG guidelines.

## Suggestions for Improvement

1. Add font size controls for better readability.
2. Implement speech recognition for hands-free control.
3. Add an option to adjust scrolling speed.
4. Include a feature to import external text files.
5. Implement a dark/light mode toggle for user preference.

These improvements would enhance the functionality and user experience of the Teleprompter4 block.
