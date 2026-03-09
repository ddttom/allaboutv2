---
name: principles
title: "MX Principles"
version: "3.0"
created: 2026-02-04
modified: 2026-03-04
author: Tom Cranstoun
description: "The principles that govern how MX builds things — for humans and machines alike"

mx:
  status: active
  contentType: info-doc
  category: mx-core
  tags: [principles, design, writing, metadata, accessibility, mx-os, standards-hierarchy]
  partOf: mx-ssot
  audience: [humans, machines]
  license: proprietary
---

# MX Principles

These are the rules we build by. Not guidelines. Not suggestions. Principles — the things that stay true even when everything else changes.

MX is the practice of making the web work for everyone and everything that uses it. Humans and machines, reading the same content, understanding it equally. These principles define how we get there.

They apply to every cog, every document, every script, every piece of work that carries the MX name.

---

## 1. Design for Both

Every design decision should work for humans AND machines. Not one at the expense of the other.

This is the founding principle. When we put YAML frontmatter on a markdown file, the YAML is for machines and the markdown is for humans. Same file. Both audiences served. When we hide configuration files with a dot prefix (`.mx.yaml`), humans get a clean workspace and machines get discoverable metadata. Both win.

The test is simple: does this decision help one audience while hurting the other? If yes, find a better decision.

YAML frontmatter in markdown passes the test. Mermaid diagrams fail it — they need a rendering engine for humans and an interpretation layer for machines. Neither audience is well served.

---

## 2. Metadata-Driven Architecture

Every piece of content should carry structured metadata that tells machines what it is, who it is for, and how it relates to everything else.

MX uses four layers: repository level (`.mx.yaml` at root), directory level (per-package metadata), file level (YAML frontmatter), and code level (`@mx:` annotations). Each layer adds context. Together they create a self-describing system where an AI agent can navigate as intelligently as a human.

The minimum: every file should declare its `purpose`, `audience`, and `stability`. Everything else builds from there.

---

## 3. Context Declaration

Files should say what context they provide and what context they need.

An AI agent encounters a file. Without context declaration, it has to guess what to read first. With `ai.contextProvides` and `ai.contextRequired` fields, the agent knows exactly what this file offers and what it needs to read before it can work effectively.

This creates a self-documenting dependency graph. No more "just ask Tom how this connects to that." The connections are in the metadata.

---

## 4. Universal Accessibility

Content must work for every type of AI agent — CLI tools that cannot run JavaScript, browser agents, server-based processors, IDE integrations with limited context windows.

The implication: plain text over proprietary formats. Markdown over Word. YAML over binary config. ASCII diagrams over rendered graphics. Semantic HTML with Schema.org structured data. Explicit relationships over implicit ones.

If it requires a specific rendering engine to understand, it fails this test.

---

## 5. Context-Preserving References

Links must still make sense when a document leaves its repository.

Documents get extracted. They become PDFs, blog posts, email attachments, AI context windows. A relative path like `../../datalake/knowledge/system/repo-philosophy.md` is meaningless outside the repo. The human cannot mentally reconstruct the folder tree. The machine cannot resolve the path.

The fix: every cross-document reference includes the document title and an absolute URL alongside the relative path. It works in the repo, in a PDF, in a chat window, everywhere.

In YAML frontmatter, paths must always be repo-root-relative. Never `../` navigation. `docs/reference/file.md`, not `../../docs/reference/file.md`.

---

## 6. Size-Neutral Documentation

Never hardcode counts in prose. They go stale instantly.

Write "the principles" not "twelve principles." Write "the cog ecosystem" not "thirty-five cogs." The moment someone adds a cog, every document that says "thirty-five" is wrong. Nobody updates them. The documentation lies.

Use specific numbers only when the number IS the information: WCAG requires 4.5:1 contrast. Node.js 20.x. Version 2.0. Everything else uses descriptive language that stays true regardless of what gets added or removed.

---

