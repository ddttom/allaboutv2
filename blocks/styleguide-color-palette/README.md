# Styleguide Color Palette

This block displays the color palette used in the style guide, showing color swatches with their names and hex values.

## Usage

Place this block in your style guide to showcase the primary, secondary, and accent colors used in the design.

## Authoring

In your Google Docs or Microsoft Word document, create a table with one row and one column:

| styleguide-color-palette |
| :---- |

The block will automatically fetch the color data from the `styleguide-color-palette.json` file.

## Styling

The block uses the following CSS classes:
- `.styleguide-color-palette`: Main container
- `.color-swatch`: Individual color swatch
- `.color-info`: Container for color name and hex value

## Behavior

The block fetches color data from a JSON file and dynamically creates color swatches with their respective information.

## Accessibility

- Color information is provided both visually and textually
- Sufficient color contrast is maintained for text readability

## Suggestions for Improvement

- Add color usage guidelines for each color
- Implement a copy-to-clipboard feature for color hex values
- Include WCAG contrast ratio information for each color