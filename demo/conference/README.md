# MX Summit Conference Demo

N-language architecture reference implementation for conferences.

## Purpose

Proves the n-language pattern works beyond restaurants. This demo shows:

- Conference/event website structure
- English + German bilingual support
- Shared assets architecture
- Schema.org Event markup
- WebMCP tools for AI agents

## Directory Structure

```
conference/
├── assets/              # Shared CSS/JS (all languages)
│   ├── style.css        # Complete styling
│   └── script.js        # N-language aware JavaScript
├── en/                  # English version
│   └── index.cog.html   # English content
├── de/                  # German version
│   └── index.cog.html   # German content (Deutsch)
├── index.html           # Root redirect (Accept-Language detection)
└── README.md            # This file
```

## N-Language Architecture

### Shared Assets

All CSS and JavaScript is shared across language versions:

- **style.css** - Complete styling, language-agnostic
- **script.js** - Auto-detects language from URL path

### Adding a New Language

1. Create directory: `mkdir fr/`
2. Copy existing HTML: `cp en/index.cog.html fr/index.cog.html`
3. Translate content
4. Update `availableLanguages` array in:
   - `index.html` (root redirect)
   - `assets/script.js` (language selector)
5. Add hreflang tags to all HTML files

No CSS or JavaScript changes required.

## Language Detection

### Client-Side (index.html)

```javascript
// Parse Accept-Language with regional cascade
// de-DE → try /de-de/ → try /de/ → default
const browserPrefs = parseLanguagePreferences();
const targetLang = findBestLanguage(browserPrefs, availableLanguages, defaultLanguage);
window.location.replace('./' + targetLang + '/');
```

### GDPR Compliant

- No cookies
- No localStorage
- Always follows browser Accept-Language header
- Users control preference via browser settings

## Technical Features

### Schema.org Event Markup

```json
{
  "@type": "Event",
  "name": "MX Summit 2026",
  "startDate": "2026-05-12T09:00:00+02:00",
  "location": {
    "@type": "Place",
    "name": "Messe Frankfurt"
  }
}
```

### WebMCP Tools

- `get-conference-info` - Retrieve conference details
- `toggle-language` - Switch language version
- `get-language-info` - Current/available languages

### Accessibility (WCAG 2.1 AA)

- Skip navigation link
- Semantic HTML5 structure
- ARIA labels on navigation
- Keyboard-navigable hamburger menu
- Sufficient color contrast

## Comparison: Salva vs Conference

| Feature | Salva (Restaurant) | Conference |
|---------|-------------------|------------|
| Languages | Spanish + English | English + German |
| Schema.org | Restaurant | Event |
| Content type | Menu, location | Schedule, speakers |
| Shared assets | /assets/ | /assets/ |
| Root redirect | Yes | Yes |
| WebMCP tools | 4 tools | 3 tools |

Both use identical n-language architecture patterns.

## Files

| File | Lines | Purpose |
|------|-------|---------|
| assets/style.css | ~400 | Complete conference styling |
| assets/script.js | ~180 | Hamburger, language selector, WebMCP |
| en/index.cog.html | ~220 | English content |
| de/index.cog.html | ~220 | German content |
| index.html | ~100 | Root redirect with language detection |

## Related

- **Salva Demo**: `../salva/` - Restaurant n-language reference
- **N-Language Template**: `hub-content/mx-reference-implementations/_templates/n-lang-business-template.cog.html`
- **Cogify Documentation**: `hub-content/scripts/cogs/cogify-this.cog.md`
- **REGINALD Proposal**: `packages/mx-collaboration/proposals/reginald-language-redirect.md`

---

**Created:** 2026-02-22
**Author:** CogNovaMX Ltd
**Architecture:** N-language with shared assets
