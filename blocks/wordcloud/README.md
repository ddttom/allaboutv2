# WordCloud

The WordCloud block generates a visually appealing word cloud based on the content of its rows.

## Usage

The WordCloud block processes text content from its rows, splitting phrases or words by commas. It then creates a word cloud where the size of each word is proportional to its frequency.

## Authoring

In your Google Docs or Microsoft Word document, create a table with two columns:

| WordCloud |                           |
|-----------|---------------------------|
|           | word1, word2, word3       |
|           | phrase1, phrase2, phrase3 |

Add as many rows as needed, separating words or phrases with commas.

## Styling

The block uses a light gray background (#f5f5f5) and a predefined color palette for the words. You can customize the appearance by modifying the CSS variables in the `wordcloud.css` file.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hover over a word to see it increase slightly in size and change opacity.
- Click on a word to display a tooltip with its frequency count.

## Dependencies

This block relies on the `aem.js` script for optimized picture creation.

## Accessibility

- Each word has an aria-label providing its frequency for screen readers.
- The block ensures proper contrast ratios for text visibility.

## Suggestions for Improvement

1. Implement language-specific common word filtering.
2. Add options for different layout algorithms (e.g., spiral, rectangular).
3. Allow custom color palette input through block parameters.
4. Implement animation for initial word placement.
5. Add export functionality to save the word cloud as an image.