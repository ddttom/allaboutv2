---
title: "The Principles That Changed How I Build for Everyone"
author: "Tom Cranstoun"
author-email: "tom@digitaldomaintechnologies.com"
date: "2026-02-03"
content-state: "published"
content-filename: "principles-changed-how-i-build"
blog-url: "https://allabout.network/blogs/mx/principles-changed-how-i-build.html"
publication-date: "2026-02-03"
description: "A practitioner's guide to Machine Experience principles that make digital products work better for humans, AI agents, and everyone in between."
keywords:
  - machine-experience
  - design-principles
  - accessibility
  - sop-agents
  - metadata
  - semantic-web
  - universal-design
  - web-development

mx:
  contentType: "blog-post"
  version: "1.1"
  lastUpdated: "2026-02-04"
  promptingInstruction: |
    This blog post introduces the core Machine Experience principles
    through a practitioner's lens. Written in conversational first-person,
    explaining technical concepts through relatable examples and personal insights.

    Target audience: developers, designers, and content creators who build
    digital products and want to understand how MX improves their work.

  audience: ["humans", "machines"]

  ai:
    contextProvides:
      - "mx-principles-introduction"
      - "design-for-both-philosophy"
      - "metadata-driven-architecture"
      - "universal-accessibility-patterns"

co:
  workflow: "published"
  reviewRequired: false

coOwnership:
  - "Tom Cranstoun"
  - "Claude Sonnet 4.5 (transformation from technical documentation)"
---

# The Principles That Changed How I make digital products work better for humans, AI agents, and everyone in between

I've been building websites and digital products for years, and for most of that time, I was designing for one audience: people with browsers and eyeballs. That seemed reasonable. After all, the web is a visual medium, right?

Then I started noticing something odd. The sites that worked best for screen reader users also happened to work better for everyone under stress. The patterns that made content comprehensible to people with cognitive disabilities also made it easier for anyone multitasking or distracted. And increasingly, the structure that helped humans understand pages also helped AI agents parse them correctly.

This wasn't a coincidence. I was seeing evidence of something I'd later come to understand as the convergence principle: the patterns that optimize for machine comprehension also improve human accessibility and comprehension. Not as a trade-off, but as a natural consequence of explicit, semantic communication.

That realization led me to develop what I now call Machine Experience principles. These aren't new technologies or fancy frameworks. They're design principles that recognize a simple truth: if we build digital products that communicate meaning explicitly, rather than just displaying it attractively, we serve everyone better.

Let me share the principles that fundamentally changed how I approach building digital products.

## Principle One: Design for Both

The first principle is the foundation for everything else: every design decision should optimize for both human developers and AI agents simultaneously.

I know what you're thinking. "Isn't that impossible? Don't machines and humans need different things?"

That's what I thought too. But then I started paying attention to what actually breaks user experiences. Those ephemeral toast notifications that appear for three seconds then vanish? They fail everyone. AI agents can't see them by the time they check the page state. Screen reader users might miss the announcement if they're navigating elsewhere. People with ADHD don't have time to read and act. And stressed users—parents managing children while trying to complete a form—look away at precisely the wrong moment.

The alternative is to make errors persistent. Put them at the top of the form, keep them visible until resolved, and clearly state what's wrong and how to fix it. This single pattern helps everyone. Not ideally for each specific case, but substantially for all cases.

That's what "design for both" means. It's not about satisfying competing requirements. It's about recognizing that explicitness, semantic structure, and persistent feedback serve all users regardless of their technical capabilities or limitations.

Hidden configuration files are another example. Files like gitignore or configuration files that start with a dot reduce visual clutter for humans browsing directories. But they're fully discoverable via standard filesystem APIs for machines. YAML frontmatter in markdown documents provides readable content for humans and structured metadata for machines. These aren't compromises—they're solutions that genuinely serve both audiences.

The anti-pattern? Mermaid diagrams. They require a rendering engine for humans to understand and an interpretation layer for machines to parse. They fail the "design for both" test because they introduce unnecessary complexity for both audiences.

This principle isn't about being clever with dual-purpose solutions. It's about asking a different question. Instead of "how do I make this work for users?" we ask "how do I make this work for everyone who encounters it—humans, disabled users, AI agents, automated systems?" The answer usually involves being more explicit, more semantic, and less dependent on visual presentation alone.

## Principle Two: Metadata-Driven Architecture

The second principle builds on the first: use structured metadata to make content and code maximally machine-readable whilst remaining human-readable.

