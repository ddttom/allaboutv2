# Blogroll Block

The Blogroll block displays a visually appealing list of blog posts fetched from a JSON file.

## Usage

This block fetches blog post data from a specified JSON endpoint and organizes the posts into groups based on their paths. It then displays these groups in a visually appealing format.

## Authoring

To use the Blogroll block in your content, simply add a table with the block name:

| Blogroll |
|----------|

No additional configuration is needed in the content document.

## Styling

The block uses CSS classes for styling. You can customize the appearance by modifying the `blogroll.css` file.

## Behavior

The block performs the following actions:
1. Fetches blog post data from the specified JSON endpoint.
2. Groups and sorts the posts based on their paths and part numbers.
3. Creates a visual representation of the grouped posts, including images, titles, descriptions, and last modified dates.

## Dependencies

- This block depends on the `createOptimizedPicture` function from the `aem.js` script.

## Accessibility

- The block uses semantic HTML elements for better screen reader compatibility.
- Images include alt text for accessibility.

## Suggestions for Improvement

1. Add pagination or lazy loading for better performance with large numbers of posts.
2. Implement error handling for missing images or data.
3. Add filtering options to allow users to sort by date or category.
4. Implement a search functionality within the blogroll.
