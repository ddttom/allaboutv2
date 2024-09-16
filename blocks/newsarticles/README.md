# News Articles Block

This block displays news articles based on the selected category tab.

## Usage

The News Articles block fetches and displays news articles from a JSON feed, filtering them based on the selected category.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word for this block. Articles are populated from the JSON feed.

## Styling

The block uses the following CSS classes for styling:
- `.news-container`: Grid container for all articles
- `.news-article`: Individual article container
- `.news-article img`: Article image
- `.news-article h3`: Article title
- `.news-article p`: Article description

## Behavior

1. Fetches news data from a JSON feed (`/news-feed.json`).
2. Initially displays "Top Stories" articles.
3. Updates displayed articles when a new tab is selected (listens for 'tabchange' event).
4. Uses AEM's `createOptimizedPicture` function for image optimization.
5. Responsive design adjusts layout for different screen sizes.

## Dependencies

- AEM's `createOptimizedPicture` function from `aem.js`
- Expects a 'tabchange' custom event from the News Tabs block

## Accessibility

- Articles are structured with semantic HTML (h3 for titles, p for descriptions).
- Images include alt text for screen readers.

## Error Handling

Displays an error message if unable to fetch news articles.

## Suggestions for Improvement

1. Implement infinite scrolling or pagination for large numbers of articles.
2. Add a "Read More" link to full article content.
3. Implement article sharing functionality.
4. Add a search feature within the news feed.
5. Include article publish dates and author information.
6. Implement caching to reduce API calls and improve performance.
7. Add loading indicators while fetching articles.