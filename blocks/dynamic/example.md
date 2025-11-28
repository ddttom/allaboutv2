# Dynamic Block Examples

This page demonstrates various usage patterns for the Dynamic block, which automatically fetches and displays content from the query-index.json file.

## Example 1: Default Blog Listing

The simplest usage - displays up to 8 most recent blog posts by default:

| Dynamic |
|---------|
|         |

## Example 2: Blog Variation with Custom Max Return

Display blog posts using the blog variation with a custom limit:

| Dynamic (blog) |
|----------------|
|                |

Section Metadata:
```
maxReturn: 12
```

## Example 3: Articles Variation

Display content from the /articles/ path:

| Dynamic (articles) |
|--------------------|
|                    |

## Example 4: Resources Variation

Display content from the /resources/ path:

| Dynamic (resources) |
|---------------------|
|                     |

## Example 5: Flexible Cards Layout

Use the flexible-cards variation for responsive column layout:

| Dynamic (blog, flexible-cards) |
|--------------------------------|
|                                |

## Example 6: Custom Path with Unlimited Results

Display all content from a specific path using -1 for maxReturn:

| Dynamic (tutorials) |
|---------------------|
|                     |

Section Metadata:
```
maxReturn: -1
```

## Example 7: Multiple Variations Combined

Combine multiple variations for specific styling and filtering:

| Dynamic (blog, flexible-cards) |
|--------------------------------|
|                                |

Section Metadata:
```
maxReturn: 16
```

## How It Works

**Filtering Logic:**
1. By default, the block filters content from `/blog/` paths
2. If the current page path has multiple segments (e.g., `/articles/index`), it uses the page path as the filter
3. If variations are provided (e.g., `Dynamic (articles)`), they become the path filters
4. Multiple variations can be combined (e.g., `Dynamic (blog, tutorials)`)

**Max Return Options:**
- Default: 8 items
- Section metadata `maxReturn`: Sets custom limit
- Page metadata `maxReturn`: Falls back to page-level setting
- System config `$system:maxreturn$`: Falls back to system setting
- Use `-1` to return up to 1000 items

**Automatic Exclusions:**
- Pages with `/template` in the path
- Pages with `/test` in the path
- The current page itself

**Sorting:**
- Content is sorted by `lastModified` date in descending order (newest first)

**Card Display:**
- Each card shows: image, service tag, resource tag, headline, and description
- Images are optimized at 750px width
- All cards link to their respective pages

| metadata        |                                                                 |
| :-------------- | :-------------------------------------------------------------- |
| title           | Dynamic Block Examples                                          |
| description     | Usage examples for the Dynamic block showing various configurations |
| author          | Tom Cranstoun                                                   |
| longdescription | This page demonstrates various examples of the Dynamic block, showing different variations, filtering patterns, and configuration options for displaying dynamic content from query-index.json. |
