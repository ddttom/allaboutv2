/**
 * Dynamic Presentation System (DPS) Block
 * Transforms a structured div (from Google Doc table) into an interactive presentation
 * Features:
 * - Full-screen presentation mode
 * - Keyboard navigation
 * - Multiple images per slide with sequence support
 * - Presenter notes with toggle
 * - Timer with warning system
 * - Responsive design
 * - Print-friendly handout mode
 */

export default function decorate(block) {
  try {
    // Add dps-block class to the container for styling and identification
    block.classList.add("dps-block");

    /* Configuration object for presentation settings
     * - TIMER_DURATION: Default 25 minutes in seconds
     * - SLIDE_TRANSITION_MS: Animation duration for slide transitions
     * - PRESENTER_NOTES_VISIBLE: Initial state of presenter notes panel
     */
    const DPS_CONFIG = {
      TIMER_DURATION: 25 * 60,
      SLIDE_TRANSITION_MS: 300,
      PRESENTER_NOTES_VISIBLE: false,
    };

    // Get the rows (each row was a table row in the Google Doc)
    const rows = Array.from(block.children);

    // Validate minimum required structure
    if (rows.length < 2) {
      block.innerHTML =
        '<div class="dps-error">Error: DPS block requires at least a configuration row and one slide row.</div>';
      return;
    }

    // Extract presentation data from the rows
    const presentationData = parseRows(rows);

    /* Create main presentation container
     * This container holds all presentation elements:
     * - Header with title and controls
     * - Slides container
     * - Presenter notes panel
     * - Footer with timer
     */
    const presentationContainer = document.createElement("div");
    presentationContainer.className = "dps-container";

    // Create header section with title and subtitle
    const header = document.createElement("div");
    header.className = "dps-header";
    header.innerHTML = `
      <div class="header-content">
        <h1 id="presentation-title">${presentationData.title}</h1>
        <p id="presentation-subtitle">${presentationData.subtitle || ""}</p>
      </div>
    `;

    /* Create fullscreen toggle button
     * - Uses SVG icon for crisp rendering
     * - Includes accessibility attributes
     * - Positioned in top-right corner
     */
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.className = "fullscreen-btn";
    fullscreenBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="#FFF"/></svg>';
    fullscreenBtn.title = "Toggle fullscreen";
    fullscreenBtn.setAttribute(
      "aria-label",
      "Toggle fullscreen presentation mode"
    );
    header.appendChild(fullscreenBtn);

    // Create slides container for dynamic slide content
    const slidesContainer = document.createElement("div");
    slidesContainer.className = "slides-container";
    slidesContainer.id = "slides-container";

    /* Create presenter notes container
     * - Hidden by default
     * - Toggleable with keyboard shortcuts
     * - Excluded from print mode
     */
    const presenterNotesContainer = document.createElement("div");
    presenterNotesContainer.className = "presenter-notes hidden";
    presenterNotesContainer.innerHTML = `
      <div class="presenter-notes-title">Presenter Notes</div>
      <div class="presenter-notes-content"></div>
    `;
    
    /* Create footer section
     * - Fixed position at bottom
     * - Contains navigation arrows and timer
     * - Hidden in print mode
     */
    const footer = document.createElement("div");
    footer.className = "dps-footer";
    footer.innerHTML = `
      <div class="footer-content">
        <div class="footer-controls">
          <button class="nav-btn prev-slide" aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </button>
          <button class="nav-btn next-slide" aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L10 18l6-6-6-6L8.59 7.41 13.17 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="timer">${formatTime(
          presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION
        )}</div>
      </div>
    `;

    // Assemble presentation container with all components
    presentationContainer.appendChild(header);
    presentationContainer.appendChild(slidesContainer);
    presentationContainer.appendChild(presenterNotesContainer);
    presentationContainer.appendChild(footer);

    // Replace original block content with presentation
    block.textContent = "";
    block.appendChild(presentationContainer);

    // Build slides from parsed content
    buildSlides(presentationData.slides, slidesContainer);

    /* Set up presentation controls
     * - Keyboard navigation
     * - Timer functionality
     * - Presenter notes toggle
     * - Slide transitions
     */
    setupControls(
      slidesContainer,
      presenterNotesContainer,
      presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION,
      DPS_CONFIG
    );

    // Set up fullscreen toggle functionality
    setupFullscreenToggle(fullscreenBtn, block);

    // Trigger fullscreen mode on startup after a short delay
    setTimeout(() => {
      fullscreenBtn.click();
    }, 100);
  } catch (error) {
    console.error('Error in DPS block initialization:', error);
    block.innerHTML = '<div class="dps-error">Error initializing presentation. Please check the console for details.</div>';
  }
}

