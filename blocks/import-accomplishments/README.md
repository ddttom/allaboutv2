# Import Accomplishments Block

This block creates the accomplishments section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Accomplishments block generates a list of accomplishments categorized by type (e.g., Publications, Patents).

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-accomplishments |
| :---- |
| [Category Name] |
| [Accomplishment 1] |
| [Accomplishment 2] |
| [Category Name] |
| [Accomplishment 1] |
| ... |

## Styling

The block includes styles for the accomplishments section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block displays a list of accomplishments grouped by categories.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the accomplishments section:
1. Modify the CSS in `import-accomplishments.css` to adjust styles.
2. Update the HTML structure in `import-accomplishments.js` if needed.