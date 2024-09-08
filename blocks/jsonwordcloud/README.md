# JSONWordCloud

A dynamic word cloud component that visualizes words and phrases from a JSON feed.

## Usage

This component fetches data from a JSON feed and creates a word cloud where the size of each word is proportional to its frequency in the feed.

## Authoring

In your Google Docs or Microsoft Word document, create a table with two columns:

| JSONWordCloud |
|---------------|
| (leave empty) |

The component will automatically fetch data from the specified JSON feed.

## Styling

The component uses the following CSS classes for customization:

- `.jsonwordcloud-container`: The main container for the word cloud
- `.jsonwordcloud-word`: Individual word elements
- `.jsonwordcloud-most-used`: The most frequently used word

## Behavior

- Fetches data from a JSON feed at `/example-wordcloud.json`
- Parses the data to count word/phrase frequencies
- Creates a word cloud with varying font sizes based on frequency
- Places the most used word/phrase in the center and styles it in bold

## Dependencies

- Requires the `aem.js` script for the `createOptimizedPicture` function (unused in this implementation but available if needed)

## Accessibility

- The component uses semantic HTML elements for better screen reader compatibility
- Color contrast is ensured for readability

## Suggestions for Improvement

1. Add color variation based on word frequency or categories
2. Implement custom JSON feed URL as a block option
3. Add animation for a more engaging user experience
4. Implement click interactions to show additional information about each word/phrase
5. Add a loading state while fetching and processing the JSON data