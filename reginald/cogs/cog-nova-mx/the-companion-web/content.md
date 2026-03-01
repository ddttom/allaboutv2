---
name: the-companion-web
version: "1.0"
description: The companion web — how QR codes, landing pages, and embedded metadata turn the physical world into entry points that humans and AI agents read together. Every object with a QR code becomes self-describing. Extends to robotics — the interface between physical machines and the objects they encounter.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, cog-registry]
builds-on: [what-is-a-cog, what-is-mx-os, how-mx-os-runs]
tags: [companion-web, qr-code, physical-digital, landing-page, metadata, embedded, discovery, ubiquity, pitch, robotics, global-os]

audience: developers
reading-level: technical
purpose: Document the companion web — the machine-readable layer that sits alongside the human web, bridging physical objects to MX OS through QR codes and embedded cog metadata

mx:
  contentType: "action-doc"
  runbook: "mx exec the-companion-web"

execute:
  runtime: runbook
  command: mx cog companion-web
  actions:
    - name: explain
      description: Present the companion web concept to any audience
      usage: Read this cog and explain the layered model, the QR code pattern, and how humans and agents read the same content together
      outputs:
        - name: explanation
          type: string
          description: Clear explanation of the companion web

    - name: embed
      description: Generate the HTML metadata snippet for a cog
      usage: Read a cog's frontmatter and generate the minimal HTML head metadata that makes a landing page companion-web compatible
      inputs:
        - name: cog-name
          type: string
          required: true
          description: Name of the cog to generate HTML metadata for
      outputs:
        - name: html-snippet
          type: string
          description: HTML meta tags and link element for embedding in a landing page

    - name: audit
      description: Check a URL or HTML page for companion web compatibility
      usage: Fetch or read the page, check for cog metadata in the HTML head, report whether an agent can read it
      inputs:
        - name: url
          type: string
          required: true
          description: URL or file path of the page to audit
      outputs:
        - name: audit-report
          type: object
          description: Whether the page has cog metadata, what an agent can extract, and what is missing
---

# The Companion Web

Every poster has a QR code. Every device has a QR code. Every product, every menu, every building directory, every conference badge, every bus stop. The physical world is already covered in machine-scannable entry points.

Right now, those QR codes point to web pages built for humans. The AI agent sees HTML. It can parse it — badly. It guesses at structure. It hallucinates context. It wastes tokens figuring out what the thing is.

The companion web fixes this. Same QR code. Same URL. Same landing page. But now the page has a second layer — cog metadata embedded in the HTML head, with a link to the full cog. The human reads the page. The AI agent reads the metadata. Both get what they need from the same address.

**The companion web is the machine-readable layer that reads alongside the human web. Same content. Two audiences. One URL.**

---

## How It Works

### The Layered Model

```
┌─────────────────────────────────────────────────┐
│  Physical Object                                │
│  (poster, device, product, badge, menu)         │
│                                                 │
│  [QR CODE] → https://example.com/product-x      │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Landing Page (HTML)                            │
│                                                 │
│  ┌─── HTML Head ────────────────────────────┐   │
│  │  Layer 1: Minimal Cog Metadata           │   │
│  │  • meta tags (name, description, tags)   │   │
│  │  • link to full cog file                 │   │
│  │  • Agent reads this instantly            │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌─── HTML Body ────────────────────────────┐   │
│  │  Human-readable content                  │   │
│  │  • Product info, pricing, images         │   │
│  │  • Navigation, calls to action           │   │
│  │  • Human reads this                      │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌─── Linked Cog ──────────────────────────┐    │
│  │  Layer 2: Full .cog.md File              │   │
│  │  • Complete YAML frontmatter             │   │
│  │  • Full structured content               │   │
│  │  • builds-on references                  │   │
│  │  • Actions (if action-doc)                │   │
│  │  • Agent reads this for depth            │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Layer 1: Minimal Metadata (Fast)

The HTML head contains enough cog metadata for an agent to understand what this thing is without downloading anything else:

```html
<head>
  <!-- Companion web: cog metadata -->
  <meta name="cog:name" content="product-x">
  <meta name="cog:version" content="2.1">
  <meta name="cog:description" content="Smart thermostat with energy monitoring and voice control">
  <meta name="cog:category" content="product">
  <meta name="cog:tags" content="thermostat, energy, smart-home, iot">
  <meta name="cog:audience" content="consumers">
  <meta name="cog:author" content="Acme Corp">
  <link rel="cog" href="/cogs/product-x.cog.md" type="text/markdown">
