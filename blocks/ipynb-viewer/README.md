# IPynb Viewer Block

Display and execute Jupyter notebook (.ipynb) files directly in your EDS site with interactive JavaScript execution capabilities.

## Features

- **Parse and Display Notebooks**: Renders both markdown and code cells from .ipynb files
- **Interactive Execution**: Run JavaScript code cells individually with a click (async/await support)
- **Automatic Initialization Check**: Warns users if they skip Cell 1 (prevents undefined function errors)
- **Context Detection**: Cell 1 initialization displays environment (Node.js/Browser) and setup status
- **Output Display**: Shows console logs, results, and errors inline
- **Sequential Execution**: Run cells in order, starting with Cell 1 (initialization)
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
1. **Checks initialization** - Verifies Cell 1 has been run (shows warning if not)
2. Executes the JavaScript code (with async/await support)
3. Captures console.log() and console.error() output
4. Displays the return value
5. Shows visual indicators for success/error states

**Automatic Initialization Check:**
- If you try to run any cell besides Cell 1 without first running Cell 1, you'll see a warning
- The warning explains that Cell 1 must be run first to set up the environment
- This prevents confusing errors about undefined functions (`testBlockFn`, `showPreview`, etc.)

**Note:** Always run Cell 1 first! It will display context information (Node.js or Browser) and success status.

### Live Preview with Popup Window (NEW)
When using `showPreview()` or `openIframePreview()` in code cells:
- **Popup window**: Opens preview in a new window with isolated context
- **Base tag solution**: Uses `<base href="origin/">` to resolve CSS/JS from correct origin
- **Full styling**: All CSS loads properly via base href resolution
- **Full interactivity**: Block JavaScript executes with complete styling support
- **No double-decoration**: Passes undecorated HTML to avoid processing blocks twice
- **Easy dismissal**: Press ESC or click close button
- **Refresh capability**: Reload button to re-render the block

**How it works:**
- Blob URLs have null origin and can't load external resources
- `<base href="https://your-site/">` tells browser where to resolve relative URLs
- `styles/styles.css` resolves to `https://your-site/styles/styles.css`
- JavaScript modules import correctly using origin detection
- Result: Fully functional styled blocks in isolated window

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

### Popup Preview System (NEW)

**How it works:**

1. **Creates HTML with base tag**:
   ```javascript
   const currentOrigin = window.location.origin;
   const html = `<!DOCTYPE html>
   <html>
   <head>
     <base href="${currentOrigin}/">
     <link rel="stylesheet" href="styles/styles.css">
     <link rel="stylesheet" href="blocks/${blockName}/${blockName}.css">
   </head>`;
   ```

2. **Minimal DOM structure** (EDS-compatible):
   ```html
   <body>
     <div class="preview-header">...</div>  <!-- Fixed position -->
     <main>
       <div class="blockname block">
         <!-- block content as direct children -->
       </div>
     </main>
   </body>
   ```

3. **Creates blob URL and opens window**:
   ```javascript
   const blob = new Blob([html], { type: 'text/html' });
   const url = URL.createObjectURL(blob);
   window.open(url, '_blank', 'width=1200,height=800');
   ```

4. **Decorates after load**:
   ```javascript
   // In the popup window
   const blockElement = document.querySelector(`.${blockName}.block`);
   const module = await import(`${baseUrl}/blocks/${blockName}/${blockName}.js`);
   await module.default(blockElement);
   ```

**How base tag solves blob URL issues:**
- Blob URLs (`blob://...`) have null origin
- Can't load CSS/JS with relative paths
- `<base href="https://origin/">` tells browser where to resolve paths
- `styles/styles.css` → `https://origin/styles/styles.css`
- JavaScript modules import using origin detection
- Result: Fully styled and functional blocks

**Why minimal DOM structure is critical:**

EDS blocks expect specific DOM patterns where they can iterate over `block.children` directly to find content rows. Many blocks (accordion, tabs, cards) use patterns like:

```javascript
[...block.children].forEach((row) => {
  // Process each content row
});
```

**Problems with wrapper divs:**
- Extra `<div>` wrappers between `<main>` and block break child selection
- Blocks can't find their content rows (they find wrapper divs instead)
- Decoration runs successfully but produces incorrect output
- Visual symptom: Block shows as **colored boxes** instead of proper styled elements

**Solution:**
- Block must be **direct child of `<main>`** with no intermediary wrappers
- Fixed position header (height: 48px) with main padding (68px top) prevents overlap
- Header doesn't interfere (not in document flow)
- See [Raw EDS Blocks Guide](../../docs/for-ai/implementation/raw-eds-blocks-guide.md) for detailed patterns

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
