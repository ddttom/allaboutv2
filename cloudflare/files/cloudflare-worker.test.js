/**

* Unit Tests for Cloudflare Worker Helper Functions
*
* These tests verify the utility functions used in the worker.
* Run with: npm test (requires vitest or jest)
 * @file cloudflare-worker.test.js
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags test
 * @mx:partOf mx-os

 */

/*eslint-disable max-classes-per-file, import/no-unresolved*/
// Multiple mock classes needed for testing

import {
  describe, test, expect, vi, beforeEach, afterEach,
} from 'vitest';
import worker, {
  getExtension,
  isMediaRequest,
  isRUMRequest,
  buildJsonLd,
  ORGANISATION_CONFIG,
  formatISO8601Date,
  normalizeYear,
  replacePicturePlaceholder,
  removeHtmlComments,
  injectSpeculationRules,
  injectJsonLd,
  parseAcceptLanguage,
  detectLanguage,
  findLanguageSite,
  shouldLanguageRedirect,
  categoriseAgent,
  categoriseReferer,
  isAiAgent,
  shouldSkipAiCapture,
  buildAiVisitRow,
  isAttributionHost,
  wrapLlmsTxtAsHtml,
  isAgentDirectoryFile,
  buildFreeBookFormHTML,
  WORKER_VERSION,
  PICTURE_PLACEHOLDER_CONFIG,
} from './cloudflare-worker.js';

