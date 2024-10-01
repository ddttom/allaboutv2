# Showcaser Block

## AI Prompt, (c) Tom Cranstoun, 2024  V 1.1

**Goal:** Create a Franklin block named showcaser that displays a visually appealing showcase for code snippets in a book-like interface.

## Key Features:
1. Implement error handling and loading state
2. Use CSS variables for easy customization
3. Ensure accessibility and responsive design
4. Provide a book-like interface with clickable titles and content display

## Requirements

1. Find all `<pre>` elements in the current page and collect their content.
2. Remove existing `<pre>` elements from the page.
3. Create a book-like interface with a left column for titles and a right panel for content.
4. Make titles clickable, displaying the corresponding content in the right panel when clicked.

## Implementation Details:

### JavaScript (showcaser.js):

1. Content Collection:
   - Use `document.querySelectorAll('pre')` to find all `<pre>` elements.
   - Store content in an array, with the first line as the title.
   - Remove `<pre>` elements from the DOM after collection.

2. Book Interface:
   - Create a container div with class `showcaser-container`.
   - Add a left column div with class `showcaser-left-column` for titles.
   - Add a right panel div with class `showcaser-right-panel` for content.

3. Title Creation and Event Handling:
   - For each collected snippet, create a clickable title in the left column.
   - Use `addEventListener('click', ...)` to handle title clicks.
   - On click, display the corresponding content in the right panel.

4. Error Handling:
   - Implement try-catch blocks for error handling.
   - Display user-friendly error messages using a dedicated error display function.
   - Example error handling:
     ```javascript
     function displayError(message) {
       const errorElement = document.createElement('div');
       errorElement.className = 'showcaser-error';
       errorElement.textContent = message;
       document.querySelector('.showcaser-container').appendChild(errorElement);
     }

     try {
       // Code that might throw an error
     } catch (error) {
       displayError('An error occurred while loading the code snippets. Please try again.');
       console.error('Showcaser error:', error);
     }
     ```

5. Loading State:
   - Implement a loading indicator while content is being processed.
   - Use CSS animations for a smooth loading experience.

6. Accessibility:
   - Use semantic HTML elements (e.g., `<nav>` for the title list).
   - Implement keyboard navigation for the title list.
   - Add appropriate ARIA attributes:
     - `role="tablist"` for the title list
     - `role="tab"` for each title
     - `role="tabpanel"` for the content panel

### CSS (showcaser.css):
- Use CSS variables for colors, fonts, and sizes:
  ```css
  :root {
    --showcaser-bg-color: #f5f5f5;
    --showcaser-text-color: #333;
    --showcaser-accent-color: #0066cc;
    --showcaser-font-family: Arial, sans-serif;
    --showcaser-title-font-size: 1rem;
    --showcaser-content-font-size: 0.9rem;
  }
  ```
- Implement styles for both regular and compact variations.
- Include responsive design for mobile devices:
  ```css
  @media (max-width: 768px) {
    .showcaser-container {
      flex-direction: column;
    }
    .showcaser-left-column {
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
    }
  }
  ```
- Ensure color contrast ratios meet WCAG 2.1 Level AA standards.

### README.md:
- Provide clear instructions for usage and authoring.
- List available CSS variables for customization. do  not use triple backticks
- Include examples of how to create variations (e.g., compact version).
- Explain accessibility features and how to use them properly.

### demo.md:
- Demonstrate the block's functionality with various code snippet examples. do not use triple backticks
- Provide sample usage instructions, including how to add the block to a page.
- Explain how the block works, including its responsive behavior.
- Include metadata for the demo page.

## Testing and Validation:
1. Test the block with various numbers and sizes of code snippets.
2. Validate accessibility using tools like aXe or WAVE.
3. Test keyboard navigation and screen reader compatibility.
4. Perform cross-browser testing (Chrome, Firefox, Safari, Edge).

## Performance Optimization:
1. Implement lazy loading for code snippets not in the initial viewport.
2. Use efficient DOM manipulation techniques (e.g., DocumentFragment for batch insertions).
3. Debounce event listeners for performance on slower devices.

## Code Style and Best Practices:
1. Follow Airbnb JavaScript Style Guide.
2. Use meaningful variable and function names.
3. Add JSDoc comments for functions and complex logic.
4. Implement error boundaries to prevent entire block failure.

## Additional Considerations:
- Implement a search functionality for finding specific code snippets.
- add syntax highlighting for different programming languages.
- Provide options for users to copy code snippets to clipboard.

Remember to thoroughly test the block, optimize for performance, and ensure it meets accessibility standards. Regularly review and update the code to maintain its quality and functionality.
