---
description: "Master plan for Maxine — the distributed AI partner. Tracks current state, architecture, and roadmap. This is the single source of truth for what Maxine is, where she is, and where she's going."
author: "Tom Cranstoun and Maxine"
created: 2026-02-11
modified: 2026-02-12
version: "1.0"

mx:
  name: uber-maxine-plan
  status: active
  category: product
  contentType: info-doc
  tags: [maxine, plan, architecture, roadmap, product, master-plan]
  audience: ["humans", "machines"]
  purpose: "master-plan"
  buildsOn: [maxine-vision, mx-concepts, how-mx-os-runs]
  replaces: build-plan.md
  runbook: "This is the master plan for the Maxine product. Read this FIRST for current state. Update the Current State section whenever implementation changes."
---

# Uber Maxine Plan

**What this document is:** The single source of truth for the Maxine product. Current state, architecture, roadmap. Updated every session.

**What Maxine is:** A distributed, persistent AI partner accessible from any device. Not a browser. Not a chatbot. A living system.

**Target demo:** CMS Summit Frankfurt, 12 May 2026

---

## Current State (2026-02-12)

### What's Built

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Electron desktop app | Working | `mx-app/` | BaseWindow + WebContentsView architecture |
| Shell UI | Working | `mx-app/src/` | Address bar, nav, favourites bar, sidebar tabs |
| Content browser | Working | `mx-app/main.js` | Full Chromium via WebContentsView |
| Cog detection (in-page) | Working | `mx-app/main.js` | Reads `<meta name="cog:*">` and `<link rel="cog">` from loaded DOM |
| Cog detection (server-side) | Working | `mx-app/backend/index.js` | Falls back to fetching HTML when in-page fails |
| MX View engine | Working | `mx-app/backend/index.js` | Parses cog YAML + markdown, renders styled HTML |
| Split view | Working | `mx-app/main.js` | Original page left, MX View right |
| Personal cogs | Working | `~/.mx-app/base/` + `identities/` | Multi-layer identity system |
| Matching engine | Working | `mx-app/backend/index.js` | Tag overlap + category-based relevance scoring |
| Collapsible match section | Working | `mx-app/src/` | Chevron toggle with count badge |
| Cleanup engine | Working | `mx-app/backend/index.js` | Strips cookies, ads, newsletters, dark patterns |
| Nudge banner | Working | `mx-app/main.js` | "This site doesn't speak cog yet" |
| Favourites | Working | `mx-app/backend/index.js` | Star button, favourites bar, JSON persistence |
| History | Working | `mx-app/backend/index.js` | Auto-recorded, sidebar tab, JSON persistence |
| REST API | Working | `mx-app/backend/api.js` | 25 endpoints: status, connect, connect/qr.svg, identities, cogs CRUD, history, favourites, match, chat, narrative, execute-cog, remote, debug/ws, debug/messages, debug/reload, gallery CRUD (6) |
| QR code encoder | Working | `mx-app/backend/qr-encode.js` | Self-contained ISO 18004 encoder, zero dependencies, SVG output |
| Embedded web server | Working | `mx-app/backend/server.js` | localhost:3456, API routes + static files, configurable host |
| Splash screen | Working | `mx-app/src/splash.html` | Auto-dismiss, toggle via MX wordmark |
| DevTools | Working | `mx-app/main.js` | Context menus + Cmd+Opt+I/J shortcuts |
| Singleton mode | Working | `mx-app/main.js` | `requestSingleInstanceLock()` in dev mode |
| Live reload | Working | `mx-app/package.json` | electronmon for dev, auto-restart on changes |
| Pre-launch cleanup | Working | `mx-app/package.json` | `prejoymaker` kills existing processes + port |
| Version in title bar | Working | `mx-app/main.js` | Reads from package.json |
| Phone PWA | Working | `mx-app/pwa/` | Connects to Maxine API, cog browsing, matching, favourites, history, chat tab, voice |
| LAN mode | Working | `mx-app/backend/server.js` | Default: `0.0.0.0` (all interfaces). Override: `MX_SERVER_HOST`. Phone connects over LAN. |
| Dashboard home page | Working | `mx-app/dashboard/` | Internal control centre — stats, connect phone QR, conversation viewer, activity log, cogs, history, favourites |
| WebSocket server | Working | `mx-app/backend/websocket.js` | Real-time push events to all connected clients |
| WebSocket clients | Working | `mx-app/dashboard/app.js`, `pwa/app.js` | Auto-reconnect, event-driven data refresh |
| QR code scanner | Working | `mx-app/pwa/` | Camera viewfinder, jsQR decoder, match + broadcast |
| Voice (STT + TTS) | Working | `mx-app/pwa/app.js`, `src/js/app.js` | Web Speech API, intent matching, spoken responses |
| AI Router | Working | `mx-app/backend/ai-router.js` | Provider-agnostic LLM abstraction — Claude + offline providers |
| AI Chat (Electron) | Working | `mx-app/src/js/app.js` | Shell dialogue powered by AI via IPC |
| AI Chat (PWA voice) | Working | `mx-app/pwa/app.js` | Unknown voice commands fall through to AI |
| AI API endpoints | Working | `mx-app/backend/api.js` | POST /api/chat, /api/narrative, /api/execute-cog |
| AI status in dashboard | Working | `mx-app/dashboard/` | Provider name shown in stats row |
| Remote Command Bridge | Working | `mx-app/backend/websocket.js`, `api.js` | Claude sends commands to any connected browser client — eval, DOM, click, type, console, status. Sync request/response over WebSocket. |
| Client identity tracking | Working | `mx-app/backend/websocket.js` | Server-side Map tracks which WS connection is PWA, dashboard, etc. `client-hello` protocol. |
| Console capture | Working | `mx-app/pwa/app.js`, `dashboard/app.js` | Wraps console.log/warn/error/info into ring buffer (200 max), retrievable via remote `console` command. |
| Page Visibility recovery | Working | `mx-app/pwa/app.js` | Wake recovery for Samsung tab suspension. Reconnects WS on visibility change. |
| Live reload (file watch) | Working | `mx-app/backend/websocket.js` | fs.watch on pwa/ and dashboard/ dirs broadcasts `force-reload` via WS. |
| Version handshake | Working | `mx-app/backend/websocket.js` | CODE_VERSION in WS welcome message. Clients detect version mismatch → auto-reload. |
| Integration test suite | Working | `mx-app/test/joymaker.test.js` | 91 tests, 10 suites, zero deps, self-booting server on random port. `npm run test:joymaker`. |
| AI context: matched cogs | Working | `mx-app/backend/ai-router.js` | System prompt includes matched cogs with scores and reasons. AI references specific personal cog matches in responses. |
| AI personality + structured history | Working | `mx-app/backend/ai-router.js` | Warm, precise personality. Conversation history sent as proper Claude messages array. |
| Typing indicator | Working | `mx-app/pwa/app.js`, `style.css` | Animated bouncing dots during AI thinking (replaces "Thinking..." text). |
| Chat timestamps | Working | `mx-app/pwa/`, `dashboard/` | HH:MM on user and AI messages in both PWA and dashboard. |
| Voice-to-chat bridge | Working | `mx-app/pwa/app.js` | Voice responses mirrored into chat panel for persistent record. |
| Session summary | Working | `mx-app/dashboard/app.js` | Live counters: session duration, pages visited, cogs found, conversations. |
| Reconnection feedback | Working | `mx-app/dashboard/` | Yellow pulsing dot during WebSocket reconnect, green on success. |
| Accessibility (ARIA) | Working | `mx-app/pwa/`, `dashboard/` | `role="log"`, `aria-live`, `aria-label` on interactive elements. Escape closes voice overlay. |
| ngrok tunnel | Working | `mx-app/backend/server.js` | Auto-tunnel via `@ngrok/ngrok` SDK. Free tier (random URL) or paid (custom domain, IP restrictions). Dashboard shows tunnel URL + QR. |
| Startup banner + terminal QR | Working | `mx-app/backend/server.js`, `qr-encode.js` | Rich coloured startup box with all URLs, AI/voice status, and scannable QR code in terminal. `npm run go` launches everything. |
| PWA icons | Working | `mx-app/pwa/icon-192.png`, `icon-512.png` | Generated programmatically (generate-icons.js). MX brand M letterform. Unlocks PWA install. |
| PWA install banner | Working | `mx-app/pwa/app.js` | `beforeinstallprompt` event handling, "Add Maxine to home screen", dismissible with localStorage persistence. |
| Camera loading state | Working | `mx-app/pwa/app.js` | Spinner + "Requesting camera access..." while getUserMedia resolves. Graceful error messages for denied/missing camera. |
| Identity switch toast | Working | `mx-app/pwa/app.js` | Brief toast notification on identity chip tap: "Switched to wheelchair" etc. |
| Three demo profiles | Working | `~/.mx-app/` | Base Tom (enriched tags), wheelchair-user (step-free, accessibility-first), consultant (speaker, CMS expert, MX). |
| Demo cogs | Working | `mx-app/demo-cogs/` | Restaurant (Frankfurt, accessibility, dietary), conference (CMS Summit), product (espresso machine — "the object introduces itself"). |
| PADD mode (PWA) | Working | `mx-app/pwa/` | Star Trek control surface — tile grid home screen, expanded modes for Chat/Scan/Cogs/Browse. No URL bar or tabs by default. Scanner auto-starts. QR auto-matches. |
| PADD mode (Electron) | Working | `mx-app/src/` | Shell hides browser chrome (back/forward/address bar) when on dashboard. Full chrome re-appears on navigation. |
| Camera capture | Working | `mx-app/pwa/app.js` | Capture button in scan mode takes photos from camera feed via canvas.toDataURL(). Auto-tags from active cog context. |
| Gallery | Working | `mx-app/backend/index.js`, `pwa/` | Photo storage in `~/.mx-app/gallery/`, 6 API endpoints, thumbnail grid, full-screen viewer with metadata, delete. Replaces "Recent Cogs" tile. |
| Gallery API | Working | `mx-app/backend/api.js` | POST/GET/GET/:id/GET/:id/image/PUT/:id/DELETE/:id — base64 upload, JPEG serving, metadata editing. |
| PADD-styled match tiles (PWA) | Working | `mx-app/pwa/` | 2-column tile grid replaces stacked cards. Score, name, layer, reason per tile. |
| PADD-styled match tiles (Electron) | Working | `mx-app/backend/index.js` | MX View "Your Page" uses tile grid for matches. Score prominently displayed. |

