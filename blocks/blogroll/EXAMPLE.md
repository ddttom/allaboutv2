---
title: "Blogroll Block - Content Author Guide"
description: "Usage examples for the blogroll EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Blogroll Block - Content Author Guide

This guide shows content authors how to use the Blogroll block in their pages.

## What is the Blogroll Block?

The Blogroll block displays a list of your blog posts with smart filtering and organization. It automatically:

- Groups related posts into series
- Sorts posts by part number or alphabetically
- Shows post titles, dates, and descriptions
- Filters posts by path or keyword

## Basic Usage

### Display All Posts in Current Directory

The simplest usage - shows all posts in the same folder as your page:

| Blogroll |
|----------|

**Result:** All blog posts from the current directory, grouped by series.

### Compact Floating Panel

Add `(compact)` for a floating icon that opens a slide-out panel:

| Blogroll (compact) |
|--------------------|

**Result:** Book icon in top-left corner. Click to open a panel with post listings.

## Filtering Posts

### Filter by Path

Show posts from a specific directory:

| Blogroll |
|----------|
| path=/blogs/tech |

**Result:** Only shows posts with "/blogs/tech" in their path.

### Current Directory Only

Use `path=*` to show only posts in the current folder:

| Blogroll |
|----------|
| path=* |

**Result:** Posts from the current directory only.

### Multiple Path Filters

Show posts from multiple directories:

| Blogroll |
|----------|
| path=/blogs/tech |
| path=/blogs/design |
| path=/tutorials |

**Result:** Posts from any of the specified paths.

### Filter by Keyword

Show posts containing specific keywords:

| Blogroll |
|----------|
| JavaScript |
| TypeScript |

**Result:** Posts with "JavaScript" or "TypeScript" in their path.

**Note:** Most keywords are case-sensitive. The word "guide" is case-insensitive for backward compatibility.

### Mixed Filters

Combine path and keyword filters:

| Blogroll |
|----------|
| path=/blogs |
| tutorial |

**Result:** Posts from "/blogs" path OR posts with "tutorial" keyword.

**Important:** Path filters take precedence over keyword filters.

## Display Modes

### Full Mode (Default)

Shows complete post information including descriptions:

| Blogroll |
|----------|
| path=/guides |

**Features:**

- Post titles as clickable links
- Publication dates
- Full descriptions
- Organized by series
- Centered layout with max-width

**Best for:**

- Blog category pages
- Archive pages
- Main blog listing pages

### Compact Mode

Shows a floating icon with slide-out panel:

| Blogroll (compact) |
|--------------------|
| path=* |

**Features:**

- Fixed floating icon (book emoji)
- "Blogroll" label next to icon
- Slide-out panel from left side
- Compact post listings
- Click outside to close
- Escape key to close

**Best for:**

- Sidebar navigation
- Related posts section
- Long-form content pages
- Tutorial series navigation

## Common Patterns

### Blog Series Navigation

Show related posts in a series:

| Blogroll (compact) |
|--------------------|
| path=* |

Place this on each page of your series. Readers can see all parts.

### Category Landing Page

Show all posts in a category:

| Blogroll |
|----------|
| path=/category/javascript |

Creates a complete listing for the category.

### Tutorial Collection

Show tutorials from multiple topics:

| Blogroll |
|----------|
| path=/tutorials/react |
| path=/tutorials/vue |
| path=/tutorials/angular |

Groups all framework tutorials together.

### Filtered Related Content

Show posts related to current topic:

| Blogroll |
|----------|
| React |
| Hooks |
| Components |

Displays posts mentioning these keywords.

## Series Grouping

The blogroll automatically detects and groups series posts.

### Series Naming Convention

Use this format for series posts:

**Good Examples:**

- "React Tutorial - Part 1"
- "Getting Started with Vue - Part 2"
- "Advanced TypeScript - Part 3"

**Bad Examples:**

- "React Tutorial (Part 1)" - Wrong brackets
- "React Tutorial Part 1" - Missing hyphen
- "React Tutorial pt 1" - Not recognized

