# Word Cloud

A visually appealing word cloud generator for Franklin (Adobe Edge Delivery Services) projects.

## Usage

This component generates a word cloud based on the content of table cells with the header "wordcloud".

## Authoring

In your Google Docs or Microsoft Word document, create a table with the header "wordcloud". Each cell in this table should contain words or phrases separated by commas. These will be used to generate the word cloud.

| wordcloud |
|-----------|
| AEM, Franklin, Edge Delivery Services |
| JavaScript, CSS, HTML |
| Performance, Accessibility, SEO |

## Styling

The word cloud uses a predefined color palette and font sizes based on word frequency. You can customize the appearance by modifying the CSS variables in the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hover over a word to see a slight increase in size and change in opacity.
- Click on a word to display a tooltip with its frequency count.

## Accessibility

- ARIA labels are added to provide context for screen readers.
- Proper contrast ratios are ensured for text visibility.

## Suggestions for Improvement

1. Implement a configuration option to customize the color palette.
2. Add the ability to exclude common words through a configurable list.
3. Implement a zoom feature for better visibility on smaller screens.
4. Add an option to export the word cloud as an image.

These improvements would enhance the flexibility and functionality of the Word Cloud block, making it more versatile for different use cases and user preferences.
