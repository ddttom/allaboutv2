# Code Expander Block

The Code Expander block enhances code snippets with syntax highlighting, copy functionality, expandable views, raw code viewing, and download capabilities. It provides a modern, interactive code display experience for technical documentation, tutorials, and blogs.

## Features

- **Automatic Syntax Highlighting**: Detects and highlights syntax for JavaScript, HTML, CSS, Python, Shell, JSON, and Markdown
- **Copy to Clipboard**: One-click copying of code snippets
- **Expandable View**: Collapsible interface for long code blocks
- **Raw Code View**: Toggle between formatted and raw code views
- **Download Code**: Save code snippets as files with custom filenames
- **Responsive Design**: Optimized for all screen sizes
- **Keyboard Accessibility**: Full keyboard navigation support

## Usage

To use the Code Expander block in your Franklin document, create a table with the block name in the first cell, followed by your code snippet enclosed in triple backticks with an optional language identifier:

| code-expander |
| :------------ |
| ```javascript
function helloWorld() {
  console.log("Hello, World!");
  return "Hello, World!";
}
``` |

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Create a table with one column and two rows
2. In the first cell, type `code-expander`
3. In the second cell, paste your code snippet
4. Format the code with a monospace font (like Courier New) to maintain proper spacing

## Styling

The Code Expander block can be customized through CSS variables:

```css
:root {
  --code-expander-button-bg: #4a90e2;        /* Button background color */
  --code-expander-button-text: #ffffff;      /* Button text color */
  --code-expander-code-bg: #f8f8f8;          /* Code background color */
  --code-expander-border-radius: 6px;        /* Border radius for container */
}
```

## Behavior

The Code Expander block provides the following interactive features:

1. **Language Detection**: Automatically detects the language of the code snippet
2. **Copy Button**: Copies the entire code snippet to the clipboard
3. **View Raw Button**: Toggles between formatted and raw code views
4. **Download Button**: Opens a modal to enter a custom filename before downloading
5. **Expand/Collapse**: For code blocks longer than 40 lines, provides expand/collapse functionality
6. **Scroll Hint**: Shows a hint for horizontal scrolling when code exceeds the container width

## Variations

The Code Expander block supports the following variations:

| code-expander (dark) |
| :------------------- |
| ```javascript
function example() {
  return "This is an example";
}
``` |

This variation applies a dark theme to the code display.

## Accessibility

The Code Expander block is designed with accessibility in mind:

- All interactive elements are keyboard accessible
- Focus states are clearly visible
- ARIA attributes are used where appropriate
- Color contrast meets WCAG standards

## Troubleshooting

- **Code not highlighting properly**: Ensure the language is correctly specified or let the automatic detection work by not specifying a language
- **Copy button not working**: Some browsers require HTTPS for clipboard access
- **Download not working**: Check browser permissions for downloading files
- **Syntax highlighting issues**: If syntax highlighting appears incorrect, try specifying the language explicitly in the code block

## Performance Considerations

The Code Expander block is optimized for performance:

- Syntax highlighting is performed client-side without external libraries
- DOM manipulation is minimized
- CSS is optimized for rendering performance
- No external dependencies are required

## Browser Compatibility

The Code Expander block is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Implementation Notes

The block uses vanilla JavaScript and CSS with no external dependencies. The syntax highlighting is implemented using regular expressions for optimal performance.