## 7. Executable Documentation

Documents should contain their own generation instructions.

The problem is documentation drift. The build instructions live in one place. The output paths live in another. The quality criteria live in someone's head. When these separate, they diverge. The README says "run X" but X changed six months ago.

MX embeds two fields directly in document metadata: `mx:runbook` (context injected whenever a machine reads the file) and `mx:deliverable` (complete generation instructions with output path). The document is self-executing. Everything needed to regenerate it lives inside it.

---

## 8. WCAG-Informed Design

Accessibility standards for disabled users provide proven patterns that also work for machines.

WCAG represents decades of research into making content accessible. Semantic HTML helps screen readers AND AI agents. Clear heading hierarchy helps keyboard navigation AND automated parsing. Proper contrast ratios help low-vision users (machines do not care about contrast — this one serves humans first, and that is fine).

The convergence is real: patterns optimised for disabled users consistently optimise for machine readability too. WCAG compliance is also the law in the US, UK, EU, and Canada. Following it is not optional.

---

## 9. Name Consistency for Related Files

Related files should share a base name. `blog-post.html`, `blog-post.css`, `blog-post-social.svg`. Not three different names that happen to be related.

Machines can inspect HTML to find linked stylesheets. Humans cannot. When a human sees three files with the same base name, the relationship is instant. When the names differ, the human has to open files and trace references. That is cognitive load we can eliminate.

The pattern: `{base-name}.{extension}` or `{base-name}-{descriptor}.{extension}`. Always.

---

## 10. Metadata Everywhere

Every artefact must carry its own metadata, and that metadata must survive format transformations.

Content moves: markdown becomes SVG, SVG becomes PNG, PNG goes into a PDF. Each transformation risks stripping metadata. A PDF without provenance metadata is a dead artefact — a machine cannot determine where it came from, what it contains, or whether it is current.

The fix: re-embed metadata at every transformation step. YAML frontmatter in markdown. XML metadata in SVG. XMP in PDF. HTML meta tags on web pages. The MX namespace (`https://allabout.network/mx/ns/1.0`) stays consistent across all formats.

Minimum metadata at every stage: what it is, where it came from, who made it, when, and why.

---

## 11. Consistent Attribute Placement

Every attribute has one canonical home. Version lives in YAML frontmatter, not filenames. Status lives in the `stability:` field, not a `-draft` suffix. Date lives in frontmatter and git history, not the filename.

When attributes are scattered across filenames, titles, body text, and metadata, they inevitably drift out of sync. The filename says v1, the frontmatter says v2, nobody knows which is current. One home per attribute eliminates this.

Filenames describe what a document IS. Frontmatter describes everything about it. Git tracks its full history. Nothing is duplicated. Nothing can disagree.

---

## 12. Folder SOUL.md Convention

Any folder representing a coherent body of work should have a `SOUL.md` — a control document that defines voice, constraints, and narrative.

Without it, folders drift. Twenty documents follow one tone. A twenty-first contradicts them all because the author (human or AI) did not know what the folder was trying to say.

The rule: on entering any folder, check for a `SOUL.md`. If present, read it before editing or creating any file. The SOUL defines the voice, the constraints, and the story. Everything in that folder must be consistent with it.

---

## 13. Write Like a Blog

The human-readable section of every cog should read like a well-written blog post. Informative, not technical. Editorial and authoritative. Storytelling and honest.

A cog has two sections: YAML frontmatter for machines and markdown for humans. If the markdown reads like a specification, both audiences are consuming the same dry, structured content — and neither is well served. The machine gets better value from structured YAML (it can actually parse that). The human gets better value from narrative prose (they can actually enjoy reading that).

This does not mean dumbing things down. A well-written Wired article is both accessible and deeply informed. Lead with the problem. Show the journey. Be candid about what works and what does not yet. Use short paragraphs and direct language. Tell the reader why this matters before you tell them how it works.

