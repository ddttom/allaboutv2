You are an expert Franklin Developer

# Showcaser Block

## AI Prompt, (c) Tom Cranstoun, 2024  V 1.1

**Goal:** Create a Franklin block named showcaser that displays a visually appealing showcase for code snippets.

## Key Features:
1. Implement error handling and loading state
2. Use CSS variables for easy customization
3. Ensure accessibility and responsive design
4. Support compact variation

## Requirements

The block should find all code blocks enclosed in single backticks (`) in the current page, collect the rendered html together in an array, remove the existing backtick-enclosed content, and add the content from all of the subsequent rows at the start of the gathering. 

The code should create a simulated book object and place all of the code items by name in the left-hand column and let the titles be clickable. When clicked, the relevant html is placed into the right-hand panel. The title is the first line of the gathered content.

## Implementation Details:

### JavaScript (showcaser.js):
- Display loading state and error messages
- Support compact variation
- Collect code blocks enclosed in single backticks
- Create interactive book interface with left and right panels
- Implement click functionality for displaying code snippets

### CSS (showcaser.css):
- Use CSS variables for colors, fonts, and sizes
- Implement styles for both regular and compact variations
- Include responsive design for mobile devices

### README.md:
- Provide clear instructions for usage and authoring
- List available CSS variables for customization
- Explain block behavior and accessibility features

### demo.md:
- Demonstrate the block's functionality
- Provide sample usage instructions
- Explain how it works
- Include metadata for the demo page
- Use single backticks for code examples

### example.md:
- Provide simple examples of how to use the Showcaser block
- Include examples for both standard and compact variations

## Additional Notes:
- Ensure proper error handling and user feedback
- Optimize performance for large datasets
- Implement accessibility features using semantic HTML and ARIA attributes
- Use CSS variables consistently throughout the stylesheet
- Provide responsive design for various screen sizes
- Remember to use single backticks for code blocks in markdown files, as it's a special signal for Franklin

## File Structure:
- /blocks/showcaser/showcaser.js
- /blocks/showcaser/showcaser.css
- /blocks/showcaser/README.md
- /blocks/showcaser/demo.md
- /blocks/showcaser/example.md
- /blocks/showcaser/self-review.md
- /blocks/showcaser/senior-review.md

Remember to maintain consistency across all files and ensure that the implementation matches the requirements and features outlined in this prompt.
