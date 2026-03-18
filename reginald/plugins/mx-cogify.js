/**
 * MX Cogify — Universal
 *
 * Add one script tag to any HTML page:
 *   <script src="mx-cogify.js" defer></script>
 *
 * Works on any site: static HTML, SSGs (Hugo, Jekyll, 11ty, Astro),
 * custom frameworks, wikis, or anything that serves HTML.
 *
 * Reads existing page metadata and injects:
 * - MX carrier tags (mx:status, mx:contentType, mx:content-policy)
 * - Schema.org JSON-LD
 * - llms.txt discovery link
 *
 * @version 0.1.0
 * @author Tom Cranstoun
 *
 * @mx:status draft
 * @mx:contentType script
 * @mx:tags universal, generic, cogification, schema-org, mx-metadata
 */

(function () {
  'use strict';

  // --- Helpers ---

  function getMeta(name) {
    var el = document.querySelector(
      'meta[name="' + name + '"], meta[property="' + name + '"]'
    );
    return el ? el.content : '';
  }

  function setMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) {
      el.content = content;
      return;
    }
    el = document.createElement('meta');
    el.name = name;
    el.content = content;
    document.head.appendChild(el);
  }

  // --- Content type detection ---

  function detectContentType() {
    // Check if already set via existing meta.
    var existing = getMeta('mx:contentType');
    if (existing) return existing;

    var path = window.location.pathname;
    var body = document.body.className || '';
    var article = document.querySelector('article');

    // URL-based detection.
    if (/\/(blog|posts|news|articles)\//i.test(path)) return 'blog-post';
    if (/\/(products?|shop|store)\//i.test(path)) return 'product';
    if (/\/(docs?|documentation|guide|reference|wiki)\//i.test(path)) return 'reference';
    if (/\/(about|contact|team|privacy|terms)\b/i.test(path)) return 'page';

    // Element-based detection.
    if (article) {
      var time = article.querySelector('time');
      if (time) return 'blog-post';
    }

    // Schema.org already on page.
    var ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) {
      try {
        var data = JSON.parse(ld.textContent);
        var type = data['@type'] || '';
        if (/BlogPosting|NewsArticle|Article/i.test(type)) return 'blog-post';
        if (/Product/i.test(type)) return 'product';
      } catch (e) { /* ignore */ }
    }

    return 'page';
  }

  // --- Tag extraction ---

  function detectTags() {
    var existing = getMeta('mx:tags');
    if (existing) return existing;

    // Try keywords meta.
    var keywords = getMeta('keywords');
    if (keywords) return keywords;

    // Try article:tag.
    var tags = [];
    document.querySelectorAll('meta[property="article:tag"]').forEach(function (el) {
      tags.push(el.content);
    });
    if (tags.length) return tags.join(', ');

    return '';
  }

  // --- Schema.org type mapping ---

  function schemaType(contentType) {
    var map = {
      'blog-post': 'BlogPosting',
      'article': 'TechArticle',
      'product': 'Product',
      'guide': 'HowTo',
      'report': 'Report',
      'reference': 'WebPage',
      'page': 'WebPage'
    };
    return map[contentType] || 'WebPage';
  }

  // --- Injection ---

  function injectMXTags(contentType) {
    setMeta('mx:status', getMeta('mx:status') || 'active');
    setMeta('mx:content-policy', getMeta('mx:content-policy') || 'extract-with-attribution');
    setMeta('mx:audience', getMeta('mx:audience') || 'humans');
    setMeta('mx:contentType', contentType);

    var tags = detectTags();
    if (tags) setMeta('mx:tags', tags);
  }

  function injectDiscovery() {
    if (!document.querySelector('link[rel="llms-txt"]')) {
      var link = document.createElement('link');
      link.rel = 'llms-txt';
      link.href = '/llms.txt';
      document.head.appendChild(link);
    }
  }

  function injectSchema(contentType) {
    // Don't duplicate — but do augment if existing schema lacks MX fields.
    if (document.querySelector('script[type="application/ld+json"]')) return;

    var schema = {
      '@context': 'https://schema.org',
      '@type': schemaType(contentType),
      'headline': document.title.split(' | ')[0] || document.title,
      'description': getMeta('description') || getMeta('og:description'),
      'url': getMeta('og:url') || window.location.href,
      'inLanguage': document.documentElement.lang || 'en',
      'dateModified': getMeta('article:modified_time')
        || getMeta('modified')
        || getMeta('dcterms.modified')
        || new Date().toISOString().split('T')[0]
    };

    var author = getMeta('author') || getMeta('article:author');
    if (author) schema.author = { '@type': 'Person', 'name': author };

    var siteName = getMeta('og:site_name');
    if (siteName) schema.publisher = { '@type': 'Organization', 'name': siteName };

    var image = getMeta('og:image');
    if (image) schema.image = image;

    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
  }

  // --- Main ---

  function cogify() {
    var contentType = detectContentType();
    injectMXTags(contentType);
    injectDiscovery();
    injectSchema(contentType);
  }

  // Wait for the page to finish loading metadata.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(cogify);
    } else {
      window.setTimeout(cogify, 100);
    }
  } else {
    document.addEventListener('DOMContentLoaded', cogify);
  }
})();
