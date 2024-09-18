# Import About Block

This block creates the about section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import About block generates an "About" section with a title and paragraph of text.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-about |
| :---- |
| [About text] |

## Styling

The block includes styles for the about section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block simply displays the provided text content.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the about section:
1. Modify the CSS in `import-about.css` to adjust styles.
2. Update the HTML structure in `import-about.js` if needed.