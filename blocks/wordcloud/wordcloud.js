import { createOptimizedPicture } from '../../scripts/aem.js';

const COMMON_WORDS = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for'];
const MAX_WORDS = 50;
const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomRotation() {
  return Math.floor(Math.random() * 41) - 20;
}

function createTooltip(word, count) {
  const tooltip = document.createElement('div');
  tooltip.className = 'wordcloud-tooltip';
  tooltip.textContent = `${word}: ${count}`;
  return tooltip;
}

export default async function decorate(block) {
  const wordCounts = {};
  const rows = [...block.children];
  
  // Process content and remove original elements
  rows.forEach((row) => {
    const text = row.textContent.trim();
    const words = text.split(',').map((word) => word.trim().toLowerCase());
    words.forEach((word) => {
      if (!COMMON_WORDS.includes(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    row.remove();
  });

  // Sort words by frequency and limit to top 50
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);

  // Create container for word cloud
  const container = document.createElement('div');
  container.className = 'wordcloud-container';

  // Create and append word elements
  sortedWords.forEach(([word, count], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, 48 - index * 2)}px`;
    span.style.color = getRandomColor();
    span.style.transform = `rotate(${getRandomRotation()}deg)`;
    
    if (index === 0) {
      span.style.fontWeight = 'bold';
    }

    span.addEventListener('click', (e) => {
      const tooltip = createTooltip(word, count);
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
      document.body.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    container.appendChild(span);
  });

  block.appendChild(container);
  block.classList.add('wordcloud--initialized');
}