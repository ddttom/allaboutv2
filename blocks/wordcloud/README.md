# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content provided within the block.

## Usage

To use the WordCloud block, add content rows with comma-separated words or phrases. The block will process this content and generate a word cloud, with more frequently used words appearing larger.

| WordCloud |
|-----------|
| web, development, html, css, javascript |
| franklin, aem, adobe, edge, delivery, services |
| responsive, design, accessibility, performance |

## Authoring

When creating content for the WordCloud block in Google Docs or Microsoft Word:

1. Create a table with one column.
2. In each row, add comma-separated words or phrases.
3. The block will automatically process this content and generate the word cloud.

## Styling

The WordCloud block uses custom CSS classes for styling. You can customize the appearance by modifying the following classes in your project's CSS:

- `.wordcloud`: Styles for the main container
- `.wordcloud-container`: Styles for the word cloud container
- `.wordcloud-container span`: Styles for individual words

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Words are randomly rotated for visual interest.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Dependencies

This block relies on the `aem.js` script for optimized picture creation.

## Accessibility

- The block ensures proper contrast ratios for text visibility.
- Minimum font size is set to 14px for readability.
- Interactive elements have appropriate ARIA labels.

## Suggestions for Improvement

1. Implement color theme customization through CSS variables.
2. Add options for different layout algorithms (e.g., spiral, rectangular).
3. Allow users to specify custom common words to exclude.
4. Implement animation for word appearance on page load.
5. Add export functionality to save the word cloud as an image.