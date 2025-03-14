# Code Expander

The Code Expander is a component that enhances code blocks by adding syntax highlighting, copy functionality, expandable views for long code snippets, line numbering, raw code viewing options, and code downloading capabilities with custom filename support.

## Usage

The Code Expander automatically applies to all `<pre><code>` elements on the page. No additional markup is required.

## Authoring

When creating content in Google Docs or Microsoft Word, simply use code blocks as you normally would. The Code Expander will automatically enhance these blocks when the page is rendered.

## Styling

The Code Expander uses the following CSS classes:

- `.code-expander-wrapper`: The main wrapper for each code block.
- `.code-expander-copy`: The copy button.
- `.code-expander-view-raw`: The button to toggle between formatted and raw code views.
- `.code-expander-download`: The button to download the code as a file.
- `.code-expander-expand-collapse`: The expand/collapse buttons for long code blocks.
- `.code-expander-scroll-hint`: The scroll hint that appears at the bottom of code blocks.
- `.code-expander-line-numbers`: The container for line numbers.
- `.code-expander-line-number`: Individual line number elements.
- `.code-expander-raw-view`: The container for the raw code view.
- `.code-expander-filename-modal`: The modal for entering a custom filename when downloading.
- `.collapsible`: Applied to long code blocks that can be expanded/collapsed.
- `.expanded`: Applied to code blocks when they are expanded.

Language-specific syntax highlighting classes are also applied to individual code elements.

## Behavior

1. **Language Detection**: The component automatically detects the language of the code snippet and applies appropriate syntax highlighting. Supported languages include JavaScript, JSON, HTML, CSS, Markdown, Python, and shell/terminal commands.

2. **Syntax Highlighting**: Each language has specific syntax highlighting rules applied to enhance readability.

3. **Copy Functionality**: Each code block has a "Copy to clipboard" button at the top right corner. The button text changes to "Copied!" briefly after clicking and then reverts to the original text.

4. **Expandable Long Code Blocks**: Code blocks with more than 40 lines are made collapsible. They have an "Expand" button at the top left and a "..." button at the bottom left to toggle the full view.

5. **Scroll Hint**: A subtle hint appears at the bottom right of code blocks to indicate that horizontal scrolling is available.

6. **Line Numbering**: Each line of code is automatically numbered, making it easier to reference specific lines when discussing code.

7. **Raw Code View**: A "View Raw" button allows users to toggle between the syntax-highlighted view and the raw, unformatted code. This is useful for copying code without formatting or for viewing code exactly as it was written.

8. **Download Code with Custom Filename**: A "Download" button allows users to save the code as a file. When clicked, a modal appears where users can enter a custom filename. The appropriate file extension is automatically added based on the detected language. If no filename is provided, a default name "code-snippet" is used.

9. **Mobile Responsiveness**: The component is fully responsive and optimized for viewing on mobile devices, with adjusted button sizes and positioning for smaller screens.

## Customization

The component uses CSS variables for easy customization of colors and sizes. These variables are defined in the `:root` selector and can be overridden as needed.

Key customization variables include:

- `--code-expander-button-bg`: Background color for buttons
- `--code-expander-code-bg`: Background color for code blocks
- `--code-expander-line-number-bg`: Background color for line numbers
- `--code-expander-line-number-color`: Text color for line numbers
- `--code-expander-line-number-width`: Width of the line numbers column
- `--code-expander-modal-bg`: Background color for the filename modal
- `--code-expander-modal-content-bg`: Background color for the modal content
- `--code-expander-input-border`: Border color for the filename input
- `--code-expander-input-focus-border`: Border color for the focused filename input

## Dependencies

This component has no external dependencies. It uses vanilla JavaScript and CSS.

## Accessibility

- The copy, expand/collapse, view raw, and download buttons are keyboard accessible.
- The filename input modal can be navigated with keyboard (Tab to move between elements, Enter to confirm, Escape to cancel).
- ARIA attributes are used where appropriate to enhance screen reader compatibility.
- Focus styles are applied to buttons and inputs for better visibility during keyboard navigation.
- Cross-browser compatibility is ensured with appropriate vendor prefixes (e.g., `-webkit-user-select` for Safari).
- Line numbers are made non-selectable to improve the user experience when copying code.

## Browser Support

The Code Expander is designed to work in modern browsers that support ES6+ JavaScript and CSS3, including:
- Chrome
- Firefox
- Safari
- Edge

## Mobile Support

The component is optimized for mobile devices with:
- Responsive layout that adapts to screen size
- Adjusted button sizes and positioning for touch interfaces
- Improved scrolling behavior for code blocks on small screens
- Stacked buttons on very small screens to ensure they remain accessible
- Mobile-friendly filename input modal with larger touch targets

## Suggestions for Improvement

1. Add support for more programming languages.
2. Add an option to highlight specific lines of code.
3. Implement a theme switcher for different syntax highlighting color schemes.
4. Add a search function within code blocks.
5. Add code folding for specific sections.
6. Add an option to remember the last used filename for downloads.
7. Implement syntax validation for specific languages.

## Known Issues

Currently, there are no known issues. If you encounter any problems, please report them to the development team.
