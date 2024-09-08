# JSONWordCloud

The JSONWordCloud component creates a visually appealing word cloud based on data from a JSON feed.

## Usage

This component fetches data from a JSON feed and generates a word cloud where the size of each word or phrase is proportional to its frequency in the data.

## Authoring

To use this component in your Franklin document, create a new section with the following structure:

| JSONWordCloud |
|---------------|
|               |

No additional content is required within the component as it fetches data from a predefined JSON feed.

## Styling

The component uses the following CSS classes for styling:

- `.jsonwordcloud`: Main container for the word cloud
- `.jsonwordcloud-container`: Wrapper for the word cloud content
- `.most-used`: Applied to the most frequently used word or phrase

You can customize the appearance by modifying these classes in the CSS file.

## Behavior

1. The component fetches data from a JSON feed at '/example-wordcloud.json'.
2. It processes the data, counting the frequency of each word or phrase.
3. Words are displayed with font sizes proportional to their frequency.
4. The most used word is displayed in bold and with a different color.
5. Words are centered within the container.
6. On hover, words slightly increase in size for interactivity.

## Dependencies

This component relies on the `aem.js` script for the `createOptimizedPicture` function, although it's not used in the current implementation.

## Accessibility

- The component uses semantic HTML elements for better screen reader compatibility.
- Color contrast is ensured for readability.
- Interactive elements (hover effect) provide visual feedback.

## Suggestions for Improvement

1. Add error handling for cases where the JSON feed is unavailable or malformed.
2. Implement color variation based on word frequency or categories.
3. Add options for customizing the JSON feed URL through component properties.
4. Implement lazy loading for better performance on pages with multiple word clouds.
5. Add animation to make the word cloud more engaging when it first loads.
6. Provide options for different layouts (circular, rectangular, etc.) of the word cloud.
7. Implement a search or filter functionality to highlight specific words.
8. Add a legend or tooltip to explain the significance of font sizes.