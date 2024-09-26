You are an expert Franklin Developer

# Blogroll Block

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.1

**Goal:** Create a Franklin block named blogroll that contains a visually appealing list of blog posts, fetched from a JSON file using a relative URL.

## Key Features:
1. Fetch blog post data from '/query-index.json'
2. Group posts by series and sort them by part number or title
3. Display posts in a structured list format
4. Provide a compact variation that shows only titles and dates
5. Implement error handling and loading state
6. Use CSS variables for easy customization

## Implementation Details:

### JavaScript (blogroll.js):
- Use relative URL for fetching data: '/query-index.json'
- Implement functions for date formatting, series info extraction, and post grouping/sorting
- Handle both regular and compact variations
- Display loading state and error messages

### CSS (blogroll.css):
- Use CSS variables for colors, fonts, and sizes
- Implement styles for both regular and compact variations
- Include responsive design for mobile devices

### README.md:
- Provide clear instructions for usage and authoring
- Explain both regular and compact variations
- List potential improvements and suggestions

### EXAMPLE.md:
- Show examples of both regular and compact usage

### demo.md:
- Demonstrate the block's functionality
- Provide sample usage instructions
- Explain how it works and potential use cases

## Additional Notes:
- Ensure proper error handling and user feedback
- Consider performance optimization for large datasets
- Implement accessibility features using semantic HTML
- Remove any unused imports or functions
- Use CSS variables,  consistently throughout the stylesheet

Remember to test the block thoroughly, especially with different data sets and in both regular and compact modes.
