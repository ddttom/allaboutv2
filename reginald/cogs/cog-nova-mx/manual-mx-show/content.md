---
name: manual-mx-show
title: mx-show Manual
description: Interactive window finder for macOS. Pinned favourites, two-phase loading, smart sizing, multi-window, usage tracking.
author: Tom Cranstoun and Maxine
created: 2026-02-13T00:00:00.000Z
modified: 2026-02-15T00:00:00.000Z
version: "3.0"
status: active
category: manual
tags:
  - manual
  - mx-show
  - windows
  - display
  - fzf
  - maxine
partOf: mx-maxine-lives
purpose: Document mx show - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with mx show or understanding its functionality
contextProvides:
  - Interactive window finder for macOS. Pinned favourites, two-phase loading, smart sizing, multi-window, usage tracking.
  - Usage guide and workflow for mx show
  - Troubleshooting and best practices
refersTo: []
---

# mx-show — Window Finder

Find any running app and bring it to the main screen. Built for dual-display setups where windows disappear onto the wrong monitor.

---

## Quick Start

```bash
npm run mx:show
```

Arrow keys to navigate, Enter to select, Esc to cancel.

---

## What It Does

1. Lists every running GUI app with its window titles (two-phase: names appear instantly, window titles load in background)
2. Pinned apps appear first, marked with a cyan ★
3. Non-pinned apps are sorted by recent usage frequency
4. Select a specific window and it activates on the main display, centred at 75% screen size
5. The correct window is raised (not just window 1) when an app has multiple windows

---

## Keyboard

| Key | Action |
|-----|--------|
| **Up/Down** | Navigate the list |
| **Enter** | Bring the selected app/window to the main screen |
| **+** | Pin the selected app to favourites (list reloads) |
| **-** | Unpin the selected app from favourites (list reloads) |
| **Esc** | Cancel and exit |
| **Type** | Filter the list by typing any part of the app or window name |

---

## Pinned Apps

Pinned apps always appear at the top of the list with a cyan ★ marker, in the order they appear in the config file.

### The Config File

```
scripts/mx-show.conf
```

Plain text. One app name per line. Comments with `#`. Blank lines ignored.

### Pinning and Unpinning from the Picker

Press **+** on any app in the list to pin it. Press **-** to unpin. The list reloads immediately to reflect the change. Duplicates are prevented.

### Editing the Config

Open `scripts/mx-show.conf` in any editor. Reorder lines to change the priority. Delete a line to unpin. Add new app names — they must match the macOS process name exactly.

**Finding the exact process name:** Run `mx-show` and look at the name before the `│` separator. That's the process name to use in the config.

---

## Smart Window Sizing

The script detects your main display resolution using `NSScreen` and centres the window at 75% of screen size. No more hardcoded 1400x900 — it adapts to any display.

On a 3200x1800 logical display: 2400x1350 window centred at (400, 225).

---

## Multi-Window Handling

When an app has multiple windows (e.g., VS Code with several projects), each window appears as a separate entry. Selecting a specific window brings *that exact window* to the front using `AXRaise`, not just the first window.

---

## Usage Frequency

The script tracks which apps you bring forward most often. Non-pinned apps are automatically sorted by usage frequency (last 7 days). Frequently-used apps float to the top without needing to be pinned.

History is stored in `scripts/.mx-show-history` and automatically trimmed to 100 entries.

---

## Two-Phase Loading

The picker appears in under 1 second with process names only. Window titles load in the background and the list refreshes automatically. You can start typing to filter immediately while titles load.

---

## Three Ways to Run

### 1. Terminal

```bash
npm run mx:show
```

Or directly:

```bash
bash scripts/mx-show.sh
```

### 2. Spotlight

Search for **MX Show** in Spotlight. The app lives at `~/Applications/MX Show.app` with the MX brand icon. Terminal closes automatically after use.

### 3. Keyboard Shortcut

A Quick Action is installed at `~/Library/Services/MX Show.workflow`. Bind it to any key combination:

**System Settings > Keyboard > Keyboard Shortcuts > Services > General > MX Show**

---

## Scripting Flags

| Flag | Output |
|------|--------|
| `--help` | Usage information and keyboard shortcuts |
| `--list` | Full sorted list with window titles (used by fzf reload) |
| `--list-fast` | Fast sorted list with names only (used for initial display) |

---

## Dependencies

| Dependency | Purpose | Install |
|------------|---------|---------|
| **fzf** | Interactive picker | `brew install fzf` |
| **osascript** | macOS process listing and window management | Built into macOS |
| **mx.colours.sh** | Shared WCAG colour module | Part of MX OS (`~/bin/`) |

---

## Files

| File | Purpose |
|------|---------|
| `scripts/mx-show.sh` | The script (v3.0) |
| `scripts/mx-show.conf` | Pinned apps config |
| `scripts/.mx-show-history` | Usage frequency tracking (auto-generated) |
| `mx-canon/mx-maxine-lives/manuals/mx-show-manual.cog.md` | This manual |
| `~/Applications/MX Show.app` | Spotlight-searchable launcher (MX icon) |
| `~/Library/Services/MX Show.workflow` | Keyboard shortcut Quick Action |

---

## How It Works

1. **Phase 1 (~0.6s):** `osascript` queries System Events for process names only. fzf displays immediately.
2. **Phase 2 (~3s, background):** Full window enumeration runs via fzf's `start:reload`. List updates with window titles.
3. Pinned apps from `mx-show.conf` are sorted to the top with cyan ★ markers.
4. Non-pinned apps are sorted by usage frequency (last 7 days) from `.mx-show-history`.
5. **fzf** presents the list with Catppuccin colours, ANSI markers, and keyboard bindings.
6. On selection, `NSScreen` calculates 75% of main display dimensions.
7. **osascript** activates the app, finds the window by title (`AXRaise`), and repositions it centred on the main display.
8. Usage is recorded to `.mx-show-history` for future sorting.

---

## Troubleshooting

**App doesn't appear in the list?**
It might be a background-only process (menu bar apps, agents). Only foreground GUI apps with windows are listed.

**Wrong process name in config?**
The name must match exactly — including capitalisation and spaces. Run `mx-show` to see the exact names.

**Window doesn't move?**
Some apps restrict window positioning via System Events. The script uses `try` blocks so it won't error — the app will activate but the window may not reposition.

**Spotlight can't find MX Show?**
Spotlight indexes `~/Applications/` periodically. Try `mdutil -E ~/Applications/` to force reindex, or wait a few minutes.

**Terminal stays open after Spotlight launch?**
The .app uses `; exit` to auto-close. Ensure your Terminal profile has "When the shell exits: Close the window" or "Close if the shell exited cleanly" enabled in Profiles > Shell.

---

*Part of MX OS. The instructions are the program.*
