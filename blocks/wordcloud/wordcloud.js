import { createOptimizedPicture } from '../../scripts/aem.js';

const COMMON_WORDS = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
const MAX_WORDS = 50;
const COLOR_PALETTE = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];

function getRandomColor() {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

function getRandomRotation() {
  return Math.floor(Math.random() * 31) - 15;
}

function createWordElement(word, count, maxCount) {
  const span = document.createElement('span');
  span.textContent = word;
  const fontSize = Math.max(14, Math.floor((count / maxCount) * 48));
  span.style.fontSize = `${fontSize}px`;
  span.style.color = getRandomColor();
  span.style.transform = `rotate(${getRandomRotation()}deg)`;
  span.setAttribute('aria-label', `${word}: used ${count} times`);
  span.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    alert(`"${word}" appears ${count} times`);
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
    row.remove();
  });

  if (wordCounts.size === 0) {
    block.textContent = 'No valid wordcloud data found.';
    return;
  }

  const sortedWords = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  const maxCount = sortedWords[0][1];
  const container = document.createElement('div');
  container.className = 'wordcloud-container';

  sortedWords.forEach(([word, count]) => {
    const wordElement = createWordElement(word, count, maxCount);
    container.appendChild(wordElement);
  });

  block.appendChild(container);
}