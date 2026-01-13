import fs from 'fs';
import path from 'path';

// Configuration
const CONFIG = {
  BASE_URL: 'https://allabout.network/invisible-users/',
  INPUT_DIR: 'invisible-users',
  OUTPUT_FILE: 'invisible-users/sitemap.xml',
  FILE_PATTERNS: ['.html', '.pdf'],
};

// Priority and changefreq rules for specific files
const RULES = {
  'index.html': { priority: 1.0, changefreq: 'monthly' },
  'appendix-index.html': { priority: 1.0, changefreq: 'monthly' },
  'news.html': { priority: 0.9, changefreq: 'weekly' },
  'faq.html': { priority: 0.9, changefreq: 'monthly' },
  'for-reviewers.html': { priority: 0.8, changefreq: 'monthly' },
  'notebook.html': { priority: 0.8, changefreq: 'monthly' },
  'the-invisible-users.pdf': { priority: 1.0, changefreq: 'monthly' },
};

// Default rules for files not explicitly listed
const DEFAULT_RULES = { priority: 0.7, changefreq: 'yearly' };

// Appendix pattern rules
const APPENDIX_RULES = { priority: 0.8, changefreq: 'monthly' };

/**
 * Get file metadata (priority and changefreq) based on filename
 * @param {string} filename - The name of the file
 * @returns {Object} Object with priority and changefreq
 */
function getFileMetadata(filename) {
  // Check for exact match in RULES
  if (RULES[filename]) {
    return RULES[filename];
  }

  // Check for appendix pattern (appendix-a.html through appendix-l.html)
  const appendixPattern = /^appendix-[a-l]\.html$/;
  if (appendixPattern.test(filename)) {
    return APPENDIX_RULES;
  }

  // Return default rules
  return DEFAULT_RULES;
}

/**
 * Get last modified date from file system
 * @param {string} filepath - Full path to the file
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
function getLastModDate(filepath) {
  try {
    const stats = fs.statSync(filepath);
    const date = new Date(stats.mtime);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Could not get modification date for ${filepath}, using current date`);
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Generate XML sitemap from entries array
 * @param {Array} entries - Array of entry objects with url, lastmod, changefreq, priority
 * @returns {string} Complete XML sitemap string
 */
function generateSitemapXML(entries) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  entries.forEach((entry) => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';
  return xml;
}

/**
 * Scan directory for HTML and PDF files
 * @returns {Array} Array of filenames (not full paths)
 */
function scanDirectory() {
  try {
    const files = fs.readdirSync(CONFIG.INPUT_DIR);

    return files.filter((file) => {
      // Skip hidden files
      if (file.startsWith('.')) {
        return false;
      }

      // Check if it's a file (not directory)
      const filepath = path.join(CONFIG.INPUT_DIR, file);
      const stats = fs.statSync(filepath);
      if (!stats.isFile()) {
        return false;
      }

      // Check if file extension matches our patterns
      return CONFIG.FILE_PATTERNS.some((pattern) => file.endsWith(pattern));
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error reading directory ${CONFIG.INPUT_DIR}:`, error.message);
    return [];
  }
}

/**
 * Main function to generate sitemap
 */
function main() {
  // eslint-disable-next-line no-console
  console.log('🗺️  Generating sitemap for invisible-users folder...\n');

  // Scan directory for files
  const files = scanDirectory();

  if (files.length === 0) {
    // eslint-disable-next-line no-console
    console.log('⚠️  No HTML or PDF files found in invisible-users folder');
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Found ${files.length} files:\n`);

  // Build entries array
  const entries = [];

  files.forEach((filename) => {
    const filepath = path.join(CONFIG.INPUT_DIR, filename);
    const metadata = getFileMetadata(filename);
    const lastmod = getLastModDate(filepath);

    const entry = {
      url: CONFIG.BASE_URL + filename,
      lastmod,
      changefreq: metadata.changefreq,
      priority: metadata.priority,
    };

    entries.push(entry);

    // eslint-disable-next-line no-console
    console.log(`  ✓ ${filename} (priority: ${metadata.priority}, changefreq: ${metadata.changefreq})`);
  });

  // Sort entries by priority (descending), then by filename
  entries.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.url.localeCompare(b.url);
  });

  // Generate XML
  const xml = generateSitemapXML(entries);

  // Write to file
  try {
    fs.writeFileSync(CONFIG.OUTPUT_FILE, xml, 'utf8');
    // eslint-disable-next-line no-console
    console.log(`\n✅ Sitemap generated successfully: ${CONFIG.OUTPUT_FILE}`);
    // eslint-disable-next-line no-console
    console.log(`   ${entries.length} URLs included`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('\n❌ Error writing sitemap file:', error.message);
    process.exit(1);
  }
}

// Run main function
main();
