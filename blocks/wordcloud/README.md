# Word Cloud Block

This block generates a visually appealing word cloud based on the content of table cells below a specified starting point.

## Usage

Place the Word Cloud block in your Franklin document, followed by a heading (h2-h6) and one or more tables containing words or phrases separated by commas.

## Authoring

In Google Docs or Microsoft Word:

1. Insert the Word Cloud block.
2. Add a heading (h2-h6) to mark the starting point.
3. Create tables with cells containing words or phrases separated by commas.

| Word Cloud |
|------------|
| AEM, Franklin, Edge Delivery Services |
| Web Development, JavaScript, CSS |
| Performance, Accessibility, SEO |

## Styling

The Word Cloud block uses custom CSS classes for styling. You can customize the appearance by modifying the `wordcloud.css` file.

## Behavior

- The block generates a word cloud based on the frequency of words in the table cells.
- Words are displayed with varying font sizes based on their frequency.
- The most frequent word is centered and displayed in bold.
- Hover effects increase the size of words slightly.
- Clicking on a word displays its frequency count.

## Accessibility

- The block uses proper contrast ratios for text visibility.
- Interactive elements have appropriate ARIA labels for screen readers.

## Suggestions for Improvement

1. Implement a filtering system to exclude common words.
2. Add options for customizing the color palette.
3. Implement lazy loading for large datasets.
4. Add animation for word appearance.
5. Provide options for different word cloud shapes.
