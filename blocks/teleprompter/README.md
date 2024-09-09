# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrolling format.

## Usage

Place the teleprompter block where you want the teleprompter icon to appear. The block will read all text content below it for display.

## Authoring

Create your content in Google Docs or Microsoft Word as normal paragraphs. Use the following special formatting:

- Prefix a paragraph with `**note**` to display it in light gray.
- Prefix a paragraph with `**action**` to display it in yellow and pause the scrolling.

## Styling

The block uses custom CSS classes for styling. You can modify the `teleprompter.css` file to customize the appearance.

## Behavior

1. Click the teleprompter icon to start the teleprompter.
2. The screen will turn black, and text will start scrolling.
3. Use the spacebar to pause/resume scrolling.
4. Click the stop icon or press the Esc key to exit the teleprompter mode.

## Accessibility

- The teleprompter can be controlled using keyboard shortcuts (spacebar and Esc key).
- High contrast colors are used for better readability.

## Dependencies

This block does not have any external dependencies.

## Suggestions for Improvement

- Add speed control for text scrolling.
- Implement text size adjustment options.
- Add support for different color themes.
- Include an option to upload and use custom scripts.