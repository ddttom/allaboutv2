import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('wordcloud-container');
  block.appendChild(container);

  const cloudIcon = document.createElement('div');
  cloudIcon.classList.add('cloud-icon');
  cloudIcon.textContent = '☁️';
  container.appendChild(cloudIcon);

  const words = processContent(block);
  if (Object.keys(words).length === 0) {
    // eslint-disable-next-line no-console
    console.error('No word cloud data found');
    container.textContent = 'No word cloud data found.';
    return;
  }

  const sortedWords = sortWordsByFrequency(words);
  const topWords = sortedWords.slice(0, 100);

  generateWordCloud(topWords, container);

  block.classList.add('wordcloud--initialized');
}

function processContent(block) {
  const words = {};
  const divs = block.querySelectorAll('div > div > div > p');
  divs.forEach((p) => {
    const content = p.textContent.trim();
    const phrases = content.split(',').map((phrase) => phrase.trim());
    phrases.forEach((phrase) => {
      if (phrase && !isCommonWord(phrase)) {
        words[phrase] = (words[phrase] || 0) + 1;
      }
    });
  });
  return words;
}

function sortWordsByFrequency(words) {
  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .map(([word, frequency]) => ({ word, frequency }));
}

function generateWordCloud(words, container) {
  const cloudContent = document.createElement('div');
  cloudContent.classList.add('wordcloud-content');
  container.appendChild(cloudContent);

  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];
  const maxFrequency = words[0].frequency;

  words.forEach(({ word, frequency }, index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.fontSize = `${Math.max(14, (frequency / maxFrequency) * 48)}px`;
    span.style.color = colors[index % colors.length];
    span.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    
    if (index === 0) {
      span.style.fontWeight = 'bold';
      span.style.fontSize = '48px';
    }

    span.addEventListener('click', () => {
      showTooltip(span, frequency);
    });

    cloudContent.appendChild(span);
  });
}

function showTooltip(element, frequency) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('wordcloud-tooltip');
  tooltip.textContent = `Frequency: ${frequency}`;
  element.appendChild(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, 2000);
}

function isCommonWord(word) {
  const commonWords = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for'];
  return commonWords.includes(word.toLowerCase());
}
