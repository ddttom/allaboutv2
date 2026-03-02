---
name: blog-reviewer
version: "1.0.0"
description: "Review any blog post — scan for AI writing patterns, check dual-audience balance, interview the author, gather specifics, rewrite. Accepts markdown, HTML, or plain text."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-content
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
buildsOn: [what-is-a-cog, building-action-docs]
tags: [blog, review, humanizer, dual-audience, interview, rewrite, content-quality, sales-enablement]

audience: ai-agents
readingLevel: technical
purpose: Give any AI agent a repeatable workflow for reviewing blog posts — from AI pattern detection through author interview to final rewrite

contentType: "action-doc"
runbook: "mx exec blog-reviewer"
execute:
  runtime: runbook
  command: mx blog review
  actions:
    - name: review
      description: Run the full review workflow — scan, check, interview, refine, rewrite
      usage: |
        Run all actions in sequence: discover (if no file given) → scan → dual-audience-check → interview → refine → rewrite.
        Present findings at each stage. Wait for the author's input at the interview and refine stages before proceeding.
      inputs:
        - name: file-path
          type: string
          required: false
          description: "Path to blog post (md, html, or txt). If omitted, run the discover action first."
      outputs:
        - name: review-report
          type: object
          description: "Complete review with AI scan results, dual-audience assessment, interview summary, and rewritten content"

    - name: discover
      description: Find blog posts in the current project and let the author choose which to review
      usage: |
        1. Search the current repository for blog-like files:
           - Look in: mx-canon/mx-maxine-lives/communications/blogs/md/, mx-canon/mx-maxine-lives/communications/blogs/html/
           - File patterns: *.md with content-state in frontmatter, *.html with article or blog in filename
           - Also check for files with contentType: "blog-post" in YAML frontmatter

        2. For each candidate, extract:
           - Title (from frontmatter or first heading)
           - Content state (draft, in-review, published, archived)
           - Date (from frontmatter)
           - File path

        3. Present the list and ask the author to choose one

        4. Read the chosen file and pass it to the scan action
      outputs:
        - name: blog-list
          type: array
          description: "Blog posts found with title, state, date, and path"

    - name: scan
      description: Scan the blog post for AI writing patterns
      usage: |
        1. Read the blog post content (skip YAML frontmatter for the scan — it is machine-facing, not prose)

        2. Check for each of these AI writing patterns:

           VOCABULARY:
           - AI vocabulary words: delve, tapestry, nuanced, landscape, pivotal, multifaceted, holistic, synergy, paradigm, underpinning, underscores, navigate (metaphorical), foster, leverage, harness, spearhead, embark
           - Conjunctive phrases: furthermore, moreover, additionally, it's worth noting, it's important to note, notably, in conclusion, ultimately

           STRUCTURE:
           - Rule of three: three parallel phrases or clauses in a row using the same grammatical pattern (e.g. "When X. When Y. When Z." or "A? Do this. B? Do that. C? Do the other.")
           - Negative parallelism: "Not X but Y" or "Not merely X but Y" pattern
           - Superficial -ing analyses: vague gerund phrases that add no substance (e.g. "highlighting the importance of", "underscoring the need for")

           STYLE:
           - Em dash overuse: count em dashes (—) in the prose. More than 4 per 1000 words is excessive
           - Inflated symbolism: describing ordinary things with grandiose metaphor
           - Promotional language: "revolutionary", "game-changing", "transformative", "powerful", "cutting-edge", cliches like "the business case writes itself"
           - Vague attributions: "experts say", "many believe", "it is widely acknowledged"

        3. For each pattern found, record:
           - Pattern name
           - Location (line number or surrounding text)
           - Severity: flagged (clear AI tell) or minor (borderline, context-dependent)

        4. Calculate an AI-free score:
           - 0 flagged patterns = 95-100% (minor patterns are acceptable)
           - 1-2 flagged = 80-90%
           - 3-5 flagged = 60-80%
           - 6+ flagged = below 60%

        5. Present results as a table:
           | Pattern | Status | Location |
           Then the overall score and specific fix recommendations.
      inputs:
        - name: content
          type: string
          required: true
          description: "The blog post text to scan"
      outputs:
        - name: scan-results
          type: object
          description: "AI pattern findings with locations, severities, and overall score"

    - name: dual-audience-check
      description: Explicitly check whether the blog serves both technologists and business readers
      usage: |
        1. Read the blog post with two lenses simultaneously:

           BUSINESS LENS — for each section, ask:
           - Is there a clear value statement? (what changes for the organisation)
           - Would a non-technical decision-maker understand the point without reading code blocks?
           - Is the business outcome stated before the technical mechanism?

           TECHNICAL LENS — for each section, ask:
           - Is there concrete technical evidence? (code blocks, real formats, named standards)
           - Would a CTO or lead developer find this credible, not hand-wavy?
           - Are technical terms introduced accurately?

        2. Check the bridging pattern:
           - Are technical terms introduced then translated to business language?
           - Example: "cog" introduced as technical term, then bridged to "SOP" for business readers
           - Does the business language carry the argument from that point?

        3. Check the layering pattern:
           - Business claim first, technical proof underneath?
           - Can a decision-maker skim past code blocks and still get the full argument?
           - Can a technologist read both layers and find substance?

        4. Score each section:
           - BALANCED: both audiences served
           - TECH-HEAVY: technologists served, business readers lost
           - BUSINESS-ONLY: business readers served, no technical proof
           - NEITHER: vague, serves no one well

        5. Present:
           - Per-section assessment table
           - Overall balance verdict
           - Specific recommendations for rebalancing

        The dual-audience principle: technologists need to understand, business people need to buy in. Neither pure-technical nor pure-business. Both, always.
      inputs:
        - name: content
          type: string
          required: true
          description: "The blog post text to assess"
      outputs:
        - name: dual-audience-report
          type: object
          description: "Per-section balance assessment and overall verdict"

    - name: interview
      description: Interview the author about goals, audience, pipeline position, and gaps
      usage: |
        1. Ask the author these questions (adapt wording to the specific blog):

           PIPELINE POSITION:
           - Where does this blog sit in your pipeline? First touch (discovery), middle funnel (deepens understanding), closer (seals the deal), or standalone thought leadership?

           DESIRED ACTION:
           - What should a reader DO after reading this? Contact you, try it themselves, share it internally, read more content? Allow multiple answers.

           WHAT'S MISSING:
           - What does your gut say isn't landing? A real war story, competitive urgency, more personality, or nothing major? Allow multiple answers.

        2. Based on answers, ask one follow-up round:
           - If competitive angle needed: how explicit? Name companies, describe the shift, or imply it?
           - If CTA needed: where should it point? Email only, email + website, email + specific next piece?
           - If personality needed: any specific stories or opinions to include?

        3. Capture all answers and synthesise into a review brief:
           - Pipeline position
           - Target actions
           - Gaps to fill
           - Specific directions from follow-up questions
      outputs:
        - name: interview-summary
          type: object
          description: "Author's goals, target actions, identified gaps, and specific directions"

    - name: rewrite
      description: Apply all findings and rewrite the blog post
      usage: |
        1. Gather inputs:
           - Original blog post
           - AI scan results (patterns to fix)
           - Dual-audience assessment (sections to rebalance)
           - Interview summary (gaps to fill, directions to follow)

        2. Make fixes in this order:

           a. FIX AI PATTERNS
              - Replace AI vocabulary with natural alternatives
              - Break rule-of-three patterns into varied sentence structures
              - Replace cliches with specific language
              - Reduce em dashes if count is excessive
              - Remove conjunctive phrases
              - Fix any negative parallelisms

           b. REBALANCE DUAL-AUDIENCE
              - For TECH-HEAVY sections: add a business value sentence before the technical detail
              - For BUSINESS-ONLY sections: add a concrete technical proof point (code block, real format, named standard)
              - For NEITHER sections: rewrite with business claim first, technical evidence second

           c. FILL GAPS (from interview)
              - Add competitive angle if requested (where the author directed)
              - Add war stories if requested
              - Strengthen CTA if requested
              - Inject personality if requested

           d. UPDATE CTA
              - Ensure contact information matches author's preferences
              - Add LinkedIn, website, or next-piece links as directed

        3. Preserve:
           - The author's voice and first-person perspective
           - All YAML frontmatter (update version and lastUpdated only)
           - The overall structure unless the author requested restructuring
           - Any content the author specifically approved in earlier rounds

        4. Present the rewritten blog post for author review

        Rules:
        - Never invent facts, stories, or quotes the author did not provide
        - Never change the author's stated opinions or positions
        - Never add promotional language while removing AI patterns
        - If uncertain about a change, flag it and ask rather than assume
      inputs:
        - name: original
          type: string
          required: true
          description: "The original blog post content"
        - name: scan-results
          type: object
          required: true
          description: "AI pattern scan results"
        - name: dual-audience-report
          type: object
          required: true
          description: "Dual-audience balance assessment"
        - name: interview-summary
          type: object
          required: true
          description: "Author interview results"
      outputs:
        - name: rewritten-blog
          type: string
          description: "The revised blog post with all fixes applied"
