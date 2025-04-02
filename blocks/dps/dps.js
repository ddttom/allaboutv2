
/**
 * Dynamic Presentation System (DPS) Block
 * Transforms structured content from Google Docs tables into an interactive presentation
 * with features like image sequences, presenter notes, and timer controls.
 *
 * Key Features:
 * - Full-screen presentation mode with automatic viewport handling
 * - Keyboard-based navigation with support for image sequences
 * - Presenter notes with toggle functionality
 * - Timer with visual warning system
 * - Responsive design with print optimization
 * - Flexible iframe and image content support
 */

/**
 * Formats seconds into MM:SS display format for the presentation timer
 * This utility function is critical for the timer display and must remain
 * at module scope since it's used in both the initial footer template
 * and the timer update logic.
 * Format time in minutes:seconds
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (MM:SS)
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/* Configuration object for presentation settings
 * - Timer duration defaults to 25 minutes
 * - Slide transitions use 300ms for smooth animation
 * - Presenter notes start hidden by default
 * - Debug info tracking enabled by default
 */
const DPS_CONFIG = {
  TIMER_DURATION: 25 * 60,
  SLIDE_TRANSITION_MS: 300,
  PRESENTER_NOTES_VISIBLE: true,
  DEBUG_INFO: {
    enabled: true,
    slides: [],
    illustrations: [],
    events: []
  }
};

export default function decorate(block) {
  // Add dps-block class to the container for proper styling isolation
  block.classList.add('dps-block');

  // Add dps-block class to the container for proper styling isolation
  block.classList.add('dps-block')
    // Add styles for enhanced image sequence navigation
    addImageSequenceStyles();
  

  /* Force full viewport mode by removing existing page elements
   * This ensures the presentation takes up the entire screen without interference
   * from other page elements
   */
  const existingHeader = document.querySelector('header');
  const existingFooter = document.querySelector('footer');
  const existingMain = document.querySelector('main');
  
  if (existingHeader) existingHeader.style.display = 'none';
  if (existingFooter) existingFooter.style.display = 'none';
  if (existingMain) {
    existingMain.style.padding = '0';
    existingMain.style.margin = '0';
    existingMain.style.width = '100%';
    existingMain.style.maxWidth = '100%';
  }

  // Extract rows from the block (each row was a table row in the Google Doc)
  const rows = Array.from(block.children);

  // Initialize the state tracker
  initStateTracker();

  /* Validate minimum content requirements
   * Need at least configuration row and one slide row
   */
  if (rows.length < 2) {
    block.innerHTML =
      '<div class="dps-error">Error: DPS block requires at least a configuration row and one slide row.</div>';
    return;
  }

  // Extract presentation data from the rows
  const presentationData = parseRows(rows);

  /* Create the main presentation container
   * This will hold all presentation elements in a structured layout
   */
  const presentationContainer = document.createElement('div');
  presentationContainer.className = 'dps-container';

  /* Create header section with title and subtitle
   */
  const header = document.createElement('div');
  header.className = 'dps-header';
  header.innerHTML = `
    <div class="header-content">
      <h1 id="presentation-title">${presentationData.title}</h1>
      <p id="presentation-subtitle">${presentationData.subtitle || ''}</p>
    </div>
  `;

  /* Create slides container
   * This will hold all slides and handle their display/hide logic
   */
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';
  slidesContainer.id = 'slides-container';

  /* Create presenter notes container
   * Initially hidden, can be toggled with keyboard shortcuts
   */
  const presenterNotesContainer = document.createElement('div');
  presenterNotesContainer.className = 'presenter-notes hidden';
  presenterNotesContainer.innerHTML = `
    <div class="presenter-notes-title">
      <span>Presenter Notes (-)hide (+)show</span>
      <div class="resize-grip">↕</div>
    </div>
    <div class="presenter-notes-content"></div>
  `;
  
  /* Create footer section with navigation and timer
   * Navigation arrows provide visual controls for slide progression
   * Timer shows remaining presentation time
   * System Info button provides debug information
   */
  const footer = document.createElement('div');
  footer.className = 'dps-footer';
  footer.innerHTML = `
    <div class="footer-content">
      <div class="nav-arrows">
        <button class="nav-arrow prev-slide" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="nav-arrow next-slide" aria-label="Next slide">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
      <div class="timer">${formatTime(
        presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION
      )}</div>
      <div class="footer-buttons">
        <button class="presenter-toggle" aria-label="Toggle presenter view">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </button>
        <button class="system-info-button" aria-label="Copy system info">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Append all elements to the presentation container
  presentationContainer.appendChild(header);
  presentationContainer.appendChild(slidesContainer);
  presentationContainer.appendChild(presenterNotesContainer);
  presentationContainer.appendChild(footer);

  // Replace the block content with our presentation
  block.textContent = '';
  block.appendChild(presentationContainer);

  // Build slides from the parsed content
  buildSlides(presentationData.slides, slidesContainer);
  
  // Set up system info button
  setupSystemInfoButton();

  /* Set up presentation controls
   * Handles slide navigation, timer, and presenter notes functionality
   */
  // Initialize the timer duration
  window.remainingTime = presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION;
  
  // Set up the seamless navigation
  setupSeamlessControls();
  addSeamlessNavigationStyles();

  /* Force fullscreen mode immediately
   * This ensures the presentation starts in the correct display mode
   */
  document.body.classList.add('dps-fullscreen');
  window.scrollTo(0, 0);
}

/**
 * Parse rows from the block to extract presentation data
 * 
 * Expected row structure:
 * Row 1: Configuration (title, subtitle, timer duration)
 * Row 2+: Slides (title, intro text, bullet points, illustration, presenter notes)
 * 
 * @param {Array} rows - Array of row elements from the block
 * @returns {Object} Structured presentation data
 */
function parseRows(rows) {
  /* Extract configuration from first row
   * Contains title, subtitle, and timer duration
   */
  const configRow = rows[0].querySelector('div');
  const title = configRow.textContent.trim();
  const subtitle = rows[0].querySelector('div:nth-child(2)')?.textContent.trim() || '';
  const timerDuration = parseInt(rows[0].querySelector('div:nth-child(3)')?.textContent.trim() || '25', 10);

  // Process remaining rows as slides
  const slides = [];
  
  /* Process each slide row
   * Extracts and structures content for each slide
   */
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.children);
    
    /* Extract slide data from cells
     * Each cell contains specific content type
     */
    const slideTitle = cells[0]?.textContent.trim() || `Slide ${i}`;
    const introText = cells[1]?.textContent.trim() || '';
    
    /* Process bullet points from the third cell
     * Supports both bullet points and plain text
     */
    const bulletPointsCell = cells[2];
    const bulletPoints = [];
    
    if (bulletPointsCell) {
      /* Process bullet points and plain text
       * Splits content by line breaks and identifies content type
       */
      const bulletContent = bulletPointsCell.innerHTML;
      const bulletItems = bulletContent.split('<br>');
      
      bulletItems.forEach(item => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
          /* Identify content type:
           * - Plain text: No bullet markers
           * - HTML: Contains HTML tags
           * - Bullet points: Contains bullet markers
           */
          const isPlainText = !trimmedItem.includes('•') && !trimmedItem.includes('<li>');
          const isHTML = trimmedItem.includes('<') && trimmedItem.includes('>');
          
          bulletPoints.push({
            text: trimmedItem,
            isPlainText,
            isHTML
          });
        }
      });
    }
    
    /* Process illustration from the fourth cell
     * Supports images, SVGs, and iframes
     */
    const illustrationCell = cells[3];
    const illustration = parseIllustration(illustrationCell);
    
    // Log illustration discovery with timestamp
    if (illustration && DPS_CONFIG.DEBUG_INFO.enabled) {
      DPS_CONFIG.DEBUG_INFO.illustrations.push({
        slideTitle: slideTitle,
        slideIndex: i,
        type: illustration.type,
        timestamp: new Date().toISOString(),
        content: illustration.type === 'images' ?
          `${illustration.content.length} items` :
          'single item'
      });
    }
    
    /* Process presenter notes from the fifth cell
     * Supports HTML formatting for better organization
     */
    const presenterNotes = cells[4]?.innerHTML.trim() || '';
    
    // Add slide to the collection
    slides.push({
      title: slideTitle,
      introText,
      bulletPoints,
      illustration,
      presenterNotes
    });
  }
  
  /* Add a Q&A slide at the end
   * Provides a dedicated space for audience interaction
   */
  slides.push({
    type: 'qanda',
    title: 'Questions & Answers',
    subtitle: 'Your feedback and questions are valuable',
    thankYouText: 'Thank You For Your Attention'
  });
  
  return {
    title,
    subtitle,
    timerDuration,
    slides
  };
}

/**
 * Determines if a URL is an image based on its file extension
 * 
 * @param {string} url - URL to check
 * @returns {boolean} True if the URL appears to be an image
 */
function isImageUrl(url) {
  return url.match(new RegExp('\\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|tiff)($|\\?)', 'i')) !== null;
}

/**
 * Extract iframe content from a string
 * Supports multiple URL formats and HTML encodings
 * MODIFIED: Added support for iframe followed by anchor tags
 * 
 * @param {string} content - String containing iframe content
 * @returns {Object|null} Structured iframe data or null if no iframe found
 */
function extractIframeContent(content) {
  /* Check for iframe tag in various formats
   * Supports standard iframe tags, URL-only content, and HTML encoded content
   */
  const iframeMatch = content.match(new RegExp('<iframe[^>]*src=["\'](\\S*)["\'][^>]*>', 'i')) ||
                      content.match(new RegExp('<iframe[^>]*>([^<]*)</iframe>', 'i')) ||
                      content.match(new RegExp('<iframe\\s+([^>]*)>', 'i'));
  
  if (iframeMatch) {
    /* Extract src from iframe tag
     * Handles various URL formats and encodings
     */
    let src = '';
    if (iframeMatch[1]) {
      if (iframeMatch[1].includes('src=')) {
        const srcMatch = iframeMatch[1].match(new RegExp('src=["\'](\\S*)["\']', 'i'));
        if (srcMatch && srcMatch[1]) {
          src = srcMatch[1];
        }
      } else if (iframeMatch[1].startsWith('http')) {
        src = iframeMatch[1];
      } else if (iframeMatch[1].includes('http')) {
        const urlMatch = iframeMatch[1].match(new RegExp('(https?://[^\\s"\'<>]+)', 'i'));
        if (urlMatch) {
          src = urlMatch[0];
        }
      }
    }
    
    if (src) {
      return {
        type: 'iframe',
        src,
        content: `<iframe src="${src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
      };
    }
  }
  
  /* Check for simplified "iframe url" format
   * Makes it easier for authors to add iframes
   * This handles both standalone "iframe URL" and "iframe URL" within other content
   */
  const simpleIframeMatch = content.match(new RegExp('iframe\\s+(https?://[^\\s"\'<>]+)', 'i'));
  if (simpleIframeMatch && simpleIframeMatch[1]) {
    return {
      type: 'iframe',
      src: simpleIframeMatch[1],
      content: `<iframe src="${simpleIframeMatch[1]}\" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
    };
  }
  
  /* NEW: Check for iframe followed by anchor tag
   * This handles the format: iframe <a href="https://example.com">link text</a>
   */
  const iframeAnchorMatch = content.match(new RegExp('iframe\\s+<a[^>]*href=["\']([^"\']+)["\'][^>]*>.*?</a>', 'i'));
  if (iframeAnchorMatch && iframeAnchorMatch[1]) {
    const src = iframeAnchorMatch[1];
    return {
      type: 'iframe',
      src,
      content: `<iframe src="${src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
    };
  }
  
  /* We're not checking for plain URLs here anymore.
   * Plain URLs should be handled by the parseIllustration function,
   * which will determine if they are images or iframes based on the file extension.
   */
  
  return null;
}
/**
 * Extract URL from content
 * Used for identifying potential iframe or image sources
 * 
 * @param {string} content - String containing potential URL
 * @returns {Object|null} URL object with type and URL or null if no URL found
 */
