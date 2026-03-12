---
name: mx-html-writing-guide
version: "1.1"
description: "Single source of truth for writing HTML in the MX ecosystem. Covers the complete meta tag stack, MX carrier tags, and what NOT to include."
created: 2026-03-04
modified: 2026-03-04
author: "Tom Cranstoun and Maxine"

mx:
  status: active
  contentType: field-dictionary
  category: mx-core
  partOf: mx-os
  tags: [html, meta-tags, ssot, writing-guide, carrier-format, ai-metadata]
  audience: [developers, ai-agents]
  license: proprietary
  deliverable: "canonical reference for HTML meta tag usage across MX projects"
  buildsOn: [fields, cog-unified-spec, mx-metadata-conventions]
---

# MX HTML Writing Guide

Single source of truth for writing HTML `<head>` metadata in the MX ecosystem. Every HTML page published under the MX umbrella follows this guide. When this guide conflicts with any other document, this guide wins.

**Authority chain:** This guide > Appendix D (AI-Friendly HTML Guide) > Appendix L (Proposed AI Metadata Patterns) > individual page implementations.

**Field definitions:** All field names referenced here are defined in `mx-canon/ssot/fields.cog.md`. Do not invent fields.

---

## Foundational Principle: Standards Hierarchy

Everything that benefits SEO, GEO (Generative Engine Optimisation), accessibility, and usability also benefits MX. These disciplines share a common goal: making web content explicit, structured, and unambiguous. MX builds on their foundations.

**The hierarchy:**

1. **Established web standards come first.** HTML semantics, WCAG accessibility, Schema.org structured data, Open Graph, Dublin Core, `robots.txt`, `sitemap.xml` — use these as the primary building blocks. They are widely supported, well-documented, and understood by the broadest range of agents and tools.
2. **MX adds value where standards leave gaps.** MX carrier tags (`mx:status`, `mx:contentType`, `mx:content-policy`) provide governance and lifecycle metadata that no existing standard covers. This is where MX earns its place.
3. **MX never duplicates or replaces established standards.** If Schema.org already expresses a fact, do not restate it in an MX tag. If WCAG already mandates a pattern, follow WCAG — do not invent an MX equivalent.

**In practice:** A well-built MX page is also a well-built SEO page, a well-built accessible page, and a well-built GEO page. The standards reinforce each other. MX is the final layer that adds machine governance on top of an already-solid foundation.

---

## Core Principle: No Duplication

Every meta tag must contribute information that is not already present elsewhere in the HTML. If a tag restates what the DOM, Schema.org JSON-LD, HTTP headers, or another meta tag already says, remove it. Duplication wastes agent context windows and creates maintenance drift — the two values will eventually disagree.

**The test:** For each tag, ask: "If I remove this, does the agent lose information it cannot get from another source on this page?" If the answer is no, remove the tag.

---

## The Meta Tag Stack

Tags are listed in the order they should appear in `<head>`. Each section states whether it is required, recommended, or optional.

### Layer 1: Document Fundamentals (Required)

Every HTML page must include these. No exceptions.

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Title — Site Name</title>
<meta name="description" content="One sentence. Maximum 160 characters. Substantive, not restating the title.">
<meta name="author" content="Tom Cranstoun">
<link rel="canonical" href="https://allabout.network/path/to/page.html">
```

**Rules:**

- `viewport` must never include `user-scalable=no`. Preventing zoom is an accessibility violation (WCAG 1.4.4). Omit `user-scalable` entirely — the browser default is `yes`, and including it explicitly triggers linting warnings in Edge DevTools.
- `description` must differ from `title`. If they say the same thing, the description is redundant.
- `canonical` must be the full absolute URL, not a relative path.
- `author` is the human author, not the AI assistant.
- `lang="en-GB"` goes on the `<html>` element, not as a meta tag.

### Layer 2: Open Graph (Required for Public Pages)

Open Graph tags control how the page appears when shared on social platforms. AI agents also read these for page summaries.

```html
<meta property="og:type" content="article">
<meta property="og:url" content="https://allabout.network/path/to/page.html">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Same as meta description.">
<meta property="og:image" content="https://allabout.network/images/page-card.jpg">
<meta property="og:image:alt" content="Description of what the image shows.">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="allabout.network">
<meta property="og:locale" content="en_GB">
```

**Rules:**

- `og:image:alt` is mandatory. Never publish an Open Graph image without alt text.
- `og:description` should match `<meta name="description">`. One source of truth for the page summary.
- Use `og:type` values that match the content: `article` for blog posts, `website` for landing pages, `product` for product pages.
- For articles, add `article:published_time` and `article:author`:

```html
<meta property="article:published_time" content="2026-03-04">
<meta property="article:author" content="Tom Cranstoun">
```

### Layer 3: Twitter Card (Required for Public Pages)

Intentional redundancy — some platforms read only Twitter Card tags, not Open Graph. This is acceptable duplication.

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Same as meta description.">
<meta name="twitter:image" content="https://allabout.network/images/page-card.jpg">
<meta name="twitter:image:alt" content="Description of what the image shows.">
<meta name="twitter:site" content="@tomcranstoun">
```

