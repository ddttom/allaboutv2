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

The block dynamically generates the skills list based on the provided content. Each skill tag is interactive and can be toggled on/off.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Skills are presented in a semantic list structure for screen readers.
- Each skill tag is keyboard accessible and can be toggled using the Enter or Space key.
- ARIA attributes are used to indicate the pressed state of each skill tag.

## Customization

To customize the appearance and behavior of the skills section:
1. Modify the CSS in `import-skills.css` to adjust styles, including colors, spacing, and hover effects.
2. Update the JavaScript in `import-skills.js` if you want to modify the interactivity or add additional functionality to the skill tags.
