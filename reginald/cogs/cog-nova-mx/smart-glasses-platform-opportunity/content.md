---
title: "Smart Glasses — The MX Platform Opportunity"
description: "Smart glasses as a mass-market MX platform. Cameras and voice but no content standard. MX fills the gap — Reginald docs on your face. Zero engineering."
author: "Tom Cranstoun and Maxine"
created: 2026-02-14
modified: 2026-02-14
version: "1.0"

mx:
  status: active
  category: vision
  contentType: info-doc
  tags: [smart-glasses, meta, platform, wearables, companion-web, strategy, market-opportunity, competitive-analysis, google, apple, samsung]
  audience: ["business", "business"]
  buildsOn: [the-companion-web]
  refersTo: [mx-messaging-framework]
  confidential: true
  runbook: "This is a strategic opportunity document for the advisory board and investors. Dual-audience: business claim first, technical evidence underneath. Market data cites sources. Write like a blog — informative, not technical."
---

# Smart Glasses — The MX Platform Opportunity

> The object introduces itself — even when it is on your face.

---

## The Market Trigger

Smart glasses just became a mass-market product category.

EssilorLuxottica — the maker of Ray-Ban — reported in February 2026 that it sold over seven million Meta-powered smart glasses in 2025. That is more than triple the combined total of 2023 and 2024. Revenue from smart glasses tripled year-on-year. The company described North American wholesale growth as "exponential."

These are not goggles. They are Ray-Bans. They cost $299 to $379. They look like glasses. People wear them all day. They have cameras, microphones, speakers, and an AI assistant built in. Meta AI — powered by Llama — can identify objects, translate signs, answer questions about what the wearer sees, and hold a conversation. All by voice.

The market is accelerating:

| Year | Estimated smart glasses sold | Source |
|------|------------------------------|--------|
| 2023 + 2024 combined | ~2 million | EssilorLuxottica earnings (CNBC, Feb 2026) |
| 2025 | 7+ million | EssilorLuxottica earnings (CNBC, Feb 2026) |
| 2030 projection | ~90 million/year | SNS Insider market report (Feb 2026) |

The broader AI smart glasses market is projected to exceed $30 billion by 2030 (SNS Insider, Feb 2026). Business of Fashion called 2026 "the breakthrough year for smart glasses."

This is the smartphone adoption curve, ten years later. Same pattern. Same trajectory. Different form factor.

And every single pair of glasses has the same problem.

---

## The Gap — Glasses See but Do Not Understand

Smart glasses have cameras that point at the world. They have AI that processes what the camera sees. What they do not have is a content understanding standard.

### What glasses CAN do today

- **Camera:** 12MP photos, 1080p video, livestreaming to Instagram and Facebook
- **AI assistant:** Meta AI identifies objects, translates text, estimates calories, reads signs, holds conversations — all via the camera and voice
- **Real-time translation:** Live conversation translation between languages
- **Audio:** Music, podcasts, phone calls through directional speakers
- **Voice control:** Hands-free operation for everything

### What glasses CANNOT do

- **Read structured metadata.** The AI sees pixels. It has no concept of YAML frontmatter, semantic tags, or machine-readable fields
- **Parse a doc.** A cog file in front of the camera is just text to photograph — unstructured, unindexed, token-expensive
- **Understand an object's identity.** The AI guesses what things are using computer vision. It does not read what things say about themselves
- **Respect privacy declarations.** There is no mechanism for an object to declare its access rules to the glasses
- **Follow structured instructions.** The AI cannot read a doc and execute a procedure. It has no concept of action blocks, runtime instructions, or Standard Operating Procedures
- **Remember across sessions.** "Remember this" is experimental, with no persistent structured memory

There is an irony here. Smart glasses have cameras that look out at a world covered in QR codes. Every poster, every product, every menu, every conference badge, every bus stop. Yet QR code scanning is not a native feature of any shipping smart glasses. The camera is pointed at the world's largest network of machine-scannable identifiers and cannot read them.

