# Styleguide Header

This block represents the header of the style guide, displaying the logo, title, and description.

## Usage

Place this block at the top of your style guide page to provide an introduction and context.

## Authoring

In your Google Docs or Microsoft Word document, create a table with one row and one column:

| styleguide-header |
| :---- |

The block will automatically fetch the content from the `styleguide-header.json` file.

## Styling

The block uses the following CSS classes:
- `.styleguide-header`: Main container
- `.styleguide-header-logo`: Logo container
- Custom styles for `h1` and `p` elements

## Behavior

The block fetches data from a JSON file and dynamically creates the header content.

## Accessibility

- The logo includes an alt text for screen readers
- Semantic HTML structure with `<header>`, `<h1>`, and `<p>` tags

## Suggestions for Improvement

- Add support for multiple languages
- Implement a dark mode version of the header
- Allow for custom background images or patterns