# Code Expander

The Code Expander is a versatile component for displaying and managing code snippets within Adobe Edge Delivery Services (EDS) projects. It provides syntax highlighting, copy functionality, and an expand/collapse feature for long code blocks.

## Table of Contents

- [Code Expander](#code-expander)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [Authoring](#authoring)
  - [Styling](#styling)
  - [Features](#features)
  - [Supported Languages](#supported-languages)
  - [Accessibility](#accessibility)
  - [Responsive Design](#responsive-design)
  - [Dark Mode](#dark-mode)
  - [Dependencies](#dependencies)
  - [Configuration](#configuration)
  - [Performance Considerations](#performance-considerations)
  - [Browser Compatibility](#browser-compatibility)
  - [Maintenance](#maintenance)
  - [Future Improvements](#future-improvements)

## Usage

To use the Code Expander in your EDS project, simply wrap your code snippets in `<code>` tags within your Markdown or HTML content. The component will automatically detect the language and apply appropriate styling and functionality.

```
| Code Expander |
| :---- |
| <code>Your code here</code> |
```

## Authoring

When creating content in Google Docs or Microsoft Word, use the following structure:

1. Create a table with one column.
2. In the first row, type "Code Expander".
3. In the second row, paste your code snippet.

The Code Expander will automatically process and style the code when rendered on the website.

## Styling

The component uses CSS variables for easy customization. Here are the main variables you can override:

```css
:root {
  --code-expander-background: #f4f4f4;
  --code-expander-text-color: #333;
  --code-expander-border-color: #ddd;
  --code-expander-button-background: #e0e0e0;
  --code-expander-button-text-color: #333;
}
```

You can override these variables in your project's CSS to customize the appearance of the Code Expander.

## Features

1. **Syntax Highlighting:** Automatically detects and highlights syntax for various languages.
2. **Copy Functionality:** Provides a "Copy" button on the top-left to easily copy the code snippet to the clipboard.
3. **Expand/Collapse:** For code snippets longer than the defined threshold, a "Long Document, click to expand" button is provided on the top-right.
4. **Dark Mode Support:** Automatically adjusts styling for dark mode preferences.
5. **Line Numbers:** Displays line numbers for JavaScript code.

## Supported Languages

- JavaScript (with line numbers)
- CSS
- HTML
- JSON
- Markdown
- Terminal commands
- Plain text

## Accessibility

- Buttons have appropriate aria-label attributes for screen readers.
- The component uses semantic HTML structure.
- Focus styles are provided for keyboard navigation.
- Color contrast ratios are maintained for readability.

## Responsive Design

The Code Expander is responsive and adjusts its layout for smaller screens. Font sizes are reduced on mobile devices for better readability.

## Dark Mode

The component supports automatic dark mode switching based on user preferences using the `prefers-color-scheme` media query.

## Dependencies

This component has no external dependencies and uses vanilla JavaScript and CSS.

## Configuration

The component defines several constants that can be adjusted if needed:

- `LONG_DOCUMENT_THRESHOLD`: The number of lines at which a code block is considered "long" (default: 80).
- `COPY_BUTTON_RESET_DELAY`: The delay in milliseconds before resetting the copy button text (default: 2000).
- `KEYWORDS`: An array of JavaScript keywords for syntax highlighting.
- `SPECIAL_CHARS_REGEX`: A regular expression for identifying special characters in code.
- `STRINGS_REGEX`: A regular expression for identifying string literals in code.
- `TERMINAL_COMMANDS`: A regular expression for identifying terminal commands.
- `JS_KEYWORDS`: An array of keywords used to identify JavaScript code.

These constants can be modified in the JavaScript file to adjust the component's behavior.

## Performance Considerations

The Code Expander is designed to handle large code blocks efficiently. However, for optimal performance, consider the following:

- The component automatically collapses long code snippets (those exceeding the `LONG_DOCUMENT_THRESHOLD`) to improve initial page load times.
- Syntax highlighting is applied dynamically, which may impact performance for extremely large code blocks.

## Browser Compatibility

The Code Expander is designed to work across modern web browsers. Regular testing is performed to ensure compatibility with the latest versions of Chrome, Firefox, Safari, and Edge.

## Maintenance

When updating the component, ensure that:

1. All styling is done through CSS variables for easy theming.
2. JavaScript remains free of inline styles.
3. Accessibility features are maintained and improved.
4. The component remains performant, especially for large code blocks.
5. Browser compatibility is regularly tested and maintained.

## Future Improvements

1. Add support for more programming languages.
2. Implement a theme switcher for different syntax highlighting color schemes.
3. Add line numbering options for all supported languages.
4. Implement a search functionality within long code blocks.
5. Add an option to highlight specific lines of code.
6. Implement syntax highlighting for more complex language constructs.
7. Add options for customizing the maximum height before collapsing.