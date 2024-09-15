import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const words = {};
  const rows = [...block.children];
  
  // Process content
  rows.forEach((row) => {
    const text = row.textContent.trim();
    const phrases = text.split(',').map((phrase) => phrase.trim());
    phrases.forEach((phrase) => {
      words[phrase] = (words[phrase] || 0) + 1;
    });
  });

  // Sort words by frequency
  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100); // Limit to top 100 words

  // Create word cloud container
  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'wordcloud-container';

  // Add cloud icon
  const cloudIcon = document.createElement('span');
  cloudIcon.className = 'wordcloud-icon';
  cloudIcon.textContent = '☁️';
  cloudContainer.appendChild(cloudIcon);

  // Create word elements
  sortedWords.forEach(([word, frequency], index) => {
    const wordElement = document.createElement('span');
    wordElement.className = 'wordcloud-word';
    wordElement.textContent = word;
    wordElement.style.fontSize = `${Math.max(14, 48 - index * 0.5)}px`;
    wordElement.style.color = `var(--wordcloud-color-${index % 6 + 1})`;

    if (index === 0) {
      wordElement.classList.add('wordcloud-word-main');
    }

    wordElement.addEventListener('click', () => {
      const tooltip = document.createElement('span');
      tooltip.className = 'wordcloud-tooltip';
      tooltip.textContent = `Frequency: ${frequency}`;
      wordElement.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    cloudContainer.appendChild(wordElement);
  });

  // Clear existing content and append word cloud
  block.textContent = '';
  block.appendChild(cloudContainer);
}