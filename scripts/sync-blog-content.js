#!/usr/bin/env node
/**
 * Sync Blog Content Utility
 *
 * Finds and updates all llms.txt and my-blog.json files in the project.
 * Fetches latest content from query-index.json and updates files based on lastModified dates.
 *
 * Usage:
 *   node scripts/sync-blog-content.js --target=llms    # Update all llms.txt files
 *   node scripts/sync-blog-content.js --target=blog    # Update all my-blog.json files
 *   node scripts/sync-blog-content.js --target=all     # Update both (default)
 *
 * IMPORTANT: This script does NOT generate latestPosts arrays in my-blog.json files.
 * The view-myblog block automatically generates latestPosts from the 3 most recent posts.
 * DO NOT manually add latestPosts to my-blog.json - it defeats auto-generation.
 */

import * as fs from 'fs';
import * as path from 'path';

const QUERY_INDEX_URL = 'https://allabout.network/query-index.json';

/**
 * Fetch query-index.json from the site
 */
async function fetchQueryIndex() {
  console.log(`📥 Fetching ${QUERY_INDEX_URL}...`);

  try {
    const response = await fetch(QUERY_INDEX_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.data?.length || 0} entries\n`);
    return data.data || [];
  } catch (error) {
    console.error(`❌ Failed to fetch query-index.json:`, error);
    throw error;
  }
}

/**
 * Extract last-updated date from llms.txt content
 */
function extractLlmsTxtDate(content) {
  const versionMatch = content.match(/\*\*Version:\*\*\s*([\d.]+)/);
  const dateMatch = content.match(/\*\*Last updated:\*\*\s*(\w+\s+\d{4})|Updated:\s*(\w+\s+\d+,?\s+\d{4})/i);

  let lastUpdated = '2025-01-01'; // Default fallback

  if (dateMatch) {
    const dateStr = dateMatch[1] || dateMatch[2];
    // Convert "November 2025" or "Nov 25 2025" to ISO date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      lastUpdated = date.toISOString().split('T')[0];
    }
  }

  return {
    lastUpdated,
    version: versionMatch ? versionMatch[1] : '1.0'
  };
}

/**
 * Determine folder context from file path
 */
function getFolderContext(filePath) {
  const dirname = path.dirname(filePath);
  const parts = dirname.split(path.sep);

  // Root files have site-wide scope
  if (parts.length <= 1 || dirname === '.') {
    return '';
  }

  // Use the final folder name as context
  return parts[parts.length - 1];
}

/**
 * Filter query index entries by folder context
 */
function filterByContext(entries, context, filePath) {
  if (!context) {
    return entries;
  }

  // Filter entries that match the URL path
  return entries.filter(entry => entry.path.includes(`/${context}/`));
}

/**
 * Filter new entries by date
 */
function filterNewEntries(entries, afterDate) {
  // Convert afterDate to Unix timestamp if it's an ISO date
  const afterTimestamp = afterDate.includes('-')
    ? Math.floor(new Date(afterDate).getTime() / 1000)
    : parseInt(afterDate);

  return entries.filter(entry => {
    if (!entry.lastModified) return false;
    // lastModified in query-index.json is a Unix timestamp (string)
    const entryTimestamp = parseInt(entry.lastModified);
    return entryTimestamp > afterTimestamp;
  });
}

/**
 * Create a new llms.txt structure from my-blog.json
 */
function createLlmsTxtFromBlogJson(blogJsonPath, context) {
  const blogJson = JSON.parse(fs.readFileSync(blogJsonPath, 'utf-8'));

  const lines = [];

  // Header
  lines.push(`# ${context === 'site-wide' ? 'Adobe Edge Delivery Services & AI Development Resources' : context.charAt(0).toUpperCase() + context.slice(1) + ' Resources'}`);
  lines.push('');
  lines.push('Technical documentation and educational resources.');
  lines.push('');
  lines.push(`**Last updated:** ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
  lines.push('**Authors:** Tom Cranstoun, Cate Nisbet');
  lines.push('');

  // Access Guidelines (optional, can be added if needed)

  // Build organized sections from my-blog.json
  blogJson.categories.forEach(category => {
    if (category.posts && category.posts.length > 0) {
      lines.push('');
      lines.push(`## ${category.name}`);
      lines.push('');

      category.posts.forEach(post => {
        const url = post.url.startsWith('http') ? post.url : `https://allabout.network${post.url}`;
        if (post.description) {
          lines.push(`- [${post.title}](${url}): ${post.description}`);
        } else {
          lines.push(`- [${post.title}](${url})`);
        }
      });
    }
  });

  return lines.join('\n');
}