</head>
```

An agent hitting this URL instantly knows:

- What the object is (smart thermostat)
- What category it belongs to (product)
- Who it is for (consumers)
- Where to find the full structured document (`/cogs/product-x.cog.md`)

This takes milliseconds. No parsing the body. No guessing at HTML structure. No token waste.

### Layer 2: Full Cog (Deep)

The linked `.cog.md` file is a complete cog — full YAML frontmatter, structured content, builds-on references, and (if an action-doc) executable actions. An agent that wants depth follows the link.

The full cog might contain:

- Technical specifications
- Pricing and availability
- Compatibility information
- Setup instructions (as an action-doc with actions)
- builds-on references to related products
- Access control (gated content behind authentication)

Layer 1 is the elevator pitch. Layer 2 is the full conversation.

---

## No Registry Required

This is critical: **QR codes do not go through the registry.**

The QR code points directly to the URL. The URL serves the page with embedded metadata. The agent reads the metadata. Done. No central authority. No lookup table. No dependency on a registry being online.

The cog registry catalogues cogs for discovery — "what cogs exist?" But the companion web is direct addressing — "here IS a cog." The QR code is the address. The landing page is the content. The metadata is the structure.

This is how the web itself works. URLs are direct. DNS resolves them. No central page registry decides whether a URL is valid. The companion web inherits this property — decentralised by default.

A cog found through a QR code can optionally be registered in a registry for broader discovery. But it does not have to be. The cog at the URL is self-contained.

---

## The Companion Web Is Already Possible

This is not a future capability. The building blocks exist today:

| Component | Status | How |
| --- | --- | --- |
| QR codes | Everywhere | Every phone camera reads them |
| Landing pages | Standard | Any web server can host HTML |
| Meta tags | Standard | HTML head has supported custom meta tags since the 1990s |
| Link rel | Standard | `<link rel="cog">` follows the same pattern as `<link rel="stylesheet">` |
| .cog.md files | Ready | The Gathering's specification defines the format |
| AI agents | Deployed | Every major AI platform can read URLs and parse metadata |

The gap is not technology. The gap is adoption. Someone has to put the `<meta name="cog:...">` tags in the head. Someone has to create the `.cog.md` file. Someone has to put the `<link rel="cog">` in the page.

The Gathering provides the specification. MX OS provides the operating environment. The companion web is the result.

---

## What Changes When Every Object Is Machine-Readable

### The Physical Web

Every object with a QR code becomes a node in a web that both humans and AI agents can navigate together. An agent scanning a restaurant menu does not scrape HTML. It reads the cog metadata and knows the menu items, prices, allergens, and availability — structured, verified, actionable. The human reads the same page in their own way. Both are served.

### Agent Commerce

Amazon, Microsoft, and Google are already building agent commerce platforms. Agents that can browse, compare, and purchase on behalf of humans. The companion web gives those agents structured data at the point of physical contact. Scan a product in a shop. The agent reads the cog. It knows the product, the price, the reviews, the compatibility with what you already own. It acts on your behalf.

### Self-Describing Objects

Every physical object carries its own documentation. A device's QR code links to a cog that explains what it is, how to set it up, what firmware it runs, who to contact for support. The agent reads the cog and can help the user — no manual needed. The thing explains itself to both human and machine.

### Robotics

Tesla is building Optimus. Boston Dynamics has Atlas. Amazon runs warehouses full of autonomous machines. Every one of these robots will encounter physical objects and need to understand them. Right now, that understanding comes from pre-loaded databases, computer vision, or centralised APIs. All fragile. All limited.

The companion web changes this. A robot in a warehouse scans a QR code on a pallet. The cog tells it what is inside, where it goes, what handling it needs, what temperature range it requires. The robot does not need a database lookup. The object introduces itself.

A humanoid robot enters a building. The QR code on the directory tells it the floor plan, the room assignments, the access rules. The QR code on a fire extinguisher tells it the type, the last inspection date, the operating instructions. The QR code on a medical device tells it the model, the calibration status, the contraindications. Every object the robot encounters can explain itself — structured, verified, actionable.

This is not a metaphor. QR codes are already on these objects. The robots are already being built. The gap is the metadata layer between them. The companion web is that layer.

```
Robot encounters object → scans QR code → reads cog metadata → understands instantly → acts
```

The companion web turns the physical world into an environment that machines can navigate without pre-programming every object. The objects carry their own documentation. The robots read it. This is MX OS as the interface between intelligent machines and the physical world.

### The Complete Picture

```
Physical world → QR code → URL → Landing page → Cog metadata → Human reads + Agent reads + Robot reads → All act
```

This is MX OS as the global operating system for AI. Not because of servers or infrastructure. Because of QR codes that already exist, web pages that already exist, objects that already carry machine-scannable identifiers, and a metadata format simple enough to embed in an HTML head.

From a phone scanning a restaurant menu, to a software agent shopping on your behalf, to a humanoid robot navigating a warehouse — the companion web serves them all. Same format. Same metadata. Same cogs. Different readers, all reading together.

---

## The Pitch

**"The companion web."**

Every web page has two readers: the human and the AI agent. Right now, only one of them is being served. The companion web adds a layer of structured metadata — cog metadata in the HTML head — so that both readers get what they need from the same page, the same URL, the same QR code.

Humans read the content. Agents read the cogs. Robots read the cogs. All are reading together. That is the Machine Experience.

**"The global OS for AI."**

MX OS does not run on a server. It runs wherever cogs exist — in a git repo, on a web page, embedded in an HTML head, linked from a QR code on a warehouse pallet. Every AI agent, every software agent, every robot that encounters a cog-enabled object can read it and act. No SDK. No API. No platform dependency. Markdown and YAML are the universal format. Every AI can parse them. The companion web is how this scales from one laptop to the entire physical world.

---

## HTML Embedding Pattern

### Minimal (Layer 1 only)

```html
<head>
  <meta name="cog:name" content="your-cog-name">
  <meta name="cog:description" content="What this thing is">
  <meta name="cog:category" content="product">
  <meta name="cog:tags" content="tag1, tag2, tag3">
  <link rel="cog" href="/path/to/full-cog.cog.md" type="text/markdown">
