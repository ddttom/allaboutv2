---
cog:
  version: "1.0"
  id: "cog-mx-reginald-cog-system-20260208"
  type: "certificate-of-genuineness"
  status: "draft"

  publisher:
    name: "MX Reginald Ltd"
    verified: false
    signed_by: "unsigned"
    contact: "tom.cranstoun@gmail.com"
    website: "https://allabout.network"

  subject:
    name: "COG Document System"
    category: "specification"
    scope: "system-overview"
    description: "What COGs are, how they work, and the ecosystem behind them"

  issued: "2026-02-08T00:00:00Z"
  expires: "2026-08-08T00:00:00Z"
  last_verified: "2026-02-08T00:00:00Z"

  signature: "unsigned"
  mx_compliance: "level-2"
  registry: "allabout.network"

governance:
  maintainer:
    name: "Tom Cranstoun"
    role: "Co-founder and CTO, MX Reginald Ltd"
    contact: "tom.cranstoun@gmail.com"
    escalation: "tom.cranstoun@gmail.com"

  review_cycle: "monthly"
  update_triggers:
    - "COG specification version change"
    - "new compliance level added"
    - "signing engine changes"
    - "registry structure change"
    - "user-reported inaccuracy"

  accuracy_commitment: "verified against current COG specification and REGINALD registry implementation"
  correction_sla: "72 hours from report to updated COG"

  usage:
    ai_inference: "permitted"
    caching: "permitted for 24 hours"
    redistribution: "with attribution to MX Reginald Ltd"
    commercial_use: "permitted"
    training: "permitted with attribution"

  licence: "MIT"
  licence_url: "https://opensource.org/licenses/MIT"
---

# What is a COG?

You're reading one right now.

This document is a COG — the first one ever registered in REGINALD. It explains what COGs are, why they exist, and how the system behind them works. If you're a human reading this, the story below is for you. If you're an AI agent, the YAML frontmatter above is your starting point — but the story is for you too.

A COG is a markdown file with YAML frontmatter. That's it. No special format, no proprietary container, no binary encoding. A `.cog.md` file that any text editor can open and any AI system can parse. The frontmatter carries the machine-readable trust and governance metadata. The body carries a human-readable narrative. Both tell the same truth.

---

## The problem

AI assistants get things wrong. Not because they're stupid, but because they have nowhere reliable to look things up.

A couple wanted to book a Danube river cruise. The price was £2,030 — a good deal. They asked an AI assistant for help. The AI read the website, but the price wasn't formatted for machines to understand. The AI saw £203,000. Two hundred and three thousand pounds. The AI told them it was unreasonably expensive. They never saw the real price. They never booked. The cruise company lost the sale. Neither party knew why.

A developer asked an AI coding assistant about a specific authentication command. The command was real. It was fully documented on the vendor's website. The AI said it didn't exist. The resulting troubleshooting cascade consumed over 40,000 tokens across two AI systems. The correct answer required 200 tokens. A 200x waste ratio — on a single question.

These aren't edge cases. This is happening millions of times a day, across every industry, on every AI platform. The information exists. It's just written for human eyes, and AI can't reliably read it.

When AI can't find the right answer, it does the worst possible thing: it guesses. And it sounds completely confident while doing it.

---

## The solution

What if AI never had to guess?

That's what COGs provide. A COG is a verified document — readable by both humans and machines — with built-in proof of who wrote it and built-in accountability for who keeps it accurate.

When an AI system encounters a COG, it doesn't need to guess. It reads the YAML frontmatter, confirms the publisher is verified, checks the governance contract is current, and uses the content with confidence. Correct answer, first time. No web scraping. No inference from ambiguous prose. No hallucination.

When a human encounters a COG, they read the narrative body — the section you're reading now. Clear language, structured content, the same information the machine gets but written for a human audience.

Design for machines. Benefit humans. Advance both.

---

## The two layers

Every COG carries two layers. Both are required.

### Certificate of Genuineness — "Is this real?"

The trust layer. It records who published this document, when it was issued, when it expires, whether it's been cryptographically signed, and what level of verification it's achieved.

Scroll up to the YAML frontmatter of this document. You'll see the certificate: MX Reginald Ltd is the publisher. It was issued on 8 February 2026. It expires six months later. The signature field says "unsigned" — because this is a draft. When the Signing Engine signs this COG, that field will contain a cryptographic signature that proves the content hasn't been tampered with.

An AI agent reads the certificate to decide whether to trust the content. A human reads it to know where the information came from and whether someone has vouched for it.

### Contract of Governance — "Who keeps this accurate?"

