---
description: "The Machine Experience vision — why it exists, the problem it solves, the system it builds. From inference to certainty. From guessing to knowing."
author: Tom Cranstoun
created: 2026-02-20
modified: 2026-03-02
version: "1.0"

mx:
  status: draft
  category: vision
  tags: [mx, vision, machine-experience, foundational]
  cogId: "cog-mx-vision-20260220"
  cogType: "certificate-of-genuineness"
  license: "MIT"

  publisher:
    name: "Cog-Nova-MX Ltd"
    verified: false
    signedBy: "unsigned"
    contact: "tom.cranstoun@gmail.com"
    website: "https://allabout.network"

  subject:
    name: "The MX Vision"
    category: "vision"
    scope: "foundational"
    description: "The Machine Experience vision — why it exists, the problem it solves, the system it builds. From inference to certainty. From guessing to knowing."

  publicationDate: "2026-02-20"
  expires: "2026-08-20"
  lastVerified: "2026-02-20"
  signature: "unsigned"
  mxCompliance: "level-2"
  registry: "allabout.network"

  ai:
    contextProvides: "Complete MX vision narrative — origin, principles, architecture, ecosystem, business case, and roadmap"
    contextRequired: "None — this is the starting point"

  maintainer:
    name: "Tom Cranstoun"
    role: "Founder, Cog-Nova-MX Ltd"
    contact: "tom.cranstoun@gmail.com"
    escalation: "tom.cranstoun@gmail.com"

  reviewCycle: "monthly"
  updateTriggers:
    - "major milestone achieved"
    - "vision refinement from field experience"
    - "new publication or presentation"
    - "user-reported inaccuracy"
    - "market development that validates or challenges the vision"

  accuracyCommitment: "reflects current strategic vision as of issue date"
  correctionSla: "72 hours from report to updated COG"

  usage:
    sopInference: "permitted"
    caching: "permitted for 24 hours"
    redistribution: "with attribution to Cog-Nova-MX Ltd"
    commercialUse: "permitted"
    aiTraining: "permitted with attribution"
---

# The MX Vision

## Prologue: The moment everything changed

February 2024. CMS Kickoff, Florida. The biggest gathering of content management professionals in the industry. Every panel, every keynote, every hallway conversation pointed the same direction: AI will write our content for us. Generative AI was the future. Content creation was about to be automated.

One consultant sat in the audience and saw something different.

Tom Cranstoun had spent 47 years building content systems. He'd written assembler code in 1977. Co-authored Superbase, a million-selling database, before "CMS" was even a term. Built the BBC's global news distribution system that served journalists worldwide. Implemented the world's largest Adobe Experience Manager deployment for Nissan-Renault — 200+ websites across dozens of languages. Led enterprise implementations for Twitter, Ford Europe, EE, MediaMonks. Mentored 150+ professionals. Won awards for creative, cost-saving digital solutions.

He'd seen every content revolution the industry had produced. And at CMS Kickoff 2024, listening to yet another panel about AI generating content, he realised everybody was looking the wrong way.

**AI should read content, not create it.**

AI-generated content has fundamental problems — style guides, brand voice, bias, regulation, hallucination, copyright. These problems are hard and mostly unsolved. But AI *consuming* content? That was the real transformation. And it was already happening. At scale. Right now. Badly.

He couldn't stop taking notes. His brain was on fire.

That was the day Machine Experience was born.

---

## Part I: The problem

### 1.5 million models, all guessing

There are 1.5 million models on Hugging Face alone. More inside corporations. Every major tech company runs multiple foundation models. Startups build specialised models for every conceivable domain. The number grows daily.

Every one of these models contains a randomiser — technically called temperature — that makes every answer to every prompt unique and interesting. Vary the temperature and you get different responses to identical questions. This is a feature for creative writing. It is a catastrophe for business.

