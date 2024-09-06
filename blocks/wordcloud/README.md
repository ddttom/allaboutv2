# WordCloud

The WordCloud component creates a visually appealing representation of words or phrases, with font sizes reflecting their frequency of occurrence.

## Usage

The WordCloud component can be used to display a collection of words or phrases, emphasizing the most frequently used ones.

## Authoring

| Block Name | Description |
|------------|-------------|
| WordCloud  | Add comma-separated words or phrases in each cell below the WordCloud block. Each row will be processed to create the word cloud. |

## Styling

The component uses the following CSS classes for customization:
- `.wordcloud`: Main container
- `.wordcloud-container`: Wrapper for word cloud items
- `.wordcloud-item`: Individual word or phrase
- `.wordcloud-item-max`: Style for the most frequent word/phrase

## Behavior

- Words and phrases are extracted from cells below the WordCloud block.
- Font size increases based on the frequency of occurrence.
- The most frequent word/phrase is centered and bold.
- Hover effect applied to each word/phrase for interactivity.

## Accessibility

- The component uses semantic HTML for better screen reader compatibility.
- Color contrast is ensured for readability.

## Suggestions for Improvement

1. Add color variation based on word frequency or category.
2. Implement custom shapes for the word cloud (e.g., circle, square).
3. Allow for custom exclusion of common words.
4. Add animation for a more dynamic presentation.
5. Implement click functionality to show additional information or filter content.