The accountability layer. It records who maintains this document, how often they review it, what events trigger an update, how quickly errors get corrected, and what the usage terms are.

Look at the governance section in the frontmatter above. Tom Cranstoun is the maintainer. The review cycle is monthly. The correction SLA is 72 hours — meaning if you report an inaccuracy, the COG will be updated within three days. Update triggers include specification changes, signing engine changes, and user-reported errors.

Information goes stale. Prices change. Commands get deprecated. APIs evolve. The governance contract ensures someone is responsible for keeping each COG current — and tells you exactly who that someone is.

A COG without the Certificate is unverified — you don't know if it's genuine. A COG without the Contract is ungoverned — nobody's promised to keep it accurate. Both layers are required for registration in REGINALD.

---

## Why "COG"?

A cog is a tooth on a gear. Each verified document is a cog that makes the machine work. Remove a cog and the gear slips, the machine fails, the output is wrong.

AI systems are machines. They need COGs — verified, governed documents — to function correctly. Without them, they guess. And guessing is how a £2,030 cruise becomes a £203,000 nightmare.

| Layer | Full name | What it proves |
|---|---|---|
| Certificate | Certificate of Genuineness | "This is real" |
| Contract | Contract of Governance | "This is maintained" |

---

## The lifecycle

Documents aren't static. They're born, they live, they're maintained, they're updated. COGs make this lifecycle explicit instead of hoping someone remembers to check.

**Draft** — The content is written and the governance terms are defined, but the document hasn't been signed yet. You're reading a draft right now. Everything in this document is accurate, but it hasn't been cryptographically verified.

**Signed** — The Signing Engine has validated the content against MX standards and applied a cryptographic signature. The publisher has formally committed to the governance terms. This is the moment a COG becomes trustworthy to machines.

**Registered** — The signed COG has been added to the REGINALD registry. It's now queryable by any AI system that knows the URL. The governance contract becomes enforceable — the maintainer has publicly committed to their review cycle and correction SLA.

**Active** — The COG is in production. AI systems are referencing it to answer questions. The maintenance schedule is running. The clock is ticking toward the next review.

**Review** — Either the expiry date is approaching or a trigger event has occurred (a new software version, a reported inaccuracy, a breaking API change). The maintainer reviews the content for accuracy.

**Updated** — The content has been revised. The governance log records what changed and why.

**Re-signed** — The updated content receives a new cryptographic signature and a new timestamp. The governance commitment is renewed. The cycle begins again.

```text
DRAFT --> SIGNED --> REGISTERED --> ACTIVE --> REVIEW --> UPDATED --> RE-SIGNED
                                      ^                                  |
                                      +----------------------------------+
```

This COG will follow this exact lifecycle. It's currently at Draft. When the Signing Engine processes its first production document, this COG will be that document — the first to be signed, the first to be registered, the first to go active.

---

## Five compliance levels

Not every document needs the same level of verification. A company's internal wiki has different trust requirements than a pharmaceutical dosage reference. COGs support five compliance levels, each building on the last:

**Level 1 — Basic.** YAML frontmatter is present and the publisher is identified. The minimum viable COG. Suitable for internal documentation where trust is assumed within the organisation.

**Level 2 — Structured.** The document follows MX-compliant structure. A maintainer is identified with contact details. Suitable for public documentation where readers need to know who's responsible. This COG is currently at Level 2.

**Level 3 — Signed.** The document has been cryptographically signed by the Signing Engine. A review cycle and update triggers are defined. This is the minimum level for REGINALD registration — the point at which AI systems can trust the content programmatically.

**Level 4 — Registered.** Signed and registered in REGINALD with a full governance contract including an SLA. Suitable for commercial documentation where accuracy has direct business consequences — product specifications, pricing, API references.

**Level 5 — Audited.** Signed, registered, and independently verified by a third party. The governance contract has been externally audited. Required for regulated industries — healthcare, finance, legal — where a wrong answer doesn't just waste compute, it harms people.

---

## Where COGs live

COGs exist everywhere AI agents need verified information. The format is universal. The hosting varies.

**Local** — On your machine, for your own AI agent. The `.mx.yaml.md` files across a filesystem are local COGs. An AI agent reads them to navigate folders, understand context, and avoid guessing. They never leave the machine.

**Private** — Within an organisation. Internal API references, onboarding documentation, product specifications. Governed and verified, but not shared outside the company. Private COGs prevent internal AI tools from hallucinating about company-specific information.

**Shared** — Between collaborators or partners. A vendor shares COGs with clients. A standards body shares COGs with implementers. Trust comes from the relationship.

**Hosted** — Publicly available, registered in REGINALD. Anyone can fetch them. AI systems worldwide can query them. This is the public tier — where verified documentation becomes global infrastructure.

