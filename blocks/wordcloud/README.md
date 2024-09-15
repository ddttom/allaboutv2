# WordCloud

A visually appealing word cloud generator that displays frequently used words or phrases from the content.

## Usage

The WordCloud block processes text content within div elements with the class "wordcloud". Each element should contain phrases or words separated by commas.

| WordCloud |
|-----------|
| Web Development, JavaScript, CSS, HTML, Responsive Design |
| User Experience, Accessibility, Performance, SEO |
| Franklin, Adobe, Edge Delivery Services, Serverless |

## Authoring

In Google Docs or Microsoft Word, create a table with a single column. Each cell in the column should contain comma-separated words or phrases related to the topic you want to visualize in the word cloud.

## Styling

The WordCloud block uses custom CSS classes for styling. You can customize the appearance by modifying the following classes in the `wordcloud.css` file:

- `.wordcloud-container`: Controls the overall container style
- `.wordcloud-word`: Styles individual words in the cloud
- `.wordcloud-word-center`: Styles the most frequent word (centered)

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- The most frequent word is centered and bolded.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking a word displays a tooltip with its frequency count.

## Dependencies

This block relies on the `aem.js` script for optimized picture creation.

## Accessibility

- Proper contrast ratios are maintained for text visibility.
- ARIA labels are used to provide context for screen readers.

## Suggestions for Improvement

1. Implement color theme customization through CSS variables.
2. Add an option to export the word cloud as an image.
3. Implement language-specific stop word filtering.
4. Add animation for word appearance on page load.
5. Provide options for different cloud shapes (e.g., circle, square).