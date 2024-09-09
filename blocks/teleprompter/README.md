# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrolling format.

## Usage

Add the teleprompter block to your page where you want the teleprompter functionality to be available.

## Authoring

Create your content in Google Docs or Microsoft Word as normal paragraphs. Use the following special formatting:

- Prefix a paragraph with `**note**` to display it in light gray.
- Prefix a paragraph with `**action**` to display it in yellow and pause the scrolling.

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

- Click the teleprompter icon in the top-left corner to start/stop the teleprompter.
- Press the spacebar to pause/resume scrolling.
- Press the Esc key to stop the teleprompter and return to the original view.
- The text scrolls automatically, advancing one line every 10 seconds.
- A timer displays in the top-right corner when the teleprompter is active.

## Accessibility

- Keyboard controls (spacebar and Esc key) are available for users who cannot use a mouse.
- High contrast colors are used for better visibility.

## Suggestions for Improvement

1. Add speed control for text scrolling.
2. Implement text size adjustment for better readability.
3. Add support for different languages and text directions.
4. Implement a practice mode with speech recognition.
5. Add the ability to save and load multiple scripts.