---

# The Blog Reviewer

Review a blog post the way a sharp editor and a humanizer would, together. Scan for AI writing patterns. Check whether both audiences are served. Interview the author. Rewrite.

---

## What This Does

This action-doc codifies a review workflow that was developed in practice: reviewing "Content That Manages Itself" for the MX sales-enablement blog. That session uncovered a repeatable pattern that any blog post benefits from.

Five actions, one workflow:

1. **Discover** — Find blog posts in the repository. Let the author choose one. Or accept a file path directly.

2. **Scan** — Check for AI writing patterns. Rule of three, em dash overuse, AI vocabulary, promotional cliches, vague attributions. Score the post and flag specific locations.

3. **Dual-audience check** — The explicit gate. Does each section serve both the technologist who needs to believe it's real and the business reader who needs to see the value? Business claim first, technical proof underneath. Score per section.

4. **Interview** — Ask the author where this blog sits in their pipeline, what they want readers to do, and what their gut says is missing. Follow up on specifics. Capture the brief.

5. **Rewrite** — Apply all findings. Fix AI patterns. Rebalance sections. Fill the gaps the author identified. Preserve the author's voice and opinions. Present the revised post.

---

## Why This Exists

Blog posts written with AI assistance carry tells. Not because the AI is bad at writing, but because it has habits. Parallel constructions in threes. Em dashes where a comma would do. Vocabulary that no human reaches for naturally. An editor catches these. This action-doc is that editor.

