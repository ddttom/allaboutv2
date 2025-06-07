# Using Web Components in Adobe Edge Delivery Services Blocks

Web components have changed how developers create reusable UI elements. When you combine them with Adobe Edge Delivery Services (EDS), you get a solid foundation for building interactive, maintainable blocks. Here's how to make the most of web components in your EDS projects.

## What are Web Components?

Web Components are standardised APIs that let you create custom HTML elements. They bring together four main technologies that work in harmony. Custom Elements allow you to define new HTML elements, while Shadow DOM encapsulates your styles and markup. HTML Templates provide reusable markup patterns, and ES Modules handle the packaging and distribution of your components.

The great thing about web components? They work natively in modern browsers without any external frameworks.

## Why Use Web Components in EDS?

EDS blocks and web components work brilliantly together. The natural encapsulation that web components provide means your blocks stay self-contained and predictable. Since they're framework-agnostic, you won't find yourself locked into any particular technology stack. They fit perfectly with EDS's block-based architecture, keeping concerns cleanly separated while remaining highly reusable across your projects.

## Accelerating Development with Component Libraries

While building custom web components gives you complete control, sometimes you need to move faster. This is where web component libraries like Shoelace come into play. These libraries provide professionally designed, ready-to-use components that work seamlessly with EDS blocks.

However, integrating external libraries in EDS requires a different approach than traditional web development. You can't simply add script tags to your HTML. Instead, EDS provides specific functions for loading external resources. This ensures proper loading order and maintains the performance benefits of EDS's architecture.

To include a library like Shoelace in your EDS blocks, you need to modify your block's JavaScript to load the resources programmatically. Here's how you'd typically do it in your block's decoration function:

```javascript
export default async function decorate(block) {
  // Load Shoelace CSS
  await loadCSS('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css');
  
  // Load Shoelace JavaScript
  await loadScript('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js', {
    type: 'module'
  });
  
  // Now you can use Shoelace components
  const button = document.createElement('sl-button');
  button.textContent = 'Click me';
  block.appendChild(button);
}
```

This approach works particularly well because EDS's `loadCSS` and `loadScript` functions check if resources are already loaded, preventing duplicate requests. The functions return promises, allowing you to ensure resources are fully loaded before using them.

The beauty of using a library like Shoelace with EDS lies in the flexibility it provides. You can mix Shoelace components with your custom web components, using each where it makes the most sense. Need a quick dropdown menu? Use Shoelace's. Building something unique to your brand? Create a custom component. The technologies complement each other perfectly.

These libraries also solve common development challenges. They provide accessibility features out of the box, handle browser inconsistencies, and offer comprehensive theming systems that integrate well with EDS's approach to styling. Since they're built on web standards, they'll continue working as browsers evolve.

## A Practical Example - The Counter Block

Let's look at a working example: a counter block that uses web components. This block creates an interactive counter with increment and decrement functionality.

### How It Works

The counter block uses a custom element called `counter-element`. The implementation starts with a simple table in your document:

| Counter |
|---------|
| 5       |

The web component itself is defined in the block's JavaScript file:

```javascript
class CounterElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  // ... component implementation
}
customElements.define('counter-element', CounterElement);
```

The EDS block decorator then creates and initialises the component:

```javascript
export default function decorate(block) {
  const counter = document.createElement('counter-element');
  block.appendChild(counter);
}
```

### Key Features

The counter block demonstrates what makes web components powerful. Shadow DOM encapsulation keeps styles within the component, preventing any leakage in or out. This creates clean, maintainable CSS that won't interfere with the rest of your page.

Custom properties make theming straightforward through CSS variables. Your components can adapt to different visual contexts while maintaining consistency with EDS theming. The event-based communication pattern means components emit events for state changes, creating loose coupling with other blocks and making integration with other features simple.

Accessibility comes built in through ARIA labels for screen readers, keyboard navigation support, and a semantic HTML structure. These aren't afterthoughts - they're fundamental to how the component works.

## Best Practices for Web Components in EDS

Building effective web components for EDS blocks requires thoughtful implementation. Start with configuration by defining objects at the top of your files and using constants for repeated values. This makes components easily configurable and maintainable.

Error handling deserves special attention. Build proper error boundaries that provide clear messages when things go wrong. Handle edge cases gracefully rather than letting them break the user experience.

Performance matters too. Shadow DOM provides style isolation, but you still need to keep DOM operations minimal and handle events efficiently. Every interaction should feel instant and responsive.

Accessibility isn't optional. Include ARIA attributes throughout your components, support keyboard navigation from the start, and maintain proper contrast ratios. Your documentation should be equally thorough - write README files that include usage examples and explain customisation options clearly.

## Real-World Benefits

Using web components in EDS blocks brings tangible advantages to your development process. Isolated components are easier to maintain because they have clear boundaries and fewer unexpected interactions. The separation of concerns means you can work on individual components without worrying about breaking other parts of your site.

Reusability becomes natural when components can be shared across blocks. You get consistent behaviour and styling without code duplication. Since these are native browser features, there's no framework overhead - just efficient rendering and solid performance.

The developer experience improves too. You're working with familiar web standards and clear component boundaries. Testing and debugging become straightforward when you can isolate issues to specific components.

## Getting Started

Starting with web components in your EDS blocks is straightforward. Create a new block directory and build your custom element using standard web APIs. Register it in your block's JavaScript, then write documentation and examples that others can follow. Test across different browsers to ensure compatibility.

## Wrapping Up

Web components offer a standards-based approach to creating reusable UI elements in EDS blocks. They balance encapsulation, reusability, and performance perfectly - making them ideal for building interactive blocks.

Following the patterns shown here, you can create strong, maintainable blocks that use web components effectively while staying compatible with EDS's block-based architecture. The counter block example gives you a solid foundation for understanding how web components can improve your EDS projects.

The key is starting small, following standards, and building gradually. Each component you create becomes a building block for more complex interactions, all while maintaining the simplicity that makes EDS powerful.

| metadata        |                                                                 |
| :-------------- | :-------------------------------------------------------------- |
| title           | Using Web Components in Adobe Edge Delivery Services Blocks     |
| description     | Learn how to use web components to create powerful, reusable blocks in Adobe Edge Delivery Services |
| json-ld         | article                                                         |
| image           |                                                                 |
| author          | Tom Cranstoun                                                   |
| longdescription | A practical guide to implementing web components in Adobe Edge Delivery Services blocks, including best practices, real-world examples, and implementation tips. |
