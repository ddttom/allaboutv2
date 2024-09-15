import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const words = {};
  const excludedWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);

  // Process content
  block.querySelectorAll('div').forEach((row) => {
    const text = row.textContent.trim();
    const phrases = text.split(',').map((phrase) => phrase.trim().toLowerCase());
    phrases.forEach((phrase) => {
      if (!excludedWords.has(phrase)) {
        words[phrase] = (words[phrase] || 0) + 1;
      }
    });
    row.remove(); // Remove the original content
  });

  // Sort words by frequency
  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50); // Limit to top 50 words

  const maxFrequency = sortedWords[0][1];
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];

  // Create and append word elements
  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    span.setAttribute('aria-label', `${word}, appears ${frequency} times`);

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('wordcloud-tooltip');
      tooltip.textContent = `Frequency: ${frequency}`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    container.appendChild(span);
  });

  // Center the most frequent word
  if (sortedWords.length > 0) {
    const [mostFrequentWord] = sortedWords[0];
    const centerWord = container.querySelector(`span[aria-label^="${mostFrequentWord},"]`);
    if (centerWord) {
      centerWord.classList.add('wordcloud-center');
    }
  }
}