### How Series Work

1. Block detects "- Part N" pattern in titles
2. Groups posts with same base name
3. Sorts by part number (ascending)
4. Displays series with most posts first

**Example:**

Given these posts:

- "React Basics - Part 1"
- "React Basics - Part 2"
- "React Basics - Part 3"
- "Vue Introduction - Part 1"
- "Vue Introduction - Part 2"

**Result:**

```
React Basics
  - React Basics - Part 1
  - React Basics - Part 2
  - React Basics - Part 3

Vue Introduction
  - Vue Introduction - Part 1
  - Vue Introduction - Part 2
```

## Tips & Best Practices

### 1. Start Simple

Begin with basic filtering and add complexity as needed:

| Blogroll |
|----------|

Then refine:

| Blogroll |
|----------|
| path=* |

### 2. Use Compact Mode for Navigation

Compact mode works great for persistent navigation:

| Blogroll (compact) |
|--------------------|
| path=/current/series |

### 3. Be Specific with Path Filters

Use specific paths to avoid showing too many posts:

**Too Broad:**

| Blogroll |
|----------|
| path=/blogs |

**Better:**

| Blogroll |
|----------|
| path=/blogs/javascript/tutorials |

### 4. Combine with Other Blocks

The blogroll works well alongside other blocks:

```
| Hero |
|------|
| Welcome to My Blog |

| Blogroll |
|----------|
| path=* |

| Quote |
|-------|
| Subscribe to stay updated! |
```

### 5. Test Your Filters

Preview your page to verify filters work correctly. Adjust as needed.

## Troubleshooting

### No Posts Showing

**Problem:** Blogroll says "No blog posts found."

**Solutions:**

1. Remove all filters to see if any posts exist
2. Check if `/query-index.json` is accessible
3. Verify path filters match actual post paths
4. Try broader filter terms

### Wrong Posts Showing

**Problem:** Seeing unexpected posts.

**Solutions:**

1. Check filter case sensitivity
2. Verify `path=value` syntax (no spaces)
3. Remember path filters override keywords
4. Use more specific path filters

### Series Not Grouping

**Problem:** Series posts appear separately.

**Solutions:**

1. Verify title format: "Name - Part N"
2. Check for extra spaces or typos
3. Ensure consistent naming across series
4. Confirm posts share same directory

### Compact Icon Not Appearing

**Problem:** No floating icon visible.

**Solutions:**

1. Verify class is `Blogroll (compact)` not just `Blogroll`
2. Check for z-index conflicts with other elements
3. Ensure JavaScript loaded successfully
4. Try refreshing the page

## Advanced Examples

### Multi-Level Filtering

| Blogroll |
|----------|
| path=/guides/frontend |
| path=/guides/backend |
| tutorial |

### Exclude Current Page Series

To show only other series, use path filtering:

| Blogroll (compact) |
|--------------------|
| path=/blogs/series1 |
| path=/blogs/series2 |

### Category + Keyword Filter

| Blogroll |
|----------|
| path=/javascript |
| React |
| Vue |

## Quick Reference

### Syntax Summary

| Pattern | Example | Result |
|---------|---------|--------|
| No filter | `\| Blogroll \|` | Current directory (default) |
| Current dir | `\| path=* \|` | Current directory only |
| Specific path | `\| path=/blogs \|` | Posts from /blogs path |
| Keyword | `\| React \|` | Posts with "React" keyword |
| Compact mode | `\| Blogroll (compact) \|` | Floating panel version |

### Filter Priority

1. **Current directory** (`path=*`) - Highest priority
2. **Path filters** (`path=/value`) - Medium priority
3. **Keywords** - Lowest priority

### When to Use Each Mode

**Use Full Mode when:**

- Main blog listing page
- Category landing pages
- Archive pages
- Posts need descriptions visible

**Use Compact Mode when:**

- Sidebar navigation needed
- Page has other primary content
- Space is limited
- Reader focused on current article

---

**Need Help?** Check the [README.md](README.md) for technical details or contact support.