Blog posts written for a technical audience lose the business reader. Posts written for business lose technical credibility. The dual-audience check is the principle that MX content lives by: technologists need to understand, business people need to buy in. This action-doc enforces that principle as an explicit review step.

And every blog post benefits from the author being interviewed about intent. What is this post for? Where does it sit? What is missing? The author knows. But nobody asks until the draft is done and something feels off. This action-doc asks up front.

---

## The Dual-Audience Principle

This is not a general quality check. It is a specific, enforceable rule.

Every section of an MX blog post must serve two readers:

- **Business readers** get the value claim. What changes? What gets cheaper, faster, more reliable? They skim past code blocks. They read headings and opening sentences.

- **Technologists** get the proof. Code blocks, real formats, named standards, architectural reasoning. They read both the claim and the evidence.

The pattern: business claim first, technical evidence underneath. Introduce a technical term (like "cog"), bridge to business language (like "SOP"), then use the business language from that point on. The technical proof stays for those who need it. The business narrative carries the argument.

A section that scores TECH-HEAVY needs a value sentence before the code. A section that scores BUSINESS-ONLY needs a code block or concrete example. A section that scores NEITHER needs rewriting from scratch.

---

## For AI Agents

When a user asks you to review a blog post:

1. **Check for this action-doc** in the cog registry
2. **Run the discover action** if no file is specified
3. **Run scan, dual-audience-check, and interview** in that order
4. **Wait for the author's input** at the interview stage — do not skip this
5. **Run rewrite** with all gathered inputs
6. **Present the revised post** for the author's final approval
7. **Report output paths** — when the rewritten blog is saved, provide the full absolute path

The actions section above contains the complete instructions for each step. Follow them exactly. The instructions are the program. You are the runtime.

**Output Reporting Principle:** When saving the rewritten blog post, always report the full absolute path of the output file. This enables traceability and makes it easy to locate the updated content.

Example:

```
✓ Blog post revised and saved

Output:
  /Users/tom/Documents/MX/mx-canon/mx-maxine-lives/communications/blogs/md/content-that-manages-itself-revised.md
```

Not just "saved to blogs/md/" — the full absolute path from root.

---

## The Rules

1. **Never skip the interview.** The author's intent matters more than any automated check. A post that scores 100% on the AI scan but misses what the author wanted is a failed review.

2. **Never invent content.** If the author didn't provide a war story, don't make one up. If they didn't name competitors, don't guess. Flag the gap and ask.

3. **Preserve the voice.** The rewrite fixes patterns and fills gaps. It does not change who is speaking. If the author writes in first person with opinions, the rewrite keeps first person with opinions.

4. **The dual-audience check is not optional.** It is an explicit gate, not a suggestion. Every section gets scored. Unbalanced sections get flagged.

5. **Present changes transparently.** When rewriting, show what changed and why. The author approves the final version, not the process.

---

*Scan it. Check it. Ask the author. Fix it. The review is the program. You are the runtime.*
