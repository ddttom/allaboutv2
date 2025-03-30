/**
 * Dynamic Presentation System (DPS) Block
 * This block transforms a structured div (from Google Doc table) into an interactive presentation
 */

export default function decorate(block) {
  // Add dps-block class to the container
  block.classList.add("dps-block");

  // Configuration object for presentation settings
  const DPS_CONFIG = {
    TIMER_DURATION: 25 * 60, // Default 25 minutes in seconds
    SLIDE_TRANSITION_MS: 300, // Transition time in milliseconds
    PRESENTER_NOTES_VISIBLE: false, // Initial state of presenter notes
  };

  // Get the rows (each row was a table row in the Google Doc)
  const rows = Array.from(block.children);

  if (rows.length < 2) {
    block.innerHTML =
      '<div class="dps-error">Error: DPS block requires at least a configuration row and one slide row.</div>';
    return;
  }

  // Extract presentation data from the rows
  const presentationData = parseRows(rows);

  // Create container elements for the presentation
  const presentationContainer = document.createElement("div");
  presentationContainer.className = "dps-container";

  // Create header section
  const header = document.createElement("div");
  header.className = "dps-header";
  header.innerHTML = `
    <div class="header-content">
      <h1 id="presentation-title">${presentationData.title}</h1>
      <p id="presentation-subtitle">${presentationData.subtitle || ""}</p>
    </div>
  `;

  // Add fullscreen toggle button
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

  // Create slides container
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides-container";
  slidesContainer.id = "slides-container";

  // Create presenter notes container
  const presenterNotesContainer = document.createElement("div");
  presenterNotesContainer.className = "presenter-notes hidden";
  presenterNotesContainer.innerHTML = `
    <div class="presenter-notes-title">Presenter Notes</div>
    <div class="presenter-notes-content"></div>
  `;
  
  // Create footer section
  const footer = document.createElement("div");
  footer.className = "dps-footer";
  footer.innerHTML = `
    <div class="footer-content">
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

  // Set up presentation controls
  setupControls(
    slidesContainer,
    presenterNotesContainer,
    presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION,
    DPS_CONFIG
  );

  // Set up fullscreen toggle
  setupFullscreenToggle(fullscreenBtn, block);
}

/**
 * Parse rows from the block to extract presentation data
 */
function parseRows(rows) {
  // First row contains configuration
  const configRow = rows[0].querySelector("div");
  const title = configRow.textContent.trim();
  const subtitle = rows[0].querySelector("div:nth-child(2)")?.textContent.trim() || "";
  const timerDuration = parseInt(rows[0].querySelector("div:nth-child(3)")?.textContent.trim() || "25", 10);

  // Remaining rows are slides
  const slides = [];
  
  // Process each slide row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.children);
    
    // Extract slide data from cells
    const slideTitle = cells[0]?.textContent.trim() || `Slide ${i}`;
    const introText = cells[1]?.textContent.trim() || "";
    
    // Process bullet points from the third cell
    const bulletPointsCell = cells[2];
    const bulletPoints = [];
    
    if (bulletPointsCell) {
      // Process bullet points and plain text
      const bulletContent = bulletPointsCell.innerHTML;
      const bulletItems = bulletContent.split("<br>");
      
      bulletItems.forEach(item => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
          // Check if this is a bullet point or plain text
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
    
    // Process illustration from the fourth cell
    const illustrationCell = cells[3];
    const illustration = parseIllustration(illustrationCell);
    
    // Process presenter notes from the fifth cell
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
  
  // Add a Q&A slide at the end
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
 */
function extractIframeContent(content) {
  // Check for iframe tag
  const iframeMatch = content.match(/<iframe[^>]*src=["']([^"']*)["'][^>]*>/i) || 
                      content.match(/<iframe[^>]*>([^<]*)<\/iframe>/i) ||
                      content.match(/<iframe\s+([^>]*)>/i);
  
  if (iframeMatch) {
    // Extract src from iframe tag
    let src = "";
    if (iframeMatch[1]) {
      // If src attribute is found
      if (iframeMatch[1].includes('src=')) {
        const srcMatch = iframeMatch[1].match(/src=["']([^"']*)["']/i);
        if (srcMatch && srcMatch[1]) {
          src = srcMatch[1];
        }
      } else if (iframeMatch[1].startsWith('http')) {
        // If the content inside iframe tag is a URL
        src = iframeMatch[1];
      } else if (iframeMatch[1].includes('http')) {
        // If there's a URL somewhere in the content
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
  
  // Check for URL directly in content
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
 */
function extractUrl(content) {
  // Check for URL directly in content
  const urlMatch = content.match(/(https?:\/\/[^\s"'<>]+)/i);
  if (urlMatch) {
    return urlMatch[0];
  }
  return null;
}

/**
 * Parse illustration from a cell
 */
function parseIllustration(cell) {
  if (!cell) return null;
  
  const illustrations = [];
  const elements = Array.from(cell.children);
  
  elements.forEach(element => {
    const content = element.innerHTML.trim();
    
    // Check for picture element first
    const picture = element.querySelector('picture');
    if (picture) {
      illustrations.push({
        type: "picture",
        content: picture.outerHTML
      });
      return;
    }
    
    // Check for direct image
    const img = element.querySelector('img');
    if (img) {
      illustrations.push({
        type: "image",
        content: img.src,
        alt: img.alt || ""
      });
      return;
    }
    
    // Check for SVG element
    const svg = element.querySelector('svg');
    if (svg) {
      illustrations.push({
        type: "svg",
        content: svg.outerHTML,
      });
      return;
    }

    // Check if content contains SVG tags
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
        }
      } catch (e) {
        illustrations.push({
          type: "svg",
          content: content,
        });
      }
    }

    // Check for iframe content
    const iframeContent = extractIframeContent(content);
    if (iframeContent) {
      illustrations.push(iframeContent);
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
 * Build slides in the container
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

    // Special handling for Q&A slides
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
      // Standard slide with title, content, and illustration
      let slideContent = `
        <div class="slide-content">
          <h2 class="slide-title">${slide.title}</h2>
          <div class="slide-content-text">
      `;

      // Add content text or bullet points
      if (slide.introText) {
        slideContent += `<p style="font-size: 18px; margin-bottom: 20px;">${slide.introText}</p>`;
      }

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

      // Add illustration if provided
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

      slideContent += "</div>"; // Close slide-content
      slideElement.innerHTML = slideContent;
    }

    container.appendChild(slideElement);
  });

  // First slide will be shown by setupControls
}

/**
 * Set up presentation controls
 */
function setupControls(slidesContainer, presenterNotesContainer, timerDuration, config) {
  const slides = slidesContainer.querySelectorAll(".slide");
  const notesContent = presenterNotesContainer.querySelector(".presenter-notes-content");

  let currentSlideIndex = 0;
  let timerInterval = null;
  let remainingTime = timerDuration;
  let hasStartedTimer = false;

  // Function to update presenter notes
  function updatePresenterNotes(slideIndex) {
    const currentSlide = slides[slideIndex];
    const slideData = currentSlide.dataset.presenterNotes || '';
    notesContent.innerHTML = slideData;
  }

  // Function to show a specific slide
  function showSlide(index) {
    slides.forEach((slide) => {
      slide.style.display = "none";
      slide.classList.remove("active");
    });

    if (slides[index]) {
      slides[index].style.display = "block";
      slides[index].classList.add("active");
      updatePresenterNotes(index);
    }

    currentSlideIndex = index;

    if (index > 0 && !hasStartedTimer) {
      startTimer();
      hasStartedTimer = true;
    }
  }

  // Function to handle image sequence navigation
  function handleImageSequenceNavigation(direction) {
    const currentSlide = slides[currentSlideIndex];
    const imageSequence = currentSlide.querySelector('.image-sequence');
    
    if (!imageSequence) return false;

    const images = imageSequence.querySelectorAll('.sequence-image');
    const currentImage = imageSequence.querySelector('.sequence-image.active');
    const currentImageIndex = Array.from(images).indexOf(currentImage);
    
    if (direction === 'next') {
      if (currentImageIndex < images.length - 1) {
        // Show next image in sequence
        currentImage.style.display = 'none';
        images[currentImageIndex + 1].style.display = 'block';
        currentImage.classList.remove('active');
        images[currentImageIndex + 1].classList.add('active');
        return true;
      }
    } else {
      if (currentImageIndex > 0) {
        // Show previous image in sequence
        currentImage.style.display = 'none';
        images[currentImageIndex - 1].style.display = 'block';
        currentImage.classList.remove('active');
        images[currentImageIndex - 1].classList.add('active');
        return true;
      }
    }
    
    return false;
  }

  // Timer functionality
  function updateTimer() {
    if (remainingTime > 0) {
      remainingTime--;
      document.querySelector(".timer").textContent = formatTime(remainingTime);

      // Flash warning when 2 minutes remain
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

  function flashTimeWarning() {
    const container = document.querySelector(".dps-container");
    let flashCount = 0;

    function singleFlash() {
      container.style.backgroundColor = "#e74c3c"; // Red flash

      setTimeout(() => {
        container.style.backgroundColor = ""; // Return to normal
        flashCount++;

        if (flashCount < 3) {
          setTimeout(singleFlash, 300); // Wait before next flash
        }
      }, 300);
    }

    singleFlash();
  }

  // Add keyboard navigation including presenter notes toggle
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const navBar = document.querySelector(".dps-navigation");
      navBar.style.display = navBar.style.display === "none" ? "flex" : "none";
      return;
    }

    // Toggle presenter notes with + and - keys
    if (event.key === "+" || event.key === "=") {
      presenterNotesContainer.classList.remove("hidden");
      config.PRESENTER_NOTES_VISIBLE = true;
      event.preventDefault();
    } else if (event.key === "-" || event.key === "_") {
      presenterNotesContainer.classList.add("hidden");
      config.PRESENTER_NOTES_VISIBLE = false;
      event.preventDefault();
    }

    // Existing navigation controls
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
    }
  });

  // Initially set the timer display and show first slide
  document.querySelector(".timer").textContent = formatTime(remainingTime);
  showSlide(0);
}

/**
 * Format time as MM:SS
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Set up fullscreen toggle functionality
 */
function setupFullscreenToggle(button, block) {
  button.addEventListener("click", () => {
    // Toggle fullscreen class on document body
    document.body.classList.toggle("dps-fullscreen");

    // Update button icon and title based on state
    if (document.body.classList.contains("dps-fullscreen")) {
      button.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M5 0H0v5h2V2h3V0zm0 12H2V9H0v5h5v-2zm7-7h2V0H9v2h3v3zm-3 7h5V9h-2v3H9v2z" fill="#FFF"/></svg>';
      button.title = "Exit fullscreen";

      // Scroll to top when entering fullscreen
      window.scrollTo(0, 0);
    } else {
      button.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="#FFF"/></svg>';
      button.title = "Enter fullscreen";
    }
  });

  // Close fullscreen with Escape key (in addition to navigation toggle)
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("dps-fullscreen")
    ) {
      document.body.classList.remove("dps-fullscreen");
      button.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="#FFF"/></svg>';
      button.title = "Enter fullscreen";
    }
  });
}