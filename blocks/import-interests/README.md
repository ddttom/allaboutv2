# Import Interests Block

This block creates the interests section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Interests block generates a list of interests.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-interests |
| :---- |
| [Interest 1] |
| [Interest 2] |
| [Interest 3] |
| ... |

## Styling

The block includes styles for the interests section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block displays a list of interests as tags.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the interests section:
1. Modify the CSS in `import-interests.css` to adjust styles.
2. Update the HTML structure in `import-interests.js` if needed.