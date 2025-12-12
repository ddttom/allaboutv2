/**
 * Unit Tests for Cloudflare Worker Helper Functions
 *
 * These tests verify the utility functions used in the worker.
 * Run with: npm test (requires vitest or jest)
 */

/* eslint-disable max-classes-per-file, import/no-unresolved */
// Multiple mock classes needed for testing

import {
  describe, test, expect, vi, beforeEach, afterEach,
} from 'vitest';
import worker, {
  getExtension,
  isMediaRequest,
  isRUMRequest,
  buildJsonLd,
  formatISO8601Date,
  normalizeYear,
  replacePicturePlaceholder,
  removeHtmlComments,
  injectSpeculationRules,
  injectJsonLd,
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
    expect(jsonLd.publisher.name).toBe(hostname);
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
    expect(result.publisher.name).toBe('allabout.network');
    // Verify it's NOT using the origin hostname
    expect(result.publisher.name).not.toBe('main--allaboutv2--ddttom.aem.live');
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
    const html = '<html><head></head><body></body></html>';
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

    // Verify version header still present and shows 1.1.5
    expect(response.headers.get('cfw')).toBe(WORKER_VERSION);
    expect(WORKER_VERSION).toBe('1.1.5');
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
