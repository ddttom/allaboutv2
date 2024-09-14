# Teleprompter4

The Teleprompter4 block is an advanced Franklin component that provides a customizable teleprompter functionality for web pages.

## Usage

To use the Teleprompter4 block, simply add it to your Franklin page using the following markdown:

| teleprompter4 |
| ------------- |
|               |

## Authoring

No specific content is required within the Teleprompter4 block in Google Docs or Microsoft Word. The block automatically reads all text content from the page below its position.

## Styling

The Teleprompter4 block comes with pre-defined styles. Custom styling can be achieved by modifying the `teleprompter4.css` file.

## Behavior

1. Initially, a clickable icon (&#128217;) is displayed in the top-left corner of the viewport.
2. Clicking the icon activates the teleprompter, which appears centered on the screen.
3. The teleprompter displays the current line in bold, followed by up to 10 upcoming lines.
4. Users can scroll through the content using the mouse wheel or arrow keys.
5. The spacebar toggles pause/resume functionality.
6. Pressing the Esc key closes the teleprompter.
7. The teleprompter window is draggable.
8. A timer in the top-right corner shows the elapsed time.

## Dependencies

This block relies on the `aem.js` script for the `createOptimizedPicture` function, which is not used in the current implementation but may be useful for future enhancements.

## Accessibility

- The teleprompter is keyboard accessible.
- ARIA labels are used for screen readers.
- The teleprompter can be focused using the tab key.

## Suggestions for Improvement

1. Add font size controls for better readability.
2. Implement color scheme options for different lighting conditions.
3. Add a speed control feature for adjusting scrolling speed.
4. Implement a feature to import custom text or connect to a CMS.
5. Add support for multiple languages and text directions.
