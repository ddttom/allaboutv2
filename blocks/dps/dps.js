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

  // Create navigation controls
  const navigation = document.createElement("div");
  navigation.className = "dps-navigation";
  navigation.innerHTML = `
    <div class="navigation-content">
      <button id="prev-btn" class="nav-btn" disabled>Previous</button>
      <button id="timer-btn" class="timer-btn">Start Timer</button>
      <button id="next-btn" class="nav-btn">Next</button>
    </div>
  `;

  // Create slides container
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides-container";
  slidesContainer.id = "slides-container";

  // Create footer section
  const footer = document.createElement("div");
  footer.className = "dps-footer";
  footer.innerHTML = `
    <div class="footer-content">
      <div class="timer">${formatTime(
        presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION
      )}</div>
      <div class="pagination">0 / ${presentationData.slides.length - 1}</div>
    </div>
  `;

  // Append all elements to the presentation container
  presentationContainer.appendChild(header);
  presentationContainer.appendChild(navigation);
  presentationContainer.appendChild(slidesContainer);
  presentationContainer.appendChild(footer);

  // Replace the block content with our presentation
  block.textContent = "";
  block.appendChild(presentationContainer);

  // Build slides from the parsed content
  buildSlides(presentationData.slides, slidesContainer);

  // Set up presentation controls
  setupControls(
    slidesContainer,
    presentationData.timerDuration * 60 || DPS_CONFIG.TIMER_DURATION
  );

  // Set up fullscreen toggle
  setupFullscreenToggle(fullscreenBtn, block);

  // Trigger fullscreen mode on startup
  setTimeout(() => {
    fullscreenBtn.click();
  }, 100);
}

/**
 * Parse rows from the Franklin-rendered structure
 */
function parseRows(rows) {
  // First row contains presentation information
  const configRow = rows[0];
  const configCells = Array.from(configRow.children);

  // Initialize presentation data
  const presentationData = {
    title: getElementContent(configCells[0]),
    subtitle: getElementContent(configCells[1]),
    timerDuration: parseInt(getElementContent(configCells[2])) || 25,
    slides: [],
  };

  // Process slide rows
  for (let i = 1; i < rows.length; i++) {
    const slideRow = rows[i];
    const slideCells = Array.from(slideRow.children);

    // Skip rows with fewer than 3 cells
    if (slideCells.length < 3) continue;

    const slide = {
      title: getElementContent(slideCells[0]),
      introText: getElementContent(slideCells[1]),
      bulletPoints: parseBulletPoints(slideCells[2]),
      illustration: parseIllustration(slideCells[3]),
    };

    presentationData.slides.push(slide);
  }

  // Always add a Q&A slide at the end
  presentationData.slides.push({
    type: "qanda",
    title: "Questions & Answers",
    subtitle: "Your feedback and questions are valuable",
    thankYouText: "Thank You For Your Attention",
  });

  return presentationData;
}

/**
 * Get content from an element
 */
function getElementContent(element) {
  return element ? element.textContent.trim() : "";
}

/**
 * Parse bullet points from a cell
 */
function parseBulletPoints(cell) {
  if (!cell) return [];

  const bulletPoints = [];
  const listItems = cell.querySelectorAll("li");
  const textContent = cell.innerHTML.trim();

  if (!textContent) return [];

  // Create a map of list item text to their content
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

  // Create a temporary div to parse the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = textContent;

  // Process each child node in order
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
 */
function parseIllustration(cell) {
  if (!cell) return null;

  // Check for image first
  const img = cell.querySelector("img");
  if (img) {
    return {
      type: "image",
      content: img.src,
    };
  }

  // Check for SVG element
  const svg = cell.querySelector("svg");
  if (svg) {
    return {
      type: "svg",
      content: svg.outerHTML,
    };
  }

  // Check if content contains SVG tags (common in Franklin output)
  const content = cell.textContent.trim();
  if (content.startsWith("<svg") && content.includes("</svg>")) {
    // We found an SVG string, parse it to a real SVG
    try {
      const container = document.createElement("div");
      container.innerHTML = content;

      // If parsing succeeded, we should have an SVG element
      const parsedSvg = container.querySelector("svg");
      if (parsedSvg) {
        return {
          type: "svg",
          content: parsedSvg.outerHTML,
        };
      }
    } catch (e) {
      // If parsing failed, return the raw content
      return {
        type: "svg",
        content: content,
      };
    }
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

  // Update pagination display
  const paginationDisplay = document.querySelector(".pagination");
  paginationDisplay.textContent = `0 / ${totalSlides - 1}`;

  slides.forEach((slide, index) => {
    const slideElement = document.createElement("div");
    slideElement.id = `slide-${index}`;
    slideElement.className = "slide";

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
              slide.illustration.type === "image"
                ? `<img src="${slide.illustration.content}" alt="${slide.title} illustration">`
                : slide.illustration.content
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
function setupControls(slidesContainer, timerDuration) {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const timerBtn = document.getElementById("timer-btn");
  const slides = slidesContainer.querySelectorAll(".slide");
  const paginationDisplay = document.querySelector(".pagination");

  let currentSlideIndex = 0;
  let timerInterval = null;
  let remainingTime = timerDuration; // in seconds

  // Function to update button states
  function updateNavigationState() {
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slides.length - 1;
    paginationDisplay.textContent = `${currentSlideIndex} / ${
      slides.length - 1
    }`;
  }

  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides first and remove active class
    slides.forEach((slide) => {
      slide.style.display = "none";
      slide.classList.remove("active");
    });

    // Show the slide at the index and add active class
    if (slides[index]) {
      slides[index].style.display = "block";
      slides[index].classList.add("active");
    }

    currentSlideIndex = index;
    updateNavigationState();
  }

  // Navigation event handlers
  prevBtn.addEventListener("click", () => {
    if (currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlideIndex < slides.length - 1) {
      showSlide(currentSlideIndex + 1);
    }
  });

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
      timerBtn.textContent = "Time Up!";
      timerBtn.style.backgroundColor = "#e74c3c";
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

  timerBtn.addEventListener("click", () => {
    if (timerInterval) {
      // Stop timer
      clearInterval(timerInterval);
      timerInterval = null;
      timerBtn.textContent = "Start Timer";
      timerBtn.style.backgroundColor = "#e74c3c";
    } else {
      // Start timer
      timerInterval = setInterval(updateTimer, 1000);
      timerBtn.textContent = "Stop Timer";
      timerBtn.style.backgroundColor = "#27ae60";
    }
  });

  // Add keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const navBar = document.querySelector(".dps-navigation");
      navBar.style.display = navBar.style.display === "none" ? "flex" : "none";
      return;
    }

    // Navigation using arrow keys
    if (event.key === "ArrowLeft" && currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
      event.preventDefault();
    } else if (
      event.key === "ArrowRight" &&
      currentSlideIndex < slides.length - 1
    ) {
      showSlide(currentSlideIndex + 1);
      event.preventDefault();
    }
  });

  // Initially set the timer display
  document.querySelector(".timer").textContent = formatTime(remainingTime);

  // Show the first slide initially
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
