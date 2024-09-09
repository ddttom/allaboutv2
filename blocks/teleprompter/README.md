# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrollable format.

## Usage

Add the teleprompter block to your page where you want the teleprompter functionality to be available.

## Authoring

No specific authoring is required for the teleprompter block itself. The block will automatically process and display all text content on the page below it.

## Styling

The teleprompter uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

- Clicking the teleprompter icon opens the teleprompter view.
- The text scrolls from bottom to top.
- Use the mouse wheel to control scrolling speed.
- Press the spacebar to pause/resume.
- Press the Esc key or click the stop icon to exit the teleprompter view.

## Dependencies

This block depends on the `aem.js` script for optimized picture creation.

## Accessibility

- Keyboard controls are fully functional (Spacebar for pause/resume, Esc for exit).
- ARIA labels should be added to the SVG elements for improved screen reader support.

## Suggestions for Improvement

1. Add customizable scrolling speed options.
2. Implement text size adjustment controls.
3. Add support for different color themes.
4. Implement a preview mode for content creators.
5. Add support for importing external text files.