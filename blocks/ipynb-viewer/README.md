# IPynb Viewer Block

Display and execute Jupyter notebook (.ipynb) files directly in your EDS site with interactive JavaScript execution capabilities.

## Features

- **Parse and Display Notebooks**: Renders both markdown and code cells from .ipynb files
- **Interactive Execution**: Run JavaScript code cells with a click
- **Output Display**: Shows console logs, results, and errors inline
- **Run All**: Execute all code cells in sequence
- **Responsive Design**: Mobile-friendly layout
- **Syntax Highlighting**: Clear code formatting with monospace fonts
- **Error Handling**: Graceful error messages and visual indicators

## Usage

### Basic Usage

Add the block to your page with a link to your notebook file:

```
| IPynb Viewer |
|--------------|
| /path/to/notebook.ipynb |
```

### With a Clickable Link

```
| IPynb Viewer |
|--------------|
| [View Notebook](/path/to/notebook.ipynb) |
```

## Notebook Structure Support

The block supports standard Jupyter notebook JSON format with **enhanced markdown rendering**:

### Markdown Cells (Enhanced)

**Code Blocks (NEW):**
- Triple backtick code blocks with optional language specification
- Proper syntax highlighting and formatting
- Example: \`\`\`javascript\n...\n\`\`\`

**Tables (NEW):**
- Full markdown table support with headers
- Alternating row colors for readability
- Responsive table styling
- Example: `| Header 1 | Header 2 |`

**Lists (NEW):**
- Unordered lists with `-` or `*`
- Ordered lists with `1.`, `2.`, etc.
- Proper indentation and spacing

**Inline Formatting:**
- Headers (H1, H2, H3) with `#`, `##`, `###`
- **Bold** text with `**text**`
- *Italic* text with `*text*`
- `Inline code` with backticks
- [Links](url) with `[text](url)`
- Line breaks

### Code Cells
- JavaScript code execution
- Console output capture
- Result display
- Error handling

## Interactive Features

### Run Button
Each code cell has a "Run" button that:
1. Executes the JavaScript code
2. Captures console.log() and console.error() output
3. Displays the return value
4. Shows visual indicators for success/error states

### Run All Button
The header includes a "Run All" button that:
- Executes all code cells in order
- Useful for notebooks with dependencies between cells

### Live Preview with Modal Overlay (NEW)
When using `showPreview()` or `openOverlayPreview()` in code cells:
- **Modal overlay**: Displays preview in a modal on the current page (no popup windows)
- **Same origin**: Runs in page context - CSS and JavaScript load naturally
- **Backdrop blur**: Modern dark theme with blurred background
- **Full interactivity**: Block JavaScript executes with complete styling support
- **No double-decoration**: Passes undecorated HTML to avoid processing blocks twice
- **Easy dismissal**: Click backdrop, press ESC, or use close button
- **Auto-cleanup**: Removes event listeners when closed

**Why overlay instead of popup?**
- No blob URL origin issues
- CSS loads from existing page context
- JavaScript modules import normally
- Better user experience
- No popup blockers

