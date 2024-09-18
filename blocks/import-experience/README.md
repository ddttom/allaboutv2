# Import Experience Block

This block creates the experience section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Experience block generates a list of work experiences, including company logos, job titles, company names, and employment periods. It also includes a "See more" functionality to display additional experiences.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-experience |
| :---- |
| [Company Logo URL] | [Job Title] | [Company Name] | [Employment Period] |
| [Company Logo URL] | [Job Title] | [Company Name] | [Employment Period] |
| ... |

Add as many rows as needed for each work experience entry. The first three entries will be displayed initially, with the rest hidden behind a "See more" button.

## Styling

The block includes styles for the experience section layout, including company logos and text elements. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the experience list based on the provided content. It implements a "See more" functionality to show/hide additional experiences beyond the first three entries.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Company logos include alt text for screen readers.
- Proper heading hierarchy is maintained for screen readers.
- The "See more" button is keyboard accessible and toggles the visibility of additional experiences.

## Customization

To customize the appearance of the experience section:
1. Modify the CSS in `import-experience.css` to adjust styles.
2. Update the `createExperienceItem` function in `import-experience.js` to change the structure of each experience entry.
3. Adjust the number of initially visible experiences by modifying the `slice` parameters in the JavaScript file.