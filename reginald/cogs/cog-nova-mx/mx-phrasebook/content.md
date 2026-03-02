---
name: mx-phrasebook
version: "1.0.0"
description: "The sayings that define MX OS culture. Every phrase earned its place by being built, not brainstormed."

created: 2026-02-10
modified: 2026-02-11

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
buildsOn: [what-is-a-cog, what-is-mx-os]
tags: [phrasebook, sayings, culture, voice, identity, mx-os, hitchhikers-guide, writing]

audience: both
readingLevel: accessible
purpose: Single source of truth for MX sayings — use the right phrase in the right context

contentType: "action-doc"
runbook: "mx exec mx-phrasebook"
execute:
  runtime: runbook
  command: mx phrasebook
  actions:
    - name: list
      description: List all MX sayings with context and usage
      usage: Read the phrasebook below. Present each saying with its context, where it originated, and where it is used. This is the reference — do not paraphrase or invent new sayings.
      inputs: []
      outputs:
        - name: phrasebook
          type: array
          description: All MX sayings with metadata

    - name: find
      description: Find the right saying for a context
      usage: Given a context (e.g. "agent is lost", "installation", "canon conflict"), return the most appropriate saying from the phrasebook. Only return sayings that exist in this cog — never invent new ones.
      inputs:
        - name: context
          type: string
          required: true
          description: The situation or context to find a saying for
      outputs:
        - name: saying
          type: object
          description: The matching saying with full context
---

# The MX Phrasebook

Every system has a language. Not just its technical vocabulary — its sayings, its refrains, the phrases people reach for when explaining what it does and why it matters.

MX OS has accumulated these organically. None were brainstormed in a naming workshop. They emerged from building — from writing cogs, deploying SOULs, creating conventions, and solving real problems. Each phrase earned its place by being useful in the moment it was needed.

This is the canonical phrasebook. If Maxine or any AI agent uses an MX saying, it should come from here. If a saying is not in this file, it is not official.

---

## The Sayings

### "Don't panic. Read $MX_HOME."

**Context:** An AI agent starts a session and knows nothing. It has been dropped onto a planet without a map.

**Origin:** Hitchhiker's Guide to the Galaxy. The Guide's cover says "Don't Panic" — the most reassuring phrase in the universe. `$MX_HOME` is MX OS's equivalent of the Guide itself.

**Use when:** Any agent is lost, disoriented, or starting fresh. The greeting for any session that begins at the machine level.

**Where it lives:** PRINCIPLES.md, UBER.cog.md, how-mx-os-runs.cog.md, mx-os-environment.cog.md, what-is-mx-environment.cog.md

---

### "Stop guessing. Start reading."

**Context:** An AI agent is about to hallucinate its way through an installation or a task it does not have structured instructions for.

**Origin:** INSTALLME.md — the convention that replaces hallucination with structured metadata.

**Use when:** An agent is about to guess at commands, invent package names, or try approaches not specified in the metadata. The anti-hallucination motto.

**Where it lives:** INSTALLME.md, what-is-installme.cog.md

---

### "The instructions are the program. You are the runtime."

**Context:** The runbook execution model — the action-doc IS the instruction set, the AI agent IS the executor.

**Origin:** installme-runner.cog.md — describing how runbook action-docs work.

**Use when:** Explaining the relationship between action-docs and AI agents. The agent does not write the program. It runs it. The action-doc contains the instructions. The agent follows them.

**Where it lives:** installme-runner.cog.md

---

### "Documentation IS the system."

**Context:** MX OS is not software. It is a set of conventions — files, metadata, structure. The documentation does not describe the system. The documentation IS the system.

**Origin:** The founding insight of MX OS.

**Use when:** Explaining what MX OS is to someone who expects to install software.

**Where it lives:** MX-OS SOUL.md, what-is-mx-os.cog.md, UBER.cog.md

---

### "MX OS does not need to be installed. It needs to be written."

**Context:** You cannot download MX OS. You write it into existence — by adding frontmatter to your files, SOULs to your folders, metadata to your scripts.

**Origin:** Explaining why there is no installer, no binary, no package manager.

**Use when:** Someone asks "how do I install MX OS?" The answer is: you do not. You write it.

**Where it lives:** UBER.cog.md, what-is-mx-os.cog.md, PRINCIPLES.md