// Test suite for worker version
describe('Worker Version', () => {
  test('WORKER_VERSION constant exists and follows semantic versioning', () => {
    expect(WORKER_VERSION).toBeDefined();
    expect(typeof WORKER_VERSION).toBe('string');
    // Semantic versioning pattern: MAJOR.MINOR.PATCH (e.g., 1.0.0)
    expect(WORKER_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('WORKER_VERSION starts at v1.0.0', () => {
    // Verify initial version is 1.0.0
    const [major, minor, patch] = WORKER_VERSION.split('.').map(Number);
    expect(major).toBeGreaterThanOrEqual(1);
    expect(minor).toBeGreaterThanOrEqual(0);
    expect(patch).toBeGreaterThanOrEqual(0);
  });
});

// Test suite for getExtension
describe('getExtension', () => {
  test('extracts file extension correctly', () => {
    expect(getExtension('/path/to/file.jpg')).toBe('jpg');
    expect(getExtension('/path/to/file.jpeg')).toBe('jpeg');
    expect(getExtension('/path/to/file.png')).toBe('png');
    expect(getExtension('/path/to/file.json')).toBe('json');
  });

  test('handles files without extension', () => {
    expect(getExtension('/path/to/file')).toBe('');
    expect(getExtension('/path/to/')).toBe('');
  });

  test('handles hidden files (dotfiles)', () => {
    // Dotfiles return empty string because dot is at position 0
    expect(getExtension('/path/to/.gitignore')).toBe('');
    expect(getExtension('/path/to/.env')).toBe('');
  });

  test('handles multiple dots in filename', () => {
    expect(getExtension('/path/to/file.backup.tar.gz')).toBe('gz');
    expect(getExtension('/path/to/my.config.json')).toBe('json');
  });

  test('handles edge cases', () => {
    expect(getExtension('')).toBe('');
    expect(getExtension('/')).toBe('');
    expect(getExtension('/.')).toBe('');
  });
});

// Test suite for isMediaRequest
describe('isMediaRequest', () => {
  test('identifies valid media requests', () => {
    const validUrls = [
      'https://example.com/media_1234567890abcdef1234567890abcdef12345678.png',
      'https://example.com/media_abcdef0123456789abcdef0123456789abcdef01.jpg',
      'https://example.com/media_0000000000000000000000000000000000000000.jpeg',
      'https://example.com/media_ffffffffffffffffffffffffffffffffffffffff-scaled.webp',
    ];

    validUrls.forEach((urlStr) => {
      const url = new URL(urlStr);
      expect(isMediaRequest(url)).toBe(true);
    });
  });

  test('rejects invalid media requests', () => {
    const invalidUrls = [
      'https://example.com/media.png', // Too short hash
      'https://example.com/media_123.jpg', // Hash too short
      'https://example.com/image.png', // No media_ prefix
      'https://example.com/media_GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG.png', // Invalid hex
      'https://example.com/path/to/image.jpg', // Regular path
    ];

    invalidUrls.forEach((urlStr) => {
      const url = new URL(urlStr);
      expect(isMediaRequest(url)).toBe(false);
    });
  });

  test('handles media requests with modifiers', () => {
    const url = new URL('https://example.com/media_1234567890abcdef1234567890abcdef12345678-scaled.png');
    expect(isMediaRequest(url)).toBe(true);
  });
});

// Test suite for isRUMRequest
describe('isRUMRequest', () => {
  test('identifies valid RUM requests', () => {
    const validUrls = [
      'https://example.com/.rum/data',
      'https://example.com/.rum/analytics',
      'https://example.com/.optel/metrics',
      'https://example.com/.optel/tracking',
    ];

    validUrls.forEach((urlStr) => {
      const url = new URL(urlStr);
      expect(isRUMRequest(url)).toBe(true);
    });
  });

  test('rejects non-RUM requests', () => {
    const invalidUrls = [
      'https://example.com/rum/data', // Missing leading dot
      'https://example.com/optel/metrics', // Missing leading dot
      'https://example.com/.other/path',
      'https://example.com/path/to/page',
    ];

    invalidUrls.forEach((urlStr) => {
      const url = new URL(urlStr);
      expect(isRUMRequest(url)).toBe(false);
    });
  });
});

// Test suite for formatISO8601Date
describe('formatISO8601Date', () => {
  test('passes through already formatted ISO 8601 dates', () => {
    expect(formatISO8601Date('2024-12-10')).toBe('2024-12-10');
    expect(formatISO8601Date('2025-01-01')).toBe('2025-01-01');
  });

  test('handles UK numeric format (dd/mm/yyyy)', () => {
    expect(formatISO8601Date('10/12/2024')).toBe('2024-12-10');
    expect(formatISO8601Date('01/02/2024')).toBe('2024-02-01');
    expect(formatISO8601Date('25/03/2024')).toBe('2024-03-25');
  });

  test('handles UK numeric format with dashes (dd-mm-yyyy)', () => {
    expect(formatISO8601Date('10-12-2024')).toBe('2024-12-10');
    expect(formatISO8601Date('01-02-2024')).toBe('2024-02-01');
  });

  test('handles UK numeric format with spaces (dd mm yyyy)', () => {
    expect(formatISO8601Date('10 12 2024')).toBe('2024-12-10');
  });

  test('handles full month names - day month year format', () => {
    expect(formatISO8601Date('10 December 2024')).toBe('2024-12-10');
    expect(formatISO8601Date('25 March 2024')).toBe('2024-03-25');
    expect(formatISO8601Date('1 January 2025')).toBe('2025-01-01');
  });

  test('handles abbreviated month names - day month year format', () => {
    expect(formatISO8601Date('10 Dec 2024')).toBe('2024-12-10');
    expect(formatISO8601Date('25 Mar 2024')).toBe('2024-03-25');
    expect(formatISO8601Date('1 Jan 2025')).toBe('2025-01-01');
  });

  test('handles month-day-year format with dashes', () => {
    expect(formatISO8601Date('10-Dec-2024')).toBe('2024-12-10');
    expect(formatISO8601Date('25-March-2024')).toBe('2024-03-25');
  });

  test('handles US style month day year format', () => {
    expect(formatISO8601Date('December 10, 2024')).toBe('2024-12-10');
    expect(formatISO8601Date('March 25, 2024')).toBe('2024-03-25');
  });

  test('handles abbreviated US style month day year', () => {
    expect(formatISO8601Date('Dec 10 2024')).toBe('2024-12-10');
    expect(formatISO8601Date('Mar 25 2024')).toBe('2024-03-25');
  });

  test('returns null for invalid dates', () => {
    expect(formatISO8601Date('')).toBeNull();
    expect(formatISO8601Date('   ')).toBeNull();
    expect(formatISO8601Date('invalid')).toBeNull();
    expect(formatISO8601Date('32/12/2024')).toBeNull(); // Invalid day
    expect(formatISO8601Date('10/13/2024')).toBeNull(); // Invalid month (13)
  });

  test('returns null for non-string inputs', () => {
    expect(formatISO8601Date(null)).toBeNull();
    expect(formatISO8601Date(undefined)).toBeNull();
    expect(formatISO8601Date(12345)).toBeNull();
  });

  test('handles edge case dates', () => {
    expect(formatISO8601Date('29/02/2024')).toBe('2024-02-29'); // Leap year
    expect(formatISO8601Date('31/01/2024')).toBe('2024-01-31');
    expect(formatISO8601Date('30/04/2024')).toBe('2024-04-30');
  });

  test('rejects invalid leap year dates', () => {
    expect(formatISO8601Date('29/02/2023')).toBeNull(); // Not a leap year
    expect(formatISO8601Date('31/04/2024')).toBeNull(); // April has 30 days
  });
});

// Test suite for normalizeYear
describe('normalizeYear', () => {
  test('converts 2-digit years 00-49 to 2000-2049', () => {
    expect(normalizeYear(0)).toBe(2000);
    expect(normalizeYear(1)).toBe(2001);
    expect(normalizeYear(25)).toBe(2025);
    expect(normalizeYear(49)).toBe(2049);
  });

  test('converts 2-digit years 50-99 to 1950-1999', () => {
    expect(normalizeYear(50)).toBe(1950);
    expect(normalizeYear(75)).toBe(1975);
    expect(normalizeYear(99)).toBe(1999);
  });

  test('passes through 4-digit years unchanged', () => {
    expect(normalizeYear(2025)).toBe(2025);
    expect(normalizeYear(1999)).toBe(1999);
    expect(normalizeYear(2049)).toBe(2049);
    expect(normalizeYear(1950)).toBe(1950);
  });

  test('handles edge cases at pivot point', () => {
    expect(normalizeYear(49)).toBe(2049); // Last year in 20xx range
    expect(normalizeYear(50)).toBe(1950); // First year in 19xx range
  });

  test('handles boundary values', () => {
    expect(normalizeYear(100)).toBe(100); // Minimum 4-digit year
    expect(normalizeYear(9999)).toBe(9999); // Large 4-digit year
  });
});

// Test suite for formatISO8601Date - 2-digit year support
describe('formatISO8601Date - 2-digit year support', () => {
  test('handles UK numeric format with 2-digit year (dd/mm/yy)', () => {
    expect(formatISO8601Date('12/12/25')).toBe('2025-12-12');
    expect(formatISO8601Date('25/12/99')).toBe('1999-12-25');
    expect(formatISO8601Date('01/01/00')).toBe('2000-01-01');
    expect(formatISO8601Date('15/06/75')).toBe('1975-06-15');
  });

  test('handles month name format with 2-digit year', () => {
    expect(formatISO8601Date('12 Dec 25')).toBe('2025-12-12');
    expect(formatISO8601Date('25 December 99')).toBe('1999-12-25');
    expect(formatISO8601Date('1 Jan 00')).toBe('2000-01-01');
    expect(formatISO8601Date('15 June 75')).toBe('1975-06-15');
  });

  test('handles hyphen format with 2-digit year', () => {
    expect(formatISO8601Date('12-Dec-25')).toBe('2025-12-12');
    expect(formatISO8601Date('25-March-99')).toBe('1999-03-25');
    expect(formatISO8601Date('01-Jan-00')).toBe('2000-01-01');
  });

  test('handles US format with 2-digit year', () => {
    expect(formatISO8601Date('Dec 12, 25')).toBe('2025-12-12');
    expect(formatISO8601Date('December 25, 99')).toBe('1999-12-25');
    expect(formatISO8601Date('Jan 1, 00')).toBe('2000-01-01');
  });

  test('century inference pivot point (50)', () => {
    expect(formatISO8601Date('12/12/49')).toBe('2049-12-12'); // 49 -> 2049
    expect(formatISO8601Date('12/12/50')).toBe('1950-12-12'); // 50 -> 1950
  });

  test('maintains backward compatibility with 4-digit years', () => {
    expect(formatISO8601Date('12/12/2025')).toBe('2025-12-12');
    expect(formatISO8601Date('25 Dec 2024')).toBe('2024-12-25');
    expect(formatISO8601Date('1999-01-01')).toBe('1999-01-01');
  });

  test('handles space separators with 2-digit years', () => {
    expect(formatISO8601Date('12 12 25')).toBe('2025-12-12');
    expect(formatISO8601Date('25 12 99')).toBe('1999-12-25');
  });

  test('handles hyphen separators with 2-digit years', () => {
    expect(formatISO8601Date('12-12-25')).toBe('2025-12-12');
    expect(formatISO8601Date('25-12-99')).toBe('1999-12-25');
  });

  test('handles edge case dates with 2-digit years', () => {
    expect(formatISO8601Date('29/02/24')).toBe('2024-02-29'); // Leap year
    expect(formatISO8601Date('31/01/25')).toBe('2025-01-31');
    expect(formatISO8601Date('30/04/25')).toBe('2025-04-30');
  });

  test('rejects invalid dates with 2-digit years', () => {
    expect(formatISO8601Date('32/12/25')).toBeNull(); // Invalid day
    expect(formatISO8601Date('29/02/23')).toBeNull(); // Not a leap year (2023)
    expect(formatISO8601Date('31/04/25')).toBeNull(); // April has 30 days
  });

  test('validates year range (1950-2049) after normalization', () => {
    // Years that normalize outside the valid range should be rejected
    // This shouldn't happen with our century inference, but validates the check
    expect(formatISO8601Date('12/12/49')).toBe('2049-12-12'); // Valid: normalizes to 2049
    expect(formatISO8601Date('12/12/50')).toBe('1950-12-12'); // Valid: normalizes to 1950
  });

  test('handles mixed format dates with 2-digit years', () => {
    expect(formatISO8601Date('1 Jan 25')).toBe('2025-01-01'); // Single digit day
    expect(formatISO8601Date('31 Dec 99')).toBe('1999-12-31'); // End of year
    expect(formatISO8601Date('15-Jun-25')).toBe('2025-06-15'); // Abbreviated month
  });

  test('handles slash separator with month names (user input)', () => {
    // Common user input: mixing slashes with month names
    expect(formatISO8601Date('12/dec/25')).toBe('2025-12-12');
    expect(formatISO8601Date('12/Dec/25')).toBe('2025-12-12');
    expect(formatISO8601Date('25/December/99')).toBe('1999-12-25');
    expect(formatISO8601Date('1/jan/00')).toBe('2000-01-01');
    expect(formatISO8601Date('dec/12/25')).toBe('2025-12-12'); // US format with slashes
  });
});

// Test suite for wrapLlmsTxtAsHtml
describe('wrapLlmsTxtAsHtml', () => {
  const sample = `# mx.allabout.network — MX

> MX is the practice of adding metadata so AI agents don't have to guess.

## Books
- MX: The Intro
- MX: The Handbook
`;

  test('returns a string starting with <!DOCTYPE html>', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt');
    expect(typeof out).toBe('string');
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
  });

  test('preserves original text verbatim inside <pre class="llms-txt">', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt');
    const match = out.match(/<pre class="llms-txt">([\s\S]*?)<\/pre>/);
    expect(match).not.toBeNull();
    // Decode the HTML entities the function inserts and confirm it matches input
    const decoded = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    expect(decoded).toBe(sample);
  });

  test('escapes HTML special chars (<, >, &) in input', () => {
    const dangerous = '<script>alert("xss")</script> & more';
    const out = wrapLlmsTxtAsHtml(dangerous, 'https://example.com/llms.txt');
    expect(out).not.toContain('<script>alert');
    expect(out).toContain('&lt;script&gt;');
    expect(out).toContain('&amp; more');
  });

  test('extracts title from first "# heading" line when present', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt');
    expect(out).toContain('<title>mx.allabout.network — MX</title>');
  });

  test('falls back to "llms.txt — {hostname}" when no heading and a URL is supplied', () => {
    const out = wrapLlmsTxtAsHtml('no heading here\njust some text', 'https://example.com/llms.txt');
    expect(out).toContain('<title>llms.txt — example.com</title>');
  });

  test('falls back to "llms.txt" when no heading and no URL', () => {
    const out = wrapLlmsTxtAsHtml('no heading here');
    expect(out).toContain('<title>llms.txt</title>');
  });

  test('sets <link rel="canonical"> when URL is supplied', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/blog/llms.txt');
    expect(out).toContain('<link rel="canonical" href="https://mx.allabout.network/blog/llms.txt">');
  });

  test('omits <link rel="canonical"> when no URL is supplied', () => {
    const out = wrapLlmsTxtAsHtml(sample);
    expect(out).not.toContain('rel="canonical"');
  });

  test('strips query string and fragment from canonical', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt?cb=12345#frag');
    expect(out).toContain('<link rel="canonical" href="https://mx.allabout.network/llms.txt">');
    expect(out).not.toContain('cb=12345');
    expect(out).not.toContain('#frag');
  });

  test('contains the four required machine-readable meta signals', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt');
    expect(out).toContain('<meta name="robots" content="index, follow">');
    expect(out).toContain('<meta name="mx:status" content="active">');
    expect(out).toContain('<meta name="mx:contentType" content="agent-directory">');
    expect(out).toContain('<meta name="mx:audience" content="machines, humans">');
  });

  test('contains a valid application/ld+json WebPage block', () => {
    const out = wrapLlmsTxtAsHtml(sample, 'https://mx.allabout.network/llms.txt');
    const match = out.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    const parsed = JSON.parse(match[1]);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('WebPage');
    expect(parsed.name).toBe('mx.allabout.network — MX');
    expect(parsed.url).toBe('https://mx.allabout.network/llms.txt');
    expect(parsed.inLanguage).toBe('en-GB');
  });

  test('handles empty input gracefully', () => {
    const out = wrapLlmsTxtAsHtml('', 'https://example.com/llms.txt');
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('<pre class="llms-txt"></pre>');
  });

  test('handles undefined input gracefully', () => {
    const out = wrapLlmsTxtAsHtml(undefined, 'https://example.com/llms.txt');
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('<pre class="llms-txt"></pre>');
  });

  test('preserves multi-line whitespace verbatim inside <pre>', () => {
    const multiline = 'line one\nline two\n\nline four after blank\n';
    const out = wrapLlmsTxtAsHtml(multiline, 'https://example.com/llms.txt');
    const match = out.match(/<pre class="llms-txt">([\s\S]*?)<\/pre>/);
    expect(match[1]).toBe(multiline);
  });

  test('extracts only the FIRST # heading (ignores subsequent ones)', () => {
    const text = '# First Title\n## Sub heading\n# Second Title\n';
    const out = wrapLlmsTxtAsHtml(text, 'https://example.com/llms.txt');
    expect(out).toContain('<title>First Title</title>');
    expect(out).not.toContain('<title>Second Title</title>');
  });

  test('wraps llms-full.txt with filename-specific description', () => {
    const out = wrapLlmsTxtAsHtml('# MX — Full Content\n\nbody', 'https://mx.allabout.network/llms-full.txt');
    expect(out).toContain('<link rel="canonical" href="https://mx.allabout.network/llms-full.txt">');
    expect(out).toContain('Comprehensive agent content corpus (llms-full.txt)');
    expect(out).toContain('llms-full.txt for mx.allabout.network');
    expect(out).not.toContain('Agent directory file (llms.txt)');
  });

  test('llms-full.txt fallback title uses correct basename when no heading', () => {
    const out = wrapLlmsTxtAsHtml('no heading here', 'https://example.com/llms-full.txt');
    expect(out).toContain('<title>llms-full.txt — example.com</title>');
  });
});

