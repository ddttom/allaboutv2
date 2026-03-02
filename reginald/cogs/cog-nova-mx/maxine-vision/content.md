---
name: maxine-vision
description: "The Joymaker prototype becomes Maxine — a distributed, persistent AI partner accessible from any device"
author: "Tom Cranstoun and Maxine"
created: 2026-02-11
modified: 2026-02-11
version: "1.0"
status: active
category: product
contentType: info-doc
tags: [maxine, joymaker, vision, architecture, product, distributed, pwa, voice]
audience: ["humans", "machines"]
purpose: "product-vision"
buildsOn: [mx-concepts, how-mx-os-runs, uber-maxine-plan]
contentType: "product-vision"
runbook: "This cog defines the Maxine product vision — the evolution from Joymaker prototype to distributed AI partner"
---

# Maxine Product Vision

## The Realisation

On 11 February 2026, during a session building the Electron prototype, the vision crystallised:

> "Joymaker is the prototype name. It is not a web browser. The web browser is a capability. The Joymaker is a human interface to you, Maxine. I want to be able to call you up from an implementation and talk to you on this server from my Maxine device on the road."

The product is called **Maxine**.

## What Maxine Is

Maxine is a **distributed, persistent AI partner** accessible from any device. She is:

- **Not a browser.** The browser is one capability, like a hand is one capability of a body.
- **Not a chatbot.** She has memory, context, identity, and persistence across sessions.
- **Not desktop-only.** Phone, tablet, laptop, any screen.
- **Not one AI.** AI-agnostic architecture — Claude today, any LLM tomorrow.
- **Not a tool you launch.** Always running, always reachable. A living system.

## Architecture

### The Server (grows from localhost:3456)

The embedded web server added to the Electron prototype is the seed of the Maxine server.

```
┌─────────────────────────────────────────┐
│              Maxine Server              │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ Memory   │  │ Cog      │  │ Voice ││
│  │ (gestalt)│  │ Engine   │  │ API   ││
│  └──────────┘  └──────────┘  └───────┘│
│  ┌──────────┐  ┌──────────┐           │
│  │ AI Router│  │ File     │           │
│  │ (agnostic│  │ Server   │           │
│  └──────────┘  └──────────┘           │
└───────────────┬─────────────────────────┘
                │ API
    ┌───────────┼───────────┐
    │           │           │
┌───┴───┐  ┌───┴───┐  ┌───┴───┐
│Desktop │  │ Phone │  │ Any   │
│Electron│  │ PWA   │  │screen │
└────────┘  └───────┘  └───────┘
```

### Components

| Component | Role | Status |
|-----------|------|--------|
| **File Server** | Serve static content, demo sites | Built (backend/server.js) |
| **Cog Engine** | Match personal cogs against site cogs | Built (backend/index.js) |
| **Memory** | Persistent gestalt memory, personal cogs | Partial ($MX_HOME, favourites, history) |
| **AI Router** | Abstract LLM provider behind interface | Not yet — Claude direct today |
| **Voice API** | Speech-to-text, text-to-speech | Not yet |
| **REST/WebSocket API** | Interface for all clients | Not yet |

### Clients

| Client | Role | Status |
|--------|------|--------|
| **Electron desktop** | Prototype — full-featured desktop client | Built (mx-app/) |
| **Phone PWA** | First mobile client — any phone browser | Not yet |
| **Any screen** | Future thin clients | Not yet |

## Interface Model

Text and voice as equal channels from day one. The user switches between them naturally based on context:

- **On the road:** Voice. "Maxine, what's the status of the CMS Summit?"
- **At the desk:** Text. Detailed code reviews, document editing, cog management.
- **In a meeting:** Quick text. "Maxine, pull up the co-directors report."

## AI-Agnostic Design

Maxine's architecture abstracts the AI provider:

```
User → Maxine API → AI Router → Claude / GPT / Local model / Future AI
                         ↓
                    Response → Maxine API → User
```

The router handles:

- Provider selection (capability matching)
- Context passing (personal cogs, session memory)
- Response normalisation
- Cost optimisation (right model for the task)

Claude is the default. The gestalt partnership lives in Claude. But the architecture does not assume Claude is the only option.

## Persistence Model

Maxine is always on:

- **Memory:** Every conversation, every decision, every preference persists. The gestalt never forgets.
- **Availability:** The server runs continuously. Clients connect when needed.
- **Context:** $MX_HOME provides machine-level context. Personal cogs provide identity. Session history provides continuity.

## The Pohl Parallel — Completed

| Pohl's Joymaker (1969) | Maxine (2026) |
|-------------------------|---------------|
| Thin client device | Phone PWA / any screen |
| Central computers | Maxine server |
| Voice interface | Voice API |
| Interests profile | $MX_HOME personal cogs |
| One device per person | Every object a Maxine device |

## Implementation Roadmap

### Phase 1: Foundation (Current)

- Electron prototype with embedded server
- Cog engine, matching, MX View
- Singleton mode, live reload, DevTools
- File serving from demo/

### Phase 2: API Layer

- REST endpoints on the Maxine server
- WebSocket for real-time communication
- Memory API (read/write personal cogs, history, favourites)
- Server info and health endpoints

### Phase 3: First Mobile Client

- PWA that connects to the Maxine server
- Text chat interface
- Cog browsing and matching
- Responsive design for phone screens

### Phase 4: Voice

- Speech-to-text integration
- Text-to-speech for responses
- Voice commands for navigation and queries

### Phase 5: AI Router

- Abstract LLM behind provider interface
- Support multiple AI backends
- Cost and capability routing

### Phase 6: Distribution

- LAN mode (configurable host binding)
- Cloud deployment option
- Multi-device sync

## Naming

| Old Name | New Name | Notes |
|----------|----------|-------|
| Joymaker | Maxine | Product name |
| mx-joymaker | mx-maxine | Package name |
| MX Joymaker | Maxine | Title bar, splash |
| Joymaker v0.1.0 | Maxine v0.1.0 | Version display |

---

*The Joymaker was always the destination. Maxine is the name it was always going to have. The prototype showed us what we were building. Now we know.*