## Example Notebook Structure

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# My Test Notebook\n",
        "This is a markdown cell with **bold** text."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "console.log('Hello from Jupyter!');\n",
        "return 42;"
      ]
    }
  ],
  "metadata": {
    "title": "My Notebook"
  }
}
```

## Technical Details

### Code Execution
- Code runs in the browser using `Function()` constructor
- Console methods are temporarily captured during execution
- Results are displayed in an output area below each cell
- Errors are caught and displayed with red styling

### Overlay Preview System (NEW)

**How it works:**

1. **Creates DOM overlay**:
   ```javascript
   const overlay = document.createElement('div');
   overlay.className = 'block-preview-overlay';
   // Adds backdrop, header, content container
   document.body.appendChild(overlay);
   ```

2. **Injects block HTML**:
   ```javascript
   const blockContainer = overlay.querySelector('.preview-block-container');
   blockContainer.innerHTML = `
     <div class="${blockName} block" data-block-name="${blockName}">
       ${blockHTML}  // Undecorated content
     </div>
   `;
   ```

3. **Decorates in place**:
   ```javascript
   const blockElement = overlay.querySelector(`.${blockName}.block`);
   const module = await import(`/blocks/${blockName}/${blockName}.js`);
   await module.default(blockElement);
   ```

4. **Adds interaction handlers**:
   ```javascript
   // Close on backdrop click
   backdrop.addEventListener('click', () => overlay.remove());

   // Close on ESC key
   document.addEventListener('keydown', (e) => {
     if (e.key === 'Escape') overlay.remove();
   });
   ```

**Why overlay instead of popup/iframe?**
- **Same origin**: Runs in page context, no cross-origin issues
- **Natural CSS loading**: Existing page styles apply automatically
- **JavaScript modules work**: No blob URL or module resolution issues
- **Better UX**: Modal overlay vs popup window
- **No blockers**: Popup blockers don't affect overlays
- **Cleaner**: Auto-cleanup of listeners and DOM elements

### Markdown Parser (Enhanced)

The block includes a comprehensive markdown parser that supports:

**Processing Order:**
1. Code blocks (extracted first with placeholders)
2. Tables (multi-line processing with header detection)
3. Headers (H1, H2, H3)
4. Bold and italic text
5. Inline code
6. Links
7. Lists (unordered and ordered)
8. Code block restoration
9. Line break conversion

**Key Features:**
- **Code block protection**: Prevents markdown processing inside code blocks
- **Table parsing**: Supports markdown tables with `|` delimiters and header rows
- **List handling**: Properly closes and nests `<ul>` and `<ol>` tags
- **HTML escaping**: Safely escapes `<` and `>` in code blocks
- **Language tagging**: Preserves language hints from code fences

### Security Considerations
- Code execution happens in the user's browser context
- Be cautious with untrusted notebook files
- Code has access to the global scope and DOM
- Consider implementing additional sandboxing for public sites

### Supported Code
- Standard JavaScript (ES6+)
- Console methods (log, error)
- DOM manipulation
- Async code (with await)
- Return values

### Limitations
- Only JavaScript code cells are executable
- Python or other language cells are displayed but not executed
- No persistent state between page reloads

## Styling

The block uses CSS custom properties for theming:

```css
--background-color: Background color
--text-color: Text color
--primary-color: Primary accent (buttons, links)
--success-color: Success indicators
--error-color: Error indicators
--code-background: Code cell background
--light-color: Border colors
```

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive buttons
- Keyboard navigation support
- Focus indicators on buttons
- Screen reader friendly

## Mobile Support

- Responsive layout for all screen sizes
- Touch-friendly buttons
- Horizontal scrolling for long code
- Stacked layout on small screens

## Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API required
- CSS custom properties support
- No IE11 support

## File Structure

```
blocks/ipynb-viewer/
├── ipynb-viewer.js       # Main block logic
├── ipynb-viewer.css      # Block styles
├── README.md             # This file
├── EXAMPLE.md            # Usage examples
└── test.html             # Development test file
```

## Development

### Testing Locally

1. Start the development server:
   ```bash
   npm run debug
   ```

2. Access the test file:
   ```
   http://localhost:3000/blocks/ipynb-viewer/test.html
   ```

### Creating Test Notebooks

Create a `.ipynb` file in JSON format:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": ["# Test\n", "Content here"]
    },
    {
      "cell_type": "code",
      "source": ["console.log('test');\n", "return 123;"]
    }
  ],
  "metadata": {
    "title": "Test Notebook"
  }
}
```

## Related Documentation

- [EDS Block Development](../../.claude/skills/eds-block-development/SKILL.md)
- [Jupyter Notebook Testing](../../docs/for-ai/explaining-jupyter.md)
- [EDS Native Testing](../../docs/for-ai/testing/eds-native-testing-standards.md)

## Tips

1. **Test your notebooks**: Verify notebook JSON structure is valid
2. **Keep code simple**: Complex dependencies may not work in browser context
3. **Use console.log**: Helps debug execution issues
4. **Mobile testing**: Check layout on different screen sizes
5. **Error handling**: Wrap risky code in try-catch blocks

## Common Issues

### Notebook Won't Load
- Check file path is correct
- Verify JSON structure is valid
- Check browser console for fetch errors
- Ensure CORS headers allow notebook file access

### Code Won't Execute
- Verify code is JavaScript (not Python/other languages)
- Check for syntax errors in code cells
- Look for console errors during execution
- Ensure code doesn't rely on Node.js-specific APIs

### Styling Issues
- Check CSS custom properties are defined
- Verify block CSS is loaded
- Test with different viewport sizes
- Check for CSS conflicts with site styles

## Future Enhancements

Potential improvements for future versions:

- Syntax highlighting for code
- Cell execution order tracking
- Persistent cell outputs
- Export results to file
- Support for cell metadata (collapsed, hidden)
- Better markdown parsing (tables, lists)
- Image output support
- Rich output display (HTML, SVG)