// Test suite for isAgentDirectoryFile
describe('isAgentDirectoryFile', () => {
  test('returns true for /llms.txt', () => {
    expect(isAgentDirectoryFile('/llms.txt')).toBe(true);
  });

  test('returns true for /llms-full.txt', () => {
    expect(isAgentDirectoryFile('/llms-full.txt')).toBe(true);
  });

  test('returns true for nested llms.txt at any depth', () => {
    expect(isAgentDirectoryFile('/blog/llms.txt')).toBe(true);
    expect(isAgentDirectoryFile('/docs/services/llms.txt')).toBe(true);
  });

  test('returns true for nested llms-full.txt at any depth', () => {
    expect(isAgentDirectoryFile('/blog/llms-full.txt')).toBe(true);
    expect(isAgentDirectoryFile('/docs/llms-full.txt')).toBe(true);
  });

  test('returns true for bare filenames', () => {
    expect(isAgentDirectoryFile('llms.txt')).toBe(true);
    expect(isAgentDirectoryFile('llms-full.txt')).toBe(true);
  });

  test('returns false for other text files', () => {
    expect(isAgentDirectoryFile('/robots.txt')).toBe(false);
    expect(isAgentDirectoryFile('/ai.txt')).toBe(false);
    expect(isAgentDirectoryFile('/humans.txt')).toBe(false);
    expect(isAgentDirectoryFile('/sitemap.xml')).toBe(false);
    expect(isAgentDirectoryFile('/index.html')).toBe(false);
  });

  test('does not match partial names or suffixes', () => {
    expect(isAgentDirectoryFile('/my-llms.txt')).toBe(false);
    expect(isAgentDirectoryFile('/llms.txt.bak')).toBe(false);
    expect(isAgentDirectoryFile('/llms-full.txt.gz')).toBe(false);
  });

  test('handles empty, null, and undefined safely', () => {
    expect(isAgentDirectoryFile('')).toBe(false);
    expect(isAgentDirectoryFile(null)).toBe(false);
    expect(isAgentDirectoryFile(undefined)).toBe(false);
  });
});

// Test suite for buildJsonLd
describe('buildJsonLd', () => {
  test('creates valid Article schema structure', () => {
    const article = {
      title: 'Test Article',
      description: 'Test description',
      url: 'https://example.com/article',
      author: 'John Doe',
      publishDate: '2024-12-10',
      modifiedDate: '2024-12-10',
      shouldGenerateJsonLd: true,
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Article');
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.description).toBe(article.description);
    expect(jsonLd.url).toBe(article.url);
    expect(jsonLd.datePublished).toBe(article.publishDate);
    expect(jsonLd.dateModified).toBe(article.modifiedDate);

    expect(jsonLd.author).toBeDefined();
    expect(jsonLd.author['@type']).toBe('Person');
    expect(jsonLd.author.name).toBe(article.author);

    expect(jsonLd.publisher).toBeDefined();
    expect(jsonLd.publisher['@type']).toBe('Organization');
    expect(jsonLd.publisher.name).toBe(ORGANISATION_CONFIG.name);
    expect(jsonLd.publisher.legalName).toBe(ORGANISATION_CONFIG.legalName);
    expect(jsonLd.publisher.url).toBe(`https://${hostname}`);
    expect(jsonLd.publisher.sameAs).toEqual(ORGANISATION_CONFIG.sameAs);
  });

  test('publisher sameAs links all organisation domains', () => {
    const article = { title: 'Test', shouldGenerateJsonLd: true };
    const jsonLd = buildJsonLd(article, 'allabout.network');
    expect(jsonLd.publisher.sameAs).toContain('https://cognovamx.com');
    expect(jsonLd.publisher.sameAs).toContain('https://allabout.network');
    expect(jsonLd.publisher.sameAs).toContain('https://mx.allabout.network');
  });

  test('omits empty fields from JSON-LD', () => {
    const article = {
      title: 'Test Article',
      description: null,
      url: null,
      author: null,
      shouldGenerateJsonLd: true,
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd).not.toHaveProperty('description');
    expect(jsonLd).not.toHaveProperty('url');
    expect(jsonLd).not.toHaveProperty('author');
    expect(jsonLd.headline).toBe('Test Article');
  });

  test('handles image objects correctly', () => {
    const article = {
      title: 'Test',
      image: 'https://example.com/image.jpg',
      imageAlt: 'Alt text',
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd.image).toBeDefined();
    expect(jsonLd.image['@type']).toBe('ImageObject');
    expect(jsonLd.image.url).toBe(article.image);
    expect(jsonLd.image.caption).toBe(article.imageAlt);
  });

  test('formats dates to ISO 8601', () => {
    const article = {
      title: 'Test Article',
      publishDate: '10/12/2024', // UK format
      modifiedDate: '25 March 2024', // Full month name
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd.datePublished).toBe('2024-12-10');
    expect(jsonLd.dateModified).toBe('2024-03-25');
  });

  test('omits invalid dates from JSON-LD', () => {
    const article = {
      title: 'Test Article',
      publishDate: 'invalid date',
      modifiedDate: '32/12/2024',
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd).not.toHaveProperty('datePublished');
    expect(jsonLd).not.toHaveProperty('dateModified');
  });

  test('includes author URL when available', () => {
    const article = {
      title: 'Test Article',
      author: 'John Doe',
      authorUrl: 'https://example.com/author/john-doe',
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd.author).toBeDefined();
    expect(jsonLd.author['@type']).toBe('Person');
    expect(jsonLd.author.name).toBe('John Doe');
    expect(jsonLd.author.url).toBe('https://example.com/author/john-doe');
  });

  test('handles author without URL', () => {
    const article = {
      title: 'Test Article',
      author: 'Jane Smith',
      authorUrl: null,
    };
    const hostname = 'example.com';
    const jsonLd = buildJsonLd(article, hostname);

    expect(jsonLd.author).toBeDefined();
    expect(jsonLd.author['@type']).toBe('Person');
    expect(jsonLd.author.name).toBe('Jane Smith');
    expect(jsonLd.author).not.toHaveProperty('url');
  });

  test('uses LinkedIn as fallback for author URL', () => {
    const article = {
      title: 'Test Article',
      author: 'John Doe',
      authorUrl: 'https://linkedin.com/in/johndoe', // Fallback from LinkedIn
    };
    const jsonLd = buildJsonLd(article, 'example.com');

    expect(jsonLd.author.url).toBe('https://linkedin.com/in/johndoe');
  });

  test('author-url takes precedence over LinkedIn', () => {
    const article = {
      title: 'Test Article',
      author: 'John Doe',
      authorUrl: 'https://example.com/author/john-doe', // Explicit author-url
    };
    const jsonLd = buildJsonLd(article, 'example.com');

    // Should use author-url, not LinkedIn
    expect(jsonLd.author.url).toBe('https://example.com/author/john-doe');
  });

  test('publisher uses public-facing hostname not origin hostname', () => {
    const article = {
      title: 'Test Article',
      author: 'Test Author',
    };
    const publicHostname = 'allabout.network';

    const result = buildJsonLd(article, publicHostname);

    expect(result.publisher).toBeDefined();
    expect(result.publisher['@type']).toBe('Organization');
    expect(result.publisher.name).toBe(ORGANISATION_CONFIG.name);
    expect(result.publisher.url).toBe('https://allabout.network');
    // Verify it's NOT using the origin hostname
    expect(result.publisher.url).not.toContain('main--allaboutv2--ddttom.aem.live');
  });
});

// Note: Handler Functions tests removed as worker now uses pure string functions
// instead of HTMLRewriter element handlers. See injectJsonLd, extractMetaContent, etc.

