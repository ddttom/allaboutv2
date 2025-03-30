/**
 * Dynamic Presentation System (DPS) Block
 * Handles presentation functionality including slides, navigation, and fullscreen mode
 */

// Configuration object for the block
const DPS_CONFIG = {
  DEVELOPER: {
    name: "Tom Cranstoun",
    company: "tom"
  },
  STANDARDS: {
    styleGuide: "airbnb",
    cssNaming: "kebab-case",
    jsModules: "esm",
    markdown: "gfm"
  },
  TIMING: {
    SLIDE_TRANSITION: 300,
    WARNING_TIME: 30,
    COPY_BUTTON_RESET: 2000
  },
  CLASSES: {
    ACTIVE: 'active',
    HIDDEN: 'hidden',
    FULLSCREEN: 'fullscreen',
    WARNING: 'warning'
  }
};

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

  const illustrations = [];
  const elements = Array.from(cell.children);

  elements.forEach(element => {
    const content = element.innerHTML.trim();

    /* Check for picture element first */
    const picture = element.querySelector('picture');
    if (picture) {
      illustrations.push({
        type: "picture",
        content: picture.outerHTML
      });
      return;
    }

    /* Check for icon spans */
    const icon = element.querySelector('.icon');
    if (icon) {
      illustrations.push({
        type: "icon",
        content: icon.outerHTML
      });
      return;
    }

    /* Check for direct image */
    const img = element.querySelector('img');
    if (img) {
      illustrations.push({
        type: "image",
        content: img.src,
        alt: img.alt || ""
      });
      return;
    }

    /* Check for SVG element */
    const svg = element.querySelector('svg');
    if (svg) {
      illustrations.push({
        type: "svg",
        content: svg.outerHTML,
      });
      return;
    }

    /* Check if content contains SVG tags */
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

    /* Check for Franklin link format */
    const link = element.querySelector('a');
    if (link && link.href) {
      const href = link.href;
      if (href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        illustrations.push({
          type: "image",
          content: href,
          alt: link.textContent || ""
        });
        return;
      }
    }

    /* Check for direct URL */
    const url = extractUrl(content);
    if (url) {
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        illustrations.push({
          type: "image",
          content: url,
          alt: ""
        });
        return;
      }
      illustrations.push({
        type: "iframe",
        content: `<iframe src="${url}" loading="lazy" title="Embedded Content" allowfullscreen></iframe>`,
        src: url
      });
      return;
    }
  });

  return illustrations.length > 0 ? {
    type: "images",
    content: illustrations
  } : null;
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
  if (!fullscreenBtn || !block) return;

  const enterFullscreen = () => {
    if (block.requestFullscreen) {
      block.requestFullscreen();
    } else if (block.webkitRequestFullscreen) {
      block.webkitRequestFullscreen();
    } else if (block.msRequestFullscreen) {
      block.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  });

  // Handle fullscreen change events
  document.addEventListener('fullscreenchange', () => {
    block.classList.toggle(DPS_CONFIG.CLASSES.FULLSCREEN, !!document.fullscreenElement);
  });

  document.addEventListener('webkitfullscreenchange', () => {
    block.classList.toggle(DPS_CONFIG.CLASSES.FULLSCREEN, !!document.webkitFullscreenElement);
  });

  document.addEventListener('MSFullscreenChange', () => {
    block.classList.toggle(DPS_CONFIG.CLASSES.FULLSCREEN, !!document.msFullscreenElement);
  });

  // Enter fullscreen on load
  enterFullscreen();
}

/**
 * Format time in MM:SS format
 * 
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (seconds <= 0) return 'Time Up!';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Initialize the DPS block
 * Sets up all necessary event listeners and initializes the presentation
 * 
 * @param {HTMLElement} block - The DPS block element
 */