/**
 * Update llms.txt file with new content
 */
async function updateLlmsTxt(filePath, queryIndex) {
  console.log(`\n📝 Processing: ${filePath}`);

  // Check if file exists
  let content;
  let metadata;
  let isNewFile = false;

  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found - will create new llms.txt`);

    // Check for corresponding my-blog.json
    const dir = path.dirname(filePath);
    const blogJsonPath = path.join(dir, 'my-blog.json');

    if (!fs.existsSync(blogJsonPath)) {
      console.log(`   ⚠️  No my-blog.json found at ${blogJsonPath}, skipping`);
      return;
    }

    // Create new llms.txt from my-blog.json
    const context = getFolderContext(filePath);
    content = createLlmsTxtFromBlogJson(blogJsonPath, context || 'site-wide');
    metadata = { lastUpdated: '2020-01-01', version: '1.0' };
    isNewFile = true;
  } else {
    content = fs.readFileSync(filePath, 'utf-8');
    metadata = extractLlmsTxtDate(content);
  }

  console.log(`   Last updated: ${metadata.lastUpdated}`);
  console.log(`   Current version: ${metadata.version}`);

  // Filter by context and date
  const context = getFolderContext(filePath);
  console.log(`   Folder context: ${context || 'site-wide'}`);

  let filteredEntries = filterByContext(queryIndex, context, filePath);
  const newEntries = filterNewEntries(filteredEntries, metadata.lastUpdated);

  console.log(`   New posts found: ${newEntries.length}`);

  if (newEntries.length === 0 && !isNewFile) {
    console.log(`   ✅ Already up to date`);
    return;
  }

  if (isNewFile && newEntries.length === 0) {
    // New file with no new entries beyond what's already in my-blog.json
    console.log(`   ✅ Created new file from my-blog.json`);
  }

  // List new posts that will be added
  console.log(`   📝 Adding ${newEntries.length} new posts:`);
  newEntries.slice(0, 5).forEach(entry => {
    console.log(`      - ${entry.title}`);
  });
  if (newEntries.length > 5) {
    console.log(`      ... and ${newEntries.length - 5} more`);
  }

  // Parse content into lines for processing
  const lines = content.split('\n');

  // Remove any existing "Recent Additions" sections (no longer needed in llms.txt)
  let i = 0;
  while (i < lines.length) {
    if (lines[i].includes('## Recent Additions')) {
      // Find the end of this section (next ## heading or end of file)
      let endIndex = i + 1;
      while (endIndex < lines.length && !lines[endIndex].startsWith('## ')) {
        endIndex++;
      }
      // Remove the section
      lines.splice(i, endIndex - i);
    } else {
      i++;
    }
  }

  // Update the version date in the header
  const updatedContent = lines.map(line => {
    if (line.startsWith('**Last updated:**')) {
      const now = new Date();
      const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return `**Last updated:** ${monthYear}`;
    }
    return line;
  }).join('\n');

  // Write updated content
  fs.writeFileSync(filePath, updatedContent, 'utf-8');

  if (isNewFile) {
    console.log(`   ✅ Created new file from my-blog.json with all content`);
  } else {
    console.log(`   ✅ Updated with ${newEntries.length} new posts`);
  }
}

/**
 * Create a new my-blog.json structure
 */
function createEmptyBlogJson(scope = '') {
  return {
    metadata: {
      'last-updated': '2020-01-01',
      ...(scope && { scope })
    },
    categoryMap: [
      {
        id: 'eds-integrations',
        name: 'EDS & Integrations',
        count: 0,
        description: 'Adobe Edge Delivery Services integrations and framework implementations'
      },
      {
        id: 'core-ai-llm',
        name: 'Core AI/LLM Topics',
        count: 0,
        description: 'AI fundamentals, language processing, and machine learning concepts'
      },
      {
        id: 'aem-cms',
        name: 'AEM / CMS Focus',
        count: 0,
        description: 'Adobe Experience Manager and content management systems'
      },
      {
        id: 'developer-guide-series',
        name: 'Developer Guide Series',
        count: 0,
        description: 'Comprehensive EDS development tutorials'
      },
      {
        id: 'content-creator-guide',
        name: 'Content Creator Guide',
        count: 0,
        description: 'Resources for content authors and editors'
      },
      {
        id: 'general-blog',
        name: 'General Blog & Tools',
        count: 0,
        description: 'General development topics, tools, and best practices'
      }
    ],
    categories: [
      { id: 'eds-integrations', name: 'EDS & Integrations', posts: [] },
      { id: 'core-ai-llm', name: 'Core AI/LLM Topics', posts: [] },
      { id: 'aem-cms', name: 'AEM / CMS Focus', posts: [] },
      { id: 'developer-guide-series', name: 'Developer Guide Series', posts: [] },
      { id: 'content-creator-guide', name: 'Content Creator Guide', posts: [] },
      { id: 'general-blog', name: 'General Blog & Tools', posts: [] }
    ]
  };
}

/**
 * Update my-blog.json file with new content
 */
async function updateMyBlogJson(filePath, queryIndex) {
  console.log(`\n📝 Processing: ${filePath}`);

  let data;
  let lastUpdated;
  let isNewFile = false;

  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found - creating new my-blog.json`);
    const context = getFolderContext(filePath);
    data = createEmptyBlogJson(context || 'site-wide');
    lastUpdated = '2020-01-01';
    isNewFile = true;
  } else {
    const content = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
    lastUpdated = data.metadata?.['last-updated'] || '2025-01-01';
  }

  console.log(`   Last updated: ${lastUpdated}`);

  // Filter by context and date
  const context = getFolderContext(filePath);
  console.log(`   Folder context: ${context || 'site-wide'}`);

  let filteredEntries = filterByContext(queryIndex, context, filePath);
  const newEntries = filterNewEntries(filteredEntries, lastUpdated);

  console.log(`   New posts found: ${newEntries.length}`);

  if (newEntries.length === 0 && !isNewFile) {
    console.log(`   ✅ Already up to date`);
    return;
  }

  if (isNewFile && newEntries.length === 0) {
    console.log(`   ⚠️  No entries found in query-index to populate new file`);
    console.log(`   Creating empty structure anyway...`);
  }

  // List new posts that will be added
  if (newEntries.length > 0) {
    console.log(`   📝 Adding ${newEntries.length} new posts to categories:`);
    newEntries.slice(0, 5).forEach(entry => {
      console.log(`      - ${entry.title}`);
    });
    if (newEntries.length > 5) {
      console.log(`      ... and ${newEntries.length - 5} more`);
    }
  }

  // Categorize new entries
  const categorizePosts = (entries) => {
    const categoryMap = new Map();

    entries.forEach(entry => {
      let categoryId = 'general-blog'; // default category

      // Simple categorization based on path
      if (entry.path.includes('/integrations/') || entry.path.includes('/eds/')) {
        categoryId = 'eds-integrations';
      } else if (entry.path.includes('/ai/')) {
        categoryId = 'core-ai-llm';
      } else if (entry.path.includes('/aem/') || entry.path.includes('/cms/')) {
        categoryId = 'aem-cms';
      } else if (entry.path.includes('/developer-guide/')) {
        categoryId = 'developer-guide-series';
      } else if (entry.path.includes('/content-creator/')) {
        categoryId = 'content-creator-guide';
      }

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, []);
      }
      categoryMap.get(categoryId).push(entry);
    });

    return categoryMap;
  };

  const categorizedEntries = categorizePosts(newEntries);

  // Add new posts to appropriate categories
  categorizedEntries.forEach((entries, categoryId) => {
    let category = data.categories.find(cat => cat.id === categoryId);

    // Create category if it doesn't exist
    if (!category) {
      const categoryNames = {
        'eds-integrations': 'EDS & Integrations',
        'core-ai-llm': 'Core AI/LLM Topics',
        'aem-cms': 'AEM / CMS Focus',
        'developer-guide-series': 'Developer Guide Series',
        'content-creator-guide': 'Content Creator Guide',
        'general-blog': 'General Blog & Tools',
      };

      category = {
        id: categoryId,
        name: categoryNames[categoryId] || categoryId,
        posts: [],
      };
      data.categories.push(category);
    }

    // Add new posts to category
    entries.forEach(entry => {
      const newPost = {
        title: entry.title,
        url: entry.path,
        description: entry.description || '',
        lastModified: entry.lastModified,
      };
      category.posts.push(newPost);
    });
  });

  // Update category counts in categoryMap
  if (data.categoryMap) {
    data.categoryMap.forEach(mapEntry => {
      const category = data.categories.find(cat => cat.id === mapEntry.id);
      if (category && category.posts) {
        mapEntry.count = category.posts.length;
      }
    });
  }

  // Update metadata
  data.metadata['last-updated'] = new Date().toISOString().split('T')[0];

  // Write updated JSON
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  if (isNewFile) {
    console.log(`   ✅ Created new file with ${newEntries.length} posts across ${categorizedEntries.size} categories`);
  } else {
    console.log(`   ✅ Updated with ${newEntries.length} new posts across ${categorizedEntries.size} categories`);
  }
}