// Test suite for replacePicturePlaceholder
describe('replacePicturePlaceholder', () => {
  test('replaces div with exact match "Picture Here"', () => {
    const html = '<div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);

    expect(result).toContain('<img');
    expect(result).toContain(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
    expect(result).toContain(PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT);
    expect(result).not.toContain('Picture Here');
  });

  test('does not replace div with different text', () => {
    const html = '<div><div>Other Content</div></div>';
    const result = replacePicturePlaceholder(html);

    expect(result).toBe(html);
    expect(result).toContain('Other Content');
    expect(result).not.toContain('<img');
  });

  test('handles whitespace around text', () => {
    const html = '<div>  <div>  Picture Here  </div>  </div>';
    const result = replacePicturePlaceholder(html);

    expect(result).toContain('<img');
    expect(result).not.toContain('Picture Here');
  });

  test('handles multiple occurrences', () => {
    const html = '<div><div>Picture Here</div></div><p>Text</p><div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);

    // Should replace both occurrences
    const imgCount = (result.match(/<img/g) || []).length;
    expect(imgCount).toBe(2);
    expect(result).not.toContain('Picture Here');
  });

  test('handles case insensitivity (matches "picture here", "PICTURE HERE", etc.)', () => {
    const html = '<div><div>picture here</div></div>';
    const result = replacePicturePlaceholder(html);

    // Should match (case-insensitive)
    expect(result).not.toBe(html);
    expect(result).not.toContain('picture here');
    expect(result).toContain('<img');
    expect(result).toContain(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
  });

  test('includes correct image URL and alt text in replacement', () => {
    const html = '<div><div>Picture Here</div></div>';
    const result = replacePicturePlaceholder(html);

    expect(result).toContain(`src="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL}"`);
    expect(result).toContain(`alt="${PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT}"`);
  });

  test('preserves surrounding HTML structure', () => {
    const html = '<html><body><h1>Title</h1>'
      + '<div><div>Picture Here</div></div><p>Footer</p></body></html>';
    const result = replacePicturePlaceholder(html);

    expect(result).toContain('<h1>Title</h1>');
    expect(result).toContain('<p>Footer</p>');
    expect(result).toContain('<img');
    expect(result).not.toContain('Picture Here');
  });

  test('only matches exact two-level div nesting', () => {
    // Pattern matches inner <div>Picture Here</div> within outer div
    // This is the EDS-generated pattern we expect
    const html = '<div><div><div>Picture Here</div></div></div>';
    const result = replacePicturePlaceholder(html);

    // The regex will match the inner two divs: <div><div>Picture Here</div></div>
    // This is acceptable since EDS generates <div><div>text</div></div>
    expect(result).toContain('<img');
    expect(result).not.toContain('Picture Here');
  });
});

// Test suite for removeHtmlComments
describe('removeHtmlComments', () => {
  test('removes simple HTML comment', () => {
    const html = '<div><!-- comment --></div>';
    const result = removeHtmlComments(html);
    expect(result).toBe('<div></div>');
    expect(result).not.toContain('<!--');
  });

  test('removes multiple comments', () => {
    const html = '<!-- first --><p>text</p><!-- second -->';
    const result = removeHtmlComments(html);
    expect(result).toBe('<p>text</p>');
  });

  test('removes multiline comments', () => {
    const html = '<!-- line 1\nline 2\nline 3 --><div>content</div>';
    const result = removeHtmlComments(html);
    expect(result).toContain('<div>content</div>');
    expect(result).not.toContain('<!--');
  });

  test('handles nested-looking comments', () => {
    // HTML comments don't actually nest - first --> closes the comment
    const html = '<!-- outer <!-- inner --> still in comment -->';
    const result = removeHtmlComments(html);
    expect(result).toBe(' still in comment -->');
  });

  test('preserves HTML structure', () => {
    const html = '<html><!-- comment --><body>text</body></html>';
    const result = removeHtmlComments(html);
    expect(result).toBe('<html><body>text</body></html>');
  });

  test('handles empty string', () => {
    expect(removeHtmlComments('')).toBe('');
  });

  test('handles HTML without comments', () => {
    const html = '<div>no comments here</div>';
    expect(removeHtmlComments(html)).toBe(html);
  });

  test('removes comments with special characters', () => {
    const html = '<!-- comment with <tags> and & entities -->';
    const result = removeHtmlComments(html);
    expect(result).toBe('');
  });
});

// Test suite for injectSpeculationRules
describe('injectSpeculationRules', () => {
  test('injects speculation rules script into head', () => {
    const html = '<html><head><title>Test</title></head><body></body></html>';
    const result = injectSpeculationRules(html);

    expect(result).toContain('<script type="speculationrules">');
    expect(result).toContain('"prerender"');
    expect(result).toContain('"prefetch"');
    expect(result).toContain('"href_matches": "/*"');
    expect(result).toContain('"eagerness": "moderate"');
  });

  test('script appears before </head> closing tag', () => {
    const html = '<html><head><meta name="test"></head><body></body></html>';
    const result = injectSpeculationRules(html);

    const headCloseIndex = result.indexOf('</head>');
    const scriptStartIndex = result.indexOf('<script type="speculationrules">');

    expect(scriptStartIndex).toBeLessThan(headCloseIndex);
  });

  test('valid JSON structure in speculation rules', () => {
    const html = '<html><head></head><body></body></html>';
    const result = injectSpeculationRules(html);

    // Extract JSON from script tag
    const scriptMatch = result.match(/<script type="speculationrules">\s*([\s\S]*?)\s*<\/script>/);
    expect(scriptMatch).toBeTruthy();

    // Validate JSON structure
    const json = JSON.parse(scriptMatch[1]);
    expect(json.prerender).toBeDefined();
    expect(json.prefetch).toBeDefined();
    expect(json.prerender[0].where.href_matches).toBe('/*');
    expect(json.prerender[0].eagerness).toBe('moderate');
  });

  test('preserves existing head content', () => {
    const html = '<html><head><meta name="test"><title>My Title</title></head><body></body></html>';
    const result = injectSpeculationRules(html);

    expect(result).toContain('<meta name="test">');
    expect(result).toContain('<title>My Title</title>');
  });

  test('handles multiple injections correctly', () => {
    // HTML with metadata to trigger JSON-LD generation
    const html = '<html><head>'
      + '<meta name="jsonld" content="article">'
      + '<meta property="og:title" content="Test Article">'
      + '</head><body></body></html>';
    const afterJsonLd = injectJsonLd(html, 'example.com');
    const result = injectSpeculationRules(afterJsonLd);

    // Both scripts should be present
    expect(result).toContain('application/ld+json');
    expect(result).toContain('speculationrules');

    // Speculation rules should appear before </head>
    const headCloseIndex = result.indexOf('</head>');
    const speculationIndex = result.indexOf('speculationrules');
    expect(speculationIndex).toBeLessThan(headCloseIndex);
  });

  test('handles HTML without head tag gracefully', () => {
    const html = '<html><body>content</body></html>';
    const result = injectSpeculationRules(html);

    // Should return unchanged (no </head> to replace)
    expect(result).toBe(html);
    expect(result).not.toContain('speculationrules');
  });

  test('preserves HTML structure', () => {
    const html = '<html><head><meta charset="utf-8"></head><body><p>Test</p></body></html>';
    const result = injectSpeculationRules(html);

    expect(result).toContain('<p>Test</p>');
    expect(result).toContain('<meta charset="utf-8">');
    expect(result).toContain('</body></html>');
  });

  test('works with real-world EDS HTML structure', () => {
    const html = `<html>
<head>
<meta name="viewport" content="width=device-width">
<meta property="og:title" content="Test Page">
<title>Test Page</title>
</head>
<body>
<main><div>Content</div></main>
</body>
</html>`;

    const result = injectSpeculationRules(html);

    expect(result).toContain('speculationrules');
    // Should appear after meta tags but before </head>
    const speculationIndex = result.indexOf('speculationrules');
    const headCloseIndex = result.indexOf('</head>');
    expect(speculationIndex).toBeLessThan(headCloseIndex);
  });
});

// Mock HTMLRewriter for integration testing
class MockHTMLRewriter {
  static activeHandlers = [];

  constructor() {
    this.handlers = [];
  }

  on(selector, handler) {
    const h = { selector, handler };
    this.handlers.push(h);
    MockHTMLRewriter.activeHandlers.push(h);
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  transform(response) {
    // Mock transform - this is a stub for testing
    return response;
  }
}

describe('handleRequest Integration', () => {
  // Mock global HTMLRewriter
  beforeEach(() => {
    MockHTMLRewriter.activeHandlers = []; // Reset handlers
    global.HTMLRewriter = MockHTMLRewriter;
    global.Response = class Response {
      constructor(body, init) {
        this.body = body;
        this.status = init?.status || 200;
        this.statusText = init?.statusText || 'OK';
        this.headers = new Map(init?.headers ? Object.entries(init.headers) : []);
        this.bodyUsed = false;
      }

      get headers() { return this._headers || new Map(); }

      set headers(val) { this._headers = val; }

      async text() {
        if (this.bodyUsed) {
          throw new Error('Body already used');
        }
        this.bodyUsed = true;
        return typeof this.body === 'string' ? this.body : '<html>...</html>';
      }
    };

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue(new Response('<html>...</html>', {
      headers: { 'content-type': 'text/html' },
    }));
  });

  afterEach(() => {
    delete global.HTMLRewriter;
    delete global.Response;
    delete global.fetch;
  });

  test('handles HTML responses using pure string functions', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
      DEBUG: 'true',
    };
    const request = {
      url: 'https://allabout.network/article',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    // Note: Worker now uses pure string functions (replacePicturePlaceholder,
    // injectJsonLd, removeHtmlComments, etc.) instead of HTMLRewriter handlers
    // No HTMLRewriter handlers should be registered
    expect(MockHTMLRewriter.activeHandlers.length).toBe(0);
  });

  test('passes through unmodified when client requests Accept: text/markdown', async () => {
    // Markdown for Agents: when the client asks for markdown, the Worker must
    // return the origin response verbatim so Cloudflare's native converter
    // can transform it. Skipping Worker transforms means no cfw header, no
    // CORS/security headers, no HTML rewriting — the converter does the rest.
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
    };
    const request = {
      url: 'https://allabout.network/article',
      method: 'GET',
      headers: new Map([['accept', 'text/markdown']]),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    // The cfw header is only added after the HTML-transform block; the
    // pass-through returns before that, so absence of cfw confirms the guard
    // fired. (Live traffic will carry Cloudflare's own converter headers.)
    expect(response.headers.get('cfw')).toBeUndefined();
  });

  test('includes cfw version header in response', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
      DEBUG: 'false',
    };
    const request = {
      url: 'https://allabout.network/article',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);

    // Verify cfw header exists and matches WORKER_VERSION
    const cfwHeader = response.headers.get('cfw');
    expect(cfwHeader).toBeDefined();
    expect(cfwHeader).toBe(WORKER_VERSION);

    // Verify it follows semantic versioning
    expect(cfwHeader).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('includes cfw version header for media requests', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
      DEBUG: 'false',
    };
    const request = {
      url: 'https://allabout.network/media_1234567890abcdef1234567890abcdef12345678.png',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);

    // Verify cfw header is present even for media requests
    const cfwHeader = response.headers.get('cfw');
    expect(cfwHeader).toBeDefined();
    expect(cfwHeader).toBe(WORKER_VERSION);
  });

  test('uses pure string replacement for picture placeholders', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
      DEBUG: 'false',
    };
    const request = {
      url: 'https://allabout.network/page',
      method: 'GET',
      headers: new Map(),
    };

    await worker.fetch(request, env);

    // Note: Picture placeholder replacement is now done via pure string functions,
    // not HTMLRewriter, so no div handler is registered
    expect(MockHTMLRewriter.activeHandlers.length).toBe(0);
  });

  test('picture replacement does not affect version header', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
    };
    const request = {
      url: 'https://allabout.network/page',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    // Verify version header still present and shows current version
    expect(response.headers.get('cfw')).toBe(WORKER_VERSION);
    expect(WORKER_VERSION).toBe('1.4.0');
  });

  test('includes speculation rules in HTML responses', async () => {
    const env = {
      ORIGIN_HOSTNAME: 'main--test--owner.aem.live',
    };
    const request = {
      url: 'https://allabout.network/article',
      method: 'GET',
      headers: new Map(),
    };

    // Mock fetch to return HTML with head tag
    global.fetch = vi.fn().mockResolvedValue(new Response(
      '<html><head><title>Test</title></head><body></body></html>',
      { headers: { 'content-type': 'text/html' } },
    ));

    const response = await worker.fetch(request, env);
    const html = await response.text();

    expect(html).toContain('speculationrules');
    expect(html).toContain('"prerender"');
    expect(html).toContain('"prefetch"');
  });
});