/**
 * Parse rows from the Franklin-rendered structure
 * First row contains presentation configuration:
 * - Column 1: Presentation title
 * - Column 2: Subtitle
 * - Column 3: Timer duration in minutes
 * 
 * Subsequent rows contain slide content:
 * - Column 1: Slide title
 * - Column 2: Introduction text
 * - Column 3: Bullet points
 * - Column 4: Illustrations (images, SVG, iframes)
 * - Column 5: Presenter notes
 * 
 * @param {HTMLCollection} rows - Collection of table rows
 * @returns {Object} Parsed presentation data
 */
function parseRows(rows) {
  // First row contains presentation information
  const configRow = rows[0];
  const configCells = Array.from(configRow.children);

  /* Initialize presentation data structure
   * - title: Main presentation title
   * - subtitle: Optional subtitle
   * - timerDuration: Presentation duration in minutes
   * - slides: Array of slide objects
   */
  const presentationData = {
    title: getElementContent(configCells[0]),
    subtitle: getElementContent(configCells[1]),
    timerDuration: parseInt(getElementContent(configCells[2])) || 25,
    slides: [],
  };

  // Process slide rows (skip first row as it's configuration)
  for (let i = 1; i < rows.length; i++) {
    const slideRow = rows[i];
    const slideCells = Array.from(slideRow.children);

    // Skip rows with insufficient cells
    if (slideCells.length < 3) continue;

    /* Create slide object with parsed content
     * - title: Slide heading
     * - introText: Introduction or subtitle
     * - bulletPoints: Array of bullet points and text
     * - illustration: Images, SVG, or iframes
     * - presenterNotes: Private notes for presenter
     */
    const slide = {
      title: getElementContent(slideCells[0]),
      introText: getElementContent(slideCells[1]),
      bulletPoints: parseBulletPoints(slideCells[2]),
      illustration: parseIllustration(slideCells[3]),
      presenterNotes: slideCells[4] ? getElementContent(slideCells[4]) : '',
    };

    presentationData.slides.push(slide);
  }

  /* Add Q&A slide at the end
   * - Standard format for all presentations
   * - Includes thank you message
   * - Provides space for audience interaction
   */
  presentationData.slides.push({
    type: "qanda",
    title: "Questions & Answers",
    subtitle: "Your feedback and questions are valuable",
    thankYouText: "Thank You For Your Attention",
    presenterNotes: "Final slide - Open for questions and discussion"
  });

  return presentationData;
}

/**
 * Get content from an element
 * Handles different content types:
 * - Preserves HTML in presenter notes
 * - Uses textContent for other columns
 * 
 * @param {HTMLElement} element - DOM element to extract content from
 * @returns {string} Extracted content
 */
function getElementContent(element) {
  if (!element) return "";
  
  /* Special handling for presenter notes (5th column)
   * - Preserves HTML formatting
   * - Allows rich text in notes
   */
  if (element.parentElement && element.parentElement.parentElement && 
      element.parentElement.parentElement.children.length === 5 && 
      element.parentElement.parentElement.children[4] === element) {
    return element.innerHTML.trim();
  }
  
  // For other columns, use textContent to strip HTML
  return element.textContent.trim();
}