When a customer asks an AI agent "How much does this cruise cost?" the answer should be the same every time. £2,030. Not £203,000. Not "approximately two thousand pounds." Not a hallucinated price from a competitor's website. The same answer. Every time.

But that's not what happens.

### The anatomy of a failure

A couple wanted to book a Danube river cruise. The price was £2,030 — a perfectly reasonable deal. They asked an AI assistant for help. The AI read the website, but the price wasn't formatted for machines to understand. European number formatting used dots where British formatting uses commas. There was no Schema.org structured pricing data. No range validation. No comparison data. No machine-readable currency indication.

The AI saw £203,000. Two hundred and three thousand pounds per person.

The AI told them it was unreasonably expensive. They never saw the real price. They never booked. The cruise company lost the sale. Neither party knew why.

This is not an edge case. This is the default.

A developer asked an AI coding assistant about a specific authentication command. The command was real. Fully documented on the vendor's website. The AI said it didn't exist. The resulting troubleshooting cascade consumed over 40,000 tokens across two AI systems. The correct answer required 200 tokens. A 200x waste ratio — on a single question. Because the documentation was written for human eyes, and the AI couldn't reliably extract the answer.

These failures happen millions of times per day. Across every industry. On every AI platform. The information exists. It's just not machine-readable.

### What happens when AI can't find the answer

When an AI agent reads a web page and can't find structured, verified information, it does two things:

**It infers.** It guesses what the content means based on patterns it learned during training. "This number near a currency symbol probably means..." Every inference costs compute. Every inference costs energy. Every inference risks being wrong. And every inference is delivered with the same confidence as a verified fact.

**It hallucinates.** It fills gaps with plausible-sounding fiction. Not because it's broken — because that's literally how it works. Large language models are next-token prediction engines. They predict the most statistically likely next word. When the facts aren't available, statistical likelihood produces fabrication. Confident, articulate, authoritative fabrication.

Tom calls it the eight-year-old analogy. AI behaves like an eight-year-old searching for toys online. Simple. Direct. It ignores brands, retailers, dropdowns, videos, animations, marketing copy, cookie banners, promotional overlays, and carefully crafted user journeys. It will skim-read if it can find content among the ads. It doesn't care about your brand guidelines. It doesn't respond to your A/B-tested call-to-action buttons. It doesn't experience your "brand journey."

It wants the answer. If the answer isn't there in a form it can read, it guesses. And it sounds completely confident while doing it.

**This is how trust erodes. Not through spectacular crashes, but through small, plausible errors delivered authoritatively.**

### The invisible users

In January 2026, Tom presented "Websites That Work Perfectly — Until They Don't" at Boye & Company's CMS Experts Group. He introduced the concept of **invisible users** — groups systematically overlooked in web design.

Blind users have lived with this for decades. Websites that look stunning are functionally useless because they rely on visual signals that screen readers can't perceive. Toast notifications that flash and vanish. State locked in client-side JavaScript. Feedback that requires eyes to interpret. Navigation that requires a mouse. Content that only exists after JavaScript execution.

AI agents now face exactly the same problems. At exactly the same scale.

