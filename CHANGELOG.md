# Changelog

All notable changes to the AllAboutV2 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2025-12-07b] - Remediation Documentation: Jupyter Notebook Exclusion Policy

### Changed
- **Remediation Analysis Scope**: Jupyter notebook pages (.ipynb files) now **EXCLUDED** from all remediation analysis
  - Added comprehensive exclusion policy to `docs/remediation/files/report-layout.md`
  - Documents rationale: notebooks are interactive educational tools following Jupyter standards, not web content standards
  - Lists 6 excluded notebook pages with URL patterns for filtering
- **Revised Accessibility Fixes** (`01-critical-accessibility-fixes.md`):
  - Pages affected: ~~3 pages~~ → **1 page** (67% reduction)
  - Effort estimate: ~~2-4 hours~~ → **1 hour** (75% reduction)
  - Only `/notes/cursorrules` requires fixes; 2 notebook pages excluded
- **Updated All Remediation Strategies**:
  - Added exclusion notices to image optimization, content freshness, metadata, and content quality docs
  - Security headers remain site-wide (includes notebooks for security)
- **Documentation Updates**:
  - `README.md` - Added notebook exclusion notes to Site Remediation section
  - `CLAUDE.md` - Updated remediation quick links with revised estimates
  - `00-executive-summary.md` - Added prominent exclusion notice

### Rationale
Notebooks serve educational/documentation purposes with intentional complexity for code execution. They follow different accessibility standards (Jupyter) vs traditional web pages (WCAG), and their DOM is dynamically generated client-side rather than optimized for SEO.

### Impact
- **Accessibility**: 67% fewer pages to remediate (3→1)
- **Effort**: 75% reduction in accessibility work (2-4h→1h)
- **Cost**: Minimal savings as most effort was already in content/images
- **Clarity**: Clear boundaries between web content and notebook content remediation

---

## [2025-12-07] - Site Remediation Documentation & Lint Configuration

### Added
- **Comprehensive Site Remediation Documentation**: Complete 121-page EDS site audit analysis with 6 prioritized remediation strategies
  - `docs/remediation/files/00-executive-summary.md` - Executive summary with ROI calculations ($5,000 investment, $120,000 annual benefit, 1,969% ROI)
  - `docs/remediation/files/report-layout.md` - Complete audit report documentation including EDS-specific limitations
  - `docs/remediation/files/01-critical-accessibility-fixes.md` - WCAG compliance for 3 pages (2-4 hours, $400)
  - `docs/remediation/files/02-image-optimization-strategy.md` - Alt text remediation for 200+ images (12 hours, $1,200)
  - `docs/remediation/files/03-security-headers-implementation.md` - CSP & security headers (30-60 min quick win, $100)
  - `docs/remediation/files/04-content-freshness-dates.md` - Last-modified dates site-wide (12 hours, $1,200)
  - `docs/remediation/files/05-metadata-optimization.md` - Titles & descriptions for 30 pages (8 hours, $800)
  - `docs/remediation/files/06-content-quality-improvements.md` - Bottom 10 pages improvement (21 hours, $2,100)
- `.stylelintrc.json` - CSS linting configuration for consistent style standards

### Changed
- **Lint Configuration**: Fixed ES module compatibility issues
  - Renamed `.eslintrc.js` to `.eslintrc.cjs` for proper CommonJS handling in ES module project
  - Updated `.eslintignore` to exclude built files (assets/, react-test/, build/)
  - Auto-fixed formatting issues across all JS files (trailing spaces, semicolons, etc.)
- **Git Configuration**: Updated `.gitignore` to track remediation documentation
  - Changed from `/docs/remediation/` to `/docs/remediation/files/results/`
  - Strategy documents now version controlled, only raw audit data excluded
- **Project Documentation**:
  - Updated `README.md` with Site Remediation & SEO section
  - Updated `CLAUDE.md` with remediation documentation quick links
  - Documented key discovery: EDS automatically handles lazy loading and responsive images

### Fixed
- ESLint configuration error preventing linting in ES module environment
- Numerous code style issues across blocks (spacing, line length, etc.)
- .gitignore excluding important documentation files

### Discovered
- **EDS Automatic Optimizations**: Confirmed that Adobe Edge Delivery Services automatically handles:
  - Lazy loading via `loading="lazy"` attribute (verified in `/scripts/aem.js` line 350)
  - Responsive images via `<picture>` elements with multiple `<source>` breakpoints (lines 342-357)
  - Audit tool reported false positives for these EDS-managed features
- **Cost Savings**: 25% reduction in estimated remediation effort ($6,700 → $5,000) due to EDS automatic features

### Technical Details
- Total files changed: 52 files
- Lines added: 8,790 insertions
- Lines removed: 3,172 deletions
- Remediation documents: 8 new files (5,400+ lines of detailed strategy documentation)

---

## Version History

All versions are tagged in Git with format `vX.Y.Z`.

For older changes, see Git commit history.
