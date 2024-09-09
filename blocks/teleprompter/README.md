# Teleprompter

This block creates a teleprompter functionality for displaying text content in a scrolling format.

## Usage

Add the teleprompter block to your page where you want the teleprompter functionality to be available.

## Authoring

In your Google Docs or Microsoft Word document, structure your content as follows:

| Teleprompter |
|--------------|
| Your content here. Each paragraph will be treated as a separate text element. |
| Use **note** at the beginning of a line for light gray text. |
| Use **action** at the beginning of a line for yellow text that pauses the teleprompter. |

## Styling

The teleprompter uses custom CSS classes for styling. You can customize the appearance by modifying the `teleprompter.css` file.

## Behavior

- Click on the teleprompter icon to start the teleprompter.
- The text scrolls automatically every 4 seconds.
- Press spacebar to pause/resume scrolling.
- Press 'Esc' or click the stop icon to exit the teleprompter.
- Use '+' and '-' buttons or keys to adjust scrolling speed.
- Action items (yellow text) pause the teleprompter until spacebar is pressed.

## Accessibility

- Keyboard controls are fully functional for operating the teleprompter.
- ARIA labels should be added to SVG elements for improved screen reader support.

## Dependencies

This block relies on the `aem.js` script for the `createOptimizedPicture` function.

## Suggestions for Improvement

1. Add voice control options for hands-free operation.
2. Implement a preview mode for content creators.
3. Allow customization of text styles and colors through a configuration panel.
4. Add support for multiple languages and right-to-left text.
5. Implement a progress bar to show overall progress through the content.