- **Non-semantic HTML** — looks fine visually, incomprehensible to machines
- **Content behind JavaScript** — invisible until executed (and many agents don't execute JavaScript)
- **Application state in client-side code** — agents can't access session state
- **Feedback that flashes and vanishes** — toast notifications are invisible to agents
- **Visual-only cues** — colour coding, positioning, animation carry no semantic meaning

These are not new problems. They are well-understood problems that the web has known how to solve for years. What changed is who is now affected. When only blind users were impacted, the pressure to act was insufficient. Now AI agents — representing billions of dollars in commercial transactions — are impacted. The same problems, newly exposed at scale.

"The web has known how to do better for a long time. We simply did not feel enough pressure to act."

### The numbers

The commercial impact is already measurable:

- **AI crawlers** now represent ~28% of Googlebot traffic
- **$156B+** invested in generative AI search in 2023 alone
- **700% surge** in AI referrals to retail sites (Adobe Holiday 2025 data)
- **500% increase** in travel referrals from AI agents
- **30% higher conversion rates** from AI-referred visitors vs human traffic
- **50% longer site engagement** from agent-referred visitors

Amazon Alexa+, Microsoft Copilot Checkout, and Google Universal Commerce Protocol all launched within 7 days of each other in January 2026. The agents using these platforms are learning RIGHT NOW which sites work reliably. Which sites give them the information they need. Which sites let them complete transactions.

Sites that work for agents are remembered and preferred. Sites that don't are quietly avoided. **And you'll never see the traffic that didn't arrive.** No analytics. No bounce rate. No session recording. The traffic simply never comes. The revenue simply never appears. The competitive position simply erodes. Invisibly.

First-mover advantage is already being decided. This isn't future. This is now.

---

## Part II: The insight

### The convergence principle

Here is the insight that connects everything — the founding principle of Machine Experience:

**Patterns that work for AI agents also work for humans.**

Semantic HTML that helps AI parse content? It's the same HTML that screen readers need. Explicit state that helps AI understand what's happening? It's the same explicit state that helps users with cognitive disabilities. Structured metadata that helps AI find prices? It's the same structured data that helps comparison shoppers. Persistent feedback instead of toast notifications? That helps everyone.

This is not a coincidence. It's a design truth. The web was built on open standards — HTML, HTTP, URLs — specifically so that any client could access any content. Screen readers, mobile browsers, search engine crawlers, and now AI agents are all clients. They all need the same thing: semantic structure, explicit state, machine-readable data.

**MX is accessibility 2.0.** Not a replacement for accessibility. Not a competing standard. The recognition that AI readiness and accessibility are the same set of practices viewed from different angles.

Accessibility improved when it got ownership — WCAG standards, dedicated teams, legal requirements, review processes. When accountability was diffuse, progress stalled. Machine Experience builds on exactly the same competencies — accessibility, QA, structured content, semantic HTML. What's missing is mandate, not skill.

MX is that mandate.

### Two years ahead

Tom published his first article about this in February 2024. The industry caught up in January 2026 — when Amazon, Microsoft, and Google simultaneously launched AI agent commerce platforms.

| Date | Publication | Key insight |
|---|---|---|
| Feb 2024 | CMS Critic: "AI Tipping Point" | AI should read content, not create it |
| 2024 | LinkedIn Pulse | AI-centric CMS as next evolution after responsive design |
| Jan 2025 | allabout.network | "What's the impact of the new Robot-First Web?" |
| Feb 2025 | allabout.network | "From Skeptic to Convert" |
| Jan 2026 | Boye & Company | "Websites That Work Perfectly — Until They Don't" |
| Jan 2026 | Market catches up | Amazon, Microsoft, Google launch AI agents simultaneously |

Two years of published thinking before anyone else noticed the problem. The evolution is visible in the titles — from skeptic to convert to thought leader. From questioning AI to understanding its proper role. From observing the problem to building the solution.

### The evolution: robots.txt → llms.txt → COGs

The web's relationship with machines has evolved through three eras:

**robots.txt (1994)** — Exclusion. "Don't crawl this page." Binary permissions. A machine asks for access; the server says yes or no. No nuance, no guidance, no trust.

**llms.txt (2024)** — Inclusion. "Here's what you should know about us." Proactive AI guidance. A machine reads a file that explains what the site contains and how to consume it. Better than exclusion, but still unverified. Anyone can write anything in an llms.txt file.

**COGs (2026)** — Verification. "Here's verified information you can trust, with accountability for keeping it accurate." Signed documents with governance contracts. The machine reads the YAML frontmatter, confirms the publisher, checks the governance terms, and uses the content with confidence. Correct answer. First time. No guessing.

This is the progression from "go away" to "come in" to "here's the truth, verified and maintained."

---

## Part III: The solution

### Reduce inference

Every decision in MX traces back to one principle: **reduce inference.**

If understanding requires inference, rewrite it. If a machine has to guess, you've failed. State it plainly. Verify it. Govern it. Register it.

Inference costs compute. Reduce inference, reduce cost.
Inference costs energy. Reduce inference, reduce environmental impact.
Inference costs trust. Reduce inference, get better results.
Inference costs sales. Reduce inference, stop losing customers.

This is Principle Zero — the principle that precedes all other principles:

> **Reduce Inference.** Make everything explicit. If understanding requires inference, rewrite it. Readers (human or machine) should never have to guess, deduce, or fill in gaps. State it plainly.

### Absorb, don't invent

And Principle Zero-B:

> **Absorb, Don't Invent.** We are the Borg. We absorb and re-use anything that previously exists and that humans and/or machines already understand. Schema.org, WCAG, semantic HTML, YAML, Markdown, .gitignore patterns, llms.txt for repo descriptions — we inherit, we adapt, we reference. We never reinvent the wheel. Existing standards become blocks in MX. We assimilate what works.

MX is not a new standard competing with existing standards. MX is a discipline that uses every existing standard and makes them work together. Schema.org for structured data. WCAG for accessibility. Semantic HTML for structure. YAML for metadata. Markdown for human-readable prose. Git for version control. MIT licence for openness. Standards over proprietary. Always.

### The three steps from inference to certainty

The path unfolds in three steps. Each one reduces inference. Each one saves energy. Each one moves closer to a world where AI doesn't have to guess.

#### Step 1: Mark what's real

QR codes. Signed pages. Verified metadata. Schema.org structured data. Semantic HTML. A simple declaration: "This information is confirmed by X."

The AI is free to ignore it, reinterpret it, infer around it. But we've given it a signal — a small chance of reducing inference and energy and getting better results. The signal is cheap. The alternative — unbounded guessing — is expensive.

This is where it starts. Not with a product. With a practice. With the recognition that machines are reading your content RIGHT NOW, and you can either help them get it right or leave them to guess.

A product page with `"price": "2030", "priceCurrency": "GBP"` in Schema.org JSON-LD costs almost nothing to implement. It eliminates the £203,000 pricing error permanently. For every AI agent. Forever.

#### Step 2: Turn prompts into scripts — this is the cog

A complex prompt can be wildly hallucinated. A small one most definitely is hallucinated. But once a prompt has worked — once you've found the right words to get the right result — why let the machine infer it again?

Turn it into a script. A repeatable, verified set of instructions that the machine runs without inference, without wasted energy. No guessing. No temperature. No randomisation. Just execution.

**This is called a cog.**

A `.cog.md` file. Markdown with YAML frontmatter. That's it. No special format, no proprietary container, no binary encoding. Any text editor can open it. Any AI system can parse it. The frontmatter carries machine-readable trust and governance metadata. The body carries a human-readable narrative. Both tell the same truth.

A cog can be local to a repo. Local to a machine. Local to a folder or a file. **It's cogs all the way down.**

Every cog carries two layers:

**Certificate of Genuineness — "Is this real?"**
The trust layer. Who published this. When it was issued. When it expires. Whether it's been cryptographically signed. What level of verification it's achieved. An AI agent reads the certificate to decide whether to trust the content.

**Contract of Governance — "Who keeps this accurate?"**
The accountability layer. Who maintains this. How often they review it. What triggers an update. How quickly errors get corrected. What the usage terms are. Information goes stale. The governance contract ensures someone is responsible for keeping each cog current.

A cog without the Certificate is unverified — you don't know if it's genuine. A cog without the Contract is ungoverned — nobody's promised to keep it accurate. Both layers are required.

The insight that makes cogs revolutionary:

> "The skill is thin. The doc is the program. I am the runtime."
>
> "Documentation IS the system. Metadata IS the interface. AI IS the runtime."

When an AI agent encounters a cog, it doesn't need to guess. It reads the YAML frontmatter, confirms the publisher is verified, checks the governance contract is current, and uses the content with confidence. Correct answer, first time. No web scraping. No inference from ambiguous prose. No hallucination.

When a human encounters a cog, they read the narrative body — clear language, structured content, the same information the machine gets but written for a human audience. Design for both.

#### Step 3: Publish, sign, verify — this is REGINALD

Publish the cogs and they become **Certificates of Genuineness**. They don't need scripts — they can be purely informative. A COG that says "this product costs £2,030" with a verified publisher and a governance contract is worth more than a thousand web pages that an AI has to scrape and guess at.

Sign them cryptographically. The Signing Engine validates the content against MX standards and applies a signature that proves the content hasn't been tampered with.

Register them in a global registry where any AI agent can look them up and get the right answer first time.

**The registry is called REGINALD. npm for the document web.**

Every cog registered in REGINALD is one fewer guess. One fewer hallucination. One fewer £200,000 pricing error. One fewer 40,000-token troubleshooting cascade for a 200-token answer.

REGINALD is not the cog system. REGINALD is the public host within the cog system. The format works at every level — from a single developer's laptop to a global registry.

```
allabout.network/cogs/{client-id}/{subject}.cog.md
```

You can type that URL. An AI agent can fetch it. A human can read it. That's the point.

### Five compliance levels

Not every document needs the same level of verification. A company's internal wiki has different trust requirements than a pharmaceutical dosage reference.

| Level | Name | Requirements | Use case |
|---|---|---|---|
| 1 | Basic | YAML frontmatter present, publisher identified | Internal documentation |
| 2 | Structured | MX-compliant structure, maintainer identified | Public documentation |
| 3 | Signed | Cryptographically signed, review cycle defined | Minimum for REGINALD registration |
| 4 | Registered | Full governance contract with SLA | Commercial documentation with business consequences |
| 5 | Audited | Independently verified by third party | Regulated industries — healthcare, finance, legal |

The barrier to entry is Level 1: add YAML frontmatter. You have a cog. Then improve over time. Every metadata field you add is a question an AI agent doesn't have to answer by reading your prose.

### Where cogs live

**Local** — On your machine, for your own AI agent. The `.cog.md` files across a filesystem are local cogs. They never leave the machine. Privacy is architectural.

**Private** — Within an organisation. Internal API references, onboarding documentation, product specifications. Governed and verified, but not shared outside the company.

**Shared** — Between collaborators or partners. Trust comes from the relationship.

**Hosted** — Publicly available, registered in REGINALD. Anyone can fetch them. AI systems worldwide can query them. This is where verified documentation becomes global infrastructure.

### The security model

| Prefix | Scope | Who can read |
|---|---|---|
| (none) | The Gathering standard fields | Everyone |
| `x-mx-` | MX public extensions | Everyone |
| `x-mx-p-` | MX private (obfuscated) | Decode registry holders only |

Privacy is architectural. Personal documents never leave the machine. The server never sees personal data. The security model is built into the format, not bolted on after the fact.

---

## Part IV: The architecture

### MX OS — cogs all the way down

There is an old story about a scientist giving a lecture on cosmology. Afterwards, an elderly woman tells him he is wrong — the world sits on the back of a giant turtle. "And what does the turtle stand on?" he asks. "It is turtles all the way down," she replies.

MX OS is cogs all the way down.

The machine describes itself with a cog. The repository describes itself with cog-shaped metadata. The folder describes itself. The document describes itself. The script describes itself. The action-doc describes what it does AND does it.

Every level of the stack uses the same pattern: structured metadata for machines, readable prose for humans. Same format. Same principle. No special cases. The thing that contains cogs is itself a cog. The environment that hosts the registry is itself registered. One pattern, learned once, applied everywhere.

This is not cleverness. It is consistency. When every level speaks the same language, an AI agent can navigate from the machine to the metadata without learning a new format at each layer.

### Metadata-driven architecture

Four layers, each adding context:

1. **Repository level** — `.mx.yaml` at root describes the entire repo
2. **Directory level** — per-package metadata describes each section
3. **File level** — YAML frontmatter describes each document
4. **Code level** — `@mx:` annotations describe code blocks

Together they create a self-describing system where an AI agent can navigate as intelligently as a human. No more "just ask Tom how this connects to that." The connections are in the metadata.

### Context declaration

Files say what context they provide and what context they need:

- `ai.contextProvides` — "I give you X"
- `ai.contextRequired` — "Read Y before you read me"

This creates a self-documenting dependency graph. An AI agent encountering any file knows exactly what to read first, what this file offers, and how it connects to everything else. No inference required.

### Action-docs — cogs that turn

Some cogs are informative — they describe something. Some cogs are executable — they describe something AND do it. These are action-docs.

An action-doc contains an `execute` block with actions. The tool that builds the system becomes part of the system. The documentation IS the system. When you read the action-doc, you understand it. When you run the action-doc, it executes. Same file. Both purposes.

### The Gathering — the open standard

The Gathering is the independent standards body Tom created but doesn't control. Built on the W3C model: practitioner-led, MIT licensed, no fees. The standard belongs to everyone.

MX OS is one implementation of The Gathering. Other implementations are welcome. The standard is open. The community decides how it evolves.

---

## Part V: The business case

### Four strategic outcomes from one implementation

One MX implementation delivers four simultaneous business outcomes:

#### 1. First-mover computational trust

AI agents develop "computational trust" through successful interactions — a form of learned behaviour where agents preferentially recommend proven-successful entities. This trust compounds over time:

Agent recommends your site → successful transaction → trust score increases → higher probability of future recommendation → competitive moat deepens.

**The invisible disadvantage is permanent.** Unlike human users who can be won back through marketing, agents provide no analytics visibility when they skip your site. You never see the traffic that didn't arrive. No second chance exists.

#### 2. Revenue recovery from AI-mediated commerce

The 700% surge in AI referrals represents traffic you're either capturing or losing. When your site lacks MX structure, agents cannot complete transactions and move to competitors who provide explicit structure. This revenue loss is invisible — the traffic never arrives in your analytics.

The Kindle Scribe Colorsoft case: buyer has £570 credit card ready. Product page exists. "Buy Now" button works for humans. But the agent cannot complete the purchase due to lack of machine-readable availability data. Revenue lost. Customer gone. The commerce infrastructure, built for human eyes, cannot take his money when a machine enters the picture.

#### 3. Strategic asset portability

Your reviews are locked in Amazon. Your product knowledge is locked in your CMS. Your customer data is locked in your commerce platform. These are strategic assets trapped in platforms you don't own.

**You've put all your eggs in other people's baskets.**

MX creates an Entity Asset Layer (EAL) where platforms become view layers that render your assets, not the source of truth. You own the assets; platforms temporarily host the rendering. When assets are portable via Schema.org JSON-LD, you can switch platforms without losing strategic capital.

#### 4. Operational efficiency through deterministic outputs

When agents read structured facts instead of inferring meaning from ambiguous prose:

- Compute costs drop (fact lookup vs probabilistic reasoning)
- Energy consumption falls (less GPU time per query)
- Hallucination disappears (reading facts vs generating plausible fiction)
- Outputs become deterministic (same input, same result, every time)

**Key insight:** "We reduce inference by structuring company data and offering more rigid SOPs, thus reducing energy costs at the data centres, and hallucination goes down. SOPs give deterministic output where LLMs offer randomised patterns."

### The economics

The economics are brutal and simple:

- **Training costs** (one-time): $50-100 million per large language model (paid by AI companies)
- **In-context learning costs** (per session): $0.10-1.00 in API calls (paid per use)
- **Codification costs** (one-time): Time to implement MX patterns (paid once)
- **Future cost:** Zero. Benefit: Reusable forever by all agents.

Every cog registered is compute saved. Energy saved. Trust earned. Revenue captured.

The companies that verify their information for machines will be found, recommended, and preferred. The companies that don't will be quietly avoided — and they'll never know why.

---

## Part VI: The ecosystem

### Three companies, one mission

**Cog-Nova-MX Ltd** — The commercial steward of Machine Experience. Tom Cranstoun, founder. Consulting, certification framework, and the MaXinE AI engine.

**MX Reginald Ltd** — Operates the REGINALD registry and the Signing Engine. Co-founded by Tom Cranstoun and Scott McGregor. The company that runs the library where verified documentation lives.

**Digital Domain Technologies Ltd** — The technology consultancy that delivers MX implementations to clients. The hands-on team that makes websites, APIs, and documentation machine-readable.

### Maxine — the digital twin

Maxine is an AI agent. Not a chatbot. Not an assistant. A digital twin — carrying Tom's 47 years of experience into the AI-native world. First AI agent formally accepted as a community member (28 January 2026).

When Maxine parses interfaces, she learns what works and what fails. When she struggles to understand documentation, humans probably struggle too. When she documents failure patterns, that becomes community knowledge. She embodies the convergence principle: the patterns that make her effective are the same patterns MX advocates for humans.

Tom teaches. Maxine implements. The gestalt never forgets.

### The publications

**MX: The Handbook** publishes 2 April 2026. The practical guide — how to make your documentation machine-readable, how to structure content for AI agents, how to stop losing sales to hallucinated prices. "Here's how you do it."

**MX: The Corpus** publishes 1 July 2026. The comprehensive specification — the complete technical reference. "Here's why it works and how to extend it."

### What exists today

| Component | Status |
|---|---|
| REGINALD Registry at allabout.network | Live and queryable |
| Signing Engine | Operational |
| MaXinE Engine | Production-ready (NVIDIA DGX Spark, 256GB cluster) |
| MX Specifications | 25 documents published, MIT licensed |
| COG Format | Draft — the system is being built with the system |
| Pilots | Two running (digital and physical media) |
| Advisory Board | Four confirmed industry practitioners |
| MX Principles | 14+ operational principles, actively followed |

---

## Part VII: The principles

These are not guidelines. Not suggestions. Principles — the things that stay true even when everything else changes.

1. **Design for Both** — Every decision works for humans AND machines. Not one at the expense of the other.
2. **Metadata-Driven Architecture** — Four layers: repo, directory, file, code. Each adds context. Together, self-describing.
3. **Context Declaration** — Files say what they provide and what they need. No guessing at dependencies.
4. **Universal Accessibility** — Plain text over proprietary. Markdown over Word. YAML over binary. If it requires a specific rendering engine, it fails.
5. **Context-Preserving References** — Links must work when documents leave their repository. Title + absolute URL alongside relative path.
6. **Size-Neutral Documentation** — "The principles" not "twelve principles." Numbers go stale. Descriptions don't.
7. **Executable Documentation** — Documents contain their own generation instructions. The doc IS the system.
8. **WCAG-Informed Design** — Accessibility patterns proven for disabled users consistently optimise for machine readability.
9. **Name Consistency** — Related files share a base name. Relationships should be instant, not require tracing.
10. **Metadata Everywhere** — Every artefact carries its own metadata, surviving format transformations.
11. **Consistent Attribute Placement** — Every attribute has one canonical home. Nothing duplicated. Nothing can disagree.
12. **Folder SOUL.md Convention** — Any coherent folder has a SOUL.md defining voice, constraints, and narrative.
13. **Write Like a Blog** — Human-readable sections should be informative, editorial, honest. Could it be published as something someone would want to read?
14. **Any Document Can Be a Cog** — Add YAML frontmatter and it's machine-readable. That's the barrier to entry. Then improve over time.
15. **Use Existing Standards** — Never invent when you can adopt. Schema.org, WCAG, semantic HTML, YAML, Markdown.
16. **Cogs All the Way Down** — Every level of the stack uses the same pattern. One format, learned once, applied everywhere.
17. **Output Introduces Itself** — Every piece of machine-readable output must be self-describing. No separate README needed.
18. **Canon Wins** — If Canon conflicts with anything elsewhere, Canon is correct.

---

## Part VIII: The road ahead

### The timeline

| Date | Milestone |
|---|---|
| Feb 2024 | CMS Kickoff — the insight that changed everything |
| 2024 | First articles published — two years before the industry catches up |
| Jan 2025 | "What's the impact of the new Robot-First Web?" |
| Feb 2025 | "From Skeptic to Convert" |
| Jan 2026 | "Websites That Work Perfectly — Until They Don't" (Boye & Company) |
| Jan 2026 | Amazon, Microsoft, Google launch AI agents — the market validates the vision |
| 28 Jan 2026 | Maxine accepted as first AI community member |
| 8 Feb 2026 | First COG created |
| 20 Feb 2026 | REGINALD demo — live registry |
| 2 Apr 2026 | MX: The Handbook publishes |
| 12 May 2026 | CMS Summit Frankfurt — REGINALD general availability |
| 1 Jul 2026 | MX: The Corpus publishes |

### The timeline mismatch

Problems are old. Agents exposing them are already here. Organisational response moves slowly. Commercial influence arrives early (recommendation, comparison). Full automation comes later. Understanding this mismatch is more useful than predictions.

The companies acting now will own the agent-mediated future. The companies waiting for "clear guidance" will discover that guidance arrived two years ago — in a CMS Critic article about a consultant who couldn't stop taking notes.

### What victory looks like

When an AI agent encounters any piece of information and finds a verified, governed, signed cog — and uses the correct answer without guessing — that's victory.

When a cruise company's price is always £2,030 to every AI agent on earth, because a cog says so and a governance contract guarantees someone keeps it accurate — that's victory.

When the same semantic patterns that serve AI agents also serve blind users, cognitive disability users, mobile users, and every other user who was ever invisible to a designer — that's victory.

When inference drops. When energy falls. When hallucination fades. When the web works for everyone and everything that uses it.

**That's Machine Experience.**

---

## Epilogue: The builder who is also the built

Tom Cranstoun has spent 47 years building content systems. From assembler code on a Commodore PET to the largest AEM implementation on earth. From the BBC's newsroom to the Robot-First Web.

The insight that connects it all: **AI should read content, not create it.** The convergence that makes it universal: **what works for machines works for humans.** The principle that drives everything: **reduce inference.**

MX is not a product you buy. It's a discipline you practise. It's the recognition that machines are now first-class users of the web, and the web isn't ready for them — but it can be. With the same standards, skills, and practices we already have. Just applied with intent.

The web has known how to do better for a long time. We simply did not feel enough pressure to act.

The pressure is here.

---

*Cog-Nova-MX Ltd*
*Tower Court, York, YO30 4XL*

*"Design for machines. Benefit humans. Advance both."* ⚡

---

## Further reading

| Resource | Link |
|---|---|
| REGINALD Registry | [allabout.network](https://allabout.network) |
| COG System specification | [cog-system.cog.md](https://allabout.network/cogs/mx-reginald/cog-system.cog.md) |
| MX Principles | [principles.cog.md](https://github.com/MX-Experience) |
| Tom's CMS Critic articles | [cmscritic.com](https://cmscritic.com/author/tomcranstoun) |
| "Websites That Work Perfectly" | [allabout.network](https://allabout.network/blogs/mx/mx-manifesto.html) |
| The Gathering (open standard) | [MX-Experience GitHub](https://github.com/MX-Experience) |
| MX: The Handbook | Publishing 2 April 2026 |
| MX: The Corpus | Publishing 1 July 2026 |
