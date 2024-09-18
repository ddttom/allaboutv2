# Import Skills Block

This block creates the skills section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Skills block generates a list of skills displayed as interactive tags.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-skills |
| :---- |
| [Skill 1] |
| [Skill 2] |
| [Skill 3] |
| ... |

Add as many rows as needed for each skill.

## Styling

The block includes styles for displaying skills as interactive tags. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the skills list based on the provided content. Each skill tag has a hover effect for improved interactivity.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Skills are presented in a semantic list structure for screen readers.
- Color contrast for skill tags meets WCAG 2.1 AA standards.

## Customization

To customize the appearance of the skills section:
1. Modify the CSS in `import-skills.css` to adjust styles, including colors, spacing, and hover effects.
2. Update the JavaScript in `import-skills.js` if you want to add additional interactivity or functionality to the skill tags.
