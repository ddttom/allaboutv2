import { createOptimizedPicture } from '../../scripts/aem.js';

function createWordCloudElement(word, frequency, maxFrequency, colors) {
  const span = document.createElement('span');
  span.textContent = word;
  const fontSize = Math.max(14, Math.floor((frequency / maxFrequency) * 48));
  const rotation = Math.floor(Math.random() * 31) - 15;
  const colorIndex = Math.floor(Math.random() * colors.length);

  span.style.fontSize = `${fontSize}px`;
  span.style.transform = `rotate(${rotation}deg)`;
  span.style.color = colors[colorIndex];

  span.addEventListener('click', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'wordcloud-tooltip';
    tooltip.textContent = `${word}: ${frequency}`;
    span.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  });

  return span;
}

export default async function decorate(block) {
  const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];
  const commonWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
  const wordFrequency = {};

  // Process content
  block.querySelectorAll('div').forEach((row) => {
    const words = row.textContent.split(',').map((word) => word.trim().toLowerCase());
    words.forEach((word) => {
      if (!commonWords.has(word) && word.length > 0) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    row.remove();
  });

  if (Object.keys(wordFrequency).length === 0) {
    block.textContent = 'No valid wordcloud data found.';
    return;
  }

  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
  const maxFrequency = sortedWords[0][1];

  const container = document.createElement('div');
  container.className = 'wordcloud-container';

  sortedWords.forEach(([word, frequency]) => {
    const wordElement = createWordCloudElement(word, frequency, maxFrequency, colors);
    container.appendChild(wordElement);
  });

  block.appendChild(container);
}