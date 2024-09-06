# WordCloud

The WordCloud component creates a visual representation of words or phrases, with font sizes reflecting their frequency of occurrence.

## Usage

The WordCloud component processes content from cells below its starting point, creating a cloud where more frequent words appear larger.

## Authoring

| WordCloud |
|-----------|
| Word 1, Word 2, Phrase 1 |
| Word 3, Phrase 2, Word 1 |
| ... |

- Each cell should contain words or phrases separated by commas.
- Multiple rows can be used to input more words.
- The most frequent word or phrase will appear in the center, in bold and blue.

## Styling

The component uses the following CSS classes:

- `.wordcloud-container`: Main container for the word cloud
- `.wordcloud-word`: Individual word elements
- `.wordcloud-word-highest`: Styling for the most frequent word

## Behavior

- Words are sized based on their frequency, with a minimum of 1em and a maximum of 5em.
- Hovering over words triggers a subtle scale animation.
- The most frequent word is centered, bolded, and colored blue.

## Accessibility

- The component uses semantic HTML to ensure screen reader compatibility.
- Color contrast is maintained for readability.

## Suggestions for Improvement

1. Implement color variation based on word frequency or categories.
2. Add options for different cloud shapes (e.g., circle, square).
3. Include a search or filter functionality for large word sets.
4. Provide an option to export the word cloud as an image.
5. Implement a custom sorting option (e.g., alphabetical, length).