**Rules:**

- `twitter:image:alt` is mandatory.
- `twitter:url` is unnecessary — Twitter reads the canonical URL from the page. Do not include it.

### Layer 4: Robots and Discovery (Recommended)

```html
<meta name="robots" content="index, follow">
<link rel="llms-txt" href="/llms.txt">
```

**Rules:**

- Only include `robots` if the value differs from the default (`index, follow`). If you want the default behaviour, omit the tag entirely.
- Use `<link rel="llms-txt">` (not `<meta name="llms-txt">`). Link elements are the standard mechanism for pointing to related resources.
- Do NOT include `<meta name="keywords">`. No major search engine or AI agent uses this tag. It is noise.

### Layer 5: MX Carrier Tags (Required for MX Ecosystem Pages)

MX carrier tags identify the page within the MX ecosystem. They follow the `mx:` namespace defined by The Gathering.

```html
<meta name="mx:status" content="active">
<meta name="mx:contentType" content="blog-post">
```

**Required MX tags:**

| Tag | Values | Purpose |
| --- | --- | --- |
| `mx:status` | `draft`, `active`, `published`, `deprecated` | Page lifecycle state |
| `mx:contentType` | `blog-post`, `article`, `product`, `guide`, `reference`, `landing-page`, `document` | What this page is |

**Optional MX tags (include only when the value is meaningful for this specific page):**

| Tag | Values | Purpose |
| --- | --- | --- |
| `mx:category` | `mx-core`, `capability`, `integration`, content-specific category | Domain classification |
| `mx:tags` | Comma-separated kebab-case identifiers | Discovery keywords |
| `mx:partOf` | Collection or suite name | Parent relationship |
| `mx:audience` | `humans`, `ai-agents`, `developers`, `investors` | Target reader |
| `mx:content-policy` | `extract-with-attribution`, `summaries-allowed`, `no-extraction` | Per-page content usage rules for AI agents |
| `mx:attribution` | `required`, `preferred`, `not-required` | Whether citing this page requires attribution |

**Critical rule: MX tags must match the content.**

Do NOT copy-paste a standard block of MX tags onto every page. Each tag value must reflect the actual page:

- A blog post about MX principles is `mx:contentType="blog-post"`, NOT `mx:contentType="document"`
- A blog post is NOT `mx:partOf="mx-os"` — it is not part of the operating system
- A blog post's tags should describe its content, NOT be `mx:tags="tool"`
- If a tag does not apply to this page, omit it

**Wrong (copy-pasted boilerplate):**

```html
<meta name="mx:category" content="mx-tools">
<meta name="mx:status" content="active">
<meta name="mx:contentType" content="document">
<meta name="mx:tags" content="tool">
<meta name="mx:partOf" content="mx-os">
```

**Correct (content-specific):**

```html
<meta name="mx:status" content="published">
<meta name="mx:contentType" content="blog-post">
<meta name="mx:tags" content="machine-experience, metadata, ai-agents">
```

### Layer 6: Schema.org JSON-LD (Required for Content Pages)

