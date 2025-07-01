# EDS Custom Blocks: Complete AI-Led Technical Training
*An Interactive Tutorial for Mastering Adobe Edge Delivery Services Block Development*

---

## 🤖 AI Instructor Introduction

Welcome to the comprehensive EDS (Edge Delivery Services) block development training! I'm your AI instructor, and I'll guide you through every aspect of creating custom blocks for the EDS framework. This isn't just documentation—it's an interactive learning experience designed to transform you from beginner to expert.

**What Makes This Training Special:**
- 🎯 **Progressive Learning**: From basic concepts to advanced patterns
- 🛠️ **Hands-On Exercises**: Real code you can run immediately
- 🚀 **Production-Ready**: Best practices from actual implementations
- 🔧 **Troubleshooting Focus**: Common issues and their solutions

---

## 📚 Chapter 1: EDS Foundation - Understanding the Framework

### Introduction: Why EDS Changes Everything

Before we dive into code, let's understand why Adobe Edge Delivery Services represents a fundamental shift in how we think about web development. Most developers approach EDS with traditional CMS thinking and struggle because they're trying to force old patterns into a revolutionary new paradigm.

EDS wasn't built to be "another CMS" or "another framework." It was designed to solve a fundamental problem that has plagued web development for decades: the tension between content creators who want to focus on writing and developers who need technical control. Traditional systems force one side to compromise—either content creators learn complex technical interfaces, or developers sacrifice functionality for simplicity.

### The Philosophy Revolution That Changes How You Code

EDS solves this by inverting the entire relationship between content and technology. Instead of asking "How do we fit content into our technical system?" EDS asks "How do we make our technical system adapt to natural content creation?"

This philosophical shift has profound implications for how you write code. In traditional systems, you build components first and then fill them with content. In EDS, content exists first, and you enhance it progressively. This isn't just a different workflow—it's a completely different way of thinking about web development.

### The EDS Philosophy Revolution

Let me start by explaining something fundamental that sets EDS apart from every other web framework you've used:

**Traditional CMS Thinking:**
```
Content Authors → Adapt to → Technical System
```

**EDS Revolutionary Approach:**
```
Technical System → Adapts to → Natural Content Creation
```

### Core Principles You Must Internalize

#### 1. **Content-First Architecture**
```javascript
// ❌ Traditional: Build UI first, add content later
function buildComponent() {
  createHeader();
  createBody();
  addContent(); // Content forced into predefined structure
}

// ✅ EDS Way: Content defines structure, enhance progressively
export default function decorate(block) {
  // Content already exists, enhance it intelligently
  const existingContent = extractContentFromBlock(block);
  enhanceWithFunctionality(existingContent);
}
```

#### 2. **Zero Dependencies Philosophy**
```javascript
// ❌ Avoid: Heavy frameworks and dependencies
import React from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';

// ✅ EDS Way: Pure web standards
const button = document.createElement('button');
const modal = document.createElement('dialog');
const timestamp = new Date().toISOString();
```

#### 3. **Performance-First Development**
```css
/* ❌ Avoid: Heavy frameworks that hurt Core Web Vitals */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

/* ✅ EDS Way: System fonts and efficient loading */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 🎯 **Hands-On Exercise 1: Understanding EDS HTML Transformation**

Let's see how EDS transforms content. Create this test file:

```html
<!-- /blocks/hello-world/test.html -->
<!DOCTYPE html>
<html>
<head>
    <title>EDS Transformation Demo</title>
    <script type="module" src="/scripts/aem.js"></script>
</head>
<body>
    <div class="hello-world block" data-block-name="hello-world" data-block-status="initialized">
        <div>
            <div>
                <p>Hello, EDS World!</p>
                <p>This is my first block.</p>
            </div>
        </div>
    </div>
    
    <script type="module">
        import decorate from './hello-world.js';
        document.querySelectorAll('.hello-world.block').forEach(decorate);
    </script>
</body>
</html>
```

**Key Learning Points:**
- 📝 EDS blocks use `.block-name.block` class structure
- 📦 Content is nested in `<div><div>content</div></div>` structure  
- 🎯 JavaScript targets `.block-name.block` for decoration
- 🔄 The `decorate` function receives fully rendered HTML

---

## 📚 Chapter 2: Block Architecture Mastery

### Understanding Blocks: The Heart of EDS Enhancement

Now that you understand the EDS philosophy, let's explore how it translates into practical development through blocks. Blocks are where the magic happens—they're the mechanism that transforms static content into interactive experiences while maintaining EDS's performance and simplicity principles.

Think of blocks as enhancement layers. They don't replace content; they amplify it. When a content author creates a table in Google Docs and marks it as a "gallery" block, they're not building a technical component—they're expressing intent. Your job as a developer is to recognize that intent and enhance the content accordingly.

This is profoundly different from component-based frameworks where you define the structure and then populate it with data. In EDS, the structure already exists in a basic form, and you're progressively enhancing it. This distinction is crucial because it affects every architectural decision you'll make.

### Why Block Architecture Matters

The block architecture isn't arbitrary—it's designed to solve real problems that plague modern web development:

**Performance:** Blocks load only when needed, CSS and JavaScript are scoped, and there's no framework overhead
**Maintainability:** Each block is self-contained with clear boundaries and responsibilities  
**Scalability:** Teams can work on different blocks simultaneously without conflicts
**Content Independence:** Authors can create content without knowing technical implementation details

### The EDS Block Anatomy

Every EDS block follows a strict architectural pattern designed to support these principles. Let me break it down:

```
/blocks/block-name/
├── block-name.js          # 🧠 The brain - decoration logic
├── block-name.css         # 🎨 The skin - visual presentation  
├── test.html              # 🧪 The lab - development testing
├── README.md              # 📖 The manual - documentation
└── example.md             # 📋 The demo - usage examples
```

### Naming Conventions That Matter

```javascript
// ✅ Correct naming patterns
.counter.block              // JavaScript selector
.counter                    // CSS styling
.counter-button             // Element styling
.counter-display            // Element styling
.counter-button-active      // State modifier

// ❌ Wrong patterns that will break
.counter-block              // Conflicts with EDS .block class
.counterButton              // Not EDS convention
.counter_button             // Underscores not used
```

### 🎯 **Hands-On Exercise 2: Building Your First Interactive Block**

Let's build a simple counter block that demonstrates all EDS patterns:

```javascript
// /blocks/counter/counter.js
const COUNTER_CONFIG = {
  INITIAL_VALUE: 0,
  STEP_SIZE: 1,
  MAX_VALUE: 100,
  ANIMATION_DURATION: 200,
  STORAGE_KEY: 'eds-counter-value'
};

export default function decorate(block) {
  try {
    // 1. Extract existing content (EDS pattern)
    const content = extractContentFromBlock(block);
    
    // 2. Create enhanced structure
    const counterContainer = createCounterStructure(content);
    
    // 3. Add functionality
    setupCounterBehavior(counterContainer);
    
    // 4. Replace block content (EDS pattern)
    block.innerHTML = '';
    block.appendChild(counterContainer);
    
    // 5. Add CSS class for styling
    block.classList.add('counter-enhanced');
    
  } catch (error) {
    console.warn('[Counter] Enhancement failed:', error);
    showFallbackContent(block);
  }
}

