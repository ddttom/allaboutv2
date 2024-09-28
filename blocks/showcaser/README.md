# Showcaser Block

The Showcaser block is a Franklin component that displays code snippets in an interactive, book-like interface.

## Usage

To use the Showcaser block, simply add the following to your Franklin document:

| Showcaser |
| :---- |
| `Title 1` |
| `Code snippet 1` |
| `Title 2` |
| `Code snippet 2` |

## Authoring

1. Create a table with one column and the header "Showcaser".
2. Add code snippets enclosed in single backticks (`) in subsequent rows.
3. The first line of each code snippet will be used as the title in the left panel.

## Styling

The Showcaser block uses CSS variables for easy customization:

- `--showcaser-bg-color`: Background color of the container
- `--showcaser-text-color`: Text color
- `--showcaser-accent-color`: Color for active/hover states
- `--showcaser-border-color`: Color for borders
- `--showcaser-font-family`: Font family
- `--showcaser-font-size`: Base font size
- `--showcaser-line-height`: Line height
- `--showcaser-padding`: Padding for the container
- `--showcaser-border-radius`: Border radius for rounded corners

## Behavior

- Clicking on a title in the left panel displays the corresponding code snippet in the right panel.
- The first code snippet is displayed by default.
- The block is responsive and adjusts its layout for smaller screens.

## Variations

- Add the class `showcaser--compact` for a more compact layout.

## Accessibility

- The Showcaser block uses semantic HTML and ARIA attributes for improved accessibility.
- Keyboard navigation is supported for switching between code snippets:
  - Use Tab to focus on title buttons
  - Use Arrow keys (Up/Down) to navigate between titles
  - Use Enter or Space to select a title and display its content

## Dependencies

This block has no external dependencies beyond the Franklin core libraries.
