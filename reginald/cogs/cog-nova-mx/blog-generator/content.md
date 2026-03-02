---
name: blog-generator
version: "1.0.0"
description: "Generates, converts, and updates blog posts for allabout.network in both EDS markdown and MX HTML formats."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, env]
buildsOn: [what-is-a-cog, what-is-mx-os, env]
tags: [blog, content, publishing, eds, html, allabout, writing, action]

audience: both
readingLevel: technical
purpose: Give any AI agent the procedure to create professional blog posts for allabout.network — covering both the EDS markdown format (Tom's ddt blog) and the MX HTML format (direct HTML in blogs/mx/)

contentType: "action-doc"
runbook: "mx exec blog-generator"
execute:
  runtime: runbook
  command: mx blog
  policy: |
    Read env.cog.md from the repository root BEFORE generating any content.
    Use values from env.cog.md for all hostnames, URLs, author details, and paths.
    Never hardcode allabout.network or any URL that appears in env.cog.md.
    Write in Tom's voice: first-person, conversational, British English, no exaggeration.
    Never use words like "exciting", "amazing", "revolutionising".
    Never put version numbers in filenames.
    Use British date format (11 February 2026) in prose, ISO (2026-02-11) in metadata.
    No emojis unless the user explicitly requests them.
    Always include co-authorship credit when AI contributes.
  actions:
    - name: create
      description: Generate a new blog post in EDS markdown or MX HTML format
      usage: |
        ## Mode Selection

        If invoked with --interactive (or no flags), interview the user first:
          1. What is the topic?
          2. Who is the audience? (developers, business, CMS professionals, general)
          3. What format? (eds or mx)
          4. What tone? (thought leadership, technical tutorial, news analysis, opinion)
          5. Key points to cover? (bullet list)
          6. Any links to reference or include?
          7. Is this public-safe or does it contain internal MX details?

        If invoked with --quick, expect these inputs directly.

        ## EDS Blog Generation

        Output path: mx-canon/mx-maxine-lives/communications/blogs/md/{slug}-blog.md
        URL pattern: https://allabout.network/blogs/ddt/{slug}

        Template:
        ```
        # {Title}

        | bio | |
        | :---- | :---- |
        | Picture Here | {One-sentence hook that captures the thesis.} |

        | index |
        | :---- |

        ## {Section 1 Heading}

        {Content — first-person, conversational, British English.}

        ## {Section 2 Heading}

        {Content continues...}

        ---

        Follow me on [LinkedIn](https://www.linkedin.com/in/tom-cranstoun/) or visit [allabout.network](https://allabout.network) for more.

        ---

        | fragment |
        | :---- |
        | /fragments/ddt/proposition |

        | Section metadata | |
        | :---- | :---- |
        | style | bg-dark |

        ---

        Related Articles

        | Blogroll |
        | :---- |

        ##

        | Blogroll (compact) |
        | :---- |

        |remove-icon-styles|
        | :---- |

        | code-expander |
        | :---- |

        | returntotop |
        | :---- |
        | Back to Top |

        | metadata | |
        | :---- | :---- |
        | title | {Title} |
        | description | {Description — 1-2 sentences, under 160 chars} |
        | jsonld | article |
        | image | |
        | author | Tom Cranstoun |
        | longdescription | {3-4 sentence summary for SEO and social cards} |
        | LinkedIn | https://www.linkedin.com/in/tom-cranstoun/ |
        | publication-date | {DD/Mon/YYYY} |
        ```

        Rules for EDS blogs:
        - No YAML frontmatter (EDS uses the metadata table at the bottom)
        - Bio table is the first element after H1
        - Index table triggers EDS auto-generated table of contents
        - Fragment/blogroll/returntotop tables are required EDS blocks
        - All content between index and the closing tables is the article body
        - Use ## for major sections, ### for subsections
        - Separate major sections with --- (horizontal rules)
        - Tables use GFM syntax with :---- alignment markers

        Reference: mx-canon/mx-maxine-lives/communications/blogs/md/content-that-manages-itself-blog.md

        ## MX HTML Blog Generation

        Output path: mx-canon/mx-maxine-lives/communications/blogs/html/allabout/{slug}.html
        URL pattern: https://allabout.network/blogs/mx/{slug}.html
        Social card: mx-canon/mx-maxine-lives/communications/blogs/html/allabout/{slug}-social.svg
        Publish to host: npm run blog:publish -- {slug}

        The MX HTML template has 16 sections. Generate all of them:

        ```html
        <!DOCTYPE html>
        <html lang="en-GB">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <!-- 1. Blog State Tracking -->
          <meta name="blog-state" content="draft">
          <meta name="blog-draft-date" content="{YYYY-MM-DD}">
          <meta name="blog-review-date" content="">
          <meta name="blog-publication-date" content="">
          <meta name="blog-last-modified" content="{YYYY-MM-DD}">
          <meta name="blog-review-status" content="draft">

          <!-- 2. Content Metadata -->
          <meta name="author" content="{author}">
          <meta name="description" content="{description}">
          <meta name="keywords" content="{comma-separated keywords}">

          <!-- 3. Robots -->
          <meta name="robots" content="index, follow">
          <meta name="X-Robots-Tag" content="index, follow">
          <link rel="canonical" href="https://allabout.network/blogs/mx/{slug}.html">

          <!-- 4. Open Graph -->
          <meta property="og:type" content="article">
          <meta property="og:url" content="https://allabout.network/blogs/mx/{slug}.html">
          <meta property="og:title" content="{title}">
          <meta property="og:description" content="{description}">
          <meta property="og:image" content="https://allabout.network/blogs/mx/{slug}-social.svg">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:site_name" content="AllAbout.Network">
          <meta property="article:published_time" content="{YYYY-MM-DD}">
          <meta property="article:author" content="{author}">

          <!-- 5. Twitter Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:url" content="https://allabout.network/blogs/mx/{slug}.html">
          <meta name="twitter:title" content="{title}">
          <meta name="twitter:description" content="{description}">
          <meta name="twitter:image" content="https://allabout.network/blogs/mx/{slug}-social.svg">

          <!-- 6. AI Meta Tags -->
          <meta name="sop-preferred-access" content="html">
          <meta name="sop-content-policy" content="extract-with-attribution">
          <meta name="sop-freshness" content="monthly">
          <meta name="sop-structured-data" content="schema.org-jsonld">
          <meta name="sop-attribution" content="required" text="Source: {title} by {author}, https://allabout.network/blogs/mx/{slug}.html">
          <meta name="llms-txt" content="/llms.txt">

          <title>{title} | {author}</title>

          <!-- 7. Schema.org JSON-LD -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "{title}",
            "description": "{description}",
            "datePublished": "{YYYY-MM-DD}",
            "dateModified": "{YYYY-MM-DD}",
            "author": {
              "@type": "Person",
              "name": "{author}",
              "url": "https://www.linkedin.com/in/tom-cranstoun/",
              "image": "https://allabout.network/media_126e99d56f06caf788bee715aff92281d2e31a206.png"
            },
            "publisher": {
              "@type": "Organization",
              "name": "AllAbout.Network",
              "url": "https://allabout.network"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://allabout.network/blogs/mx/{slug}.html"
            },
            "articleSection": "Machine Experience",
            "keywords": [{keywords-as-json-array}],
            "wordCount": {word-count},
            "inLanguage": "en-GB"
          }
          </script>

          <!-- 8. Stylesheet -->
          <link rel="stylesheet" href="shared-mx.css">
        </head>
        <body>
          <!-- 9. Skip Link -->
          <a href="#main" class="skip-link">Skip to main content</a>

          <!-- 10. Blog Introduction -->
          <aside class="blog-introduction"
                 aria-label="Blog introduction"
                 data-component="blog-header">
            <div class="introduction-content">
              <a href="about.tom.cranstoun.html" aria-label="View Tom Cranstoun's profile">
                <img src="https://allabout.network/media_126e99d56f06caf788bee715aff92281d2e31a206.png"
                     alt="Tom Cranstoun profile picture"
                     class="author-image"
                     width="80"
                     height="80">
              </a>
              <div class="introduction-text">
                <div class="introduction-message">{one-sentence hook}</div>
                <div class="author-name">Author: <strong>{author}</strong></div>
              </div>
            </div>
          </aside>

          <!-- 11. Table of Contents -->
          <details id="index" class="table-of-contents" data-state="initially-collapsed">
            <summary>Index</summary>
            <nav aria-label="Table of contents">
              <ul>
                <!-- One <li><a href="#heading-id">Heading Text</a></li> per h2 -->
              </ul>
            </nav>
          </details>

          <!-- 12. Main Article -->
          <main id="main" tabindex="-1">
            <article data-article-type="blog-post" data-word-count="{word-count}">
              <header>
                <h1>{title}</h1>
                <div class="article-meta"
                     data-published="{YYYY-MM-DD}"
                     data-modified="{YYYY-MM-DD}"
                     data-reading-time="{N} min">
                  <time datetime="{YYYY-MM-DD}">{DD Month YYYY}</time>
                  <span>&middot;</span>
                  <span>{N} min read</span>
                </div>
              </header>

              <!-- Article content as semantic HTML -->
              <!-- h2 ids use kebab-case with tabindex="-1" -->
              <!-- Separate major sections with <hr> -->

              <!-- 13. Author Bio -->
              <aside class="author-bio-link" aria-label="About the author">
                <hr>
                <p><strong>About the author:</strong> <a href="about.tom.cranstoun.html">Tom Cranstoun</a> has been building content systems since 1977, specializing in Adobe Experience Manager, Edge Delivery Services, and Machine Experience (MX) strategic advisory.</p>
              </aside>
            </article>
          </main>

          <!-- 14. Back to Top -->
          <a href="#" class="back-to-top" aria-label="Back to top">
            Back to Top
          </a>

          <!-- 15. Footer -->
          <footer>
            <p>&copy; Tom Cranstoun. All rights reserved.</p>
          </footer>
        </body>
        </html>
        ```

        Rules for MX HTML blogs:
        - All 16 sections are mandatory
        - All heading IDs use kebab-case with tabindex="-1"
        - Table of contents links match heading IDs exactly
        - word-count and reading-time must be calculated from the content
        - Reading time = word count / 200, rounded to nearest minute
        - blog-state starts as "draft" — updated via the update action
        - No inline CSS — shared-mx.css handles all styling
        - All images need alt text (WCAG 2.1 AA)
        - Use semantic HTML: <article>, <aside>, <nav>, <header>, <footer>, <main>

        ## Social Card SVG Generation (MX only)

        Generate a simple SVG social card (1200x630) at {slug}-social.svg:
        - White background
        - Title text centred, dark colour, max 3 lines
        - "allabout.network" bottom-left, small
        - Author name bottom-right, small
        - Clean, minimal — no gradients or complex graphics

        ## Post-Generation Checklist

        After generating either format:
        1. Confirm no internal MX details leaked (if user flagged public-safe)
        2. Confirm British English throughout (whilst, colour, organisation)
        3. Confirm no exaggeration or superlatives
        4. Count words and calculate reading time
        5. Present the file path and a summary of what was generated
      inputs:
        - name: format
          type: string
          required: true
          description: "Blog format: 'eds' for EDS markdown or 'mx' for MX HTML"
        - name: topic
          type: string
          required: true
          description: "Topic or title for the blog post"
        - name: mode
          type: string
          required: false
          description: "'interactive' (interview first, default) or 'quick' (generate directly from inputs)"
        - name: audience
          type: string
          required: false
          description: "Target audience: developers, business, cms-professionals, general"
        - name: tone
          type: string
          required: false
          description: "Writing tone: thought-leadership, technical, news-analysis, opinion"
        - name: key-points
          type: array
          required: false
          description: "Bullet points of key arguments or sections to cover"
        - name: references
          type: array
          required: false
          description: "URLs to link to or draw insights from"
        - name: public-safe
          type: boolean
          required: false
          description: "If true, verify no internal MX details (cogs, MX OS architecture, advisory board) appear"
      outputs:
        - name: blog-file
          type: file
          description: "The generated blog post file"
        - name: social-card
          type: file
          description: "Social card SVG (MX format only)"

    - name: convert
      description: Convert a blog post between EDS markdown and MX HTML formats
      usage: |
        ## EDS to MX Conversion

        1. Read the source EDS markdown file
        2. Extract content:
           - Title from the H1 heading
           - Hook from the bio table second cell
           - Description from the metadata table
           - Long description from the metadata table
           - Publication date from the metadata table
           - Article body (everything between index table and closing tables)
        3. Parse the markdown body into semantic HTML:
           - ## headings become <h2 id="kebab-case" tabindex="-1">
           - ### headings become <h3 id="kebab-case" tabindex="-1">
           - **bold** becomes <strong>
           - [links](url) become <a href="url">
           - Numbered lists become <ol><li>
           - Bullet lists become <ul><li>
           - Tables become <table> with <thead> and <tbody>
           - Blockquotes become <blockquote>
           - Code blocks become <pre><code>
           - --- becomes <hr>
           - Paragraphs become <p>
        4. Generate the full MX HTML template using the create action's MX template
        5. Build the table of contents from all h2 headings
        6. Calculate word count and reading time
        7. Generate the social card SVG
        8. Save to mx-canon/mx-maxine-lives/communications/blogs/html/allabout/{slug}.html
        9. Tell the user: run `npm run blog:publish -- {slug}` to deploy to allaboutv2

        ## MX to EDS Conversion

        1. Read the source MX HTML file
        2. Extract content:
           - Title from <h1>
           - Hook from .introduction-message
           - Description from meta[name="description"]
           - Long description from JSON-LD description
           - Publication date from <time> element
           - Article body from <article> inner HTML
        3. Convert HTML to markdown:
           - <h2> becomes ##
           - <h3> becomes ###
           - <strong> becomes **bold**
           - <a href="url">text</a> becomes [text](url)
           - <ol><li> becomes numbered lists
           - <ul><li> becomes bullet lists
           - <table> becomes GFM tables
           - <blockquote> becomes >
           - <pre><code> becomes fenced code blocks
           - <hr> becomes ---
           - <p> becomes plain paragraphs with blank lines
        4. Wrap in the EDS template (bio table, index table, metadata table, EDS blocks)
        5. Save to mx-canon/mx-maxine-lives/communications/blogs/md/{slug}-blog.md

        Rules:
        - Preserve all links and references
        - Maintain heading hierarchy
        - Convert dates between formats (DD/Mon/YYYY for EDS, YYYY-MM-DD for MX)
        - Report any content that could not be cleanly converted
      inputs:
        - name: source
          type: string
          required: true
          description: "Path to the source blog file to convert"
        - name: target-format
          type: string
          required: true
          description: "'eds' to convert to EDS markdown, 'mx' to convert to MX HTML"
      outputs:
        - name: converted-file
          type: file
          description: "The converted blog post in the target format"
        - name: social-card
          type: file
          description: "Social card SVG (only when converting to MX format)"

    - name: update
      description: Refresh metadata, dates, and state on an existing blog post
      usage: |
        1. Read the existing blog file (detect format from extension: .md = EDS, .html = MX)

        2. For EDS markdown blogs:
           - Update the metadata table at the bottom of the file
           - Recalculate word count if content changed
           - Update publication-date if moving from draft to published

        3. For MX HTML blogs:
           - Update blog-state meta tag (draft -> review -> published)
           - Update the corresponding date meta tag:
             - blog-draft-date when state = draft
             - blog-review-date when state = review
             - blog-publication-date when state = published
           - Update blog-last-modified to today
           - Update blog-review-status to match blog-state
           - Update dateModified in JSON-LD
           - Update data-modified on article-meta div
           - Recalculate data-word-count and data-reading-time if content changed

        4. Present summary:
           - File: {path}
           - Format: EDS/MX
           - Previous state: {old}
           - New state: {new}
           - Fields updated: {list}
      inputs:
        - name: file
          type: string
          required: true
          description: "Path to the blog file to update"
        - name: state
          type: string
          required: false
          description: "New state: 'draft', 'review', or 'published'"
      outputs:
        - name: update-report
          type: string
          description: "Summary of what was updated"
---

# Blog Generator

An action-doc that creates, converts, and updates blog posts for allabout.network.

---

## Why This Exists

Tom publishes in two formats on allabout.network. The EDS blog (under `/blogs/ddt/`) uses Adobe Edge Delivery Services with markdown files and EDS-specific table formatting. The MX blog (under `/blogs/mx/`) uses hand-crafted HTML with comprehensive metadata, WCAG accessibility, and AI-specific meta tags.

Both formats have rigid templates. Getting them wrong means broken rendering, missing social cards, or failed SEO. This cog captures both templates as a repeatable procedure so any AI agent can generate professional blog posts without memorising the formats.

---

## Two Formats, One Voice

| Aspect | EDS Blog | MX Blog |
|--------|----------|---------|
| Format | Markdown with EDS tables | Semantic HTML |
| Location (QA) | `mx-canon/mx-maxine-lives/communications/blogs/md/` | `mx-canon/mx-maxine-lives/communications/blogs/html/allabout/` |
| Location (Published) | EDS auto-deploys | `allaboutv2/blogs/mx/` (via `npm run blog:publish`) |
| URL | `/blogs/ddt/{slug}` | `/blogs/mx/{slug}.html` |
| Styling | EDS stylesheet (automatic) | `shared-mx.css` (linked) |
| Metadata | Bottom metadata table | Head meta tags + JSON-LD |
| TOC | EDS auto-generated from index table | HTML `<details>` collapsible |
| Accessibility | EDS default | WCAG 2.1 AA (skip link, ARIA, semantic landmarks) |
| AI tags | Not included | Full AI meta tags (proposed standard) |
| Social card | Not generated | SVG social card per post |
| State tracking | Not tracked | blog-state meta tags (draft/review/published) |

Both formats share the same voice: first-person, conversational, British English, no exaggeration, honest about trade-offs.

---

## The Pipeline

```
Draft (md)  →  QA (html in brain)  →  Published (allaboutv2)
   brain/md/       brain/html/allabout/     allaboutv2/blogs/mx/
```

Three stages, three scripts, zero inference tax:

| Command | What it does |
|---------|-------------|
| `npm run blog:status` | Show what's in each stage |
| `npm run blog:qa` | Validate HTML, check md→html coverage |
| `npm run blog:publish` | Copy approved HTML from brain to allaboutv2 |

The brain holds the full archive. allaboutv2 receives only the published output.

---

## Actions

**create** — Generate a new blog post. Supports interactive mode (interview the user about topic, audience, tone) or quick mode (accept inputs directly). Outputs to the brain: md to `blogs/md/`, html to `blogs/html/allabout/`.

**convert** — Transform between formats. EDS markdown to MX HTML or vice versa. Preserves content, converts structure, generates missing metadata. Output stays in the brain.

**update** — Refresh metadata on existing posts. Change state (draft to review to published), update dates, recalculate word count and reading time. Handles the different metadata locations for each format.

---

## Writing Style

The cog enforces Tom's writing conventions:

- **British English** — whilst, colour, organisation, honour
- **First-person** — "I've been working with..." not "The author has been working with..."
- **Conversational** — short sentences, active voice, direct address
- **No exaggeration** — professional tone, avoid "exciting", "amazing", "revolutionary"
- **Honest about complexity** — acknowledge trade-offs, unknowns, and limitations
- **No bare URLs** — wrap in markdown links or angle brackets
- **British dates in prose** — "11 February 2026" not "February 11, 2026"
- **ISO dates in metadata** — "2026-02-11"

---

## Reference Files

- **Project config:** `env.cog.md` (read this FIRST — all hostnames, URLs, author details, paths)
- **EDS template reference:** `mx-canon/mx-maxine-lives/communications/blogs/md/content-that-manages-itself-blog.md`
- **MX template reference:** `mx-canon/mx-maxine-lives/communications/blogs/html/allabout/data-sovereignty.html`
- **MX stylesheet:** `mx-canon/mx-maxine-lives/communications/blogs/html/allabout/shared-mx.css`
- **Writing style guide:** `.claude/skills/news/templates/blog-entry.md`
- **Tom's blog catalogue:** `allaboutv2/blogs/ddt/my-blog.json`

---

## For AI Agents

When asked to "write a blog post", "create a blog", or "generate a post for allabout":

1. **Read env.cog.md first** — get all hostnames, URLs, author details, and paths
2. Ask which format: EDS or MX (or both via convert)
3. Run **create** in interactive mode to gather requirements
4. Generate the file into the brain, resolving all values from env.cog.md
5. If the user wants both formats, run **convert** on the result
6. Run `npm run blog:qa` to validate the HTML
7. If the post is ready to publish, run `npm run blog:publish` to deploy to allaboutv2
8. Run `npm run blog:status` to confirm the pipeline state

The templates in the actions section are complete. Follow them exactly. The scripted pipeline handles all file operations — no inference needed for moving files between stages.

---

*Content that describes itself doesn't need a manager. But it still needs a writer.*
