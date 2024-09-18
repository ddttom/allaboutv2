# Import Experience Block

This block creates the experience section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Experience block generates a list of work experiences, including company logos, job titles, company names, and employment periods.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-experience |
| :---- |
| [Company Logo URL] | [Job Title] | [Company Name] | [Employment Period] |
| [Company Logo URL] | [Job Title] | [Company Name] | [Employment Period] |
| ... |

Add as many rows as needed for each work experience entry.

## Styling

The block includes styles for the experience section layout, including company logos and text elements. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the experience list based on the provided content.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Company logos include alt text for screen readers.
- Proper heading hierarchy is maintained for screen readers.