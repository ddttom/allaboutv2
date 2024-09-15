# Word Cloud

The Word Cloud block generates a visually appealing word cloud based on the content provided within a div with the class "wordcloud".

## Usage

To use the Word Cloud block, create a div with the class "wordcloud" and add comma-separated words or phrases inside it.

| Word Cloud |
|------------|
| Web Development, JavaScript, CSS, HTML, Responsive Design, User Experience, Performance Optimization, Accessibility, SEO, Mobile-First, Frontend, Backend, Full-Stack, Version Control, Git, APIs, Frameworks, Libraries, Testing, Debugging, Deployment |

## Authoring

When creating content in Google Docs or Microsoft Word, use commas to separate words or phrases that you want to appear in the word cloud.

## Styling

The Word Cloud block uses custom CSS classes for styling. You can customize the appearance by modifying the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hovering over a word slightly increases its size and changes its opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Dependencies

This block depends on the `aem.js` script for creating optimized pictures.

## Accessibility

- The block ensures proper contrast ratios for text visibility.
- ARIA labels are used to provide context for screen readers.

## Suggestions for Improvement

1. Implement a color picker for custom color palettes.
2. Add an option to export the word cloud as an image.
3. Implement language support for non-English word clouds.
4. Add animation options for word appearance.
5. Create a feature to exclude specific words or phrases.
