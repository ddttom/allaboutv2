# Teleprompter

This block creates a teleprompter functionality for the page content.

## Usage

Add the teleprompter block to your page to enable the teleprompter functionality.

## Authoring

No specific authoring is required for this block. It automatically reads all text content from the page.

To add notes that appear in light gray, prefix the text with `**note**` in your Google Docs or Microsoft Word document.

## Styling

The block uses the following CSS classes for styling:

- `.teleprompter-container`: Contains all teleprompter elements
- `.teleprompter-icon`: Styles the teleprompter icon
- `.stop-icon`: Styles the stop icon
- `.timer-display`: Styles the timer display
- `.text-container`: Styles the container for the teleprompter text
- `.note`: Styles note text in light gray

## Behavior

1. Click the teleprompter icon to start the teleprompter.
2. The screen turns black, and text starts scrolling from top to bottom.
3. Press the spacebar to pause/resume the teleprompter.
4. Click the stop icon or press the Esc key to stop the teleprompter and return to the original view.
5. A timer in the top right corner shows the elapsed time.

## Accessibility

- The teleprompter can be controlled using both mouse clicks and keyboard shortcuts (spacebar and Esc key).
- High contrast white text on a black background for better readability.

## Dependencies

This block depends on the `aem.js` script for the `createOptimizedPicture` function.

## Suggestions for Improvement

1. Add customizable speed control for text scrolling.
2. Implement text size adjustment options.
3. Add support for different color themes.
4. Include an option to import external text files.
5. Implement voice control for hands-free operation.
