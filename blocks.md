---
title: "EDS Blocks Standards Compliance"
description: "Executive summary of production-breaking violations and compliance status for EDS blocks"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

EDS Blocks Standards Compliance - Executive Summary

Production-breaking violations
showcaser - Reserved class, inline CSS → CSS classes
blogroll - Reserved class .blogroll-wrapper → .blogroll
hero - Reserved class .hero-wrapper → .hero
index - Added INDEX_CONFIG, documented INTENTIONAL globals
returntotop - Inline CSS → CSS classes, added CONFIG
floating-alert - Inline CSS → CSS custom properties
dashboard - Added DASHBOARD_CONFIG, documented INTENTIONAL globals

bio - Added BIO_CONFIG, fixed reserved class, documented INTENTIONAL meta selector
inline-svg - Added INLINE_SVG_CONFIG, fixed reserved class → variation pattern
fragment - Added FRAGMENT_CONFIG, fixed reserved class and global selector
header - Added HEADER_CONFIG, removed inline CSS (body scroll control)
dam - Fixed reserved class (already had CONFIG)
code-expander - Documented INTENTIONAL globals (already had CONFIG)
dfs - Documented INTENTIONAL globals, deferred inline CSS refactoring
tags - Added TAGS_CONFIG, fixed global selector

MEDIUM PRIORITY (single-violation blocks)
text, dynamic, bloglist, embed, modal, slide-builder, footer
Then: Phases 4-5 to add CONFIG objects to remaining 25-50 blocks

INTENTIONAL Global Selectors - Legitimate uses:
Document-level components (header, index, showcaser)
Meta tags (document <head> elements)

Modals/tooltips (document body positioning)
Reserved Class Patterns - Never use:
.{blockname}-wrapper (EDS auto-generates)
.{blockname}-container (EDS auto-generates)
Inline CSS Alternatives:
CSS classes with classList.add/remove
CSS custom properties element.style.setProperty('--var', value)
CSS transitions for animations
