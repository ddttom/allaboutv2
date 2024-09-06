import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const bubbleCount = 20;
  const container = document.createElement('div');
  container.classList.add('bubbles-container');

  for (let i = 0; i < bubbleCount; i += 1) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.style.setProperty('--size', `${Math.random() * 40 + 20}px`);
    bubble.style.setProperty('--left', `${Math.random() * 100}%`);
    bubble.style.setProperty('--delay', `${Math.random() * 5}s`);

    const img = createOptimizedPicture('/blocks/bubbles/bubble.png', 'Bubble', false, [40, 40]);
    bubble.appendChild(img);

    container.appendChild(bubble);
  }

  block.appendChild(container);
  block.classList.add('bubbles--initialized');
}