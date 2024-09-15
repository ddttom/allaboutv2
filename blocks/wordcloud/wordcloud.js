import { createOptimizedPicture } from '../../scripts/aem.js';

const COMMON_WORDS = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
const MAX_WORDS = 50;
const COLOR_PALETTE = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#5F6368', '#185ABC'];

function getRandomColor() {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

function createWordElement(word, count, maxCount) {
  const span = document.createElement('span');
  span.textContent = word;
  const fontSize = Math.max(14, Math.floor((count / maxCount) * 48));
  const rotation = Math.random() * 30 - 15;

  span.style.fontSize = `${fontSize}px`;
  span.style.color = getRandomColor();
  span.style.transform = `rotate(${rotation}deg)`;
  span.setAttribute('aria-label', `${word}: used ${count} times`);

  span.addEventListener('click', () => {
    const tooltip = document.createElement('div');
    tooltip.textContent = `Frequency: ${count}`;
    tooltip.className = 'wordcloud-tooltip';
    span.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  });

  return span;
}

export default async function decorate(block) {
  const wordCounts = new Map();
  const rows = [...block.children];

  rows.forEach((row) => {
    const text = row.textContent.trim();
    const words = text.split(',').map((word) => word.trim().toLowerCase());

    words.forEach((word) => {
      if (!COMMON_WORDS.has(word) && word.length > 0) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });
  });

  const sortedWords = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  if (sortedWords.length === 0) {
    block.textContent = 'No valid wordcloud data found.';
    return;
  }

  const maxCount = sortedWords[0][1];
  const container = document.createElement('div');
  container.className = 'wordcloud-container';

  sortedWords.forEach(([word, count]) => {
    const wordElement = createWordElement(word, count, maxCount);
    container.appendChild(wordElement);
  });

  block.textContent = '';
  block.appendChild(container);
}