---

### "The standard belongs to everyone. MX OS is ours."

**Context:** The Gathering governs the open cog metadata standard. MX OS is Cog-Nova-MX' implementation built on that standard. Like Linux on POSIX.

**Origin:** Clarifying the relationship between The Gathering (independent, community-owned) and MX OS (commercial product).

**Use when:** Positioning MX OS vs The Gathering. The standard is open. The product is ours.

**Where it lives:** UBER.cog.md, MX-OS SOUL.md

---

### "Everything else is canon fodder."

**Context:** mx-canon is the single source of truth. Anything that contradicts Canon is wrong.

**Origin:** The Canon wins principle — with a deliberate pun.

**Use when:** Resolving conflicts between Canon and other sources.

**Where it lives:** PRINCIPLES.md, mx-canon SOUL.md

---

### "Convention wins the location. Canon wins the content."

**Context:** PRINCIPLES.md lives at the repo root (because that is where humans expect project principles) even though it is canonical content. The file is in the conventional place. The authority is Canon's.

**Origin:** Resolving the tension between "Canon is the single source of truth" and "use existing standards for file placement."

**Use when:** Explaining why canonical documents like PRINCIPLES.md, SOUL.md, and CLAUDE.md live at the repo root instead of inside mx-canon/.

**Where it lives:** PRINCIPLES.md, cog-registry Scattered Canon section

---

### "Every cog published is a question that never gets answered wrong again."

**Context:** The value of the cog registry. Each cog encodes knowledge that would otherwise require an AI agent to guess, search, or hallucinate.

**Origin:** The closing line of cog-registry.cog.md.

**Use when:** Explaining why the registry matters. Why publishing cogs is worth the effort.

**Where it lives:** cog-registry.cog.md

---

### "The companion web for machines."

**Context:** MX creates a parallel machine-readable layer alongside the human web. Not replacing the web — companioning it.

**Origin:** Pitch hook. Warm, collaborative framing.

**Use when:** Pitching MX to someone who worries about AI replacing human content. This is additive, not subtractive.

**Where it lives:** the-companion-web.cog.md, product-brief.md

---

### "The global OS for AI."

**Context:** MX OS scales from a phone to a software agent to a robot. It is the operating system for any machine that reads content.

**Origin:** Pitch hook. Ambitious, visionary framing.

**Use when:** Pitching MX at its most ambitious. CMS Summit stage. Investor deck.

**Where it lives:** product-brief.md

---

### "The object introduces itself."

**Context:** A QR code on a physical object points to a landing page with embedded cog metadata. The object does not wait to be catalogued — it tells you what it is.

**Origin:** The companion web concept — physical-digital bridge.

**Use when:** Explaining how cogs work in the physical world. The bridge from atoms to metadata.

**Where it lives:** the-companion-web.cog.md

---

### "We have now become the OS for the planet."

**Context:** Tom's phrase. The moment MX OS went from "an interesting idea" to "this is real and it scales everywhere."

**Origin:** Tom Cranstoun, during a working session.

**Use when:** The visionary moment. When scope becomes clear.

**Where it lives:** Memory, UBER.cog.md

---

### "Cogs all the way down."

**Context:** The turtles all the way down reference. Every level of the MX OS stack describes itself using the same cog pattern — machine, repo, folder, document, script. The thing that contains cogs is itself a cog.

**Origin:** PRINCIPLES.md — the "Cogs All the Way Down" principle.

**Use when:** Explaining the recursive self-description pattern. Why `$MX_HOME` is itself a cog environment.

**Where it lives:** PRINCIPLES.md, what-is-a-cog.cog.md

---

### "The answer to the machine, the universe, and everything."

**Context:** `$MX_HOME/SOUL.md` closing line. Hitchhiker's Guide reference — but the answer is not forty-two. It is this directory.

**Origin:** SOUL.md in `$MX_HOME`.

**Use when:** Closing any document about `$MX_HOME` or the machine-level context.

**Where it lives:** `$MX_HOME/SOUL.md`

---

### "It is not forty-two. It is this file."

**Context:** UBER.cog.md opening line. The answer to life, the universe, and everything — well, MX OS, Maxine, and the repo.

**Origin:** UBER.cog.md — the master briefing cog.

**Use when:** Opening the UBER briefing. Setting the tone.

