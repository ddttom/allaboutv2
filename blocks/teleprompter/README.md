# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrolling format.

## Usage

Add the teleprompter block to your page and ensure that the text content you want to display is present in the DOM below the block.

## Authoring

Create your content in Google Docs or Microsoft Word, with each paragraph representing a line in the teleprompter. Use the following special prefixes for specific formatting:

- `**note**`: Displays the line in light gray
- `**action**`: Displays the line in yellow and pauses the scrolling

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

1. Click the teleprompter icon in the top-left corner to start.
2. The screen turns black, and text starts scrolling from top to bottom.
3. Press the spacebar to pause/resume scrolling.
4. Click the stop icon or press the Esc key to exit the teleprompter mode.
5. Action items (prefixed with `**action**`) will pause the scrolling automatically.

## Accessibility

- Keyboard controls (spacebar and Esc key) are provided for better accessibility.
- High contrast colors are used for better readability.

## Suggestions for Improvement

1. Add speed control for text scrolling.
2. Implement text size adjustment options.
3. Add support for remote control via mobile devices.
4. Implement a practice mode with speech recognition.
5. Add multi-language support for interface elements.
