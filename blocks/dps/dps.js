/**
 * Digital Presentation System (DPS) Block
 * A block for creating and displaying interactive presentations
 */

// Configuration object for the DPS block
const DPS_CONFIG = {
  // Default timer duration in seconds (30 minutes)
  DEFAULT_TIMER_DURATION: 1800,
  // Flag to track if presenter notes are visible
  PRESENTER_NOTES_VISIBLE: false,
  // Error messages
  ERROR_MESSAGES: {
    LOAD_FAILURE: 'Failed to load presentation data',
    INVALID_DATA: 'Invalid presentation data format'
  }
};

// Global state variables
let currentSlideIndex = 0;
let currentSequenceIndex = 0;
let timerInterval = null;
let remainingTime = DPS_CONFIG.DEFAULT_TIMER_DURATION;
let hasStartedTimer = false;

/**
 * Formats seconds into MM:SS display format for the presentation timer
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (MM:SS)
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Main decorate function for the DPS block
 * @param {Element} block - The block element to decorate
 */
export default async function decorate(block) {
  // Add dps-block class to the container
  block.classList.add('dps-block');
  
  // Force full viewport mode by removing existing page elements
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

  // Validate minimum content requirements
  if (rows.length < 2) {
    block.innerHTML = '<div class="dps-error">Error: DPS block requires at least a configuration row and one slide row.</div>';
    return;
  }

  // Parse the presentation data from rows
  const presentationData = parseRows(rows);
  
  // Create presentation container
  const presentationContainer = document.createElement('div');
  presentationContainer.className = 'dps-wrapper';

  // Create header with title and subtitle
  const header = createHeader(presentationData.title, presentationData.subtitle);
  
  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';
  slidesContainer.id = 'slides-container';

  // Create presenter notes container
  const presenterNotesContainer = createPresenterNotesContainer();
  
  // Create footer with navigation and timer
  const footer = createFooter(presentationData.timerDuration);

  // Assemble the presentation container
  presentationContainer.appendChild(header); 
  presentationContainer.appendChild(slidesContainer);
  presentationContainer.appendChild(presenterNotesContainer);
  presentationContainer.appendChild(footer);

  // Replace the block content with our presentation
  block.textContent = '';
  block.appendChild(presentationContainer);

  // Build slides from the parsed content
  buildSlides(presentationData.slides, slidesContainer);
  
  // Set up the navigation system
  setupNavigationSystem();
  
  // Initialize the timer duration
  remainingTime = presentationData.timerDuration * 60 || DPS_CONFIG.DEFAULT_TIMER_DURATION;
  
  // Set up the presenter toggle button
  setupPresenterToggle();
  
  // Setup resize handler for presenter notes
  setupResizeHandler();
  
  // Force fullscreen mode immediately
  document.body.classList.add('dps-fullscreen');
  window.scrollTo(0, 0);
  
  // Show the first slide
  showSlide(0);
}

/**
 * Create header element with title and subtitle
 * @param {string} title - Presentation title
 * @param {string} subtitle - Presentation subtitle
 * @returns {Element} Header element
 */
function createHeader(title, subtitle) {
  const header = document.createElement('div');
  header.className = 'dps-header';
  header.innerHTML = `
    <div class="header-content">
      <h1 id="presentation-title">${title}</h1>
      <p id="presentation-subtitle">${subtitle || ''}</p>
    </div>
  `;
  return header;
}

/**
 * Create presenter notes container
 * @returns {Element} Presenter notes container element
 */
function createPresenterNotesContainer() {
  const container = document.createElement('div');
  container.className = 'presenter-notes hidden';
  container.innerHTML = `
    <div class="presenter-notes-title">
      <span>Presenter Notes (-)hide (+)show</span>
    </div>
    <div class="presenter-notes-content"></div>
  `;
  return container;
}

/**
 * Create footer with navigation and timer
 * @param {number} timerDuration - Timer duration in minutes
 * @returns {Element} Footer element
 */
function createFooter(timerDuration) {
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
      <div class="timer">${formatTime(timerDuration * 60 || DPS_CONFIG.DEFAULT_TIMER_DURATION)}</div>
      <div class="footer-buttons">
        <button class="presenter-toggle" aria-label="Toggle presenter view">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  return footer;
}

/**
 * Parse rows from the block to extract presentation data
 * @param {Array} rows - Array of row elements from the block
 * @returns {Object} Structured presentation data
 */