The test: could this section be published as a blog post that someone would actually want to read? If not, rewrite it.

This principle applies to all cogs. Even specifications. Especially specifications — because those are the documents most people avoid reading, and the ones that matter most.

---

## 14. Any Document Can Be a Cog

Any document can become a cog. Add YAML frontmatter and it is machine-readable. That is the whole barrier to entry.

But there is a cost equation hiding in that simplicity. When the metadata is strong — rich description, clear tags, explicit relationships — an AI agent reads the frontmatter and knows what to do. Twelve lines of context. Done. When the metadata is weak — just a name and a version — the agent has to read the entire document to understand what it is, what it relates to, and whether it matters. That is compute spent because the metadata was not strong enough to answer the question.

This is not a penalty. It is an incentive. A cog with three fields works. A cog with rich metadata works better and costs less to use. Every field you add to the frontmatter is a question an AI agent does not have to answer by reading your prose.

The rule: start with basic frontmatter — you have a cog. Then improve the metadata over time. Every improvement cuts compute.

---

## Use Existing Standards

Never invent when you can adopt. Every new convention is cognitive overload for humans — and we design for both.

Everything that benefits SEO, GEO (Generative Engine Optimisation), accessibility, and usability also benefits MX. These disciplines share a common goal: making web content explicit, structured, and unambiguous. MX builds on their foundations. Established web standards — HTML semantics, WCAG, Schema.org, Open Graph, Dublin Core, `robots.txt`, `sitemap.xml` — come first. MX adds governance and lifecycle metadata where those standards leave gaps. MX never duplicates or replaces what existing standards already provide. A well-built MX page is also a well-built SEO page, a well-built accessible page, and a well-built GEO page. The standards reinforce each other.

MX OS uses standards humans already know: Markdown, YAML, HTML meta tags, QR codes, git, OAuth, MIT licence. But this principle goes beyond technical formats. It means following human conventions too. `README.md`, `CONTRIBUTING.md`, `LICENSE`, and `CHANGELOG.md` live at the repo root because that is where humans expect to find them. Convention says where things belong.

This document (`principles.cog.md`) is Canon content and lives in `mx-canon/ssot/` — alongside the other single sources of truth. Canon wins the content and the location.

The rule: before creating anything new, ask whether a standard or convention already exists. If it does, use it. If it almost fits, extend it. Only if nothing exists do you invent — and then you document why.

---

## Cogs All the Way Down

There is an old story about a scientist giving a lecture on cosmology. Afterwards, an elderly woman tells him he is wrong — the world sits on the back of a giant turtle. "And what does the turtle stand on?" he asks. "It is turtles all the way down," she replies.

MX OS is cogs all the way down.

The machine describes itself with a cog (`$MX_HOME/mx-os-environment.cog.md`). The repository describes itself with cog-shaped metadata (CLAUDE.md, SOUL.md). The folder describes itself (SOUL.md). The document describes itself (YAML frontmatter). The script describes itself (comment-block metadata). The action-doc describes what it does AND does it (execute block).

Every level of the stack uses the same pattern: structured metadata for machines, readable prose for humans. Same format. Same principle. No special cases. The thing that contains cogs is itself a cog. The environment that hosts the registry is itself registered.

This is not cleverness. It is consistency. When every level speaks the same language, an AI agent can navigate from the machine to the metadata without learning a new format at each layer. One pattern, learned once, applied everywhere. Turtles — cogs — all the way down.

Don't panic. Read `$MX_HOME`.

---

## Output Introduces Itself

Every piece of machine-readable output from an MX tool must be self-describing.

When `mx-show.sh --json` produces a snapshot of running processes, it does not output a bare array. It wraps the data in an MX envelope: name, description, content type, source, version, timestamp, machine, user, and a runbook explaining exactly how the data was created. Any reader — human or AI — encountering this output for the first time knows what it is, where it came from, and how it was generated. No guessing. No out-of-band documentation needed.

