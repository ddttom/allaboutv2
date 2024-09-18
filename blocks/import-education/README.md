# Import Education Block

This block creates the education section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Education block generates a list of educational experiences, including school logos, institution names, degrees, and study periods.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-education |
| :---- |
| [School Logo URL] | [Institution Name] | [Degree/Field of Study] | [Study Period] |
| [School Logo URL] | [Institution Name] | [Degree/Field of Study] | [Study Period] |
| ... |

Add as many rows as needed for each educational experience entry.

## Styling

The block includes styles for the education section layout, including school logos and text elements. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the education list based on the provided content.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- School logos include alt text for screen readers.
- Proper heading hierarchy is maintained for screen readers.