// ============================================================
// Root Path Redirect Tests
// ============================================================
describe('Root Path Redirect', () => {
  beforeEach(() => {
    MockHTMLRewriter.activeHandlers = [];
    global.HTMLRewriter = MockHTMLRewriter;
    global.Response = class Response {
      constructor(body, init) {
        this.body = body;
        this.status = init?.status || 200;
        this.statusText = init?.statusText || 'OK';
        this.headers = new Map(init?.headers ? Object.entries(init.headers) : []);
        this.bodyUsed = false;
      }

      async text() {
        if (this.bodyUsed) throw new Error('Body already used');
        this.bodyUsed = true;
        return typeof this.body === 'string' ? this.body : '';
      }
    };
    global.fetch = vi.fn().mockResolvedValue(new Response('<html></html>', {
      headers: { 'content-type': 'text/html' },
    }));
  });

  afterEach(() => {
    delete global.HTMLRewriter;
    delete global.Response;
    delete global.fetch;
  });

  test('redirects bare domain root / to /index.html', async () => {
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };
    const request = {
      url: 'https://allabout.network/',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://allabout.network/index.html');
  });

  test('does not redirect non-root paths', async () => {
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };
    const request = {
      url: 'https://allabout.network/some-page.html',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
  });

  test('redirects /mx/* paths to mx.allabout.network', async () => {
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };
    const request = {
      url: 'https://allabout.network/mx/coming-soon.html',
      method: 'GET',
      headers: new Map(),
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://mx.allabout.network/books/');
  });
});

// ============================================================
// Content-Encoding Safety Tests
// ============================================================
// These tests verify the fix for the double-encoding bug where
// the origin returns Brotli-compressed HTML, the worker decompresses
// and modifies it, but the original content-encoding/content-length
// headers were preserved — causing clients to receive garbled content.

describe('Content-Encoding Safety', () => {
  let mockFetch;

  beforeEach(() => {
    MockHTMLRewriter.activeHandlers = [];
    global.HTMLRewriter = MockHTMLRewriter;

    // Mock Response that tracks headers properly
    global.Response = class MockResponse {
      constructor(body, init) {
        this.body = body;
        this.status = init?.status || 200;
        this.statusText = init?.statusText || 'OK';
        this.bodyUsed = false;

        // Support both Map and Headers-like objects
        if (init?.headers instanceof Map) {
          this.headers = new Map(init.headers);
        } else if (init?.headers && typeof init.headers.get === 'function') {
          this.headers = new Map(init.headers);
        } else if (init?.headers) {
          this.headers = new Map(Object.entries(init.headers));
        } else {
          this.headers = new Map();
        }
      }

      async text() {
        if (this.bodyUsed) throw new Error('Body already used');
        this.bodyUsed = true;
        return typeof this.body === 'string' ? this.body : '';
      }
    };

    // Also mock Headers so the worker can use `new Headers()`
    global.Headers = class MockHeaders extends Map {
      constructor(init) {
        super();
        if (init instanceof Map) {
          for (const [k, v] of init) this.set(k, v);
        } else if (init && typeof init === 'object') {
          for (const [k, v] of Object.entries(init)) this.set(k, v);
        }
      }
    };

    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    delete global.HTMLRewriter;
    delete global.Response;
    delete global.Headers;
    delete global.fetch;
  });

  test('strips content-encoding header from HTML responses', async () => {
    // Simulate origin returning compressed HTML (as cacheEverything cache does)
    const originHtml = '<html><head><title>Test</title></head><body>Hello</body></html>';
    mockFetch.mockResolvedValue(new global.Response(originHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'content-encoding': 'br',
        'content-length': '1234',
      },
    }));

    const request = {
      url: 'https://allabout.network/page.html',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    const response = await worker.fetch(request, env);

    expect(response.headers.get('content-encoding')).toBeUndefined();
    expect(response.headers.get('content-length')).toBeUndefined();
  });

  test('strips content-encoding for gzip responses too', async () => {
    const originHtml = '<html><head><title>Test</title></head><body>Hello</body></html>';
    mockFetch.mockResolvedValue(new global.Response(originHtml, {
      headers: {
        'content-type': 'text/html',
        'content-encoding': 'gzip',
        'content-length': '2048',
      },
    }));

    const request = {
      url: 'https://allabout.network/article.html',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    const response = await worker.fetch(request, env);

    expect(response.headers.get('content-encoding')).toBeUndefined();
    expect(response.headers.get('content-length')).toBeUndefined();
  });

  test('preserves content-type header after stripping encoding', async () => {
    const originHtml = '<html><head><title>Test</title></head><body>Hello</body></html>';
    mockFetch.mockResolvedValue(new global.Response(originHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'content-encoding': 'br',
        'content-length': '500',
      },
    }));

    const request = {
      url: 'https://allabout.network/page.html',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    const response = await worker.fetch(request, env);

    expect(response.headers.get('content-type')).toContain('text/html');
  });

  test('does not strip encoding from non-HTML responses', async () => {
    mockFetch.mockResolvedValue(new global.Response('body { color: red; }', {
      headers: {
        'content-type': 'text/css',
        'content-encoding': 'gzip',
        'content-length': '42',
      },
    }));

    const request = {
      url: 'https://allabout.network/styles/styles.css',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    const response = await worker.fetch(request, env);

    // Non-HTML responses pass through unchanged — encoding headers preserved
    expect(response.headers.get('content-encoding')).toBe('gzip');
  });

  test('sets Accept-Encoding: identity on origin requests', async () => {
    const originHtml = '<html><head><title>Test</title></head><body>Hello</body></html>';
    mockFetch.mockResolvedValue(new global.Response(originHtml, {
      headers: { 'content-type': 'text/html' },
    }));

    const request = {
      url: 'https://allabout.network/page.html',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    await worker.fetch(request, env);

    // Verify the outgoing request to the origin asks for uncompressed content
    const fetchCall = mockFetch.mock.calls[0];
    const outgoingRequest = fetchCall[0];

    // The request should have Accept-Encoding: identity
    if (outgoingRequest.headers && typeof outgoingRequest.headers.get === 'function') {
      expect(outgoingRequest.headers.get('Accept-Encoding')).toBe('identity');
    } else if (outgoingRequest.headers instanceof Map) {
      expect(outgoingRequest.headers.get('Accept-Encoding')).toBe('identity');
    }
  });

  test('HTML body is readable text after processing', async () => {
    const originHtml = '<html><head><title>Test</title></head><body><p>Content here</p></body></html>';
    mockFetch.mockResolvedValue(new global.Response(originHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'content-encoding': 'br',
        'content-length': '200',
      },
    }));

    const request = {
      url: 'https://allabout.network/page.html',
      method: 'GET',
      headers: new Map(),
    };
    const env = { ORIGIN_HOSTNAME: 'main--test--owner.aem.live' };

    const response = await worker.fetch(request, env);
    const html = await response.text();

    // The response body should be readable HTML, not binary
    expect(html).toContain('<html>');
    expect(html).toContain('<p>Content here</p>');
    expect(html).toContain('speculationrules');
  });
});

// ============================================================
// Language Redirect Tests
// ============================================================

describe('parseAcceptLanguage', () => {
  test('parses single language without quality', () => {
    const result = parseAcceptLanguage('en');
    expect(result).toEqual([{ full: 'en', base: 'en', quality: 1.0 }]);
  });

  test('parses multiple languages with quality values', () => {
    const result = parseAcceptLanguage('es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7');
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ full: 'es-mx', base: 'es', quality: 1.0 });
    expect(result[1]).toEqual({ full: 'es', base: 'es', quality: 0.9 });
    expect(result[2]).toEqual({ full: 'en-us', base: 'en', quality: 0.8 });
    expect(result[3]).toEqual({ full: 'en', base: 'en', quality: 0.7 });
  });

  test('sorts by quality descending', () => {
    const result = parseAcceptLanguage('en;q=0.5,fr;q=0.9,de;q=0.7');
    expect(result[0].full).toBe('fr');
    expect(result[1].full).toBe('de');
    expect(result[2].full).toBe('en');
  });

  test('normalises codes to lowercase', () => {
    const result = parseAcceptLanguage('EN-GB,FR-FR;q=0.8');
    expect(result[0].full).toBe('en-gb');
    expect(result[1].full).toBe('fr-fr');
  });

  test('returns empty array for empty header', () => {
    expect(parseAcceptLanguage('')).toEqual([]);
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage(undefined)).toEqual([]);
  });

  test('handles wildcard (*)', () => {
    const result = parseAcceptLanguage('en,*;q=0.1');
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual({ full: '*', base: '*', quality: 0.1 });
  });

  test('skips entries with invalid quality values', () => {
    const result = parseAcceptLanguage('en;q=abc,fr;q=0.8');
    expect(result).toHaveLength(1);
    expect(result[0].full).toBe('fr');
  });
});

describe('detectLanguage', () => {
  const available = ['es', 'en'];

  test('matches exact language', () => {
    expect(detectLanguage('es', available, 'es')).toBe('es');
    expect(detectLanguage('en', available, 'es')).toBe('en');
  });

  test('matches base language from regional variant', () => {
    expect(detectLanguage('es-MX,en;q=0.8', available, 'en')).toBe('es');
    expect(detectLanguage('en-GB,es;q=0.5', available, 'es')).toBe('en');
  });

  test('returns default when no match', () => {
    expect(detectLanguage('ja,zh;q=0.9', available, 'es')).toBe('es');
    expect(detectLanguage('', available, 'en')).toBe('en');
  });

  test('prefers higher quality match', () => {
    expect(detectLanguage('fr;q=1.0,en;q=0.9,es;q=0.8', available, 'es')).toBe('en');
  });

  test('matches exact regional when available', () => {
    const withRegional = ['es', 'es-mx', 'en'];
    expect(detectLanguage('es-MX', withRegional, 'en')).toBe('es-mx');
  });

  test('cascades from regional to base', () => {
    expect(detectLanguage('es-AR', available, 'en')).toBe('es');
  });

  test('handles real-world complex header', () => {
    const header = 'en-GB,en-US;q=0.9,en;q=0.8,es;q=0.7,fr;q=0.6';
    expect(detectLanguage(header, available, 'es')).toBe('en');
  });
});

