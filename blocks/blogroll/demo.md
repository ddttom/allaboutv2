# Blogroll Block Demo

This page demonstrates the functionality of the Blogroll block, which displays a list of blog posts grouped by series and sorted by part number or title.

## Introduction

The Blogroll block is designed to fetch blog post data from a JSON file and present it in an organized, easy-to-read format. It groups posts by series, sorts them appropriately, and displays them with titles, dates, and descriptions.

## Sample Usage

To use the Blogroll block in your content, add one of the following tables to your document:

Regular Blogroll:

| Blogroll |
|----------|

Compact Blogroll:

| Blogroll (compact) |
|--------------------|

The block will automatically fetch the blog post data and render the blogroll in the specified format.

## How It Works

1. The block fetches blog post data from a specified JSON endpoint.
2. It processes the data, grouping posts by series and sorting them by part number or title.
3. The grouped and sorted posts are then rendered in a structured HTML format.
4. Each post displays its title (linked to the post) and publication date. In the regular version, descriptions are also shown.

## Customization Options

The Blogroll block can be customized by modifying the CSS file (`blogroll.css`). You can adjust:

- Font styles and sizes
- Colors
- Layout and spacing
- Responsive design breakpoints

## Potential Use Cases

1. Blog homepage to showcase all posts (regular version)
2. Sidebar widget to display recent or featured posts (compact version)
3. Dedicated archive page for easy navigation of all blog content
4. Topic-specific pages to group related posts together

## Metadata

| metadata | |
|----------|--|
| title | Blogroll Block Demo |
| description | A demonstration of the Blogroll block functionality in Franklin |
| json-ld | article |
| image | |
| author | Tom Cranstoun |
| longdescription | This page showcases the Blogroll block functionality in Franklin, demonstrating how it organizes and displays blog posts in a structured, easy-to-navigate format, including both regular and compact variations. |