Structured data is the primary mechanism for communicating facts to AI agents. Use the most specific Schema.org type that matches the content.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Page Title",
  "description": "Same as meta description.",
  "author": {
    "@type": "Person",
    "name": "Tom Cranstoun",
    "url": "https://allabout.network"
  },
  "datePublished": "2026-03-04",
  "dateModified": "2026-03-04",
  "inLanguage": "en-GB",
  "url": "https://allabout.network/path/to/page.html",
  "publisher": {
    "@type": "Organization",
    "name": "CogNovaMX Ltd"
  }
}
</script>
```

**Type selection:**

| Content | Schema.org Type |
| --- | --- |
| Blog post | `BlogPosting` |
| Technical article | `TechArticle` |
| FAQ page | `FAQPage` |
| Product page | `Product` |
| Event listing | `Event` |
| Book or appendix | `Book` or `Chapter` |
| Organisation page | `Organization` |
| Person page | `Person` |

**Rules:**

- `dateModified` and `datePublished` must match actual dates. These replace the need for any "freshness" meta tag.
- `author` in JSON-LD is the canonical author declaration. The `<meta name="author">` tag is a fallback for agents that do not parse JSON-LD.
- Do NOT duplicate JSON-LD facts in meta tags. If the author is in JSON-LD, that is sufficient.

### Layer 7: Stylesheets (Required)

```html
<link rel="stylesheet" href="/css/style.css">
```

**Rules:**

- External stylesheets only. Zero inline `style="..."` attributes in the `<body>`. Zero `<style>` blocks in the `<body>`. See Appendix D Part 13 for rationale.
- If an element must start hidden and be revealed by JavaScript, use a CSS class (e.g. `.hidden { display: none; }`) rather than `style="display: none;"`.
- One `<style>` block in `<head>` is acceptable for critical CSS.

---

## Body Rules (Required)

These rules apply to markup within `<body>`. They affect accessibility, agent comprehension, and validator compliance.

### Zero Inline Styles

No `style="..."` attributes in `<body>`. Extract all presentation to CSS classes. This is not a suggestion — it is a hard rule.

**Common extraction patterns:**

| Inline style pattern | CSS class replacement |
| --- | --- |
| Layout containers (`max-width`, `margin: auto`) | `.container-narrow`, `.container-mid`, `.container-form` |
| Flex button groups (`display: flex; gap; justify-content`) | `.cta-group` |
| Form field wrappers (`margin-bottom`) | `.form-group` |
| Form inputs (`width: 100%; padding; border; font-family`) | `.form-group input/select/textarea` |
| Button variants (`background-color; color`) | `.hero__cta--secondary`, `.btn-full` |
| List indentation (`margin-left; line-height`) | `.list-indented`, `.list-spaced` |
| Section padding (`padding; border-radius`) | `.section--padded` |
| Card variants (`border; background-color`) | `.card--plain`, `.card--highlight`, `.card--hero` |
| Text utilities (`color; font-size; white-space`) | `.text-muted`, `.text-sm`, `.text-lead`, `.nowrap` |

**The test:** Search the HTML file for `style="`. If the count is not zero, extract the remaining inline styles to CSS classes before publishing.

**Exceptions:** SVG `style` attributes within `<svg>` elements (stop-color, fill, etc.) are acceptable — these are part of SVG's native styling model.

### Form Elements

Every `<select>`, `<input>`, and `<textarea>` must have an accessible name. Use one of these mechanisms (in order of preference):

1. **`<label for="id">`** — a visible label element associated by `for`/`id` pairing
2. **`aria-label`** — when a visible label is impractical (e.g. filter dropdowns)
3. **`title`** — fallback for user agents that do not support ARIA

For filter dropdowns without visible labels, use both `aria-label` and `title`:

```html
<select id="filter-category" aria-label="Filter by category" title="Filter by category">
  <option value="">All Categories</option>
</select>
```

**Rules:**

- Every `<select>` must have an accessible name. Validators flag elements without one.
- The first `<option>` should describe the purpose (e.g. "All Categories", "Select a country") — this also serves as a visible label for sighted users.
- Do not rely on placeholder text alone for `<input>` elements — placeholders disappear on focus.

---

## Deprecated Tags — Do NOT Include

These tags duplicate information available from other sources. Do not include them.

| Deprecated Tag | Why It Is Redundant | Replacement |
| --- | --- | --- |
| `ai-preferred-access="html"` | Redundant. If you are serving HTML, it is self-evident. | Remove entirely. |
| `ai-freshness="monthly"` | Duplicates HTTP `Cache-Control` headers and Schema.org `dateModified`. | Use `dateModified` in JSON-LD. |
| `ai-structured-data="json-ld"` | Self-evident. The JSON-LD `<script>` block is present on the page. | Remove entirely. |
| `ai-content-policy` (with `ai-` prefix) | Belongs in `mx:` namespace. | Use `mx:content-policy` if per-page policy is needed. |
| `ai-attribution` (with `ai-` prefix) | Belongs in `mx:` namespace. | Use `mx:attribution` if attribution is required. |
| `<meta name="llms-txt">` | Meta tags are for metadata. Resource links use `<link>`. | Use `<link rel="llms-txt" href="/llms.txt">`. |
| `<meta name="keywords">` | No search engine or AI agent uses this tag. | Remove entirely. |
| `<meta name="X-Robots-Tag">` | This is an HTTP header, not a meta tag. | Configure on the server. |
| `<meta name="theme-color">` | Browser chrome colour. Not relevant to AI agents or MX. Not supported by Firefox or Opera. | Remove. If needed for a PWA, add it in the web app manifest instead. |