Even when QR scanning arrives — and it will — the QR codes point to web pages designed for screens. HTML built for human eyes. The glasses' AI assistant will fetch the page, parse the DOM, waste tokens guessing at structure, and deliver a partial, unreliable summary.

The fundamental problem: **there is no standard for what a pair of glasses should understand when looking at a business, a product, a building, a menu.** Every platform is building proprietary AI recognition. Nobody is building a content understanding standard.

---

## How MX Fills the Gap

MX does not need to build for glasses. MX needs to exist. The glasses come to us.

The companion web — the machine-readable layer that sits alongside the human web — already solves this problem. The mechanism:

1. **A physical object has a QR code.** Restaurant menu, product label, conference badge, building directory
2. **The QR code points to a URL.** A standard web page
3. **The page has cog metadata in the HTML head.** `<meta name="cog:name">`, `<meta name="cog:description">`, `<meta name="cog:tags">`. A `<link rel="cog">` points to the full doc
4. **The glasses' AI reads the metadata.** Milliseconds. Minimal tokens. Structured, verified, actionable
5. **The wearer hears a spoken summary.** Personalised. Relevant. Private

No glasses integration required. No SDK. No partnership agreement. No app store submission. The same docs that serve a desktop browser, a phone, a software agent, or a robot also serve smart glasses. The format is universal. Reginald publishes. The glasses read. Done.

### Voice-first alignment

Smart glasses are voice-first devices. The wearer speaks and listens. MX docs are structured enough that any AI assistant can summarise them verbally.

"This restaurant is wheelchair accessible, serves gluten-free options, and has outdoor seating. Three dishes match your dietary preferences. Table five has step-free access."

All from doc metadata. Spoken through the glasses. The wearer never touches a screen.

### Personal docs stay on device

The MX privacy architecture applies without modification. The wearer's personal docs — dietary needs, accessibility requirements, language preferences — live on the wearer's device (phone paired to glasses). The glasses' AI matches personal docs against the object's doc locally. No data is shared with the object, the website, or anyone else.

This is the same architecture as the MX Maxine app. Different form factor. Same principle. Same zero-data-shared promise.

The sensitivity matters more on glasses than on any other device. Glasses see everything the wearer sees. The personal docs they carry might describe a disability, a medical condition, a religious dietary requirement. Privacy is not a feature. It is a requirement. MX delivers it by architecture, not by policy.

### The compute argument

A glasses AI assistant has limited on-device processing power. Every token counts. Computer vision interpretation of a restaurant menu — parsing the DOM, identifying food items, guessing at allergens — costs thousands of tokens and takes seconds.

Reading cog metadata from an HTML head costs dozens of tokens and takes milliseconds. Structured metadata is orders of magnitude cheaper than unstructured pixel interpretation. "Cut compute, not context" applies doubly to edge devices with constrained resources.

---

## Competitive Landscape

Every major technology company is building smart glasses. None is building a content understanding standard for them.

| Platform | Status | AI | Content Standard | MX Opportunity |
|----------|--------|-----|-----------------|----------------|
| **Meta Ray-Ban** | Shipping. Market leader. 7M+ in 2025 | Meta AI (Llama). Vision, voice, translation | None | Largest installed base. Camera + AI, no structured content |
| **Meta Ray-Ban Display** | Shipping 2025. $800 | Meta AI + heads-up display | None | First glasses with visual output. Needs structured data to display |
| **Google/Samsung Android XR** | Launching 2026. Two models (AI + display) | Gemini. 12MP camera, gesture controls | None | Open ecosystem. The Gathering standard is a natural fit |
| **Apple Smart Glasses** | Announced 2026. Shipping late 2026/2027 | Visual Intelligence (Siri + on-device AI) | None | Apple redirected from AR to AI glasses. $600-$700 range |
| **Snap Spectacles** | Developer-only. $99/month | Snap AI, AR overlays | None | Small. Developer-friendly. Potential early adopter |