function extractContentFromBlock(block) {
  // EDS provides content in nested div structure
  const contentDiv = block.querySelector('div > div');
  const initialValue = parseInt(contentDiv?.textContent?.trim()) || COUNTER_CONFIG.INITIAL_VALUE;
  
  return { initialValue };
}

function createCounterStructure(content) {
  const container = document.createElement('div');
  container.className = 'counter-container';
  
  // Create counter display
  const display = document.createElement('div');
  display.className = 'counter-display';
  display.textContent = content.initialValue;
  display.setAttribute('aria-live', 'polite');
  display.setAttribute('aria-label', 'Current counter value');
  
  // Create decrease button
  const decreaseBtn = document.createElement('button');
  decreaseBtn.className = 'counter-button counter-button-decrease';
  decreaseBtn.textContent = '-';
  decreaseBtn.setAttribute('aria-label', 'Decrease counter');
  
  // Create increase button
  const increaseBtn = document.createElement('button');
  increaseBtn.className = 'counter-button counter-button-increase';
  increaseBtn.textContent = '+';
  increaseBtn.setAttribute('aria-label', 'Increase counter');
  
  container.appendChild(decreaseBtn);
  container.appendChild(display);
  container.appendChild(increaseBtn);
  
  return container;
}

function setupCounterBehavior(container) {
  const display = container.querySelector('.counter-display');
  const decreaseBtn = container.querySelector('.counter-button-decrease');
  const increaseBtn = container.querySelector('.counter-button-increase');
  
  let currentValue = parseInt(display.textContent);
  
  // Decrease button handler
  decreaseBtn.addEventListener('click', () => {
    if (currentValue > 0) {
      currentValue -= COUNTER_CONFIG.STEP_SIZE;
      updateDisplay(display, currentValue);
      saveValue(currentValue);
    }
  });
  
  // Increase button handler
  increaseBtn.addEventListener('click', () => {
    if (currentValue < COUNTER_CONFIG.MAX_VALUE) {
      currentValue += COUNTER_CONFIG.STEP_SIZE;
      updateDisplay(display, currentValue);
      saveValue(currentValue);
    }
  });
  
  // Keyboard support
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === '+') {
      e.preventDefault();
      increaseBtn.click();
    } else if (e.key === 'ArrowDown' || e.key === '-') {
      e.preventDefault();
      decreaseBtn.click();
    }
  });
}

function updateDisplay(display, value) {
  // Smooth transition effect
  display.style.transform = 'scale(1.1)';
  display.textContent = value;
  
  setTimeout(() => {
    display.style.transform = 'scale(1)';
  }, COUNTER_CONFIG.ANIMATION_DURATION);
}

function saveValue(value) {
  try {
    localStorage.setItem(COUNTER_CONFIG.STORAGE_KEY, value.toString());
  } catch (error) {
    console.warn('[Counter] Could not save value:', error);
  }
}

function showFallbackContent(block) {
  block.innerHTML = `
    <div class="counter-fallback">
      <p>Counter functionality unavailable</p>
      <p>Please refresh the page to try again</p>
    </div>
  `;
}
```

### Corresponding CSS with EDS Best Practices

```css
/* /blocks/counter/counter.css */
.counter.block {
  /* Base block styling - never style .counter-container */
  max-width: 300px;
  margin: 2rem auto;
  font-family: var(--body-font-family, system-ui);
}