/**
 * Recursively find files matching a filename
 */
function findFiles(filename, dir = '.') {
  const results = [];
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.claude'];

  function search(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          search(fullPath);
        }
      } else if (entry.isFile() && entry.name === filename) {
        results.push(fullPath);
      }
    }
  }

  search(dir);
  return results;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find(arg => arg.startsWith('--target='));
  const target = targetArg ? targetArg.split('=')[1] : 'all';

  console.log(`🚀 Sync Blog Content Utility`);
  console.log(`📋 Target: ${target}\n`);

  // Fetch query index
  let queryIndex;
  try {
    queryIndex = await fetchQueryIndex();
  } catch (error) {
    console.error('❌ Cannot proceed without query-index.json');
    process.exit(1);
  }

  // Update llms.txt files
  if (target === 'llms' || target === 'all') {
    console.log('\n' + '='.repeat(60));
    console.log('📄 Updating llms.txt files');
    console.log('='.repeat(60));

    const llmsFiles = findFiles('llms.txt');

    // Also check for my-blog.json files without paired llms.txt
    const blogFiles = findFiles('my-blog.json');
    const missingLlmsFiles = [];

    for (const blogFile of blogFiles) {
      const dir = path.dirname(blogFile);
      const expectedLlmsFile = path.join(dir, 'llms.txt');

      if (!llmsFiles.includes(expectedLlmsFile) && !fs.existsSync(expectedLlmsFile)) {
        missingLlmsFiles.push(expectedLlmsFile);
      }
    }

    const allLlmsFiles = [...new Set([...llmsFiles, ...missingLlmsFiles])];
    console.log(`\nFound ${llmsFiles.length} existing llms.txt file(s)`);
    if (missingLlmsFiles.length > 0) {
      console.log(`Found ${missingLlmsFiles.length} my-blog.json file(s) without paired llms.txt - will create them\n`);
    } else {
      console.log('');
    }

    for (const file of allLlmsFiles) {
      await updateLlmsTxt(file, queryIndex);
    }
  }

  // Update my-blog.json files
  if (target === 'blog' || target === 'all') {
    console.log('\n' + '='.repeat(60));
    console.log('📄 Updating my-blog.json files');
    console.log('='.repeat(60));

    const blogFiles = findFiles('my-blog.json');

    // Also check for llms.txt files without paired my-blog.json
    const llmsFiles = findFiles('llms.txt');
    const missingBlogFiles = [];

    for (const llmsFile of llmsFiles) {
      const dir = path.dirname(llmsFile);
      const expectedBlogFile = path.join(dir, 'my-blog.json');

      if (!blogFiles.includes(expectedBlogFile) && !fs.existsSync(expectedBlogFile)) {
        missingBlogFiles.push(expectedBlogFile);
      }
    }

    const allBlogFiles = [...new Set([...blogFiles, ...missingBlogFiles])];
    console.log(`\nFound ${blogFiles.length} existing my-blog.json file(s)`);
    if (missingBlogFiles.length > 0) {
      console.log(`Found ${missingBlogFiles.length} llms.txt file(s) without paired my-blog.json - will create them\n`);
    } else {
      console.log('');
    }

    for (const file of allBlogFiles) {
      await updateMyBlogJson(file, queryIndex);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Sync complete!');
  console.log('='.repeat(60) + '\n');
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
