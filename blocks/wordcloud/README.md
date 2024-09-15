# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content provided within the block.

## Usage

To use the WordCloud block, add content to the block with words or phrases separated by commas. Each row in the block will be processed to create the word cloud.

## Authoring

In your Google Docs or Microsoft Word document, create a table with two columns. The first column should contain "WordCloud" and the second column should contain your comma-separated words or phrases. You can add multiple rows to include more words.

| WordCloud |
|-----------|
| AEM, Franklin, Edge Delivery Services, Content Management, Digital Experience |
| Web Development, JavaScript, CSS, HTML, Responsive Design |

## Styling

The WordCloud block uses custom CSS classes for styling. You can customize the appearance by modifying the `wordcloud.css` file.

## Behavior

- The block processes the content, counting word frequencies and excluding common words.
- Words are displayed with varying font sizes based on their frequency.
- The most frequent word is centered and styled in bold.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking a word displays its frequency count in a tooltip for 2 seconds.

## Accessibility

- Each word has an aria-label providing its frequency information for screen readers.
- Color contrast ratios are maintained for text visibility.

## Suggestions for Improvement

1. Add options for customizing the color palette through block parameters.
2. Implement language-specific stop word lists for better word filtering.
3. Add an option to export the word cloud as an image.
4. Implement a minimum frequency threshold to filter out less significant words.
5. Add animation options for word appearance and layout.