I used to think metadata was something you added after building the thing. You know, for search engine optimization or accessibility compliance. But that's backwards. Metadata isn't decoration—it's infrastructure.

Think about it this way. When you write a function, you probably give it a clear name, add parameters with descriptive names, and maybe write a comment explaining what it does. That's metadata for humans. Now imagine if your codebase could tell an AI agent not just what each function does, but what context it provides, what context it requires, and how it relates to other parts of the system.

That's metadata-driven architecture. It's implementing structured information at four distinct layers.

At the repository level, you have a configuration file at the root that establishes project context and conventions. This tells anyone—human or machine—encountering your project what kind of system it is, what principles guide it, and how to navigate it effectively.

At the directory level, package-specific context lives in each major subdirectory. This explains what that package does, what it depends on, and how it fits into the larger system. No more hunting through README files scattered across dozens of folders trying to understand the architecture.

At the file level, YAML frontmatter declares each document's purpose, intended audience, stability level, and what context it provides to AI agents. I learned this the hard way. I was working with an AI assistant on a multi-repository project, and it kept getting confused about which repository we were working in, what the file naming conventions meant, and how different documents related to each other. So I started adding frontmatter that explicitly declared these relationships. The difference was dramatic. The AI stopped making incorrect assumptions and started asking better questions.

At the code level, annotations mark functions and critical sections with behavioral declarations. These aren't just comments—they're structured metadata that both humans and automated tools can parse reliably.

The required fields at each level include purpose, audience designation (human, machine, or both), stability indicator (experimental, unstable, stable, or frozen), what context this provides to AI agents, and cross-references to related content. For JSON and similar files that don't support frontmatter, you can mirror this structure using a comment metadata pattern.

Why does this matter? Because when you make context explicit through metadata, you're not just helping machines. You're helping the next developer who encounters your code, the documentation system that generates references, and the AI agent that's trying to understand how to modify a function safely. Single source of truth, multiple audiences served.

## Principle Three: Context Declaration

The third principle takes metadata further: files should explicitly declare what context they provide and what context they require.

This one emerged from frustration. I was building a documentation system where different documents referenced each other, but there was no way to verify whether you had all the necessary context before diving into an advanced topic. You'd start reading about, say, metadata schema specifications, only to realize halfway through that you needed to understand the base framework first. Frustrating for humans, completely broken for AI agents.

So I started having files declare their dependencies. Not just in a technical sense—though that matters too—but in a conceptual sense. A document might declare that it provides context about the convergence principle and design-for-both philosophy, while requiring prior understanding of MX core principles and guiding principles from the handbook.

This creates self-documenting dependency graphs. An AI agent reading a file knows immediately whether it has sufficient context to understand what it's reading. A human can see at a glance what they should read first. A documentation system can build a proper navigation structure automatically.

The implementation is straightforward. In your YAML frontmatter or structured metadata, include a contextProvides array listing the concepts or knowledge this file establishes, and a contextRequired array listing the prerequisites. Be specific. "MX principles" is vague. "Convergence principle definition" and "Three Pillars framework" are concrete.

This principle prevents a common failure mode: missing critical context that leads to incomplete understanding. When an AI agent encounters a file that requires context it doesn't have, it can explicitly request that context rather than making incorrect inferences. When a human sees that a document requires reading three other documents first, they can make an informed choice about whether to proceed or prepare properly.

The benefit extends beyond documentation. Configuration files can declare what system state they require. Code modules can declare what context they need from their environment. API endpoints can declare what authentication and authorization context they expect. Making requirements explicit prevents errors and improves reliability across the board.

## Principle Four: Universal Accessibility

The fourth principle recognizes that accessibility and machine-readability converge: plain text formats, explicit markup, and declared relationships serve both disabled users and automated systems.

I used to think accessibility was primarily about screen readers and keyboard navigation. It is about those things, but it's about something much larger. It's about ensuring that information remains accessible regardless of how someone or something accesses it.

Plain text formats—markdown, YAML, JSON, ASCII diagrams—work everywhere. You can read them in any text editor, process them with any programming language, version control them effectively, and they never become obsolete because they require specific software versions. Binary formats like Microsoft Word documents or Mermaid diagrams that require rendering? They work until they don't. They're accessible until the software breaks or the rendering engine changes or the AI agent doesn't have the right interpreter.

Explicit markup matters more than most developers realize. Semantic HTML isn't just good practice—it's the difference between "this content happens to look like a heading" and "this is semantically a heading that establishes structure." ARIA attributes don't just help screen readers. They tell any agent parsing your page what the relationships and states are. Declared relationships through proper link structures, navigation hierarchies, and schema markup create a navigable map for anyone or anything trying to understand your content.

