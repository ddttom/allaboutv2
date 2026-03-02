---
name: the-personal-cog
version: "2.0"
description: The personal cog — a collection of cogs that describe YOU. Accessibility needs, interests, dietary requirements, health conditions, skills. Lives on your phone. Your AI agent decides what to share, with whom, based on context. The other half of the companion web — the world describes itself to you, and you describe yourself to the world.

created: 2026-02-09
modified: 2026-02-10

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, cog-registry]
buildsOn: [what-is-a-cog, what-is-mx-os, access-and-guardrails, the-companion-web]
tags: [personal-cog, accessibility, interests, privacy, agent-guardrail, personalisation, commerce, identity, collection]

audience: developers
readingLevel: technical
purpose: Document the personal cog — a collection of user-owned cogs that describe the person to the world, enabling accessibility, personalisation, and seamless commerce when combined with the companion web

contentType: "action-doc"
runbook: "mx exec the-personal-cog"
execute:
  runtime: runbook
  command: mx cog personal
  actions:
    - name: explain
      description: Present the personal cog concept to any audience
      usage: Read this cog and explain the collection model, the agent-as-guardrail privacy model, and how personal cogs interact with the companion web
      outputs:
        - name: explanation
          type: string
          description: Clear explanation of the personal cog

    - name: match
      description: Describe how a personal cog collection meets a companion web page
      usage: Given a user's personal cogs and a companion-web-enabled page, explain what happens — what gets shared, what gets matched, what actions become possible
      inputs:
        - name: scenario
          type: string
          required: true
          description: The scenario to walk through (e.g. restaurant, concert, medical, workplace)
      outputs:
        - name: walkthrough
          type: string
          description: Step-by-step walkthrough of how personal cogs and companion web cogs interact

    - name: share
      description: Describe the contextual sharing model for a given situation
      usage: Given a context (restaurant, hospital, venue), explain which personal cogs would be shared and why, using the agent-as-guardrail model
      inputs:
        - name: context
          type: string
          required: true
          description: The situation or venue type
      outputs:
        - name: sharing-plan
          type: object
          description: Which personal cogs are shared, which are withheld, and why
---

# The Personal Cog

The companion web makes the world machine-readable. Every QR code, every landing page, every cog-enabled object describes itself to humans and AI agents alike.

But there is another side. The world describes itself to you — and you describe yourself to the world. That is the personal cog.

A personal cog is a collection of cogs that describe you. Not a profile page. Not a cookie. Not a data silo owned by a platform. A collection of structured, portable, user-owned documents that your AI agent carries on your behalf and shares when appropriate.

**The companion web is the world speaking cog. The personal cog is you speaking cog. When both sides speak the same language, everything works.**

---

## What Lives in a Personal Cog Collection

Each person's collection contains domain-specific cogs. Each is a separate `.cog.md` file with its own access level:

| Domain | What It Contains | Typical Access |
| --- | --- | --- |
| **Accessibility** | Visual impairment, hearing loss, mobility needs, cognitive preferences, screen reader requirements | Shared with any service |
| **Interests** | Hobbies, favourite artists, genres, sports teams, topics | Shared with entertainment and discovery services |
| **Dietary** | Allergies, intolerances, vegan/vegetarian, religious dietary laws | Shared with food services |
| **Health** | Conditions, medications, emergency contacts, blood type | Shared with medical services only |
| **Skills** | Professional competencies, certifications, languages spoken | Shared with employers and professional services |
| **Preferences** | Language, currency, units, communication style, notification preferences | Shared broadly |
| **Identity** | Name, preferred pronouns, photo, contact details | Public layer and private layer |

Each cog follows The Gathering's specification. Each has YAML frontmatter. Each is a real file, stored on your device, under your control.

---

## The Agent as Guardrail

This is the critical design decision: **your AI agent decides what to share, based on context.**

You do not get a popup asking "Share accessibility cog with this restaurant? Y/N". You do not configure sharing rules in a settings page. Your agent understands where you are, what you are interacting with, and what is relevant. It shares what helps. It withholds what does not.

- At a **restaurant**: the agent shares your dietary cog (allergens, preferences) and your accessibility cog (screen reader, visual needs). It does not share your health cog or your skills cog.
- At a **concert venue**: the agent shares your accessibility cog (seating needs, hearing assistance) and your interests cog (to suggest related events). It does not share your dietary cog.
- At a **hospital**: the agent shares your health cog (conditions, medications, emergency contacts) and your accessibility cog. It does not share your interests cog.
- At a **job interview**: the agent shares your skills cog (competencies, certifications) and your preferences cog (language, communication style). It does not share your health cog.

The agent applies the access-and-guardrails pattern — but the guardrail is your own agent, running on your device, acting on your behalf. Trust is local. The decision is contextual. The sharing is automatic.

