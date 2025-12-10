import { describe, test, expect } from 'vitest';
import { buildJsonLd, shouldGenerateJsonLd } from './worker-logic.js';

describe('buildJsonLd', () => {
  test('builds minimal JSON-LD with just title', () => {
    const article = {
      title: 'Test Article',
    };

    const result = buildJsonLd(article, 'example.com');

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article',
      publisher: {
        '@type': 'Organization',
        name: 'example.com',
      },
    });
  });

  test('builds complete JSON-LD with all fields', () => {
    const article = {
      title: 'Complete Article',
      description: 'Test description',
      url: 'https://example.com/article',
      author: 'John Doe',
      publishDate: '2024-01-01',
      modifiedDate: '2024-01-02',
      image: 'https://example.com/image.jpg',
      imageAlt: 'Test image',
    };

    const result = buildJsonLd(article, 'example.com');

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Complete Article',
      description: 'Test description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      dateModified: '2024-01-02',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://example.com/image.jpg',
        caption: 'Test image',
      },
      publisher: {
        '@type': 'Organization',
        name: 'example.com',
      },
    });
  });

  test('omits optional fields when not present', () => {
    const article = {
      title: 'Minimal Article',
      description: 'Just a description',
    };

    const result = buildJsonLd(article, 'example.com');

    expect(result.description).toBe('Just a description');
    expect(result.url).toBeUndefined();
    expect(result.author).toBeUndefined();
    expect(result.image).toBeUndefined();
  });
});

describe('shouldGenerateJsonLd', () => {
  test('returns false when trigger not set', () => {
    const article = {
      shouldGenerateJsonLd: false,
      title: 'Test',
    };

    const result = shouldGenerateJsonLd(article);

    expect(result.shouldGenerate).toBe(false);
    expect(result.reason).toBe('no trigger');
  });

  test('returns false when title missing', () => {
    const article = {
      shouldGenerateJsonLd: true,
      title: null,
    };

    const result = shouldGenerateJsonLd(article);

    expect(result.shouldGenerate).toBe(false);
    expect(result.reason).toBe('no title');
  });

  test('returns true when both trigger and title present', () => {
    const article = {
      shouldGenerateJsonLd: true,
      title: 'Valid Title',
    };

    const result = shouldGenerateJsonLd(article);

    expect(result.shouldGenerate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  test('returns false when title is empty string', () => {
    const article = {
      shouldGenerateJsonLd: true,
      title: '',
    };

    const result = shouldGenerateJsonLd(article);

    expect(result.shouldGenerate).toBe(false);
    expect(result.reason).toBe('no title');
  });
});