function extractUrl(content) {
  // First check for URLs in anchor tags
  const anchorMatch = content.match(new RegExp('<a[^>]*href=["\'](\\S*)["\'][^>]*>(.*?)</a>', 'i'));
  if (anchorMatch && anchorMatch[1] && anchorMatch[1].startsWith('http')) {
    const url = anchorMatch[1];
    // Determine if this is an image URL or an iframe URL based on extension
    if (isImageUrl(url)) {
      return {
        type: 'image',
        url
      };
    } else {
      return {
        type: 'iframe',
        url
      };
    }
  }
  
  // Then check for raw URLs
  const urlMatches = content.match(new RegExp('(https?://[^\\s"\'<>]+)', 'gi'));
  if (urlMatches && urlMatches.length > 0) {
    const url = urlMatches[0]; // Use the first URL found
    // Determine if this is an image URL or an iframe URL based on extension
    if (isImageUrl(url)) {
      return {
        type: 'image',
        url
      };
    } else {
      return {
        type: 'iframe',
        url
      };
    }
  }
  
  return null;
}

/**
 * Extract icon name from class
 * Gets the specific icon name from the icon-* class
 * 
 * @param {string} className - Class string containing icon-name
 * @returns {string|null} The extracted icon name or null if not found
 */
function extractIconName(className) {
  const iconClassMatch = className.match(new RegExp('icon-([a-zA-Z0-9_-]+)'));
  if (iconClassMatch && iconClassMatch[1]) {
    return iconClassMatch[1];
  }
  return null;
}


function organizeImageSequence(illustrations) {
  if (!illustrations || !Array.isArray(illustrations)) return illustrations;
  
  // Debug log
  console.log(`[OrganizeSequence] Processing ${illustrations.length} illustrations`);
  
  // Deduplicate items - remove any duplicate references to the same content
  const uniqueIllustrations = [];
  const seen = new Set();
  
  illustrations.forEach(item => {
    // Create a unique identifier based on type and content
    let identifier;
    if (item.iconName) {
      identifier = `icon-${item.iconName}`;
    } else if (item.src) {
      identifier = `src-${item.src}`;
    } else if (item.content) {
      // Use a truncated version of content for ID if it's a string
      const contentId = typeof item.content === 'string' ? 
        item.content.substring(0, 50) : 
        JSON.stringify(item).substring(0, 50);
      identifier = `content-${contentId}`;
    } else {
      // Fallback to stringified object
      identifier = JSON.stringify(item).substring(0, 100);
    }
    
    // Only add if we haven't seen this item before
    if (!seen.has(identifier)) {
      seen.add(identifier);
      uniqueIllustrations.push(item);
      console.log(`[OrganizeSequence] Added unique item: ${item.type}${item.iconName ? ' - ' + item.iconName : ''}`);
    } else {
      console.log(`[OrganizeSequence] Skipped duplicate: ${item.type}${item.iconName ? ' - ' + item.iconName : ''}`);
    }
  });
  
  // Group items by type
  const groups = {};
  uniqueIllustrations.forEach(item => {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }
    groups[item.type].push(item);
  });
  
  // Define display order preference
  const orderPreference = ['icon', 'svg', 'image', 'picture', 'iframe'];
  
  // Create a new array with items ordered by group
  const orderedIllustrations = [];
  orderPreference.forEach(type => {
    if (groups[type]) {
      orderedIllustrations.push(...groups[type]);
    }
  });
  
  // Add any remaining types not in our preference list
  Object.keys(groups).forEach(type => {
    if (!orderPreference.includes(type)) {
      orderedIllustrations.push(...groups[type]);
    }
  });
  
  console.log(`[OrganizeSequence] Returning ${orderedIllustrations.length} unique illustrations`);
  return orderedIllustrations;
}


function createImageSequenceHTML(illustrations) {
  if (!illustrations || !Array.isArray(illustrations) || illustrations.length === 0) {
    return '';
  }
  
  let html = '<div class="image-sequence">';
  
  // Add each item to the sequence with appropriate styling
  illustrations.forEach((item, index) => {
    const isActive = index === 0 ? 'active' : '';
    const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    
    // Create container with label
    html += `<div class="sequence-item-container ${isActive}">`;
    
    // Always add label to show position in overall sequence
    html += `<div class="sequence-item-label">${typeLabel} ${index + 1}/${illustrations.length}</div>`;
    
    // Add the content based on type
    if (item.type === 'iframe') {
      html += `<div class="iframe-container sequence-image ${isActive}" style="width: 100%; height: 100%;">
          ${item.content}
        </div>`;
    } else if (item.type === 'picture') {
      html += `<div class="sequence-image ${isActive}">
          ${item.content}
        </div>`;
    } else if (item.type === 'svg') {
      html += `<div class="sequence-image ${isActive}">
          ${item.content}
        </div>`;
    } else if (item.type === 'icon') {
      html += `<img
          src="${item.content}"
          alt="${item.alt}"
          class="sequence-image icon-image ${isActive}"
          data-icon-name="${item.iconName}">`;
    } else if (item.type === 'image') {
      html += `<img
          src="${item.content}"
          alt="${item.alt || ''}"
          class="sequence-image ${isActive}">`;
    } else {
      html += `<div class="sequence-image text-container ${isActive}">
          ${item.content}
        </div>`;
    }
    
    html += '</div>'; // Close sequence-item-container
  });
  
  html += '</div>'; // Close image-sequence
  return html;
}

function addImageSequenceStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .sequence-item-container {
      position: absolute;
      width: 100%;
      height: 100%;
      visibility: hidden;
    }
    
    .sequence-item-container.active {
      visibility: visible;
    }
    
    .sequence-item-label {
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 2px 6px;
      font-size: 12px;
      border-radius: 0 0 4px 0;
      z-index: 5;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Parse illustration from a cell
 * Supports multiple content types: images, SVGs, iframes
 * FIXED: Properly handles illustration detection without double-counting
 *
 * @param {Element} cell - Cell element containing illustration content
 * @returns {Object|null} Structured illustration data or null if no illustration found
 */
function parseIllustration(cell) {
  if (!cell) return null;
  
  let illustrations = [];
  
  // Process HTML content directly from cell to capture all elements
  let cellContent = cell.innerHTML.trim();
  
  // Clean up content - remove lone <br> tags and whitespace
  cellContent = cellContent
    .replace(new RegExp('<p>\\s*<br>\\s*</p>', 'gi'), '') // Remove empty paragraphs with just <br>
    .replace(new RegExp('<br>\\s*(?=<)', 'gi'), '') // Remove <br> tags at start of elements
    .replace(new RegExp('\\s*<br>\\s*(?=\\w)', 'gi'), ' ') // Replace <br> followed by text with space
    .replace(new RegExp('\\s+', 'g'), ' ') // Collapse multiple whitespace
    .trim();
    
  // Debug log to check what's in the cell content
  console.log(`[Illustration Parser] Cell content: ${cellContent.substring(0, 100)}...`);
  
  // Create a mapping of original positions in the HTML to maintain order
  const contentPositions = [];
  
  // CRITICAL: Create a set to track processed illustrations by unique identifier
  // This prevents double-counting the same illustration
  const processedContent = new Set();
  
  // Handle simplified iframe format
  const iframeRegex = new RegExp('iframe\\s+(https?://[^\\s"\'<>]+)', 'gi');
  const iframeMatches = Array.from(cellContent.matchAll(iframeRegex));
  
  // Track iframe positions in the content
  for (const match of iframeMatches) {
    const url = match[1];
    const position = cellContent.indexOf(match[0]);
    // Create a unique identifier for this iframe
    const identifier = `iframe-${url}`;
    
    // Only add if we haven't processed this content before
    if (!processedContent.has(identifier)) {
      processedContent.add(identifier);
      
      contentPositions.push({
        type: 'iframe',
        position: position,
        data: {
          type: 'iframe',
          src: url,
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
        }
      });
    }
  }
  
  // Process icon spans - convert to image tags
  const iconRegex = new RegExp('<span\\s+class=["|\'][^"\']*icon[^"\']*["|\'][^>]*>.*?</span>', 'gi');
  const iconMatches = Array.from(cellContent.matchAll(iconRegex));
  
  // Track icon positions in the content
  for (const match of iconMatches) {
    const iconHtml = match[0];
    const position = cellContent.indexOf(iconHtml);
    const classMatch = iconHtml.match(new RegExp('class=["\'](\\S*)["\']', 'i'));
    
    if (classMatch && classMatch[1]) {
      const classString = classMatch[1];
      const iconName = extractIconName(classString);
      
      if (iconName) {
        // Create a unique identifier for this icon
        const identifier = `icon-${iconName}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'icon',
            position: position,
            data: {
              type: 'icon',
              iconName,
              content: `/icons/${iconName}.svg`,
              alt: `${iconName} Illustration`
            }
          });
        }
      }
    }
  }
  
  // Helper function to process an element and its children
  function processElement(element) {
    // If this is a paragraph, process both its text content and children
    if (element.tagName === 'P') {
      // Process each child of the paragraph
      Array.from(element.children).forEach(child => {
        processElement(child);
      });
      
      // Also check for direct span elements that might be icons
      const iconSpans = element.querySelectorAll('span.icon');
      if (iconSpans.length > 0) {
        // Process each icon span separately
        iconSpans.forEach(iconSpan => {
          const iconName = extractIconName(iconSpan.className);
          
          if (iconName) {
            // Create a unique identifier for this icon
            const identifier = `icon-${iconName}`;
            
            // Only add if we haven't processed this content before
            if (!processedContent.has(identifier)) {
              processedContent.add(identifier);
              
              // Calculate approximate position based on parent element position in original content
              const parentPosition = cellContent.indexOf(element.outerHTML);
              const elementPosition = parentPosition > -1 ? parentPosition : contentPositions.length * 1000;
              
              contentPositions.push({
                type: 'icon',
                position: elementPosition,
                data: {
                  type: 'icon',
                  iconName,
                  content: `/icons/${iconName}.svg`,
                  alt: `${iconName} Illustration`
                }
              });
            }
          }
        });
      }
      
      return;
    }
    
    // Create a temporary container to extract HTML content accurately
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(element.cloneNode(true));
    const elementHtml = tempContainer.innerHTML;
    
    // Get position of this element in the original content
    const elementPosition = cellContent.indexOf(elementHtml);
    
    // Process based on element type
    if (element.tagName === 'SVG' || elementHtml.includes('<svg')) {
      // Create a unique identifier for this SVG
      const identifier = `svg-${elementHtml.substring(0, 50)}`;
      
      // Only add if we haven't processed this content before
      if (!processedContent.has(identifier)) {
        processedContent.add(identifier);
        
        contentPositions.push({
          type: 'svg',
          position: elementPosition,
          data: {
            type: 'svg',
            content: elementHtml
          }
        });
      }
    }
    else if (element.tagName === 'PICTURE' || element.querySelector('picture')) {
      // Handle picture elements
      const picture = element.tagName === 'PICTURE' ? element : element.querySelector('picture');
      
      if (picture) {
        // Create a unique identifier for this picture
        const identifier = `picture-${picture.outerHTML.substring(0, 50)}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'picture',
            position: elementPosition,
            data: {
              type: 'picture',
              content: picture.outerHTML
            }
          });
        }
      }
    }
    else if (element.tagName === 'IMG' || element.querySelector('img:not(picture img)')) {
      // Handle img elements
      const img = element.tagName === 'IMG' ? element : element.querySelector('img:not(picture img)');
      
      if (img) {
        // Create a unique identifier for this image
        const identifier = `image-${img.src}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'image',
            position: elementPosition,
            data: {
              type: 'image',
              content: img.src,
              alt: img.alt || ''
            }
          });
        }
      }
    }
    else if (element.tagName === 'SPAN' && element.classList.contains('icon')) {
      // Handle icon spans - convert to image tags
      const iconName = extractIconName(element.className);
      
      if (iconName) {
        // Create a unique identifier for this icon
        const identifier = `icon-${iconName}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'icon',
            position: elementPosition,
            data: {
              type: 'icon',
              iconName,
              content: `/icons/${iconName}.svg`,
              alt: `${iconName} Illustration`
            }
          });
        }
      }
    }
    else if (element.tagName === 'A' && element.href) {
      // Handle anchor elements
      const url = element.href;
      
      if (isImageUrl(url)) {
        // Create a unique identifier for this image URL
        const identifier = `image-url-${url}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'image',
            position: elementPosition,
            data: {
              type: 'image',
              content: url,
              alt: element.textContent || 'Image'
            }
          });
        }
      } else {
        // Create a unique identifier for this iframe URL
        const identifier = `iframe-url-${url}`;
        
        // Only add if we haven't processed this content before
        if (!processedContent.has(identifier)) {
          processedContent.add(identifier);
          
          contentPositions.push({
            type: 'iframe',
            position: elementPosition,
            data: {
              type: 'iframe',
              src: url,
              content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
            }
          });
        }
      }
    }
    
    // Process children recursively
    Array.from(element.children).forEach(child => {
      processElement(child);
    });
  }
  
  // Process all direct text content in the cell
  if (cell.textContent.trim() && cell.childElementCount === 0) {
    const textContent = cell.textContent.trim();
    
    // Check if this contains an iframe anchor pattern
    const iframeAnchorMatch = textContent.match(/iframe\s+<a[^>]*href=["']([^"']+)["'][^>]*>/i);
    if (iframeAnchorMatch && iframeAnchorMatch[1]) {
      const url = iframeAnchorMatch[1];
      
      // Create a unique identifier for this iframe URL
      const identifier = `iframe-anchor-${url}`;
      
      // Only add if we haven't processed this content before
      if (!processedContent.has(identifier)) {
        processedContent.add(identifier);
        
        // Found iframe with anchor pattern
        contentPositions.push({
          type: 'iframe',
          position: 0,
          data: {
            type: 'iframe',
            src: url,
            content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
          }
        });
      }
    } else {
      // Otherwise check with extractUrl
      const urlData = extractUrl(textContent);
      if (urlData) {
        const url = urlData.url;
        
        if (urlData.type === 'image') {
          // Create a unique identifier for this image URL
          const identifier = `image-extracted-${url}`;
          
          // Only add if we haven't processed this content before
          if (!processedContent.has(identifier)) {
            processedContent.add(identifier);
            
            contentPositions.push({
              type: 'image',
              position: 0,
              data: {
                type: 'image',
                content: url,
                alt: 'Image'
              }
            });
          }
        } else if (urlData.type === 'iframe') {
          // Create a unique identifier for this iframe URL
          const identifier = `iframe-extracted-${url}`;
          
          // Only add if we haven't processed this content before
          if (!processedContent.has(identifier)) {
            processedContent.add(identifier);
            
            contentPositions.push({
              type: 'iframe',
              position: 0,
              data: {
                type: 'iframe',
                src: url,
                content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
              }
            });
          }
        }
      }
    }
  }
  
  // Process each top-level element
  const elements = Array.from(cell.children);
  for (const element of elements) {
    processElement(element);
  }
  
  // Sort all content by its original position in the DOM
  contentPositions.sort((a, b) => a.position - b.position);
  
  // Extract the sorted data into our illustrations array
  illustrations = contentPositions.map(item => item.data);

  // Return illustrations if found, null otherwise
  if (illustrations.length > 0) {
    console.log(`[ParseIllustration] Found ${illustrations.length} total illustrations (processed ${processedContent.size} unique items)`);
    return {
      type: 'images',
      content: illustrations
    };
  }

  return null;
}

/**
 * Build slides in the container
 * Creates and structures slide elements with their content
 * 
 * @param {Array} slides - Array of slide data objects
 * @param {Element} container - Container element for slides
 */
function buildSlides(slides, container) {
  container.innerHTML = '';
  
  // Clear previous slide debug info
  if (DPS_CONFIG.DEBUG_INFO.enabled) {
    DPS_CONFIG.DEBUG_INFO.slides = [];
  }
  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.id = `slide-${index}`;
    slideElement.className = 'slide';
    
    if (slide.presenterNotes) {
      slideElement.dataset.presenterNotes = slide.presenterNotes;
    }

    if (slide.type === 'qanda') {
      // Keep original Q&A slide handling
      slideElement.innerHTML = `
        <div class="slide-content">
          <h2 class="slide-title">${slide.title}</h2>
          <div class="slide-content-text">
            <p class="slide-subtitle">${slide.subtitle}</p>
          </div>
          <div class="illustration qanda-content">
            <div class="qanda-circle">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <circle cx="100" cy="100" r="90" fill="#3498db" stroke="white" stroke-width="4" />
                <text x="100" y="95" text-anchor="middle" fill="white" font-size="70" font-weight="bold">?</text>
                <text x="100" y="130" text-anchor="middle" fill="white" font-size="18" font-weight="bold">QUESTIONS</text>
              </svg>
            </div>
            <p class="thank-you-text">${slide.thankYouText || 'Thank You'}</p>
          </div>
        </div>
      `;
    } else {
      // Use enhanced slide content for regular slides
      slideElement.innerHTML = enhancedCreateSlideContent(slide);
    }

    // Log slide discovery with timestamp
    if (DPS_CONFIG.DEBUG_INFO.enabled) {
      DPS_CONFIG.DEBUG_INFO.slides.push({
        index,
        title: slide.title,
        type: slide.type || 'standard',
        hasIllustration: !!slide.illustration,
        timestamp: new Date().toISOString()
      });
    }
    
    container.appendChild(slideElement);
  });

}

/**
 * Create slide content with proper image sequence support
 * 
 * @param {Object} slide - Slide data
 * @returns {string} HTML content for the slide
 */
function createSlideContent(slide) {
  let slideContent = `<div class="slide-content">
    <h2 class="slide-title">${slide.title}</h2>
    <div class="slide-content-text">`;

  /* Add content text or bullet points */
  if (slide.introText) {
    slideContent += `<p style="font-size: 18px; margin-bottom: 20px;">${slide.introText}</p>`;
  }

  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    slideContent += '<ul class="bullet-list">';
    slide.bulletPoints.forEach((point) => {
      if (point.isPlainText) {
        /* Handle plain text or HTML content */
        if (point.isHTML) {
          if (point.text === '<br>') {
            slideContent += '<br>';
          } else {
            slideContent += `<li class="plain-text">${point.text}</li>`;
          }
        } else {
          slideContent += `<li class="plain-text">${point.text}</li>`;
        }
      } else {
        /* Handle bullet points */
        slideContent += `<li>${point.text}`;

        if (point.subPoints && point.subPoints.length > 0) {
          slideContent += '<ul class="sub-bullet-list">';
          point.subPoints.forEach((subPoint) => {
            slideContent += `<li>${subPoint}</li>`;
          });
          slideContent += '</ul>';
        }

        slideContent += '</li>';
      }
    });
    slideContent += '</ul>';
  }

  slideContent += '</div>'; // Close slide-content-text

  /* Add illustration if provided */
  if (slide.illustration) {
    slideContent += '<div class="illustration">';
    
    if (slide.illustration.type === 'images') {
      slideContent += '<div class="image-sequence">';
      
      // Properly handle multiple images in a sequence
      slide.illustration.content.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        
        if (item.type === 'iframe') {
          slideContent += `<div class="iframe-container sequence-image ${isActive}" style="width: 100%; height: 100%;">
              ${item.content}
            </div>`;
        } else if (item.type === 'picture') {
          slideContent += `<div class="sequence-image ${isActive}">
              ${item.content}
            </div>`;
        } else if (item.type === 'svg') {
          slideContent += `<div class="sequence-image ${isActive}">
              ${item.content}
            </div>`;
        } else if (item.type === 'icon') {
          // Convert icon to image tag with correct path
          slideContent += `<img
              src="${item.content}"
              alt="${item.alt}"
              class="sequence-image icon-image ${isActive}"
              data-icon-name="${item.iconName}">`;
        } else if (item.type === 'image') {
          slideContent += `<img
              src="${item.content}"
              alt="${item.alt || ''}"
              class="sequence-image ${isActive}">`;
        } else {
          slideContent += `<div class="sequence-image text-container ${isActive}">
              ${item.content}
            </div>`;
        }
      });
      
      slideContent += '</div>';
    } else if (slide.illustration.type === 'iframe') {
      slideContent += `<div class="iframe-container" style="width: 100%; height: 100%;">
          ${slide.illustration.content}
        </div>`;
    } else if (slide.illustration.type === 'svg') {
      slideContent += slide.illustration.content;
    } else if (slide.illustration.type === 'picture') {
      slideContent += slide.illustration.content;
    } else {
      slideContent += `<img src="${slide.illustration.content}" alt="${slide.title} illustration">`;
    }
    
    slideContent += '</div>'; // Close illustration
  }

  slideContent += '</div>'; // Close slide-content
  
  return slideContent;
}
// Store reference to the original function
const originalCreateSlideContent = createSlideContent;

// Create an enhanced version
function enhancedCreateSlideContent(slide) {
  // Get the basic slide content
  let slideContent = originalCreateSlideContent(slide);
  
  // If the slide has an illustration with multiple images, enhance it
  if (slide.illustration && slide.illustration.type === 'images' && 
      slide.illustration.content && slide.illustration.content.length > 1) {
    
    // Find the image sequence in the generated content
    const sequenceMatch = slideContent.match(/<div class="image-sequence">[\s\S]*?<\/div>/);
    if (sequenceMatch) {
      // Organize the illustrations by type
      const organizedIllustrations = organizeImageSequence(slide.illustration.content);
      
      // Create improved HTML for the image sequence
      const enhancedSequence = createImageSequenceHTML(organizedIllustrations);
      
      // Replace the original sequence with our enhanced version
      slideContent = slideContent.replace(sequenceMatch[0], enhancedSequence);
    }
  }
  
  return slideContent;
}

/**
 * Set up presentation controls
 * Handles slide navigation, timer, and presenter notes functionality
 *
 * @param {Element} slidesContainer - Container for all slides
 * @param {Element} presenterNotesContainer - Container for presenter notes
 * @param {number} timerDuration - Duration in seconds
 * @param {Object} config - Presentation configuration
 */
function setupControls(slidesContainer, presenterNotesContainer, timerDuration, config) {
  // Fix: Remove console.time calls that were causing issues
  let isNavigating = false; // Flag to prevent rapid consecutive navigations

  /**
   * Add the following CSS to the document to ensure proper image sequence behavior
   */
  function addImageSequenceCSS() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .sequence-image {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block !important;
        visibility: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }

      .sequence-image.active {
        visibility: visible !important;
      }
      
      /* Better slide transitions */
      .slide {
        transition: opacity 0.3s ease;
      }
      
      /* Ensure illustration container has proper positioning */
      .illustration {
        position: relative;
        min-height: 200px;
      }
      
      .image-sequence {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 200px;
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Add CSS for image sequences
  addImageSequenceCSS();

  /**
   * Initialize image sequences for a slide
   * Properly sets up all images with consistent visibility states
   *
   * @param {Element} slide - The slide element containing image sequences
   */
  /**
 * Initialize image sequences for a slide
 * Properly sets up all images with consistent visibility states
 *
 * @param {Element} slide - The slide element containing image sequences
 */
/**
 * Initialize image sequences for a slide with improved reliability
 *
 * @param {Element} slide - The slide element containing image sequences
 */
f/**
 * Initialize image sequence for a slide with robust state management
 * 
 * @param {Element} slide - The slide element containing image sequences
 */
function initializeImageSequence(slide) {
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Initializing image sequence`);
  
  const imageSequence = slide.querySelector('.image-sequence');
  if (!imageSequence) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] No image sequence found`);
    return;
  }
  
  const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
  if (images.length === 0) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] No images found in sequence`);
    return;
  }
  
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Found ${images.length} images in sequence`);
  
  // CRITICAL: Reset ALL images with both class and style properties
  // This ensures a consistent state across all browsers and prevents conflicts
  images.forEach((img, index) => {
    // Always keep display block, but hide with visibility
    img.style.display = 'block';
    img.style.visibility = 'hidden';
    img.classList.remove('active');
    
    // Ensure z-index is reset to avoid stacking context issues
    img.style.zIndex = '';
    
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Reset image ${index}`);
  });
  
  // CRITICAL: Activate ONLY the first image with both class and style
  images[0].classList.add('active');
  images[0].style.visibility = 'visible';
  
  // Force a small delay to ensure DOM updates are processed
  // This can help avoid race conditions in some browsers
  setTimeout(() => {
    // Double-check that our state is consistent
    const activeImages = imageSequence.querySelectorAll('.sequence-image.active');
    if (activeImages.length !== 1) {
      console.warn(`[ImageSequence] Inconsistent state detected after initialization. Active count: ${activeImages.length}`);
      
      // Force correction if needed
      if (activeImages.length > 1) {
        // Too many active images - fix it
        Array.from(activeImages).forEach((img, idx) => {
          if (idx > 0) {
            img.classList.remove('active');
            img.style.visibility = 'hidden';
          }
        });
      } else if (activeImages.length === 0) {
        // No active images - activate the first one
        images[0].classList.add('active');
        images[0].style.visibility = 'visible';
      }
    }
  }, 0);
  
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Activated first image`);
}
  const slides = slidesContainer.querySelectorAll('.slide');
  const notesContent = presenterNotesContainer.querySelector('.presenter-notes-content');
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');

  window.currentSlideIndex = 0;
  window.timerInterval = null;
  window.remainingTime = timerDuration;
  window.hasStartedTimer = false;

  /* Update navigation buttons state
   * Disables buttons when at first/last slide
   */
  function updateNavButtons() {
    if (prevButton) {
      prevButton.disabled = currentSlideIndex === 0;
    }
    if (nextButton) {
      nextButton.disabled = currentSlideIndex === slides.length - 1;
    }
  }

  /* Update presenter notes
   * Shows notes for current slide
   */
  function updatePresenterNotes(slideIndex, forceNormalMode = false, isPresenterToggle = false) {
    const currentSlide = slides[slideIndex];
    const slideData = currentSlide.dataset.presenterNotes || '';
    const presenterNotes = document.querySelector('.presenter-notes');
    
    // Always use normal mode content when forceNormalMode is true
    if (forceNormalMode) {
      // Normal mode - just show the notes
      notesContent.innerHTML = slideData;
      return; // Exit early to ensure we don't run the other logic
    }
    
    // Only show enhanced content for presenter mode (icon click), not for 'p' key (enlarged)
    if (presenterNotes.classList.contains('presenter-mode') && isPresenterToggle) {
      // Get the current slide content
      const slideTitle = currentSlide.querySelector('.slide-title')?.textContent || '';
      let bulletPointsHTML = '';
      
      // Get bullet points
      const bulletList = currentSlide.querySelector('.bullet-list');
      if (bulletList) {
        bulletPointsHTML = bulletList.outerHTML;
      }
      
      // Combine everything with an HR separator
      notesContent.innerHTML = `
        <h3>${slideTitle}</h3>
        ${bulletPointsHTML}
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ccc;">
        ${slideData}
      `;
    } else {
      // Normal mode - just show the notes
      notesContent.innerHTML = slideData;
    }
  }

  /**
   * Show a specific slide and properly initialize image sequences
   *
   * @param {number} index - Index of the slide to show
   */
/**
 * Show a specific slide and properly initialize image sequences
 *
 * @param {number} index - Index of the slide to show
 */
function showSlide(index) {
  console.log(`[Slide][${performance.now().toFixed(2)}ms] Showing slide ${index}`);
  
  // First hide all slides
  slides.forEach((slide, i) => {
    slide.style.display = 'none';
    slide.classList.remove('active');
    console.log(`[Slide][${performance.now().toFixed(2)}ms] Hide slide ${i}`);
  });
  
  // Show the target slide
  if (slides[index]) {
    const slide = slides[index];
    slide.style.display = 'block';
    slide.classList.add('active');
    
    console.log(`[Slide][${performance.now().toFixed(2)}ms] Displaying slide ${index}`);
    
    // Initialize any image sequence in this slide
    initializeImageSequence(slide);
    
    // Update presenter notes and navigation
    const presenterNotes = document.querySelector('.presenter-notes');
    const isInPresenterMode = presenterNotes.classList.contains('presenter-mode');
    updatePresenterNotes(index, false, isInPresenterMode);
    updateNavButtons();
  } else {
    console.log(`[Slide][${performance.now().toFixed(2)}ms] Slide ${index} not found`);
  }
  
  window.currentSlideIndex = index;
  
  // Start timer if moving past first slide
  if (index > 0 && !hasStartedTimer) {
    startTimer();
    hasStartedTimer = true;
  }
}

  /* Add click handlers for navigation buttons
   * Provides visual controls for slide progression
   */
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // First try to handle image sequence navigation, just like arrow keys
      const sequenceHandled = handleImageSequenceNavigation('prev');
      
      // If no sequence to navigate or at the beginning of sequence, go to previous slide
      if (!sequenceHandled && currentSlideIndex > 0) {
        showSlide(currentSlideIndex - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] Next button clicked`);
      
      // First try to handle image sequence navigation, just like arrow keys
      const sequenceHandled = handleImageSequenceNavigation('next');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] Next button: sequenceHandled = ${sequenceHandled}`);
      
      // If no sequence to navigate or at the end of sequence, go to next slide
      if (!sequenceHandled && currentSlideIndex < slides.length - 1) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG][${performance.now().toFixed(2)}ms] Next button: moving to next slide (${currentSlideIndex + 1})`);
        showSlide(currentSlideIndex + 1);
      }
    });
  }

 /**
 * Handle image sequence navigation with robust error handling and state tracking
 *
 * @param {string} direction - Direction to navigate ('prev' or 'next')
 * @returns {boolean} - True if navigation was handled within a sequence, false if we should move to next/prev slide
 */