.counter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--background-color, #fff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.counter-display {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color, #1f2937);
  min-width: 4rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.counter-button {
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: var(--link-color, #0066cc);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-button:hover {
  background: var(--link-hover-color, #0052a3);
  transform: scale(1.05);
}

.counter-button:focus {
  outline: 2px solid var(--link-color, #0066cc);
  outline-offset: 2px;
}

.counter-button:active {
  transform: scale(0.95);
}

.counter-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Responsive design */
@media (max-width: 600px) {
  .counter-container {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .counter-display {
    font-size: 1.5rem;
    min-width: 3rem;
  }
  
  .counter-button {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }
}

/* Error state styling */
.counter-fallback {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary, #6b7280);
  font-style: italic;
}
```

---

## 📚 Chapter 3: Local Development Mastery with server.js

### The Development Challenge: Bridging Local and Production

One of the biggest challenges in EDS development is creating an efficient local development environment that accurately reflects production behavior. Unlike traditional frameworks with complex build processes, EDS runs the same code in development and production—but this creates a unique challenge: how do you develop locally when your blocks depend on content, images, and assets that exist on your production server?

This is where EDS's development server becomes crucial. It's not just a static file server—it's an intelligent proxy system that lets you develop blocks locally while seamlessly accessing production assets. This architecture is fundamental to the EDS development workflow and understanding it will dramatically improve your productivity.

### Why the Proxy Architecture Is Revolutionary

Traditional development often requires either copying entire production databases locally or mocking all external dependencies. Both approaches have serious drawbacks: local copies are complex to maintain and quickly become stale, while mocks don't reflect real-world conditions.

EDS solves this with a hybrid approach: your code runs locally for instant feedback, but missing assets are automatically fetched from production. This means you're always developing against real content and real data, but with the fast iteration cycles of local development.

### Understanding the Development Environment

The EDS development server implements a sophisticated local-first, proxy-fallback architecture that's crucial for efficient development. Here's how it fundamentally changes your workflow:

```javascript
// server.js architecture overview
const serverFlow = {
  1: "Request comes in",
  2: "Check if file exists locally", 
  3: "Serve local file if found",
  4: "Proxy to production if not found",
  5: "Return 404 if both fail"
};
```

### Setting Up Your Development Environment

```bash
# 1. Start the EDS development server
npm run debug

# 2. Server starts with comprehensive logging
🚀 Server running at http://localhost:3000
📁 Serving files from: /your/project/path
🔗 Proxying missing files to: https://allabout.network
📄 Main page: http://localhost:3000/aem.html
```

### 🎯 **Hands-On Exercise 3: Development Workflow Mastery**

Let's practice the complete development workflow:

1. **Create your test file:**
```html
<!-- /blocks/counter/test.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Counter Block Test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="module" src="/scripts/aem.js"></script>
    <link rel="stylesheet" href="/styles/styles.css">
</head>
<body class="appear">
    <main>
        <div class="section">
            <div class="section-metadata">
                <div>
                    <div>style</div>
                    <div>highlight</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h1>Counter Block Testing</h1>
            
            <div class="test-scenario">
                <h2>Basic Counter</h2>
                <div class="counter block" data-block-name="counter" data-block-status="initialized">
                    <div>
                        <div>5</div>
                    </div>
                </div>
            </div>
            
            <div class="test-scenario">
                <h2>Zero Counter</h2>
                <div class="counter block" data-block-name="counter" data-block-status="initialized">
                    <div>
                        <div>0</div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import decorate from './counter.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            const blocks = document.querySelectorAll('.counter.block');
            blocks.forEach(decorate);
        });
    </script>
</body>
</html>
```

2. **Watch the server logs:**
```bash
Request: GET /blocks/counter/test.html
Serving local file: /project/blocks/counter/test.html

Request: GET /styles/styles.css  
Proxying request to: https://allabout.network/styles/styles.css
✅ Successfully proxied: /styles/styles.css

Request: GET /blocks/counter/counter.js
Serving local file: /project/blocks/counter/counter.js

Request: GET /blocks/counter/counter.css  
Serving local file: /project/blocks/counter/counter.css
```

3. **Navigate to your test:**
```
http://localhost:3000/blocks/counter/test.html
```

### Understanding the Proxy System

The development server uses an intelligent proxy system:

```javascript
// When you request a file that doesn't exist locally
Request: GET /media/hero-image.jpg
Local file: Not found
Proxy target: https://allabout.network/media/hero-image.jpg
Result: Production image served locally
```

This means you can:
- ✅ Develop blocks locally with real production data
- ✅ Test with actual images and assets  
- ✅ No need to copy entire production environment
- ✅ Focus on your block development

---

## 📚 Chapter 4: Advanced Block Patterns

### Beyond Basic Enhancement: Creating Sophisticated Experiences

At this point, you understand EDS fundamentals and can create basic interactive blocks. Now we'll explore how to build sophisticated functionality while maintaining EDS's core principles. This is where EDS development becomes an art—balancing complexity with simplicity, features with performance, and interactivity with content-first design.

The patterns you'll learn in this chapter solve real-world problems: how to fetch and display dynamic data, how to create complex user interfaces, how to manage state across interactions, and how to build reusable functionality. But we'll do it the EDS way—progressively enhancing content rather than replacing it, using web standards rather than frameworks, and maintaining perfect performance scores.

### The Challenge of Complex Functionality

Traditional frameworks handle complexity by adding layers of abstraction—state management libraries, component frameworks, build tools, and runtime dependencies. EDS takes the opposite approach: it handles complexity through careful architecture and smart use of web standards. This requires a different mindset and different patterns.

When building complex blocks, you're not just writing JavaScript—you're designing enhancement strategies. How do you show loading states without layout shift? How do you handle errors gracefully? How do you manage focus and accessibility? How do you ensure your block works even if JavaScript fails to load?

### Data-Driven Blocks: The Foundation of Dynamic Content

Many sophisticated EDS blocks need to fetch and display dynamic data—article lists, product catalogs, user-generated content. This creates several challenges: how do you show immediate content while data loads? How do you handle network failures? How do you manage content that changes frequently?

Let's explore the sophisticated patterns that solve these challenges:

```javascript
// /blocks/article-cards/article-cards.js
const CARDS_CONFIG = {
  DEFAULT_DATA_PATH: '/articles/query-index.json',
  MAX_CARDS: 12,
  LOADING_DELAY: 300,
  ERROR_RETRY_ATTEMPTS: 3,
  CARD_ANIMATION_STAGGER: 100
};

export default async function decorate(block) {
  try {
    // Show loading state immediately
    showLoadingState(block);
    
    // Extract data path from content
    const dataPath = extractDataPath(block) || CARDS_CONFIG.DEFAULT_DATA_PATH;
    
    // Fetch data with error handling
    const articlesData = await fetchWithRetry(dataPath);
    
    // Generate cards with staggered animation
    await generateArticleCards(block, articlesData);
    
  } catch (error) {
    console.warn('[Article Cards] Enhancement failed:', error);
    showErrorState(block, error);
  }
}

function extractDataPath(block) {
  const contentDiv = block.querySelector('div > div');
  const path = contentDiv?.textContent?.trim();
  
  // Validate path format
  if (path && (path.endsWith('.json') || path.startsWith('/'))) {
    return path;
  }
  
  return null;
}

async function fetchWithRetry(url, attempt = 1) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received');
    }
    
    return data;
    
  } catch (error) {
    if (attempt < CARDS_CONFIG.ERROR_RETRY_ATTEMPTS) {
      console.warn(`[Article Cards] Attempt ${attempt} failed, retrying...`);
      await delay(1000 * attempt); // Exponential backoff
      return fetchWithRetry(url, attempt + 1);
    }
    
    throw error;
  }
}

function showLoadingState(block) {
  block.innerHTML = `
    <div class="article-cards-loading">
      <div class="loading-spinner"></div>
      <p>Loading articles...</p>
    </div>
  `;
  block.classList.add('article-cards-loading-state');
}

async function generateArticleCards(block, articlesData) {
  const articles = articlesData.data.slice(0, CARDS_CONFIG.MAX_CARDS);
  
  // Create container
  const container = document.createElement('div');
  container.className = 'article-cards-container';
  
  // Generate cards
  const cardPromises = articles.map((article, index) => 
    createArticleCard(article, index)
  );
  
  // Wait for all cards to be created
  const cards = await Promise.all(cardPromises);
  
  // Add cards to container
  cards.forEach(card => container.appendChild(card));
  
  // Replace loading state with cards
  block.innerHTML = '';
  block.appendChild(container);
  block.classList.remove('article-cards-loading-state');
  block.classList.add('article-cards-loaded');
  
  // Animate cards in with stagger
  animateCardsIn(cards);
}

async function createArticleCard(article, index) {
  const card = document.createElement('article');
  card.className = 'article-card';
  card.style.animationDelay = `${index * CARDS_CONFIG.CARD_ANIMATION_STAGGER}ms`;
  
  // Create image with lazy loading
  const imageContainer = document.createElement('div');
  imageContainer.className = 'article-card-image';
  
  if (article.image) {
    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title || 'Article image';
    img.loading = 'lazy';
    imageContainer.appendChild(img);
  }
  
  // Create content
  const content = document.createElement('div');
  content.className = 'article-card-content';
  
  if (article.title) {
    const title = document.createElement('h3');
    title.className = 'article-card-title';
    title.textContent = article.title;
    content.appendChild(title);
  }
  
  if (article.description) {
    const description = document.createElement('p');
    description.className = 'article-card-description';
    description.textContent = article.description;
    content.appendChild(description);
  }
  
  if (article.path) {
    const link = document.createElement('a');
    link.className = 'article-card-link';
    link.href = article.path;
    link.textContent = 'Read More';
    link.setAttribute('aria-label', `Read more about ${article.title}`);
    content.appendChild(link);
  }
  
  card.appendChild(imageContainer);
  card.appendChild(content);
  
  return card;
}

function animateCardsIn(cards) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('article-card-visible');
    }, index * CARDS_CONFIG.CARD_ANIMATION_STAGGER);
  });
}

