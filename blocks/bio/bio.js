/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-absolute-path */
import { renderExpressions } from '/plusplus/plugins/expressions/src/expressions.js';

const BIO_CONFIG = {
  PLACEHOLDER_TEXT: 'picture here',
  DEFAULT_ALT_TEXT: 'Bio image',
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  CONFIG_URL: '/config/defaults.json',
};

// Cache for config data
let configCache = null;

/**
 * Fetch configuration value from config/defaults.json
 * @param {string} key - The configuration key to fetch (e.g., '$bio:defaultimage$')
 * @returns {Promise<string|null>} The configuration value or null if not found
 */
async function getConfigValue(key) {
  // Return from cache if available
  if (configCache) {
    const item = configCache.data.find((entry) => entry.Item === key);
    return item ? item.Value : null;
  }

  try {
    const response = await fetch(BIO_CONFIG.CONFIG_URL);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch config: ${response.status}`);
      return null;
    }

    configCache = await response.json();
    const item = configCache.data.find((entry) => entry.Item === key);
    return item ? item.Value : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching config:', error);
    return null;
  }
}

/**
 * Convert author name to profile URL slug
 * @param {string} name - The author name (e.g., "Tom Cranstoun")
 * @returns {string} The URL slug (e.g., "tom-cranstoun")
 */
function nameToSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Fetch author profile image from profile page
 * @param {string} authorName - The author name
 * @returns {Promise<string|null>} The profile image URL or null if not found
 */
async function getProfileImage(authorName) {
  if (!authorName) return null;

  try {
    const profileSlug = nameToSlug(authorName);
    const profileUrl = `https://allabout.network/profiles/${profileSlug}.json`;

    // eslint-disable-next-line no-console
    console.log(`Bio block - Fetching profile: ${profileUrl}`);

    const response = await fetch(profileUrl);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.log(`Bio block - Profile not found for ${authorName}`);
      return null;
    }

    const profile = await response.json();
    const imageItem = profile.data.find((entry) => entry.Item === '$profile:imagelink$');

    if (imageItem && imageItem.Value) {
      // eslint-disable-next-line no-console
      console.log(`Bio block - Found profile image: ${imageItem.Value}`);
      return imageItem.Value;
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Bio block - Error fetching profile:', error);
    return null;
  }
}

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  // Check the current block, not a global selector
  if (!block.classList.contains('hide-author')) {
    // Get all divs in the first row and find the actual first cell
    const firstRow = block.querySelector('div > div:first-child');
    if (!firstRow) return;

    // Get all immediate child divs (cells) in the first row
    const cells = Array.from(firstRow.querySelectorAll(':scope > div'));
    if (cells.length === 0) return;

    const firstCell = cells[0];

    // eslint-disable-next-line no-console
    console.log('Bio block - First cell content:', firstCell.textContent.trim());

    // Check for "Picture Here" placeholder text FIRST (before checking for links)
    const cellText = firstCell.textContent.trim().toLowerCase();
    // eslint-disable-next-line no-console
    console.log('Bio block - Checking placeholder. Cell text:', cellText, 'Expected:', BIO_CONFIG.PLACEHOLDER_TEXT, 'Match:', cellText === BIO_CONFIG.PLACEHOLDER_TEXT);

    if (cellText === BIO_CONFIG.PLACEHOLDER_TEXT) {
      // eslint-disable-next-line no-console
      console.log('Bio block - Replacing "Picture Here" with author profile image');

      // Get author name from meta tag
      const metaAuthor = document.querySelector('meta[name="author"]');
      const authorName = metaAuthor ? metaAuthor.getAttribute('content') : null;

      // Try to fetch profile image first
      let imageUrl = await getProfileImage(authorName);

      // Fall back to config default if profile image not found
      if (!imageUrl) {
        // eslint-disable-next-line no-console
        console.log('Bio block - Falling back to config default image');
        imageUrl = await getConfigValue('$bio:defaultimage$');
      }

      if (imageUrl) {
        // Create img element with fetched URL
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = authorName || BIO_CONFIG.DEFAULT_ALT_TEXT;

        // Replace first cell content with image
        firstCell.textContent = '';
        firstCell.appendChild(img);
      } else {
        // eslint-disable-next-line no-console
        console.error('Bio block - No image URL found (neither profile nor config)');
      }
    } else {
      // Check if the first cell contains a link to an image
      const link = firstCell.querySelector('a');
      if (link && link.href) {
        // Check if the link points to an image file
        const isImageLink = BIO_CONFIG.IMAGE_EXTENSIONS.some((ext) => link.href.toLowerCase().includes(ext));

        if (isImageLink) {
          // Create an img element to replace the link
          const img = document.createElement('img');
          img.src = link.href;

          // Check if link text is a URL (not a proper author name)
          const linkText = link.textContent || '';
          const isLinkTextUrl = linkText.startsWith('http://') || linkText.startsWith('https://');

          // Only use link text as alt if it's NOT a URL
          // If it's a URL, leave alt empty - author name will be extracted from meta tag
          img.alt = isLinkTextUrl ? '' : linkText || 'Bio image';

          // Replace the link with the image (atomic operation)
          link.replaceWith(img);
        }
      }
    }
    // Find the <img> element within the current block
    const imgElement = block.querySelector('img');

    let author = '';

    // Check if the <img> element has a non-empty alt attribute
    if (imgElement && imgElement.getAttribute('alt')) {
      author = imgElement.getAttribute('alt');
    }

    // If the alt attribute is empty or not present, fall back to the <meta> tag's author content
    if (!author) {
      const metaAuthor = document.querySelector('meta[name="author"]');
      if (metaAuthor) {
        author = metaAuthor.getAttribute('content');
      }
    }

    // Create a new <strong> element to hold the author name
    const authorElement = document.createElement('strong');
    authorElement.textContent = author;

    // Insert the author element as the last child of the current block
    block.appendChild(authorElement);
  }
  renderExpressions(document.querySelector('.bio-wrapper'));
}
