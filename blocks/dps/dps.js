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

export default function decorate(block) {
  // Add dps-block class to the container for proper styling isolation
  block.classList.add('dps-block');

  /* Configuration object for presentation settings
   * - Timer duration defaults to 25 minutes
   * - Slide transitions use 300ms for smooth animation
   * - Presenter notes start hidden by default
   */
  const DPS_CONFIG = {
    TIMER_DURATION: 25 * 60,
    SLIDE_TRANSITION_MS: 300,
    PRESENTER_NOTES_VISIBLE: true,
  };

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
      <button class="presenter-toggle" aria-label="Toggle presenter view">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </button>
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

  /* Set up presentation controls
   * Handles slide navigation, timer, and presenter notes functionality
   */
  setupControls(
    slidesContainer,
    presenterNotesContainer,
    presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION,
    DPS_CONFIG
  );

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
      content: `<iframe src="${simpleIframeMatch[1]}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
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

/**
 * Parse illustration from a cell
 * Supports multiple content types: images, SVGs, iframes
 * 
 * @param {Element} cell - Cell element containing illustration content
 * @returns {Object|null} Structured illustration data or null if no illustration found
 */
function parseIllustration(cell) {
  if (!cell) return null;
  
  const illustrations = [];
  
  // Process HTML content directly from cell to capture all elements
  let cellContent = cell.innerHTML.trim();
  
  // Clean up content - remove lone <br> tags and whitespace
  cellContent = cellContent
    .replace(new RegExp('<p>\\s*<br>\\s*</p>', 'gi'), '') // Remove empty paragraphs with just <br>
    .replace(new RegExp('<br>\\s*(?=<)', 'gi'), '') // Remove <br> tags at start of elements
    .replace(new RegExp('\\s*<br>\\s*(?=\\w)', 'gi'), ' ') // Replace <br> followed by text with space
    .replace(new RegExp('\\s+', 'g'), ' ') // Collapse multiple whitespace
    .trim();

  // Special handling for simplified iframe format wrapped in paragraphs or other elements
  const simplifiedIframeRegex = new RegExp('<(?:p|div)[^>]*>\\s*iframe\\s+(https?://[^\\s"\'<>]+)\\s*</(?:p|div)>', 'gi');
  const simplifiedIframeMatches = Array.from(cellContent.matchAll(simplifiedIframeRegex));
  
  for (const match of simplifiedIframeMatches) {
    const url = match[1];
    if (!illustrations.some(item => item.type === 'iframe' && item.src === url)) {
      illustrations.push({
        type: 'iframe',
        src: url,
        content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
      });
    }
  }
  
  // Also check for iframe format without HTML tags
  const plainIframeRegex = new RegExp('iframe\\s+(https?://[^\\s"\'<>]+)', 'gi');
  const plainIframeMatches = Array.from(cellContent.matchAll(plainIframeRegex));
  
  for (const match of plainIframeMatches) {
    const url = match[1];
    // Skip if already processed by the HTML version above
    if (!illustrations.some(item => item.type === 'iframe' && item.src === url)) {
      illustrations.push({
        type: 'iframe',
        src: url,
        content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
      });
    }
  }
  
  // Process icon spans first - convert to image tags
  const iconRegex = new RegExp('<span\\s+class=["|\'][^"\']*icon[^"\']*["|\'][^>]*>.*?</span>', 'gi');
  const iconMatches = Array.from(cellContent.matchAll(iconRegex));
  
  for (const match of iconMatches) {
    const iconHtml = match[0];
    const classMatch = iconHtml.match(new RegExp('class=["\'](\\S*)["\']', 'i'));
    
    if (classMatch && classMatch[1]) {
      const classString = classMatch[1];
      const iconName = extractIconName(classString);
      
      if (iconName) {
        illustrations.push({
          type: 'icon',
          iconName,
          content: `/icons/${iconName}.svg`,
          alt: `${iconName} Illustration`
        });
      }
    }
  }
  
  // Helper function to process an element and its children
  function processElement(element) {
    // If this is a paragraph, process both its text content and children
    if (element.tagName === 'P') {
      // Process the paragraph's HTML content to capture text nodes and embedded URLs
      const paragraphHtml = element.innerHTML;
      
      // Check if paragraph contains iframe content
      const iframeContent = extractIframeContent(paragraphHtml);
      if (iframeContent) {
        illustrations.push(iframeContent);
      }
      
      // Check for URLs in the paragraph - process all URLs, not just the first one
      const urlMatches = paragraphHtml.match(new RegExp('(https?://[^\\s"\'<>]+)', 'gi'));
      if (urlMatches) {
        for (const url of urlMatches) {
          // Skip if this URL is already part of an iframe that was processed
          if (iframeContent && iframeContent.src === url) continue;
          
          // Skip if this URL is already in the illustrations
          if (illustrations.some(item =>
            (item.type === 'iframe' && item.src === url) ||
            (item.type === 'image' && item.content === url)
          )) continue;
          
          // Add as image or iframe based on extension
          if (isImageUrl(url)) {
            illustrations.push({
              type: 'image',
              content: url,
              alt: 'Image'
            });
          } else {
            illustrations.push({
              type: 'iframe',
              src: url,
              content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
            });
          }
        }
      }
      
      // Also check for URLs in anchor tags
      const anchorRegex = new RegExp('<a[^>]*href=["\'](\\S*)["\'][^>]*>.*?</a>', 'gi');
      const anchorMatches = Array.from(paragraphHtml.matchAll(anchorRegex));
      
      for (const match of anchorMatches) {
        const url = match[1];
        if (url && url.startsWith('http')) {
          // Skip if this URL is already in the illustrations
          if (illustrations.some(item =>
            (item.type === 'iframe' && item.src === url) ||
            (item.type === 'image' && item.content === url)
          )) continue;
          
          // Add as image or iframe based on extension
          if (isImageUrl(url)) {
            illustrations.push({
              type: 'image',
              content: url,
              alt: 'Image'
            });
          } else {
            illustrations.push({
              type: 'iframe',
              src: url,
              content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
            });
          }
        }
      }
      
      // Process each child of the paragraph
      Array.from(element.children).forEach(child => {
        processElement(child);
      });
      
      // Also check for direct span elements that might be icons
      const iconSpan = element.querySelector('span.icon');
      if (iconSpan) {
        const iconName = extractIconName(iconSpan.className);
        if (iconName && !illustrations.some(item => item.type === 'icon' && item.iconName === iconName)) {
          illustrations.push({
            type: 'icon',
            iconName,
            content: `/icons/${iconName}.svg`,
            alt: `${iconName} Illustration`
          });
        }
      }
      
      return;
    }
    
    // Create a temporary container to extract HTML content accurately
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(element.cloneNode(true));
    const elementHtml = tempContainer.innerHTML;
    
    // Process based on element type
    if (element.tagName === 'SVG' || elementHtml.includes('<svg')) {
      illustrations.push({
        type: 'svg',
        content: elementHtml
      });
    }
    else if (element.tagName === 'PICTURE' || element.querySelector('picture')) {
      // Handle picture elements
      const picture = element.tagName === 'PICTURE' ? element : element.querySelector('picture');
      
      if (picture) {
        illustrations.push({
          type: 'picture',
          content: picture.outerHTML
        });
      }
    }
    else if (element.tagName === 'IMG' || element.querySelector('img:not(picture img)')) {
      // Handle img elements
      const img = element.tagName === 'IMG' ? element : element.querySelector('img:not(picture img)');
      
      if (img) {
        illustrations.push({
          type: 'image',
          content: img.src,
          alt: img.alt || ''
        });
      }
    }
    else if (element.tagName === 'SPAN' && element.classList.contains('icon')) {
      // Handle icon spans - convert to image tags
      const iconName = extractIconName(element.className);
      if (iconName) {
        illustrations.push({
          type: 'icon',
          iconName,
          content: `/icons/${iconName}.svg`,
          alt: `${iconName} Illustration`
        });
      }
    }
    else {
      // Process potential iframe content
      const content = elementHtml;
      
      // Check for iframe first
      const iframeContent = extractIframeContent(content);
      if (iframeContent) {
        illustrations.push(iframeContent);
      }
      // Then check for plain URLs
      else {
        const urlData = extractUrl(content);
        if (urlData) {
          if (urlData.type === 'image') {
            illustrations.push({
              type: 'image',
              content: urlData.url,
              alt: 'Image'
            });
          } else {
            illustrations.push({
              type: 'iframe',
              src: urlData.url,
              content: `<iframe src="${urlData.url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
            });
          }
        }
      }
    }
  }
  
  // Process all elements as separate content pieces
  const elements = Array.from(cell.children);
  
  // Check if there's any direct text content in the cell
  if (cell.textContent.trim() && cell.childElementCount === 0) {
    const textContent = cell.textContent.trim();
    const iframeContent = extractIframeContent(textContent);
    if (iframeContent) {
      illustrations.push(iframeContent);
    } else {
      const urlData = extractUrl(textContent);
      if (urlData) {
        if (urlData.type === 'image') {
          illustrations.push({
            type: 'image',
            content: urlData.url,
            alt: 'Image'
          });
        } else {
          illustrations.push({
            type: 'iframe',
            src: urlData.url,
            content: `<iframe src="${urlData.url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
          });
        }
      }
    }
  }
  
  // Process each top-level element
  for (const element of elements) {
    processElement(element);
  }
  
  // Process HTML encoded iframes that might be directly in the cell innerHTML
  const htmlEncodedIframeRegex = new RegExp('(?:&lt;|&#x3C;)iframe(?:\\s+|&gt;)(.*?)(?:&lt;\\/iframe&gt;|(?:\\/)?&gt;)', 'gi');
  const htmlEncodedMatches = Array.from(cellContent.matchAll(htmlEncodedIframeRegex));
  
  for (const match of htmlEncodedMatches) {
    const fullMatch = match[0];
    const contentPart = match[1] || '';
    
    // Extract URL from content
    const urlMatch = contentPart.match(new RegExp('(https?://[^\\s"\'&<>]+)', 'i'));
    if (urlMatch && urlMatch[1]) {
      // Check if this URL is already included
      const url = urlMatch[1];
      if (!illustrations.some(item =>
        (item.type === 'iframe' && item.src === url) ||
        (item.content && typeof item.content === 'string' && item.content.includes(url))
      )) {
        illustrations.push({
          type: 'iframe',
          src: url,
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
        });
      }
    }
  }

  // Return illustrations if found, null otherwise
  if (illustrations.length > 0) {
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
  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    /* Create slide element with unique ID
     * Stores presenter notes in dataset for easy access
     */
    const slideElement = document.createElement('div');
    slideElement.id = `slide-${index}`;
    slideElement.className = 'slide';
    
    if (slide.presenterNotes) {
      slideElement.dataset.presenterNotes = slide.presenterNotes;
    }

    /* Special handling for Q&A slides
     * Creates a distinct layout for the final slide
     */
    if (slide.type === 'qanda') {
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
      // Create standard slide content
      slideElement.innerHTML = createSlideContent(slide);
    }

    container.appendChild(slideElement);
  });

  // First slide will be shown by setupControls
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
  const slides = slidesContainer.querySelectorAll('.slide');
  const notesContent = presenterNotesContainer.querySelector('.presenter-notes-content');
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');

  let currentSlideIndex = 0;
  let timerInterval = null;
  let remainingTime = timerDuration;
  let hasStartedTimer = false;

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

  /* Show a specific slide
   * Handles display logic and updates related elements
   */
  function showSlide(index, sequenceIndex) {
    slides.forEach((slide) => {
      slide.style.display = 'none';
      slide.classList.remove('active');
    });

    if (slides[index]) {
      slides[index].style.display = 'block';
      slides[index].classList.add('active');
      
      // If a specific sequence index is provided, set it as active
      if (sequenceIndex !== undefined) {
        const imageSequence = slides[index].querySelector('.image-sequence');
        if (imageSequence) {
          const sequenceImages = imageSequence.querySelectorAll('.sequence-image');
          sequenceImages.forEach((img, idx) => {
            if (idx === sequenceIndex) {
              img.classList.add('active');
              img.style.display = 'block';
            } else {
              img.classList.remove('active');
              img.style.display = 'none';
            }
          });
        }
      } else {
        // Initialize the first image in sequence as active
        const imageSequence = slides[index].querySelector('.image-sequence');
        if (imageSequence) {
          // eslint-disable-next-line no-console
          console.log('[DEBUG] showSlide: Found image sequence, initializing first image');
          
          const sequenceImages = imageSequence.querySelectorAll('.sequence-image');
          // eslint-disable-next-line no-console
          console.log(`[DEBUG] showSlide: Found ${sequenceImages.length} sequence images`);
          
          if (sequenceImages.length > 0) {
            sequenceImages.forEach((img, idx) => {
              if (idx === 0) {
                // eslint-disable-next-line no-console
                console.log('[DEBUG] showSlide: Setting first image as active');
                img.classList.add('active');
                img.style.display = 'block';
              } else {
                img.classList.remove('active');
                img.style.display = 'none';
              }
            });
          }
        }
      }
      
      // Check if we're in presenter mode to show enhanced content
      const presenterNotes = document.querySelector('.presenter-notes');
      const isInPresenterMode = presenterNotes.classList.contains('presenter-mode');
      
      // Pass isPresenterToggle=true if in presenter mode to show enhanced content
      updatePresenterNotes(index, false, isInPresenterMode);
      updateNavButtons();
    }

    currentSlideIndex = index;

    /* Start timer after first slide
     * Ensures timer only starts when presentation begins
     */
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
      console.log('[DEBUG] Next button clicked');
      
      // First try to handle image sequence navigation, just like arrow keys
      const sequenceHandled = handleImageSequenceNavigation('next');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] Next button: sequenceHandled = ${sequenceHandled}`);
      
      // If no sequence to navigate or at the end of sequence, go to next slide
      if (!sequenceHandled && currentSlideIndex < slides.length - 1) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] Next button: moving to next slide (${currentSlideIndex + 1})`);
        showSlide(currentSlideIndex + 1);
      }
    });
  }

  /* Handle image sequence navigation
   * Allows progression through multiple images within a slide
   */
  function handleImageSequenceNavigation(direction) {
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] handleImageSequenceNavigation called with direction: ${direction}`);
    
    // Get the current slide and check if it has an image sequence
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] No current slide found, returning false');
      return false;
    }
    
    const imageSequence = currentSlide.querySelector('.image-sequence');
    if (!imageSequence) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] No image sequence found in current slide, returning false');
      return false;
    }

    // Get all images in the sequence
    const images = Array.from(imageSequence.querySelectorAll('.sequence-image'));
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] Found ${images.length} images in sequence`);
    
    if (images.length <= 1) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Not enough images in sequence (<=1), returning false');
      return false;
    }
    
    // Find the currently active image
    let currentImage = imageSequence.querySelector('.sequence-image.active');
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] Current active image found: ${currentImage !== null}`);
    
    // If no active image is found, activate the first one but DON'T return yet
    // This allows the navigation to continue to the next image in the same key press
    if (!currentImage) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] No active image found, activating first image');
      images[0].style.display = 'block';
      images[0].classList.add('active');
      currentImage = images[0]; // Update currentImage to the now-active first image
    }
    
    // Get the index of the current image
    const currentImageIndex = images.indexOf(currentImage);
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] Current image index: ${currentImageIndex}`);
    
    // Handle navigation based on direction
    if (direction === 'next') {
      // Check if we're not at the end of the sequence
      if (currentImageIndex < images.length - 1) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] Moving to next image (index ${currentImageIndex + 1})`);
        
        // Hide current image
        currentImage.style.display = 'none';
        currentImage.classList.remove('active');
        
        // Show next image
        const nextImage = images[currentImageIndex + 1];
        nextImage.style.display = 'block';
        nextImage.classList.add('active');
        
        // Trigger reflow in a lint-friendly way
        imageSequence.getBoundingClientRect();
        
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Successfully moved to next image, returning true');
        return true;
      } else {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Already at last image, returning false');
      }
    } else if (direction === 'prev') {
      // Check if we're not at the beginning of the sequence
      if (currentImageIndex > 0) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] Moving to previous image (index ${currentImageIndex - 1})`);
        
        // Hide current image
        currentImage.style.display = 'none';
        currentImage.classList.remove('active');
        
        // Show previous image
        const prevImage = images[currentImageIndex - 1];
        prevImage.style.display = 'block';
        prevImage.classList.add('active');
        
        // Trigger reflow in a lint-friendly way
        imageSequence.getBoundingClientRect();
        
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Successfully moved to previous image, returning true');
        return true;
      } else {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Already at first image, returning false');
      }
    }
    
    // If we reach here, we couldn't navigate in the requested direction
    // eslint-disable-next-line no-console
    console.log('[DEBUG] Could not navigate in requested direction, returning false');
    return false;
  }

  /* Timer functionality
   * Handles countdown and warning system
   */

  function updateTimer() {
    if (remainingTime > 0) {
      remainingTime--;
      document.querySelector('.timer').textContent = formatTime(remainingTime);

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
    if (!timerInterval) {
      timerInterval = setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function toggleTimer() {
    if (timerInterval) {
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
      console.log('[DEBUG] ArrowLeft key pressed');
      
      // First try to handle image sequence navigation
      const sequenceHandled = handleImageSequenceNavigation('prev');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ArrowLeft: sequenceHandled = ${sequenceHandled}`);
      
      if (!sequenceHandled && currentSlideIndex > 0) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] ArrowLeft: moving to previous slide (${currentSlideIndex - 1})`);
        showSlide(currentSlideIndex - 1);
      }
      handled = true;
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log('[DEBUG] ArrowRight key pressed');
      
      // First try to handle image sequence navigation
      const sequenceHandled = handleImageSequenceNavigation('next');
      
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ArrowRight: sequenceHandled = ${sequenceHandled}`);
      
      if (!sequenceHandled && currentSlideIndex < slides.length - 1) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] ArrowRight: moving to next slide (${currentSlideIndex + 1})`);
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