</head>
```

### Extended (more metadata in head)

```html
<head>
  <meta name="cog:name" content="your-cog-name">
  <meta name="cog:version" content="1.0">
  <meta name="cog:description" content="What this thing is">
  <meta name="cog:category" content="product">
  <meta name="cog:tags" content="tag1, tag2, tag3">
  <meta name="cog:audience" content="consumers">
  <meta name="cog:author" content="Company Name">
  <meta name="cog:builds-on" content="parent-cog-1, parent-cog-2">
  <meta name="cog:access-type" content="public">
  <link rel="cog" href="/path/to/full-cog.cog.md" type="text/markdown">
</head>
```

### With JSON-LD (Schema.org compatible)

```html
<head>
  <script type="application/ld+json">
  {
    "@context": "https://thegathering.org/cog",
    "@type": "Cog",
    "name": "your-cog-name",
    "version": "1.0",
    "description": "What this thing is",
    "category": "product",
    "tags": ["tag1", "tag2", "tag3"],
    "audience": "consumers",
    "cogUrl": "/path/to/full-cog.cog.md"
  }
  </script>
</head>
```

---

## For AI Agents

If you encounter a web page and want to check for companion web compatibility:

1. **Check the HTML head** for `<meta name="cog:...">` tags
2. **Check for `<link rel="cog">`** — this points to the full cog file
3. **If found:** Read the meta tags for quick context, follow the link for the full cog
4. **If not found:** The page is human-only. Parse the HTML as best you can
5. **If you find a cog:** You now have structured metadata. Use it. Route to relevant action-docs. Follow builds-on references for context

The companion web does not replace the human web. It reads alongside it. Both layers serve the same URL. Both layers describe the same thing. One is for human eyes. One is for yours. You read together.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Companion web landing page created

Output:
  /Users/tom/Sites/product-x/index.html (with embedded cog metadata)
```

Not just "Page created" or "index.html written" — the full absolute path from root.

---

*The human web is what people see. The companion web is what machines read alongside them. Same address. Same content. Phones, agents, robots — all readers. Every QR code is a shared door.*