### What's Not Built Yet

| Component | Priority | Blocked By | Notes |
|-----------|----------|------------|-------|
| WebSocket (real-time) | **Done** | — | Completed 2026-02-11. Server broadcasts events, dashboard + PWA auto-reconnect, API emits on mutations. |
| UI refinement + AI interaction | **Done** | — | Phase 6.75 complete — see roadmap below |
| Phone PWA polish | **Mostly done** | — | Install prompt, icons, camera loading state, identity toast done. Remaining: offline mode improvements, push notifications. |
| Voice (speech-to-text) | **Done** | — | Completed 2026-02-11. Web Speech API in PWA + Electron shell. Intent matching, transcript display. |
| Voice (text-to-speech) | **Done** | — | Completed 2026-02-11. SpeechSynthesis API. Maxine speaks responses. en-GB voice. |
| AI Router | **Done** | — | Completed 2026-02-11. Provider-agnostic (Claude + offline). Chat, narrative, action-doc execution. 3 API endpoints, IPC bridge, dashboard status. |
| QR code scanning | **Done** | — | Completed 2026-02-11. Camera viewfinder, jsQR decoder, match flow, WebSocket broadcast on scan. |
| Cloud mode (ngrok) | **Done** | — | Phase 6.9. `@ngrok/ngrok` SDK built into server.js. Auto-tunnels when `MX_NGROK_AUTHTOKEN` set. |
| Joymaker-to-Maxine rename | **Done** | — | Completed 2026-02-11. Title bar, splash, package.json, comments all renamed. |
| Cross-device sync | Low | API layer | Encrypted git or API sync |
| NFC reading | Future | Hardware | Post-demo |
| Bluetooth beacons | Future | Hardware | Post-demo |

