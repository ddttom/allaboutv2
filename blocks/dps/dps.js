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
      presenterNotes: slideCells[4] ? getElementContent(slideCells[4]) : '',
    };

    presentationData.slides.push(slide);
  }

  // Always add a Q&A slide at the end
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
 */
function getElementContent(element) {
  if (!element) return "";
  // For presenter notes (5th column), preserve HTML
  if (element.parentElement && element.parentElement.parentElement && 
      element.parentElement.parentElement.children.length === 5 && 
      element.parentElement.parentElement.children[4] === element) {
    return element.innerHTML.trim();
  }
  // For other columns, use textContent
  return element.textContent.trim();
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

  // Get all paragraph and div elements
  const elements = cell.querySelectorAll('p, div');
  if (elements.length === 0) return null;

  // Array to store all illustrations found
  const illustrations = [];

  // Process each element
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

    // Check for standard iframe
    const iframe = element.querySelector('iframe');
    if (iframe) {
      illustrations.push({
        type: "iframe",
        content: iframe.outerHTML,
        src: iframe.src
      });
      return;
    }

    // Check for iframe without src attribute
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

    // Check for HTML encoded iframe
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

    // Check for paragraph wrapped HTML encoded iframe
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

    // Check for direct URL (if the content is just a URL)
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

    // Check for Franklin link format
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
    }
  });
}

/**
 * Set up presentation controls
 */
function setupControls(slidesContainer, presenterNotesContainer, timerDuration, DPS_CONFIG) {
  // Implementation of setupControls function
}

/**
 * Set up fullscreen toggle
 */
function setupFullscreenToggle(fullscreenBtn, block) {
  // Implementation of setupFullscreenToggle function
}

/**
 * Format time
 */
function formatTime(seconds) {
  // Implementation of formatTime function
}

/**
 * Extract URL from content
 */
function extractUrl(content) {
  // Implementation of extractUrl function
}

/**
 * Extract iframe content from content
 */
function extractIframeContent(content) {
  // Implementation of extractIframeContent function
}