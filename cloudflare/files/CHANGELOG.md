# Changelog

All notable changes to the Adobe EDS Cloudflare Worker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2025-12-12

### Added
- **Speculation Rules API**: Inject Chrome Speculation Rules for near-instant page navigation
  - Prerendering with moderate eagerness for all internal links
  - Prefetching for faster subsequent loads
  - Automatic injection into all HTML responses
  - Zero impact on unsupported browsers (graceful degradation)
  - 8 new unit tests for `injectSpeculationRules` function
  - 1 new integration test for end-to-end verification

### Changed
- Processing flow: Added step 3 for speculation rules injection between JSON-LD and cleanup
- Test count: 63 → 71 tests (8 new unit tests + 1 integration test)
- README.md: Updated features, processing flow, version number, and added Speculation Rules documentation
- TESTING.md: Added Speculation Rules example and updated test count

### Technical Details
- Pure string function following two-file testing rule
- Injects `<script type="speculationrules">` before `</head>` closing tag
- Pattern: `"href_matches": "/*"` (all internal links)
- Eagerness: `"moderate"` (balance performance and resources)
- Browser support: Chrome 108+, Edge 108+ (graceful degradation in other browsers)

## [1.1.4] - 2024-12-10

### Added
- Pure function approach for all transformations (no HTMLRewriter dependencies)
- Picture placeholder replacement using pure string functions
- HTML comment removal using pure string functions
- Comprehensive test coverage (63 tests)

### Changed
- Migrated from HTMLRewriter element handlers to pure string functions
- Improved testability (100% testable without Cloudflare runtime)
- Processing order: Transformations first, then cleanup

### Technical Details
- All functions testable in Node.js without Cloudflare Workers runtime
- Two-file testing rule enforced (cloudflare-worker.js + cloudflare-worker.test.js)
- Version management via package.json single source of truth

## [1.1.3] - 2024-12-08

### Added
- HTML comment removal feature
- `removeHtmlComments` pure function with regex pattern
- 8 unit tests for HTML comment removal

### Changed
- Updated processing flow to include comment removal as final step

## [1.1.2] - 2024-12-05

### Added
- Picture placeholder replacement feature
- `PICTURE_PLACEHOLDER_CONFIG` constant for configuration
- Case-insensitive matching with whitespace trimming

### Changed
- Processing order: Picture replacement before JSON-LD injection

## [1.1.1] - 2024-12-01

### Added
- 2-digit year support with century inference
- UK date format support (dd/mm/yy)
- Month name formats with 2-digit years

### Changed
- Date formatting function to handle both 2-digit and 4-digit years
- Century inference: 00-49 → 2000-2049, 50-99 → 1950-1999

## [1.1.0] - 2024-11-28

### Added
- Version header management (`cfw` header)
- Single source of truth: package.json version field
- Semantic versioning enforcement
- Version validation in automated tests

### Changed
- Worker imports version from package.json
- Build-time inlining via Wrangler/esbuild

## [1.0.0] - 2024-11-20

### Added
- Initial release based on Adobe EDS Cloudflare Worker template
- CORS headers for all responses
- JSON-LD generation from page metadata
- Metadata cleanup (removes non-social meta tags)
- Author URL with LinkedIn fallback
- Date formatting (ISO 8601)
- Three trigger mechanisms (clean metadata, legacy json-ld, existing JSON-LD scripts)

### Technical Details
- Apache License 2.0
- Based on Adobe's Cloudflare Worker template
- Environment variables: ORIGIN_HOSTNAME, PUSH_INVALIDATION, ORIGIN_AUTHENTICATION
