# IPynb Viewer Attributes Reference

Complete guide to all metadata attributes supported by the ipynb-viewer block and where they're used.

## Table of Contents

- [Overview](#overview)
- [Required Attributes](#required-attributes)
- [Optional Header Attributes](#optional-header-attributes)
- [Optional Badge Attributes](#optional-badge-attributes)
- [Configuration Attributes](#configuration-attributes)
- [Examples](#examples)
- [Attribute Reference Table](#attribute-reference-table)

## Overview

The ipynb-viewer block uses metadata from your `.ipynb` file to display rich information about your notebook. All attributes are defined in the notebook's `metadata` object.

**Basic structure:**

```json
{
  "cells": [...],
  "metadata": {
    "title": "Your Notebook Title",
    "description": "Brief description",
    "author": "Author Name",
    ...
  }
}
```

## Required Attributes

### `title`

- **Type:** String
- **Display:** Header title (large heading at top)
- **Example:** `"EDS Documentation Navigator"`
- **Where used:** Always displayed in notebook header
- **Default:** `"Jupyter Notebook"` if not provided

```json
{
  "metadata": {
    "title": "My Interactive Tutorial"
  }
}
```

## Optional Header Attributes

These attributes display in the header section, below the title.

### `description`

- **Type:** String
- **Display:** Subtitle/description text
- **Example:** `"Complete guide to navigating EDS documentation"`
- **Where used:** Directly under the title
- **Styling:** Slightly smaller font, gray color

```json
{
  "metadata": {
    "description": "Learn how to build EDS blocks step by step"
  }
}
```

### `author`

- **Type:** String
- **Display:** `"By {author}"` format
- **Example:** `"Tom Cranstoun"`
- **Where used:** Below description
- **Styling:** Small font, gray color

```json
{
  "metadata": {
    "author": "Jane Developer"
  }
}
```

### `creation-date`

- **Type:** String (recommended format: YYYY-MM-DD)
- **Display:** `"Created: {date}"` format
- **Example:** `"2025-01-19"`
- **Where used:** Below author
- **Styling:** Small font, gray color
- **Backward compatibility:** Also accepts `date` attribute (deprecated, use `creation-date` instead)

```json
{
  "metadata": {
    "creation-date": "2025-11-23"
  }
}
```

**Note:** The older `date` attribute is still supported for backward compatibility but `creation-date` is preferred for clarity.

### `version`

- **Type:** String
- **Display:** `"Version {version}"` format
- **Example:** `"1.0.0"`
- **Where used:** Below date
- **Styling:** Small font, gray color, bold weight

```json
{
  "metadata": {
    "version": "2.1.0"
  }
}
```

### `last-modified`

- **Type:** String (recommended format: YYYY-MM-DD)
- **Display:** `"Last modified: {date}"` format
- **Example:** `"2025-11-23"`
- **Where used:** Below version
- **Styling:** Small font, gray color, italic style
- **Purpose:** Track when content was last updated

```json
{
  "metadata": {
    "last-modified": "2025-11-23"
  }
}
```

## Optional Badge Attributes

These attributes display as colored badges in a horizontal row.

### `category`

- **Type:** String
- **Display:** Colored badge pill
- **Example:** `"presentation"`, `"tutorial"`, `"reference"`
- **Where used:** Badge row (horizontal layout)
- **Colors:**
  - `tutorial` - Blue (#2196f3)
  - `reference` - Purple (#9c27b0)
  - `guide` - Green (#4caf50)
  - `documentation` - Teal (#009688)
  - `presentation` - Orange (#ff9800)
  - `example` - Pink (#e91e63)
  - Other - Gray (#757575)

```json
{
  "metadata": {
    "category": "tutorial"
  }
}
```

### `difficulty`

- **Type:** String
- **Display:** Colored badge pill
- **Example:** `"beginner"`, `"intermediate"`, `"advanced"`
- **Where used:** Badge row (horizontal layout)
- **Colors:**
  - `beginner` - Green (#4caf50)
  - `intermediate` - Orange (#ff9800)
  - `advanced` - Red (#f44336)

```json
{
  "metadata": {
    "difficulty": "intermediate"
  }
}
```

### `duration`

- **Type:** String
- **Display:** Badge pill with clock icon (⏱️)
- **Example:** `"15 minutes"`, `"1 hour"`, `"30-45 min"`
- **Where used:** Badge row (horizontal layout)
- **Color:** Blue (#2196f3)

```json
{
  "metadata": {
    "duration": "20-25 minutes"
  }
}
```

### `tags`

- **Type:** Array of strings
- **Display:** Multiple gray badge pills
- **Example:** `["documentation", "navigation", "EDS"]`
- **Where used:** Badge row (horizontal layout, wraps to multiple rows if needed)
- **Color:** Gray (#757575)

```json
{
  "metadata": {
    "tags": ["jupyter", "tutorial", "interactive", "beginner-friendly"]
  }
}
```

## Configuration Attributes

These attributes control behavior rather than display.

### `repo`

- **Type:** String (GitHub repository URL)
- **Display:** Not directly displayed
- **Example:** `"https://github.com/ddttom/allaboutV2"`
- **Purpose:** Converts relative `.md` links to full GitHub URLs
- **Where used:** Link resolution in markdown cells

**How it works:**

- When you write `[guide](docs/help.md)` in a markdown cell
- The viewer converts it to `https://github.com/ddttom/allaboutV2/blob/main/docs/help.md`
- Clicking opens the GitHub markdown overlay

```json
{
  "metadata": {
    "repo": "https://github.com/yourname/yourrepo"
  }
}
```

### `help-repo`

- **Type:** String (GitHub repository URL)
- **Display:** Not directly displayed
- **Purpose:** Separate repository for help documentation
- **Fallback:** Uses `repo` if not specified, then defaults to allaboutV2
- **Where used:** Help button (❓) in notebook mode overlay
- **Typical use:** When notebook content is from one repo but help docs are from viewer's repo

```json
{
  "metadata": {
    "repo": "https://github.com/user/project",
    "help-repo": "https://github.com/ddttom/allaboutV2"
  }
}
```

### `github-branch`

- **Type:** String (GitHub branch name)
- **Display:** Not directly displayed
- **Default:** `"main"` if not specified
- **Purpose:** Specify which GitHub branch to use when loading .md files
- **Where used:** All markdown file links, smart links, and help button (❓)
- **Typical use:** When working in a feature branch, using frozen documentation versions, or accessing branch-specific content

**How it works:**

- When clicking help button or any .md link in the notebook, files are loaded from the specified branch
- Without this attribute, all files default to loading from the `main` branch
- Help button (`docs/help.md`) respects this setting and loads from the specified branch
- Useful during development when files exist in feature branches but not yet in main
- Also useful for frozen documentation versions that shouldn't change

```json
{
  "metadata": {
    "repo": "https://github.com/ddttom/allaboutV2",
    "help-repo": "https://github.com/ddttom/allaboutV2",
    "github-branch": "frozen"
  }
}
```

**Example (feature branch):**
```json
{
  "metadata": {
    "repo": "https://github.com/ddttom/allaboutV2",
    "github-branch": "claude/github-markdown-viewer-012wJTuNsNumzhbWWraUQWhf"
  }
}
```

**Common use cases:**

- Development: Load docs from your feature branch while testing
- Staging: Point to a staging branch for preview
- Frozen versions: Use a frozen branch for documentation that shouldn't change
- Release versions: Point to release-specific branches (v1.0, v2.0, etc.)
- Versioning: Use specific release branches for different notebook versions

### `splash-page`

- **Type:** String (URL)
- **Display:** Full-screen overlay image
- **Default:** None - no splash screen when omitted
- **Purpose:** Display a branded splash screen image during notebook initialization and navigation
- **Where shown:**
  - During initialization (7.5-second duration)
  - When home button (🏠) is pressed in notebook mode (5-second duration)
  - When home button (🏠) is pressed in GitHub markdown overlay (5-second duration, if opened from notebook)
- **Typical use:** Branding, visual transition, loading indicator, or welcome screen

**How it works:**

- **Startup:** Displays splash image for minimum 7.5 seconds
- **Home button:** Shows splash for minimum 5 seconds (shorter for navigation)
- **Close button:** X button in top-right corner allows early dismissal at any time
- **Auto-dismiss:** Automatically fades out after minimum duration if not manually closed
- **Full-screen dark overlay** (rgba(0, 0, 0, 0.95)) with centered image
- **Image sizing:** Automatically sized to fit screen (max 90% width/height)
- **Smooth transitions:** 0.3s fade-in/out for professional appearance

```json
{
  "metadata": {
    "title": "Invisible Users",
    "splash-page": "https://allabout.network/dam/media_1f892fe947de031bcd3da71e54220726833215931.png?width=2000&format=webply&optimize=medium"
  }
}
```

**Common use cases:**

- Branding: Display company logo or book cover during initialization
- Loading indicator: Provide visual feedback while notebook loads
- Welcome screen: Show title page or introduction image
- Visual transition: Smooth experience when returning home
- Professional polish: Add branded splash for published notebooks

**Image optimization tips:**

- Use optimized formats (WebP) for faster loading
- Specify width parameter for responsive sizing
- Use `optimize=medium` for balance of quality and size
- Recommended size: 2000px width or appropriate for your content
- Aspect ratio: Design for 16:9 or square for best compatibility

## Examples

### Complete Tutorial Notebook

```json
{
  "metadata": {
    "title": "Building Your First EDS Block",
    "description": "Step-by-step guide to creating a simple EDS block",
    "author": "Jane Developer",
    "creation-date": "2025-11-20",
    "version": "1.2.0",
    "last-modified": "2025-11-23",
    "category": "tutorial",
    "difficulty": "beginner",
    "duration": "30 minutes",
    "tags": ["EDS", "blocks", "beginner", "hands-on"],
    "repo": "https://github.com/yourorg/eds-examples",
    "help-repo": "https://github.com/ddttom/allaboutV2",
    "github-branch": "main",
    "splash-page": "https://example.com/splash.png"
  }
}
```

### Minimal Presentation

```json
{
  "metadata": {
    "title": "Q4 Product Demo",
    "category": "presentation",
    "creation-date": "2025-11-23"
  }
}
```

### Reference Documentation

```json
{
  "metadata": {
    "title": "EDS API Reference",
    "description": "Complete API documentation for EDS core functions",
    "category": "reference",
    "difficulty": "advanced",
    "version": "3.0.0",
    "last-modified": "2025-11-23",
    "tags": ["API", "reference", "documentation"],
    "repo": "https://github.com/adobe/aem-boilerplate"
  }
}
```

## Attribute Reference Table

| Attribute | Type | Required | Display Location | Purpose |
|-----------|------|----------|-----------------|---------|
| `title` | String | ✅ Yes | Header | Main notebook title |
| `description` | String | ❌ No | Header | Brief description/subtitle |
| `author` | String | ❌ No | Header | Content creator |
| `creation-date` | String | ❌ No | Header | Creation/publication date |
| `date` | String | ❌ No | Header | ⚠️ Deprecated, use `creation-date` |
| `version` | String | ❌ No | Header | Version number |
| `last-modified` | String | ❌ No | Header | Last update date |
| `category` | String | ❌ No | Badge row | Content category (colored) |
| `difficulty` | String | ❌ No | Badge row | Difficulty level (colored) |
| `duration` | String | ❌ No | Badge row | Estimated reading/completion time |
| `tags` | Array | ❌ No | Badge row | Keywords/topics (gray pills) |
| `repo` | String | ❌ No | Not displayed | GitHub repo for .md link resolution |
| `help-repo` | String | ❌ No | Not displayed | GitHub repo for help button |
| `github-branch` | String | ❌ No | Not displayed | GitHub branch for loading .md files (default: 'main') |

## CSS Classes

Each attribute has a corresponding CSS class for custom styling:

```css
.ipynb-viewer-title          /* Main title */
.ipynb-viewer-description    /* Description text */
.ipynb-viewer-author         /* Author line */
.ipynb-viewer-creation-date  /* Creation date line (preferred) */
.ipynb-viewer-date           /* Date line (deprecated, use creation-date) */
.ipynb-viewer-version        /* Version line (bold) */
.ipynb-viewer-last-modified  /* Last modified line (italic) */
.ipynb-viewer-category       /* Category badge */
.ipynb-viewer-difficulty     /* Difficulty badge */
.ipynb-viewer-duration       /* Duration badge */
.ipynb-viewer-tag            /* Individual tag badge */
```

## Best Practices

### 1. Always Include Title

Every notebook should have a title. It's the only truly required attribute.

```json
{
  "metadata": {
    "title": "My Notebook"  // ✅ Good
  }
}
```

### 2. Use Description for Context

Help users understand what the notebook covers before diving in.

```json
{
  "metadata": {
    "description": "Learn how to build interactive tutorials with Jupyter notebooks"
  }
}
```

### 3. Date Format Consistency

Use ISO 8601 format (YYYY-MM-DD) for dates and prefer `creation-date` over `date`:

```json
{
  "metadata": {
    "creation-date": "2025-11-23",   // ✅ Best - clear and explicit
    "last-modified": "2025-11-23"    // ✅ Good
    // Not: "date": "2025-11-23"     // ⚠️  Deprecated
    // Not: "Nov 23, 2025" or "23/11/2025"
  }
}
```

### 4. Meaningful Categories

Choose categories that help users find content:

```json
{
  "metadata": {
    "category": "tutorial"  // ✅ Clear
    // Not: "stuff" or "misc"
  }
}
```

### 5. Realistic Duration

Estimate reading/completion time accurately:

```json
{
  "metadata": {
    "duration": "20-25 minutes"  // ✅ Specific range
    // Not: "short" or "quick"
  }
}
```

### 6. Track Modifications

Use `creation-date` and `last-modified` to show content lifecycle:

```json
{
  "metadata": {
    "creation-date": "2025-01-15",  // Original creation
    "last-modified": "2025-11-23"   // Latest update
  }
}
```

### 7. Relevant Tags

Use 4-8 specific tags that aid discovery:

```json
{
  "metadata": {
    "tags": ["EDS", "blocks", "tutorial", "interactive"]  // ✅ Specific
    // Not: ["good", "nice", "cool"]
  }
}
```

### 8. Separate Help Repos

When your notebook is from one project but uses viewer help docs:

```json
{
  "metadata": {
    "repo": "https://github.com/myorg/myproject",        // Your content
    "help-repo": "https://github.com/ddttom/allaboutV2"  // Viewer help
  }
}
```

## Common Patterns

### Educational Content

```json
{
  "title": "...",
  "description": "...",
  "author": "...",
  "creation-date": "...",
  "category": "tutorial",
  "difficulty": "beginner",
  "duration": "...",
  "tags": [...]
}
```

### Reference Material

```json
{
  "title": "...",
  "description": "...",
  "category": "reference",
  "version": "...",
  "last-modified": "...",
  "tags": [...]
}
```

### Presentation/Demo

```json
{
  "title": "...",
  "category": "presentation",
  "creation-date": "...",
  "author": "..."
}
```

## Related Documentation

- [IPynb Viewer README](README.md) - Complete block documentation
- [Explaining Jupyter Testing](../../docs/for-ai/explaining-jupyter.md) - Testing notebooks
- [Explaining Educational Notebooks](../../docs/for-ai/explaining-educational-notebooks.md) - Tutorial creation
- [Explaining Presentation Notebooks](../../docs/for-ai/explaining-presentation-notebooks.md) - Presentation mode

## Troubleshooting

**Attributes not displaying?**

- Check JSON syntax in metadata object
- Verify attribute names are spelled correctly (case-sensitive!)
- Check browser console for errors

**Badges not showing correct colors?**

- Verify category/difficulty values match expected keywords
- Check spelling ("beginner" not "beginnner")

**Links not resolving?**

- Ensure `repo` attribute is a full GitHub URL
- Check that .md files exist in repository
- Verify relative paths in markdown links

**Help button not working?**

- Check `help-repo` is specified (or `repo` as fallback)
- Ensure help.md exists at `docs/help.md` in repository
- Open GitHub overlay to test

---

*Last updated: 2025-11-23*
