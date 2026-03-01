---
title: "DAM Block Usage Examples"
description: "Usage examples for the dam EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# DAM Block Usage Examples

The DAM (Digital Asset Management) block extracts metadata from tabular data and displays it as formatted JSON. This guide shows content authors how to use the block effectively.

## Basic Usage

The simplest DAM block includes asset metadata in a 7-column table:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | Profile Image | Professional headshot | Portrait | Profile | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Main profile photo |
| | Sample Art | Abstract artwork | Art | Gallery | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Featured piece |
| | Nature Photo | Landscape view | Photography | Nature | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | Scenic vista |

## Column Definitions

| Column | Purpose | Required | Example Values |
|--------|---------|----------|----------------|
| DAM | Block identifier | Yes | Always "DAM" |
| Note | Short asset identifier | No | "Logo", "Hero Image", "Thumbnail" |
| Description | Detailed asset description | No | "Company logo in SVG format" |
| Classification | Asset category | No | "Logo", "Photo", "Illustration", "Icon" |
| Tag | Grouping tag | No | "Marketing", "Product", "Profile" |
| Image | URL to the asset | Yes | Full URL or path |
| Additional Info | Extra metadata | No | "Updated 2024", "HD quality" |

## Product Catalog Example

Use the DAM block to document product images:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | Product Hero | Main product image | Product | Featured | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | 4K resolution |
| | Product Detail | Close-up shot | Product | Detail | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | Shows texture |
| | Product Usage | In-context photo | Product | Lifestyle | https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg | Customer use case |

## Marketing Assets Example

Document marketing materials and brand assets:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | Social Banner | Facebook cover image | Marketing | Social | https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg | 1200x630px |
| | Email Header | Newsletter banner | Marketing | Email | https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png | Responsive |
| | Campaign Hero | Landing page image | Marketing | Campaign | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Q4 2024 |

## Team Photos Example

Maintain a catalog of team member photos:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | CEO Portrait | Executive headshot | Portrait | Leadership | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Updated 2024 |
| | Team Group | All-hands photo | Group | Team | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Annual meeting |
| | Office Tour | Workspace image | Location | Office | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | SF headquarters |

## Content Library Example

Organize blog post images and article assets:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | Blog Hero 01 | Article header image | Blog | Featured | https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg | Tech article |
| | Inline Image 01 | Article illustration | Blog | Inline | https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg | Diagram |
| | Author Photo | Writer headshot | Portrait | Author | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Bio image |

## Minimal Example

You can omit optional fields if not needed:

| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| | Logo | Company logo | Logo | Brand | https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png | |
| | Icon | App icon | Icon | UI | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | |

## Classification Suggestions

Common values for the Classification field:

- **Portrait** - Individual headshots and profile photos
- **Group** - Team photos and group shots
- **Product** - Product photography and items
- **Illustration** - Drawings, graphics, artwork
- **Icon** - Small UI icons and symbols
- **Logo** - Company and brand logos
- **Screenshot** - Application and website screenshots
- **Diagram** - Technical diagrams and charts
- **Photo** - General photography
- **Marketing** - Marketing materials and ads
- **Document** - PDF thumbnails and document previews

## Tag Suggestions

Common values for the Tag field:

- **Brand** - Brand identity assets
- **Marketing** - Marketing campaign materials
- **Product** - Product-related images
- **Profile** - User and team profiles
- **Social** - Social media assets
- **Email** - Email campaign images
- **Web** - Website assets
- **Mobile** - Mobile app assets
- **Print** - Print materials
- **Internal** - Internal use only
- **Featured** - Featured or hero images
- **Archive** - Archived assets

## Tips for Content Authors

1. **Be Consistent**: Use consistent naming conventions for Notes
2. **Add Context**: Use Description to explain what the asset shows
3. **Categorize**: Use Classification to group similar asset types
4. **Tag Wisely**: Use Tags to organize by usage or project
5. **Update Info**: Keep Additional Info current with dates and versions
6. **Use Full URLs**: Always provide complete image URLs
7. **Test Output**: Preview the page to verify JSON is formatted correctly

## Expected Output

The block transforms your table into formatted JSON like this:

```json
[
  {
    "note": "Profile Image",
    "description": "Professional headshot",
    "classification": "Portrait",
    "tag": "Profile",
    "path": "/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png",
    "additionalInfo": "Main profile photo"
  },
  {
    "note": "Sample Art",
    "description": "Abstract artwork",
    "classification": "Art",
    "tag": "Gallery",
    "path": "/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png",
    "additionalInfo": "Featured piece"
  }
]
```

## Common Mistakes to Avoid

1. **Missing Header Row**: Always include the header row with column names
2. **Wrong Column Order**: Columns must be in the exact order shown
3. **Empty Image Column**: At least provide an empty cell for images
4. **Inconsistent Formatting**: Keep table formatting consistent
5. **Special Characters**: Avoid quotes and special chars in Note field

## Questions?

- See README.md for technical details
- Check demo.md for a live example
- Use test.html for testing your own content
