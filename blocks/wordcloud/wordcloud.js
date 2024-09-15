import { createOptimizedPicture } from '../../scripts/aem.js';

function createWordCloudElement(word, frequency, maxFrequency, colors) {
  const span = document.createElement('span');
  span.textContent = word;
  const fontSize = Math.max(14, Math.floor((frequency / maxFrequency) * 48));
  const rotation = Math.floor(Math.random() * 41) - 20;
  const colorIndex = Math.floor(Math.random() * colors.length);

  span.style.fontSize = `${fontSize}px`;
  span.style.transform = `rotate(${rotation}deg)`;
  span.style.color = colors[colorIndex];
  span.style.margin = '5px';
  span.style.padding = '5px';
  span.style.display = 'inline-block';
  span.style.transition = 'all 0.3s ease';

  span.addEventListener('mouseover', () => {
    span.style.transform = `rotate(${rotation}deg) scale(1.2)`;
    span.style.opacity = '0.8';
  });

  span.addEventListener('mouseout', () => {
    span.style.transform = `rotate(${rotation}deg) scale(1)`;
    span.style.opacity = '1';
  });

  span.addEventListener('click', () => {
    const tooltip = document.createElement('div');
    tooltip.textContent = `Frequency: ${frequency}`;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.zIndex = '1000';

    const rect = span.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;

    document.body.appendChild(tooltip);

    setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 2000);
  });

  return span;
}

export default async function decorate(block) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const commonWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
  const wordFrequency = {};
  let maxFrequency = 0;

  // Process content
  block.querySelectorAll('div').forEach((row) => {
    const words = row.textContent.split(',').map((word) => word.trim().toLowerCase());
    words.forEach((word) => {
      if (!commonWords.has(word) && word.length > 0) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        maxFrequency = Math.max(maxFrequency, wordFrequency[word]);
      }
    });
    row.remove();
  });

  // Create word cloud container
  const container = document.createElement('div');
  container.className = 'wordcloud-container';
  block.appendChild(container);

  // Create and add word elements
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  sortedWords.forEach(([word, frequency], index) => {
    const wordElement = createWordCloudElement(word, frequency, maxFrequency, colors);
    if (index === 0) {
      wordElement.style.fontWeight = 'bold';
    }
    container.appendChild(wordElement);
  });

  // Randomize word positions
  const words = Array.from(container.children);
  for (let i = words.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    container.appendChild(words[j]);
  }

  // Error handling
  if (sortedWords.length === 0) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'No valid wordcloud data found.';
    block.appendChild(errorMessage);
  }
}