/**
 * Parse bullet points from a cell
 * Handles various content types:
 * - Bullet points with sub-points
 * - Plain text
 * - HTML formatted content
 * - Line breaks
 * 
 * @param {HTMLElement} cell - Table cell containing bullet points
 * @returns {Array} Array of bullet point objects
 */
function parseBulletPoints(cell) {
  if (!cell) return [];

  const bulletPoints = [];
  const listItems = cell.querySelectorAll("li");
  const textContent = cell.innerHTML.trim();

  if (!textContent) return [];

  /* Create map of list items for efficient lookup
   * - Maps text content to structured objects
   * - Preserves original formatting
   * - Supports nested sub-points
   */
  const listItemMap = new Map();
  Array.from(listItems).forEach((li) => {
    const text = li.innerHTML.trim();
    if (text) {
      listItemMap.set(text, {
        text: text,
        subPoints: [],
      });
    }
  });

  /* Create temporary div for HTML parsing
   * - Preserves original HTML structure
   * - Allows processing of mixed content
   */
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = textContent;

  /* Process each child node in order
   * - Handles text nodes and HTML elements
   * - Preserves formatting and structure
   * - Supports mixed content types
   */
  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Handle text nodes
      const text = node.textContent.trim();
      if (text) {
        // Split text by newlines and process each line
        const lines = text.split(/\n|\r\n/).filter(line => line.trim());
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;

          // Check if this line matches a list item
          if (listItemMap.has(trimmedLine)) {
            bulletPoints.push(listItemMap.get(trimmedLine));
          } else {
            bulletPoints.push({
              text: trimmedLine,
              subPoints: [],
              isPlainText: true
            });
          }
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Handle HTML elements
      if (node.tagName === 'LI') {
        const text = node.innerHTML.trim();
        if (text) {
          bulletPoints.push({
            text: text,
            subPoints: [],
          });
        }
      } else if (node.tagName === 'BR') {
        // Handle line breaks explicitly
        bulletPoints.push({
          text: '<br>',
          subPoints: [],
          isPlainText: true,
          isHTML: true
        });
      } else {
        // For other elements (like <p>, <code>, <strong>), preserve their HTML
        const text = node.outerHTML.trim();
        if (text) {
          bulletPoints.push({
            text: text,
            subPoints: [],
            isPlainText: true,
            isHTML: true
          });
        }
      }
    }
  });

  return bulletPoints;
}

/**
 * Parse illustration from a cell
 * Supports multiple content types:
 * - Picture elements with responsive images
 * - Direct images
 * - SVG content (both element and inline)
 * - iframes in various formats
 * - Franklin link format
 * 
 * @param {HTMLElement} cell - Table cell containing illustration
 * @returns {Object|null} Parsed illustration data
 */
