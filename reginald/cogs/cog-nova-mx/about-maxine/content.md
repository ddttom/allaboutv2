---
name: about-maxine
title: "About Maxine — The Server-Client Architecture"
description: "How Maxine works: one server, three surfaces, three protocols. The definitive architectural overview of the distributed AI partner."
author: "Tom Cranstoun and Maxine"
created: 2026-02-13
modified: 2026-02-13
version: "1.0"
status: published
category: deliverable
type: info-doc
tags: [maxine, architecture, server, client, electron, pwa, dashboard, websocket, api, ipc, distributed]
audience: [tech, business]
purpose: "architectural-overview"
buildsOn: [maxine-vision, uber-maxine-plan]
partOf: mx-maxine-lives
contentType: "architectural-overview"
runbook: "This document explains how Maxine's server-client architecture works. Read this to understand the relationship between the embedded server, the three client surfaces, and the communication protocols that connect them."
---

# About Maxine — The Server-Client Architecture

Maxine is not a web browser. The browser is one capability — like a hand is one capability of a body. Maxine is a distributed AI partner: one server running the intelligence, multiple client surfaces showing you the result.

Frederik Pohl imagined this in 1969. A thin device in your pocket, connected to central computers that know your preferences and act on your behalf. He called it the Joymaker. We built it. The thin device is your phone. The central computer is the Maxine server. The preferences are your personal cogs.

The difference? Pohl imagined one device per person. Maxine makes every cog-enabled object in the world a joymaker.

---

## The Server — Maxine's Brain

Everything starts with an embedded HTTP server running on `localhost:3456`. It lives inside the Electron desktop app, but it serves any client that can reach it — phone, tablet, another computer, or a future device we haven't imagined yet.

The server is not a microservices cluster. It is six Node.js modules, zero external runtime dependencies, and a single port. It starts in under a second and works offline.

### Six Modules, One Brain

**`server.js` — The Foundation**

The HTTP listener. It routes incoming requests to the right handler: API calls go to the API module, static files get served from disk, WebSocket connections get upgraded. It also manages the optional ngrok tunnel — set an environment variable and you have a public URL, complete with QR code in your terminal.

Three static directories are served:

