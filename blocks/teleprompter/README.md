# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrolling format.

## Usage

Place the teleprompter block where you want the teleprompter icon to appear. The block will read all text content below it.

## Authoring

Create your script content in Google Docs or Microsoft Word, with each paragraph as a separate line. Use the following special markers:

- `**note**`: Precede a line with this to display it in light gray.
- `**action**`: Precede a line with this to display it in yellow and pause the scrolling.

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

1. Click the teleprompter icon to start.
2. The screen turns black, and text starts scrolling.
3. Press spacebar to pause/resume.
4. Click the stop icon or press Esc to exit.
5. A timer displays in the top right corner.

## Accessibility

- Keyboard controls (spacebar and Esc) are provided for better accessibility.
- High contrast colors are used for better readability.

## Dependencies

This block has no external dependencies.

## Suggestions for Improvement

1. Add speed control for text scrolling.
2. Implement text size adjustment.
3. Add support for different languages and text directions.
4. Implement a practice mode with speech recognition.