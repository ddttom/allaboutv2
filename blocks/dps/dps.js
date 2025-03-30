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

export default function decorate(block) {
  // Add dps-block class to the container for proper styling isolation
  block.classList.add("dps-block");

  /* Configuration object for presentation settings
   * - Timer duration defaults to 25 minutes
   * - Slide transitions use 300ms for smooth animation
   * - Presenter notes start hidden by default
   */
  const DPS_CONFIG = {
    TIMER_DURATION: 25 * 60,
    SLIDE_TRANSITION_MS: 300,
    PRESENTER_NOTES_VISIBLE: false,
  };

  /**
   * Format time as MM:SS
   * Ensures consistent time display format
   *
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

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
  const presentationContainer = document.createElement("div");
  presentationContainer.className = "dps-container";

  /* Create header section with title and subtitle
   */
  const header = document.createElement("div");
  header.className = "dps-header";
  header.innerHTML = `
    <div class="header-content">
      <h1 id="presentation-title">${presentationData.title}</h1>
      <p id="presentation-subtitle">${presentationData.subtitle || ""}</p>
    </div>
  `;

  /* Create slides container
   * This will hold all slides and handle their display/hide logic
   */
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides-container";
  slidesContainer.id = "slides-container";

  /* Create presenter notes container
   * Initially hidden, can be toggled with keyboard shortcuts
   */
  const presenterNotesContainer = document.createElement("div");
  presenterNotesContainer.className = "presenter-notes hidden";
  presenterNotesContainer.innerHTML = `
    <div class="presenter-notes-title">Presenter Notes</div>
    <div class="presenter-notes-content"></div>
  `;
  
  /* Create footer section with navigation and timer
   * Navigation arrows provide visual controls for slide progression
   * Timer shows remaining presentation time
   */
  const footer = document.createElement("div");
  footer.className = "dps-footer";
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
    </div>
  `;

  // Append all elements to the presentation container
  presentationContainer.appendChild(header);
  presentationContainer.appendChild(slidesContainer);
  presentationContainer.appendChild(presenterNotesContainer);
  presentationContainer.appendChild(footer);

  // Replace the block content with our presentation
  block.textContent = "";
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
  document.body.classList.add("dps-fullscreen");
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
  const configRow = rows[0].querySelector("div");
  const title = configRow.textContent.trim();
  const subtitle = rows[0].querySelector("div:nth-child(2)")?.textContent.trim() || "";
  const timerDuration = parseInt(rows[0].querySelector("div:nth-child(3)")?.textContent.trim() || "25", 10);

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
    const introText = cells[1]?.textContent.trim() || "";
    
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
      const bulletItems = bulletContent.split("<br>");
      
      bulletItems.forEach(item => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
          /* Identify content type:
           * - Plain text: No bullet markers
           * - HTML: Contains HTML tags
           * - Bullet points: Contains bullet markers
           */
          const isPlainText = !trimmedItem.includes("•") && !trimmedItem.includes("<li>");
          const isHTML = trimmedItem.includes("<") && trimmedItem.includes(">");
          
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
    const presenterNotes = cells[4]?.innerHTML.trim() || "";
    
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
    type: "qanda",
    title: "Questions & Answers",
    subtitle: "Your feedback and questions are valuable",
    thankYouText: "Thank You For Your Attention"
  });
  
  return {
    title,
    subtitle,
    timerDuration,
    slides
  };
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
  const iframeMatch = content.match(/<iframe[^>]*src=["']([^"']*)["'][^>]*>/i) || 
                      content.match(/<iframe[^>]*>([^<]*)<\/iframe>/i) ||
                      content.match(/<iframe\s+([^>]*)>/i);
  
  if (iframeMatch) {
    /* Extract src from iframe tag
     * Handles various URL formats and encodings
     */
    let src = "";
    if (iframeMatch[1]) {
      if (iframeMatch[1].includes('src=')) {
        const srcMatch = iframeMatch[1].match(/src=["']([^"']*)["']/i);
        if (srcMatch && srcMatch[1]) {
          src = srcMatch[1];
        }
      } else if (iframeMatch[1].startsWith('http')) {
        src = iframeMatch[1];
      } else if (iframeMatch[1].includes('http')) {
        const urlMatch = iframeMatch[1].match(/(https?:\/\/[^\s"'<>]+)/i);
        if (urlMatch) {
          src = urlMatch[0];
        }
      }
    }
    
    if (src) {
      return {
        type: "iframe",
        src,
        content: `<iframe src="${src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
      };
    }
  }
  
  /* Check for URL directly in content
   * Supports plain URLs without iframe tags
   */
  const urlMatch = content.match(/^(https?:\/\/[^\s"'<>]+)$/i);
  if (urlMatch) {
    return {
      type: "iframe",
      src: urlMatch[0],
      content: `<iframe src="${urlMatch[0]}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
    };
  }
  
  return null;
}

/**
 * Extract URL from content
 * Used for identifying potential iframe sources
 * 
 * @param {string} content - String containing potential URL
 * @returns {string|null} Extracted URL or null if no URL found
 */
function extractUrl(content) {
  const urlMatch = content.match(/(https?:\/\/[^\s"'<>]+)/i);
  if (urlMatch) {
    return urlMatch[0];
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
  
  // Process all content types without early returns to handle mixed content
  const elements = Array.from(cell.children);
  
  elements.forEach(element => {
    const content = element.innerHTML.trim();
    const foundTypes = [];
    
    // Check all possible content types for this element
    if (element.tagName === 'SVG' || content.startsWith("<svg")) {
      foundTypes.push({
        type: "svg",
        content: element.outerHTML,
      });
    }
    
    if (element.tagName === 'PICTURE') {
      foundTypes.push({
        type: "picture",
        content: element.outerHTML
      });
    }
    
    if (element.tagName === 'IMG') {
      foundTypes.push({
        type: "image",
        content: element.src,
        alt: element.alt || ""
      });
    }

    if (element.classList.contains('icon')) {
      foundTypes.push({
        type: "icon",
        content: element.outerHTML,
      });
    }

    const picture = element.querySelector('picture');
    if (picture) {
      foundTypes.push({
        type: "picture",
        content: picture.outerHTML
      });
    }
    
    const img = element.querySelector('img:not(picture img)');
    if (img) {
      foundTypes.push({
        type: "image",
        content: img.src,
        alt: img.alt || ""
      });
    }
    
    const svg = element.querySelector('svg');
    if (svg) {
      foundTypes.push({
        type: "svg",
        content: svg.outerHTML,
      });
    }

    const icon = element.querySelector('span.icon');
    if (icon) {
      foundTypes.push({
        type: "icon",
        content: icon.outerHTML,
      });
    }

    if (content.startsWith("<svg") && content.includes("</svg>")) {
      try {
        const container = document.createElement("div");
        container.innerHTML = content;
        const parsedSvg = container.querySelector("svg");
        if (parsedSvg) {
          foundTypes.push({
            type: "svg",
            content: parsedSvg.outerHTML,
          });
        }
      } catch (e) {
        foundTypes.push({
          type: "svg",
          content: content,
        });
      }
    }

    const iframeContent = extractIframeContent(content);
    if (iframeContent) {
      foundTypes.push(iframeContent);
    }
    
    const url = extractUrl(content);
    if (url) {
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        foundTypes.push({
          type: "image",
          content: url,
          alt: "Image"
        });
      } else {
        foundTypes.push({
          type: "iframe",
          src: url,
          content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`
        });
      }
    }
    
    // Add all found content types to illustrations
    if (foundTypes.length > 0) {
      illustrations.push(...foundTypes);
    } else if (content.trim()) {
      // Fallback for plain text content
      illustrations.push({
        type: "text",
        content: content
      });
    }
  });

  // Return illustrations if found, null otherwise
  if (illustrations.length > 0) {
    return {
      type: "images",
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
  container.innerHTML = "";
  const totalSlides = slides.length;

  slides.forEach((slide, index) => {
    /* Create slide element with unique ID
     * Stores presenter notes in dataset for easy access
     */
    const slideElement = document.createElement("div");
    slideElement.id = `slide-${index}`;
    slideElement.className = "slide";
    
    if (slide.presenterNotes) {
      slideElement.dataset.presenterNotes = slide.presenterNotes;
    }

    /* Special handling for Q&A slides
     * Creates a distinct layout for the final slide
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
  let slideContent = `
    <div class="slide-content">
      <h2 class="slide-title">${slide.title}</h2>
      <div class="slide-content-text">
  `;

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
          slideContent += "</ul>";
        }

        slideContent += "</li>";
      }
    });
    slideContent += "</ul>";
  }

  slideContent += "</div>"; // Close slide-content-text

  /* Add illustration if provided */
  if (slide.illustration) {
    slideContent += `
      <div class="illustration">
    `;
    
    if (slide.illustration.type === "images") {
      slideContent += `<div class="image-sequence">`;
      
      // Properly handle multiple images in a sequence
      slide.illustration.content.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        const display = index === 0 ? 'block' : 'none';
        
        if (item.type === "iframe") {
          slideContent += `
            <div class="iframe-container sequence-image ${isActive}" style="display: ${display}">
              <iframe src="${item.src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>
            </div>`;
        } else if (item.type === "picture") {
          slideContent += `
            <div class="sequence-image ${isActive}" style="display: ${display}">
              ${item.content}
            </div>`;
        } else if (item.type === "svg") {
          slideContent += `
            <div class="sequence-image ${isActive}" style="display: ${display}">
              ${item.content}
            </div>`;
        } else if (item.type === "icon") {
          slideContent += `
            <div class="sequence-image ${isActive}" style="display: ${display}">
              ${item.content}
            </div>`;
        } else {
          slideContent += `
            <img 
              src="${item.content}" 
              alt="${item.alt || ''}" 
              class="sequence-image ${isActive}" 
              style="display: ${display}">`;
        }
      });
      
      slideContent += `</div>`;
    } else if (slide.illustration.type === "iframe") {
      slideContent += `
        <div class="iframe-container">
          <iframe src="${slide.illustration.src}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>
        </div>`;
    } else if (slide.illustration.type === "svg") {
      slideContent += slide.illustration.content;
    } else if (slide.illustration.type === "picture") {
      slideContent += slide.illustration.content;
    } else {
      slideContent += `<img src="${slide.illustration.content}" alt="${slide.title} illustration">`;
    }
    
    slideContent += `</div>`; // Close illustration
  }

  slideContent += "</div>"; // Close slide-content
  
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
  const slides = slidesContainer.querySelectorAll(".slide");
  const notesContent = presenterNotesContainer.querySelector(".presenter-notes-content");
  const prevButton = document.querySelector(".prev-slide");
  const nextButton = document.querySelector(".next-slide");

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
  function updatePresenterNotes(slideIndex) {
    const currentSlide = slides[slideIndex];
    const slideData = currentSlide.dataset.presenterNotes || '';
    notesContent.innerHTML = slideData;
  }

  /* Show a specific slide
   * Handles display logic and updates related elements
   */
  function showSlide(index, sequenceIndex) {
    slides.forEach((slide) => {
      slide.style.display = "none";
      slide.classList.remove("active");
    });

    if (slides[index]) {
      slides[index].style.display = "block";
      slides[index].classList.add("active");
      
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
      }
      
      updatePresenterNotes(index);
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
    prevButton.addEventListener("click", () => {
      if (currentSlideIndex > 0) {
        showSlide(currentSlideIndex - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentSlideIndex < slides.length - 1) {
        showSlide(currentSlideIndex + 1);
      }
    });
  }

  /* Handle image sequence navigation
   * Allows progression through multiple images within a slide
   */
  function handleImageSequenceNavigation(direction) {
    const currentSlide = slides[currentSlideIndex];
    const imageSequence = currentSlide.querySelector('.image-sequence');
    
    if (!imageSequence) return false;

    const images = imageSequence.querySelectorAll('.sequence-image');
    if (images.length <= 1) return false;
    
    const currentImage = imageSequence.querySelector('.sequence-image.active');
    if (!currentImage) return false;
    
    const currentImageIndex = Array.from(images).indexOf(currentImage);
    
    if (direction === 'next') {
      if (currentImageIndex < images.length - 1) {
        // Show next image in sequence
        currentImage.style.display = 'none';
        currentImage.classList.remove('active');
        
        images[currentImageIndex + 1].style.display = 'block';
        images[currentImageIndex + 1].classList.add('active');
        return true;
      }
    } else {
      if (currentImageIndex > 0) {
        // Show previous image in sequence
        currentImage.style.display = 'none';
        currentImage.classList.remove('active');
        
        images[currentImageIndex - 1].style.display = 'block';
        images[currentImageIndex - 1].classList.add('active');
        return true;
      }
    }
    
    return false;
  }

  /* Timer functionality
   * Handles countdown and warning system
   */
  function updateTimer() {
    if (remainingTime > 0) {
      remainingTime--;
      document.querySelector(".timer").textContent = formatTime(remainingTime);

      /* Flash warning when 2 minutes remain
       * Provides visual cue for time management
       */
      if (remainingTime === 120) {
        flashTimeWarning();
      }
    } else {
      clearInterval(timerInterval);
      document.querySelector(".timer").textContent = "Time Up!";
      document.querySelector(".timer").style.color = "#e74c3c";
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
    const container = document.querySelector(".dps-container");
    let flashCount = 0;

    function singleFlash() {
      container.style.backgroundColor = "#e74c3c";

      setTimeout(() => {
        container.style.backgroundColor = "";
        flashCount++;

        if (flashCount < 3) {
          setTimeout(singleFlash, 300);
        }
      }, 300);
    }

    singleFlash();
  }

  /* Add keyboard navigation
   * Supports slide progression, timer control, and presenter notes
   */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const navBar = document.querySelector(".dps-navigation");
      if (navBar) {
        navBar.style.display = navBar.style.display === "none" ? "flex" : "none";
      }
      return;
    }

    /* Toggle presenter notes with + and - keys
     * Provides quick access to presenter guidance
     */
    if (event.key === "+" || event.key === "=") {
      presenterNotesContainer.classList.remove("hidden");
      config.PRESENTER_NOTES_VISIBLE = true;
      event.preventDefault();
    } else if (event.key === "-" || event.key === "_") {
      presenterNotesContainer.classList.add("hidden");
      config.PRESENTER_NOTES_VISIBLE = false;
      event.preventDefault();
    }

    /* Handle navigation controls
     * Supports slide progression and image sequences
     */
    if (event.key === "ArrowLeft") {
      if (!handleImageSequenceNavigation('prev')) {
        if (currentSlideIndex > 0) {
          showSlide(currentSlideIndex - 1);
        }
      }
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      if (!handleImageSequenceNavigation('next')) {
        if (currentSlideIndex < slides.length - 1) {
          showSlide(currentSlideIndex + 1);
        }
      }
      event.preventDefault();
    } else if (event.key === " " && hasStartedTimer) {
      toggleTimer();
      event.preventDefault();
    } else if (event.key === "r" || event.key === "R") {
      // Refresh viewport while maintaining current slide and sub-slide state
      const currentSlideElement = slides[currentSlideIndex];
      const imageSequence = currentSlideElement.querySelector('.image-sequence');
      
      if (imageSequence) {
        const currentImageIndex = Array.from(imageSequence.querySelectorAll('.sequence-image'))
          .findIndex(img => img.classList.contains('active'));
          
        // Reapply the active state to maintain sequence position
        showSlide(currentSlideIndex, currentImageIndex);
      } else {
        showSlide(currentSlideIndex);
      }
    }
  });

  // Show first slide on initial load
  showSlide(0);
}