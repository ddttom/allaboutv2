export default function decorate(block) {
  const damData = [];

  [...block.children].forEach((row) => {
    const [description, , classification, tag, imageDiv] = [...row.children];
    const img = imageDiv.querySelector('img');
    const imagePath = img ? new URL(img.src).pathname : '';

    damData.push({
      description: description.textContent.trim(),
      classification: classification.textContent.trim(),
      tag: tag.textContent.trim(),
      path: imagePath,
    });
  });

  const jsonOutput = JSON.stringify(damData, null, 2);
  
  block.innerHTML = `<pre><code>${jsonOutput}</code></pre>`;
}