# Using Web Components in Adobe Edge Delivery Services Blocks

Web components have changed how developers create reusable UI elements. When you combine them with Adobe Edge Delivery Services (EDS), you get a solid foundation for building interactive, maintainable blocks. Here's how to make the most of web components in your EDS projects.

## What are Web Components?

Web Components are standardised APIs that let you create custom HTML elements. They bring together four main technologies that work in harmony. Custom Elements allow you to define new HTML elements, while Shadow DOM encapsulates your styles and markup. HTML Templates provide reusable markup patterns, and ES Modules handle the packaging and distribution of your components.

The great thing about web components? They work natively in modern browsers without any external frameworks.

## Why Use Web Components in EDS?

EDS blocks and web components work brilliantly together. The natural encapsulation that web components provide means your blocks stay self-contained and predictable. Since they're framework-agnostic, you won't find yourself locked into any particular technology stack. They fit perfectly with EDS's block-based architecture, keeping concerns cleanly separated while remaining highly reusable across your projects.

## A Practical Example, without libraries \- The Counter Block

Let's look at a working example: a counter block that uses web components. This block creates an interactive counter with increment and decrement functionality.

### How It Works

The counter block uses a custom element called `counter-element`. The implementation starts with a simple table in your document:

![][image1]

Live Example

| Counter |
| :---- |
| 5 |

The web component itself is defined in the block's JavaScript file, including the CSS, remember to create a blank css file to keep EDS happy :

`/*`  
 `* Counter Block`  
 `* A simple counter component using web components`  
 `*/`

`// Configuration object for the counter block`

`const COUNTER_CONFIG = {`  
  `CLASS_NAMES: {`  
    `COUNTER: 'counter-component',`  
    `BUTTON: 'counter-button',`  
    `DISPLAY: 'counter-display',`  
  `},`

  `ARIA_LABELS: {`  
    `INCREMENT: 'Increment counter',`  
    `DECREMENT: 'Decrement counter',`  
    `DISPLAY: 'Current count',`  
  `},`

  `ERROR_MESSAGES: {`  
    `INVALID_INITIAL: 'Invalid initial value provided',`  
  `},`  
`};`

`// Define the Counter Web Component`  
`class CounterElement extends HTMLElement {`  
  `constructor() {`  
    `super();`  
    `this.count = parseInt(this.getAttribute('initial-value') || '0', 10);`  
    `this.attachShadow({ mode: 'open' });`  
  `}`

  `connectedCallback() {`  
    `this.render();`  
    `this.setupEventListeners();`  
  `}`  
  `render() {`  
    `const { shadowRoot } = this;`  
    `` shadowRoot.innerHTML = ` ``  
      `<style>`  
        `:host {`  
          `display: block;`  
          `--counter-button-bg: var(--color-primary, #007bff);`  
          `--counter-button-color: var(--color-text-inverse, #ffffff);`  
          `--counter-display-bg: var(--color-background, #f8f9fa);`  
          `--counter-display-color: var(--color-text, #212529);`  
        `}`

        `.counter-wrapper {`  
          `display: flex;`  
          `align-items: center;`  
          `gap: 1rem;`  
          `padding: 1rem;`  
          `font-family: var(--font-family-base, system-ui);`  
        `}`

        `.counter-button {`  
          `background: var(--counter-button-bg);`  
          `color: var(--counter-button-color);`  
          `border: none;`  
          `border-radius: 4px;`  
          `padding: 0.5rem 1rem;`  
          `cursor: pointer;`  
          `font-size: 1rem;`  
          `transition: opacity 0.2s;`  
        `}`

        `.counter-button:hover {`  
          `opacity: 0.9;`  
        `}`

        `.counter-button:focus-visible {`  
          `outline: 2px solid var(--counter-button-bg);`  
          `outline-offset: 2px;`  
        `}`

        `.counter-display {`  
          `background: var(--counter-display-bg);`  
          `color: var(--counter-display-color);`  
          `padding: 0.5rem 1rem;`  
          `border-radius: 4px;`  
          `min-width: 3rem;`  
          `text-align: center;`  
          `font-size: 1.25rem;`  
          `font-weight: bold;`  
        `}`  
      `</style>`  
          
      `<div class="counter-wrapper">`  
        `<button class="counter-button" aria-label="${COUNTER_CONFIG.ARIA_LABELS.DECREMENT}">-</button>`  
        `<div class="counter-display" aria-label="${COUNTER_CONFIG.ARIA_LABELS.DISPLAY}">${this.count}</div>`  
        `<button class="counter-button" aria-label="${COUNTER_CONFIG.ARIA_LABELS.INCREMENT}">+</button>`  
      `</div>`  
    `` `; ``  
  `}`

  `setupEventListeners() {`  
    `const { shadowRoot } = this;`  
    `const incrementButton = shadowRoot.querySelector('.counter-button:last-child');`  
    `const decrementButton = shadowRoot.querySelector('.counter-button:first-child');`  
    `const display = shadowRoot.querySelector('.counter-display');`  
    `incrementButton.addEventListener('click', () => {`  
      `this.count += 1;`  
      `display.textContent = this.count;`  
      `this.dispatchEvent(new CustomEvent('count-change', { detail: { count: this.count } }));`  
    `});`  
    `decrementButton.addEventListener('click', () => {`  
      `this.count -= 1;`  
      `display.textContent = this.count;`  
      `this.dispatchEvent(new CustomEvent('count-change', { detail: { count: this.count } }));`  
    `});`  
  `}`  
`}`

`// Register the web component`  
`customElements.define('counter-element', CounterElement);`  
`/**`  
 `* Decorates the counter block`  
 `* @param {HTMLElement} block - The block element`  
 `*/`

