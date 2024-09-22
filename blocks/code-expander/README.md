# Code Expander Block

The Code Expander block is a versatile component designed to enhance code display and interaction on web pages. It provides syntax highlighting for various programming languages, line numbers for JavaScript, and offers a convenient copy-to-clipboard functionality with customizable appearance and improved user interaction.

## Features

1. Syntax highlighting for multiple languages:
   - JavaScript (with line numbers)
   - CSS
   - HTML
   - JSON
   - Markdown
   - Terminal commands
2. Automatic language detection based on code content
3. Copy-to-clipboard functionality with visual feedback
4. Line numbers for JavaScript code
5. Expand/collapse functionality for long code snippets (more than 80 lines)
6. Accessibility considerations (ARIA labels)
7. Responsive design
8. Customizable appearance for buttons and code background
9. Visual feedback for hover and focus states on buttons

## Usage

To use the Code Expander block in your Franklin project:

1. Place the `code-expander.js` file in the `blocks/code-expander/` directory.
2. Mark text with a courier font in the document, triggering autoblocking.
3. Use the CodeExpander block once in the document

The component will automatically detect the language and apply appropriate styling and functionality.

## Authoring

When creating content in Google Docs or Microsoft Word, use the following structure:

| CodeExpander |
| ------------- |

## Styling

The block uses the following CSS classes:

- `.code-expander-wrapper`: Wraps the entire component (copy button and code)
- `.code-expander-copy`: Styles the copy button
- `.code-expander-copy-text`: Styles the "Copy code" text
- `.code-expander-code`: Wraps the code element for additional styling control

The `<pre>` element within `.code-expander-code` has a light background for visual distinction.

## Behavior

- A "Copy code" button with a clipboard icon (📋) is added above each decorated element.
- The code is displayed within a light background for better visual separation.
- Clicking the button copies the code content to the clipboard.
- The button text changes to "Copied!" with a checkmark (✅) for 2 seconds after successful copying.

## Accessibility

- The copy button has appropriate `aria-label` attributes for screen readers.
- The button's state changes are reflected in the `aria-label` for accessibility.

## Dependencies

This block has no external dependencies.