### Three observations

**1. Every platform builds hardware and AI. Nobody builds the content layer.**

Meta has Llama. Google has Gemini. Apple has Visual Intelligence. Samsung has Qualcomm silicon. The hardware race and the AI race are fully funded. But the content these AIs need to read — structured, verified, machine-readable business identity — does not exist on any platform.

This is the locomotive-and-track problem from the investor pitch. They are building locomotives. MX lays the track.

**2. Google's open ecosystem is the natural entry point.**

Android XR is built on Android. Open platform. Third-party apps. Google already uses web standards — HTML, Schema.org, structured data — as signals for search ranking. The Gathering's cog specification extends this pattern to smart glasses. A glasses app that reads `<meta name="cog:*">` tags from web pages is a natural Android XR application. No Google partnership required. Just publish the app.

Samsung's partnership with Gentle Monster and Warby Parker means millions of Android XR glasses from fashion-forward brands. Each pair that can read cog metadata is a node in the MX network.

**3. Apple will need structured content eventually.**

Apple is pivoting from Vision Pro ($3,499, limited adoption) to affordable AI glasses ($600-$700). Their Visual Intelligence feature already identifies objects through the camera. But identifying an object is not the same as understanding its business context — opening hours, accessibility, dietary options, service level agreements. Cog metadata provides that context. Safari already reads HTML meta tags. The bridge is built.

### The first-mover advantage

The first platform whose glasses can read structured content wins agent commerce for wearables. The wearer walks into a shop. The glasses scan a QR code. The doc tells the AI what is available, what matches the wearer's needs, what the prices are. The AI acts — compares, recommends, reserves, purchases.

Whoever provides the content standard for this interaction captures the network. MX offers that standard. It is vendor-neutral (The Gathering), not proprietary. This makes it adoptable by every platform. The first platform to adopt it gives its users structured understanding of the physical world. The others follow — just as browsers adopted HTML, not because of one vendor, but because the content existed.

---

## The Gathering Standard Play

The Gathering governs the spec. MX OS is the implementation. This distinction is the strategic lever.

The Gathering is independent, MIT licensed, practitioner-led, and modelled on the W3C. The cog specification does not belong to Cog-Nova-MX. It belongs to everyone. Any glasses platform can implement it without paying MX a penny.

But Cog-Nova-MX is the reference implementation. First mover. Certification authority. Root of trust. The standard spreading to glasses platforms drives registry adoption, which drives Reginald revenue.

The channel model scales directly. Just as CMS vendors are the channel for web adoption — 200 platforms serve millions of businesses — glasses platforms are a potential channel for physical-world adoption. Each platform that supports cog metadata means every object with a QR code becomes readable by that platform's users. Network effects compound across platforms.

The standards adoption timeline is favourable. A glasses SDK developer can integrate cog metadata parsing in a single release cycle. The spec is markdown and YAML. Every AI model already knows how to read both. The barrier to adoption is awareness, not engineering.

---

## From Grassroots to Partnership

The path to smart glasses adoption does not begin with a Meta partnership. It begins with QR codes.

### Phase 1 — Grassroots QR (today)

Businesses put QR codes on objects. Those QR codes point to landing pages with cog metadata in the HTML head. Any device with a browser or camera can follow the QR code. The companion web works today, on every glasses platform that can open a URL, without any platform integration.

This is already the plan for Reginald and for the Frankfurt demo. The glasses opportunity requires no additional work.

### Phase 2 — Developer adoption (2026-2027)

Independent developers building glasses apps discover cog metadata on landing pages. They build apps that read it. The Gathering spec is open. No permission needed. An Android XR app that highlights cog-enabled objects gets published. A Meta app that parses QR codes and reads docs gets downloaded. The ecosystem grows from the edges.

### Phase 3 — Platform integration (2027-2028)

When enough content has cog metadata — driven by Reginald listings and CMS vendor adoption — glasses platforms have a reason to support it natively. The conversation shifts: "This content standard already exists on millions of pages. Do you want your glasses to read it?"