`export default function decorate(block) {`

  `try {`  
    `// Get initial value from the first cell of the table`  
    `const cells = Array.from(block.children);`  
    `const initialValue = cells[0]?.textContent.trim();`

    `// Create and configure counter before clearing block`  
    `const counter = document.createElement('counter-element');`

      

    `if (initialValue) {`  
      `const parsedValue = parseInt(initialValue, 10);`  
      `if (Number.isNaN(parsedValue)) {`  
        `throw new Error(COUNTER_CONFIG.ERROR_MESSAGES.INVALID_INITIAL);`  
      `}`

      `// Set the initial value attribute`  
      `counter.setAttribute('initial-value', parsedValue.toString());`  
      `// Force a re-render of the counter with the new value`  
      `counter.count = parsedValue;`  
      `if (counter.shadowRoot) {`  
        `const display = counter.shadowRoot.querySelector('.counter-display');`  
        `if (display) {`  
          `display.textContent = parsedValue.toString();`  
        `}`  
      `}`  
    `}`

    `// Clear the block and append the counter`  
    `block.textContent = '';`  
    `block.appendChild(counter);`  
    `// Add event listener for count changes`  
    `counter.addEventListener('count-change', (event) => {`  
      `// eslint-disable-next-line no-console`  
      `console.log('Count changed:', event.detail.count);`  
    `});`  
  `} catch (error) {`

    `// eslint-disable-next-line no-console`  
    `console.error('Error initializing counter:', error);`  
    `block.textContent = error.message;`  
  `}`  
`}`

### Key Features

The counter block demonstrates what makes web components powerful. Shadow DOM encapsulation keeps styles within the component, preventing any leakage in or out. This creates clean, maintainable CSS that won't interfere with the rest of your page.

Custom properties make theming straightforward through CSS variables. Your components can adapt to different visual contexts while maintaining consistency with EDS theming. The event-based communication pattern means components emit events for state changes, creating loose coupling with other blocks and making integration with other features simple.

Accessibility comes built in through ARIA labels for screen readers, keyboard navigation support, and a semantic HTML structure. These aren't afterthoughts \- they're fundamental to how the component works.

## Accelerating Development with Component Libraries

