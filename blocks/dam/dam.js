export default async function decorate(block) {
  try {
    const data = [];

    // Process all rows
    Array.from(block.children).forEach((row, index) => {
      if (row.children.length >= 6) {
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
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Row ${index} has insufficient cells:`, row.children.length);
      }
    });

    // Create JSON output
    const jsonOutput = JSON.stringify(data, null, 2);

    // Create and append pre and code elements
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = jsonOutput;
    pre.appendChild(code);
    
    // Create a container for the JSON output
    const outputContainer = document.createElement('div');
    outputContainer.className = 'dam-output';
    outputContainer.appendChild(pre);
    
    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle JSON';
    toggleButton.className = 'dam-toggle';
    toggleButton.addEventListener('click', () => {
      outputContainer.classList.toggle('dam-output-hidden');
    });

    // Clear the block and add new elements
    block.innerHTML = '';
    block.appendChild(toggleButton);
    block.appendChild(outputContainer);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in DAM block:', error);
    block.innerHTML = '<p>Error processing DAM data. Please check the console for details.</p>';
  }
}