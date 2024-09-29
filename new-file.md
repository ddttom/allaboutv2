# Showcaser Block

Create a Showcaser block for Franklin that displays code snippets in a book-like format. The block should have the following features and functionality:

## Core Features

1. Display code snippets in a two-column layout: titles on the left, content on the right.
2. Automatically collect and display all code snippets from the current page.
3. Implement syntax highlighting for various languages (JavaScript, CSS, HTML, Markdown, Shell, JSON, and plain text).
4. Add a "Copy to clipboard" button for each code snippet.
5. For long code snippets (more than 40 lines), add expand/collapse functionality with "Expand" and "..." buttons.
6. Include a "Return to Menu" button that appears when scrolling and allows users to navigate back to the top of the Showcaser.
7. Make the design responsive for both desktop and mobile viewing.
8. Implement accessibility features such as proper ARIA attributes and focus styles.
9. Use CSS variables for easy customization of colors, fonts, and spacing.
10. Implement lazy initialization for better performance.

## Implementation Details

### showcaser.js
- Implement main functionality, including language detection and syntax highlighting.
- Handle DOM manipulation for creating the book-like interface.
- Manage event listeners for interactivity (e.g., expand/collapse, copy to clipboard).
- Implement the "Return to Menu" button functionality.

### showcaser.css
- Style the Showcaser block, including layout and responsive design.
- Define styles for syntax highlighting.
- Implement styles for buttons and interactive elements.
- Use CSS variables for easy customization.

### README.md
- Provide comprehensive documentation on how to use the Showcaser block.
- Explain features, customization options, and best practices.
- Include examples of usage in Franklin documents.

### example.md
- Demonstrate a simple example of how to use the Showcaser block in a Franklin document.

## Additional Requirements

- Ensure the code is well-commented and follows modern JavaScript practices.
- Optimize for performance, especially when handling multiple or large code snippets.
- Use semantic HTML and follow accessibility best practices throughout the implementation.
- Implement error handling for scenarios such as failed clipboard operations or language detection issues.

## Usage

To use the Showcaser block in a Franklin document, add the following markdown table:

| Showcaser |
|-----------|

The block will automatically collect and display all code snippets from the current page.