This is the HTML adoption story. Browsers did not invent HTML. They adopted it because the content existed. Glasses platforms will adopt cog metadata when the content exists. Reginald accelerates that existence.

### Phase 4 — Native support (2028+)

Glasses firmware includes cog metadata awareness. Scanning a QR code triggers structured understanding, not just a web page load. The object introduces itself directly to the glasses — voice summary, personalised context, privacy-preserving match against personal docs. No app required. Built into the platform.

---

## The Frankfurt Demo Angle

The CMS Summit Frankfurt demo already shows the Machine Experience across multiple devices — multiple Macs, phone PWA, voice commands. Smart glasses are the next sentence in the same story.

The demo script extends naturally:

> "You just saw Maxine read a restaurant's doc and generate a personalised experience on a laptop and a phone. Now imagine this on your face. You walk into the restaurant. Your glasses scan the QR code at the entrance. Maxine whispers: 'This restaurant is wheelchair accessible. Three dishes match your dietary needs. Table five has step-free access.' No screen. No typing. No privacy compromise. The object introduced itself."

This does not require glasses hardware on stage. The content infrastructure — docs, Reginald, companion web, personal docs — is already running on the devices that ARE on stage. The glasses are the conclusion the audience draws for themselves.

The message for CMS vendors in the room: "Your CMS serves the doc. The glasses read it. Your platform just became relevant to every pair of smart glasses on earth."

---

## Revenue Implications

Smart glasses amplify the existing MX revenue model without requiring new infrastructure investment.

**Registry scales directly.** Every business listed on Reginald is already visible to glasses users. The same listing that makes a business readable by web AI agents makes it readable by glasses AI assistants. No additional fee. No additional integration. The same twelve pounds fifty a year.

**Volume amplifier.** Millions of glasses users walking through physical spaces creates demand for cog metadata on physical objects. Hospitality, retail, tourism, museums, transport, healthcare facilities — sectors where QR codes already exist but structured metadata does not. These businesses have a new reason to list on Reginald: the growing population of glasses wearers who rely on structured docs to understand the world around them.

**New sectors open.** The web-first revenue model (CMS vendors as channel) reaches businesses with websites. The glasses channel reaches businesses with physical premises. A neighbourhood restaurant that has never thought about structured web content will think about it when glasses wearers walk in and the competitor down the road already has a doc.

**Certification extends.** Agencies that build MX-ready experiences for physical spaces need certification. A design agency that puts cog metadata on a hotel chain's landing pages is doing the same work as one that optimises a website — but the physical context makes the value more tangible. "Your guests' glasses understood your hotel before they checked in."

**Conservative framing.** This document does not project glasses-specific revenue. It argues that smart glasses adoption amplifies the existing model — more glasses, more demand for docs, more Reginald listings, more certification, more training. The upside is organic. The cost is zero.

---

## Assumptions and Risks

This opportunity rests on four testable assumptions.

**Assumption 1: Smart glasses will read QR codes.**

Currently, shipping glasses use the camera for AI vision, not code scanning. Meta Ray-Ban Display (with its heads-up display) is the most likely candidate for native QR reading. Google's Android XR glasses, with their open app ecosystem, could support QR scanning via a third-party app immediately.

*Falsifiable by:* No major glasses platform supporting QR scanning by end of 2027.

**Assumption 2: The form factor reaches mass adoption.**

Seven million units in 2025 is strong. Apple entering in 2026-2027 accelerates the category. But consumer electronics adoption is unpredictable. Smart watches took years to reach critical mass. Smart glasses could follow the same slow curve or accelerate faster.

*Falsifiable by:* Combined smart glasses sales stagnating below ten million per year through 2028.

**Assumption 3: Glasses AI assistants will consume web content and metadata.**

Meta AI already fetches and interprets web pages through the glasses camera. Google Gemini does the same on Android. The assumption is that this capability deepens — reading structured metadata, not just guessing from pixels — rather than being abandoned.