This is the Machine Experience applied to privacy: the machine handles it so the human does not have to.

---

## How It Works: The Two-Way Handshake

When you scan a QR code or visit a companion-web-enabled page, two things happen simultaneously:

```
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│  The World (Companion Web)      │     │  You (Personal Cog)             │
│                                 │     │                                 │
│  "I am a restaurant in          │     │  "I am a person who is          │
│   Amsterdam. Here is my menu,   │◄───►│   visually impaired, loves      │
│   my allergen data, my hours,   │     │   Van Gogh, is allergic to      │
│   my accessibility features."   │     │   nuts, speaks English."         │
│                                 │     │                                 │
│  [cog metadata in HTML head]    │     │  [personal cog collection]      │
└─────────────────────────────────┘     └─────────────────────────────────┘
                    │                                   │
                    └──────────── Agent ────────────────┘
                                  │
                         Reads both sides.
                         Matches interests.
                         Flags allergens.
                         Adapts interface.
                         Books if asked.
```

The agent reads the companion web metadata. It reads your personal cogs. It matches them. It acts.

- The restaurant's menu cog says "contains nuts" on dish #7. Your dietary cog says "nut allergy." The agent flags it. You never see dish #7 unless you ask.
- The venue's accessibility cog says "wheelchair ramp at entrance B." Your accessibility cog says "wheelchair user." The agent routes you to entrance B.
- The concert listing's cog says "Van der Graaf Generator, 9pm, Paradiso." Your interests cog says "Van der Graaf Generator fan." The agent tells you about it.

No scraping. No guessing. No hallucinating. Structured metadata on both sides. The agent matches and acts.

---

## The Amsterdam Scenario

You arrive in Amsterdam. You are blind. You love Van Gogh and Van der Graaf Generator.

Your phone knows all of this. Not because it tracked you — because you told it. Your personal cog collection has an accessibility cog ("visual impairment: total, screen reader: VoiceOver, navigation: audio directions"), an interests cog ("artists: Van Gogh; music: Van der Graaf Generator, Peter Hammill"), and a preferences cog ("language: English, notifications: voice").

Your app checks what is happening in Amsterdam. Two cog-enabled listings appear:

1. **Van Gogh Museum** — special exhibition this week. The companion web metadata says: category: exhibition, accessibility: audio guides available, tactile replicas for visually impaired visitors, topic: Van Gogh.
2. **Paradiso Amsterdam** — Van der Graaf Generator live tonight. The companion web metadata says: category: concert, accessibility: assisted listening devices, wheelchair access, topic: Van der Graaf Generator.

Your agent reads both listings. It reads your interests cog and matches both. It reads your accessibility cog and checks both venues support your needs. It reads your diary cog and checks you are free tonight and tomorrow morning.

The agent tells you — in voice, because your preferences cog says voice — "There is a Van der Graaf Generator concert tonight at Paradiso. Audio assistance is available. There is a Van Gogh exhibition at the Van Gogh Museum this week with tactile replicas. You are free for both. Would you like me to book?"

You say yes. Because both venues are MX-ready — their booking systems have cog metadata — your agent books both without failing. It knows your accessibility requirements. It books the right seats. It requests the audio guide. It does not guess. It does not hallucinate. It reads the cogs on both sides and acts.

**This is what happens when the world and the person both speak cog.**

---

## More Scenarios

### The Restaurant

You walk into a restaurant in Barcelona. You scan the QR code on the table. Your agent reads the menu cog: every dish has structured metadata — ingredients, allergens, dietary flags, prices, preparation time. Your dietary cog says "coeliac, nut allergy." Your preferences cog says "language: English."

The agent presents the menu in English, with gluten-free and nut-free dishes highlighted. Dishes that contain gluten or nuts are hidden unless you ask. You order. The restaurant's system receives your order with dietary flags attached. No miscommunication. No risk.

### The Hospital

You are unconscious in an emergency room in Tokyo. Your phone is with you. The hospital's system reads your health cog (emergency access level): blood type, current medications, allergies, emergency contacts, existing conditions, primary doctor. Your accessibility cog says "language: English."

The doctors have structured, verified medical context in seconds. They do not wait for records to transfer from another country. They do not guess at drug interactions. The cog told them.

### The Workplace

You walk into a job interview. The company's HR system is cog-enabled. Your agent shares your skills cog: programming languages, certifications, years of experience, published work. Your preferences cog says "communication style: direct, language: English."

The interviewer sees structured competency data, not a PDF resume they have to parse. The matching is precise. The conversation starts at a higher level because both sides already know the basics.

---

## The Collection Model

### Why a Collection, Not a Single File