The principle is straightforward: no JavaScript-required content for core functionality, no binary-only documentation, no formats that require specific proprietary tools to access. If something matters, make it accessible in the most universal format possible.

This doesn't mean you can't use JavaScript or rich media. It means you design with progressive enhancement. The core content and functionality work in plain text or basic HTML. JavaScript enhances the experience for those who have it, but doesn't gate access for those who don't.

I learned this working on a project where we built a complex dashboard with real-time updates. Beautiful interface, smooth interactions, completely inaccessible to AI agents trying to extract data because everything lived in JavaScript state. We redesigned it so the data existed in HTML data attributes and semantic structure first, then enhanced with JavaScript for real-time updates. Suddenly screen readers could navigate it, AI agents could parse it, and the experience actually got better for everyone because the structure was clearer.

Universal accessibility isn't about following compliance checklists. It's about recognizing that the web is a communication medium accessed by diverse audiences using diverse tools. Making your content accessible in its most basic form ensures it remains accessible regardless of who or what encounters it.

## Principle Five: Context-Preserving References

The fifth principle addresses a problem that becomes obvious once you notice it: links must work in all contexts, not just when you're browsing the live website.

Here's the scenario. You write a document with internal links to other documents in your repository. Great. Now someone exports that document to PDF to read offline. All your links break. An AI agent reads the document in isolation without access to your repository structure. The links provide no useful information. Someone copies a section to paste into another document. The references lose all context.

This happens because most people write links optimally for one context—usually the original location—without considering how the content might be reused or accessed differently.

The solution is context-preserving references. Each link should work for IDE users (clickable relative links), external readers who might encounter the document in isolation (full absolute URLs with complete titles), and anyone in between.

The pattern looks like this: you write the link text and relative path as normal, making it clickable in your IDE or repository browser. Then you add a parenthetical citation with the full title and absolute URL. This serves IDE users with immediate navigation, serves anyone reading an extracted or copied version with full context, and serves AI agents with both machine-readable relative paths and human-readable absolute references.

Yes, it's more verbose. But it solves a real problem. I've had countless situations where I'm reading a PDF export of documentation or looking at a copied section in someone's notes, and the references are useless because they assume I have the original context. Links like "see chapter three" or "refer to the principles document" tell me nothing when I'm reading outside the original structure.

This principle extends beyond just URLs. It applies to any reference. Citations should include enough context to track down the source independently. Cross-references between documents should work whether you're browsing the repository or reading a single file. Examples and code snippets should include enough context to understand them independently.

The goal is resilience. Your content should remain useful and navigable regardless of where it ends up or how someone accesses it. That benefits humans trying to reference your work and machines trying to build knowledge graphs from multiple sources.

## Principle Six: Size-Neutral Documentation

The sixth principle might seem minor, but it eliminates a constant maintenance headache: avoid hard-coded counts that create documentation drift.

How many times have you seen documentation that says "we have five core principles" right before listing six principles? Or "this has three components" followed by four components? It happens constantly because someone writes the count, then later adds an item without updating the count.

The solution is to make your documentation size-neutral. Instead of "five core principles," write "core principles." Instead of "three main components," write "main components." Let the structure be self-describing rather than declaring its size in prose.

Collections should be self-describing structurally. Use headings, lists, and semantic markup to show what's included. Let readers count if they need to know the exact number. Don't encode the count in your description where it'll inevitably drift out of sync.

This reduces maintenance burden and prevents documentation drift. When you add a new principle or component, you just add it. You don't have to hunt through documentation updating every reference to "five principles" to "six principles" and hoping you didn't miss any.

It seems trivial until you're maintaining a large documentation set and realize you've spent an hour tracking down inconsistencies caused by hard-coded counts. Or until an AI agent gets confused because the text says five but the structure shows six, and it doesn't know which is correct.

Size-neutral documentation is about writing in a way that remains accurate as things evolve. Describe the content without declaring its size. Let the structure speak for itself.

## Principle Seven: Executable Documentation

The seventh principle is the most powerful: documents can contain their own generation instructions, enabling self-documenting specifications with executable build logic.

This might sound abstract, so let me explain with an example. Imagine you're documenting an API. You write the specification for each endpoint—what it expects, what it returns, what the validation rules are. Traditional documentation stops there. You write it once, then separately write the code that implements it, then separately write tests that verify it. Three sources of truth that can drift apart.

