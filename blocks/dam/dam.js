export default async function decorate(block) {
  const data = [];

  // Iterate through rows, skipping the header
  for (let i = 1; i < block.children.length; i += 1) {
    const row = block.children[i];
    const cells = row.children;

    if (cells.length >= 5) {
      const note = cells[0].textContent.trim();
      const description = cells[1].textContent.trim();
      const classification = cells[2].textContent.trim();
      const tag = cells[3].textContent.trim();
      const imageElement = cells[4].querySelector('img');
      const additionalInfo = cells[5] ? cells[5].textContent.trim() : '';

      let path = '';
      if (imageElement) {
        const fullPath = imageElement.src;
        // Extract path without domain
        path = new URL(fullPath).pathname;
      }

      data.push({
        note,
        description,
        classification,
        tag,
        path,
        additionalInfo,
      });
    }
  }

  // Create JSON output
  const jsonOutput = JSON.stringify(data, null, 2);

  // Create and append pre and code elements
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = jsonOutput;
  pre.appendChild(code);
  block.innerHTML = '';
  block.appendChild(pre);
}