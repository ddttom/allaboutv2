// Pure functions for testing - extracted from cloudflare-worker.js

/**
 * Creates HTMLRewriter handlers for JSON-LD generation
 * @param {Object} article - Article metadata object
 * @param {boolean} DEBUG - Debug flag
 * @returns {Object} HTMLRewriter handler configuration
 */
export function createHandlers(article, DEBUG = false) {
  return {
    triggers: {
      // Trigger 1: Legacy EDS error script with "article"
      errorScript: {
        selector: 'script[type="application/ld+json"][data-error]',
        handler: {
          element(e) {
            const error = e.getAttribute('data-error');
            if (error && error.includes('"article"')) {
              article.shouldGenerateJsonLd = true;
            }
            e.remove();
          },
        },
      },
      // Trigger 2: New metadata approach (jsonld=article)
      jsonldMeta: {
        selector: 'meta[name="jsonld"]',
        handler: {
          element(e) {
            const value = e.getAttribute('content');
            if (value === 'article') {
              article.shouldGenerateJsonLd = true;
            }
            e.remove();
          },
        },
      },
      // Trigger 3: Legacy perfect JSON-LD
      existingScript: {
        selector: 'script[type="application/ld+json"]:not([data-error])',
        handler: {
          element(e) {
            article.shouldGenerateJsonLd = true;
            e.remove();
          },
        },
      },
    },
    metadata: {
      errorMeta: {
        selector: 'meta[data-error]',
        handler: { element(e) { e.remove(); } },
      },
      ogTitle: {
        selector: 'meta[property="og:title"]',
        handler: {
          element(e) {
            const content = e.getAttribute('content');
            article.title = content;
            if (DEBUG) {
              // eslint-disable-next-line no-console
              console.log('og:title extracted:', { content, hasContent: !!content });
            }
          },
        },
      },
      ogDescription: {
        selector: 'meta[property="og:description"]',
        handler: {
          element(e) {
            if (!article.description) {
              article.description = e.getAttribute('content');
            }
          },
        },
      },
      longDescription: {
        selector: 'meta[name="longdescription"]',
        handler: {
          element(e) {
            article.description = e.getAttribute('content');
            e.remove();
          },
        },
      },
      ogUrl: {
        selector: 'meta[property="og:url"]',
        handler: { element(e) { article.url = e.getAttribute('content'); } },
      },
      ogImage: {
        selector: 'meta[property="og:image"]',
        handler: {
          element(e) {
            if (!article.image) {
              article.image = e.getAttribute('content');
            }
          },
        },
      },
      ogImageAlt: {
        selector: 'meta[property="og:image:alt"]',
        handler: { element(e) { article.imageAlt = e.getAttribute('content'); } },
      },
      description: {
        selector: 'meta[name="description"]',
        handler: {
          element(e) {
            if (!article.description) {
              article.description = e.getAttribute('content');
            }
            e.remove();
          },
        },
      },
      author: {
        selector: 'meta[name="author"]',
        handler: {
          element(e) {
            article.author = e.getAttribute('content');
            e.remove();
          },
        },
      },
      publicationDate: {
        selector: 'meta[name="publication-date"], meta[name="published-date"]',
        handler: {
          element(e) {
            if (!article.publishDate) {
              article.publishDate = e.getAttribute('content');
            }
            e.remove();
          },
        },
      },
      modifiedDate: {
        selector: 'meta[name="modified-date"], meta[name="last-modified"]',
        handler: {
          element(e) {
            if (!article.modifiedDate) {
              article.modifiedDate = e.getAttribute('content');
            }
            e.remove();
          },
        },
      },
    },
  };
}

/**
 * Builds JSON-LD object from article metadata
 * @param {Object} article - Article metadata
 * @param {string} hostname - Publisher hostname
 * @returns {Object} JSON-LD object
 */
export function buildJsonLd(article, hostname) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
  };

  // Only add fields that have values
  if (article.description) jsonLd.description = article.description;
  if (article.url) jsonLd.url = article.url;
  if (article.publishDate) jsonLd.datePublished = article.publishDate;
  if (article.modifiedDate) jsonLd.dateModified = article.modifiedDate;

  if (article.author) {
    jsonLd.author = {
      '@type': 'Person',
      name: article.author,
    };
  }

  if (article.image) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: article.image,
    };
    if (article.imageAlt) {
      jsonLd.image.caption = article.imageAlt;
    }
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: hostname,
  };

  return jsonLd;
}

/**
 * Checks if JSON-LD should be generated
 * @param {Object} article - Article metadata
 * @returns {Object} Result with shouldGenerate flag and reason
 */
export function shouldGenerateJsonLd(article) {
  if (!article.shouldGenerateJsonLd) {
    return { shouldGenerate: false, reason: 'no trigger' };
  }

  if (!article.title) {
    return { shouldGenerate: false, reason: 'no title' };
  }

  return { shouldGenerate: true };
}

/**
 * Creates the viewport handler that generates JSON-LD
 * @param {Object} article - Article metadata
 * @param {Object} request - Request object for hostname
 * @param {Object} url - URL object for pathname
 * @param {boolean} DEBUG - Debug flag
 * @returns {Object} Handler configuration
 */
export function createViewportHandler(article, request, url, DEBUG = false) {
  return {
    selector: 'meta[name="viewport"]',
    handler: {
      element(element) {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.log('Viewport handler:', {
            shouldGenerate: article.shouldGenerateJsonLd,
            hasTitle: !!article.title,
            title: article.title,
          });
        }

        const check = shouldGenerateJsonLd(article);
        if (!check.shouldGenerate) {
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log('JSON-LD skipped:', { reason: check.reason });
          }
          return;
        }

        const requestUrl = new URL(request.url);
        const jsonLd = buildJsonLd(article, requestUrl.hostname);

        try {
          const script = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
          element.after(script, { html: true });

          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log('JSON-LD generated successfully:', {
              url: url.pathname,
              fields: Object.keys(jsonLd),
              hasAuthor: !!article.author,
              hasImage: !!article.image,
            });
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('JSON-LD serialization failed:', {
            error: err.message,
            url: url.pathname,
            title: article.title,
          });
        }
      },
    },
  };
}