function showErrorState(block, error) {
  block.innerHTML = `
    <div class="article-cards-error">
      <h3>Unable to load articles</h3>
      <p>Please try refreshing the page</p>
      <button onclick="location.reload()" class="retry-button">
        Retry
      </button>
    </div>
  `;
  block.classList.add('article-cards-error-state');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 🎯 **Hands-On Exercise 4: Complex Modal Block**

Let's build a sophisticated modal block that demonstrates advanced EDS patterns:

```javascript
// /blocks/feature-modal/feature-modal.js
const MODAL_CONFIG = {
  ANIMATION_DURATION: 300,
  ESCAPE_KEY: 'Escape',
  OVERLAY_CLICK_DISMISS: true,
  FOCUS_TRAP: true,
  BODY_SCROLL_LOCK: true
};

export default function decorate(block) {
  try {
    const modalData = extractModalData(block);
    const modalStructure = createModalStructure(modalData);
    
    // Replace block content
    block.innerHTML = '';
    block.appendChild(modalStructure.trigger);
    
    // Add modal to body (not block, for z-index control)
    document.body.appendChild(modalStructure.modal);
    
    // Setup behavior
    setupModalBehavior(modalStructure);
    
  } catch (error) {
    console.warn('[Feature Modal] Enhancement failed:', error);
    showFallbackContent(block);
  }
}

function extractModalData(block) {
  const rows = Array.from(block.querySelectorAll('div > div > p'));
  
  return {
    triggerText: rows[0]?.textContent || 'Open Modal',
    title: rows[1]?.textContent || 'Modal Title',
    content: rows[2]?.innerHTML || 'Modal content goes here',
    ctaText: rows[3]?.textContent || 'Close'
  };
}

function createModalStructure(data) {
  // Create trigger button
  const trigger = document.createElement('button');
  trigger.className = 'feature-modal-trigger';
  trigger.textContent = data.triggerText;
  trigger.setAttribute('aria-haspopup', 'dialog');
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'feature-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'feature-modal-container';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'feature-modal-header';
  
  const title = document.createElement('h2');
  title.id = 'modal-title';
  title.className = 'feature-modal-title';
  title.textContent = data.title;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'feature-modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close modal');
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // Create content
  const content = document.createElement('div');
  content.className = 'feature-modal-content';
  content.innerHTML = data.content;
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'feature-modal-footer';
  
  const ctaButton = document.createElement('button');
  ctaButton.className = 'feature-modal-cta';
  ctaButton.textContent = data.ctaText;
  
  footer.appendChild(ctaButton);
  
  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(content);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  
  return { trigger, modal: overlay, closeButton, ctaButton };
}

function setupModalBehavior({ trigger, modal, closeButton, ctaButton }) {
  let isOpen = false;
  let previousFocus = null;
  
  // Open modal
  function openModal() {
    if (isOpen) return;
    
    previousFocus = document.activeElement;
    isOpen = true;
    
    modal.classList.add('feature-modal-visible');
    document.body.classList.add('modal-open');
    
    // Focus management
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();
    
    // Setup focus trap
    if (MODAL_CONFIG.FOCUS_TRAP) {
      setupFocusTrap(modal);
    }
  }
  
  // Close modal
  function closeModal() {
    if (!isOpen) return;
    
    isOpen = false;
    modal.classList.remove('feature-modal-visible');
    document.body.classList.remove('modal-open');
    
    // Restore focus
    previousFocus?.focus();
    previousFocus = null;
    
    // Remove focus trap
    removeFocusTrap();
  }
  
  // Event listeners
  trigger.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  ctaButton.addEventListener('click', closeModal);
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === MODAL_CONFIG.ESCAPE_KEY && isOpen) {
      closeModal();
    }
  });
  
  // Overlay click
  if (MODAL_CONFIG.OVERLAY_CLICK_DISMISS) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}

function setupFocusTrap(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
  
  modal.addEventListener('keydown', trapFocus);
  modal._focusTrap = trapFocus; // Store for cleanup
}

function removeFocusTrap() {
  const modal = document.querySelector('.feature-modal-overlay');
  if (modal && modal._focusTrap) {
    modal.removeEventListener('keydown', modal._focusTrap);
    delete modal._focusTrap;
  }
}
```

---

## 📚 Chapter 5: CSS Architecture and Responsive Design

### The Art of EDS Styling: Performance Meets Flexibility

CSS in EDS isn't just about making things look good—it's about creating styles that load fast, work everywhere, and integrate seamlessly with the content-first architecture. Unlike traditional frameworks where CSS often becomes an afterthought or gets generated by build tools, EDS CSS is hand-crafted, purposeful, and directly tied to performance.

EDS has specific CSS constraints that might seem limiting at first but are actually liberating once you understand them. These constraints ensure that your styles don't conflict with other blocks, don't hurt performance, and work consistently across different content scenarios.

### Why EDS CSS Architecture Matters

In traditional development, CSS often becomes a maintenance nightmare: specificity wars, unused rules, unpredictable cascading, and performance bottlenecks. EDS prevents these problems through architectural constraints that force good practices while maintaining flexibility.

The key insight is that EDS CSS follows the same content-first philosophy as the JavaScript: you're not building a design system from scratch, you're enhancing and refining what's already there. The base styles provide a solid foundation, and your block styles add purposeful enhancements.

### Understanding the CSS Hierarchy

EDS has a carefully designed CSS hierarchy that ensures consistency and performance:

1. **Base Styles** (`/styles/styles.css`): Global typography, colors, and layout foundations
2. **Block Styles** (`/blocks/blockname/blockname.css`): Component-specific styling
3. **Variation Styles**: Additional classes for different block presentations

This hierarchy isn't just organization—it's performance optimization. Base styles load once and cache across all pages. Block styles load only when needed. Variations use simple class toggles rather than duplicating CSS.

### EDS CSS Best Practices

EDS has specific CSS patterns that you must follow for compatibility. These aren't arbitrary rules—they're designed to prevent conflicts and ensure performance:

```css
/* ✅ Correct: Target the block element */
.feature-modal.block {
  display: inline-block;
  margin: 1rem 0;
}

/* ❌ Wrong: Never style container elements */
.feature-modal-container {
  /* EDS container elements should never have styling */
}

/* ✅ Correct: Style wrapper elements for layout */
.feature-modal-wrapper {
  padding: 1rem;
  max-width: 600px;
}
```

### Responsive Design Patterns

```css
/* /blocks/feature-modal/feature-modal.css */
.feature-modal.block {
  display: inline-block;
}

.feature-modal-trigger {
  background: var(--link-color, #0066cc);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-modal-trigger:hover {
  background: var(--link-hover-color, #0052a3);
  transform: translateY(-1px);
}

.feature-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.feature-modal-overlay.feature-modal-visible {
  opacity: 1;
  visibility: visible;
}

.feature-modal-container {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 600px;
  overflow: hidden;
  transform: scale(0.9) translateY(20px);
  transition: transform 0.3s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-modal-visible .feature-modal-container {
  transform: scale(1) translateY(0);
}

.feature-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.feature-modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--heading-color, #1f2937);
}

.feature-modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.feature-modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.feature-modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.feature-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: right;
}

.feature-modal-cta {
  background: var(--link-color, #0066cc);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.feature-modal-cta:hover {
  background: var(--link-hover-color, #0052a3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .feature-modal-container {
    width: 95vw;
    max-height: 95vh;
    margin: 1rem;
  }
  
  .feature-modal-header,
  .feature-modal-content,
  .feature-modal-footer {
    padding: 1rem;
  }
  
  .feature-modal-title {
    font-size: 1.25rem;
  }
}

/* Body scroll lock */
body.modal-open {
  overflow: hidden;
}

/* Focus styles for accessibility */
.feature-modal-trigger:focus,
.feature-modal-close:focus,
.feature-modal-cta:focus {
  outline: 2px solid var(--link-color, #0066cc);
  outline-offset: 2px;
}
```

---

## 📚 Chapter 6: Testing and Debugging Mastery

### The EDS Testing Philosophy: Real Conditions, Real Results

Testing EDS blocks requires a fundamentally different approach than testing traditional web applications. You're not testing isolated components in a controlled environment—you're testing enhancement layers that must work across varied content scenarios, different network conditions, and diverse user capabilities.

EDS testing is about ensuring graceful degradation and progressive enhancement work correctly. Your blocks must function when JavaScript loads slowly, when CSS fails to load, when images are blocked, when users have disabilities, and when content authors create unexpected content structures. This comprehensive testing approach is what enables EDS sites to maintain perfect Lighthouse scores in production.

### Why Traditional Testing Approaches Fall Short

Most web testing focuses on happy path scenarios: fast networks, modern browsers, perfect content, enabled JavaScript. But EDS blocks must work in the real world where conditions are unpredictable. A block that works perfectly in a controlled test environment might fail catastrophically when deployed to production with real user traffic.

EDS testing methodologies address this by simulating real-world conditions and edge cases. You'll test with throttled networks, disabled JavaScript, various content structures, and different user interaction patterns. This comprehensive approach ensures your blocks enhance user experience rather than breaking it.

### The Multi-Layered Testing Strategy

Effective EDS testing happens at multiple levels:

**Structural Testing:** Does your block handle different content structures gracefully?
**Functional Testing:** Do all interactive features work across browsers and devices?
**Performance Testing:** Does your block maintain EDS's performance standards?
**Accessibility Testing:** Can all users interact with your block effectively?
**Degradation Testing:** Does your block fail gracefully when components don't load?

### EDS-Specific Testing Patterns

Testing EDS blocks requires understanding the framework's unique characteristics and building test scenarios that reflect real usage:

```html
<!-- Comprehensive test file pattern -->
<!DOCTYPE html>
<html>
<head>
    <title>Feature Modal - Comprehensive Tests</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="module" src="/scripts/aem.js"></script>
    <link rel="stylesheet" href="/styles/styles.css">
    <style>
        .test-section {
            margin: 2rem 0;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .debug-info {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            font-size: 0.875rem;
        }
        
        .test-controls {
            margin: 1rem 0;
        }
        
        .test-button {
            background: #059669;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin: 0 8px 8px 0;
            cursor: pointer;
        }
    </style>
</head>
<body class="appear">
    <main>
        <div class="section">
            <h1>Feature Modal - Test Suite</h1>
            
            <!-- Basic functionality test -->
            <div class="test-section">
                <h2>Basic Modal Test</h2>
                <div class="debug-info">
                    <strong>Expected behavior:</strong> Modal opens and closes properly
                </div>
                
                <div class="feature-modal block" data-block-name="feature-modal" data-block-status="initialized">
                    <div>
                        <div>
                            <p>Open Demo Modal</p>
                            <p>Welcome to Our Service</p>
                            <p>This is a demonstration modal that showcases our feature. Click the button below to continue.</p>
                            <p>Get Started</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Accessibility test -->
            <div class="test-section">
                <h2>Accessibility Test</h2>
                <div class="debug-info">
                    <strong>Test:</strong> Tab navigation, Escape key, focus management
                </div>
                <div class="test-controls">
                    <button class="test-button" onclick="testKeyboardNavigation()">Test Keyboard</button>
                    <button class="test-button" onclick="testFocusManagement()">Test Focus</button>
                </div>
                
                <div class="feature-modal block" data-block-name="feature-modal" data-block-status="initialized">
                    <div>
                        <div>
                            <p>Accessibility Test Modal</p>
                            <p>Focus Management Test</p>
                            <p>Test tab navigation and escape key functionality</p>
                            <p>Close</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Error handling test -->
            <div class="test-section">
                <h2>Error Handling Test</h2>
                <div class="debug-info">
                    <strong>Test:</strong> Malformed content handling
                </div>
                
                <div class="feature-modal block" data-block-name="feature-modal" data-block-status="initialized">
                    <div>
                        <div>
                            <!-- Minimal content to test error handling -->
                            <p>Minimal Modal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import decorate from './feature-modal.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            // Make body appear (EDS requirement)
            document.body.classList.add('appear');
            
            // Initialize all modal blocks
            const blocks = document.querySelectorAll('.feature-modal.block');
            blocks.forEach(decorate);
        });
        
        // Test functions
        window.testKeyboardNavigation = function() {
            console.log('🧪 Testing keyboard navigation...');
            
            const trigger = document.querySelector('.feature-modal-trigger');
            if (trigger) {
                trigger.focus();
                console.log('✅ Trigger focused');
                
                // Simulate Enter key
                trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                trigger.click();
                
                setTimeout(() => {
                    // Test Escape key
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                    console.log('✅ Escape key tested');
                }, 500);
            }
        };
        
        window.testFocusManagement = function() {
            console.log('🧪 Testing focus management...');
            
            const trigger = document.querySelector('.feature-modal-trigger');
            if (trigger) {
                const originalFocus = document.activeElement;
                trigger.click();
                
                setTimeout(() => {
                    const modalFocused = document.activeElement;
                    console.log('✅ Modal focused element:', modalFocused.className);
                    
                    // Close modal
                    const closeBtn = document.querySelector('.feature-modal-close');
                    if (closeBtn) {
                        closeBtn.click();
                        
                        setTimeout(() => {
                            console.log('✅ Focus returned to:', document.activeElement.className);
                        }, 100);
                    }
                }, 100);
            }
        };
    </script>
</body>
</html>
```

### Advanced Debugging Techniques

```javascript
// Debug utility for EDS blocks
const DEBUG_MODE = window.location.hostname === 'localhost' && 
                   window.location.port === '3000';

function debugLog(blockName, message, data = null) {
  if (DEBUG_MODE) {
    console.log(`[${blockName.toUpperCase()}] ${message}`, data || '');
  }
}

function debugBlock(block, blockName) {
  if (DEBUG_MODE) {
    console.group(`🔍 Debugging ${blockName}`);
    console.log('Block element:', block);
    console.log('Block classes:', block.className);
    console.log('Block dataset:', block.dataset);
    console.log('Block content:', block.innerHTML);
    console.log('Block dimensions:', {
      width: block.offsetWidth,
      height: block.offsetHeight
    });
    console.groupEnd();
  }
}

// Enhanced decorate function with debugging
export default function decorate(block) {
  debugBlock(block, 'feature-modal');
  
  try {
    debugLog('feature-modal', 'Starting decoration');
    
    // ... your block logic here ...
    
    debugLog('feature-modal', 'Decoration completed successfully');
    
  } catch (error) {
    debugLog('feature-modal', 'Decoration failed', error);
    console.error('[Feature Modal] Error:', error);
    showFallbackContent(block);
  }
}
```

---

## 📚 Chapter 7: Performance Optimization

### The Performance Imperative: Why Speed Defines Success

Performance isn't optional in EDS—it's fundamental to the platform's value proposition. EDS exists because traditional CMS and framework solutions consistently fail to deliver the fast, lightweight experiences that modern users demand. Every architectural decision in EDS prioritizes performance, and your blocks must continue this tradition.

When we talk about performance in EDS, we're not just talking about load times. We're talking about Core Web Vitals, user experience metrics that directly impact search rankings, conversion rates, and user satisfaction. EDS sites consistently achieve perfect 100/100/100/100 Lighthouse scores not by accident, but through careful architectural choices at every level.

### Understanding the Performance Ecosystem

EDS performance comes from systematic optimization across multiple layers:

**Architecture Level:** No framework overhead, minimal JavaScript, CSS-only animations
**Loading Level:** Progressive enhancement, critical resource prioritization, intelligent caching
**Runtime Level:** Efficient DOM manipulation, minimal reflows, optimized event handling
**Content Level:** Optimized images, lazy loading, content-driven code splitting

Your blocks participate in this ecosystem. Every line of JavaScript, every CSS rule, every DOM manipulation either contributes to or detracts from the overall performance profile. Understanding this responsibility is crucial for EDS development.

### The Core Web Vitals Challenge

Core Web Vitals measure user-perceived performance through three key metrics:

**Largest Contentful Paint (LCP):** How quickly the main content becomes visible
**First Input Delay (FID):** How quickly the page responds to user interactions  
**Cumulative Layout Shift (CLS):** How much the page layout shifts during loading

Traditional frameworks struggle with these metrics because they prioritize developer experience over user experience. EDS inverts this priority, and your blocks must follow suit.

### Core Web Vitals for EDS Blocks

Understanding how your blocks impact Core Web Vitals is essential for maintaining EDS's performance advantages:

```javascript
// Performance-optimized block pattern
export default async function decorate(block) {
  // 1. Show content immediately (LCP optimization)
  showImmediateContent(block);
  
  // 2. Defer heavy operations (FID optimization)
  requestIdleCallback(() => {
    enhanceWithAdvancedFeatures(block);
  });
  
  // 3. Avoid layout shifts (CLS optimization)
  reserveSpace(block);
}

function showImmediateContent(block) {
  // Extract and show basic content immediately
  const content = extractBasicContent(block);
  const basicStructure = createBasicStructure(content);
  
  block.innerHTML = '';
  block.appendChild(basicStructure);
}

function reserveSpace(block) {
  // Set dimensions to prevent layout shift
  const container = block.querySelector('.feature-container');
  if (container) {
    container.style.minHeight = '200px'; // Reserve space
  }
}

// Lazy loading images efficiently
function createOptimizedImage(src, alt) {
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = src;
  img.alt = alt;
  
  // Prevent layout shift
  img.style.aspectRatio = '16/9';
  img.style.objectFit = 'cover';
  
  return img;
}

// Efficient event handling
function setupEfficientEventHandlers(container) {
  // Use event delegation instead of individual handlers
  container.addEventListener('click', (e) => {
    if (e.target.matches('.button-primary')) {
      handlePrimaryAction(e);
    } else if (e.target.matches('.button-secondary')) {
      handleSecondaryAction(e);
    }
  });
  
  // Use passive listeners where possible
  container.addEventListener('scroll', handleScroll, { passive: true });
}
```

### Memory Management

```javascript
// Proper cleanup for EDS blocks
class BlockManager {
  constructor(block) {
    this.block = block;
    this.cleanup = [];
    this.observers = [];
  }
  
  addEventHandler(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    
    // Store cleanup function
    this.cleanup.push(() => {
      element.removeEventListener(event, handler, options);
    });
  }
  
  addIntersectionObserver(callback, options) {
    const observer = new IntersectionObserver(callback, options);
    this.observers.push(observer);
    return observer;
  }
  
  destroy() {
    // Clean up event listeners
    this.cleanup.forEach(cleanup => cleanup());
    
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Clear references
    this.cleanup = [];
    this.observers = [];
  }
}

// Usage in block
export default function decorate(block) {
  const manager = new BlockManager(block);
  
  // Store manager reference for cleanup
  block._manager = manager;
  
  // Setup with automatic cleanup tracking
  const button = block.querySelector('button');
  manager.addEventHandler(button, 'click', handleClick);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (block._manager) {
      block._manager.destroy();
    }
  });
}
```

---

## 📚 Chapter 8: Accessibility Excellence

### Accessibility as Foundation, Not Afterthought

Accessibility in EDS isn't a compliance checkbox—it's a fundamental design principle that improves the experience for everyone. When you build with accessibility from the ground up, you create more robust, more usable, and more maintainable code. EDS's content-first philosophy naturally supports accessibility because it starts with semantic content and enhances progressively.

The misconception that accessibility limits design creativity is exactly backwards. Proper accessibility practices force you to think more clearly about user interactions, information hierarchy, and progressive enhancement. These constraints lead to better design decisions and more resilient code.

### Why EDS and Accessibility Are Natural Partners

EDS's architectural principles align perfectly with accessibility best practices:

**Semantic Foundation:** Content starts as proper HTML elements with inherent accessibility
**Progressive Enhancement:** Core functionality works without JavaScript, enhanced features layer on top
**Performance Focus:** Fast loading benefits everyone, especially users with disabilities
**Device Independence:** Works across assistive technologies and input methods

This alignment means that following EDS patterns naturally creates more accessible experiences. But it also means you have a responsibility to maintain these accessibility benefits as you add enhancement layers.

### The Accessibility Mindset Shift

Most developers think about accessibility as adding features for disabled users. This is wrong. Accessibility is about creating flexible interfaces that work for the widest range of human capabilities and interaction preferences. When you design for screen readers, you improve keyboard navigation. When you optimize for motor disabilities, you improve mobile touch interactions. When you design for cognitive differences, you improve usability for everyone.

In EDS development, this means thinking about accessibility at every decision point: How will this enhancement work for keyboard users? How will screen readers interpret this content? How will users with motor difficulties interact with this interface? How will people with cognitive differences understand this flow?

### Comprehensive Accessibility Implementation

Building truly accessible EDS blocks requires understanding and implementing multiple layers of accessibility support:

```javascript
// Comprehensive accessibility implementation
export default function decorate(block) {
  const accessibleStructure = createAccessibleStructure(block);
  setupAccessibilityFeatures(accessibleStructure);
  
  block.innerHTML = '';
  block.appendChild(accessibleStructure);
}

function createAccessibleStructure(block) {
  const container = document.createElement('div');
  container.className = 'accessible-component';
  
  // Semantic structure
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.setAttribute('aria-label', 'Component content');
  
  // Heading hierarchy
  const heading = document.createElement('h2');
  heading.id = 'component-heading';
  heading.textContent = 'Component Title';
  
  // Interactive elements with proper ARIA
  const button = document.createElement('button');
  button.setAttribute('aria-describedby', 'component-description');
  button.setAttribute('aria-expanded', 'false');
  
  // Description for screen readers
  const description = document.createElement('div');
  description.id = 'component-description';
  description.className = 'sr-only';
  description.textContent = 'Click to expand component details';
  
  // Live region for dynamic updates
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  
  main.appendChild(heading);
  main.appendChild(description);
  main.appendChild(button);
  main.appendChild(liveRegion);
  container.appendChild(main);
  
  return container;
}

function setupAccessibilityFeatures(container) {
  const button = container.querySelector('button');
  const liveRegion = container.querySelector('[aria-live]');
  
  // Keyboard navigation
  container.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (e.target === button) {
          e.preventDefault();
          button.click();
        }
        break;
      case 'Escape':
        closeComponent();
        break;
    }
  });
  
  // Screen reader announcements
  function announceChange(message) {
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
  
  // Focus management
  function manageFocus() {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          // Custom tab order if needed
        }
      });
    });
  }
  
  manageFocus();
}
```

### CSS for Accessibility

```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .component-button {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .component-container {
    animation: none;
    transition: none;
  }
}

/* Focus indicators */
.component-button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Color blindness considerations */
.component-status {
  /* Don't rely only on color */
  background: #28a745;
  color: white;
}

.component-status::before {
  content: "✓ ";
  font-weight: bold;
}
```

---

## 📚 Chapter 9: Troubleshooting Common Issues

### The Reality of EDS Development: When Things Go Wrong

Even with perfect understanding of EDS principles, you'll encounter issues. This isn't a failure—it's an inevitable part of working with a sophisticated system that bridges content creation, web standards, and performance optimization. The key is developing systematic approaches to identify, understand, and resolve issues quickly.

EDS troubleshooting is different from traditional web debugging because you're working with a content-first system that has specific architectural constraints. Issues often stem from misunderstanding these constraints rather than bugs in your code. Learning to recognize and resolve these misunderstandings will make you a more effective EDS developer.

### The Systematic Debugging Approach

Effective EDS troubleshooting follows a systematic approach that moves from broad system checks to specific implementation details:

**System Level:** Is EDS itself working? Are core files loading?
**Architecture Level:** Does your block follow EDS structural requirements?
**Implementation Level:** Are your JavaScript and CSS working as expected?
**Content Level:** Does your block handle the specific content structure correctly?
**Environment Level:** Are development server and proxy working properly?

This systematic approach prevents the common mistake of diving into code details before confirming that the foundational systems are working correctly.

### Understanding EDS-Specific Error Patterns

EDS has unique error patterns that stem from its architectural choices. Understanding these patterns helps you diagnose issues quickly and avoid common pitfalls:

**Dynamic Loading Issues:** Problems with EDS's automatic CSS/JS loading
**Content Structure Issues:** Blocks that don't handle EDS's nested div structure
**Proxy and Development Issues:** Problems with the local development server
**CSS Specificity Issues:** Conflicts with EDS's CSS architecture
**Progressive Enhancement Issues:** Blocks that don't degrade gracefully

Let's explore the most common issues and their systematic solutions:

### Issue 1: Block Not Loading

This is the most common issue for new EDS developers, and it usually stems from misunderstanding EDS's block structure requirements.

**Symptoms:**
- Block appears as plain content
- No styling applied
- JavaScript not executing

**Debugging Steps:**

```javascript
// 1. Check block structure
console.log('Block exists:', !!document.querySelector('.my-block.block'));
console.log('Block classes:', document.querySelector('.my-block.block')?.className);

// 2. Check file loading
const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
cssLinks.forEach(link => {
  console.log('CSS loaded:', link.href, link.sheet ? '✅' : '❌');
});

// 3. Check JavaScript errors
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// 4. Check EDS initialization
console.log('EDS scripts loaded:', {
  aem: !!window.hlx,
  blocks: !!window.hlx?.codeBasePath
});
```

**Common Solutions:**

```html
<!-- ✅ Correct block structure -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
  <div>
    <div>Content here</div>
  </div>
</div>

<!-- ❌ Wrong: Missing .block class -->
<div class="my-block" data-block-name="my-block">
  
<!-- ❌ Wrong: Incorrect data attributes -->
<div class="my-block block" data-block="my-block">
```

### Issue 2: CSS Not Applied

**Debugging CSS Loading:**

```javascript
// Check if CSS file loaded
function checkCSSLoading(blockName) {
  const expectedCSS = `/blocks/${blockName}/${blockName}.css`;
  const cssLink = document.querySelector(`link[href="${expectedCSS}"]`);
  
  if (!cssLink) {
    console.error(`❌ CSS not loaded: ${expectedCSS}`);
    return false;
  }
  
  if (!cssLink.sheet) {
    console.error(`❌ CSS file empty or failed to load: ${expectedCSS}`);
    return false;
  }
  
  console.log(`✅ CSS loaded successfully: ${expectedCSS}`);
  return true;
}

// Check CSS rules applied
function checkCSSRules(element, property) {
  const computed = window.getComputedStyle(element);
  const value = computed.getPropertyValue(property);
  console.log(`CSS ${property}:`, value);
  return value;
}
```

### Issue 3: Server Proxy Issues

**Server Debugging:**

```bash
# Check server logs for proxy issues
Request: GET /missing-file.json
Local file not found, attempting proxy for: /missing-file.json
❌ Error proxying request for /missing-file.json: fetch failed

# Solutions:
1. Check internet connection
2. Verify proxy URL in server.js
3. Check if remote file exists
4. Look for CORS issues
```

### Issue 4: Modal/Overlay Not Appearing

**Common Modal Issues:**

```javascript
// Debug modal visibility
function debugModal() {
  const modal = document.querySelector('.modal-overlay');
  
  if (!modal) {
    console.error('❌ Modal element not found');
    return;
  }
  
  console.log('Modal element:', modal);
  console.log('Modal computed styles:', {
    display: window.getComputedStyle(modal).display,
    visibility: window.getComputedStyle(modal).visibility,
    opacity: window.getComputedStyle(modal).opacity,
    zIndex: window.getComputedStyle(modal).zIndex
  });
  
  // Check if body has modal-open class
  console.log('Body classes:', document.body.className);
  
  // Check for JavaScript errors
  console.log('Modal click handlers:', modal.onclick ? '✅' : '❌');
}

// Common fixes
function fixModalIssues() {
  // 1. Ensure modal is added to body, not block
  const modal = createModal();
  document.body.appendChild(modal); // Not block.appendChild(modal)
  
  // 2. Check z-index stacking
  modal.style.zIndex = '9999';
  
  // 3. Ensure proper CSS transition
  modal.classList.add('modal-visible');
  
  // 4. Clear localStorage if it's preventing display
  localStorage.removeItem('modal-dismissed');
}
```

---

## 📚 Chapter 10: Advanced Deployment and Production

### From Development to Production: The Final Mile

Deploying EDS blocks to production is deceptively simple—you copy files to a server—but ensuring production success requires careful preparation, validation, and monitoring. Production is where your architectural choices, performance optimizations, and accessibility implementations are tested by real users under real conditions.

The transition from development to production in EDS is unique because there's no build process to catch errors, no bundling step to optimize assets, and no deployment pipeline to validate functionality. This simplicity is powerful, but it places responsibility squarely on your development practices and testing procedures.

### Why Production Readiness Matters More in EDS

In traditional frameworks, build processes and deployment pipelines catch many issues before they reach users. EDS's direct deployment approach means that what you develop is exactly what users experience. This direct relationship between development and production has profound implications:

**Performance Impact:** Every byte of CSS and JavaScript affects user experience directly
**Error Handling:** Runtime errors can't be caught by build tools—they must be prevented by code quality
**Compatibility:** Browser and device issues must be caught during development testing
**Accessibility:** No tooling will enforce accessibility—it must be built into your development process

### The Production Environment Difference

Production environments introduce variables that development can't fully simulate:

**Scale:** Real user traffic patterns and concurrent usage
**Content Diversity:** Content authors creating unexpected content structures  
**Network Conditions:** Slow connections, intermittent connectivity, geographic latency
**Device Diversity:** Screen readers, older browsers, mobile devices, unusual viewport sizes
**Integration Complexity:** Interaction with analytics, marketing tools, content management systems

Successful EDS deployment requires anticipating and preparing for these production realities.

### Production Checklist

Before deploying your EDS block to production, systematic validation across multiple dimensions ensures user success:

```javascript
// Production readiness checklist
const PRODUCTION_CHECKLIST = {
  performance: {
    coreWebVitals: 'Lighthouse score 100/100/100/100',
    imageOptimization: 'All images optimized and lazy loaded',
    codeMinification: 'JavaScript and CSS minified',
    bundleSize: 'Total block size < 50KB'
  },
  
  accessibility: {
    screenReader: 'Tested with NVDA/VoiceOver',
    keyboardNavigation: 'All interactive elements accessible',
    colorContrast: 'WCAG AA compliance verified',
    focusManagement: 'Proper focus indicators and trapping'
  },
  
  compatibility: {
    browsers: 'Tested on Chrome, Firefox, Safari, Edge',
    mobile: 'Responsive design verified',
    slowConnections: 'Works on 3G connections',
    javascriptDisabled: 'Graceful degradation implemented'
  },
  
  security: {
    xss: 'Input sanitization implemented',
    contentSecurity: 'CSP compliance verified',
    dataValidation: 'All user inputs validated',
    errorHandling: 'No sensitive data in error messages'
  }
};

// Automated production validation
function validateProductionReadiness(blockName) {
  console.group(`🚀 Production Readiness: ${blockName}`);
  
  // Check bundle size
  const blockJS = `/blocks/${blockName}/${blockName}.js`;
  const blockCSS = `/blocks/${blockName}/${blockName}.css`;
  
  fetch(blockJS).then(response => {
    const sizeKB = (response.headers.get('content-length') / 1024).toFixed(2);
    console.log(`JavaScript size: ${sizeKB}KB`);
  });
  
  fetch(blockCSS).then(response => {
    const sizeKB = (response.headers.get('content-length') / 1024).toFixed(2);
    console.log(`CSS size: ${sizeKB}KB`);
  });
  
  // Check accessibility
  const block = document.querySelector(`.${blockName}.block`);
  if (block) {
    const ariaElements = block.querySelectorAll('[aria-label], [aria-describedby], [role]');
    console.log(`Accessibility attributes: ${ariaElements.length} found`);
  }
  
  console.groupEnd();
}
```

### Deployment Best Practices

```bash
# 1. Test locally first
npm run debug
# Navigate to http://localhost:3000/blocks/your-block/test.html

# 2. Validate code quality
npm run lint

# 3. Test accessibility
# Use browser dev tools accessibility checker

# 4. Performance audit
# Run Lighthouse audit on test page

# 5. Cross-browser testing
# Test on multiple browsers and devices

# 6. Deploy to staging
# Test in staging environment with real content

# 7. Production deployment
# Deploy files to production server
```

### Monitoring and Maintenance

```javascript
// Add monitoring to production blocks
export default function decorate(block) {
  try {
    // Your block logic here
    
    // Success monitoring
    if (window.gtag) {
      window.gtag('event', 'block_loaded', {
        block_name: 'your-block',
        status: 'success'
      });
    }
    
  } catch (error) {
    // Error monitoring
    console.error('[Block] Error:', error);
    
    if (window.gtag) {
      window.gtag('event', 'block_error', {
        block_name: 'your-block',
        error_message: error.message
      });
    }
    
    showFallbackContent(block);
  }
}

// Performance monitoring
function monitorPerformance(blockName) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes(blockName)) {
        console.log(`${blockName} loading time:`, entry.duration);
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}
```

---

## 🎓 Final Assessment and Next Steps

### Mastery Checklist

Rate yourself on these competencies:

**Foundation (Beginner)**
- [ ] Understand EDS content-first philosophy
- [ ] Can create basic HTML test files
- [ ] Understand block naming conventions
- [ ] Can start and use development server
- [ ] Can create simple decorate functions

**Intermediate**
- [ ] Can build interactive blocks with event handlers
- [ ] Understand CSS architecture and responsive design
- [ ] Can implement proper error handling
- [ ] Can debug blocks using browser dev tools
- [ ] Can fetch and display external data

**Advanced**
- [ ] Can implement complex modal and overlay systems
- [ ] Master accessibility patterns and ARIA attributes
- [ ] Can optimize for Core Web Vitals
- [ ] Can implement focus management and keyboard navigation
- [ ] Can troubleshoot production issues

**Expert**
- [ ] Can architect dual-directory build systems
- [ ] Can implement performance monitoring
- [ ] Can create reusable patterns and utilities
- [ ] Can mentor others in EDS development
- [ ] Can contribute to EDS framework improvements

### Your Next Project

Now that you've completed this training, choose a capstone project:

1. **E-commerce Product Gallery** - Cards with filtering and modals
2. **Interactive Dashboard** - Data visualization with real-time updates
3. **Multi-step Form Wizard** - Complex form with validation and progress
4. **Content Management Interface** - CRUD operations with local storage
5. **Accessibility Showcase** - Demonstrate all accessibility patterns

### Continued Learning Resources

- **EDS Official Documentation** - Keep up with framework updates
- **Web Standards** - MDN Web Docs for HTML, CSS, JavaScript
- **Accessibility** - WCAG guidelines and testing tools
- **Performance** - Core Web Vitals and optimization techniques
- **Community** - Join EDS developer forums and discussions

---

## 🤖 AI Instructor Final Words

Congratulations! You've completed the comprehensive EDS block development training. You now have the knowledge to:

- Build sophisticated, accessible, and performant EDS blocks
- Debug issues efficiently using the development server
- Implement proper testing and validation workflows
- Deploy production-ready blocks that maintain EDS's performance standards

Remember the EDS philosophy: **simplicity over complexity, performance over features, content over code structure**. Every decision should serve the user experience first.

The web development landscape is constantly evolving, but the principles you've learned here—semantic HTML, progressive enhancement, accessibility-first design, and performance optimization—are timeless.

Your journey as an EDS developer has just begun. Use these skills to create amazing web experiences that are fast, accessible, and delightful for all users.

**Happy coding, and welcome to the EDS community!** 🚀

---

*This training document will continue to evolve. Bookmark it, reference it, and most importantly—build amazing things with EDS!*