**If you encounter `ai-*` tags in existing pages:**

1. Remove `ai-preferred-access`, `ai-freshness`, `ai-structured-data` — they are unnecessary.
2. Use `mx:content-policy` with the same value (the `ai-content-policy` form is deprecated).
3. Use `mx:attribution="required"`. The `text="..."` attribute is unnecessary — the Schema.org author field provides the attribution text.
4. Use `<link rel="llms-txt" href="/llms.txt">` (the `<meta name="llms-txt">` form is incorrect).

---

## Complete Template

Copy this template for new pages. Replace all placeholder values with content-specific values.

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE — SITE NAME</title>
  <meta name="author" content="Tom Cranstoun">
  <meta name="description" content="ONE SENTENCE SUMMARY. MAX 160 CHARS.">
  <link rel="canonical" href="https://allabout.network/PATH">

  <!-- Open Graph -->
  <meta property="og:type" content="TYPE">
  <meta property="og:url" content="https://allabout.network/PATH">
  <meta property="og:title" content="PAGE TITLE">
  <meta property="og:description" content="SAME AS META DESCRIPTION">
  <meta property="og:image" content="https://allabout.network/images/CARD.jpg">
  <meta property="og:image:alt" content="IMAGE DESCRIPTION">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="SITE NAME">
  <meta property="og:locale" content="en_GB">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="PAGE TITLE">
  <meta name="twitter:description" content="SAME AS META DESCRIPTION">
  <meta name="twitter:image" content="https://allabout.network/images/CARD.jpg">
  <meta name="twitter:image:alt" content="IMAGE DESCRIPTION">
  <meta name="twitter:site" content="@tomcranstoun">

  <!-- Discovery -->
  <link rel="llms-txt" href="/llms.txt">

  <!-- MX Carrier (only tags that apply to THIS page) -->
  <meta name="mx:status" content="STATUS">
  <meta name="mx:contentType" content="CONTENT-TYPE">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SCHEMA_TYPE",
    "headline": "PAGE TITLE",
    "description": "SAME AS META DESCRIPTION",
    "author": {
      "@type": "Person",
      "name": "Tom Cranstoun",
      "url": "https://allabout.network"
    },
    "datePublished": "YYYY-MM-DD",
    "dateModified": "YYYY-MM-DD",
    "inLanguage": "en-GB",
    "url": "https://allabout.network/PATH",
    "publisher": {
      "@type": "Organization",
      "name": "CogNovaMX Ltd"
    }
  }
  </script>

  <link rel="stylesheet" href="/css/style.css">
</head>
```

---

## Checklist Before Publishing

1. Does `viewport` omit `user-scalable=no`? (Accessibility — browser defaults to `yes`)
2. Does every tag contribute unique information? (No duplication test)
3. Do MX carrier tags match this specific page's content? (No boilerplate)
4. Does `og:image:alt` and `twitter:image:alt` describe the image? (Accessibility)
5. Does `description` differ from `title`? (Substantive test)
6. Are dates in JSON-LD accurate? (Freshness)
7. Is the Schema.org type the most specific match? (Type selection)
8. Are there zero `ai-*` prefixed tags? (Deprecated)
9. Are there zero `theme-color` meta tags? (Deprecated)
10. Are there zero inline styles in `<body>`? (CSS separation)
11. Does every `<select>` and `<input>` have an accessible name? (Form accessibility)

---

## Cross-References

| Document | Purpose |
| --- | --- |
| `mx-canon/ssot/fields.cog.md` | All field definitions, types, valid values |
| `mx-canon/ssot/mx-html-writing-guide.cog.md` | This document — the HTML writing SSOT |
| `mx-canon/mx-maxine-lives/mx-metadata-conventions.cog.md` | Embrace-and-extend philosophy, block mapping |
| `mx-canon/mx-the-gathering/namespace-extensions.cog.md` | Namespace policy (standard, mx:, x-mx-, x-mx-p-) |
| `datalake/manuscripts/mx-books/mx-appendices/appendix-d-ai-friendly-html-guide.md` | Prescriptive HTML patterns for AI agents |
| `datalake/manuscripts/mx-books/mx-appendices/appendix-l-proposed-ai-metadata-patterns.md` | Namespace architecture proposal (to be revised to match this SSOT) |
