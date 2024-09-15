# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content of p elements within div structures with the class "wordcloud".

## Usage

The WordCloud block processes comma-separated words or phrases and displays them in a cloud formation, with more frequent words appearing larger.

## Authoring

In Google Docs or Microsoft Word, create a table with one column. Each cell should contain comma-separated words or phrases. The block will process this content to generate the word cloud.

| WordCloud |
|-----------|
| AEM, Franklin, Edge Delivery Services, content authoring |
| performance, scalability, serverless, GitHub integration |
| blocks, JavaScript, CSS, responsive design |
| SEO, accessibility, mobile-first, modern web technologies |

## Styling

The block uses custom CSS classes for styling. The main container has the class `wordcloud`, and the inner container has the class `wordcloud-container`. You can customize the appearance by modifying these classes in the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Words are randomly rotated for visual interest.
- Hover effect increases the size and changes opacity of words.
- Clicking a word displays its frequency count.

## Dependencies

This block relies on the `createOptimizedPicture` function from `../../scripts/aem.js`.

## Accessibility

- ARIA labels are added to provide context for screen readers.
- Color contrast is ensured for text visibility.

## Suggestions for Improvement

1. Implement color theme customization through block parameters.
2. Add animation for word appearance on page load.
3. Implement zooming functionality for better exploration on mobile devices.
4. Allow custom exclusion of words through block parameters.
5. Add language support for non-English word clouds.