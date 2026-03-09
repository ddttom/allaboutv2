---
title: MX Nav Server Manual
description: Web-based multi-repo navigation dashboard with VS Code Explorer-style UI, search, and recent files.
author: Tom Cranstoun and Maxine
created: 2026-02-15
modified: 2026-03-02
version: "1.0"

mx:
  status: active
  category: manual
  tags:
    - manual
    - navigation
    - dashboard
    - web
    - repositories
    - explorer
  partOf: mx-maxine-lives
  audience: humans
  stability: stable
  runbook: Read when working with mx nav server or understanding its functionality
  contextProvides:
    - Web-based multi-repo navigation dashboard with VS Code Explorer-style UI, search, and recent files.
    - Usage guide and workflow for mx nav server
    - Troubleshooting and best practices
  refersTo: []
---

# MX Nav Server

Web-based navigation dashboard for exploring multiple repositories. VS Code Explorer-style tree view with search and recent files.

---

## Quick Start

```bash
cd scripts/mx-nav-server
npm install
node server.js
```

Open `http://localhost:3000` in a browser.

---

## What It Does

Scans configured repositories for `.mx.yaml.md` metadata files and presents the file tree through a web UI. Provides search across all repositories and a list of recently modified files.

The server caches scan results for 5 minutes. Force a refresh via the API or the dashboard.

---

## Configuration

Configuration lives at `~/.mx-nav-config.json`. Created automatically on first run with sensible defaults.

```json
{
  "repositories": [
    {
      "name": "MX-Hub",
      "path": "/path/to/MX-The-Books/repo",
      "primary": true
    }
  ],
  "port": 3000
}
```

Add more repositories to the array to scan across multiple projects.

---

## API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/config` | GET | Current configuration |
| `/api/tree` | GET | Full repository tree |
| `/api/search?q=term` | GET | Search across all repos |
| `/api/recent?limit=20` | GET | Recently modified files |
| `/api/refresh` | POST | Force cache refresh |

---

## Dependencies

- Node.js
- express

Install with `npm install` inside `scripts/mx-nav-server/`.

---

## Files

| File | Purpose |
|------|---------|
| `scripts/mx-nav-server/server.js` | Express server and API routes |
| `scripts/mx-nav-server/lib/scanner.js` | Repository scanning logic |
| `scripts/mx-nav-server/lib/search.js` | Search and recent file functions |
| `scripts/mx-nav-server/public/` | Static web UI assets |
| `~/.mx-nav-config.json` | User configuration |

---

*Part of MX OS. The instructions are the program.*