function parseRows(rows) {
  // Extract configuration from first row
  const configRow = rows[0].querySelector('div');
  const title = configRow.textContent.trim();
  const subtitle = rows[0].querySelector('div:nth-child(2)')?.textContent.trim() || '';
  const timerDuration = parseInt(rows[0].querySelector('div:nth-child(3)')?.textContent.trim() || '25', 10);
  
  // Extract URL from subtitle if present (for use in Q&A slide)
  let subtitleUrl = '';
  const lastHyphenIndex = subtitle.lastIndexOf(' - ');
  if (lastHyphenIndex !== -1) {
    const textAfterHyphen = subtitle.substring(lastHyphenIndex + 3); // +3 to skip " - "
    // Check if the text after hyphen looks like a URL
    if (textAfterHyphen.match(/^https?:\/\//i)) {
      subtitleUrl = textAfterHyphen;
    }
  }

  // Process remaining rows as slides
  const slides = [];
  
  // Process each slide row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.children);
    
    const slideTitle = cells[0]?.textContent.trim() || `Slide ${i}`;
    const introText = cells[1]?.textContent.trim() || '';
    
    // Process bullet points from the third cell
    const bulletPointsCell = cells[2];
    const bulletPoints = [];
    
    if (bulletPointsCell) {
      const bulletContent = bulletPointsCell.innerHTML;
      // Split by list items and paragraphs
      const matches = bulletContent.match(/<li[^>]*>.*?<\/li>|<p[^>]*>.*?<\/p>|[^<>]+/gi) || [];
      
      matches.forEach(item => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
          const isPlainText = !trimmedItem.includes('<li');
          const isHTML = trimmedItem.includes('<') && trimmedItem.includes('>');
          
          bulletPoints.push({
            text: trimmedItem,
            isPlainText,
            isHTML
          });
        }
      });
    }
    
    // Process illustration from the fourth cell
    const illustrationCell = cells[3];
    const illustration = parseIllustration(illustrationCell);
    
    // Process presenter notes from the fifth cell
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
  
  // Add a Q&A slide at the end
  slides.push({
    type: 'qanda',
    title: 'Questions & Answers',
    subtitle: 'Your feedback and questions are valuable',
    thankYouText: 'Thank You For Your Attention',
    subtitleUrl: subtitleUrl // Add the extracted URL from presentation subtitle
  });
  
  return {
    title,
    subtitle,
    timerDuration,
    slides
  };
}

/**
 * Parse an illustration cell into a structured object
 * This is a simplified approach compared to the original code
 * @param {Element} cell - The illustration cell
 * @returns {Object|null} - Parsed illustration object or null
 */
function parseIllustration(cell) {
  if (!cell || !cell.innerHTML.trim()) {
    return null;
  }
  
  // Simplified content extraction
  const content = cell.innerHTML.trim();
  
  // Extract individual illustration items
  const items = extractIllustrationItems(content, cell);
  
  if (items.length === 0) {
    return null;
  }
  
  // If we found illustration items, return them
  if (items.length === 1) {
    // Single illustration
    return items[0];
  } else {
    // Multiple illustrations - sequence
    return {
      type: 'sequence',
      items: items
    };
  }
}
/**
 * Extract individual illustration items from content, ensuring uniqueness
 * AND preserving the original DOM order of the first occurrence of each unique item.
 * Handles icons, images, iframes, SVGs, pictures, and links.
 * @param {string} content - HTML content of the cell (less used now, prefer cell iteration)
 * @param {Element} cell - Original cell element
 * @returns {Array} Array of unique illustration items in their original order
 */