function parseIllustration(cell) {
  if (!cell) return null;

  // Get all paragraph and div elements
  const elements = cell.querySelectorAll('p, div');
  if (elements.length === 0) return null;

  // Array to store all illustrations found
  const illustrations = [];

  /* Process each element in order
   * - Checks for different content types
   * - Preserves original structure
   * - Handles various URL formats
   */
  elements.forEach(element => {
    const content = element.innerHTML.trim();

    /* Check for picture element first
     * - Supports responsive images
     * - Handles multiple formats
     * - Preserves original attributes
     */
    const picture = element.querySelector('picture');
    if (picture) {
      illustrations.push({
        type: "picture",
        content: picture.outerHTML
      });
      return;
    }

    /* Check for direct image
     * - Simple img elements
     * - Preserves alt text
     */
    const img = element.querySelector('img');
    if (img) {
      illustrations.push({
        type: "image",
        content: img.src,
        alt: img.alt || ""
      });
      return;
    }

    /* Check for SVG element
     * - Both direct and inline SVG
     * - Preserves all SVG attributes
     */
    const svg = element.querySelector('svg');
    if (svg) {
      illustrations.push({
        type: "svg",
        content: svg.outerHTML,
      });
      return;
    }

    /* Check if content contains SVG tags
     * - Handles inline SVG content
     * - Attempts to parse and validate
     */
    if (content.startsWith("<svg") && content.includes("</svg>")) {
      try {
        const container = document.createElement("div");
        container.innerHTML = content;
        const parsedSvg = container.querySelector("svg");
        if (parsedSvg) {
          illustrations.push({
            type: "svg",
            content: parsedSvg.outerHTML,
          });
          return;
        }
      } catch (e) {
        illustrations.push({
          type: "svg",
          content: content,
        });
        return;
      }
    }

    /* Check for standard iframe
     * - Preserves original attributes
     * - Adds required attributes if missing
     */
    const iframe = element.querySelector('iframe');
    if (iframe) {
      illustrations.push({
        type: "iframe",
        content: iframe.outerHTML,
        src: iframe.src
      });
      return;
    }

    /* Check for iframe without src attribute
     * - Handles malformed iframe content
     * - Extracts URL from content
     */
    const iframeMatch = content.match(/<iframe[^>]*>(.*?)<\/iframe>/i);
    if (iframeMatch) {
      const url = extractUrl(iframeMatch[1]);
      if (url) {
        illustrations.push({
          type: "iframe",
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
          src: url
        });
        return;
      }
    }

    /* Check for HTML encoded iframe
     * - Handles escaped HTML content
     * - Decodes HTML entities
     */
    const encodedIframeMatch = content.match(/&#x3C;iframe[^>]*>([^<]+)&#x3C;\/iframe>/);
    if (encodedIframeMatch) {
      const url = decodeHTMLEntities(encodedIframeMatch[1]);
      if (url) {
        illustrations.push({
          type: "iframe",
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
          src: url
        });
        return;
      }
    }

    /* Check for paragraph wrapped HTML encoded iframe
     * - Handles nested HTML entities
     * - Preserves paragraph structure
     */
    const paragraphIframeMatch = content.match(/<p[^>]*>&#x3C;iframe[^>]*>([^<]+)&#x3C;\/iframe><\/p>/);
    if (paragraphIframeMatch) {
      const url = decodeHTMLEntities(paragraphIframeMatch[1]);
      if (url) {
        illustrations.push({
          type: "iframe",
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
          src: url
        });
        return;
      }
    }

    /* Check for direct URL
     * - Handles both image and iframe URLs
     * - Preserves relative paths
     */
    const url = extractUrl(content);
    if (url) {
      // Check if it's an image URL
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        illustrations.push({
          type: "image",
          content: url,
          alt: ""
        });
        return;
      }
      // If not an image, treat as iframe source
      illustrations.push({
        type: "iframe",
        content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
        src: url
      });
      return;
    }

    /* Check for Franklin link format
     * - Handles both image and iframe links
     * - Preserves link text as alt text
     */
    const link = element.querySelector('a');
    if (link && link.href) {
      const href = link.href;
      if (href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        illustrations.push({
          type: "image",
          content: href,
          alt: link.textContent || ""
        });
      } else {
        illustrations.push({
          type: "iframe",
          content: `<iframe src="${href}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
          src: href
        });
      }
    }
  });

  // If we found any illustrations, return them
  if (illustrations.length > 0) {
    return {
      type: "images",
      content: illustrations
    };
  }

  // If no recognized illustration format, return null
  return null;
}

/**
 * Extract URL from content
 * Handles various URL formats:
 * - Absolute URLs (http/https)
 * - Relative URLs
 * - iframe prefixed URLs
 * 
 * @param {string} content - Content to extract URL from
 * @returns {string|null} Extracted URL or null if not found
 */
function extractUrl(content) {
  if (!content) return null;
  
  // Clean up any malformed URLs
  content = content.replace(/\s+/g, '').replace(/["']/g, '');
  
  // Check for iframe prefix
  if (content.startsWith('iframe=')) {
    content = content.substring(7);
  }
  
  // Match URLs
  const urlMatch = content.match(/https?:\/\/[^\s<>"']+|\/[^\s<>"']+/);
  return urlMatch ? urlMatch[0] : null;
}

/**
 * Decode HTML entities in a string
 * Handles various HTML entity formats:
 * - Numeric entities
 * - Named entities
 * - Mixed content
 * 
 * @param {string} text - Text containing HTML entities
 * @returns {string|null} Decoded text or null if invalid
 */
function decodeHTMLEntities(text) {
  if (!text) return null;
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  const decoded = textarea.value;
  
  // Extract URL if present
  return extractUrl(decoded);
}

/**
 * Build slides in the container
 * Creates slide elements with:
 * - Title and content
 * - Bullet points
 * - Illustrations
 * - Presenter notes
 * 
 * @param {Array} slides - Array of slide data
 * @param {HTMLElement} container - Container to build slides in
 */
function buildSlides(slides, container) {
  container.innerHTML = "";
  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    const slideElement = document.createElement("div");
    slideElement.id = `slide-${index}`;
    slideElement.className = "slide";
    
    // Store presenter notes in the slide's dataset
    if (slide.presenterNotes) {
      slideElement.dataset.presenterNotes = slide.presenterNotes;
    }

    /* Special handling for Q&A slides
     * - Custom layout
     * - Question mark icon
     * - Thank you message
     */
    if (slide.type === "qanda") {
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
            <p class="thank-you-text">${slide.thankYouText || "Thank You"}</p>
          </div>
        </div>
      `;
    } else {
      /* Standard slide content
       * - Title section
       * - Content area with bullet points
       * - Illustration area
       */
      let slideContent = `
        <div class="slide-content">
          <h2 class="slide-title">${slide.title}</h2>
          <div class="slide-content-text">
      `;

      // Add content text or bullet points
      if (slide.introText) {
        slideContent += `<p style="font-size: 18px; margin-bottom: 20px;">${slide.introText}</p>`;
      }

      /* Build bullet points list
       * - Handles plain text
       * - Supports HTML content
       * - Includes sub-bullets
       */
      if (slide.bulletPoints && slide.bulletPoints.length > 0) {
        slideContent += '<ul class="bullet-list">';
        slide.bulletPoints.forEach((point) => {
          if (point.isPlainText) {
            // For plain text or HTML content, render without bullet styling
            if (point.isHTML) {
              // For HTML content, render the HTML directly
              if (point.text === '<br>') {
                slideContent += '<br>';
              } else {
                slideContent += `<li class="plain-text">${point.text}</li>`;
              }
            } else {
              // For plain text, render as text
              slideContent += `<li class="plain-text">${point.text}</li>`;
            }
          } else {
            // For bullet points, render with bullet styling
            slideContent += `<li>${point.text}`;

            // Add sub-bullets if they exist
            if (point.subPoints && point.subPoints.length > 0) {
              slideContent += '<ul class="sub-bullet-list">';
              point.subPoints.forEach((subPoint) => {
                slideContent += `<li>${subPoint}</li>`;
              });
              slideContent += "</ul>";
            }

            slideContent += "</li>";
          }
        });
        slideContent += "</ul>";
      }

      slideContent += "</div>"; // Close slide-content-text

      /* Add illustration if provided
       * - Supports multiple content types
       * - Handles image sequences
       * - Maintains aspect ratio
       */
      if (slide.illustration) {
        slideContent += `
          <div class="illustration">
            ${
              slide.illustration.type === "images"
                ? `<div class="image-sequence">
                    ${slide.illustration.content.map((item, index) => {
                      if (item.type === "iframe") {
                        return `<div class="iframe-container sequence-image ${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}">
                          <iframe src="${item.src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>
                        </div>`;
                      } else if (item.type === "picture") {
                        return `<div class="sequence-image ${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}">
                          ${item.content}
                        </div>`;
                      }
                      return `<img 
                        src="${item.content}" 
                        alt="${item.alt}" 
                        class="sequence-image ${index === 0 ? 'active' : ''}" 
                        style="display: ${index === 0 ? 'block' : 'none'}">`;
                    }).join('')}
                   </div>`
                : slide.illustration.type === "iframe"
                ? `<div class="iframe-container">
                    <iframe src="${slide.illustration.src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>
                   </div>`
                : slide.illustration.type === "svg"
                ? slide.illustration.content
                : slide.illustration.type === "picture"
                ? slide.illustration.content
                : `<img src="${slide.illustration.content}" alt="${slide.title} illustration">`
            }
          </div>
        `;
      }
    }
  });
}

/**
 * Set up presentation controls
 * Handles:
 * - Keyboard navigation
 * - Timer functionality
 * - Presenter notes toggle
 * - Slide transitions
 * - Click navigation
 * 
 * @param {HTMLElement} slidesContainer - Container holding all slides
 * @param {HTMLElement} presenterNotesContainer - Container for presenter notes
 * @param {number} timerDuration - Duration in seconds
 * @param {Object} DPS_CONFIG - Presentation configuration
 */
function setupControls(slidesContainer, presenterNotesContainer, timerDuration, DPS_CONFIG) {
  // Validate required elements
  if (!slidesContainer || !presenterNotesContainer) {
    console.error('Required containers not found for setupControls');
    return;
  }

  const slides = slidesContainer.querySelectorAll('.slide');
  if (!slides || slides.length === 0) {
    console.error('No slides found in container');
    return;
  }

  let currentSlide = 0;
  const totalSlides = slides.length;

  /* Navigation function
   * - Handles both keyboard and click navigation
   * - Updates current slide
   * - Manages slide transitions
   */
  function navigate(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
      // Remove active class from current slide
      slides[currentSlide].classList.remove('active');
      // Add active class to new slide
      slides[newSlide].classList.add('active');
      currentSlide = newSlide;
      
      // Update presenter notes if visible
      if (!presenterNotesContainer.classList.contains('hidden')) {
        const notes = slides[currentSlide].dataset.presenterNotes;
        const notesContent = presenterNotesContainer.querySelector('.presenter-notes-content');
        if (notesContent) {
          notesContent.innerHTML = notes || '';
        }
      }
    }
  }

  /* Set up keyboard navigation
   * - Left/Right arrows for slides
   * - Space for timer
   * - +/- for presenter notes
   */
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
      case ' ':
        toggleTimer();
        break;
      case '+':
      case '=':
        presenterNotesContainer.classList.remove('hidden');
        break;
      case '-':
        presenterNotesContainer.classList.add('hidden');
        break;
    }
  });

  /* Set up click navigation
   * - Previous/Next buttons in footer
   * - Uses same navigation function as keyboard
   */
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigate(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(1));
  }

  /* Timer functionality
   * - Countdown from specified duration
   * - Visual warning when time is running low
   * - Pause/Resume with space bar
   */
  let timeLeft = timerDuration;
  let timerInterval;
  const timerDisplay = document.querySelector('.timer');
  let isTimerRunning = false;

  function toggleTimer() {
    if (!timerDisplay) return;
    
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
    } else {
      isTimerRunning = true;
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerDisplay.textContent = 'Time Up!';
          timerDisplay.classList.add('warning');
          return;
        }
        if (timeLeft <= 120) { // 2 minutes warning
          timerDisplay.classList.add('warning');
        }
        timerDisplay.textContent = formatTime(timeLeft);
      }, 1000);
    }
  }

  // Start with first slide active
  slides[0].classList.add('active');
}

/**
 * Set up fullscreen toggle
 * Handles:
 * - Fullscreen API
 * - Fallback for older browsers
 * - Keyboard shortcuts
 * 
 * @param {HTMLElement} fullscreenBtn - Fullscreen toggle button
 * @param {HTMLElement} block - Main presentation block
 */
function setupFullscreenToggle(fullscreenBtn, block) {
  // Implementation of setupFullscreenToggle function
}

/**
 * Format time in MM:SS format
 * 
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  // Implementation of formatTime function
}