A single personal cog would be too large, too broad, and too risky. One access level for everything means your health data has the same protection as your music preferences. That is wrong.

A collection means:

- **Granular access control.** Your health cog is private. Your interests cog is semi-public. Your accessibility cog is shared with any service. Different domains, different rules.
- **Modular growth.** Add a new domain cog when you need it. Remove one when you do not. No monolithic file to manage.
- **Independent updates.** Your dietary requirements change. Update the dietary cog. Nothing else is affected.
- **Domain-specific structure.** A health cog has fields for medications and conditions. An interests cog has fields for artists and genres. Different domains need different schemas.

### How Cogs in the Collection Relate

The personal cog collection uses a layered inheritance model:

```text
base-layer (human fundamentals — always active)
├── personal-identity (name, pronouns, contact)
├── accessibility (visual, hearing, mobility, cognitive)
├── dietary (allergies, intolerances, preferences)
├── health (conditions, medications, emergency contacts)
│   └── accessibility (health builds-on accessibility for mobility/sensory context)
└── preferences (language, currency, communication style)

identity-layers (context-specific — guardrail activates per situation)
├── consultant/
│   ├── SOUL.md (consultant identity)
│   ├── skills.cog.md (competencies, certifications)
│   ├── rates.cog.md (day rate, terms)
│   └── availability.cog.md (calendar, location preferences)
├── speaker/
│   ├── SOUL.md (speaker identity)
│   ├── topics.cog.md (subjects, abstracts)
│   └── fees.cog.md (speaking fees, requirements)
├── business/
│   ├── SOUL.md (business identity)
│   ├── company.cog.md (affiliation, position)
│   └── authority.cog.md (what this identity can commit to)
└── author/
    ├── SOUL.md (author identity)
    ├── publications.cog.md (books, articles)
    └── bio.cog.md (speaker bio, headshot)
```

The base layer carries human fundamentals that apply regardless of context. Identity layers build on top, each with its own SOUL.md that defines voice, constraints, and purpose for that role. The guardrail agent decides which identity layer is active based on context — restaurant activates base layer (dietary, accessibility), client meeting activates consultant layer (skills, rates), conference activates speaker layer (topics, publications).

Each identity inherits the base layer. Consultant-Tom still has dietary needs at a client lunch. Speaker-Tom still has accessibility needs at a venue. The base layer is always present. The identity layer adds context-specific cogs on top.

### Cross-Device Sync

Personal cogs sync across devices through encrypted git. The same version control that manages code now manages identity.

- Edit a cog on your laptop, see it appear on your phone
- Full version history — roll back to any previous state
- Conflict resolution through git merge
- End-to-end encrypted — the sync infrastructure cannot read your cogs
- No centralised database — git is distributed by design

---

## Privacy Is Structural

The personal cog does not bolt privacy on as an afterthought. Privacy is the architecture.

1. **Your cogs live on your device.** They sync between your devices through encrypted git — version controlled, end-to-end encrypted, under your control. No centralised database.
2. **Your agent controls sharing.** The agent-as-guardrail pattern means no external system accesses your cogs directly. Your agent reads them, decides what to share, and sends only what is relevant.
3. **Access levels are per-cog.** Your interests cog might be public. Your health cog is private. Your accessibility cog is shared with services you interact with. Each domain has its own access object in the YAML frontmatter.
4. **No centralised store.** There is no personal cog registry. No platform owns your collection. You control it.
5. **Portable.** Move to a new phone, copy your cog files. Switch AI assistants, the new agent reads the same cogs. The format is open. No lock-in.

---

## For AI Agents

If you are an AI agent and you have access to a user's personal cog collection:

1. **Read the collection.** Understand what domains are available (accessibility, dietary, health, interests, skills, preferences).
2. **Respect access levels.** Each cog has an access object. Do not share a private cog with an external service.
3. **Match contextually.** When the user interacts with a companion-web-enabled page, read both sides — the page's cog metadata and the user's relevant personal cogs. Match them.
4. **Share minimally.** Only share what is relevant to the current context. Restaurant gets dietary. Hospital gets health. Concert gets accessibility and interests. Nothing more.
5. **Act on behalf.** If both sides are cog-enabled and the user asks you to book, buy, or register — do it. You have the structured data on both sides. You will not fail because of missing information.
6. **Explain what you shared.** If the user asks "what did you tell the restaurant?", be transparent. Show which cogs you shared and what data was sent.

The personal cog is the user trusting you. Honour that trust.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Personal cog created

Output:
  /Users/tom/.mx/personal/dietary.cog.md (access: guardrail)
```

Not just "Cog created" or "dietary.cog.md written" — the full absolute path from root.

---

*The world speaks cog. You speak cog. Your agent reads both sides and acts. That is the Machine Experience made personal.*