*Falsifiable by:* Major platforms restricting glasses AI from accessing web content.

**Assumption 4: No competing content understanding standard emerges for wearables.**

If Meta or Google builds a proprietary wearable content format, The Gathering must position against it. The defence is openness — a vendor-neutral standard adopted by multiple platforms is more durable than a single-vendor format.

*Falsifiable by:* A major platform announcing a wearable-specific content standard with broad adoption.

### The risk framing

Smart glasses are upside optionality, not a dependency. If the glasses market stalls, MX's core business — web, CMS vendors, registry — is entirely unaffected. Every piece of work described in this document (docs, Reginald, companion web, personal docs, The Gathering standard) is already being built for reasons that have nothing to do with glasses.

The glasses opportunity is free. The infrastructure already exists. The only cost is awareness — telling the story.

---

## The Thesis

Smart glasses are heading for consumer electronics scale. By the end of the decade, tens of millions of devices with cameras and AI will be walking through a world covered in QR codes. Those objects need to introduce themselves. MX is the format that lets them.

MX does not need to build for glasses. MX needs to exist. The same docs that serve web AI agents serve glasses AI assistants. The same Reginald that publishes business identity to the web publishes it to the world you walk through. The same personal docs that personalise a laptop experience personalise the voice in your ear.

The Gathering standard is vendor-neutral. Any glasses platform can adopt it. The first one to do so gives its users structured understanding of the physical world. The others will follow — just as browsers adopted HTML, not because of one vendor, but because the content existed.

Three platforms are launching glasses in 2026. None has a content understanding standard. The content is the gap. MX fills it. And the glasses come to us.

**Your business, readable by every machine on earth. Including the one on your face.**

---

*Cog-Nova-MX Ltd. Confidential. Distribution by permission only.*

*Tom Cranstoun — <tom@digitaldomain.tech>*

---

**Market data sources:**

- EssilorLuxottica 2025 earnings: [CNBC, 11 Feb 2026](https://www.cnbc.com/2026/02/11/ray-ban-maker-essilorluxottica-triples-sales-of-meta-ai-glasses.html)
- Meta smart glasses 7M units: [UploadVR, 2025](https://www.uploadvr.com/meta-essilorluxottica-sold-7-million-smart-glasses-in-2025/)
- Revenue tripled H1 2025: [CNBC, Jul 2025](https://www.cnbc.com/2025/07/28/ray-ban-meta-revenue-tripled-essilorluxottica.html)
- Sales tripled 2025: [Road to VR, 2025](https://www.roadtovr.com/meta-ray-ban-smart-glasses-sales-tripled-2025/)
- AI smart glasses market $30B+ by 2030: [SNS Insider, 13 Feb 2026](https://www.globenewswire.com/news-release/2026/02/13/3238041/0/en/AI-Smart-Glasses-Market-Size-to-Surpass-4-59-Billion-by-2035-Due-to-the-Surging-AR-VR-Technologies-SNS-Insider.html)
- Smart glasses breakthrough year: [Business of Fashion, 2026](https://www.businessoffashion.com/articles/technology/the-state-of-fashion-2026-report-smart-glasses-ai-wearables/)
- Google Android XR glasses 2026: [9to5Google, Jan 2026](https://9to5google.com/2026/01/01/android-xr-glasses-2026/)
- Samsung Android XR confirmed 2026: [VRARA, Feb 2026](https://www.thevrara.com/blog/2026/2/9/samsung-confirms-android-xr-smart-glasses-are-coming-in-2026-and-vrara-member-qualcomm-is-building-the-silicon-behind-the-revolution)
- Apple smart glasses 2026: [TechCrunch, May 2025](https://techcrunch.com/2025/05/23/apple-could-launch-ai-powered-smart-glasses-in-2026/)
- Apple smart glasses late 2026: [UploadVR, 2025](https://www.uploadvr.com/apple-smart-glasses-reportedly-launch-late-2026/)
