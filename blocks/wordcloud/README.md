# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content of p elements within div structures with the class "wordcloud".

## Usage

To use the WordCloud block, create a new section in your Franklin document and add the WordCloud block. Then, add rows of words or phrases separated by commas.

| WordCloud |
|-----------|
| word1, word2, word3 |
| phrase1, phrase2, phrase3 |

## Authoring

When creating content for the WordCloud block in Google Docs or Microsoft Word:
1. Create a new section and add the WordCloud block.
2. Add rows of words or phrases, separating each item with a comma.
3. You can add multiple rows to include more words or phrases.

## Styling

The WordCloud block uses custom CSS classes for styling. You can customize the appearance by modifying the following CSS variables:

- `--wordcloud-background-color`: Background color of the word cloud (default: #f5f5f5)
- `--wordcloud-font-family`: Font family for the words (default: Arial, Helvetica, sans-serif)

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- The most frequent word is displayed in bold.
- Words have random rotations between -20 and 20 degrees.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays its frequency count in a tooltip for 2 seconds.

## Accessibility

- The block ensures proper contrast ratios for text visibility.
- ARIA labels are added to provide context for screen readers.

## Suggestions for Improvement

1. Implement a color scheme selection option for content authors.
2. Add an option to customize the maximum number of displayed words.
3. Implement a feature to export the word cloud as an image.
4. Add support for different languages and character sets.
5. Implement a feature to exclude custom words from the cloud.