# Word Cloud Block

The Word Cloud block generates a visually appealing word cloud based on the content of div elements with the class "wordcloud".

## Usage

To use the Word Cloud block, include a div with the class "wordcloud" in your content. Each child div within this element should contain words or phrases separated by commas.

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Create a div with the class "wordcloud".
2. Inside this div, add multiple div elements.
3. In each child div, list words or phrases separated by commas.

## Styling

The Word Cloud block uses CSS classes for styling. You can customize the appearance by modifying the following CSS variables:

- `--wordcloud-color-1` to `--wordcloud-color-6`: Define the color palette for the words.

## Behavior

- Words are displayed with varying font sizes based on their frequency.
- Hovering over a word slightly increases its size and changes opacity.
- Clicking on a word displays a tooltip with its frequency count.

## Dependencies

This block relies on the `createOptimizedPicture` function from `../../scripts/aem.js`.

## Accessibility

- Proper contrast ratios are ensured for text visibility.
- ARIA labels are used to provide context for screen readers.

## Suggestions for Improvement

1. Implement language support for multi-lingual word clouds.
2. Add options for different layouts (e.g., circular, rectangular).
3. Include a feature to export the word cloud as an image.
4. Implement a custom stop-word list that users can modify.
5. Add animation options for word appearance and transitions.