export default async function decorate(block) {
  // Create block structure
  const container = document.createElement('div');
  container.className = 'dps-container';
  block.appendChild(container);

  // Create header
  const header = document.createElement('div');
  header.className = 'dps-header';
  container.appendChild(header);

  const headerContent = document.createElement('div');
  headerContent.className = 'header-content';
  header.appendChild(headerContent);

  const title = document.createElement('h1');
  title.textContent = 'Dynamic Presentation System';
  headerContent.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Press Space or Arrow keys to navigate';
  headerContent.appendChild(subtitle);

  // Create fullscreen button
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'fullscreen-btn';
  fullscreenBtn.innerHTML = '⛶';
  header.appendChild(fullscreenBtn);

  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';
  container.appendChild(slidesContainer);

  // Create footer
  const footer = document.createElement('div');
  footer.className = 'dps-footer';
  container.appendChild(footer);

  const footerControls = document.createElement('div');
  footerControls.className = 'footer-controls';
  footer.appendChild(footerControls);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn';
  prevBtn.innerHTML = '←';
  footerControls.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn';
  nextBtn.innerHTML = '→';
  footerControls.appendChild(nextBtn);

  const timer = document.createElement('div');
  timer.className = 'timer';
  footer.appendChild(timer);

  // Set up fullscreen toggle
  setupFullscreenToggle(fullscreenBtn, block);

  // Initialize presentation
  let currentSlide = 0;
  const slides = Array.from(block.querySelectorAll('tr')).slice(1);
  const totalSlides = slides.length;

  // Create slides
  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = 'slide';
    if (index === 0) slideElement.classList.add(DPS_CONFIG.CLASSES.ACTIVE);
    slidesContainer.appendChild(slideElement);

    const slideContent = document.createElement('div');
    slideContent.className = 'slide-content';
    slideElement.appendChild(slideContent);

    // Add title
    const titleCell = slide.querySelector('td:nth-child(1)');
    if (titleCell) {
      const titleElement = document.createElement('h2');
      titleElement.className = 'slide-title';
      titleElement.textContent = titleCell.textContent.trim();
      slideContent.appendChild(titleElement);
    }

    // Add text content
    const textCell = slide.querySelector('td:nth-child(2)');
    if (textCell) {
      const textContent = document.createElement('div');
      textContent.className = 'slide-content-text';
      textContent.innerHTML = textCell.innerHTML;
      slideContent.appendChild(textContent);
    }

    // Add illustration
    const illustrationCell = slide.querySelector('td:nth-child(4)');
    if (illustrationCell) {
      const illustration = parseIllustration(illustrationCell);
      if (illustration) {
        const illustrationElement = document.createElement('div');
        illustrationElement.className = 'illustration';
        illustrationElement.innerHTML = illustration.content;
        slideContent.appendChild(illustrationElement);
      }
    }
  });

  // Navigation functions
  const goToSlide = (index) => {
    const slides = block.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove(DPS_CONFIG.CLASSES.ACTIVE));
    slides[index].classList.add(DPS_CONFIG.CLASSES.ACTIVE);
    currentSlide = index;
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        nextSlide();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
      case '+':
      case '=':
        togglePresenterNotes();
        break;
      case '-':
        hidePresenterNotes();
        break;
      case 'Escape':
        if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        }
        break;
    }
  });

  // Timer functionality
  let timeLeft = 300; // 5 minutes default
  const updateTimer = () => {
    timer.textContent = formatTime(timeLeft);
    if (timeLeft <= DPS_CONFIG.TIMING.WARNING_TIME) {
      timer.classList.add(DPS_CONFIG.CLASSES.WARNING);
      timer.style.animation = 'pulse 1s infinite';
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timer.textContent = 'Time Up!';
    }
    timeLeft--;
  };

  const timerInterval = setInterval(updateTimer, 1000);

  // Presenter notes functionality
  const presenterNotes = document.createElement('div');
  presenterNotes.className = 'presenter-notes';
  presenterNotes.innerHTML = `
    <div class="presenter-notes-title">Presenter Notes</div>
    <div class="presenter-notes-content"></div>
  `;
  block.appendChild(presenterNotes);

  const togglePresenterNotes = () => {
    presenterNotes.classList.toggle(DPS_CONFIG.CLASSES.HIDDEN);
  };

  const hidePresenterNotes = () => {
    presenterNotes.classList.add(DPS_CONFIG.CLASSES.HIDDEN);
  };

  // Initialize presenter notes
  hidePresenterNotes();
}