Executable documentation flips this. The document itself contains prompting instructions and generation instructions as metadata. When an AI reads the file, these instructions are automatically included in context. When a user requests generation, these instructions get executed.

A specification document might include metadata that says "when generating implementation code from this specification, ensure you create validation matching the documented constraints, generate comprehensive error messages for each failure case, and include examples demonstrating each documented feature."

An architecture document might include generation instructions that say "when creating component files based on this architecture, follow the package structure described in section two, implement the interfaces defined in section three, and add metadata declaring which architectural concepts each component provides."

This creates a single source of truth that serves as both documentation and executable specification. The document describes what should exist, contains instructions for how to create it, and provides context for understanding it. Changes to requirements happen in one place—the document—and propagate to implementation through the generation instructions.

This doesn't mean documentation automatically writes code without human oversight. It means documentation can guide and constrain generation in a way that ensures implementations match specifications. The human still reviews, approves, and refines. But the documentation itself becomes an active participant in the build process rather than a passive reference that drifts out of sync.

The metadata fields that enable this are promptingInstruction (context automatically injected when AI reads the file) and createOutputPrompt (generation instructions executed when user requests generation). The former provides understanding. The latter enables action.

I've used this pattern for everything from API specifications that generate both server and client code to architecture documents that scaffold project structures to data schemas that generate validation logic. Each time, the benefit is the same: the documentation stays synchronized with implementation because it IS the source of implementation guidance.

## Principle Eight: WCAG-Informed Design

The eighth principle connects all the others to established accessibility standards: design decisions should align with Web Content Accessibility Guidelines (WCAG), recognizing that accessibility requirements for disabled users provide proven patterns that also benefit machine readability.

I used to think of accessibility and machine-readability as separate concerns. One was about compliance and helping disabled users. The other was about making content parseable by AI agents. Then I started actually studying WCAG in depth, and I realized they're describing the same patterns from different perspectives.

WCAG standards represent decades of research and practice in making digital content accessible to disabled users. Screen reader users need semantic HTML structure. AI agents need semantic HTML structure. Users with cognitive disabilities need accurate, consistent information. AI agents need accurate, consistent information. Keyboard-only users need programmatically determinable relationships. AI agents need programmatically determinable relationships.

The convergence is remarkable once you notice it. WCAG Success Criterion 1.3.1 (Info and Relationships) requires that "information, structure, and relationships conveyed through presentation must be programmatically determinable." That's exactly what Machine Experience Principle 2 (Metadata-Driven Architecture) and Principle 4 (Universal Accessibility) require—just expressed in different terminology.

Let me share a concrete example from this week. I was reviewing some HTML I'd generated for blog posts about MX principles. The footer had this styling: light gray text (`#e5e7eb`) on a dark gray background (`#1f2937`). It looked fine on my monitor. But when I tested it with a contrast checker, it barely passed WCAG AA requirements. For users with low vision, in bright sunlight, or on older displays, that footer would be hard to read.

The fix was simple: change the footer text to white (`#ffffff`). Now it has excellent contrast (15:1 ratio) and passes WCAG AAA standards. Machines don't care about contrast ratios—they parse text regardless of color. This principle serves humans first.

But here's the interesting part. When I fix contrast issues, I'm making the content more accessible to disabled users while also demonstrating a commitment to universal design that extends to how I structure everything else. The same rigor that makes me test contrast ratios also makes me verify semantic structure, check that links work out of context, and ensure documentation doesn't contain misleading information.

WCAG Success Criterion 3.1.5 (Reading Level) requires providing supplementary content when text requires advanced reading ability. It also implies that content should be accurate and clear. When documentation says "the seven principles" but lists eight principles, that creates cognitive overhead. Users must stop and reconcile the mismatch. This particularly affects users with cognitive disabilities, users reading in non-native languages, and users under stress.

That's why size-neutral documentation (Principle Six) matters. It's not just about maintenance convenience. It's about reducing cognitive load for all users, which is a core accessibility principle.

WCAG Success Criterion 2.4.4 (Link Purpose) requires that the purpose of each link can be determined from link text or context. That's exactly what context-preserving references (Principle Five) provide. Screen reader users navigating by links need full context. AI agents extracting documents need full context. The same solution serves both audiences.

The legal context matters too. WCAG compliance isn't optional in many jurisdictions. The Americans with Disabilities Act, UK Equality Act, EU Accessibility Act, and similar legislation worldwide require accessible digital experiences. When MX principles align with WCAG requirements, compliance becomes a natural outcome of good design rather than a separate checkbox exercise.

