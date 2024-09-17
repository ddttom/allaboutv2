export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('Input block:', block);

  const data = [];

  // Process the single row
  const row = block.children[0];
  if (row && row.children.length >= 6) {
    const cells = row.children;

    const note = cells[0].textContent.trim();
    const description = cells[1].textContent.trim();
    const classification = cells[2].textContent.trim();
    const tag = cells[3].textContent.trim();
    const imageElement = cells[4].querySelector('img');
    const additionalInfo = cells[5].textContent.trim();

    let path = '';
    if (imageElement) {
      // Extract path without domain and query parameters
      const url = new URL(imageElement.src, window.location.origin);
      path = url.pathname.split('?')[0];
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
    console.log('Processed data:', data[0]);
  } else {
    // eslint-disable-next-line no-console
    console.log('Row has insufficient cells or is missing');
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