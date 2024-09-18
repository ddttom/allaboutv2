# Import Featured Block

This block creates the featured section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Featured block generates a "Featured" section with a title and featured item.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-featured |
| :---- |
| [Featured item title] | [Featured item link] |
| [Featured item description] |

## Styling

The block includes styles for the featured section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block displays the featured item with a title, link, and description.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the featured section:
1. Modify the CSS in `import-featured.css` to adjust styles.
2. Update the HTML structure in `import-featured.js` if needed.