While building custom web components gives you complete control, sometimes you need to move faster. This is where web component libraries like Shoelace [https://shoelace.style/](https://shoelace.style/) come into play. These libraries provide professionally designed, ready-to-use components that work seamlessly with EDS blocks.

However, integrating external libraries in EDS requires a different approach than traditional web development. You can't simply add script tags to your HTML. Instead, EDS provides specific functions for loading external resources. This ensures proper loading order and maintains the performance benefits of EDS's architecture.

To include a library like Shoelace in your EDS blocks, you need to modify your block's JavaScript to load the resources programmatically. Here's how you'd typically do it in your block's decoration function:

`import { loadCSS,loadScript } from '../../scripts/aem.js';`

`export default async function decorate(block) {`  
    `// Load Shoelace CSS`  
    `await loadCSS('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css');`  
    `// Load Shoelace JavaScript`  
    `await loadScript('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js', {`  
      `type: 'module'`  
    `});`

    `// Now you can use Shoelace components`  
    `const button = document.createElement('sl-button');`  
    `button.textContent = 'Click me';`  
    `block.appendChild(button);`  
  `}`

Create a table with one line  
![][image2]  
Live Example

| shoelace |
| :---- |

This approach works particularly well because EDS's `loadCSS` and `loadScript` functions check if resources are already loaded, preventing duplicate requests. The functions return promises, allowing you to ensure resources are fully loaded before using them.

## Adobe Spectrum Web Components \- A Natural Fit

For Adobe-centric projects,  [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/guides/adding-component/) offer an even more natural choice. These components follow Adobe's design system, ensuring visual consistency across Adobe products and experiences. Since they're built on web standards, they integrate smoothly with EDS's architecture while providing the familiar look and feel users expect from Adobe applications.

Spectrum Web Components bring several advantages to EDS development. They're built with accessibility at their core, supporting keyboard navigation, screen readers, and high contrast modes out of the box. The components handle complex interactions \- think date pickers, colour selectors, and data tables \- that would take considerable time to build from scratch. They also support Adobe's theming system, allowing your blocks to adapt to light and dark modes automatically.

Here's a practical example showing how to create a feature card block using Spectrum Web Components:  
![][image3]

Live Example

| spectrum-card |
| :---- |
| Product Feature |
| Transform your workflow with our latest innovation |
| Learn More |

The implementation combines Spectrum's design language with EDS's block structure:

`import { loadCSS, loadScript } from '../../scripts/aem.js';`  
`const SPECTRUM_CONFIG = {`  
  `VERSION: '0.30.0',`  
  `CDN_BASE: 'https://cdn.jsdelivr.net/npm/@spectrum-web-components',`  
  `THEME: 'spectrum',`  
  `COLOR: 'light',`  
  `SCALE: 'medium'`  
`};`

`export default async function decorate(block) {`  
  `try {`  
    `// Load Spectrum Web Components theme`  
    ``await loadCSS(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/theme-light.css`);``  
    `// Load required Spectrum components`  
    `await Promise.all([`  
``loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/theme-light.js`, { type: 'module' }),      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/card@${SPECTRUM_CONFIG.VERSION}/sp-card.js`, { type: 'module' }),   loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/button@${SPECTRUM_CONFIG.VERSION}/sp-button.js`, { type: 'module' }),``  
``loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/icons-workflow@${SPECTRUM_CONFIG.VERSION}/icons/Info.js`, { type: 'module' })``  
    `]);`  
      
    `// Extract content from the block table`  
    `const rows = Array.from(block.children);`  
    `const title = rows[0]?.textContent.trim() || 'Card Title';`  
    `const description = rows[1]?.textContent.trim() || 'Card description';`  
    `const buttonText = rows[2]?.textContent.trim() || 'Action';`  
     
    `// Clear the block`  
    `block.textContent = '';`  
    `// Create the card structure`

    `const card = document.createElement('sp-card');`  
    `card.setAttribute('heading', title);`  
    `card.setAttribute('variant', 'quiet');`  
    `card.style.maxWidth = '400px';`  
    `// Add card content`  
    `` card.innerHTML = ` ``  
      `<div slot="description">${description}</div>`  
      `<div slot="footer">`  
        `<sp-button treatment="accent" size="m">`  
          `${buttonText}`  
        `</sp-button>`  
      `</div>`  
    `` `; ``  
    `// Add interaction`  
    `const button = card.querySelector('sp-button');`  
    `button.addEventListener('click', () => {`  
      `// eslint-disable-next-line no-console`  
      `console.log('Card action clicked');`  
      `// Add your action logic here`  
    `});`

    `block.appendChild(card);`  
  `} catch (error) {`  
    `// eslint-disable-next-line no-console`  
    `console.error('Error loading Spectrum Web Components:', error);`  
    `block.innerHTML = '<p>Error loading component. Please try again.</p>';`  
  `}`  
