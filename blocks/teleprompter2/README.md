# Teleprompter2

The Teleprompter2 block is an advanced Franklin component that provides a customizable teleprompter functionality for web pages.

## Usage

To use the Teleprompter2 block, simply add it to your Franklin page using the block syntax in your document.

## Authoring

In Google Docs or Microsoft Word, create a new section with the following structure:

| Teleprompter2 |
|---------------|
|               |

The Teleprompter2 block will automatically process all the text content below it on the page.

## Styling

The Teleprompter2 block comes with default styling. You can customize its appearance by modifying the `teleprompter2.css` file.

## Behavior

- Clicking the teleprompter icon activates the teleprompter.
- Use the mouse wheel or arrow keys to scroll through the text.
- Press the spacebar to pause/resume.
- Press the Esc key to close the teleprompter.
- The teleprompter window is draggable.

## Dependencies

This block relies on the Franklin Core Library (aem.js).

## Accessibility

- The teleprompter icon is keyboard focusable.
- All keyboard controls are fully functional.
- ARIA labels are added to the icon for screen readers.

## Suggestions for Improvement

1. Add customizable scroll speed options.
2. Implement text size adjustment controls.
3. Add support for different color themes.
4. Include an option to save and resume from a specific position.
5. Implement voice control for hands-free operation.