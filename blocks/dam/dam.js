export default async function decorate(block) {
  const damData = [];

  // eslint-disable-next-line no-console
  console.log('DAM block:', block);

  try {
    // Iterate through rows, skipping the header
    for (let i = 1; i < block.children.length; i += 1) {
      const row = block.children[i];
      // eslint-disable-next-line no-console
      console.log('Processing row:', row);

      if (row.children.length < 4) {
        // eslint-disable-next-line no-console
        console.warn(`Row ${i} does not have enough cells. Skipping.`);
        continue;
      }

      const [description, classification, tag, imageElement] = row.children;

      let imagePath = '';
      if (imageElement.querySelector('picture')) {
        const img = imageElement.querySelector('img');
        imagePath = img ? new URL(img.src).pathname : '';
      } else if (imageElement.querySelector('a')) {
        imagePath = imageElement.querySelector('a').href;
      }

      // eslint-disable-next-line no-console
      console.log('Extracted data:', {
        description: description.textContent.trim(),
        classification: classification.textContent.trim(),
        tag: tag.textContent.trim(),
        path: imagePath,
      });

      damData.push({
        description: description.textContent.trim(),
        classification: classification.textContent.trim(),
        tag: tag.textContent.trim(),
        path: imagePath,
      });
    }

    // eslint-disable-next-line no-console
    console.log('Processed DAM data:', damData);

    // Create JSON output
    const jsonOutput = JSON.stringify(damData, null, 2);

    // Create pre and code elements
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = jsonOutput;
    pre.appendChild(code);

    // Create image gallery
    const gallery = document.createElement('div');
    gallery.classList.add('dam-gallery');

    damData.forEach((item) => {
      const img = document.createElement('img');
      img.src = item.path;
      img.alt = item.description;
      img.title = `${item.classification} - ${item.tag}`;
      gallery.appendChild(img);
    });

    // Clear existing content and append new elements
    block.innerHTML = '';
    block.appendChild(pre);
    block.appendChild(gallery);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in DAM block:', error);
    block.innerHTML = '<p>Error loading DAM block. Please check the console for details.</p>';
  }
}