import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const startMarker = block.querySelector('h2, h3, h4, h5, h6');
  if (!startMarker) return;

  const wordFrequency = new Map();
  const tables = block.querySelectorAll('table');
  tables.forEach((table) => {
    const cells = table.querySelectorAll('td');
    cells.forEach((cell) => {
      const words = cell.textContent.trim().split(/\s*,\s*/);
      words.forEach((word) => {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      });
    });
  });

  const sortedWords = Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'wordcloud-container';

  const maxFrequency = sortedWords[0][1];
  const minFrequency = sortedWords[sortedWords.length - 1][1];

  sortedWords.forEach(([word, frequency]) => {
    const span = document.createElement('span');
    span.textContent = word;
    const fontSize = 16 + ((frequency - minFrequency) / (maxFrequency - minFrequency)) * 32;
    span.style.fontSize = `${fontSize}px`;
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    span.dataset.frequency = frequency;
    cloudContainer.appendChild(span);
  });

  block.innerHTML = '';
  block.appendChild(cloudContainer);

  // Add interactivity
  cloudContainer.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'SPAN') {
      e.target.classList.add('wordcloud-hover');
    }
  });

  cloudContainer.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'SPAN') {
      e.target.classList.remove('wordcloud-hover');
    }
  });

  cloudContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
      alert(`Word: ${e.target.textContent}\nFrequency: ${e.target.dataset.frequency}`);
    }
  });
}
