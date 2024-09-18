# Import Education Block

This block creates the education section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Education block generates a list of educational experiences, including school logos, institution names, degrees, and study periods. It also includes a "See more" functionality to display additional education entries.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-education |
| :---- |
| [School Logo URL] | [Institution Name] | [Degree/Field of Study] | [Study Period] |
| [School Logo URL] | [Institution Name] | [Degree/Field of Study] | [Study Period] |
| ... |

Add as many rows as needed for each educational experience entry. The first two entries will be displayed initially, with the rest hidden behind a "See more" button.

## Styling

The block includes styles for the education section layout, including school logos and text elements. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the education list based on the provided content. It implements a "See more" functionality to show/hide additional education entries beyond the first two entries.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- School logos include alt text for screen readers.
- Proper heading hierarchy is maintained for screen readers.
- The "See more" button is keyboard accessible and toggles the visibility of additional education entries.

## Customization

To customize the appearance of the education section:
1. Modify the CSS in `import-education.css` to adjust styles.
2. Update the `createEducationItem` function in `import-education.js` to change the structure of each education entry.
3. Adjust the number of initially visible education entries by modifying the `slice` parameters in the JavaScript file.
