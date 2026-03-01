/**

* Local HTML Processing Test
*
* Reads the actual test.html file and processes it through the worker's
* string handling functions to validate HTML processing.
*
* Run with: node test-local-html.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  replacePicturePlaceholder,
  removeHtmlComments,
  removeNonSocialMetadata,
  injectJsonLd,
  injectSpeculationRules,
  PICTURE_PLACEHOLDER_CONFIG,
} from './cloudflare-worker.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const__dirname = dirname(__filename);

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m'; // No Color

function testResult(name, passed, message) {
  const icon = passed ? '✓' : '✗';
  const color = passed ? GREEN : RED;
  // eslint-disable-next-line no-console
  console.log(`${color}${icon} ${name}${NC}${message ?`: ${message}`: ''}`);
  return passed;
}

async function runTests() {
  // eslint-disable-next-line no-console
  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
  // eslint-disable-next-line no-console
  console.log(`${BLUE}🧪 LOCAL HTML PROCESSING TEST${NC}`);
  // eslint-disable-next-line no-console
  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
  // eslint-disable-next-line no-console
  console.log();

  let totalTests = 0;
  let passedTests = 0;

  try {
    // Read the actual test.html file
    const testHtmlPath = join(__dirname, '../test.html');
    // eslint-disable-next-line no-console
    console.log(`${YELLOW}📄 Reading test.html...${NC}`);
    const originalHtml = readFileSync(testHtmlPath, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`${GREEN}✓ Loaded ${originalHtml.length} characters${NC}`);
    // eslint-disable-next-line no-console
    console.log();

    // Test 1: HTML Comment Removal
    // eslint-disable-next-line no-console
    console.log(`${BLUE}1️⃣  HTML Comment Removal${NC}`);
    totalTests += 1;

    const htmlAfterComments = removeHtmlComments(originalHtml);

    // Check that comments are removed
    const hasComments = htmlAfterComments.includes('<!--');
    if (testResult('Comments removed', !hasComments)) {
      passedTests += 1;
    }

    // Verify specific comments are gone
    totalTests += 1;
    const hadTriggerComment = originalHtml.includes('<!-- Trigger JSON-LD generation -->');
    const triggerCommentGone = !htmlAfterComments.includes('<!-- Trigger JSON-LD generation -->');
    if (testResult('Trigger comment removed', hadTriggerComment && triggerCommentGone)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hadHiddenComment = originalHtml.includes('<!-- Hidden test divs');
    const hiddenCommentGone = !htmlAfterComments.includes('<!-- Hidden test divs');
    if (testResult('Hidden divs comment removed', hadHiddenComment && hiddenCommentGone)) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 2: Picture Placeholder Replacement
    // eslint-disable-next-line no-console
    console.log(`${BLUE}2️⃣  Picture Placeholder Replacement${NC}`);
    totalTests += 1;

    const htmlAfterPlaceholder = replacePicturePlaceholder(htmlAfterComments);

    // Check that "Picture Here" was replaced
    const hadPictureHere = originalHtml.includes('<div>Picture Here</div>');
    const pictureHereGone = !htmlAfterPlaceholder.includes('<div>Picture Here</div>');
    if (testResult('Picture Here replaced', hadPictureHere && pictureHereGone)) {
      passedTests += 1;
    }

    // Verify image tag was inserted
    totalTests += 1;
    const hasImageTag = htmlAfterPlaceholder.includes('<img src="');
    const hasCorrectUrl = htmlAfterPlaceholder.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
    const hasCorrectAlt = htmlAfterPlaceholder.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT);
    if (testResult(
      'Image tag inserted',
      hasImageTag && hasCorrectUrl && hasCorrectAlt,
      `URL: ${hasCorrectUrl}, Alt: ${hasCorrectAlt}`,
    )) {
      passedTests += 1;
    }

    // Verify non-matching text preserved
    totalTests += 1;
    const hasSomeOtherText = htmlAfterPlaceholder.includes('<div>Some Other Text</div>');
    if (testResult('Non-matching text preserved', hasSomeOtherText)) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 3: Combined Processing (Both Functions)
    // eslint-disable-next-line no-console
    console.log(`${BLUE}3️⃣  Combined Processing${NC}`);
    totalTests += 1;

    // Apply all functions in sequence (as worker does)
    // CRITICAL ORDER: Transforms (ADD) first, removals (DELETE) last
    let processedHtml = originalHtml;
    processedHtml = replacePicturePlaceholder(processedHtml);
    processedHtml = injectJsonLd(processedHtml, 'allabout.network');
    processedHtml = injectSpeculationRules(processedHtml);
    processedHtml = removeNonSocialMetadata(processedHtml);
    processedHtml = removeHtmlComments(processedHtml);

    // Verify all transformations applied
    const commentsRemoved = !processedHtml.includes('<!--');
    const placeholderReplaced = !processedHtml.includes('<div>Picture Here</div>');
    const imageInserted = processedHtml.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
    const jsonLdInjected = processedHtml.includes('<script type="application/ld+json">');
    const speculationRulesInjected = processedHtml.includes('<script type="speculationrules">');
    const metadataRemoved = !processedHtml.includes('<meta name="author-url"')
      && !processedHtml.includes('<meta name="publication-date"')
      && !processedHtml.includes('<meta name="modified-date"')
      && !processedHtml.includes('<meta name="longdescription"')
      && !processedHtml.includes('<meta name="jsonld"');

    if (testResult(
      'All transformations applied',
      commentsRemoved && placeholderReplaced && imageInserted
        && jsonLdInjected && speculationRulesInjected && metadataRemoved,
    )) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 4: HTML Structure Integrity
    // eslint-disable-next-line no-console
    console.log(`${BLUE}4️⃣  HTML Structure Integrity${NC}`);

    totalTests += 1;
    const hasDoctype = processedHtml.includes('<!DOCTYPE html>');
    if (testResult('DOCTYPE preserved', hasDoctype)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasHtmlTag = processedHtml.includes('<html') && processedHtml.includes('</html>');
    if (testResult('HTML tags preserved', hasHtmlTag)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasHead = processedHtml.includes('<head>') && processedHtml.includes('</head>');
    if (testResult('Head section preserved', hasHead)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasBody = processedHtml.includes('<body>') && processedHtml.includes('</body>');
    if (testResult('Body section preserved', hasBody)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasAuthorMeta = processedHtml.includes('<meta name="author"');
    if (testResult('Author meta tag preserved', hasAuthorMeta)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasJsonLdScript = processedHtml.includes('<script type="application/ld+json">');
    if (testResult('JSON-LD script injected', hasJsonLdScript)) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 5: Metadata Cleanup
    // eslint-disable-next-line no-console
    console.log(`${BLUE}5️⃣  Metadata Cleanup${NC}`);

    totalTests += 1;
    const authorUrlRemoved = !processedHtml.includes('<meta name="author-url"');
    if (testResult('author-url removed', authorUrlRemoved)) {
      passedTests += 1;
    }

    totalTests += 1;
    const pubDateRemoved = !processedHtml.includes('<meta name="publication-date"');
    if (testResult('publication-date removed', pubDateRemoved)) {
      passedTests += 1;
    }

    totalTests += 1;
    const modDateRemoved = !processedHtml.includes('<meta name="modified-date"');
    if (testResult('modified-date removed', modDateRemoved)) {
      passedTests += 1;
    }

    totalTests += 1;
    const longDescRemoved = !processedHtml.includes('<meta name="longdescription"');
    if (testResult('longdescription removed', longDescRemoved)) {
      passedTests += 1;
    }

    totalTests += 1;
    const jsonldMetaRemoved = !processedHtml.includes('<meta name="jsonld"');
    if (testResult('jsonld meta tag removed', jsonldMetaRemoved)) {
      passedTests += 1;
    }

    totalTests += 1;
    const authorKept = processedHtml.includes('name="author"');
    const linkedinKept = processedHtml.includes('name="linkedin"');
    if (testResult('Social meta tags kept', authorKept && linkedinKept)) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 6: Speculation Rules
    // eslint-disable-next-line no-console
    console.log(`${BLUE}6️⃣  Speculation Rules${NC}`);

    totalTests += 1;
    const hasSpeculationScript = processedHtml.includes('<script type="speculationrules">');
    if (testResult('Speculation rules script injected', hasSpeculationScript)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasPrerender = processedHtml.includes('"prerender"');
    const hasPrefetch = processedHtml.includes('"prefetch"');
    if (testResult('Rules contain prerender and prefetch', hasPrerender && hasPrefetch)) {
      passedTests += 1;
    }

    totalTests += 1;
    const hasEagerness = processedHtml.includes('"eagerness": "moderate"');
    if (testResult('Rules have moderate eagerness', hasEagerness)) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Test 7: Output Analysis
    // eslint-disable-next-line no-console
    console.log(`${BLUE}7️⃣  Output Analysis${NC}`);

    totalTests += 1;
    const originalSize = originalHtml.length;
    const processedSize = processedHtml.length;
    const difference = processedSize - originalSize;
    const differencePercent = ((difference / originalSize) * 100).toFixed(2);

    // eslint-disable-next-line no-console
    console.log(`${YELLOW}Original size: ${originalSize} bytes${NC}`);
    // eslint-disable-next-line no-console
    console.log(`${YELLOW}Processed size: ${processedSize} bytes${NC}`);
    // eslint-disable-next-line no-console
    const diffSign = difference > 0 ? '+' : '';
    // eslint-disable-next-line no-console
    console.log(
      `${YELLOW}Difference: ${diffSign}${difference} bytes (${differencePercent}%)${NC}`,
    );

    // We inject JSON-LD (adds content) and remove comments + metadata (removes content)
    // Net result varies: JSON-LD adds ~500 bytes, but metadata/comments removal can offset this
    // The test validates that processing occurred (size changed)
    if (testResult(
      'Content transformed (size changed)',
      processedSize !== originalSize,
      `${diffSign}${difference} bytes (JSON-LD added, metadata/comments removed)`,
    )) {
      passedTests += 1;
    }
    // eslint-disable-next-line no-console
    console.log();

    // Summary
    // eslint-disable-next-line no-console
    console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
    if (passedTests === totalTests) {
      // eslint-disable-next-line no-console
      console.log(`${GREEN}✓ ALL TESTS PASSED${NC}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${RED}✗ SOME TESTS FAILED${NC}`);
    }
    // eslint-disable-next-line no-console
    console.log(`${BLUE}Tests: ${passedTests}/${totalTests} passed${NC}`);
    // eslint-disable-next-line no-console
    console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
    // eslint-disable-next-line no-console
    console.log();

    // Write processed HTML for inspection
    const outputPath = join(__dirname, '../test-rendered.html');
    const fs = await import('fs');
    fs.writeFileSync(outputPath, processedHtml, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`${GREEN}✓ Processed HTML written to: test-rendered.html${NC}`);
    // eslint-disable-next-line no-console
    console.log(`${YELLOW}💡 Compare with test.html to verify transformations${NC}`);

    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`${RED}✗ Error running tests:${NC}`, error.message);
    // eslint-disable-next-line no-console
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runTests();