function extractIllustrationItems(content, cell) {
  const items = [];
  const processedIdentifiers = new Set(); // Use a Set to track unique identifiers

  if (!cell) return items; // Return empty array if cell is null

  // Helper function to add item if unique
  const addUniqueItem = (item, identifier) => {
    if (identifier && !processedIdentifiers.has(identifier)) {
      processedIdentifiers.add(identifier);
      items.push(item);
      return true; // Indicate item was added
    }
    return false; // Indicate item was a duplicate
  };

  // --- Iterate through elements in DOM order ---
  // Query all potential illustration elements within the cell
  // This selector aims to capture relevant elements while respecting DOM order
  const potentialElements = cell.querySelectorAll('picture, iframe, svg, img, span.icon, a[href], p');

  potentialElements.forEach(el => {
    let item = null;
    let identifier = null;
    let added = false;

    // Skip if element is nested inside another already processed element (like img in picture)
    if (processedIdentifiers.has(el.closest('picture')?.querySelector('img')?.getAttribute('src')) && el.tagName === 'IMG') return;
    if (processedIdentifiers.has(el.closest('iframe')?.getAttribute('src')) && el.tagName !== 'IFRAME') return; // Avoid processing content within an already added iframe


    // Determine element type and identifier
    if (el.tagName === 'PICTURE') {
        const img = el.querySelector('img');
        identifier = img ? img.getAttribute('src') : el.innerHTML.substring(0, 100);
        if (identifier){ // Ensure picture has content before adding
             item = { type: 'picture', content: el.outerHTML };
             added = addUniqueItem(item, identifier);
        }
    } else if (el.tagName === 'IFRAME') {
        identifier = el.getAttribute('src');
        if (identifier){
            item = { type: 'iframe', url: identifier, content: el.outerHTML };
            added = addUniqueItem(item, identifier);
        }
    } else if (el.tagName === 'SVG') {
        identifier = 'svg:' + el.innerHTML.substring(0, 100);
        item = { type: 'svg', content: el.outerHTML };
        added = addUniqueItem(item, identifier);
    } else if (el.tagName === 'IMG') {
        // Only process if not inside a picture (already handled)
        if (!el.closest('picture')) {
            identifier = el.getAttribute('src');
            if (identifier){
                item = { type: 'image', content: identifier, alt: el.getAttribute('alt') || '' };
                added = addUniqueItem(item, identifier);
            }
        }
    } else if (el.tagName === 'SPAN' && el.classList.contains('icon')) {
        const iconClass = Array.from(el.classList).find(cls => cls.startsWith('icon-'));
        if (iconClass) {
            const iconName = iconClass.replace('icon-', '');
            identifier = `/icons/${iconName}.svg`;
            item = { type: 'icon', iconName: iconName, content: identifier, alt: `${iconName} Illustration` };
            added = addUniqueItem(item, identifier);
        }
    } else if (el.tagName === 'A' && el.hasAttribute('href')) {
        identifier = el.getAttribute('href');
        if (isImageUrl(identifier)) {
            item = { type: 'image', content: identifier, alt: el.textContent || '' };
            added = addUniqueItem(item, identifier);
        } else if (identifier.match(/^https?:\/\//)) {
            // Treat other http(s) links as potential iframes
            item = { type: 'iframe', url: identifier, content: `<iframe src="${identifier}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>` };
            added = addUniqueItem(item, identifier);
        }
    } else if (el.tagName === 'P') {
        // Check paragraph content specifically for "iframe URL" patterns
        // This handles cases where the pattern isn't wrapped in other elements
        const textContent = el.textContent || '';
        const iframeMatch = textContent.trim().match(/^iframe\s+(https?:\/\/[^\s"'<>]+)$/i);
        if (iframeMatch) {
            identifier = iframeMatch[1];
            item = { type: 'iframe', url: identifier, content: `<iframe src="${identifier}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>` };
            added = addUniqueItem(item, identifier);
        }
         // Also check for plain image URLs in paragraphs
         else if (isImageUrl(textContent.trim())) {
             identifier = textContent.trim();
             item = { type: 'image', content: identifier, alt: '' };
             added = addUniqueItem(item, identifier);
         }
    }

    // Potentially log if an item wasn't added due to duplication (for debugging)
    // if (item && !added) {
    //   console.log('Skipped duplicate item:', identifier);
    // }
  });


  // Final check for basic 'iframe URL' or plain image URL if nothing else was found
  // This catches cases where the URL is the *only* thing in the cell
  if (items.length === 0 && content) {
       const trimmedContent = content.trim();
       const iframeMatch = trimmedContent.match(/^iframe\s+(https?:\/\/[^\s"'<>]+)$/i);
       const imageMatch = isImageUrl(trimmedContent);

       if (iframeMatch) {
           const identifier = iframeMatch[1];
            addUniqueItem({
             type: 'iframe',
             url: identifier,
             content: `<iframe src="${identifier}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
           }, identifier);
       } else if (imageMatch) {
            const identifier = trimmedContent;
             addUniqueItem({
                 type: 'image',
                 content: identifier,
                 alt: ''
           }, identifier);
       }
  }


  return items; // Return the uniquely identified items in DOM order
}

// Ensure the isImageUrl helper function exists (it was already in your dps.js)
function isImageUrl(url) {
  if (!url) return false;
  // Added optional query/fragment check
  return url.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|tiff)($|\?|#)/i) !== null;
}
/**
 * Build all slides in the presentation container
 * @param {Array} slides - Array of slide data
 * @param {Element} container - Container for slides
 */
function buildSlides(slides, container) {
  container.innerHTML = '';
  
  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.id = `slide-${index}`;
    slideElement.className = 'slide';
    
    if (slide.presenterNotes) {
      slideElement.dataset.presenterNotes = slide.presenterNotes;
    }

    if (slide.type === 'qanda') {
      // Use the URL from the presentation subtitle if available
      let subtitleContent = slide.subtitle;
      let linkHtml = '';
      
      // If we have a URL from the presentation subtitle, create a link
      if (slide.subtitleUrl) {
        linkHtml = ` - <a href="${slide.subtitleUrl}" class="qanda-link" target="_blank">Read more about the topic at ${slide.subtitleUrl}</a>`;
      }
      
      // Special Q&A slide handling
      slideElement.innerHTML = `
        <div class="slide-content">
          <h2 class="slide-title">${slide.title}</h2>
          <div class="slide-content-text">
            <p class="slide-subtitle">${subtitleContent}${linkHtml}</p>
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
      // Regular slide
      slideElement.innerHTML = createSlideContent(slide);
    }
    
    container.appendChild(slideElement);
  });
}

/**
 * Create HTML content for a slide
 * @param {Object} slide - Slide data
 * @returns {string} HTML content
 */
function createSlideContent(slide) {
  let slideContent = `<div class="slide-content">
    <h2 class="slide-title">${slide.title}</h2>
    <div class="slide-content-text">`;

  // Add intro text if available
  if (slide.introText) {
    slideContent += `<p style="font-size: 18px; margin-bottom: 20px;">${slide.introText}</p>`;
  }

  // Add bullet points if available
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    slideContent += '<ul class="bullet-list">';
    slide.bulletPoints.forEach((point) => {
      if (point.isPlainText) {
        // Handle plain text or HTML content
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
        // Handle bullet points
        slideContent += `<li>${point.text}</li>`;
      }
    });
    slideContent += '</ul>';
  }

  slideContent += '</div>'; // Close slide-content-text

  // Add illustration if provided
  if (slide.illustration) {
    slideContent += '<div class="illustration">';
    
    if (slide.illustration.type === 'sequence') {
      // Handle sequence of illustrations
      slideContent += createSequenceHTML(slide.illustration.items);
    } else if (slide.illustration.type === 'iframe') {
      // Handle iframe
      slideContent += `<div class="iframe-container">
          ${slide.illustration.content}
        </div>`;
    } else if (slide.illustration.type === 'svg') {
      // Handle SVG
      slideContent += slide.illustration.content;
    } else if (slide.illustration.type === 'picture') {
      // Handle picture
      slideContent += slide.illustration.content;
    } else if (slide.illustration.type === 'icon') {
      // Handle icon
      slideContent += `<img src="${slide.illustration.content}" alt="${slide.illustration.alt}" class="icon-image">`;
    } else {
      // Handle regular image
      slideContent += `<img src="${slide.illustration.content}" alt="${slide.illustration.alt || slide.title} illustration">`;
    }
    
    slideContent += '</div>'; // Close illustration
  }

  slideContent += '</div>'; // Close slide-content
  
  return slideContent;
}

/**
 * Create HTML for a sequence of illustrations
 * @param {Array} items - Array of illustration items
 * @returns {string} HTML content for the sequence
 */
function createSequenceHTML(items) {
  if (!items || items.length === 0) {
    return '';
  }
  
  let html = '<div class="image-sequence">';
  
  // Process each illustration item
  items.forEach((item, index) => {
    const isActive = index === 0;
    const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    
    // Create container for this item
    html += `<div class="sequence-item-container ${isActive ? 'active' : ''}" data-sequence-id="${index}">`;
    
    
    // Add content based on type
    if (item.type === 'iframe') {
      html += `<div class="sequence-image iframe-container ${isActive ? 'active' : ''}">${item.content}</div>`;
    } else if (item.type === 'picture') {
      html += `<div class="sequence-image ${isActive ? 'active' : ''}">${item.content}</div>`;
    } else if (item.type === 'svg') {
      html += `<div class="sequence-image ${isActive ? 'active' : ''}">${item.content}</div>`;
    } else if (item.type === 'icon') {
      html += `<img src="${item.content}" alt="${item.alt}" class="sequence-image icon-image ${isActive ? 'active' : ''}">`;
    } else {
      html += `<img src="${item.content}" alt="${item.alt || ''}" class="sequence-image ${isActive ? 'active' : ''}">`;
    }
    
    html += '</div>'; // Close sequence-item-container
  });
  
  html += '</div>'; // Close image-sequence
  return html;
}
/**
 * Show a specific slide and update UI
 * @param {number} index - Slide index to show
 */
function showSlide(index) {
  // Get all slides
  const slides = document.querySelectorAll('.slide');
  
  // Validate index
  if (index < 0) {
    index = 0;
  } else if (index >= slides.length) {
    index = slides.length - 1;
  }
  
  // Hide all slides
  slides.forEach(slide => {
    slide.style.display = 'none';
    slide.classList.remove('active');
  });
  
  // Show the target slide
  if (slides[index]) {
    const slide = slides[index];
    slide.style.display = 'block';
    slide.classList.add('active');
    
    // Reset sequence index when changing slides
    currentSequenceIndex = 0;
    
    // Update presenter notes
    updatePresenterNotes(index);
    
    // Update navigation buttons
    updateNavButtons(index, slides.length);
  }
  
  // Update current slide index
  currentSlideIndex = index;
  
  // Start timer if moving past first slide
  if (index > 0 && !hasStartedTimer) {
    startTimer();
    hasStartedTimer = true;
  }
}

/**
 * Update the navigation buttons based on current position
 * @param {number} currentIndex - Current slide index
 * @param {number} totalSlides - Total number of slides
 */
function updateNavButtons(currentIndex, totalSlides) {
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');
  
  if (prevButton) {
    prevButton.disabled = currentIndex === 0;
  }
  
  if (nextButton) {
    nextButton.disabled = currentIndex === totalSlides - 1;
  }
}

/**
 * Update presenter notes for the current slide
 * @param {number} slideIndex - Index of the current slide
 * @param {boolean} forceNormalMode - Force normal mode display
 * @param {boolean} isPresenterToggle - Whether this is coming from presenter toggle
 */
function updatePresenterNotes(slideIndex, forceNormalMode = false, isPresenterToggle = false) {
  const slides = document.querySelectorAll('.slide');
  const currentSlide = slides[slideIndex];
  const slideData = currentSlide.dataset.presenterNotes || '';
  const presenterNotes = document.querySelector('.presenter-notes');
  const notesContent = presenterNotes.querySelector('.presenter-notes-content');
  
  // Always use normal mode content when forceNormalMode is true
  if (forceNormalMode) {
    notesContent.innerHTML = slideData;
    return;
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
 * Handle navigation in image sequences
 * @param {string} direction - Direction of navigation ('prev' or 'next')
 * @returns {boolean} Whether the navigation was handled by a sequence
 */
function handleSequenceNavigation(direction) {
  // Get the current slide
  const slide = document.querySelector(`.slide.active`);
  if (!slide) return false;
  
  // Get the image sequence in this slide
  const sequence = slide.querySelector('.image-sequence');
  if (!sequence) return false;
  
  // Get all sequence items
  const items = Array.from(sequence.querySelectorAll('.sequence-item-container'));
  if (items.length <= 1) return false;
  
  // Calculate the next index
  let nextIndex = currentSequenceIndex;
  
  if (direction === 'next') {
    nextIndex++;
    if (nextIndex >= items.length) {
      return false; // Move to next slide
    }
  } else {
    nextIndex--;
    if (nextIndex < 0) {
      return false; // Move to previous slide
    }
  }
  
  // Update the sequence
  updateSequence(items, nextIndex);
  
  // Update the current sequence index
  currentSequenceIndex = nextIndex;
  
  return true;
}

/**
 * Update the sequence to show the specified item
 * @param {Array} items - Array of sequence items
 * @param {number} activeIndex - Index of the item to activate
 */
function updateSequence(items, activeIndex) {
  // Hide all items
  items.forEach(item => {
    item.classList.remove('active');
    
    // Hide all images in this item
    const images = item.querySelectorAll('.sequence-image');
    images.forEach(img => {
      img.classList.remove('active');
    });
  });
  
  // Show the active item
  if (items[activeIndex]) {
    items[activeIndex].classList.add('active');
    
    // Show all images in this item
    const images = items[activeIndex].querySelectorAll('.sequence-image');
    images.forEach(img => {
      img.classList.add('active');
    });
  }
}

/**
 * Set up the navigation system
 */
function setupNavigationSystem() {
  // Set up navigation buttons
  const prevButton = document.querySelector('.prev-slide');
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Check if we're navigating within a sequence
      if (currentSequenceIndex > 0) {
        if (handleSequenceNavigation('prev')) {
          return;
        }
      }
      
      // Otherwise navigate to previous slide
      showSlide(currentSlideIndex - 1);
    });
  }
  
  const nextButton = document.querySelector('.next-slide');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Check if we're navigating within a sequence
      const slide = document.querySelector(`.slide.active`);
      if (slide) {
        const sequence = slide.querySelector('.image-sequence');
        if (sequence) {
          const items = Array.from(sequence.querySelectorAll('.sequence-item-container'));
          if (currentSequenceIndex < items.length - 1) {
            if (handleSequenceNavigation('next')) {
              return;
            }
          }
        }
      }
      
      // Otherwise navigate to next slide
      showSlide(currentSlideIndex + 1);
    });
  }
  
  // Set up keyboard navigation
  document.addEventListener('keydown', (event) => {
    // Ignore repeated keydown events from key being held down
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      // Check if we're navigating within a sequence
      if (currentSequenceIndex > 0) {
        if (handleSequenceNavigation('prev')) {
          return;
        }
      }
      
      // Otherwise navigate to previous slide
      showSlide(currentSlideIndex - 1);
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      // Check if we're navigating within a sequence
      const slide = document.querySelector(`.slide.active`);
      if (slide) {
        const sequence = slide.querySelector('.image-sequence');
        if (sequence) {
          const items = Array.from(sequence.querySelectorAll('.sequence-item-container'));
          if (currentSequenceIndex < items.length - 1) {
            if (handleSequenceNavigation('next')) {
              return;
            }
          }
        }
      }
      
      // Otherwise navigate to next slide
      showSlide(currentSlideIndex + 1);
    }
    else if (event.key === 'Escape') {
      const navBar = document.querySelector('.dps-navigation');
      if (navBar) {
        navBar.style.display = navBar.style.display === 'none' ? 'flex' : 'none';
      }
    }
    else if (event.key === 'p' || event.key === 'P') {
      togglePresenterMode();
    }
    else if (event.key === '+' || event.key === '=') {
      showPresenterNotes();
    }
    else if (event.key === '-' || event.key === '_') {
      hidePresenterNotes();
    }
    else if (event.key === ' ' && hasStartedTimer) {
      event.preventDefault();
      toggleTimer();
    }
  });
}

/**
 * Set up the presenter toggle button
 */
function setupPresenterToggle() {
  const presenterToggleButton = document.querySelector('.presenter-toggle');
  if (presenterToggleButton) {
    presenterToggleButton.addEventListener('click', togglePresenterMode);
  }
}

/**
 * Show presenter notes
 */
function showPresenterNotes() {
  const presenterNotes = document.querySelector('.presenter-notes');
  presenterNotes.classList.remove('hidden');
  DPS_CONFIG.PRESENTER_NOTES_VISIBLE = true;
}

/**
 * Hide presenter notes
 */
function hidePresenterNotes() {
  const presenterNotes = document.querySelector('.presenter-notes');
  presenterNotes.classList.add('hidden');
  DPS_CONFIG.PRESENTER_NOTES_VISIBLE = false;
}

/**
 * Start the presentation timer
 */
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Toggle the timer on/off
 */
function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Update the timer display
 */
function updateTimer() {
  if (remainingTime > 0) {
    remainingTime--;
    document.querySelector('.timer').textContent = formatTime(remainingTime);

    // Flash warning when 2 minutes remain
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
  const container = document.querySelector('.dps-wrapper');
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
 * Toggle presenter mode on/off
 */
function togglePresenterMode() {
  const presenterNotes = document.querySelector('.presenter-notes');
  
  if (!presenterNotes) return;
  
  const isPresenterMode = presenterNotes.classList.contains('presenter-mode');
  const header = document.querySelector('.dps-header');
  const footer = document.querySelector('.dps-footer');
  const slides = document.querySelectorAll('.slide');
  const currentSlide = slides[currentSlideIndex];
  const presenterButton = document.querySelector('.presenter-toggle');
  
  if (!isPresenterMode) {
    // First make presenter notes visible by removing 'hidden' class if present
    presenterNotes.classList.remove('hidden');
    
    // Hide header and slides but keep footer
    if (header) header.style.display = 'none';
    if (slides.length > 0) {
      slides.forEach(slide => slide.style.display = 'none');
      if (currentSlide) currentSlide.style.display = 'none';
    }
    
    // Highlight presenter button
    if (presenterButton) presenterButton.classList.add('active');
 
    // Show notes in full screen
    presenterNotes.classList.add('presenter-mode');
 
    // Adjust positioning and styling
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
    if (header) header.style.display = '';
    if (slides.length > 0) {
      slides.forEach(slide => slide.style.display = '');
      if (currentSlide) currentSlide.style.display = 'block';
    }
    
    // Remove button highlight
    if (presenterButton) presenterButton.classList.remove('active');
 
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
    
    // Update presenter notes with standard content
    updatePresenterNotes(currentSlideIndex);
  }
}

/**
 * Set up the resize handler for presenter notes
 */
function setupResizeHandler() {
  const notes = document.querySelector('.presenter-notes');
  const title = notes?.querySelector('.presenter-notes-title');

  if (!notes || !title) return;

  let isResizing = false;
  let startY = 0;
  let startHeight = 0;

  title.addEventListener('mousedown', (e) => {
    isResizing = true;
    startY = e.clientY;
    startHeight = parseInt(window.getComputedStyle(notes).height, 10);
    e.preventDefault();
    
    document.body.style.userSelect = 'none'; // Prevent text selection during resize
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const delta = startY - e.clientY;
    notes.style.height = `${Math.max(100, Math.min(window.innerHeight - 100, startHeight + delta))}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = ''; // Restore text selection
    }
  });
}





/**
 * Add CSS styles for the presentation
 * This function adds all necessary styles for the DPS block
 */
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Override section padding for DPS block */
    main .section {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    main .section > div {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
    }

    main .section > div > .dps {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
    }

    /* Comprehensive reset for DPS block */
    .dps * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Reset styles */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* Force full viewport mode */
    body.dps-fullscreen {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    /* hide the H1 outside the DPS block */
    body.dps-fullscreen main .section.dps-container > .default-content-wrapper {
      display: none;
}

    body.dps-fullscreen main {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    body.dps-fullscreen main .section {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    body.dps-fullscreen main .section > div {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    /* Block wrapper styling - primary styling container */
    .dps-wrapper {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: none;
      position: relative;
    }

    /* Error display */
    .dps-error {
      padding: 20px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin: 10px 0;
    }

    /* Inner content wrapper for consistent margins */
    .header-content,
    .slide-content,
    .footer-content {
      width: 100%;
      padding: 0 10px;
      max-width: 100%;
    }

    /* Header styling */
    .dps-header {
      width: 100%;
      padding: 10px 0;
      background-color: #2c3e50;
      color: white;
      text-align: center;
    }

    .dps-header h1 {
      font-size: 24px;
    }

    .dps-header p {
      font-size: 14px;
      opacity: 0.9;
    }

    /* Content area */
    .slides-container {
      flex: 1;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      background-color: #fff;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Slide styling */
    .slide {
      width: 100%;
      max-width: 100%;
      flex: 1;
      display: none;
      padding: 0;
      min-height: 0;
    }

    .slide.active {
      display: flex;
      flex-direction: column;
    }

    /* Slide content layout */
    .slide-content {
      display: grid;
      grid-template-areas: 
          "title title"
          "text illustration";
      grid-template-columns: 40% 60%;
      grid-template-rows: auto 1fr;
      gap: 20px;
      padding: 20px;
      padding-bottom: 80px;
      height: calc(100vh - 120px);
      min-height: 0;
    }

    /* Slide title */
    .slide-title {
      grid-area: title;
      font-size: 28px;
      color: #2c3e50;
      padding-bottom: 15px;
      margin-bottom: 20px;
      border-bottom: 2px solid #3498db;
      width: 100%;
    }

    /* First line styling */
    .slide-content-text > p:first-child {
      font-size: 24px !important;
      font-weight: bold;
      margin-bottom: 30px !important;
      color: #2c3e50;
      line-height: 1.3;
    }

    /* Text content area */
    .slide-content-text {
      grid-area: text;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding-right: 10px;
    }

    /* Illustration area */
    .illustration {
      grid-area: illustration;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      height: calc(100vh - 200px);
      position: relative;
    }

    .illustration img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    /* iframe container styling */
    .iframe-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    /* iframe styling */
    .iframe-container iframe {
      width: 100%;
      height: 100%;
      max-height: calc(100vh - 200px);
      object-fit: contain;
      background-color: #fff;
      border: none;
      box-shadow: none;
      aspect-ratio: 16/9;
    }

    /* Handle forced-colors mode */
    @media (forced-colors: active) {
      .iframe-container {
        border: 1px solid CanvasText;
      }
      
      .iframe-container iframe {
        border: 1px solid CanvasText;
      }
    }

    /* Bullet lists */
    .bullet-list {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .bullet-list li {
      position: relative;
      padding-left: 25px;
      font-size: 20px;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    .bullet-list li:before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      width: 10px;
      height: 10px;
      background-color: #3498db;
      border-radius: 50%;
    }

    /* Plain text items in bullet list */
    .bullet-list li.plain-text {
      padding-left: 0;
      list-style: none;
      white-space: pre-line;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    .bullet-list li.plain-text:before {
      display: none;
    }

    /* Footer styling */
    .dps-footer {
      width: 100%;
      padding: 10px 0;
      background-color: #ecf0f1;
      border-top: 1px solid #ddd;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 100;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    /* Navigation arrows */
    .nav-arrows {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-arrow {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s ease;
    }

    .nav-arrow:hover {
      opacity: 0.8;
    }

    .nav-arrow svg {
      width: 24px;
      height: 24px;
      fill: #2c3e50;
    }

    .nav-arrow:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    /* Timer styling */
    .timer {
      font-weight: bold;
      font-size: 16px;
      color: #2c3e50;
    }

    /* Q&A slide */
    .qanda-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      height: 100%;
    }

    .qanda-circle {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background-color: #3498db;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      margin: 0 auto;
    }

    .thank-you-text {
      font-size: 24px;
      color: #2c3e50;
      text-align: center;
      font-weight: 500;
      margin-top: 20px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .header-content,
      .slide-content,
      .footer-content {
        width: 90%;
      }

      .bullet-list li {
        font-size: 16px;
      }

      .qanda-circle {
        width: 180px;
        height: 180px;
      }

      .slide-content {
        grid-template-areas: 
          "title"
          "text"
          "illustration";
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
      }

      .thank-you-text {
        font-size: 20px;
      }
    }

    /* Image sequence styling */
    .image-sequence {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .sequence-item-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
    }

    .sequence-item-container.active {
      display: block;
    }


    .sequence-image {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      margin: 0 auto;
      display: block;
    }

    .sequence-image.iframe-container {
      width: 100%;
      height: 100%;
    }

    /* Presenter notes styling */
    .presenter-notes {
      position: fixed;
      bottom: 60px;
      left: 20px;
      width: 31.25vw;
      height: 25vh;
      background-color: rgba(236, 240, 241, 0.95);
      color: #2c3e50;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      overflow-y: auto;
      font-size: 14px;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }

    .presenter-notes.hidden {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }

    .presenter-notes-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(44, 62, 80, 0.3);
      color: #2c3e50;
      cursor: ns-resize;
    }

    .presenter-notes-content {
      line-height: 1.4;
      color: #2c3e50;
    }

    .presenter-notes.presenter-mode .presenter-notes-content {
      font-size: 18px;
    }

    /* Presenter toggle button styles */
    .presenter-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      margin-left: 10px;
      color: #2c3e50;
      transition: all 0.2s ease;
    }

    .presenter-toggle svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .presenter-toggle:hover {
      color: #3498db;
    }

    .presenter-toggle.active {
      color: #3498db;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    /* Print styles for handouts */
    @media print {
      .dps-wrapper {
        height: auto;
        box-shadow: none;
      }

      .dps-header,
      .dps-footer {
        display: none;
      }

      .slides-container {
        overflow: visible;
      }

      .slide {
        display: block !important;
        page-break-after: always;
        min-height: 90vh;
      }

      .slide:last-child {
        page-break-after: avoid;
      }
      
      .presenter-notes {
        display: none;
      }
    }
    
    /* Q&A slide link styling */
    .qanda-link {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease, text-decoration 0.2s ease;
    }
    
    .qanda-link:hover {
      color: #2980b9;
      text-decoration: underline;
    }
  `;
  
  document.head.appendChild(style);
}

// Call addStyles when this file is loaded
addStyles();
