# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content of p elements within div structures with the class "wordcloud".

## Usage

To use the WordCloud block, create a new section in your Franklin document and add the "WordCloud" block. Then, add rows of words or phrases separated by commas.

| WordCloud |
|-----------|
| AEM, Franklin, Edge Delivery Services |
| Content, Authoring, Serverless |
| Performance, SEO, Accessibility |

## Authoring

When creating content for the WordCloud block in Google Docs or Microsoft Word:
1. Create a new section and add the WordCloud block.
2. Add rows of words or phrases, separating each with commas.
3. The more frequently a word or phrase appears, the larger it will be displayed in the cloud.

## Styling

The WordCloud block uses custom CSS classes for styling. You can customize the appearance by modifying the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- The most frequent word is displayed in bold and larger font.
- Words are randomly rotated for visual interest.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Accessibility

- The block ensures proper contrast ratios for text visibility.
- ARIA labels are used to provide context for screen readers.

## Suggestions for Improvement

1. Implement a color customization option through block parameters.
2. Add an option to export the word cloud as an image.
3. Implement a more sophisticated layout algorithm for better word placement.
4. Add an option to filter out common words or allow custom stopwords.
5. Implement language support for non-English content.