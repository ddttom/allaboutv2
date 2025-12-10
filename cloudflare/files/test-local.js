// Local test script to verify JSON-LD generation
// Run with: node test-local.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock HTMLRewriter for Node.js
class MockHTMLRewriter {
  constructor() {
    this.handlers = [];
  }

  on(selector, handler) {
    this.handlers.push({ selector, handler });
    return this;
  }

  transform(response) {
    // For this test, we'll manually parse and process
    return response;
  }
}

// Read the test HTML
const testHtml = readFileSync(join(__dirname, 'test-local.html'), 'utf-8');

// Create mock article object
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

console.log('Testing JSON-LD generation logic...\n');

// Simulate the handlers processing the HTML
console.log('1. Testing Trigger 2 (jsonld=article meta tag)');
const jsonldMatch = testHtml.match(/<meta name="jsonld" content="article">/);
if (jsonldMatch) {
  article.shouldGenerateJsonLd = true;
  console.log('   ✓ Trigger fired: shouldGenerateJsonLd =', article.shouldGenerateJsonLd);
} else {
  console.log('   ✗ Trigger NOT found!');
}

console.log('\n2. Testing og:title extraction');
const titleMatch = testHtml.match(/<meta property="og:title" content="([^"]+)">/);
if (titleMatch) {
  article.title = titleMatch[1];
  console.log('   ✓ Title extracted:', article.title);
} else {
  console.log('   ✗ og:title NOT found!');
}

console.log('\n3. Testing og:description extraction');
const descMatch = testHtml.match(/<meta property="og:description" content="([^"]+)">/);
if (descMatch) {
  article.description = descMatch[1];
  console.log('   ✓ Description extracted:', article.description);
}

console.log('\n4. Testing longdescription extraction');
const longDescMatch = testHtml.match(/<meta name="longdescription" content="([^"]+)">/);
if (longDescMatch) {
  article.description = longDescMatch[1]; // Overrides og:description
  console.log('   ✓ Long description extracted:', article.description.substring(0, 50) + '...');
}

console.log('\n5. Testing og:url extraction');
const urlMatch = testHtml.match(/<meta property="og:url" content="([^"]+)">/);
if (urlMatch) {
  article.url = urlMatch[1];
  console.log('   ✓ URL extracted:', article.url);
}

console.log('\n6. Testing og:image extraction');
const imageMatch = testHtml.match(/<meta property="og:image" content="([^"]+)">/);
if (imageMatch) {
  article.image = imageMatch[1];
  console.log('   ✓ Image extracted:', article.image);
}

console.log('\n7. Checking viewport handler condition');
console.log('   shouldGenerateJsonLd:', article.shouldGenerateJsonLd);
console.log('   title:', article.title);

if (!article.shouldGenerateJsonLd || !article.title) {
  console.log('\n   ✗ JSON-LD generation would be SKIPPED!');
  console.log('   Reason:', !article.shouldGenerateJsonLd ? 'no trigger' : 'no title');
} else {
  console.log('\n   ✓ JSON-LD generation would proceed!');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
  };

  if (article.description) jsonLd.description = article.description;
  if (article.url) jsonLd.url = article.url;
  if (article.image) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: article.image,
    };
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: 'allabout.network',
  };

  console.log('\n8. Generated JSON-LD:');
  console.log(JSON.stringify(jsonLd, null, 2));
}

console.log('\n✅ Test complete!');
