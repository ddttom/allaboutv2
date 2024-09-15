import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const words = {};
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const text = row.textContent.trim();
    const phrases = text.split(',').map((phrase) => phrase.trim());
    phrases.forEach((phrase) => {
      words[phrase] = (words[phrase] || 0) + 1;
    });
  });

  const sortedWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  const maxFrequency = sortedWords[0][1];
  const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#5F6368', '#185ABC'];

  sortedWords.forEach(([word, frequency], index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    
    if (index === 0) {
      span.style.fontWeight = 'bold';
    }

    span.addEventListener('click', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.add('wordcloud-tooltip');
      tooltip.textContent = `Frequency: ${frequency}`;
      span.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    });

    container.appendChild(span);
  });

  if (sortedWords.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No valid wordcloud data found.';
    container.appendChild(message);
  }

  block.classList.add('wordcloud--initialized');
}