**Where it lives:** `$MX_HOME/UBER.cog.md`

---

### "Cut compute, not context."

**Context:** Script metadata lets AI agents read the header instead of the full script. Strong metadata saves tokens.

**Origin:** script-helper.cog.md motto.

**Use when:** Explaining why metadata quality matters. The cost equation: strong metadata = less compute.

**Where it lives:** script-helper.cog.md, what-is-script-metadata.cog.md

---

### "Design for both."

**Context:** The founding principle. Every decision works for humans AND machines. YAML for machines, markdown for humans. Same file. Both audiences.

**Origin:** MX Principle 1 — the first and most important principle.

**Use when:** Any design decision. The test: does this help one audience while hurting the other?

**Where it lives:** PRINCIPLES.md, UBER.cog.md, throughout

---

### "Any document can be a cog."

**Context:** Add YAML frontmatter and it is machine-readable. That is the whole barrier to entry. But metadata quality determines compute cost.

**Origin:** MX Principle 14.

**Use when:** Encouraging adoption. The barrier is low. The benefit scales with metadata quality.

**Where it lives:** PRINCIPLES.md, what-is-a-cog.cog.md

---

### "Cogs all the way down. Ideas all the way around."

**Context:** The recursive improvement loop — MX OS feeds The Gathering, The Gathering feeds the book, the book feeds the company, the company feeds MX OS. Cogs describe the stack vertically. Ideas circulate horizontally.

**Origin:** BRAINSTORM.md closing line — the moment the recursive loop was named.

**Use when:** Describing the MX ecosystem as a self-reinforcing system. The vertical axis is structure (cogs). The horizontal axis is momentum (ideas).

**Where it lives:** BRAINSTORM.md

---

### "We are not building the locomotive. We are laying the track."

**Context:** The railway analogy for MX. AI engines (GPT-4, Claude, Gemini) are locomotives — powerful and commoditising. What is missing is infrastructure. MX builds the track, the stations, the signals, the standard gauge.

**Origin:** The train analogy — MX maps structurally to a railway system. Cogs are carriages. The Gathering is the gauge standard. MX OS is the first railway company.

**Use when:** Pitching MX to investors, executives, or non-technical audiences. The single clearest statement of what MX does and does not do.

**Where it lives:** mx-train-analogy.cog.md, mx-train-pitch.md

---

### "Every cog is a carriage."

**Context:** Railway modularity. Each carriage carries its own payload, couples to other carriages, and decouples without breaking anything. Cogs work the same way — self-contained, composable, independent.

**Origin:** The train analogy — mapping `builds-on` coupling to railway coupling.

**Use when:** Explaining cog modularity to non-technical audiences. Investors understand carriages better than dependency graphs.

**Where it lives:** mx-train-analogy.cog.md

---

### "The cog railway."

**Context:** A cog railway uses toothed gears to climb gradients that smooth rails cannot handle. MX cogs give AI agents traction on the difficult terrain of unstructured content. Without cogs, the agent slips. With cogs, it climbs.

**Origin:** The train analogy — the single most visual metaphor in the pitch.

**Use when:** Conference stage. The one image the audience remembers. The steeper the terrain, the more the cog matters.

**Where it lives:** mx-train-analogy.cog.md, mx-train-pitch.md

---

### "Standard gauge."

**Context:** The 1846 Gauge Act standardised British railway track width, enabling a network effect. The Gathering is the Gauge Act for AI — one open standard so everyone's trains run on everyone's tracks.

**Origin:** The train analogy — mapping The Gathering to railway gauge standardisation.

**Use when:** Explaining The Gathering to investors. They understand gauge standardisation as business history. First mover sets the gauge.

**Where it lives:** mx-train-analogy.cog.md, mx-train-pitch.md

---

## Rules

1. **Only use sayings from this phrasebook.** Do not invent new ones. If a new saying emerges from building, add it here first.
2. **Match the context.** Each saying has a specific use case. "Don't panic" is for lost agents, not for installation failures. "Stop guessing" is for hallucination, not for architecture decisions.
3. **Do not overuse.** One saying per document closing is enough. Two is too many.
4. **These are earned, not assigned.** A saying gets added here when it has been used naturally in at least two documents. If it feels forced, it is not ready.

---

*Every phrase here was built, not brainstormed. That is how you know they are real.*
