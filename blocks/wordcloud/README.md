# Word Cloud Block

The Word Cloud block generates a visually appealing word cloud based on the content of table cells with the header "wordcloud".

## Usage

To use the Word Cloud block, create a table in your Franklin document with the header "wordcloud" and populate it with words or phrases separated by commas.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| wordcloud |
|-----------|
| word1, word2, word3 |
| phrase1, phrase2 |
| ... |

## Styling

The Word Cloud block uses custom CSS classes for styling. You can customize the appearance by modifying the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Dependencies

This block relies on the `aem.js` script for optimized picture creation.

## Accessibility

- ARIA labels are added to provide context for screen readers.
- Proper contrast ratios are ensured for text visibility.

## Suggestions for Improvement

1. Implement language support for multi-lingual word clouds.
2. Add options for custom color palettes.
3. Implement export functionality (e.g., as SVG or PNG).
4. Add animation options for word appearance.
5. Implement a search feature to highlight specific words.
