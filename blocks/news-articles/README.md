# News Articles Block

This block displays news articles based on the selected category.

## Usage

The News Articles block shows a grid of news articles, which can be filtered by category.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word for this block. The articles are fetched from a JSON file.

## Styling

The block uses the following CSS classes for styling:
- `.news-articles`: Grid container for articles
- `.news-article`: Individual article container
- `.news-article img`: Article image
- `.news-article h3`: Article title
- `.news-article p`: Article description

## Behavior

The block listens for tab change events and updates the displayed articles based on the selected category.

## Dependencies

- Requires a JSON file (`news-articles.json`) with article data

## Accessibility

Images have alt text, and article information is structured semantically.

## Suggestions for Improvement

1. Implement infinite scrolling or pagination for large numbers of articles.
2. Add a "Read More" link to full articles.
3. Implement image lazy loading for better performance.
4. Add sharing functionality for articles.
5. Implement a search feature within articles.