/*
 * Based on Adobe's Cloudflare Worker template
 * Original copyright 2022 Adobe. Licensed under Apache License, Version 2.0
 * Modified by Digital Domain Technologies Ltd
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const getExtension = (path) => {
  const basename = path.split('/').pop();
  const pos = basename.lastIndexOf('.');
  return (basename === '' || pos < 1) ? '' : basename.slice(pos + 1);
};

const isMediaRequest = (url) => (
  /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/.test(url.pathname)
);
const isRUMRequest = (url) => /\/\.(rum|optel)\/.*/.test(url.pathname);

const handleRequest = async (request, env, _ctx) => {
  // Validate required environment variables
  if (!env.ORIGIN_HOSTNAME) {
    return new Response('Configuration Error: Missing ORIGIN_HOSTNAME environment variable', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Optional debug logging (set DEBUG=true in environment variables)
  const DEBUG = env.DEBUG === 'true';

  const url = new URL(request.url);

  // Handle CORS preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (url.port) {
    // Cloudflare opens a couple more ports than 443, so we redirect visitors
    // to the default port to avoid confusion.
    // https://developers.cloudflare.com/fundamentals/reference/network-ports/#network-ports-compatible-with-cloudflares-proxy
    const redirectTo = new URL(request.url);
    redirectTo.port = '';
    return new Response(`Moved permanently to ${redirectTo.href}`, {
      status: 301,
      headers: {
        location: redirectTo.href,
      },
    });
  }

  if (url.pathname.startsWith('/drafts/')) {
    return new Response('Not Found', { status: 404 });
  }

  if (isRUMRequest(url)) {
    // only allow GET, POST, OPTIONS
    if (!['GET', 'POST', 'OPTIONS'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }
  }

  const extension = getExtension(url.pathname);
  // remember original search params
  const savedSearch = url.search;
  // sanitise search params
  const { searchParams } = url;
  if (isMediaRequest(url)) {
    Array.from(searchParams.keys()).forEach((key) => {
      if (!['format', 'height', 'optimize', 'width'].includes(key)) {
        searchParams.delete(key);
      }
    });
  } else if (extension === 'json') {
    Array.from(searchParams.keys()).forEach((key) => {
      if (!['limit', 'offset', 'sheet'].includes(key)) {
        searchParams.delete(key);
      }
    });
  } else {
    // neither media nor json request: strip search params
    url.search = '';
  }
  searchParams.sort();

  url.hostname = env.ORIGIN_HOSTNAME;
  if (!url.origin.match(/^https?:\/\/main--.*--.*\.(?:aem|hlx)\.(?:live|page)/)) {
    return new Response('Invalid ORIGIN_HOSTNAME', { status: 500 });
  }

  const req = new Request(url, request);
  req.headers.set('x-forwarded-host', req.headers.get('host'));
  req.headers.set('x-byo-cdn-type', 'cloudflare');
  if (env.PUSH_INVALIDATION !== 'disabled') {
    req.headers.set('x-push-invalidation', 'enabled');
  }
  if (env.ORIGIN_AUTHENTICATION) {
    req.headers.set('authorization', `token ${env.ORIGIN_AUTHENTICATION}`);
  }

  let resp = await fetch(req, {
    method: req.method,
    cf: {
      // cf doesn't cache html by default: need to override the default behaviour
      cacheEverything: true,
    },
  });

  // Only process HTML responses for JSON-LD injection
  const contentType = resp.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
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

    // eslint-disable-next-line no-undef
    resp = new HTMLRewriter()
      // Trigger 1: Legacy EDS error script with "article"
      .on('script[type="application/ld+json"][data-error]', {
        element(e) {
          const error = e.getAttribute('data-error');
          // Check if error message contains 'article' - this is our trigger
          if (error && error.includes('"article"')) {
            article.shouldGenerateJsonLd = true;
          }
          e.remove();
        },
      })
      // Trigger 2: New metadata approach (jsonld=article, no EDS error)
      .on('meta[name="jsonld"]', {
        element(e) {
          const value = e.getAttribute('content');
          if (value === 'article') {
            article.shouldGenerateJsonLd = true;
          }
          e.remove();
        },
      })
      // Trigger 3: Legacy perfect JSON-LD (remove and regenerate from fresh metadata)
      .on('script[type="application/ld+json"]:not([data-error])', {
        element(e) {
          // Only trigger if script contains Article type
          // Note: Can't read content in element handler, so we trigger on presence
          // This catches legacy pages where Adobe might have fixed backend
          article.shouldGenerateJsonLd = true;
          e.remove();
        },
      })
      .on('meta[data-error]', {
        element(e) { e.remove(); },
      })
      .on('meta[property="og:title"]', {
        element(e) {
          const content = e.getAttribute('content');
          article.title = content;
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log('og:title extracted:', { content, hasContent: !!content });
          }
        },
      })
      .on('meta[property="og:description"]', {
        element(e) {
          if (!article.description) {
            article.description = e.getAttribute('content');
          }
        },
      })
      .on('meta[name="longdescription"]', {
        element(e) {
          article.description = e.getAttribute('content');
          e.remove();
        },
      })
      .on('meta[property="og:url"]', {
        element(e) { article.url = e.getAttribute('content'); },
      })
      .on('meta[property="og:image"]', {
        element(e) {
          if (!article.image) {
            article.image = e.getAttribute('content');
          }
        },
      })
      .on('meta[property="og:image:alt"]', {
        element(e) { article.imageAlt = e.getAttribute('content'); },
      })
      .on('meta[name="description"]', {
        element(e) {
          if (!article.description) {
            article.description = e.getAttribute('content');
          }
          e.remove();
        },
      })
      .on('meta[name="author"]', {
        element(e) {
          article.author = e.getAttribute('content');
          e.remove();
        },
      })
      .on('meta[name="publication-date"], meta[name="published-date"]', {
        element(e) {
          if (!article.publishDate) {
            article.publishDate = e.getAttribute('content');
          }
          e.remove();
        },
      })
      .on('meta[name="modified-date"], meta[name="last-modified"]', {
        element(e) {
          if (!article.modifiedDate) {
            article.modifiedDate = e.getAttribute('content');
          }
          e.remove();
        },
      })
      .on('meta[name="viewport"]', {
        element(element) {
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log('Viewport handler:', {
              shouldGenerate: article.shouldGenerateJsonLd,
              hasTitle: !!article.title,
              title: article.title,
            });
          }

          // Only generate JSON-LD if triggered by json-ld meta tag and we have title
          if (!article.shouldGenerateJsonLd || !article.title) {
            if (DEBUG) {
              // eslint-disable-next-line no-console
              console.log('JSON-LD skipped:', {
                reason: !article.shouldGenerateJsonLd ? 'no trigger' : 'no title',
              });
            }
            return;
          }

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

          // Add publisher
          const requestUrl = new URL(request.url);
          jsonLd.publisher = {
            '@type': 'Organization',
            name: requestUrl.hostname,
          };

          // Safe JSON serialization with error handling
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
            // Log serialization errors
            // eslint-disable-next-line no-console
            console.error('JSON-LD serialization failed:', {
              error: err.message,
              url: url.pathname,
              title: article.title,
            });
          }
        },
      })
      .transform(resp);
  }

  // Create new Response for header modifications
  resp = new Response(resp.body, resp);

  if (resp.status === 301 && savedSearch) {
    const location = resp.headers.get('location');
    if (location && !location.match(/\?.*$/)) {
      resp.headers.set('location', `${location}${savedSearch}`);
    }
  }

  if (resp.status === 304) {
    // 304 Not Modified - remove CSP header
    resp.headers.delete('Content-Security-Policy');
  }

  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');

  // Add CORS headers
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return resp;
};

export default {
  fetch: handleRequest,
};
