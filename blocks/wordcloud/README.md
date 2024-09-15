# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content of p elements within div structures with the class "wordcloud".

## Usage

To use the WordCloud block, create a table in your Franklin document with the class "wordcloud". Each row in the table should contain words or phrases separated by commas.

| wordcloud |
|-----------|
| AEM, Franklin, Edge Delivery Services |
| Content, Authoring, Blocks |
| Performance, SEO, Accessibility |

## Authoring

When creating content for the WordCloud block in Google Docs or Microsoft Word:
1. Create a table with one column.
2. Add rows to the table, each containing words or phrases separated by commas.
3. The first cell of the table should contain "wordcloud" to identify the block type.

## Styling

The WordCloud block uses the following CSS classes for customization:
- `.wordcloud`: Main container for the word cloud
- `.wordcloud-container`: Flex container for word elements
- `.wordcloud-word`: Individual word elements

You can customize the appearance by modifying these classes in your project's CSS.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Dependencies

This block relies on the `createOptimizedPicture` function from the `aem.js` script.

## Accessibility

- The word cloud container has an aria-label for screen readers.
- Color contrast ratios are ensured for text visibility.

## Suggestions for Improvement

1. Implement custom color palette selection through block parameters.
2. Add animation for word appearance on page load.
3. Provide options for different word cloud shapes (e.g., circle, square).
4. Implement language-specific stop word lists for better word filtering.
5. Add export functionality to save the word cloud as an image.