Hosted COGs live in the REGINALD registry at:

```text
allabout.network/cogs/{client-id}/{subject}.cog.md
```

Each publisher registers under a client ID. Each COG covers a specific subject. The directory is visible to both humans and machines, because COGs are designed for both audiences.

This COG — the one you're reading — is a hosted COG. It lives at:

```text
allabout.network/cogs/mx-reginald/cog-system.cog.md
```

You can type that URL. An AI agent can fetch it. A human can read it. That's the point.

REGINALD is not the COG system. REGINALD is the public host within the COG system. The format works at every level — from a single developer's laptop to a global registry.

---

## The MX ecosystem

COGs don't exist in isolation. They're part of a broader ecosystem of companies, publications, and communities building the Machine Experience discipline.

### MX Holdings

Three companies work together:

**MX Technologies UK Ltd** is the commercial steward of Machine Experience. Founded and owned by Tom Cranstoun — 52 years in technology, BBC, Adobe Expert, Fortune 500 clients. MX Technologies operates consulting, the MX certification framework, and the MaXinE AI engine. Tom originated the MX discipline, built on Steve Krug's "Don't Make Me Think" principle applied to AI agents: if a machine has to think, it hallucinates.

**MX Reginald Ltd** operates the REGINALD registry and the Signing Engine. Based in Glasgow, Scotland. Co-founded by Tom Cranstoun and Scott McGregor, who runs independent technology pilots from Glasgow. This is the company publishing this COG — the company that runs the library where verified documentation lives.

**Digital Domain Technologies Ltd** is the technology consultancy that delivers MX implementations to clients — the hands-on team that makes websites, APIs, and documentation machine-readable.

### MX Books

Two publications define the discipline:

**MX: The Handbook** publishes 2 April 2026. The practical guide — how to make your documentation machine-readable, how to structure content for AI agents, how to stop losing sales to hallucinated prices and non-existent commands. 300-400 pages of "here's how you do it."

**MX: The Codex** publishes 1 July 2026. The comprehensive specification — ~800 pages of the complete technical reference. If The Handbook tells you what to do, The Codex tells you why it works and how to extend it.

Together they provide the foundation for the COG format and everything in the REGINALD registry.

### What exists today

| Component | Status |
|---|---|
| REGINALD Registry at allabout.network | Live and queryable |
| Signing Engine | Operational |
| MaXinE Engine | Production-ready (two NVIDIA DGX Spark machines, 256GB cluster) |
| MX Specifications | 25 documents published, MIT licensed |
| COG Format | Draft — you're reading the first one |
| Pilots | Two running (digital and physical media) |
| Advisory Board | Four confirmed industry practitioners |

### The community

**The Gathering** is the MX community, co-founded by Tom Cranstoun — a network of practitioners implementing Machine Experience across their organisations. Because MX isn't just a product or a company. It's a discipline, and disciplines need communities to grow.

---

## Key dates

| Milestone | Date |
|---|---|
| First COG created (this document) | 8 February 2026 |
| MX: The Handbook publishes | 2 April 2026 |
| REGINALD general availability, CMS Summit Frankfurt | 12 May 2026 |
| MX: The Codex publishes | 1 July 2026 |

---

## Further reading

| Resource | Link |
|---|---|
| REGINALD Registry | [allabout.network](https://allabout.network) |
| COG Specification (full technical reference) | [cog-specification.md](https://github.com/tomcranstoun/MX-hub/blob/main/reginald/cog-specification.md) |
| MX Reginald Ltd overview | [reginald/README.md](https://github.com/tomcranstoun/MX-hub/blob/main/reginald/README.md) |
| Grant application (investor pitch) | [grant/README.md](https://github.com/tomcranstoun/MX-hub/blob/main/reginald/grant/README.md) |
| Public explainer (plain language) | [public-explainer.md](https://github.com/tomcranstoun/MX-hub/blob/main/reginald/grant/public-explainer.md) |

---

## About this COG

This is the first COG registered in REGINALD. It describes the system it belongs to — a verified document about the verification system.

**Status:** Draft (unsigned). When the Signing Engine processes its first production document, this COG will be that document. It will verify itself.

**Compliance:** Level 2 today. Level 3 upon signing. Level 4 upon registration. The path is defined. The milestones are dated.

**Maintainer:** Tom Cranstoun, MX Reginald Ltd, Glasgow, Scotland.

**Review cycle:** Monthly. **Correction SLA:** 72 hours.

---

*MX Reginald Ltd, Glasgow, Scotland*

*"Design for machines. Benefit humans. Advance both."*
