# Code Expander Block

The Code Expander block enhances code snippets with syntax highlighting, copy functionality, expandable views, raw code viewing, and download capabilities. It provides a modern, interactive code display experience for technical documentation, tutorials, and blogs.

## Features

- **Automatic Syntax Highlighting**: Detects and highlights syntax for JavaScript, HTML, CSS, Python, Shell, JSON, and Markdown
- **Copy to Clipboard**: One-click copying of code snippets
- **Expandable View**: Collapsible interface for long code blocks
- **Raw Code View**: Toggle between formatted and raw code views
- **Download Code**: Save code snippets as files with appropriate extension
- **Help Information**: Info button with tooltip explaining each control's function
- **Responsive Design**: Optimized for all screen sizes
- **Keyboard Navigation**: Use arrow keys to navigate (←→ in formatted view, ↑↓ in raw view)
- **Improved Python Detection**: Better recognition of Python code patterns
- **Global Code Block Processing**: Automatically finds and processes all code blocks on the page, even if they're not initially within the code-expander block
- **Multiple Code Block Support**: Handles any number of code blocks on a single page
- **Non-destructive Processing**: Preserves original code blocks while creating enhanced versions

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

Alternatively, you can simply add an empty code-expander block anywhere on your page, and it will automatically find and enhance all code blocks:

| code-expander |
| :------------ |
|  |

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Create a table with one column and two rows
2. In the first cell, type `code-expander`
3. In the second cell, paste your code snippet
4. Format the code with a monospace font (like Courier New) to maintain proper spacing

If you want the block to automatically find and process all code blocks on the page, you can leave the second cell empty.

## Styling

The Code Expander block can be customized through CSS variables:

```css
:root {
  --code-expander-button-bg: #4a90e2;        /* Button background color */
  --code-expander-button-text: #ffffff;      /* Button text color */
  --code-expander-code-bg: #f8f8f8;          /* Code background color */
  --code-expander-border-radius: 6px;        /* Border radius for container */
  --code-expander-tooltip-bg: #fff;          /* Tooltip background color */
  --code-expander-tooltip-border: #ddd;      /* Tooltip border color */
}
```

## Behavior

The Code Expander block provides the following interactive features:

1. **Global Code Block Processing**: Automatically finds all `<pre><code>` elements on the page and enhances them
2. **Language Detection**: Automatically detects the language of each code snippet
3. **Copy Button**: Copies the entire code snippet to the clipboard
4. **View Raw Button**: Toggles between formatted and raw code views
5. **Download Button**: Opens a modal to enter a custom filename before downloading
6. **Expand/Collapse**: For code blocks longer than 40 lines, provides expand/collapse functionality
7. **Info Button**: Displays a tooltip with explanations of each button's function
8. **Keyboard Navigation**: 
   - Use left/right arrow keys to scroll horizontally in formatted view
   - Use up/down arrow keys to scroll vertically in raw view
9. **Scroll Hint**: Shows a hint for keyboard navigation when content overflows

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
- Info button provides context for all controls
- Tooltips are properly labeled with ARIA attributes
- Fixed positioning ensures tooltips are always visible regardless of code block height
- Arrow key navigation for scrolling through code content

## Troubleshooting

- **Code not highlighting properly**: Ensure the language is correctly specified or let the automatic detection work by not specifying a language
- **Copy button not working**: Some browsers require HTTPS for clipboard access
- **Download not working**: Check browser permissions for downloading files
- **Syntax highlighting issues**: If syntax highlighting appears incorrect, try specifying the language explicitly in the code block
- **Info tooltip not appearing**: Make sure JavaScript is enabled in your browser
- **Tooltip cut off**: The tooltip now uses fixed positioning to ensure it's always visible, even on shallow code blocks
- **Keyboard navigation not working**: Ensure the code block has focus by clicking on it first
- **Code blocks not being processed**: If you're using an empty code-expander block and some code blocks aren't being enhanced, make sure they use the proper `<pre><code>` HTML structure
- **Code elements disappearing**: If code elements disappear after adding the code-expander block, make sure you're using the latest version which preserves original code blocks

## Performance Considerations

The Code Expander block is optimized for performance:

- Syntax highlighting is performed client-side without external libraries
- DOM manipulation is minimized
- CSS is optimized for rendering performance
- No external dependencies are required
- Configuration variables are centralized for better maintenance
- Tooltips are only added to the DOM when needed
- Scroll hints are only shown when content actually overflows
- Code processing is modularized for better maintainability and performance

## Browser Compatibility

The Code Expander block is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Implementation Notes

The block uses vanilla JavaScript and CSS with no external dependencies. The syntax highlighting is implemented using regular expressions for optimal performance. The code is structured with a configuration object at the top for easy maintenance and localization. 

The block now features a more modular approach to processing code blocks:

1. It first checks if the code-expander block is empty
2. If empty, it finds all code blocks in the document and creates enhanced copies in the code-expander block
3. If not empty, it processes only the code blocks within it

This approach allows for maximum flexibility in how the block can be used, either as a container for specific code blocks or as a processor for all code blocks on the page.

The latest version of the code-expander block uses a non-destructive approach to processing code blocks. Instead of removing the original code elements from the page, it creates new elements with the enhanced functionality. This ensures that the original content remains intact while still providing the enhanced experience.

Tooltips use fixed positioning relative to the viewport to ensure they're always visible regardless of the code block's dimensions. Keyboard navigation is implemented for better accessibility, allowing users to navigate through code content using arrow keys.
