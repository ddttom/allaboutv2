# Blogroll Block Demo

## Introduction

The Blogroll block is a powerful and flexible component designed to display a visually appealing list of blog posts. It fetches data from a JSON endpoint and organizes the posts into groups based on their paths and titles. This demo page will showcase the Blogroll block in action and explain its features.

## Sample Usage

To use the Blogroll block in your content, add one of the following tables to your markdown document:

Default view:

| Blogroll |
|----------|

Compact view:

| Blogroll (compact) |
|--------------------|

## How It Works

The Blogroll block performs the following actions:

1. Fetches blog post data from the specified JSON endpoint (https://allabout.network/blogs/ddt/query-index.json).
2. Groups and sorts the posts based on their paths and part numbers.
3. Creates a visual representation of the grouped posts, including images, titles, descriptions, and last modified dates.

## Variations

1. Default: Displays blog posts in a full-width layout with larger images and more detailed information.
2. Compact: Displays blog posts in a compact, card-like layout, ideal for sidebars or grid layouts.

## Customization Options

The Blogroll block can be customized through CSS variables and classes. Some key customization options include:

- Adjusting the maximum width of the container
- Changing the color scheme
- Modifying the layout for different screen sizes
- Switching between default and compact views

## Potential Use Cases

The Blogroll block is ideal for:

1. Displaying a list of recent blog posts on a homepage (default view)
2. Creating an archive page for a blog (default view)
3. Showcasing a series of related articles or tutorials (compact view)
4. Presenting a portfolio of written work in a grid layout (compact view)

## Metadata

| metadata | |
|----------|--|
| title | Blogroll Block Demo |
| description | A demonstration of the Blogroll block functionality in Franklin |
| json-ld | article |
| image | /blocks/blogroll/blogroll-demo-image.jpg |
| author | Tom Cranstoun |
| longdescription | This page showcases the Blogroll block, a powerful component for displaying blog posts in a visually appealing and organized manner. It demonstrates how the block fetches data, groups posts, and presents them in an easy-to-read format, including both default and compact variations. |
