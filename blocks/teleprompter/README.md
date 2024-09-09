# Teleprompter

The Teleprompter block creates a scrolling text display for reading scripts or presenting information in a controlled manner.

## Usage

This block allows content authors to create a teleprompter-style text display with start, stop, and speed control functionality.

## Authoring

In your Google Docs or Microsoft Word document, create a two-column block structure:

| Teleprompter |
|--------------|
| Your script content goes here. You can include multiple paragraphs and format the text as needed. |

## Styling

The block uses the following CSS classes for styling:
- `.teleprompter-container`: Main container for the teleprompter
- `.teleprompter-text`: Container for the scrolling text
- `.teleprompter-controls`: Container for the control buttons and speed slider

You can customize the appearance by modifying these classes in your project's CSS.

## Behavior

- The teleprompter starts scrolling when the "Start" button is clicked.
- The "Stop" button pauses the scrolling.
- The speed slider adjusts the scrolling speed in real-time.
- The controls remain visible at the bottom of the container while scrolling.

## Accessibility

- Control buttons have appropriate `aria-label` attributes for screen readers.
- The speed slider is labeled for accessibility.

## Suggestions for Improvement

1. Add a "Reset" button to return to the top of the text.
2. Implement keyboard shortcuts for start, stop, and speed adjustment.
3. Add an option to change text size and color for better visibility.
4. Include a fullscreen mode for distraction-free reading.
5. Implement text highlighting to indicate the current reading position.