function handleImageSequenceNavigation(direction) {
  // Debug logging
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Handling ${direction} navigation`);
   
  // Get the current slide
  const currentSlide = slides[currentSlideIndex];
  if (!currentSlide) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] No current slide found`);
    return false;
  }
   
  // Check if this slide has an image sequence
  const imageSequence = currentSlide.querySelector('.image-sequence');
  if (!imageSequence) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] No image sequence found in slide`);
    return false;
  }
   
  // Get all images in the sequence
  const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
  
  // Log the number of images found
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Found ${images.length} images in sequence`);
  
  // Single image case - don't handle sequence navigation
  // but still show label (handled in createImageSequenceHTML)
  if (images.length <= 1) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Only one image - not handling as sequence navigation`);
    return false;
  }
  
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Found ${images.length} images in sequence`);
  
  // Find which image is currently active
  let activeIndex = -1;
  images.forEach((img, idx) => {
    if (img.classList.contains('active')) {
      activeIndex = idx;
    }
  });
  
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Current activeIndex is ${activeIndex}`);
  
  // If no active image found, activate the first one
  if (activeIndex === -1) {
    console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] No active image found, activating first image`);
    
    // Reset all images first - using both class and style for consistency
    images.forEach(img => {
      img.classList.remove('active');
      img.style.visibility = 'hidden';
      img.style.display = 'block';
    });
    
    // Make the first image active - using both class and style
    images[0].classList.add('active');
    images[0].style.visibility = 'visible';
    return true;
  }
  
  // Calculate the next index based on direction
  let nextIndex;
  if (direction === 'next') {
    nextIndex = activeIndex + 1;
    // If at the end of the sequence, signal to move to next slide
    if (nextIndex >= images.length) {
      console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] At end of sequence, returning false to move to next slide`);
      return false;
    }
  } else { // 'prev'
    nextIndex = activeIndex - 1;
    // If at the beginning of the sequence, signal to move to previous slide
    if (nextIndex < 0) {
      console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] At beginning of sequence, returning false to move to prev slide`);
      return false;
    }
  }
  
  console.log(`[ImageSequence][${performance.now().toFixed(2)}ms] Moving to image index ${nextIndex}`);
  
  // Reset all images first - using both class and style for consistency
  images.forEach(img => {
    img.classList.remove('active');
    img.style.visibility = 'hidden';
    img.style.display = 'block';
  });
  
  // Make the target image active - using both class and style
  images[nextIndex].classList.add('active');
  images[nextIndex].style.visibility = 'visible';
  
  // Add a verification step to ensure the change took effect
  setTimeout(() => {
    const activeImages = imageSequence.querySelectorAll('.sequence-image.active');
    if (activeImages.length !== 1) {
      console.warn(`[ImageSequence] State inconsistency detected after navigation. Found ${activeImages.length} active images.`);
      
      // Force correction
      images.forEach((img, idx) => {
        const shouldBeActive = idx === nextIndex;
        img.classList.toggle('active', shouldBeActive);
        img.style.visibility = shouldBeActive ? 'visible' : 'hidden';
      });
    }
  }, 0);
  
  return true;
}

  /* Timer functionality
   * Handles countdown and warning system
   */

  function updateTimer() {
    if (window.remainingTime > 0) {
      window.remainingTime--;
      document.querySelector('.timer').textContent = formatTime(window.remainingTime);

      /* Flash warning when 2 minutes remain
       * Provides visual cue for time management
       */
      if (remainingTime === 120) {
        flashTimeWarning();
      }
    } else {
      clearInterval(timerInterval);
      document.querySelector('.timer').textContent = 'Time Up!';
      document.querySelector('.timer').style.color = '#e74c3c';
    }
  }

  function startTimer() {
    if (!window.timerInterval) {
      window.timerInterval = setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    if (window.timerInterval) {
      clearInterval(window.timerInterval);
      window.timerInterval = null;
    }
  }

  function toggleTimer() {
    if (window.timerInterval) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  /* Visual warning system for timer
   * Flashes red three times when time is running low
   */
  function flashTimeWarning() {
    const container = document.querySelector('.dps-container');
    let flashCount = 0;

    function singleFlash() {
      container.style.backgroundColor = '#e74c3c';

      setTimeout(() => {
        container.style.backgroundColor = '';
        flashCount++;

        if (flashCount < 3) {
          setTimeout(singleFlash, 300);
        }
      }, 300);
    }

    singleFlash();
  }
  
  // Add styles for image sequences
  const sequenceStyles = document.createElement('style');
  sequenceStyles.textContent = `
    .sequence-image {
      position: absolute;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block !important;
      /* Use visibility for show/hide, not display */
      transition: visibility 0ms;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }

    .sequence-image.active {
      visibility: visible !important;
    }
  `;
  document.head.appendChild(sequenceStyles);
  // Make presenter notes visible at startup
  presenterNotesContainer.classList.remove('hidden');
  config.PRESENTER_NOTES_VISIBLE = true;

/// ultra-compact styling for presenter notes

  const styleElement = document.createElement('style');
  styleElement.textContent = `
  /* Fix for paragraph spacing in presenter notes */
  .presenter-notes-content {
    line-height: 1;
  }
  
  .presenter-notes-content p {
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
  
  /* Add minimal spacing between paragraphs */
  .presenter-notes-content p + p {
    margin-top: 0.25em;
  }
  
  /* Ensure lists have proper spacing too */
  .presenter-notes-content ul,
  .presenter-notes-content ol {
    margin: 0.25em 0;
    padding-left: 1.2em;
  }

  .presenter-notes-content li {
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
`;
  document.head.appendChild(styleElement);


  let isPresenterMode = false;
  let isExpandedMode = false;
  let isResizing = false;
  let startY, startHeight;

  function setupResizeHandler() {
    const grip = document.querySelector('.resize-grip');
    const notes = document.querySelector('.presenter-notes');
  
    grip.addEventListener('mousedown', (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = parseInt(document.defaultView.getComputedStyle(notes).height, 10);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const height = startHeight + (startY - e.clientY);
      notes.style.height = `${Math.max(200, Math.min(window.innerHeight - 60, height))}px`;
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });
}
  function togglePresenterMode() {
    isPresenterMode = !isPresenterMode;
    const header = document.querySelector('.dps-header');
    const footer = document.querySelector('.dps-footer');
    const slides = document.querySelectorAll('.slide');
    const currentSlide = slides[currentSlideIndex];
    const presenterNotes = document.querySelector('.presenter-notes');
    const presenterButton = document.querySelector('.presenter-toggle');
    const notesContent = presenterNotes.querySelector('.presenter-notes-content');
  
    if (isPresenterMode) {
      // Hide header and slides but keep footer
      header.style.display = 'none';
      slides.forEach(slide => slide.style.display = 'none');
      currentSlide.style.display = 'none';
      
      // Highlight presenter button
      presenterButton.classList.add('active');
    
      // Show notes in full screen
      presenterNotes.classList.remove('hidden');
      presenterNotes.classList.add('presenter-mode');
    
      if (isExpandedMode) {
        // Expanded view (2/3 of screen) - stay pinned to left
        presenterNotes.style.width = '66%';
        presenterNotes.style.left = '20px'; // Keep pinned to left
        presenterNotes.style.height = 'calc(100vh - 60px)';
        presenterNotes.style.position = 'fixed';
        presenterNotes.style.top = '0';
        presenterNotes.style.zIndex = '1000';
        presenterNotes.style.backgroundColor = 'white';
        presenterNotes.style.padding = '20px';
        presenterNotes.style.overflow = 'auto';
        presenterNotes.style.transform = 'none'; // Override the CSS transform
        notesContent.style.transform = 'none';
      } else {
        // Normal view - stay pinned to left
        presenterNotes.style.width = '50%'; // Reduced from 100% to stay on left side
        presenterNotes.style.left = '20px'; // Keep pinned to left
        presenterNotes.style.height = 'calc(100vh - 60px)';
        presenterNotes.style.position = 'fixed';
        presenterNotes.style.top = '0';
        presenterNotes.style.zIndex = '1000';
        presenterNotes.style.backgroundColor = 'white';
        presenterNotes.style.padding = '20px';
        presenterNotes.style.overflow = 'auto';
        
        // Update presenter notes content to show only notes
        updatePresenterNotes(currentSlideIndex, true, true); // Force normal mode, isPresenterToggle=true
      }
    
      // Update presenter notes content to include title and bullet points
      updatePresenterNotes(currentSlideIndex, false, true); // Pass isPresenterToggle=true
    } else {
      // Restore normal view
      header.style.display = '';
      slides.forEach(slide => slide.style.display = '');
      currentSlide.style.display = 'block';
      
      // Remove button highlight
      presenterButton.classList.remove('active');
    
      presenterNotes.classList.remove('presenter-mode');
      presenterNotes.style.width = '31.25vw'; // Original width from CSS
      presenterNotes.style.left = '20px'; // Keep pinned to left
      presenterNotes.style.height = '25vh'; // Original height from CSS
      presenterNotes.style.position = 'fixed';
      presenterNotes.style.top = '';
      presenterNotes.style.bottom = '60px'; // Position at bottom as in CSS
      presenterNotes.style.zIndex = '1000';
      presenterNotes.style.backgroundColor = '';
      presenterNotes.style.padding = '';
      presenterNotes.style.overflow = 'auto';
  }
}

  function toggleExpandedMode() {
    isExpandedMode = !isExpandedMode;
    const presenterNotes = document.querySelector('.presenter-notes');
    const notesContent = presenterNotes.querySelector('.presenter-notes-content');
  
    if (isExpandedMode) {
      // Switch to expanded view - stay pinned to left and grow to the right
      presenterNotes.style.width = '66%';
      presenterNotes.style.left = '20px'; // Keep pinned to left
    } else {
      // Switch back to normal view
      presenterNotes.style.width = '31.25vw'; // Original width from CSS
      presenterNotes.style.left = '20px'; // Keep pinned to left
  }
}

// Add click handler for presenter button
  const presenterButton = document.querySelector('.presenter-toggle');
  if (presenterButton) {
    presenterButton.addEventListener('click', togglePresenterMode);
  }

/* Add keyboard navigation
 * Supports slide progression, timer control, and presenter notes
 */
  document.addEventListener('keydown', (event) => {
    // Ignore repeated keydown events from key being held down
    if (event.repeat) {
      event.preventDefault();
      return;
    }
  
    // Use a variable to track if we handled the event
    let handled = false;
  
    if (event.key === 'Escape') {
      const navBar = document.querySelector('.dps-navigation');
      if (navBar) {
        navBar.style.display = navBar.style.display === 'none' ? 'flex' : 'none';
      }
      handled = true;
    } else if (event.key === 'p' || event.key === 'P') {
      const presenterNotes = document.querySelector('.presenter-notes');
      const notesContent = presenterNotes.querySelector('.presenter-notes-content');
      if (presenterNotes.classList.contains('enlarged')) {
        // Return to normal size
        presenterNotes.classList.remove('enlarged');
        presenterNotes.style.width = '31.25vw'; // Original width from CSS
        presenterNotes.style.height = '25vh'; // Original height from CSS
        presenterNotes.style.left = '20px'; // Keep pinned to left
        presenterNotes.style.zIndex = '';
        
        // Update presenter notes content to show only notes
        updatePresenterNotes(currentSlideIndex, true); // Force normal mode
      } else {
        // Enlarge while staying pinned to left
        presenterNotes.classList.remove('hidden');
        presenterNotes.classList.add('enlarged');
        presenterNotes.style.width = '50vw'; // Grow to the right
        presenterNotes.style.height = '50vh';
        presenterNotes.style.left = '20px'; // Keep pinned to left
        presenterNotes.style.zIndex = '1000';
        config.PRESENTER_NOTES_VISIBLE = true;
        
        // For 'p' key, just show the notes without title and bullets
        updatePresenterNotes(currentSlideIndex, false, false); // Pass isPresenterToggle=false
      }
      handled = true;
    }
  /* Toggle presenter notes with + and - keys
   * Provides quick access to presenter guidance
   */
    else if (event.key === '+' || event.key === '=') {
      presenterNotesContainer.classList.remove('hidden');
      config.PRESENTER_NOTES_VISIBLE = true;
      event.preventDefault();
      handled = true;
    }
    else if (event.key === '-' || event.key === '_') {
      presenterNotesContainer.classList.add('hidden');
      config.PRESENTER_NOTES_VISIBLE = false;
      event.preventDefault();
      handled = true;
    }
  /* Handle navigation controls
   * Supports slide progression and image sequences
   */
    else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowLeft key pressed`);
      
      // First try to handle image sequence navigation
      const sequenceHandled = handleImageSequenceNavigation('prev');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowLeft: sequenceHandled = ${sequenceHandled}`);
      
      if (!sequenceHandled && currentSlideIndex > 0) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowLeft: moving to previous slide (${currentSlideIndex - 1})`);
        showSlide(currentSlideIndex - 1);
      }
      handled = true;
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowRight key pressed`);
      
      // First try to handle image sequence navigation
      const sequenceHandled = handleImageSequenceNavigation('next');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowRight: sequenceHandled = ${sequenceHandled}`);
      
      if (!sequenceHandled && currentSlideIndex < slides.length - 1) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG][${performance.now().toFixed(2)}ms] ArrowRight: moving to next slide (${currentSlideIndex + 1})`);
        showSlide(currentSlideIndex + 1);
      }
      handled = true;
    }
    else if (event.key === ' ' && hasStartedTimer) {
      event.preventDefault();
      toggleTimer();
      handled = true;
    }
    // Removed duplicate 'p' key handler as it's already handled above
    // R key handling removed as requested
  });

  // Show first slide on initial load
  showSlide(0);
  // Setup resize handler
  setupResizeHandler();
}

