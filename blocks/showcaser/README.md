# Showcaser

The Showcaser block displays a visually appealing showcase for code snippets in a book-like format, with the ability to copy code to the clipboard, expand/collapse long code snippets, and a "Return to Menu" button for easy navigation back to the top of the Showcaser.

## Usage

To use the Showcaser block, add the following markdown table to your Franklin document:

| Showcaser |
|-----------|

The block automatically collects all code snippets from the current page and displays them in the showcase.

## Features

- Displays code snippets in a book-like interface
- Syntax highlighting for various programming languages (JavaScript, CSS, HTML, Markdown, Shell, and more)
- Copy to clipboard functionality for each code snippet
- Expand/collapse functionality for long code snippets (more than 40 lines)
- "Return to Menu" button for easy navigation back to the top of the Showcaser
- Responsive design for mobile and desktop viewing

## Authoring

1. Create your content in Google Docs or Microsoft Word.
2. Use single backticks to wrap your code snippets.
3. The first line of each code block becomes the title for that snippet.

Example:

`Hello World Example
console.log("Hello, World!");`

Note: Franklin will process these backtick-wrapped code blocks into `<pre><code>` elements, which the Showcaser block will then collect and display.

## Styling

The Showcaser block uses CSS variables for easy customization. Override these variables in your project's CSS:

## Behavior

- Collects all code snippets from the current page
- Creates a book-like interface with clickable titles on the left and content on the right
- Clicking a title displays the corresponding code snippet on the right page
- The first snippet is displayed by default
- Responsive layout adjusts for mobile devices
- "Return to Menu" button appears when scrolling down and, when clicked, smoothly scrolls the page back to the top of the Showcaser block
- For code snippets longer than 40 lines, expand/collapse buttons are added to improve readability and user experience

## Accessibility

- Uses semantic HTML structure for better screen reader compatibility
- Clickable titles have appropriate cursor styles and hover effects
- Maintains color contrast ratios for readability
- "Return to Menu" button provides an easy way for users to navigate back to the top of the Showcaser, improving usability for all users

## Behavior

- Collects all code snippets from the current page
- Creates a book-like interface with clickable titles on the left and content on the right
- Clicking a title displays the corresponding code snippet on the right page
- The first snippet is displayed by default
- For code snippets longer than 40 lines:
  - An "Expand" button appears at the top of the snippet
  - A "..." button appears at the bottom of the snippet
  - Clicking either button toggles between expanded and collapsed views
- Copy to clipboard button for each code snippet
- Syntax highlighting based on detected language
- Responsive layout adjusts for mobile devices
- "Return to Menu" button appears when scrolling down and, when clicked, smoothly scrolls the page back to the top of the Showcaser block

## Accessibility

- Uses semantic HTML structure for better screen reader compatibility
- Clickable titles have appropriate cursor styles and hover effects
- Maintains color contrast ratios for readability
- "Return to Menu" button provides an easy way for users to navigate back to the top of the Showcaser, improving usability for all users
- Expand/collapse buttons for long code snippets improve readability and navigation
- Focus styles for interactive elements to aid keyboard navigation


## Language Detection

The Showcaser automatically detects the following languages:

- JavaScript
- CSS
- HTML
- Markdown
- Shell/Terminal commands
- JSON
- Plain text

The language detection helps in applying appropriate syntax highlighting and labeling the copy button correctly.

## Performance Considerations

- The block uses lazy initialization, only becoming fully visible when loaded
- Long code snippets are initially collapsed to improve page load times and readability
- Syntax highlighting is performed client-side to reduce server load
