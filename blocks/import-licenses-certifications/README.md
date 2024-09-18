# Import Licenses & Certifications Block

This block creates the licenses and certifications section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Licenses & Certifications block generates a list of licenses and certifications.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-licenses-certifications |
| :---- |
| [Certification Name] | [Issuing Organization] |
| [Certification Name] | [Issuing Organization] |
| ... |

## Styling

The block includes styles for the licenses and certifications section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block displays a list of licenses and certifications with their issuing organizations.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the licenses and certifications section:
1. Modify the CSS in `import-licenses-certifications.css` to adjust styles.
2. Update the HTML structure in `import-licenses-certifications.js` if needed.