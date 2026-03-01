---
title: "Common Page Patterns Demo Site"
description: "Production-ready HTML files demonstrating eight common page patterns for AI-friendly web design"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Common Page Patterns Demo Site

This directory contains production-ready HTML files demonstrating eight common page patterns for AI-friendly web design.

## Files in This Directory

### HTML Pages (8 complete examples)

1. **index.html** - Home Page
   - WebSite schema with search action
   - Navigation structure and value propositions
   - Audience segmentation cards
   - Call-to-action sections

2. **about.html** - About Page
   - Person/AboutPage schema
   - Project background and mission
   - Author credentials and contact information

3. **contact.html** - Contact Page
   - ContactPage schema with contact options
   - Multiple contact methods with response times
   - Explicit contact type attributes

4. **sales.html** - Sales Page
   - Product schema with offer information
   - Pricing and availability
   - Feature highlights and benefits

5. **collection.html** - Collection Page
   - CollectionPage with ItemList schema
   - 10 curated appendices organized by category
   - Card-based navigation with descriptions

6. **consulting.html** - Consulting Service Page
   - Service schema with provider details
   - Three service tiers (self-service, professional, agency)
   - Process steps and pricing information

7. **blog-post.html** - Blog Post Page
   - BlogPosting schema with temporal metadata
   - Article structure with semantic HTML
   - Author bio and related posts

8. **article.html** - Technical Article Page
   - TechArticle schema with proficiency level
   - Sticky table of contents
   - Code examples and information boxes
   - Two-column layout (TOC + content)

### Supporting Files

- **sitemap.xml** - XML sitemap for search engine discovery
- **llms.txt** - AI agent discovery file with curated links
- **README.md** - This file

## Key Features

All pages include:

- ✅ Semantic HTML5 structure (`<main>`, `<article>`, `<section>`, `<nav>`)
- ✅ Schema.org JSON-LD appropriate to page type
- ✅ AI-specific meta tags (proposed patterns from Chapter 11)
- ✅ WCAG 2.1 AA compliant styling (4.5:1 contrast minimum)
- ✅ Explicit state attributes (`data-*`, `aria-*`)
- ✅ Responsive design with mobile breakpoints
- ✅ Floating navigation (Home, Back to Top)
- ✅ British English throughout

## Deployment

To deploy this site:

1. **Upload all files** to your web server root or subdirectory
2. **Configure MIME types** (optional but recommended):
   - `.html` → `text/html; charset=utf-8`
   - `.txt` → `text/plain; charset=utf-8`
   - `.xml` → `application/xml; charset=utf-8`

3. **Update URLs** in the following files:
   - Change `https://allabout.network/invisible-users/web/site/` to your domain
   - Files to update: all HTML files (Schema.org URLs), sitemap.xml, llms.txt

4. **Test accessibility:**
   - Verify llms.txt at `https://yourdomain.com/llms.txt`
   - Verify sitemap.xml at `https://yourdomain.com/sitemap.xml`
   - Test all links work correctly

## Customization

To adapt these pages for your own use:

1. **Replace content** with your own text (keep the HTML structure)
2. **Update Schema.org JSON-LD** with your information
3. **Adjust styles** to match your brand (CSS is inline in each file)
4. **Modify meta tags** to reflect your content policy
5. **Keep semantic structure** and data attributes for AI compatibility

## Documentation

Complete documentation for these patterns is available in:

- **Appendix K: Common Page Patterns** - The source appendix with detailed explanations
- **Appendix D: AI-Friendly HTML Guide** - Comprehensive patterns and best practices (~9,050 words)
- **Appendix A: Implementation Cookbook** - Quick-reference code snippets
- **Chapter 12: Technical Advice** - Implementation patterns and testing strategies

## Source

These pages are examples from:

**The Invisible Users: Designing the Web for AI Agents and Everyone Else**
By Tom Cranstoun
<https://allabout.network/invisible-users>

## Licence

These example pages are provided for educational purposes. You may copy, adapt, and deploy them in production websites without attribution (though attribution is appreciated).

## Contact

For questions about these patterns:

- **Email:** <tom.cranstoun@gmail.com>
- **Website:** <https://allabout.network>
- **GitHub:** <https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-manuscript>
