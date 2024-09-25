# Blogroll Block

## Introduction

The Blogroll block is a powerful and flexible component designed to display a visually appealing list of blog posts. It fetches data from a JSON endpoint relative to the current page and organizes the posts into groups based on their paths and titles.

## Usage

To use the Blogroll block in your content, add one of the following tables to your markdown document:

Default view:

| Blogroll |
|----------|

Compact view:

| Blogroll (compact) |
|--------------------|

## Functionality

The Blogroll block performs the following actions:

1. Fetches blog post data from the JSON endpoint (`/query-index.json`) relative to the current page's path.
2. Groups and sorts the posts based on their paths and part numbers.
3. Creates a visual representation of the grouped posts, including images, titles, descriptions, and last modified dates.

## Features

- Automatically groups related blog posts based on their path.
- Sorts posts within each group by part number (if applicable).
- Displays post images, titles, descriptions, and last modified dates.
- Offers both default and compact view options.
- Formats dates to a readable dd/mm/yyyy format.
- Handles missing long descriptions by falling back to short descriptions.
- Supports a compact variation for a more condensed layout

## Customization

The Blogroll block can be customized through CSS variables and classes. Some key customization options include:

- Adjusting the layout and styling of post groups
- Modifying the appearance of individual post elements
- Changing the image size and aspect ratio
- Customizing typography and color schemes

## Variations

1. Default: Displays blog posts in a full-width layout with larger images and more detailed information.
2. Compact: Displays blog posts in a compact, card-like layout, ideal for sidebars or grid layouts.

## Technical Details

- The block uses the `createOptimizedPicture` function from `aem.js` for image optimization.
- It extracts part numbers from post titles to ensure correct sorting within series.
- The block handles errors gracefully, displaying a user-friendly message if data fetching fails.

## Potential Use Cases

1. Displaying a list of recent blog posts on a homepage
2. Creating an archive page for a blog series
3. Showcasing related articles or tutorials
4. Presenting a portfolio of written work in a grouped format

## Accessibility and SEO Considerations

- Uses semantic HTML structure for better accessibility and SEO
- Includes proper heading hierarchy within each group
- Provides alt text for images using the post title

## Dependencies

- Requires access to a `query-index.json` file in the current directory
- Depends on the `aem.js` script for image optimization

## Notes for Developers

- Ensure that the `query-index.json` file is up-to-date and contains all necessary fields for each blog post.
- The block automatically handles posts with or without part numbers in their titles.
- Consider adding additional error handling or loading states for a more robust user experience.