`}`

This example shows how Spectrum Web Components provide sophisticated UI elements with minimal code. The card component handles focus states, hover effects, and responsive behaviour automatically. You get Adobe's design language without writing custom CSS or managing complex state.

The beauty of using a library like Shoelace or Spectrum Web Components with EDS lies in the flexibility it provides. You can mix these components with your custom web components, using each where it makes the most sense. Need a quick dropdown menu? Use a library component. Building something unique to your brand? Create a custom component. The technologies complement each other perfectly.

These libraries also solve common development challenges. They provide accessibility features out of the box, handle browser inconsistencies, and offer comprehensive theming systems that integrate well with EDS's approach to styling. Since they're built on web standards, they'll continue working as browsers evolve.

## Best Practices for Web Components in EDS

Building effective web components for EDS blocks requires thoughtful implementation. Start with configuration by defining objects at the top of your files and using constants for repeated values. This makes components easily configurable and maintainable.

Error handling deserves special attention. Build proper error boundaries that provide clear messages when things go wrong. Handle edge cases gracefully rather than letting them break the user experience.

Performance matters too. Shadow DOM provides style isolation, but you still need to keep DOM operations minimal and handle events efficiently. Every interaction should feel instant and responsive.

Accessibility isn't optional. Include ARIA attributes throughout your components, support keyboard navigation from the start, and maintain proper contrast ratios. Your documentation should be equally thorough \- write README files that include usage examples and explain customisation options clearly. Consider bundle size impact when choosing external libraries.

## Real-World Benefits

Using web components in EDS blocks brings advantages to your development process. Isolated components are easier to maintain because they have clear boundaries and fewer unexpected interactions. The separation of concerns means you can work on individual components without worrying about breaking other parts of your site.

Reusability becomes natural when components can be shared across blocks. You get consistent behaviour and styling without code duplication. Since these are native browser features, there's no framework overhead \- just efficient rendering and solid performance.

The developer experience improves too. You're working with familiar web standards and clear component boundaries. Testing and debugging become straightforward when you can isolate issues to specific components.

## Getting Started

Starting with web components in your EDS blocks is straightforward. Create a new block directory and build your custom element using standard web APIs. Register it in your block's JavaScript, then write documentation and examples that others can follow. Test across different browsers to ensure compatibility.

For projects requiring Adobe's design language, start with Spectrum Web Components. They provide a complete design system that works perfectly with EDS's architecture. The components are well-documented and actively maintained, making them a reliable choice for production applications.

## Wrapping Up

Web components offer a standards-based approach to creating reusable UI elements in EDS blocks. They balance encapsulation, reusability, and performance perfectly \- making them ideal for building interactive blocks.

Following the patterns shown here, you can create strong, maintainable blocks that use web components effectively while staying compatible with EDS's block-based architecture. Whether you build custom components, use Shoelace for general UI elements, or adopt Spectrum Web Components for Adobe consistency, you have powerful options at your disposal.

The key is starting small, following standards, and building gradually. Each component you create becomes a building block for more complex interactions, all while maintaining the simplicity that makes EDS powerful.

| metadata |  |
| :---- | :---- |
| title | Using Web Components in Adobe Edge Delivery Services Blocks |
| description | A comprehensive guide to implementing web components in EDS blocks, including best practices. |
| json-ld | article |
| image |  |
| author | Tom Cranstoun |
| longdescription | An in-depth guide to implementing web components in Adobe Edge Delivery Services blocks. Covers best practices, testing strategies, performance optimization, troubleshooting, and browser compatibility. Includes detailed sections on component lifecycle, accessibility, and real-world implementation examples. Features practical examples using custom components, Shoelace, and Adobe Spectrum Web Components. Provides solutions for common issues. |