This extends the founding principle of "the object introduces itself" from web objects to CLI output. A QR code on a coffee machine leads to a cog that introduces the machine. A JSON payload from a script carries metadata that introduces the payload. Same principle, same pattern, different medium.

The minimum envelope: `name`, `source`, `created`, and `runbook`. Everything else is valuable but optional. The runbook is the critical field — it turns opaque data into transparent data. It is the difference between "here are some numbers" and "here is what these numbers mean, how they were collected, and what was filtered out."

The rule: if a script or API produces structured output, wrap it in an `mx` metadata envelope. The output should never need a separate README to explain itself.

---

## Embrace and Extend

MX does not replace existing metadata conventions. It reads what is already there and adds an identity layer on top.

Every file type has its own conventions. JavaScript has JSDoc. HTML has meta tags. CSS has comments at the top. These conventions have been around for decades. They work. MX does not replace them.

What MX adds is governance: `@mx:name`, `@mx:purpose`, `@mx:status`, `@mx:contentType`. The file can now introduce itself to any AI agent, any registry, any machine that needs to understand what it is. The pre-existing metadata IS the content. MX adds the identity.

The pattern is two steps: **embrace** what the file already says — JSDoc `@description` is the prose block, Schema.org JSON-LD is the definition block, EXIF data is the provenance block. Then **extend** with MX governance fields. Never duplicate. Never wrap. The result: a file that works exactly as before for tools that do not understand MX, and is fully machine-readable for tools that do.

---

## Design for the Worst Agent

You cannot detect which AI agent is visiting. User-Agent strings are spoofable. The agent might be a server-side model with no JavaScript execution. It might be a local model with fewer than 100 million parameters and a tiny context window. It might be a browser extension with full DOM access but no ability to follow links.

The principle: design for the agent with the least capability. If the worst agent can understand the page, every agent can. This means: critical information in the HTML, not locked behind JavaScript. Explicit structure, not inferred relationships. Redundancy across formats — the same fact in meta tags, Schema.org JSON-LD, and visible text — because different agents read different parts of the page.

This is not over-engineering. It is strategic redundancy for an audience you cannot predict.

---

## Convergence

Patterns that work for one audience consistently work for all.

Semantic HTML helps screen readers AND AI agents. Clear heading hierarchy helps keyboard navigation AND automated parsing. Schema.org structured data helps search engines AND language models. Accessible form labels help disabled users AND browser automation agents. Good SEO helps human searchers AND AI citation systems.

This convergence is not coincidental. It reflects a shared underlying truth: explicit, structured, unambiguous content is universally comprehensible. When you optimise for accessibility, you get machine readability as a side effect. When you optimise for MX, you get accessibility as a side effect.

The principle: never treat SEO, accessibility, usability, and MX as separate workstreams. They are the same workstream viewed from different angles. A well-built MX page passes WCAG, ranks well in search, works for AI agents, and is easy for humans to use — all at once.

---

## Timeless Prose

Documents should read as if they have always existed in their current form.

No "this update includes." No "previously, we used." No "migrated from." No "now deprecated." No "Status: Unnecessary — do not implement." These phrases anchor content to a moment in time. When that moment passes, the document reads like a changelog instead of a reference.

The fix: state what IS, not what CHANGED. Say "this tag is unnecessary" not "this tag has been retired." Say "use `mx:content-policy`" not "replace `ai-content-policy` with `mx:content-policy`." The reader does not need to know what came before. They need to know what to do now.

This applies to all cogs, all SSOTs, and especially all book manuscripts. Technical SSOTs may include migration notes in a clearly separated section, but the body of the document reads as timeless truth.

---

## Canon Wins

If Canon conflicts with anything elsewhere, Canon is correct. mx-canon is the single source of truth. Everything else is canon fodder.

---

*These principles are not aspirational. They are operational. We follow them today, in every file we create, every cog we write, every script we build. When we find ourselves breaking one, we fix the work — not the principle.*