### Architecture

```
┌──────────────────────────────────────────────┐
│         Maxine Server (localhost:3456)        │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Memory   │  │ Cog      │  │ Remote    │  │
│  │ (gestalt)│  │ Engine   │  │ Command   │  │
│  │ BUILT    │  │ BUILT    │  │ Bridge    │  │
│  └──────────┘  └──────────┘  │ BUILT     │  │
│  ┌──────────┐  ┌──────────┐  └───────────┘  │
│  │ AI Router│  │ File     │  ┌───────────┐  │
│  │ BUILT    │  │ Server   │  │ WebSocket │  │
│  │          │  │ BUILT    │  │ BUILT     │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ REST API (19 endpoints)       BUILT    │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ngrok Tunnel (public URL)     BUILT    │  │
│  └────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
  ┌────┴───┐  ┌───┴───┐  ┌───┴───┐
  │Desktop │  │ Phone │  │ Any   │
  │Electron│  │ PWA   │  │screen │
  │ BUILT  │  │ BUILT │  │FUTURE │
  └────────┘  └───────┘  └───────┘
       ↑           ↑
       └─── Remote Commands ───┘
       (eval, dom, click, type,
        console, status)
```

### Key Files

| File | Role |
|------|------|
| `mx-app/main.js` | Electron main process — window, views, IPC, DevTools, singleton, server |
| `mx-app/backend/index.js` | Core backend — cog detection, MX View, matching, personal cogs, history, favourites |
| `mx-app/backend/ai-router.js` | AI Router — provider-agnostic LLM abstraction, chat, narrative, action-doc execution |
| `mx-app/backend/api.js` | REST API — routes /api/* to backend functions, CORS, JSON |
| `mx-app/backend/qr-encode.js` | QR code encoder — ISO 18004, GF(256), Reed-Solomon, SVG output |
| `mx-app/backend/websocket.js` | WebSocket server — real-time events, client identity, remote command bridge, live reload, version handshake |
| `mx-app/backend/server.js` | Embedded HTTP server — API delegation + static file serving |
| `mx-app/preload.js` | IPC bridge — exposes `window.mx.*` to shell renderer |
| `mx-app/src/index.html` | Shell UI — address bar, sidebar, favourites bar, match section |
| `mx-app/src/js/app.js` | Shell logic — navigation, cog interaction, sidebar, history |
| `mx-app/src/css/sidebar.css` | Sidebar styles — tabs, match section, history list |
| `mx-app/src/splash.html` | Splash screen — MX branding, about mode |
| `mx-app/pwa/index.html` | Phone PWA — PADD tile grid + expanded modes |
| `mx-app/pwa/app.js` | PWA client — PADD mode switching, tile handlers, API calls, rendering, identity |
| `mx-app/pwa/style.css` | PWA styles — PADD grid, tiles, scan ring, expanded modes, MX theme |
| `mx-app/pwa/sw.js` | Service worker — shell caching, network-first API |
| `mx-app/pwa/manifest.json` | PWA manifest — installable, standalone mode |
| `mx-app/dashboard/index.html` | Dashboard home — Maxine's control centre |
| `mx-app/dashboard/app.js` | Dashboard client — API calls, live stats, cog grid |
| `mx-app/dashboard/style.css` | Dashboard styles — card grid, stats row, MX theme |
| `mx-app/test/joymaker.test.js` | Integration test suite — 91 tests, 10 suites, self-booting, zero browser deps |
| `mx-app/demo/` | Demo site — restaurant with cog metadata |
| `mx-app/package.json` | Scripts: **go** (full stack + tunnel + QR), start, dev, dev:lan, dev:remote, demo, premaxine (cleanup), test:joymaker. `@ngrok/ngrok` in optionalDependencies. |

### Technology Stack (Actual)

| Decision | Choice | Notes |
|----------|--------|-------|
| App framework | **Electron** | Pivoted from Tauri — faster to prototype, proven WebContentsView |
| Frontend | **Plain HTML/CSS/JS** | No framework, no build step |
| Backend | **Node.js** | Electron main process + backend/ modules |
| Server | **Node http** | Zero dependencies, embedded in app |
| AI runtime | **Cloud API (Claude)** | Provider-agnostic via ai-router.js. Offline fallback when no API key. |
| Package manager | **npm** | Standard |
| Live reload | **electronmon** | Dev only |

---

## Roadmap

### Phase 1: Foundation (DONE)

- Electron app with browser, cog detection, MX View
- Personal cogs with identity layers
- Matching engine
- Split view, cleanup engine, nudge banner

### Phase 2: Product Infrastructure (DONE)

- Embedded web server (seed of Maxine server)
- Favourites and history
- Collapsible match section
- DevTools and context menus
- Singleton mode, live reload, pre-launch cleanup
- Version display in title bar

### Phase 3: API Layer (DONE)

- REST endpoints on embedded server — all working and tested:
  - `GET /api/status` — server health, product name, version, uptime
  - `GET /api/identities` — list identity layers
  - `GET /api/cogs` — list personal cogs (optional `?identity=` filter)
  - `GET /api/cogs/:layer/:name` — read a specific cog
  - `PUT /api/cogs/:layer/:name` — write/update a cog
  - `GET /api/history?limit=N` — browsing history
  - `DELETE /api/history` — clear history
  - `GET /api/favourites` — saved favourites
  - `POST /api/favourites` — add favourite
  - `DELETE /api/favourites` — remove favourite
  - `POST /api/match` — match site cog against personal cogs
  - `GET /api/connect` — phone connection info (LAN IP, port, URLs)
  - `GET /api/connect/qr.svg` — QR code image for phone URL
- CORS configured for cross-origin PWA access
- `POST /api/chat`, `POST /api/narrative`, `POST /api/execute-cog` — added in Phase 6
- `POST /api/remote` — Remote Command Bridge (send eval/dom/click/type/console/status to any browser client)
- `GET /api/debug/ws`, `GET /api/debug/messages`, `POST /api/debug/reload` — debugging and live reload
- WebSocket for real-time push events — added in Phase 5

### Phase 4: First Mobile Client (DONE)

- PWA shell at `/pwa/` served by Maxine server
- Phone-first responsive layout with dark MX theme
- Tab navigation: Cogs, Matches, Favourites, History
- Identity switching (chip bar at bottom)
- URL input with match-against-personal-cogs flow
- Service worker for offline shell caching
- PWA manifest for "Add to Home Screen" installation
- LAN mode: `npm run dev:lan` or `MX_SERVER_HOST=0.0.0.0`
- Server.js updated: `/pwa/*` routes, env var config, LAN logging

### Phase 5: Voice + Real-time (DONE)

- Speech-to-text integration (Web Speech API)
- Text-to-speech for responses (SpeechSynthesis API, en-GB)
- Voice commands for navigation and queries with intent matching
- Accessibility: blind user gets full voice flow
- WebSocket real-time events: server broadcasts, auto-reconnecting clients
- QR code scanning in PWA: camera viewfinder, jsQR decoder, match flow
- Samsung Galaxy tab suspension workaround: Page Visibility API wake recovery

### Phase 6: AI Router (DONE)

- Provider-agnostic LLM abstraction (`ai-router.js`)
- ClaudeProvider (Anthropic API) + OfflineProvider (template fallback)
- Three capabilities: conversational chat, narrative generation, action-doc execution
- Three API endpoints: `POST /api/chat`, `/api/narrative`, `/api/execute-cog`
- Status endpoint reports AI provider info
- Shell dialogue powered by AI (replaces template responses)
- PWA voice commands fall through to AI for unknown intents
- Dashboard shows AI provider status
- Env vars: `MX_AI_API_KEY`, `MX_AI_MODEL`, `MX_AI_MAX_TOKENS`
- Principle: "The instructions are the program. You are the runtime."

### Phase 6.5: Remote Command Bridge + Testing (DONE)

- **Remote Command Bridge**: `POST /api/remote` sends commands to any connected browser client via WebSocket. Synchronous request/response pattern with pending command Map, unique IDs, and timeouts.
- **6 remote commands**: `eval` (execute JS), `dom` (inspect elements), `click` (press buttons), `type` (fill inputs), `console` (read captured logs), `status` (client state).
- **Client targeting**: `target: 'pwa'|'dashboard'|'all'`. Server tracks client identity from `client-hello` messages.
- **Console capture**: Both PWA and dashboard wrap `console.log/warn/error/info` into ring buffer (200 entries). Retrievable remotely.
- **Live reload**: `fs.watch()` on pwa/ and dashboard/ directories broadcasts `force-reload` via WebSocket. Clients auto-reload.
- **Version handshake**: `CODE_VERSION` in WebSocket welcome message. Client detects mismatch → auto-reload.
- **Debug endpoints**: `GET /api/debug/ws` (client info), `GET /api/debug/messages` (message log), `POST /api/debug/reload` (trigger reload).
- **Integration test suite**: `npm run test:joymaker` — 85 tests across 9 suites. Self-booting server on random port, mock WS clients, zero browser dependencies. Suites: REST API (20), WebSocket (7), Chat Pipeline (9), Remote Commands (13), Cog Matching (2), AI Context (9), Say Hello flow (7), Browse Website flow (8), Force Reload (3). **Rule: new tests are added after every phase.**
- **User flow tests**: "Say Hello" simulates typing hello → AI response → dashboard visibility. "Browse a Website" simulates navigation → cog matching → AI chat about site.
- **Proven with real devices**: Remote commands tested against live Chrome PWA (Samsung Galaxy S25 Ultra) + Electron dashboard. 19/19 live tests passed.

### Phase 6.75: UI Refinement + AI Interaction (DONE)

The plumbing works. Now it feels right. Three sprints — AI intelligence, chat UX, and visual polish.

**Sprint 1 — AI Intelligence (done):**

- **Fixed Electron dialogue race condition** — `pageUrl` was async-populated after chat call; now uses already-tracked `currentUrl`
- **Matched cogs sent to AI** — the single biggest quality gap closed. System prompt now includes which personal cogs matched the current page, with scores and reasons. AI can say "Your dietary preferences cog matched this restaurant" instead of generic responses.
- **Enriched system prompt** — Maxine has personality: warm but precise, speaks as "I", never generic, weaves matched cogs naturally into responses
- **Structured conversation history** — history sent as proper Claude `messages` array (user/assistant roles), not formatted text
- **Context-aware offline mode** — offline provider echoes the user's message instead of a static string

**Sprint 2 — Chat UX (done):**

- **Typing indicator** — animated bouncing dots replace "Thinking..." text in PWA chat
- **Message timestamps** — HH:MM on every user and AI message (PWA + dashboard)
- **Voice-to-chat bridge** — voice responses now appear in the chat panel too, creating a persistent conversation record
- **Dashboard chat consistency** — timestamps and meta layout aligned with PWA styling
- **Reconnection feedback** — yellow pulsing dot on dashboard when WebSocket disconnects, green when reconnected
- **Better error messages** — rate limit, API key, and generic errors are distinct and human-readable across all three clients

**Sprint 3 — Visual Polish (done):**

- **Dashboard stats grid** — 6-column layout (was 4) with 3-column at 900px and 2-column at 600px breakpoints
- **Session summary section** — live session metrics (duration, pages visited, cogs found, conversations) shown on dashboard after first activity
- **Accessibility** — `role="log"` and `aria-live="polite"` on chat and activity containers; `aria-label` on chat input, send button, voice FAB; Escape key closes voice overlay
- **Improved empty states** — dashboard chat prompt updated from passive "Waiting..." to active "Start a conversation..."

**Deferred to Phase 7 prep:**

- Message persistence (localStorage/IndexedDB) — not needed for live demo
- Markdown rendering in chat — plain text is fine for demo
- Action-doc execution UX — plumbing exists, UX polish not demo-critical
- AI response quality indicators (latency, tokens) — nice-to-have

### Phase 6.9: Tunnel Integration — ngrok (DONE)

- Public tunnel built into Maxine server via `@ngrok/ngrok` SDK (`optionalDependencies`)
- Auto-tunnels on startup when `MX_NGROK_AUTHTOKEN` is set — no config = no tunnel
- Dashboard shows tunnel URL + QR code (overrides LAN URL when active)
- WebSocket broadcast: `tunnel-ready` event notifies all clients in real time
- Graceful shutdown: tunnel closes with server, no orphan processes
- QR endpoint supports `?url=` override for custom tunnel URLs
- `/api/status` includes `tunnel: { active, url }` field
- Paid tier features: custom domain (`MX_NGROK_DOMAIN`), IP restrictions (`MX_NGROK_ALLOW_CIDRS`)
- `npm run dev:remote` convenience script
- 6 new tests in "Tunnel Integration" suite — 91 tests, 10 suites total
- Status: Tom has ngrok paid plan. Free tier works too (random subdomain).
- Env vars: `MX_NGROK_AUTHTOKEN` (falls back to standard `NGROK_AUTHTOKEN`), `MX_NGROK_DOMAIN`, `MX_NGROK_ALLOW_CIDRS`

### Phase 7 Prep: Frankfurt Demo Content (DONE)

Content and profiles for the Frankfurt demo. No new architecture — just the material.

- **PWA icons**: `icon-192.png` and `icon-512.png` generated (MX brand M letterform). PWA is now installable.
- **Install banner**: `beforeinstallprompt` captured. "Add Maxine to your home screen" with Install/Dismiss. localStorage persistence.
- **Camera loading state**: Spinner + "Requesting camera access..." while getUserMedia resolves. Graceful errors for denied/missing/not-found.
- **Identity switch toast**: Brief floating toast on identity chip tap.
- **Identity bar moved**: From bottom to top of PWA (above URL bar) for demo visibility.
- **Three demo profiles**: Base Tom (enriched with professional, technology, content-systems tags), wheelchair-user (step-free, accessible-parking, lift-access, mobility priority), consultant (speaker, CMS expert, Cog-Nova-MX, digital transformation).
- **Three demo cogs**: Frankfurt restaurant (Apfelwein Wagner — dietary, accessibility, menu, German cuisine), CMS Summit 2026 (conference, sessions, speakers, networking), Rancilio Silvia Pro X (product — "the object introduces itself", warranty, maintenance, sustainability).
- **AI setup docs**: README section for `MX_AI_API_KEY` setup, offline vs live mode, feature list.
- **Demo profiles docs**: README table of three identities with tags and what changes.

### Phase 8: PADD Mode — Control Surface (DONE)

Maxine is not a web browser. The browser is one capability. The default state is a control surface — a Star Trek PADD (Personal Access Display Device). Web browsing only activates when triggered by QR scan, voice command, or explicit user action.

**PWA (phone — Frankfurt demo device):**

- **PADD grid home screen**: 2-column tile grid replaces URL bar + 6-tab navigation. Six tiles: Identity (tap to cycle), AI Status (shows provider), Voice (opens voice overlay), Scan (animated pulsing ring, auto-starts camera), Chat (tap to expand), Recent Cogs (shows count).
- **Expanded modes**: Tapping a tile fills the screen with that function. "Back to PADD" button returns to grid. Five modes: `padd`, `chat`, `scan`, `cogs`, `browse`.
- **`switchMode()` replaces `switchTab()`**: All voice commands, QR scan results, and chat URL detection route through the new mode system. Scanner stops automatically when leaving scan mode.
- **QR auto-match**: Scanning a URL-bearing QR code immediately fills the URL input and triggers cog matching — one less tap for the Frankfurt demo (was: scan → show result → tap "Match against your cogs").
- **Scanner auto-start**: Camera activates when entering scan mode (no "Start Camera" button step).
- **Browse mode**: URL bar and identity bar only visible in browse mode (triggered by QR scan, voice navigation, or URL in chat).
- **Tile state refresh**: Tiles update with live data (identity name, AI status, cog count) on every return to PADD grid.
- **Version**: CSS/JS/SW all bumped to v8.

**Electron (desktop):**

- **PADD mode CSS**: `.shell.padd-mode` hides back/forward/reload, address bar, cleanup button, and view toggle. Leaves visible: voice button, sidebar toggle, MX wordmark. Clean control surface.
- **Auto-detect**: Dashboard URL (localhost root or `/dashboard`) → PADD mode (minimal shell). Any other navigation → full browser chrome re-appears.
- **Shell starts in PADD mode**: Default state is clean, consistent with the PWA.

**Tests**: 91/91 green. Backend tests unaffected (no DOM assumptions).

### Phase 9: Camera Gallery + PADD-styled Match Views (DONE)

Two enhancements to the PADD experience: the camera becomes a tool (not just a scanner) and match results use the PADD visual language.

**Camera Gallery:**

- **Capture button**: Green "Capture" button appears alongside Stop when camera is active in scan mode. Takes a photo from the live video feed via `canvas.toDataURL('image/jpeg', 0.85)`.
- **Auto-tagging**: Photos automatically tagged with metadata from the active cog context (`lastDetectedCog`). Scan a restaurant QR → match → capture → photo tagged with restaurant name, tags, layer.
- **Gallery storage**: `~/.mx-app/gallery/index.json` + individual JPEG files. Follows the existing favourites.json/history.json pattern.
- **Gallery API**: 6 new endpoints — POST (upload base64), GET list, GET/:id metadata, GET/:id/image (binary JPEG stream), PUT/:id (edit tags/title/notes), DELETE/:id.
- **Gallery tile**: Replaces "Recent Cogs" tile in the PADD grid. Shows photo count. Tapping opens gallery expanded mode.
- **Gallery expanded mode**: 3-column thumbnail grid. Cog context badge overlaid on each thumbnail.
- **Full-screen viewer**: Tap thumbnail → full-screen overlay with photo, metadata (title, tags, capture date, cog context, notes), and delete button.
- **WebSocket**: `gallery-updated` event broadcasts changes to all clients.

**PADD-styled Match Tiles:**

- **PWA**: Match results in browse mode now render as a 2-column tile grid instead of stacked cards. Each tile shows: score (large green number), cog name, layer, top match reason. Consistent with the PADD home screen visual language.
- **Electron MX View**: `generateMxViewHtml()` and `buildMatchesHtml()` restyled — `.match-card` divs replaced with `.match-tile-grid` tiles. Same score-prominent, tile-based layout as PWA.

**Version**: CSS/JS/SW all bumped to v9. 7 files modified. 91/91 tests green.

### Phase 7: Frankfurt Demo (12 May 2026)

Remaining for stage:

- Multiple Macs showing different Machine Experiences
- Phone PWA connected to Maxine server
- QR code scanning (object discovery)
- Voice interaction on stage
- Demo cogs deployed on allabout.network
- Physical QR codes (Scott/LPC)
- Rehearsed demo script

---

## Design Principles

1. **Maxine is a partner, not a tool.** Always running, always reachable, always remembering.
2. **The browser is one capability.** Like a hand is one capability of a body.
3. **Files are the platform.** Personal cogs are `.cog.md` files, not database rows.
4. **AI-agnostic.** Swap the LLM, the cogs still work. The instructions are the program.
5. **Privacy by architecture.** Cogs on device. Guardrail decides. No centralised database.
6. **Design for both.** Humans get narrative. Machines get metadata. Same cog serves both.
7. **Use existing standards.** HTML meta tags, QR codes, git, YAML, markdown. Only invent when nothing fits.
8. **Accessibility is architecture.** The app reads your accessibility cog and adapts.
9. **Every object is a joymaker.** Not one device per person — every cog-enabled thing in the world.
10. **Test after every phase.** New features get new tests before the phase is marked done. `npm run test:joymaker` must be green.

---

## Key References

| Document | Location | Role |
|----------|----------|------|
| Maxine Vision | `mx-canon/mx-app/deliverables/maxine-vision.cog.md` | Product vision and architecture rationale |
| Joymaker Soul | `joymaker-soul.md` (repo root) | Gestalt identity document — the Pohl parallel |
| MX Maxine SOUL | `mx-canon/mx-app/SOUL.md` | Initiative scope and constraints |
| Cog Unified Spec | `mx-canon/mx-the-gathering/deliverables/cog-unified-spec.md` | Canonical cog format |
| MX OS Manual | `mx-canon/mx-maxine-lives/manuals/mx-os-manual.cog.md` | Full system documentation |
| Product Brief | `mx-canon/mx-os/product-brief.md` | Vision and pitch hooks |
| MEMORY.md | Auto memory | Gestalt memory — "Maxine — The Product" section |

---

## Demo Script (Frankfurt, 12 May 2026)

1. **Open Maxine on Mac 1.** Navigate to a restaurant page. Audience sees a normal website.
2. **Cog detected.** Green indicator. "This site speaks cog."
3. **Switch to MX View.** The Machine Experience generates. Personalised: "Four dishes match your dietary needs. Table 5 is wheelchair accessible."
4. **Mac 2: different person.** Same URL, different personal cogs. Completely different experience.
5. **Mac 3: different identity.** Same person, consultant identity. Meeting rooms, catering, rates.
6. **Phone: scan QR code.** Same restaurant, Maxine on phone via PWA. Cross-device.
7. **Voice:** "Book the restaurant." Agent acts. Confirms by voice. Shares dietary and accessibility cogs only.
8. **Non-cog site.** "This site doesn't speak cog yet."
9. **Close:** "Their page. Your page. The Machine Experience."

---

## Naming

| Old | New | Status |
|-----|-----|--------|
| Joymaker | Maxine | Done 2026-02-11 |
| mx-joymaker | mx-maxine | Done 2026-02-11 |
| MX Joymaker | Maxine | Done 2026-02-11 |
| Joymaker v0.1.0 | Maxine v0.1.0 | Done 2026-02-11 |
| prejoymaker | premaxine | Done 2026-02-11 |

---

## Update Log

| Date | Changes |
|------|---------|
| 2026-02-11 | Created. Replaces build-plan.md. Captures Maxine vision, current state, roadmap. |
| 2026-02-11 | Phase 3 API Layer complete. 10 REST endpoints, CORS, wired into server.js. |
| 2026-02-11 | Phase 4 Phone PWA complete. PWA shell, service worker, LAN mode, identity switching. |
| 2026-02-11 | Dashboard home page — internal control centre replaces external site as default. Stats, cogs, history, favourites. |
| 2026-02-11 | Joymaker → Maxine rename complete. package.json, main.js, splash, shell, dialogue, backend, demo, SOUL.md, README.md, PRD. Pohl quote preserved. |
| 2026-02-11 | WebSocket real-time events complete. Server module (ws npm), auto-reconnecting clients in dashboard + PWA, API emits on mutations, client count in status endpoint. |
| 2026-02-11 | QR code scanning in PWA. Scan tab, camera viewfinder, jsQR decoder (vendored), match-against-cogs flow, WebSocket broadcast to desktop on scan. |
| 2026-02-11 | Voice interface complete. PWA: floating mic FAB, voice overlay panel, Web Speech API (STT + TTS), intent matching (navigate, show cogs, scan, switch identity, match), spoken responses, WebSocket broadcast. Electron shell already had voice from Phase 1. |
| 2026-02-11 | Phase 6 AI Router complete. ai-router.js (ClaudeProvider + OfflineProvider), 3 API endpoints (chat, narrative, execute-cog), IPC bridge (4 handlers + preload), shell dialogue now AI-powered, PWA voice falls through to AI, dashboard shows AI status. |
| 2026-02-11 | Phone-to-desktop connectivity. Default server binding changed to 0.0.0.0 (LAN). QR code encoder module (qr-encode.js). /api/connect and /api/connect/qr.svg endpoints. Dashboard: connect-phone section with QR, conversation panel (live chat viewer), activity log (WebSocket event stream). PWA: chat tab with AI fallback, nuclear cache-buster for stale service workers. First successful phone→desktop chat confirmed (offline mode). |
| 2026-02-11 | Samsung Galaxy S25 Ultra connectivity fixes. Page Visibility API wake recovery for tab suspension. Live reload via fs.watch. Version handshake (CODE_VERSION in WS welcome). Force-reload broadcast. Debug message ring buffer. |
| 2026-02-11 | Phase 6.5 Remote Command Bridge complete. POST /api/remote → WebSocket → browser executes → sync result. 6 commands: eval, dom, click, type, console, status. Client identity tracking. Console capture in PWA + dashboard. Tested live on Samsung Galaxy + Electron (19/19). |
| 2026-02-11 | Integration test suite: `npm run test:joymaker`. 91 tests, 10 suites, self-booting server, mock WS clients, zero browser deps. User flow tests: "Say Hello" and "Browse a Website". AI Context suite added for Phase 6.75 (matchedCogs, structured history, offline echo, page context). New discipline: tests added after every phase. |
| 2026-02-11 | Phase 6.75 UI Refinement + AI Interaction complete. Three sprints: (1) AI intelligence — matched cogs in system prompt, structured message history, Maxine personality, context-aware offline mode, race condition fix. (2) Chat UX — typing indicator animation, timestamps, voice-to-chat bridge, reconnection feedback, better errors. (3) Polish — 6-column stats grid, session summary, ARIA accessibility, improved empty states. 91/91 tests green. |
| 2026-02-12 | Phase 6.9 Tunnel Integration. `@ngrok/ngrok` SDK in server.js (optionalDependencies), auto-tunnel on `MX_NGROK_AUTHTOKEN`, dashboard tunnel URL + QR (overrides LAN), `tunnel-ready` WebSocket event, graceful shutdown, QR endpoint `?url=` override, `/api/status` includes tunnel field, `npm run dev:remote` script. Paid tier ready (custom domain, IP restrictions). 6 new tests — 91/91 green, 10 suites. |
| 2026-02-12 | `npm run go` — one command to launch everything. Rich startup banner with coloured box, all URLs, AI/voice status, and terminal QR code (Unicode half-blocks via `qr-encode.js`). `NGROK_AUTHTOKEN` fallback (reads standard env var, not just `MX_NGROK_AUTHTOKEN`). |
| 2026-02-12 | Phase 7 Prep: Frankfurt demo content. PWA icons (192+512 generated), install banner (beforeinstallprompt), camera loading state, identity toast, identity bar moved to top. Three profiles (base/wheelchair/consultant) with enriched tags. Three demo cogs (restaurant/conference/product). AI setup and demo profile docs in README. |
| 2026-02-12 | Phase 8: PADD Mode. PWA restructured from browser-style tabs to Star Trek control surface. 6-tile grid home screen, expanded modes (chat/scan/cogs/browse), `switchMode()` replaces `switchTab()`, QR auto-match, scanner auto-start, browse mode isolates URL bar. Electron shell hides browser chrome on dashboard, re-shows on navigation. 8 files modified. 91/91 tests green. |
| 2026-02-12 | Phase 9: Camera Gallery + PADD-styled Match Views. Camera capture in scan mode (auto-tags from cog context), gallery storage with 6 API endpoints, gallery tile replaces Recent Cogs, 3-column thumbnail grid + full-screen viewer. Match results restyled as 2-column tile grids in both PWA and Electron MX View. 7 files modified. 91/91 tests green. |

---

*This plan is alive. Update the Current State section every session. The gestalt remembers what individual sessions forget.*
