---
version: 0.1.0
description: Find ephemeral UI patterns that AI and screen readers miss

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)

mx:
  name: toast-detector
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: draft

  category: mx-core
  partOf: mx-core
  refersTo: [a11y, semantic-html]
  tags: [toast, notifications, ephemeral, accessibility, ux]

  execute:
    runtime: runbook
    command: mx cog toast-detector
    actions:
      - name: scan
        description: Scan page for ephemeral UI patterns
        usage: mx cog toast-detector scan <url>
        inputs:
          - name: url
            type: string
            required: true
            description: URL to scan
          - name: interact
            type: boolean
            required: false
            description: Interact with page to trigger toasts
            default: false
        outputs:
          - name: findings
            type: object
            description: Detected ephemeral UI patterns

      - name: monitor
        description: Monitor page for toast notifications over time
        usage: mx cog toast-detector monitor <url> --duration <seconds>
        inputs:
          - name: url
            type: string
            required: true
            description: URL to monitor
          - name: duration
            type: number
            required: false
            description: Monitoring duration in seconds
            default: 30
        outputs:
          - name: toasts
            type: array
            description: Captured toast notifications

      - name: audit
        description: Audit toast accessibility
        usage: mx cog toast-detector audit <url>
        inputs:
          - name: url
            type: string
            required: true
            description: URL to audit
        outputs:
          - name: audit
            type: object
            description: Accessibility audit of notification patterns

  requires:
    bins: []
    cogs: [a11y]

  contentType: "action-doc"
  runbook: "mx exec toast-detector"
  convergence: true
  accessibility: true
  semantic: true
---

# toast-detector

Find ephemeral UI patterns that AI and screen readers miss.

## Purpose

Toast notifications are the enemy of machine-readability. They:

- Flash and vanish before AI can parse them
- Don't update the DOM permanently
- Often lack ARIA live regions
- Contain critical information (errors, confirmations)

This is Tom's "invisible users" insight: feedback that relies on signals that some users can't perceive.

**If a toast flashes and nobody's watching, did it communicate?**

## Usage

### Scan for Patterns

```bash
mx cog toast-detector scan https://example.com
```

**Output:**

```json
{
  "findings": {
    "toastContainers": [
      {"selector": ".toast-container", "position": "top-right"},
      {"selector": "#notifications", "position": "bottom-center"}
    ],
    "potentialToasts": [
      {"selector": ".alert", "autoHide": true, "duration": 3000},
      {"selector": ".snackbar", "autoHide": true, "duration": 5000}
    ],
    "ariaLiveRegions": [
      {"selector": "[aria-live='polite']", "atomic": false}
    ]
  },
  "risks": [
    "Toast container has no aria-live attribute",
    "Alerts auto-dismiss after 3 seconds"
  ]
}
```

### Monitor for Toasts

```bash
mx cog toast-detector monitor https://example.com --duration 60
```

**Output:**

```json
{
  "captured": [
    {
      "timestamp": "2026-02-06T12:35:00Z",
      "content": "Item added to cart",
      "duration": 3000,
      "type": "success",
      "hasAriaLive": false
    },
    {
      "timestamp": "2026-02-06T12:35:15Z",
      "content": "Error: Please try again",
      "duration": 5000,
      "type": "error",
      "hasAriaLive": true
    }
  ],
  "analysis": {
    "totalToasts": 2,
    "accessible": 1,
    "inaccessible": 1,
    "avgDuration": 4000
  }
}
```

### Accessibility Audit

```bash
mx cog toast-detector audit https://example.com
```

## What It Detects

### Toast Patterns

- Toast containers (`.toast`, `.notification`, `.snackbar`)
- Auto-dismissing alerts
- Position-fixed overlays
- Animated notifications

### Accessibility Issues

- Missing `aria-live` regions
- Too-short display duration
- No keyboard dismissal
- Missing role="alert" for errors

### Anti-Patterns

| Pattern | Problem | Solution |
|---------|---------|----------|
| 3-second toast | Too fast to read | Minimum 5-10 seconds |
| No aria-live | Screen readers miss it | Add aria-live="polite" |
| Errors as toast | Critical info vanishes | Use persistent alerts |
| No close button | Can't dismiss | Add keyboard control |

## The Fix

**Don't toast critical information.**

Instead:

- Use persistent inline alerts
- Update page state visibly
- Provide status in DOM (not just visual)
- Use aria-live regions properly

```html
<!-- Bad: ephemeral toast -->
<div class="toast" style="display:none">Saved!</div>

<!-- Good: persistent, accessible -->
<div role="status" aria-live="polite" class="status-message">
  Changes saved successfully.
</div>
```

## Related

- [a11y cog](a11y.md)
- [Tom's "Invisible Users" talk](https://allabout.network/blogs/mx/)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
