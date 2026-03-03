/**
 * @file react-slide-builder.js
 * @description react slide builder
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os
 */
export default function decorate(block) {
  // Create container for React app
  const container = document.createElement('div');
  container.id = 'react-slide-app';
  block.appendChild(container);

  // Load React bundle

  const script = document.createElement('script');
  script.src = '/static/js/slide-builder-main.js';
  script.type = 'module';

  document.head.appendChild(script);

  // Load CSS

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/static/css/slide-builder-main.css';
  document.head.appendChild(link);
}