- `/` routes to the **dashboard** (Maxine's internal control centre)
- `/pwa/` routes to the **phone client** (the PADD)
- `/demo/` routes to demo content for presentations

**`api.js` — The REST Interface**

Every operation Maxine performs is available as an HTTP endpoint. The API is the contract between the server and any client that speaks HTTP. Endpoints are grouped by domain:

- **Status and connection** — server health, LAN IP discovery, QR code generation
- **Identity and cogs** — list identities, read/write personal cogs, filter by layer
- **History and favorites** — browsing history, starred pages
- **Matching** — compare a site's cog against your personal cogs, get scored results
- **AI operations** — chat, narrative generation, action-doc execution
- **Gallery** — photo storage, metadata, retrieval
- **Debug** — WebSocket client info, message logs, force-reload triggers

CORS is wide open. The server trusts its local network. For public access, ngrok's IP restrictions provide the boundary.

**`websocket.js` — The Nervous System**

HTTP is request-response: the client asks, the server answers. But Maxine needs to push information without being asked. When you navigate to a new page on the desktop, the phone needs to know. When a photo is captured, the dashboard should update. When a tunnel becomes available, every client should get the URL.

WebSocket handles this. Every connected client — desktop shell, phone PWA, dashboard — maintains a persistent connection. The server broadcasts events: `cog-detected`, `navigation`, `gallery-updated`, `tunnel-ready`, `favourite-added`. Clients listen and react.

It also powers the **Remote Command Bridge**. The desktop can send JavaScript to the phone for execution — `eval`, `dom` inspection, `click`, `type`, `console` capture, `status` queries. The command flows from API to WebSocket to the phone, executes, and the result flows back. This is how Maxine controls any connected device.

Client identity tracking ensures commands reach the right destination. When a client connects, it sends a `client-hello` message identifying itself as `pwa`, `dashboard`, or `electron`. The server maintains a Map of who is who.

**`index.js` — The Cog Engine**

This is the intelligence. It handles everything about cogs:

- **Detection** — fetches a web page, looks for `<meta name="cog:link">` or `<link rel="cog">` tags. Two-stage: in-page DOM inspection first (fast, handles SPAs), server-side fetch as fallback.
- **Parsing** — extracts YAML frontmatter and markdown body from `.cog.md` files.
- **Matching** — the scoring algorithm that compares a site's cog against your personal cogs. Tag overlap, category-specific bonuses (a restaurant cog boosts dietary and accessibility matches), identity layer weighting. Returns ranked results with human-readable reasons.
- **MX View generation** — takes a matched cog and renders a personalised HTML page. Dark theme, MX brand colours, match cards showing why each personal cog is relevant. Cached for five minutes per URL-and-identity combination.
- **Personal cog management** — reads and writes `.cog.md` files in `~/.mx-app/`. Supports layered identities: base cogs that always apply, plus identity-specific cogs that activate when you switch context.
- **Cleanup** — injects JavaScript that strips cookie banners, ad overlays, newsletter popups, and dark patterns from any web page.

**`ai-router.js` — The Voice**

Maxine speaks through an AI, but she is not locked to one. The AI router abstracts the provider behind a simple interface: give it a system prompt and a conversation, get back a response.

Two providers ship today. **ClaudeProvider** calls the Anthropic API with Maxine's personality baked into the system prompt — she is warm but precise, references your matched cogs by name, and maintains conversation history across messages. **OfflineProvider** returns template responses when no API key is set, so the app never breaks.

Three operations:

- **Chat** — conversational exchange, context-aware, multi-turn
- **Narrative** — generates a personalised story about a page based on your cogs and the site's content
- **Execute** — runs an action-doc as a runbook, with the AI as the runtime

The principle: *the instructions are the program, you are the runtime.*

**`qr-encode.js` — The Bridge to Physical**

A self-contained QR code encoder implementing ISO 18004. No dependencies. It generates SVG for the API endpoint, Unicode half-blocks for the terminal startup banner, and raw matrices for anything else. This is how a physical object — a restaurant menu, a product label, a conference badge — connects to the Maxine ecosystem.

---

## The Three Clients — Surfaces, Not Systems

Each client is a window into Maxine. None of them IS Maxine. Swap one out, build a new one, the server doesn't care.

### Electron Desktop — The Primary Surface

The desktop app runs on macOS (and eventually any platform Electron supports). It uses a **two-view architecture** inside a single window:

```
+-------------------------------------------+
|  Shell View (56px)                        |  <- address bar, nav, controls
+-------------------------------------------+
|                                           |
|  Content View — full Chromium browser     |  <- any website
|                                           |
+-------------------------------------------+
```

The **Shell View** is a thin UI layer: address bar, back/forward/reload, voice button, sidebar toggle, view switcher. It communicates with the main process via IPC (Inter-Process Communication) through a `preload.js` bridge that exposes `window.mx.*` methods.

The **Content View** is a fully sandboxed Chromium instance. It loads any URL. It has no access to Node.js, no access to the shell, no access to personal cogs. Context isolation is enforced.

When the shell detects a cog on the current page, the user can switch to **"Your Page"** — a split view where the original site appears on the left and the personalised Machine Experience appears on the right. Same URL, same content, but now filtered through your identity and preferences.

The desktop also runs **voice** (Web Speech API for both speech-to-text and text-to-speech) and an **AI chat panel** in the sidebar. Spoken commands map to intents; unknown phrases fall through to the AI for conversational response.

**The desktop IS the server.** The Electron main process starts the embedded server, so when the desktop app is running, every other client can connect.

### Phone PWA — The Pocket Surface

The phone client is a Progressive Web App served at `/pwa/`. No app store. No installation binary. Open the URL, tap "Add to Home Screen," and Maxine lives on your phone.

The default state is a **PADD** — a Star Trek-inspired control surface with six tiles: Identity, AI Status, Voice, Scan, Chat, and Gallery. Tapping a tile expands it to full screen. This is not a browser with tabs; it is a purpose-built interface for interacting with cogs.

The phone connects to the Maxine server over your local network (LAN) or through an ngrok tunnel for remote access. It uses the REST API for all operations and maintains a WebSocket connection for real-time updates.

Key capabilities:

- **QR scanning** — point your camera at any QR code. If it contains a URL, Maxine fetches the cog, matches it against your personal cogs, and shows the result. One scan, full context.
- **Camera capture** — take photos that are automatically tagged with metadata from the active cog context. Scan a restaurant QR, then photograph your meal — the photo knows where you are and what matched.
- **Voice** — the same speech-to-text and text-to-speech as the desktop, through the same AI router.
- **Identity switching** — tap a chip to change who you are. Your cog matches change instantly.

The PWA uses a service worker for offline shell caching. The page structure loads even without a network connection; API calls fail gracefully.

### Dashboard — The Diagnostic Surface

The dashboard serves at the server's root URL (`/`). It is Maxine's internal control centre — visible on the desktop, not meant for end users.

It shows:

- **Server status** — uptime, connected clients, AI provider, tunnel URL
- **Phone connection** — LAN IP and QR code for scanning
- **Conversation viewer** — live chat transcripts from any connected client
- **Activity log** — WebSocket event stream in real time
- **Cog browser** — all personal cogs, filterable by identity
- **Gallery** — captured photos with metadata
- **History and favourites** — browsing records

The dashboard maintains its own WebSocket connection. When events fire — a new cog detected, a photo captured, a favourite added — the dashboard updates without polling.

---

## Three Protocols — How They Talk

### REST API (HTTP)

The phone and dashboard speak to the server over HTTP. Every cog operation, every AI request, every gallery upload is an API call. JSON in, JSON out.

This is the **universal protocol**. Any device, any language, any platform that can make an HTTP request can talk to Maxine. The API is the stable contract.

### WebSocket (Real-Time Push)

HTTP can't push. When the server needs to tell clients something happened — a cog was detected, a tunnel came online, a photo was captured — it broadcasts over WebSocket.

Every client connects to `/ws` on startup. The server sends typed events with JSON payloads. Clients auto-reconnect with exponential backoff if the connection drops. A version handshake ensures stale clients reload when the server updates.

The WebSocket also carries the Remote Command Bridge: structured commands that the server routes to specific clients for execution. This is how the desktop can inspect, click, or type on the phone remotely.

### IPC (Desktop Only)

The Electron shell talks to the main process through IPC — Electron's built-in inter-process communication. It is fast (no network round-trip), secure (context isolation prevents content pages from accessing it), and typed (every handler has a named channel).

The `preload.js` script exposes a curated set of IPC methods as `window.mx.*`. The shell never calls `ipcRenderer` directly. The content view has no preload at all — it is a sandboxed browser.

IPC handles everything the shell needs: navigation, cog detection, MX View rendering, personal cog management, AI chat, voice, favourites, history.

---

## Data Flows in Practice

### "Your Page" — Desktop Personalisation

You visit a restaurant website. Maxine detects a cog. You click "Your Page."

1. The shell calls `window.mx.fetchMxView(url, cogLink, identity)` via IPC
2. The main process delegates to the backend's `fetchMxView()` function
3. The backend fetches the restaurant's cog file over HTTP
4. It parses the YAML frontmatter — tags like `cuisine: german`, `accessibility: wheelchair-ramp`
5. It loads your personal cogs for your current identity
6. The matching engine scores each personal cog against the restaurant: your dietary cog scores high (shared `vegetarian` tag), your accessibility cog scores high (shared `wheelchair` tag)
7. It generates styled HTML with match cards: "Your dietary preferences match 4 dishes" and "Step-free access confirmed at entrance"
8. The HTML is cached and returned to the shell
9. The shell loads it in a split view: their page on the left, your page on the right

Same URL. Completely different experience.

### Phone Scans a QR Code

You are at a conference. A speaker's badge has a QR code.

1. You open the Scan tile on the PADD
2. The camera activates and starts decoding frames with jsQR
3. The QR contains a URL pointing to the speaker's cog on the conference registry
4. The PWA calls `POST /api/match` with the cog's frontmatter and your identity
5. The server's matching engine runs: your `consultant` identity cog matches on `cms-expert` and `digital-transformation` tags
6. Results appear as tiles: "Professional overlap: CMS strategy" with a relevance score
7. A WebSocket broadcast notifies the desktop dashboard that a scan occurred
8. You tap Chat and ask Maxine: "What do we have in common with this speaker?"
9. The AI responds, referencing the specific matched tags from both cogs

### Desktop Commands Phone

You are debugging the PWA remotely. The phone is across the room.

1. You call `POST /api/remote` with `{ target: 'pwa', command: 'console' }`
2. The server finds the WebSocket connection tagged as `pwa`
3. It sends a `remote-command` message with a unique ID
4. The phone's console capture module returns its ring buffer of recent log entries
5. The result flows back through WebSocket to the API, which returns it as JSON
6. You see exactly what the phone logged, without touching it

---

## Where Data Lives

All personal data stays on your machine. There is no cloud database. There is no account to create.

```
~/.mx-app/
  base/                    # Cogs that always apply
    dietary.cog.md         # Your food preferences
    accessibility.cog.md   # Your mobility needs
    professional.cog.md    # Your expertise and interests
  identities/
    wheelchair-user/       # Activated when you need step-free access
      mobility.cog.md
    consultant/            # Activated for professional contexts
      speaking.cog.md
  gallery/                 # Photos captured through Maxine
    index.json             # Photo metadata
  favourites.json          # Starred URLs
  history.json             # Where you have been
  cache/                   # Temporary MX View renders
```

Base cogs load for every identity. Identity-specific cogs layer on top. Switch identity and your Machine Experience changes instantly — the same restaurant page shows accessibility information for the wheelchair user, networking opportunities for the consultant.

This is privacy by architecture, not privacy by policy. The server never sends your cogs anywhere. The matching engine runs locally. Your data syncs with git or rsync if you want it to — or it stays on one machine forever.

---

## The Architecture at a Glance

```
                 ┌─────────────────────────────────────────────┐
                 │       Maxine Server (localhost:3456)         │
                 │                                             │
                 │  server.js ─── api.js ─── websocket.js      │
                 │      │                        │              │
                 │  index.js     ai-router.js   qr-encode.js   │
                 │  (cog engine) (AI voice)     (QR bridge)    │
                 │                                             │
                 │  Data: ~/.mx-app/ (cogs, gallery, history)  │
                 └───────────┬──────────┬──────────┬───────────┘
                             │          │          │
                    IPC      │   REST   │   REST   │
                  + events   │  + WS    │  + WS    │
                             │          │          │
                 ┌───────────┴┐  ┌──────┴───┐  ┌──┴────────┐
                 │  Electron  │  │  Phone   │  │ Dashboard │
                 │  Desktop   │  │  PWA     │  │           │
                 │            │  │  (PADD)  │  │ (control  │
                 │ shell +    │  │          │  │  centre)  │
                 │ content    │  │ LAN or   │  │           │
                 │ views      │  │ tunnel   │  │           │
                 └────────────┘  └──────────┘  └───────────┘
```

---

## Why This Architecture

| Decision | Why |
|----------|-----|
| **Embedded server inside Electron** | Zero external dependencies. Works offline. Starts in under a second. The desktop app IS the server — no separate process to manage. |
| **Two WebContentsViews** | The shell persists across page navigation. The content view is fully sandboxed. Split view is trivial. Each view has its own security boundary. |
| **WebSocket for real-time** | Push without polling. Multi-client sync is natural. The remote command bridge needs bidirectional communication. |
| **REST API for phone and dashboard** | Standard HTTP works everywhere — over LAN, over tunnels, over the internet. Any future client speaks HTTP. |
| **IPC for the desktop shell** | No network overhead for the primary surface. Faster than HTTP for the tightest interaction loop. Security through context isolation. |
| **Local-first data** | You own your cogs. No cloud account. No data breach risk. Sync is your choice, not ours. |
| **AI provider abstraction** | Works offline with templates. Works online with Claude. Works tomorrow with any LLM. The cogs are the constant; the AI is interchangeable. |
| **ngrok for remote access** | One environment variable enables a public URL. Free tier works for demos. Paid tier adds custom domains and IP restrictions. No infrastructure to manage. |

---

## The Pohl Realisation

In 1969, Frederik Pohl described a device called the Joymaker. It was a thin client connected to central computers. It knew your preferences. It spoke to you. It acted on your behalf.

Maxine is that device — except it is not one device. The phone is a surface. The desktop is a surface. The dashboard is a surface. The server is the intelligence. Your cogs are the preferences. The AI is the voice.

Every object that carries a cog becomes part of the system. A restaurant menu. A conference badge. An espresso machine. Scan the QR, and Maxine reads the cog, matches it against who you are, and tells you what matters.

Their page. Your page. The Machine Experience.
