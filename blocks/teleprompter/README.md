# Teleprompter

This block creates a teleprompter functionality for the webpage, allowing users to view and scroll through the page content in a teleprompter-style format.

## Usage

To use the teleprompter block, simply add it to your Franklin page. The block will automatically gather all text content from the page and prepare it for the teleprompter view.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word. The teleprompter will use all text content present on the page.

To mark text as a note (displayed in light gray), precede it with `**note**` in your content.

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

1. A teleprompter icon appears in the top-left corner of the viewport.
2. Clicking the icon activates the teleprompter view:
   - The screen turns black
   - A stop icon appears in the top-left corner
   - A timer starts in the top-right corner
   - Text begins scrolling from bottom to top
3. Pressing the spacebar pauses/resumes the scrolling
4. Clicking the stop icon or pressing the Esc key exits the teleprompter view

## Accessibility

- The teleprompter can be controlled using both mouse and keyboard inputs.
- High contrast white text on a black background improves readability.

## Suggestions for Improvement

1. Add customizable scroll speed options
2. Implement text size adjustment controls
3. Add support for different color themes
4. Include an option to import external text files
5. Implement voice control for hands-free operation