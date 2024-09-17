export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('Input block:', block);

  const data = [];

  // Iterate through rows, skipping the header
  for (let i = 1; i < block.children.length; i += 1) {
    const row = block.children[i];
    const cells = row.children;

    // eslint-disable-next-line no-console
    console.log(`Processing row ${i}:`, row);

    if (cells.length >= 6) {
      const note = cells[0].textContent.trim();
      const description = cells[1].textContent.trim();
      const classification = cells[2].textContent.trim();
      const tag = cells[3].textContent.trim();
      const imageElement = cells[4].querySelector('img');
      const additionalInfo = cells[5].textContent.trim();

      let path = '';
      if (imageElement) {
        // Check if the image source is a data URL
        if (imageElement.src.startsWith('data:')) {
          path = 'Data URL image';
        } else {
          // Extract path without domain
          path = new URL(imageElement.src).pathname;
        }
      }

      data.push({
        note,
        description,
        classification,
        tag,
        path,
        additionalInfo,
      });

      // eslint-disable-next-line no-console
      console.log('Processed data:', data[data.length - 1]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Skipping row ${i} due to insufficient cells`);
    }
  }

  // Create JSON output
  const jsonOutput = JSON.stringify(data, null, 2);

  // eslint-disable-next-line no-console
  console.log('Final JSON output:', jsonOutput);

  // Create and append pre and code elements
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = jsonOutput;
  pre.appendChild(code);
  block.innerHTML = '';
  block.appendChild(pre);
}