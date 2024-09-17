export default function decorate(block) {
  const damData = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 4) {
      const [description, , tag, imageDiv] = cells;
      const img = imageDiv.querySelector('img');
      const imagePath = img ? new URL(img.src).pathname : '';

      damData.push({
        description: description.textContent.trim(),
        classification: cells[1] ? cells[1].textContent.trim() : '',
        tag: tag.textContent.trim(),
        path: imagePath,
      });
    }
  });

  const jsonOutput = JSON.stringify(damData, null, 2);
  
  block.innerHTML = `<pre><code>${jsonOutput}</code></pre>`;
}