What I've learned is that WCAG provides concrete, testable standards for accessibility patterns. Contrast ratios have specific numerical thresholds (4.5:1 for normal text, 3:1 for large text). Semantic structure has validation tools (WAVE, axe DevTools). Keyboard navigation has clear requirements (every interactive element must be keyboard-accessible).

These standards provide rigor that benefits everyone. They're not suggestions or best practices—they're legally mandated requirements with decades of research behind them. When I align MX principles with WCAG standards, I'm building on that foundation rather than inventing new patterns.

WCAG doesn't replace MX principles—it informs them. Every MX principle can be traced back to an accessibility principle that serves disabled users. Explicit semantic structure helps screen readers. Context-preserving references help users who can't see visual context. Accurate documentation helps users with cognitive disabilities. Universal formats help users on assistive technologies.

The convergence continues. Making content accessible to disabled users inherently makes it accessible to machines. Making content accessible to machines, when done right, makes it accessible to disabled users. WCAG provides the proven standards. MX extends those standards to machine users. Together, they create experiences that work for everyone and everything that uses them.

## What This Means for How We Build

These principles aren't just theoretical. They change how you approach building digital products in concrete ways.

When you design for both humans and machines simultaneously, you stop making arbitrary choices about whether something should be visual or semantic. You make it both. You stop hiding state in JavaScript that only visual users can see. You expose it in markup where everyone can access it.

When you adopt metadata-driven architecture, you stop treating documentation as an afterthought. You embed context directly into your code and content, making it navigable and understandable from day one. Your repository becomes self-documenting not through generated comments but through structured metadata that explains purpose, relationships, and dependencies.

When you declare context explicitly, you stop making assumptions about what readers know. Your documentation becomes approachable because prerequisites are clear. Your APIs become usable because requirements are explicit. Your code becomes maintainable because dependencies are declared rather than implicit.

When you prioritize universal accessibility, you stop building features that only work in ideal conditions. You design for edges—disabled users, automated systems, degraded networks, old devices—and discover that solutions for edges improve experiences for everyone.

When you use context-preserving references, you stop writing documentation that only works in one medium. Your content becomes portable, reusable, and valuable regardless of where it ends up or how someone accesses it.

When you make documentation size-neutral, you stop creating maintenance debt through hard-coded counts. Your documentation evolves cleanly as your product grows.

When you enable executable documentation, you stop treating specifications as separate from implementation. Your documentation becomes an active part of your build process, ensuring that what you describe matches what you build.

## The Convergence Continues

I started with a simple observation: patterns that help AI agents tend to help humans too. But these principles reveal something deeper. They're not really about AI agents at all. They're about explicit communication, semantic structure, and designing for the broadest possible audience.

When you make meaning explicit rather than implicit, you help everyone. When you structure information semantically rather than just visually, you serve all users regardless of their capabilities or access methods. When you treat documentation as infrastructure rather than afterthought, you create systems that remain understandable as they grow.

The web was built on principles of universal access and progressive enhancement. These principles extend those foundations to an era where machines are users too, where content lives in multiple contexts simultaneously, and where the distinction between human and automated access matters less than ensuring everyone can access and understand what you've built.

Start with one principle. Pick the one that resonates most with your current challenges. Maybe you're struggling with documentation drift—try size-neutral documentation. Maybe your accessibility metrics are poor—try universal accessibility patterns. Maybe you're working with AI agents and hitting context issues—try context declaration.

Apply it consistently. See what changes. Notice who benefits. Then add another principle.

These aren't rules to follow rigidly. They're lenses for viewing your work differently. Perspectives that shift how you think about building digital products. Principles that, once you internalize them, become obvious in retrospect even though they weren't obvious before.

The web is evolving. AI agents are becoming users. Content lives in multiple contexts. Universal access matters more than ever. These principles help us build for that reality—not by adding complexity, but by embracing clarity, structure, and explicit communication that serves everyone.

That's what Machine Experience really means. Making the web work for everyone and everything that uses it.

## Contact

Want to discuss Machine Experience principles or implementation? Reach out at [tom@digitaldomaintechnologies.com](mailto:tom@digitaldomaintechnologies.com)

---

**About this post**: This blog post translates the technical Machine Experience principles documentation into practical guidance for practitioners. The principles described here form the foundation of the MX framework and are implemented across the MX documentation, specifications, and tooling. For complete technical specifications and implementation details, see the MX principles documentation in the repository.