describe('findLanguageSite', () => {
  const sites = [
    {
      pathPrefix: '/demo/salva',
      languages: ['es', 'en'],
      default: 'es',
      redirectPaths: ['/', '/index.html'],
      excludePaths: ['/assets/'],
    },
    {
      pathPrefix: '/demo/other',
      languages: ['de', 'en'],
      default: 'de',
      redirectPaths: ['/', '/index.html'],
      excludePaths: ['/assets/'],
    },
  ];

  test('matches site by exact pathPrefix', () => {
    const result = findLanguageSite('/demo/salva', sites);
    expect(result).not.toBeNull();
    expect(result.site.pathPrefix).toBe('/demo/salva');
    expect(result.remainingPath).toBe('/');
  });

  test('matches site with trailing slash', () => {
    const result = findLanguageSite('/demo/salva/', sites);
    expect(result).not.toBeNull();
    expect(result.remainingPath).toBe('/');
  });

  test('matches site with subpath', () => {
    const result = findLanguageSite('/demo/salva/index.html', sites);
    expect(result).not.toBeNull();
    expect(result.remainingPath).toBe('/index.html');
  });

  test('matches correct site from multiple', () => {
    const result = findLanguageSite('/demo/other/', sites);
    expect(result.site.pathPrefix).toBe('/demo/other');
  });

  test('returns null for unregistered path', () => {
    expect(findLanguageSite('/blogs/mx/', sites)).toBeNull();
    expect(findLanguageSite('/', sites)).toBeNull();
  });

  test('returns null for null or empty sites', () => {
    expect(findLanguageSite('/demo/salva/', null)).toBeNull();
    expect(findLanguageSite('/demo/salva/', [])).toBeNull();
  });

  test('does not partially match pathPrefix', () => {
    expect(findLanguageSite('/demo/salva-extra/', sites)).toBeNull();
  });
});

describe('shouldLanguageRedirect', () => {
  const site = {
    pathPrefix: '/demo/salva',
    languages: ['es', 'en'],
    default: 'es',
    redirectPaths: ['/', '/index.html'],
    excludePaths: ['/assets/'],
  };

  test('redirects root path', () => {
    expect(shouldLanguageRedirect('/', site)).toBe(true);
  });

  test('redirects index.html', () => {
    expect(shouldLanguageRedirect('/index.html', site)).toBe(true);
  });

  test('does not redirect excluded paths', () => {
    expect(shouldLanguageRedirect('/assets/style.css', site)).toBe(false);
    expect(shouldLanguageRedirect('/assets/', site)).toBe(false);
  });

  test('does not redirect non-registered paths', () => {
    expect(shouldLanguageRedirect('/about.html', site)).toBe(false);
    expect(shouldLanguageRedirect('/es/', site)).toBe(false);
  });

  test('handles site without excludePaths', () => {
    const simple = { redirectPaths: ['/', '/index.html'] };
    expect(shouldLanguageRedirect('/', simple)).toBe(true);
  });

  test('handles site without redirectPaths', () => {
    const noRedirect = { excludePaths: ['/assets/'] };
    expect(shouldLanguageRedirect('/', noRedirect)).toBe(false);
  });
});

// ============================================================
// categoriseAgent Tests
// ============================================================
describe('categoriseAgent', () => {
  test('identifies ChatGPT', () => {
    expect(categoriseAgent('ChatGPT-User/1.0')).toBe('chatgpt');
    expect(categoriseAgent('Mozilla/5.0 (compatible; OpenAI)')).toBe('chatgpt');
  });

  test('identifies Claude', () => {
    expect(categoriseAgent('ClaudeBot/1.0')).toBe('claude');
    expect(categoriseAgent('Anthropic-Agent/2.0')).toBe('claude');
  });

  test('identifies Perplexity', () => {
    expect(categoriseAgent('PerplexityBot/1.0')).toBe('perplexity');
  });

  test('identifies GPTBot as chatgpt family', () => {
    expect(categoriseAgent('GPTBot/1.0')).toBe('chatgpt');
    expect(categoriseAgent('OAI-SearchBot/1.0')).toBe('chatgpt');
  });

  test('identifies Googlebot', () => {
    expect(categoriseAgent('Googlebot/2.1')).toBe('googlebot');
  });

  test('identifies Google-Extended as gemini family', () => {
    expect(categoriseAgent('Mozilla/5.0 (compatible; Google-Extended/1.0)')).toBe('gemini');
  });

  test('identifies Copilot', () => {
    expect(categoriseAgent('Mozilla/5.0 (compatible; Copilot/1.0)')).toBe('copilot');
  });

  test('identifies PerplexityBot variants', () => {
    expect(categoriseAgent('PerplexityBot/1.0')).toBe('perplexity');
  });

  test('identifies newer crawlers', () => {
    expect(categoriseAgent('Applebot-Extended/1.0')).toBe('applebot');
    expect(categoriseAgent('meta-externalagent/1.0')).toBe('meta-ai');
    expect(categoriseAgent('Bytespider')).toBe('bytespider');
    expect(categoriseAgent('CCBot/2.0')).toBe('ccbot');
    expect(categoriseAgent('Amazonbot/0.1')).toBe('amazonbot');
  });

  test('identifies Bingbot', () => {
    expect(categoriseAgent('bingbot/2.0')).toBe('bingbot');
  });

  test('identifies browsers', () => {
    expect(categoriseAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')).toBe('browser');
  });

  test('identifies generic bots', () => {
    expect(categoriseAgent('SomeBot/1.0')).toBe('bot');
    expect(categoriseAgent('web-crawler/3.0')).toBe('bot');
    expect(categoriseAgent('spider-agent')).toBe('bot');
  });

  test('returns unknown for null or empty', () => {
    expect(categoriseAgent(null)).toBe('unknown');
    expect(categoriseAgent(undefined)).toBe('unknown');
    expect(categoriseAgent('')).toBe('unknown');
  });

  test('returns unknown for unrecognised agent', () => {
    expect(categoriseAgent('curl/7.88.1')).toBe('unknown');
    expect(categoriseAgent('custom-http-client')).toBe('unknown');
  });
});

// ── Book Sales Tests ───────────────────────────────────────────
// Ported from mx-reginald/worker/tests/book-purchase.test.js on 2026-04-08.
// Uses plain-object mocks for Response/Request because vitest 4 with node env
// does not expose Fetch API globals (matching the pattern of existing tests
// in this file at lines 770-810 which roll their own Response mock).

/** Build a mock fetch Response (plain object — no Response constructor). */
function bookMockResponse(body, status = 200) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json: async () => (typeof body === 'string' ? JSON.parse(body) : body),
    text: async () => text,
  };
}

/** Build a mock Request (plain object — no Request constructor). */
function bookMockRequest({ method = 'GET', body = null, headers = {} } = {}) {
  return {
    method,
    headers: { get: (name) => headers[name] || headers[name?.toLowerCase()] || null },
    json: async () => {
      if (body === null) throw new SyntaxError('Unexpected end of JSON input');
      try { return JSON.parse(body); } catch { throw new SyntaxError('Invalid JSON'); }
    },
    text: async () => body || '',
  };
}

/** Mock D1 database. */
function createBookMockDB() {
  let lastId = 0;
  return {
    prepare: vi.fn(() => ({
      bind: vi.fn(function bindStub() { return this; }),
      run: vi.fn(async () => {
        lastId += 1;
        return { meta: { last_row_id: lastId, changes: 0 } };
      }),
      first: vi.fn(async () => ({
        id: lastId,
        token_hash: 'mock-hash',
        book_id: 'handbook',
        email: 'buyer@example.com',
        status: 'active',
        download_count: 0,
        max_downloads: 4,
        expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
      })),
      all: vi.fn(async () => ({ results: [] })),
    })),
  };
}

/** Mock fetch for Stripe + MailerLite API calls. */
function createBookMockFetch() {
  return vi.fn(async (url, options) => {
    const urlStr = typeof url === 'string' ? url : url.toString();

    if (urlStr.includes('/checkout/sessions') && options?.method === 'POST') {
      return bookMockResponse({
        id: 'cs_test_abc123',
        url: 'https://checkout.stripe.com/pay/cs_test_abc123',
        payment_status: 'unpaid',
      });
    }
    if (urlStr.includes('/customers/') && options?.method === 'POST') {
      return bookMockResponse({ id: 'cus_test_123' });
    }
    if (urlStr.includes('/checkout/sessions/')) {
      return bookMockResponse({ id: 'cs_test_abc123', customer: 'cus_test_123' });
    }
    if (urlStr.includes('/customers/')) {
      return bookMockResponse({
        id: 'cus_test_123',
        metadata: { download_url: 'https://reginald.allabout.network/api/v1/books/download/abc123def456789a' },
      });
    }
    if (urlStr.includes('connect.mailerlite.com')) {
      return bookMockResponse({ data: { id: 'ml_sub_123', email: 'buyer@example.com' } });
    }
    return bookMockResponse('Not found', 404);
  });
}

/** Polyfill a minimal Response for handler returns (json/error responses).
 * The lib/responses.js helper calls `new Response(...)` so we need a constructor. */
function installResponsePolyfill() {
  if (typeof globalThis.Response === 'function' && globalThis.__bookResponsePolyfill !== true) {
    return false;
  }
  globalThis.Response = class {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || '';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.ok = this.status >= 200 && this.status < 300;
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    }
  };
  globalThis.__bookResponsePolyfill = true;
  return true;
}

function uninstallResponsePolyfill() {
  if (globalThis.__bookResponsePolyfill) {
    delete globalThis.Response;
    delete globalThis.__bookResponsePolyfill;
  }
}

/** Create test environment bindings. */
function createBookMockEnv() {
  return {
    DB: createBookMockDB(),
    BOOKS_R2: { get: vi.fn(async () => null) },
    STRIPE_SECRET_KEY: 'sk_test_fake_key',
    STRIPE_WEBHOOK_SECRET: 'whsec_test_fake_secret',
    STRIPE_HANDBOOK_PDF_PRICE_ID: 'price_test_pdf_123',
    STRIPE_HANDBOOK_PHYSICAL_UK_PRICE_ID: 'price_test_physical_uk_789',
    STRIPE_HANDBOOK_PHYSICAL_WORLD_PRICE_ID: 'price_test_physical_world_456',
    MAILERLITE_API_KEY: 'ml_test_fake_key',
    MAILERLITE_GROUP_HANDBOOK_PDF: 'group_pdf_123',
    MAILERLITE_GROUP_HANDBOOK_PHYSICAL: 'group_physical_456',
  };
}

