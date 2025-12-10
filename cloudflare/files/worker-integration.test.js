import { describe, test, expect } from 'vitest';
import { buildJsonLd, shouldGenerateJsonLd } from './worker-logic.js';

describe('Integration: HTML to JSON-LD', () => {
  test('processes production HTML correctly', () => {
    // Simulate the exact HTML from production
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>About DDT | Services | Digital transformation</title>
    <meta property="og:title" content="About DDT | Services | Digital transformation">
    <meta property="og:description" content="Meet Tom Cranstoun and Digital Domain Technologies (DDT)">
    <meta property="og:url" content="https://allabout.network/">
    <meta property="og:image" content="https://allabout.network/media_174e3e1a2ea13297a33d07d684a725d4cbbe7b902.png">
    <meta name="jsonld" content="article">
    <meta name="longdescription" content="This page introduces Tom Cranstoun and his company Digital Domain Technologies (DDT) as experts in Adobe Experience Manager (AEM) consulting.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
</html>`;

    // Simulate HTMLRewriter processing
    const article = {
      title: null,
      description: null,
      image: null,
      imageAlt: null,
      url: null,
      author: null,
      publishDate: null,
      modifiedDate: null,
      shouldGenerateJsonLd: false,
    };

    // Trigger 2: jsonld=article
    const jsonldMatch = html.match(/<meta name="jsonld" content="article">/);
    if (jsonldMatch) {
      article.shouldGenerateJsonLd = true;
    }

    // Extract og:title
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/);
    if (titleMatch) {
      article.title = titleMatch[1];
    }

    // Extract og:description
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)">/);
    if (descMatch && !article.description) {
      article.description = descMatch[1];
    }

    // Extract longdescription (overrides og:description)
    const longDescMatch = html.match(/<meta name="longdescription" content="([^"]+)">/);
    if (longDescMatch) {
      article.description = longDescMatch[1];
    }

    // Extract og:url
    const urlMatch = html.match(/<meta property="og:url" content="([^"]+)">/);
    if (urlMatch) {
      article.url = urlMatch[1];
    }

    // Extract og:image
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
    if (imageMatch && !article.image) {
      article.image = imageMatch[1];
    }

    // Verify extraction
    expect(article.shouldGenerateJsonLd).toBe(true);
    expect(article.title).toBe('About DDT | Services | Digital transformation');
    expect(article.description).toBe('This page introduces Tom Cranstoun and his company Digital Domain Technologies (DDT) as experts in Adobe Experience Manager (AEM) consulting.');
    expect(article.url).toBe('https://allabout.network/');
    expect(article.image).toBe('https://allabout.network/media_174e3e1a2ea13297a33d07d684a725d4cbbe7b902.png');

    // Check if should generate
    const check = shouldGenerateJsonLd(article);
    expect(check.shouldGenerate).toBe(true);

    // Build JSON-LD
    const jsonLd = buildJsonLd(article, 'allabout.network');

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'About DDT | Services | Digital transformation',
      description: 'This page introduces Tom Cranstoun and his company Digital Domain Technologies (DDT) as experts in Adobe Experience Manager (AEM) consulting.',
      url: 'https://allabout.network/',
      image: {
        '@type': 'ImageObject',
        url: 'https://allabout.network/media_174e3e1a2ea13297a33d07d684a725d4cbbe7b902.png',
      },
      publisher: {
        '@type': 'Organization',
        name: 'allabout.network',
      },
    });
  });

  test('detects when title extraction fails', () => {
    // HTML without og:title but with other meta tags
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta name="jsonld" content="article">
    <meta property="og:description" content="Description here">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
</html>`;

    const article = {
      title: null,
      shouldGenerateJsonLd: false,
    };

    // Trigger fires
    const jsonldMatch = html.match(/<meta name="jsonld" content="article">/);
    if (jsonldMatch) {
      article.shouldGenerateJsonLd = true;
    }

    // Try to extract title (should fail)
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/);
    if (titleMatch) {
      article.title = titleMatch[1];
    }

    // Verify state
    expect(article.shouldGenerateJsonLd).toBe(true);
    expect(article.title).toBeNull();

    // Should NOT generate
    const check = shouldGenerateJsonLd(article);
    expect(check.shouldGenerate).toBe(false);
    expect(check.reason).toBe('no title');
  });
});
