# Showcaser

The Showcaser block displays a visually appealing showcase for code snippets in a book-like format, with the ability to copy code to the clipboard, expand/collapse long code snippets, and a "Return to Menu" button for easy navigation back to the top of the Showcaser.

## Usage

To use the Showcaser block, add the following markdown table to your Franklin document:

| Showcaser |
|-----------|

The block automatically collects all code snippets from the current page and displays them in the showcase.

## Behavior

- Collects all code snippets from the current page
- Creates a book-like interface with a collapsible left sidebar containing clickable titles
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
- Toggle button in the top-left corner to collapse/expand the left sidebar

## Document-Level Operations

⚠️ **This block intentionally uses global selectors for document-level functionality.**

This block operates at the document level because it:

1. **Collects ALL code snippets from the entire page** (`document.querySelectorAll('pre > code')`)
   - Scans the full document to find every `<pre><code>` element, not just within the block
   - Creates a comprehensive showcase of all code on the page
   - This is the primary purpose - to aggregate and display all code snippets in one location

2. **Calculates scroll positions relative to page header** (`document.querySelector('header')`)
   - Needs to find the document's header element to account for fixed header height
   - Ensures "Return to Menu" button scrolls to correct position
   - Uses `window.pageYOffset` for global scroll tracking

3. **Controls global page scrolling** (`window.scrollTo()`)
   - Scrolls the entire page (not just the block) when "Return to Menu" is clicked
   - Listens to global scroll events (`window.addEventListener('scroll')`)
   - Shows/hides return button based on page scroll position

4. **Monitors viewport for scroll behavior** (`window.innerHeight`)
   - Tracks global scroll position to show/hide navigation button
   - Responds to page-level scroll events for UI updates

**This is by design** - the showcaser block needs to collect code from across the entire document to create a centralized code reference. Without document-level scanning, it would only find code within its own block element, defeating its purpose as a code aggregator.

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
- The collapsible left sidebar improves usability on smaller screens

## Browser Compatibility

The Showcaser block is designed to work on modern browsers, including:

- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

For older browsers, some features may have limited functionality, but the core content display should remain accessible.- Syntax highlighting based on detected language

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