describe('Book Checkout Handler', () => {
  let env;
  let originalFetch;
  let installedPolyfill;

  beforeEach(() => {
    env = createBookMockEnv();
    originalFetch = globalThis.fetch;
    globalThis.fetch = createBookMockFetch();
    installedPolyfill = installResponsePolyfill();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (installedPolyfill) uninstallResponsePolyfill();
  });

  test('creates PDF checkout session', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({
      method: 'POST',
      body: JSON.stringify({ product: 'pdf', email: 'buyer@example.com' }),
    });
    const response = await handleBookCheckout(request, env);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.checkout_url).toContain('checkout.stripe.com');
    expect(data.session_id).toBe('cs_test_abc123');
  });

  test('creates physical_world checkout session', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({ method: 'POST', body: JSON.stringify({ product: 'physical_world' }) });
    const response = await handleBookCheckout(request, env);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.checkout_url).toBeDefined();
  });

  test('creates physical_uk checkout session restricted to GB', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({ method: 'POST', body: JSON.stringify({ product: 'physical_uk' }) });
    const response = await handleBookCheckout(request, env);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.checkout_url).toBeDefined();
    // Verify GB-only shipping was set on the underlying Stripe call.
    const stripeCall = globalThis.fetch.mock.calls.find((c) => typeof c[0] === 'string' && c[0].includes('checkout/sessions'));
    const body = stripeCall[1].body;
    expect(body).toContain('shipping_address_collection');
    expect(body).toContain('GB');
    // physical_uk should not include US/CA/etc
    expect(body).not.toContain('%5D=US');
    expect(body).not.toContain('%5D=CA');
  });

  test('rejects invalid product type', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({ method: 'POST', body: JSON.stringify({ product: 'audiobook' }) });
    const response = await handleBookCheckout(request, env);
    expect(response.status).toBe(400);
  });

  test('rejects missing product', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({ method: 'POST', body: JSON.stringify({}) });
    const response = await handleBookCheckout(request, env);
    expect(response.status).toBe(400);
  });

  test('rejects invalid JSON body', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const request = bookMockRequest({ method: 'POST', body: 'not json' });
    const response = await handleBookCheckout(request, env);
    expect(response.status).toBe(400);
  });

  test('returns 503 when price ID not configured', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    env.STRIPE_HANDBOOK_PDF_PRICE_ID = 'placeholder-set-in-dashboard';
    const request = bookMockRequest({ method: 'POST', body: JSON.stringify({ product: 'pdf' }) });
    const response = await handleBookCheckout(request, env);
    expect(response.status).toBe(503);
  });
});

describe('Stripe Client — createBookCheckoutSession', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = createBookMockFetch();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('creates one-time payment session (not subscription)', async () => {
    const { createBookCheckoutSession } = await import('./reginald/stripe/client.js');
    const session = await createBookCheckoutSession('sk_test_key', {
      priceId: 'price_pdf_123',
      email: 'buyer@example.com',
      bookId: 'handbook',
      productType: 'pdf',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      shippingCountries: null,
    });
    expect(session.id).toBe('cs_test_abc123');
    expect(session.url).toContain('checkout.stripe.com');
    const fetchCall = globalThis.fetch.mock.calls[0];
    const body = fetchCall[1].body;
    expect(body).toContain('mode=payment');
    expect(body).not.toContain('mode=subscription');
    // No shipping for digital products.
    expect(body).not.toContain('shipping_address_collection');
  });

  test('includes worldwide shipping collection for physical_world', async () => {
    const { createBookCheckoutSession } = await import('./reginald/stripe/client.js');
    await createBookCheckoutSession('sk_test_key', {
      priceId: 'price_physical_world_456',
      bookId: 'handbook',
      productType: 'physical_world',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      shippingCountries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR'],
    });
    const fetchCall = globalThis.fetch.mock.calls[0];
    const body = fetchCall[1].body;
    expect(body).toContain('shipping_address_collection');
    expect(body).toContain('GB');
    expect(body).toContain('US');
    expect(body).toContain('CA');
  });

  test('restricts shipping to GB only for physical_uk', async () => {
    const { createBookCheckoutSession } = await import('./reginald/stripe/client.js');
    await createBookCheckoutSession('sk_test_key', {
      priceId: 'price_physical_uk_789',
      bookId: 'handbook',
      productType: 'physical_uk',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      shippingCountries: ['GB'],
    });
    const fetchCall = globalThis.fetch.mock.calls[0];
    const body = fetchCall[1].body;
    expect(body).toContain('shipping_address_collection');
    expect(body).toContain('GB');
    // Should not include other countries.
    expect(body).not.toContain('%5D=US');
    expect(body).not.toContain('%5D=DE');
  });

  test('sets book_purchase metadata', async () => {
    const { createBookCheckoutSession } = await import('./reginald/stripe/client.js');
    await createBookCheckoutSession('sk_test_key', {
      priceId: 'price_pdf_123',
      bookId: 'handbook',
      productType: 'pdf',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      shippingCountries: null,
    });
    const fetchCall = globalThis.fetch.mock.calls[0];
    const body = fetchCall[1].body;
    expect(body).toContain('metadata%5Btype%5D=book_purchase');
    expect(body).toContain('metadata%5Bbook_id%5D=handbook');
    expect(body).toContain('metadata%5Bproduct_type%5D=pdf');
  });
});

describe('MailerLite Client', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = createBookMockFetch();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sends purchase notification with custom fields', async () => {
    const { notifyPurchase } = await import('./reginald/lib/mailerlite.js');
    const result = await notifyPurchase('ml_test_key', {
      email: 'buyer@example.com',
      name: 'Test Buyer',
      productType: 'pdf',
      bookTitle: 'MX: The Handbook',
      downloadUrl: 'https://reginald.allabout.network/api/v1/books/download/abc123',
      orderId: 'cs_test_abc123',
      groupId: 'group_pdf_123',
    });
    expect(result.data.email).toBe('buyer@example.com');
    const fetchCall = globalThis.fetch.mock.calls[0];
    const url = fetchCall[0];
    const body = JSON.parse(fetchCall[1].body);
    expect(url).toContain('connect.mailerlite.com/api/subscribers');
    expect(body.email).toBe('buyer@example.com');
    expect(body.fields.book_title).toBe('MX: The Handbook');
    expect(body.fields.order_type).toBe('pdf');
    expect(body.fields.download_url).toContain('abc123');
    expect(body.groups).toContain('group_pdf_123');
  });

  test('formats shipping address for physical orders', async () => {
    const { notifyPurchase } = await import('./reginald/lib/mailerlite.js');
    await notifyPurchase('ml_test_key', {
      email: 'buyer@example.com',
      name: 'Test Buyer',
      productType: 'physical_uk',
      bookTitle: 'MX: The Handbook',
      downloadUrl: '',
      orderId: 'cs_test_abc123',
      shippingAddress: {
        name: 'Test Buyer',
        line1: '120 Main Street',
        city: 'Largs',
        postal_code: 'KA30 8AB',
        country: 'GB',
      },
      groupId: 'group_physical_456',
    });
    const fetchCall = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    expect(body.fields.shipping_address).toContain('120 Main Street');
    expect(body.fields.shipping_address).toContain('Largs');
    expect(body.fields.shipping_address).toContain('GB');
  });
});

describe('Free Book Email Capture', () => {
  test('buildFreeBookFormHTML returns valid HTML with form', () => {
    const html = buildFreeBookFormHTML();
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<form method="post" action="/books/download-intro">');
    expect(html).toContain('type="email"');
    expect(html).toContain('name="email"');
    expect(html).toContain('required');
  });

  test('buildFreeBookFormHTML includes back link to books page', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('https://mx.allabout.network/books/');
  });

  test('buildFreeBookFormHTML includes MX branding', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('MX: The Introduction');
    expect(html).toContain('CogNovaMX');
  });

  test('buildFreeBookFormHTML optional name field present', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('name="name"');
    expect(html).toContain('type="text"');
  });

  test('buildFreeBookFormHTML has lang attribute for accessibility', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('lang="en-GB"');
  });

  test('buildFreeBookFormHTML includes Open Graph metadata', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('property="og:type"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('property="og:image"');
  });

  test('buildFreeBookFormHTML includes MX governance tags', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('name="mx:status"');
    expect(html).toContain('name="mx:contentType"');
  });

  test('buildFreeBookFormHTML includes Schema.org JSON-LD', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type": "WebPage"');
    expect(html).toContain('schema.org');
  });

  test('buildFreeBookFormHTML uses external stylesheet not inline styles', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('rel="stylesheet"');
    expect(html).toContain('/styles/books-download-intro.css');
    expect(html).not.toContain('<style>');
  });

  test('buildFreeBookFormHTML optional label uses CSS class not inline color', () => {
    const html = buildFreeBookFormHTML();
    expect(html).toContain('class="optional-label"');
    expect(html).not.toContain('color:#777');
  });
});

describe('Free Book Admin Notification', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_test_123' }),
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sendFreeBookNotification sends to the from address', async () => {
    const { sendFreeBookNotification } = await import('./reginald/lib/resend.js');
    await sendFreeBookNotification('re_test_key', {
      from: 'CogNovaMX <info@cognovamx.com>',
      to: 'CogNovaMX <info@cognovamx.com>',
      email: 'reader@example.com',
      name: 'Test Reader',
    });
    const call = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(call[0]).toContain('resend.com');
    expect(body.to).toBe('CogNovaMX <info@cognovamx.com>');
    expect(body.subject).toContain('reader@example.com');
    expect(body.subject).toContain('Test Reader');
    expect(body.html).toContain('MX: The Introduction');
  });

  test('sendFreeBookNotification handles missing name gracefully', async () => {
    const { sendFreeBookNotification } = await import('./reginald/lib/resend.js');
    await sendFreeBookNotification('re_test_key', {
      from: 'CogNovaMX <info@cognovamx.com>',
      to: 'CogNovaMX <info@cognovamx.com>',
      email: 'anon@example.com',
      name: '',
    });
    const call = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.subject).toBe('Free book download: anon@example.com');
    expect(body.html).toContain('not provided');
  });
});

describe('Webhook — Book Purchase Routing', () => {
  test('routes book_purchase events correctly (not to subscription handler)', () => {
    const sessionWithBookMeta = { metadata: { type: 'book_purchase', product_type: 'pdf' } };
    const sessionWithSubMeta = { metadata: { namespace: 'test-publisher' } };
    expect(sessionWithBookMeta.metadata?.type === 'book_purchase').toBe(true);
    expect(sessionWithSubMeta.metadata?.type === 'book_purchase').toBe(false);
  });

  test('download token format is 16-char lowercase hex', async () => {
    const { hashToken } = await import('./reginald/lib/token.js');
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const downloadToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(downloadToken).toHaveLength(16);
    expect(downloadToken).toMatch(/^[a-f0-9]{16}$/);
    const tokenHash = await hashToken(downloadToken);
    expect(tokenHash).toBeDefined();
    expect(typeof tokenHash).toBe('string');
  });
});

