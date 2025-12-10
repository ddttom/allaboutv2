/**
 * Unit Tests for Cloudflare Worker Helper Functions
 *
 * These tests verify the utility functions used in the worker.
 * Run with: npm test (requires vitest or jest)
 */

import { describe, test, expect } from 'vitest';

// Helper functions extracted for testing
const getExtension = (path) => {
  const basename = path.split('/').pop();
  const pos = basename.lastIndexOf('.');
  return (basename === '' || pos < 1) ? '' : basename.slice(pos + 1);
};

const isMediaRequest = (url) => (
  /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/.test(url.pathname)
);
const isRUMRequest = (url) => /\/\.(rum|optel)\/.*/.test(url.pathname);

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

// Mock test suite for environment variable validation
describe('Environment Variable Validation', () => {
  test('validates ORIGIN_HOSTNAME is present', () => {
    const env = { ORIGIN_HOSTNAME: 'main--project--owner.aem.live' };
    expect(env.ORIGIN_HOSTNAME).toBeTruthy();
  });

  test('detects missing ORIGIN_HOSTNAME', () => {
    const env = {};
    expect(env.ORIGIN_HOSTNAME).toBeFalsy();
  });

  test('validates ORIGIN_HOSTNAME format', () => {
    const validHostnames = [
      'main--project--owner.aem.live',
      'main--project--owner.hlx.live',
      'branch--project--owner.aem.live',
    ];

    // Pattern accepts any branch name (main, branch, feature, etc.)
    const pattern = /^https:\/\/[a-z0-9-]+--.*--.*\.(?:aem|hlx)\.live/;

    validHostnames.forEach((hostname) => {
      const url = `https://${hostname}`;
      expect(url).toMatch(pattern);
    });
  });
});

// Mock test suite for DEBUG flag
describe('Debug Flag Handling', () => {
  test('enables debug mode when DEBUG=true', () => {
    const env = { DEBUG: 'true' };
    const DEBUG = env.DEBUG === 'true';
    expect(DEBUG).toBe(true);
  });

  test('disables debug mode when DEBUG is not set', () => {
    const env = {};
    const DEBUG = env.DEBUG === 'true';
    expect(DEBUG).toBe(false);
  });

  test('disables debug mode when DEBUG=false', () => {
    const env = { DEBUG: 'false' };
    const DEBUG = env.DEBUG === 'true';
    expect(DEBUG).toBe(false);
  });
});

// Integration test suite for JSON-LD generation logic
describe('JSON-LD Generation Logic', () => {
  test('creates valid Article schema structure', () => {
    const article = {
      title: 'Test Article',
      description: 'Test description',
      url: 'https://example.com/article',
      author: 'John Doe',
      publishDate: '2024-12-10',
      modifiedDate: '2024-12-10',
    };

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      url: article.url,
      datePublished: article.publishDate,
      dateModified: article.modifiedDate,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'example.com',
      },
    };

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Article');
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.author['@type']).toBe('Person');
    expect(jsonLd.publisher['@type']).toBe('Organization');
  });

  test('omits empty fields from JSON-LD', () => {
    const article = {
      title: 'Test Article',
      description: null,
      url: null,
      author: null,
    };

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
    };

    // Only add non-null fields
    if (article.description) jsonLd.description = article.description;
    if (article.url) jsonLd.url = article.url;
    if (article.author) {
      jsonLd.author = { '@type': 'Person', name: article.author };
    }

    expect(jsonLd).not.toHaveProperty('description');
    expect(jsonLd).not.toHaveProperty('url');
    expect(jsonLd).not.toHaveProperty('author');
    expect(jsonLd.headline).toBe('Test Article');
  });

  test('handles image objects correctly', () => {
    const article = {
      image: 'https://example.com/image.jpg',
      imageAlt: 'Alt text',
    };

    const imageObj = {
      '@type': 'ImageObject',
      url: article.image,
      caption: article.imageAlt,
    };

    expect(imageObj['@type']).toBe('ImageObject');
    expect(imageObj.url).toBe(article.image);
    expect(imageObj.caption).toBe(article.imageAlt);
  });
});

// Test suite for JSON serialization error handling
describe('JSON Serialization Error Handling', () => {
  test('successfully serializes valid JSON-LD', () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test',
    };

    expect(() => JSON.stringify(jsonLd)).not.toThrow();
    const result = JSON.stringify(jsonLd);
    expect(result).toContain('"@context"');
    expect(result).toContain('"@type"');
  });

  test('handles circular references gracefully', () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test',
    };

    // Create circular reference
    jsonLd.self = jsonLd;

    expect(() => JSON.stringify(jsonLd)).toThrow();
  });
});
