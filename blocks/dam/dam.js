import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const rows = [...block.children];
  const title = rows.shift().textContent.trim();
  const damData = [];

  rows.forEach((row) => {
    const [description, classification, tag, imageOrHref] = [...row.children];
    const imagePath = imageOrHref.querySelector('picture') ? 
      new URL(imageOrHref.querySelector('img').src).pathname :
      imageOrHref.querySelector('a') ? imageOrHref.querySelector('a').href : '';

    damData.push({
      description: description.textContent.trim(),
      classification: classification.textContent.trim(),
      tag: tag.textContent.trim(),
      path: imagePath,
    });
  });

  const jsonOutput = JSON.stringify(damData, null, 2);
  
  block.innerHTML = `
    <h2>${title}</h2>
    <pre><code>${jsonOutput}</code></pre>
    <div class="dam-images">
      ${damData.map(item => `
        <div class="dam-item">
          ${createOptimizedPicture(item.path, item.description, false, [{ width: '300' }])}
          <p>${item.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}