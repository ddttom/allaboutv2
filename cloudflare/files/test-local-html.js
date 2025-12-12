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
  PICTURE_PLACEHOLDER_CONFIG,
} from './cloudflare-worker.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m'; // No Color

function testResult(name, passed, message) {
  const icon = passed ? '✓' : '✗';
  const color = passed ? GREEN : RED;
  console.log(`${color}${icon} ${name}${NC}${message ? `: ${message}` : ''}`);
  return passed;
}

async function runTests() {
  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
  console.log(`${BLUE}🧪 LOCAL HTML PROCESSING TEST${NC}`);
  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
  console.log();

  let totalTests = 0;
  let passedTests = 0;

  try {
    // Read the actual test.html file
    const testHtmlPath = join(__dirname, '../test.html');
    console.log(`${YELLOW}📄 Reading test.html...${NC}`);
    const originalHtml = readFileSync(testHtmlPath, 'utf-8');
    console.log(`${GREEN}✓ Loaded ${originalHtml.length} characters${NC}`);
    console.log();

    // Test 1: HTML Comment Removal
    console.log(`${BLUE}1️⃣  HTML Comment Removal${NC}`);
    totalTests++;

    const htmlAfterComments = removeHtmlComments(originalHtml);

    // Check that comments are removed
    const hasComments = htmlAfterComments.includes('<!--');
    if (testResult('Comments removed', !hasComments)) {
      passedTests++;
    }

    // Verify specific comments are gone
    totalTests++;
    const hadTriggerComment = originalHtml.includes('<!-- Trigger JSON-LD generation -->');
    const triggerCommentGone = !htmlAfterComments.includes('<!-- Trigger JSON-LD generation -->');
    if (testResult('Trigger comment removed', hadTriggerComment && triggerCommentGone)) {
      passedTests++;
    }

    totalTests++;
    const hadHiddenComment = originalHtml.includes('<!-- Hidden test divs');
    const hiddenCommentGone = !htmlAfterComments.includes('<!-- Hidden test divs');
    if (testResult('Hidden divs comment removed', hadHiddenComment && hiddenCommentGone)) {
      passedTests++;
    }
    console.log();

    // Test 2: Picture Placeholder Replacement
    console.log(`${BLUE}2️⃣  Picture Placeholder Replacement${NC}`);
    totalTests++;

    const htmlAfterPlaceholder = replacePicturePlaceholder(htmlAfterComments);

    // Check that "Picture Here" was replaced
    const hadPictureHere = originalHtml.includes('<div>Picture Here</div>');
    const pictureHereGone = !htmlAfterPlaceholder.includes('<div>Picture Here</div>');
    if (testResult('Picture Here replaced', hadPictureHere && pictureHereGone)) {
      passedTests++;
    }

    // Verify image tag was inserted
    totalTests++;
    const hasImageTag = htmlAfterPlaceholder.includes('<img src="');
    const hasCorrectUrl = htmlAfterPlaceholder.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);
    const hasCorrectAlt = htmlAfterPlaceholder.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_ALT);
    if (testResult(
      'Image tag inserted',
      hasImageTag && hasCorrectUrl && hasCorrectAlt,
      `URL: ${hasCorrectUrl}, Alt: ${hasCorrectAlt}`,
    )) {
      passedTests++;
    }

    // Verify non-matching text preserved
    totalTests++;
    const hasSomeOtherText = htmlAfterPlaceholder.includes('<div>Some Other Text</div>');
    if (testResult('Non-matching text preserved', hasSomeOtherText)) {
      passedTests++;
    }
    console.log();

    // Test 3: Combined Processing (Both Functions)
    console.log(`${BLUE}3️⃣  Combined Processing${NC}`);
    totalTests++;

    // Apply both functions in sequence (as worker does)
    let processedHtml = originalHtml;
    processedHtml = replacePicturePlaceholder(processedHtml);
    processedHtml = removeHtmlComments(processedHtml);

    // Verify both transformations applied
    const commentsRemoved = !processedHtml.includes('<!--');
    const placeholderReplaced = !processedHtml.includes('<div>Picture Here</div>');
    const imageInserted = processedHtml.includes(PICTURE_PLACEHOLDER_CONFIG.IMAGE_URL);

    if (testResult(
      'Both transformations applied',
      commentsRemoved && placeholderReplaced && imageInserted,
    )) {
      passedTests++;
    }
    console.log();

    // Test 4: HTML Structure Integrity
    console.log(`${BLUE}4️⃣  HTML Structure Integrity${NC}`);

    totalTests++;
    const hasDoctype = processedHtml.includes('<!DOCTYPE html>');
    if (testResult('DOCTYPE preserved', hasDoctype)) {
      passedTests++;
    }

    totalTests++;
    const hasHtmlTag = processedHtml.includes('<html') && processedHtml.includes('</html>');
    if (testResult('HTML tags preserved', hasHtmlTag)) {
      passedTests++;
    }

    totalTests++;
    const hasHead = processedHtml.includes('<head>') && processedHtml.includes('</head>');
    if (testResult('Head section preserved', hasHead)) {
      passedTests++;
    }

    totalTests++;
    const hasBody = processedHtml.includes('<body>') && processedHtml.includes('</body>');
    if (testResult('Body section preserved', hasBody)) {
      passedTests++;
    }

    totalTests++;
    const hasMetaTags = processedHtml.includes('<meta name="jsonld"');
    if (testResult('Meta tags preserved', hasMetaTags)) {
      passedTests++;
    }
    console.log();

    // Test 5: Size Reduction
    console.log(`${BLUE}5️⃣  Output Analysis${NC}`);

    totalTests++;
    const originalSize = originalHtml.length;
    const processedSize = processedHtml.length;
    const reduction = originalSize - processedSize;
    const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);

    console.log(`${YELLOW}Original size: ${originalSize} bytes${NC}`);
    console.log(`${YELLOW}Processed size: ${processedSize} bytes${NC}`);
    console.log(`${YELLOW}Reduction: ${reduction} bytes (${reductionPercent}%)${NC}`);

    if (testResult('Size reduced', processedSize < originalSize, `${reduction} bytes saved`)) {
      passedTests++;
    }
    console.log();

    // Summary
    console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
    if (passedTests === totalTests) {
      console.log(`${GREEN}✓ ALL TESTS PASSED${NC}`);
    } else {
      console.log(`${RED}✗ SOME TESTS FAILED${NC}`);
    }
    console.log(`${BLUE}Tests: ${passedTests}/${totalTests} passed${NC}`);
    console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}`);
    console.log();

    // Write processed HTML for inspection
    const outputPath = join(__dirname, '../test-rendered.html');
    const fs = await import('fs');
    fs.writeFileSync(outputPath, processedHtml, 'utf-8');
    console.log(`${GREEN}✓ Processed HTML written to: test-rendered.html${NC}`);
    console.log(`${YELLOW}💡 Compare with test.html to verify transformations${NC}`);

    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (error) {
    console.error(`${RED}✗ Error running tests:${NC}`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runTests();
