# Import Experience Block

This block recreates the "Experience" section of the LinkedIn profile design.

## Usage

Include the Import Experience block in your Franklin document to display the user's work experience.

## Authoring

The block expects the following content structure:

| import-experience |
| :---- |
| Job Title |
| Company • Employment Type |
| Duration |
| Location |

Multiple experiences can be added by repeating this structure.

## Styling

The block uses CSS to style the experience section. Custom styles can be applied by modifying the `import-experience.css` file.

## Behavior

The JavaScript functionality creates the experience section structure, including the "Experience" heading and individual experience items.

## Accessibility

- Semantic HTML elements are used for proper structure and screen reader navigation.

## Suggestions for Improvement

1. Add support for company logos in each experience item.
2. Implement a collapsible/expandable view for multiple experiences.
3. Add an option to include job descriptions or achievements for each role.
4. Implement sorting options (e.g., by date, company) for multiple experiences.