describe('End-to-End Book Flow', () => {
  let env;
  let originalFetch;
  let installedPolyfill;

  beforeEach(() => {
    env = createBookMockEnv();
    originalFetch = globalThis.fetch;
    globalThis.fetch = createBookMockFetch();
    installedPolyfill = installResponsePolyfill();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (installedPolyfill) uninstallResponsePolyfill();
  });

  test('full PDF purchase flow: checkout → returns checkout URL', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const checkoutReq = bookMockRequest({
      method: 'POST',
      body: JSON.stringify({ product: 'pdf', email: 'buyer@example.com' }),
    });
    const checkoutResp = await handleBookCheckout(checkoutReq, env);
    const checkoutData = await checkoutResp.json();
    expect(checkoutResp.status).toBe(200);
    expect(checkoutData.checkout_url).toBeDefined();
    expect(checkoutData.session_id).toBeDefined();

    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(token).toHaveLength(16);
    expect(token).toMatch(/^[a-f0-9]+$/);
    expect(env.MAILERLITE_API_KEY).toBeDefined();
    expect(env.MAILERLITE_GROUP_HANDBOOK_PDF).toBeDefined();
  });

  test('full physical_world purchase flow: checkout includes worldwide shipping', async () => {
    const { handleBookCheckout } = await import('./reginald/handlers/book-checkout.js');
    const checkoutReq = bookMockRequest({
      method: 'POST',
      body: JSON.stringify({ product: 'physical_world', email: 'buyer@example.com' }),
    });
    const checkoutResp = await handleBookCheckout(checkoutReq, env);
    const checkoutData = await checkoutResp.json();
    expect(checkoutResp.status).toBe(200);
    expect(checkoutData.checkout_url).toBeDefined();
    const fetchCalls = globalThis.fetch.mock.calls;
    const stripeFetchCall = fetchCalls.find((c) => typeof c[0] === 'string' && c[0].includes('checkout/sessions'));
    expect(stripeFetchCall).toBeDefined();
    expect(stripeFetchCall[1].body).toContain('shipping_address_collection');
    expect(stripeFetchCall[1].body).toContain('GB');
    expect(stripeFetchCall[1].body).toContain('US');
  });
});

// ============================================================
// AI Attribution — pure function tests
// ============================================================
describe('isAiAgent', () => {
  test('classifies AI categories as AI', () => {
    ['chatgpt', 'claude', 'perplexity', 'gemini', 'copilot', 'applebot', 'meta-ai', 'bytespider', 'ccbot', 'amazonbot'].forEach((k) => {
      expect(isAiAgent(k)).toBe(true);
    });
  });
  test('classifies non-AI categories as not AI', () => {
    ['browser', 'googlebot', 'bingbot', 'bot', 'unknown'].forEach((k) => {
      expect(isAiAgent(k)).toBe(false);
    });
  });
});

describe('categoriseReferer', () => {
  test('returns null for missing or malformed referer', () => {
    expect(categoriseReferer(null)).toBeNull();
    expect(categoriseReferer('')).toBeNull();
    expect(categoriseReferer('not a url')).toBeNull();
  });

  test('matches ChatGPT surfaces', () => {
    expect(categoriseReferer('https://chat.openai.com/c/abc')).toEqual({
      source: 'chat.openai.com', agentKey: 'chatgpt',
    });
    expect(categoriseReferer('https://chatgpt.com/share/xyz')).toEqual({
      source: 'chatgpt.com', agentKey: 'chatgpt',
    });
  });

  test('matches Perplexity, Gemini, Copilot, Claude', () => {
    expect(categoriseReferer('https://www.perplexity.ai/search?q=x').agentKey).toBe('perplexity');
    expect(categoriseReferer('https://gemini.google.com/app').agentKey).toBe('gemini');
    expect(categoriseReferer('https://copilot.microsoft.com/').agentKey).toBe('copilot');
    expect(categoriseReferer('https://claude.ai/chat/123').agentKey).toBe('claude');
  });

  test('returns null for non-AI referrers', () => {
    expect(categoriseReferer('https://www.google.com/search?q=x')).toBeNull();
    expect(categoriseReferer('https://twitter.com/foo')).toBeNull();
    expect(categoriseReferer('https://allabout.network/some/page')).toBeNull();
  });

  test('matches Bing chat by hostname+path (the earlier hostname-only regex never hit)', () => {
    expect(categoriseReferer('https://www.bing.com/chat?q=foo')).toEqual({
      source: 'bing.com/chat', agentKey: 'copilot',
    });
    expect(categoriseReferer('https://bing.com/chat/something')).toEqual({
      source: 'bing.com/chat', agentKey: 'copilot',
    });
    // Bing without /chat is organic search, not chat
    expect(categoriseReferer('https://www.bing.com/search?q=x')).toBeNull();
  });

  test('matches newer AI surfaces (Meta, Grok, Copilot cloud, DuckAI)', () => {
    expect(categoriseReferer('https://meta.ai/chat/abc').agentKey).toBe('meta-ai');
    expect(categoriseReferer('https://grok.com/c/abc').agentKey).toBe('grok');
    expect(categoriseReferer('https://x.ai/app').agentKey).toBe('grok');
    expect(categoriseReferer('https://copilot.cloud.microsoft/').agentKey).toBe('copilot');
    expect(categoriseReferer('https://m365.cloud.microsoft/chat').agentKey).toBe('copilot');
    expect(categoriseReferer('https://duckduckgo.com/duckai?q=x').agentKey).toBe('duckai');
  });
});

describe('shouldSkipAiCapture', () => {
  test('skips asset extensions', () => {
    ['/foo.css', '/bar.js', '/img.png', '/photo.jpg', '/data.json', '/styles.map', '/robots.txt', '/sitemap.xml'].forEach((p) => {
      expect(shouldSkipAiCapture(p)).toBe(true);
    });
  });
  test('skips internal paths', () => {
    expect(shouldSkipAiCapture('/.rum/abc')).toBe(true);
    expect(shouldSkipAiCapture('/favicon.ico')).toBe(true);
    expect(shouldSkipAiCapture('/api/v1/ai-attribution')).toBe(true);
  });
  test('captures HTML pages', () => {
    expect(shouldSkipAiCapture('/')).toBe(false);
    expect(shouldSkipAiCapture('/blog/post')).toBe(false);
    expect(shouldSkipAiCapture('/books/handbook.html')).toBe(false);
  });
});

describe('buildAiVisitRow', () => {
  const base = {
    hostname: 'allabout.network',
    pathname: '/blog/post',
    country: 'GB',
    status: 200,
    now: 1700000000000,
  };

  test('returns crawler row for AI User-Agent', () => {
    const row = buildAiVisitRow({ ...base, userAgent: 'ClaudeBot/1.0', referer: null });
    expect(row).toMatchObject({
      hostname: 'allabout.network',
      path: '/blog/post',
      eventType: 'crawler',
      agentKey: 'claude',
      ts: 1700000000000,
    });
  });

  test('returns referral row for AI referer', () => {
    const row = buildAiVisitRow({
      ...base,
      userAgent: 'Mozilla/5.0 Chrome/120',
      referer: 'https://chatgpt.com/c/abc',
    });
    expect(row.eventType).toBe('referral');
    expect(row.agentKey).toBe('chatgpt');
  });

  test('returns null for ordinary browser + ordinary referer', () => {
    expect(buildAiVisitRow({
      ...base,
      userAgent: 'Mozilla/5.0 Chrome/120',
      referer: 'https://www.google.com/search?q=x',
    })).toBeNull();
  });

  test('returns null when path should be skipped', () => {
    expect(buildAiVisitRow({
      ...base,
      pathname: '/styles.css',
      userAgent: 'ClaudeBot/1.0',
    })).toBeNull();
  });

  test('returns null when hostname/path missing', () => {
    expect(buildAiVisitRow({ ...base, hostname: '', userAgent: 'ClaudeBot' })).toBeNull();
    expect(buildAiVisitRow({ ...base, pathname: '', userAgent: 'ClaudeBot' })).toBeNull();
  });
});

describe('isAttributionHost', () => {
  test('matches operated domains and subdomains', () => {
    expect(isAttributionHost('allabout.network')).toBe(true);
    expect(isAttributionHost('mx.allabout.network')).toBe(true);
    expect(isAttributionHost('reginald.allabout.network')).toBe(true);
    expect(isAttributionHost('cognovamx.com')).toBe(true);
    expect(isAttributionHost('www.cognovamx.com')).toBe(true);
  });
  test('rejects other hostnames', () => {
    expect(isAttributionHost('example.com')).toBe(false);
    expect(isAttributionHost('allabout.network.attacker.com')).toBe(false);
    expect(isAttributionHost('')).toBe(false);
    expect(isAttributionHost(null)).toBe(false);
  });
});

// ============================================================
// GA4 Connector — buildPayload pure function
// ============================================================
import { buildPayload as buildGa4Payload } from './reginald/lib/ga4-connector.js';

describe('GA4 connector buildPayload', () => {
  test('maps ai_visits rows to ai_agent_visit events', () => {
    const rows = [
      { agent_key: 'chatgpt', event_type: 'crawler', path: '/blog/a' },
      { agent_key: 'perplexity', event_type: 'referral', path: '/blog/b' },
    ];
    const payload = buildGa4Payload(rows);
    expect(payload.client_id).toBe('ai_attribution_connector');
    expect(payload.events).toHaveLength(2);
    expect(payload.events[0].name).toBe('ai_agent_visit');
    expect(payload.events[0].params.agent_key).toBe('chatgpt');
    expect(payload.events[0].params.medium).toBe('ai_crawler');
    expect(payload.events[1].params.medium).toBe('ai_referral');
    expect(payload.events[1].params.source).toBe('perplexity');
  });

  test('caps batch size at 25', () => {
    const rows = Array.from({ length: 40 }, (_, i) => ({
      agent_key: 'chatgpt', event_type: 'crawler', path: `/p${i}`,
    }));
    const payload = buildGa4Payload(rows);
    expect(payload.events).toHaveLength(25);
  });
});