/**
 * Toggle the timer on/off
 */
function toggleTimer() {
  if (window.timerInterval) {
    clearInterval(window.timerInterval);
    window.timerInterval = null;
  } else {
    window.timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Toggle presenter mode
 */
function togglePresenterMode() {
  const isPresenterMode = document.querySelector('.presenter-notes').classList.contains('presenter-mode');
  const header = document.querySelector('.dps-header');
  const footer = document.querySelector('.dps-footer');
  const slides = document.querySelectorAll('.slide');
  const currentSlide = slides[currentSlideIndex];
  const presenterNotes = document.querySelector('.presenter-notes');
  const presenterButton = document.querySelector('.presenter-toggle');
  const notesContent = presenterNotes.querySelector('.presenter-notes-content');

  if (!isPresenterMode) {
    // Hide header and slides but keep footer
    header.style.display = 'none';
    slides.forEach(slide => slide.style.display = 'none');
    currentSlide.style.display = 'none';
    
    // Highlight presenter button
    presenterButton.classList.add('active');
  
    // Show notes in full screen
    presenterNotes.classList.remove('hidden');
    presenterNotes.classList.add('presenter-mode');
  
    // Normal view - stay pinned to left
    presenterNotes.style.width = '50%'; // Reduced from 100% to stay on left side
    presenterNotes.style.left = '20px'; // Keep pinned to left
    presenterNotes.style.height = 'calc(100vh - 60px)';
    presenterNotes.style.position = 'fixed';
    presenterNotes.style.top = '0';
    presenterNotes.style.zIndex = '1000';
    presenterNotes.style.backgroundColor = 'white';
    presenterNotes.style.padding = '20px';
    presenterNotes.style.overflow = 'auto';
    
    // Update presenter notes content to include title and bullet points
    updatePresenterNotes(currentSlideIndex, false, true); // Pass isPresenterToggle=true
  } else {
    // Restore normal view
    header.style.display = '';
    slides.forEach(slide => slide.style.display = '');
    currentSlide.style.display = 'block';
    
    // Remove button highlight
    presenterButton.classList.remove('active');
  
    presenterNotes.classList.remove('presenter-mode');
    presenterNotes.style.width = '31.25vw'; // Original width from CSS
    presenterNotes.style.left = '20px'; // Keep pinned to left
    presenterNotes.style.height = '25vh'; // Original height from CSS
    presenterNotes.style.position = 'fixed';
    presenterNotes.style.top = '';
    presenterNotes.style.bottom = '60px'; // Position at bottom as in CSS
    presenterNotes.style.zIndex = '1000';
    presenterNotes.style.backgroundColor = '';
    presenterNotes.style.padding = '';
    presenterNotes.style.overflow = 'auto';
  }
}

/**
 * Setup resize handler for presenter notes
 */
function setupResizeHandler() {
  const grip = document.querySelector('.resize-grip');
  const notes = document.querySelector('.presenter-notes');

  if (!grip || !notes) return;

  grip.addEventListener('mousedown', (e) => {
    const isResizing = true;
    const startY = e.clientY;
    const startHeight = parseInt(document.defaultView.getComputedStyle(notes).height, 10);
    e.preventDefault();

    const moveHandler = (moveEvent) => {
      if (!isResizing) return;
      
      const height = startHeight + (startY - moveEvent.clientY);
      notes.style.height = `${Math.max(200, Math.min(window.innerHeight - 60, height))}px`;
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  });
}

// Global variables needed for seamless navigation
let currentSlideIndex = 0;
let timerInterval = null;
let remainingTime = 0;
let hasStartedTimer = false;

/**
 * Update navigation buttons state
 * Disables buttons when at first/last slide
 */
function updateNavButtons(slideIndex) {
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');
  const slides = document.querySelectorAll('.slide');
  
  if (prevButton) {
    prevButton.disabled = slideIndex === 0;
  }
  if (nextButton) {
    nextButton.disabled = slideIndex === slides.length - 1;
  }
}

/**
 * Update presenter notes
 * Shows notes for current slide
 */
function updatePresenterNotes(slideIndex, forceNormalMode = false, isPresenterToggle = false) {
  const slides = document.querySelectorAll('.slide');
  const currentSlide = slides[slideIndex];
  const slideData = currentSlide.dataset.presenterNotes || '';
  const presenterNotes = document.querySelector('.presenter-notes');
  const notesContent = presenterNotes.querySelector('.presenter-notes-content');
  
  // Always use normal mode content when forceNormalMode is true
  if (forceNormalMode) {
    // Normal mode - just show the notes
    notesContent.innerHTML = slideData;
    return; // Exit early to ensure we don't run the other logic
  }
  
  // Only show enhanced content for presenter mode (icon click), not for 'p' key (enlarged)
  if (presenterNotes.classList.contains('presenter-mode') && isPresenterToggle) {
    // Get the current slide content
    const slideTitle = currentSlide.querySelector('.slide-title')?.textContent || '';
    let bulletPointsHTML = '';
    
    // Get bullet points
    const bulletList = currentSlide.querySelector('.bullet-list');
    if (bulletList) {
      bulletPointsHTML = bulletList.outerHTML;
    }
    
    // Combine everything with an HR separator
    notesContent.innerHTML = `
      <h3>${slideTitle}</h3>
      ${bulletPointsHTML}
      <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ccc;">
      ${slideData}
    `;
  } else {
    // Normal mode - just show the notes
    notesContent.innerHTML = slideData;
  }
}

/**
 * Start the presentation timer
 */
function startTimer() {
  if (!window.timerInterval) {
    window.timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Update the timer display
 */
function updateTimer() {
  if (window.remainingTime > 0) {
    window.remainingTime--;
    document.querySelector('.timer').textContent = formatTime(window.remainingTime);

    /* Flash warning when 2 minutes remain
     * Provides visual cue for time management
     */
    if (remainingTime === 120) {
      flashTimeWarning();
    }
  } else {
    clearInterval(timerInterval);
    document.querySelector('.timer').textContent = 'Time Up!';
    document.querySelector('.timer').style.color = '#e74c3c';
  }
}

/**
 * Visual warning system for timer
 * Flashes red three times when time is running low
 */
function flashTimeWarning() {
  const container = document.querySelector('.dps-container');
  let flashCount = 0;

  function singleFlash() {
    container.style.backgroundColor = '#e74c3c';

    setTimeout(() => {
      container.style.backgroundColor = '';
      flashCount++;

      if (flashCount < 3) {
        setTimeout(singleFlash, 300);
      }
    }, 300);
  }

  singleFlash();
}

/**
 * Completely revised navigation approach for seamless progression
 * This implementation flattens the navigation hierarchy so users can progress
 * through all content (slides and image sequences) with single button presses
 */

// First, create a flat navigation structure
function createFlatNavigationArray() {
  const flatNavigation = [];
  
  // Get all slides
  const slides = Array.from(document.querySelectorAll('.slide'));
  
  // Process each slide
  slides.forEach((slide, slideIndex) => {
    // Each slide is a navigation point
    const slideNav = {
      type: 'slide',
      slideIndex: slideIndex,
      sequenceIndex: null,
      element: slide
    };
    
    flatNavigation.push(slideNav);
    
    // Check if this slide has image sequences
    const imageSequence = slide.querySelector('.image-sequence');
    if (imageSequence) {
      const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
      
      // Skip the first image since it's shown with the slide itself
      if (images.length > 1) {
        for (let i = 1; i < images.length; i++) {
          const sequenceNav = {
            type: 'sequence',
            slideIndex: slideIndex,
            sequenceIndex: i,
            element: images[i]
          };
          
          flatNavigation.push(sequenceNav);
        }
      }
    }
  });
  
  return flatNavigation;
}

// Current position in the flat navigation
let currentNavIndex = 0;
let flatNavigation = [];

/**
 * Initialize the seamless navigation system
 */
function initializeSeamlessNavigation() {
  // Create flat navigation array
  flatNavigation = createFlatNavigationArray();
  
  // Start at the first item
  currentNavIndex = 0;
  
  console.log(`[SeamlessNav] Initialized with ${flatNavigation.length} total navigation points`);
}

/**
 * Navigate forward one step in the seamless navigation
 */
function navigateForward() {
  if (currentNavIndex < flatNavigation.length - 1) {
    currentNavIndex++;
    applyCurrentNavigation();
    return true;
  }
  return false;
}

/**
 * Navigate backward one step in the seamless navigation
 */
function navigateBackward() {
  if (currentNavIndex > 0) {
    currentNavIndex--;
    applyCurrentNavigation();
    return true;
  }
  return false;
}

/**
 * Apply the current navigation state
 */
function applyCurrentNavigation() {
  const navItem = flatNavigation[currentNavIndex];
  
  console.log(`[SeamlessNav] Navigating to item ${currentNavIndex}: type=${navItem.type}, slide=${navItem.slideIndex}, sequence=${navItem.sequenceIndex}`);
  
  if (navItem.type === 'slide') {
    // Show this slide, hide all others
    const slides = Array.from(document.querySelectorAll('.slide'));
    slides.forEach((slide, index) => {
      if (index === navItem.slideIndex) {
        slide.style.display = 'block';
        slide.classList.add('active');
        
        // Initialize any image sequence in this slide
        initializeImageSequence(slide);
        
        // Update presenter notes and navigation
        const presenterNotes = document.querySelector('.presenter-notes');
        const isInPresenterMode = presenterNotes.classList.contains('presenter-mode');
        updatePresenterNotes(navItem.slideIndex, false, isInPresenterMode);
        updateNavButtons(navItem.slideIndex);
      } else {
        slide.style.display = 'none';
        slide.classList.remove('active');
      }
    });
    
    // Start timer if moving past first slide
    if (navItem.slideIndex > 0 && !hasStartedTimer) {
      startTimer();
      hasStartedTimer = true;
    }
  } else if (navItem.type === 'sequence') {
    // It's a sequence item, show this specific image
    const slide = flatNavigation.find(item => item.type === 'slide' && item.slideIndex === navItem.slideIndex).element;
    const imageSequence = slide.querySelector('.image-sequence');
    const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
    
    // Hide all images first
    images.forEach(img => {
      img.classList.remove('active');
      img.style.visibility = 'hidden';
    });
    
    // Show just the target image
    const targetImage = images[navItem.sequenceIndex];
    targetImage.classList.add('active');
    targetImage.style.visibility = 'visible';
  }
}

/**
 * Initialize image sequence for a slide
 */
function initializeImageSequence(slide) {
  const imageSequence = slide.querySelector('.image-sequence');
  if (!imageSequence) return;
  
  const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
  if (images.length === 0) return;
  
  // Reset all images
  images.forEach(img => {
    img.classList.remove('active');
    img.style.visibility = 'hidden';
    img.style.display = 'block';
  });
  
  // Show only the first image
  images[0].classList.add('active');
  images[0].style.visibility = 'visible';
}

// Replace event handlers with our seamless navigation
function setupSeamlessControls() {
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');
  const presenterButton = document.querySelector('.presenter-toggle');
  
  // Set up presenter mode toggle
  if (presenterButton) {
    presenterButton.addEventListener('click', togglePresenterMode);
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      navigateBackward();
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      navigateForward();
    });
  }
  
  // Force fullscreen mode immediately
  document.body.classList.add('dps-fullscreen');
  window.scrollTo(0, 0);
  
  // Setup resize handler for presenter notes
  setupResizeHandler();
  
  // Handle keyboard navigation
  document.addEventListener('keydown', (event) => {
    // Ignore repeated keydown events from key being held down
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBackward();
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateForward();
    }
    else if (event.key === 'Escape') {
      const navBar = document.querySelector('.dps-navigation');
      if (navBar) {
        navBar.style.display = navBar.style.display === 'none' ? 'flex' : 'none';
      }
    }
    else if (event.key === '+' || event.key === '=') {
      const presenterNotes = document.querySelector('.presenter-notes');
      presenterNotes.classList.remove('hidden');
    }
    else if (event.key === '-' || event.key === '_') {
      const presenterNotes = document.querySelector('.presenter-notes');
      presenterNotes.classList.add('hidden');
    }
    else if (event.key === ' ' && hasStartedTimer) {
      event.preventDefault();
      toggleTimer();
    }
    // Keep other existing keyboard handlers
  });
  
  // Initialize navigation
  initializeSeamlessNavigation();
  applyCurrentNavigation();
}

// Add a style block for proper image sequence styling
function addSeamlessNavigationStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .sequence-image {
      position: absolute;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block !important;
      visibility: hidden;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }

    .sequence-image.active {
      visibility: visible !important;
    }
    
    /* Better slide transitions */
    .slide {
      transition: opacity 0.3s ease;
    }
    
    /* Ensure illustration container has proper positioning */
    .illustration {
      position: relative;
      min-height: 200px;
    }
    
    .image-sequence {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
  `;
  document.head.appendChild(styleElement);
}

/**
 * Set up the System Info button functionality
 * Creates a button that copies debug information to clipboard when clicked
 */
function setupSystemInfoButton() {
  const systemInfoButton = document.querySelector('.system-info-button');
  
  if (!systemInfoButton) return;
  
  systemInfoButton.addEventListener('click', () => {
    // Log the button click event
    if (DPS_CONFIG.DEBUG_INFO.enabled) {
      DPS_CONFIG.DEBUG_INFO.events.push({
        type: 'system_info_button_clicked',
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate debug information
    const debugInfo = generateDebugInfo();
    
    // Copy to clipboard
    copyToClipboard(debugInfo);
    
    // Show feedback to user
    showCopyFeedback(systemInfoButton);
  });
  
  // Add styles for the system info button
  addSystemInfoStyles();
}

/**
 * Generate debug information as a JSON string
 * @returns {string} Formatted JSON string with debug information
 */
function generateDebugInfo() {
  // Create a comprehensive debug object
  const debugObject = {
    timestamp: new Date().toISOString(),
    slides: DPS_CONFIG.DEBUG_INFO.slides,
    illustrations: DPS_CONFIG.DEBUG_INFO.illustrations,
    events: DPS_CONFIG.DEBUG_INFO.events,
    navigationState: {
      currentSlideIndex,
      currentNavIndex,
      totalSlides: document.querySelectorAll('.slide').length,
      totalNavPoints: flatNavigation.length
    },
    timerState: {
      remainingTime: window.remainingTime,
      hasStartedTimer: window.hasStartedTimer,
      isTimerRunning: !!window.timerInterval
    },
    presenterState: {
      isPresenterMode: document.querySelector('.presenter-notes')?.classList.contains('presenter-mode') || false,
      isNotesVisible: !document.querySelector('.presenter-notes')?.classList.contains('hidden')
    }
  };
  
  // Format as pretty JSON with 2-space indentation
  return JSON.stringify(debugObject, null, 2);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy to clipboard
 */
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  
  // Select and copy the text
  textarea.select();
  document.execCommand('copy');
  
  // Clean up
  document.body.removeChild(textarea);
  
  // Log the copy event
  if (DPS_CONFIG.DEBUG_INFO.enabled) {
    DPS_CONFIG.DEBUG_INFO.events.push({
      type: 'debug_info_copied',
      timestamp: new Date().toISOString(),
      contentLength: text.length
    });
  }
}

/**
 * Show feedback to the user that the copy was successful
 * @param {Element} button - The button element that was clicked
 */
function showCopyFeedback(button) {
  // Create a tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'copy-tooltip';
  tooltip.textContent = 'System Info Copied!';
  
  // Position the tooltip
  const buttonRect = button.getBoundingClientRect();
  tooltip.style.position = 'absolute';
  tooltip.style.top = `${buttonRect.top - 30}px`;
  tooltip.style.left = `${buttonRect.left + (buttonRect.width / 2) - 60}px`;
  
  // Add the tooltip to the document
  document.body.appendChild(tooltip);
  
  // Remove the tooltip after a delay
  setTimeout(() => {
    tooltip.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 300);
  }, 2000);
}

/**
 * Add styles for the system info button and tooltip
 */
function addSystemInfoStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .footer-buttons {
      display: flex;
      align-items: center;
    }
    
    .system-info-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      margin-left: 10px;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }
    
    .system-info-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .system-info-button svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    .copy-tooltip {
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      transition: opacity 0.3s;
    }
    
    .copy-tooltip.fade-out {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
}

/**
 * DPS State Tracker - A focused tool to identify state inconsistencies
 * Add this to your DPS.js file to track state changes and identify issues
 */

// State tracking variables
let stateSnapshots = [];
const MAX_SNAPSHOTS = 20;

/**
 * Take a snapshot of the current DPS state
 * @param {string} trigger - What triggered this snapshot
 */
function takeStateSnapshot(trigger) {
  // Get the current slide
  const currentSlide = document.querySelectorAll('.slide')[currentSlideIndex];
  
  // Check for image sequence
  const imageSequence = currentSlide ? currentSlide.querySelector('.image-sequence') : null;
  const sequenceImages = imageSequence ? Array.from(imageSequence.querySelectorAll('.sequence-image')) : [];
  
  // Analyze active states
  const activeImages = sequenceImages.filter(img => img.classList.contains('active'));
  const visibleImages = sequenceImages.filter(img => img.style.visibility === 'visible');
  
  // State inconsistency detection
  const activeCount = activeImages.length;
  const visibleCount = visibleImages.length;
  const hasInconsistentState = activeCount !== visibleCount || activeCount > 1;
  
  // Create the snapshot
  const snapshot = {
    timestamp: new Date().toISOString(),
    performanceTime: performance.now(),
    trigger: trigger,
    
    navigation: {
      currentSlideIndex: currentSlideIndex,
      currentNavIndex: currentNavIndex,
      totalNavPoints: flatNavigation ? flatNavigation.length : 'unknown',
      currentNavType: flatNavigation && currentNavIndex < flatNavigation.length ? 
                     flatNavigation[currentNavIndex].type : 'unknown'
    },
    
    sequence: {
      exists: !!imageSequence,
      totalImages: sequenceImages.length,
      activeCount: activeCount,
      visibleCount: visibleCount,
      hasInconsistentState: hasInconsistentState,
      
      // Which images are active/visible
      activeIndices: activeImages.map(img => sequenceImages.indexOf(img)),
      visibleIndices: visibleImages.map(img => sequenceImages.indexOf(img)),
      
      // Details of active images
      activeDetails: activeImages.map(img => ({
        index: sequenceImages.indexOf(img),
        type: getImageType(img),
        visibility: img.style.visibility,
        display: img.style.display
      }))
    }
  };
  
  // Add to snapshots history, maintaining max length
  stateSnapshots.push(snapshot);
  if (stateSnapshots.length > MAX_SNAPSHOTS) {
    stateSnapshots.shift();
  }
  
  // Log to console if there's an inconsistency
  if (hasInconsistentState) {
    console.warn(`[DPS State] Inconsistent state detected (${trigger}):`, 
                 `active=${activeCount}, visible=${visibleCount}`);
  }
  
  return snapshot;
}

/**
 * Get type information for an image element
 * @param {Element} img - The image element to analyze
 * @returns {string} Image type descriptor
 */
function getImageType(img) {
  if (!img) return 'unknown';
  
  if (img.tagName === 'IFRAME' || img.classList.contains('iframe-container')) {
    return 'iframe';
  } else if (img.tagName === 'IMG') {
    if (img.dataset.iconName) {
      return `icon:${img.dataset.iconName}`;
    }
    return 'image';
  } else if (img.classList.contains('text-container')) {
    return 'text';
  } else if (img.tagName === 'DIV' && img.innerHTML.includes('<svg')) {
    return 'svg';
  }
  
  return img.tagName.toLowerCase();
}

/**
 * Get the full DPS state report as JSON
 * @returns {string} JSON string with full state report
 */
function getDPSStateReport() {
  // Add one final snapshot of current state
  takeStateSnapshot('report_requested');
  
  const report = {
    timestamp: new Date().toISOString(),
    currentState: stateSnapshots[stateSnapshots.length - 1],
    history: stateSnapshots,
    
    // Slide details
    slides: Array.from(document.querySelectorAll('.slide')).map((slide, index) => {
      const imageSequence = slide.querySelector('.image-sequence');
      return {
        index: index,
        title: slide.querySelector('.slide-title')?.textContent || `Slide ${index}`,
        display: slide.style.display,
        isActive: index === currentSlideIndex,
        hasSequence: !!imageSequence,
        sequenceImageCount: imageSequence ? 
                          imageSequence.querySelectorAll('.sequence-image').length : 0
      };
    }),
    
    // Navigation analysis
    navigationStructure: flatNavigation ? 
      flatNavigation.map((item, index) => ({
        index: index,
        type: item.type,
        slideIndex: item.slideIndex,
        sequenceIndex: item.sequenceIndex,
        isCurrent: index === currentNavIndex
      })) : 'Not available'
  };
  
  return JSON.stringify(report, null, 2);
}

/**
 * Apply fixes to ensure consistent state
 * Call this if you detect inconsistencies
 */
function fixDPSState() {
  // Get current slide
  const currentSlide = document.querySelectorAll('.slide')[currentSlideIndex];
  if (!currentSlide) return;
  
  // Find image sequence
  const imageSequence = currentSlide.querySelector('.image-sequence');
  if (!imageSequence) return;
  
  // Get all images
  const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
  if (images.length === 0) return;
  
  console.log('[DPS Fix] Applying state fixes to slide', currentSlideIndex);
  
  // Find active image index (use first active or default to 0)
  const activeIndex = images.findIndex(img => img.classList.contains('active'));
  const targetIndex = activeIndex >= 0 ? activeIndex : 0;
  
  // Reset all images to consistent state
  images.forEach((img, idx) => {
    // Remove active class
    img.classList.remove('active');
    // Set visibility to hidden
    img.style.visibility = 'hidden';
    // Ensure display is block
    img.style.display = 'block';
  });
  
  // Set the target image as active
  if (images[targetIndex]) {
    images[targetIndex].classList.add('active');
    images[targetIndex].style.visibility = 'visible';
  }
  
  // Update navigation indices if needed
  if (flatNavigation) {
    // Find the corresponding nav item for this slide+sequence
    const navIndex = flatNavigation.findIndex(item => 
      item.type === 'sequence' && 
      item.slideIndex === currentSlideIndex && 
      item.sequenceIndex === targetIndex
    );
    
    if (navIndex >= 0) {
      currentNavIndex = navIndex;
      console.log('[DPS Fix] Updated currentNavIndex to', navIndex);
    }
  }
  
  // Take a snapshot after fixing
  takeStateSnapshot('after_fix');
  
  return true;
}

/**
 * Initialize the state tracker by wrapping key functions
 */
function initStateTracker() {
  console.log('[DPS State Tracker] Initializing...');
  
  // Patch navigation functions to track state changes
  const origNavigateForward = window.navigateForward;
  window.navigateForward = function() {
    takeStateSnapshot('before_navigate_forward');
    const result = origNavigateForward.apply(this, arguments);
    takeStateSnapshot('after_navigate_forward');
    return result;
  };
  
  const origNavigateBackward = window.navigateBackward;
  window.navigateBackward = function() {
    takeStateSnapshot('before_navigate_backward');
    const result = origNavigateBackward.apply(this, arguments);
    takeStateSnapshot('after_navigate_backward');
    return result;
  };
  
  // Patch sequence navigation
  const origHandleImageSequenceNavigation = window.handleImageSequenceNavigation;
  if (origHandleImageSequenceNavigation) {
    window.handleImageSequenceNavigation = function(direction) {
      takeStateSnapshot('before_sequence_nav_' + direction);
      const result = origHandleImageSequenceNavigation.apply(this, arguments);
      takeStateSnapshot('after_sequence_nav_' + direction);
      return result;
    };
  }
  
  // Patch applyCurrentNavigation
  const origApplyCurrentNavigation = window.applyCurrentNavigation;
  if (origApplyCurrentNavigation) {
    window.applyCurrentNavigation = function() {
      takeStateSnapshot('before_apply_navigation');
      const result = origApplyCurrentNavigation.apply(this, arguments);
      takeStateSnapshot('after_apply_navigation');
      return result;
    };
  }
  
  // Add keyboard handler to trigger fix
  document.addEventListener('keydown', function(event) {
    // Ctrl+Alt+F to fix DPS state
    if (event.ctrlKey && event.altKey && event.key === 'f') {
      console.log('[DPS State Tracker] Manual fix triggered');
      fixDPSState();
    }
  });
  
  // Enhance system info button
  enhanceSystemInfoButton();
  
  // Take initial snapshot
  takeStateSnapshot('initialization');
  
  console.log('[DPS State Tracker] Initialized successfully.');
}

/**
 * Enhance system info button to include state tracking data
 */
function enhanceSystemInfoButton() {
  const systemInfoButton = document.querySelector('.system-info-button');
  if (!systemInfoButton) return;
  
  // Replace click handler
  systemInfoButton.addEventListener('click', function() {
    // Generate state report
    const stateReport = getDPSStateReport();
    
    // Copy to clipboard
    const textarea = document.createElement('textarea');
    textarea.value = stateReport;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show feedback
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Enhanced DPS State Report Copied!';
    tooltip.style.position = 'absolute';
    const buttonRect = systemInfoButton.getBoundingClientRect();
    tooltip.style.top = `${buttonRect.top - 30}px`;
    tooltip.style.left = `${buttonRect.left + (buttonRect.width / 2) - 100}px`;
    tooltip.style.width = '200px';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 300);
    }, 2000);
  });
}

// Exported functions for global use
window.takeStateSnapshot = takeStateSnapshot;
window.getDPSStateReport = getDPSStateReport;
window.fixDPSState = fixDPSState;
window.initStateTracker = initStateTracker;
