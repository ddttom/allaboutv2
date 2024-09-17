export default async function decorate(block) {
  const damData = [];

  // eslint-disable-next-line no-console
  console.log('DAM block:', block);
  // eslint-disable-next-line no-console
  console.log('Number of children:', block.children.length);

  try {
    // Iterate through rows, including the header
    for (let i = 0; i < block.children.length; i += 1) {
      const row = block.children[i];
      // eslint-disable-next-line no-console
      console.log(`Processing row ${i}:`, row);
      // eslint-disable-next-line no-console
      console.log(`Row ${i} children:`, row.children);

      if (i === 0) {
        // eslint-disable-next-line no-console
        console.log('Skipping header row');
        continue;
      }

      if (row.children.length < 4) {
        // eslint-disable-next-line no-console
        console.warn(`Row ${i} does not have enough cells. Skipping.`);
        continue;
      }

      const [description, classification, tag, imageElement] = row.children;

      // eslint-disable-next-line no-console
      console.log('Image element:', imageElement);
      // eslint-disable-next-line no-console
      console.log('Image element innerHTML:', imageElement.innerHTML);

      let imagePath = '';
      if (imageElement.querySelector('picture')) {
        const img = imageElement.querySelector('img');
        imagePath = img ? img.src : '';
      } else if (imageElement.querySelector('a')) {
        imagePath = imageElement.querySelector('a').href;
      } else if (imageElement.querySelector('img')) {
        imagePath = imageElement.querySelector('img').src;
      }

      // eslint-disable-next-line no-console
      console.log('Extracted image path:', imagePath);

      const rowData = {
        description: description.textContent.trim(),
        classification: classification.textContent.trim(),
        tag: tag.textContent.trim(),
        path: imagePath,
      };

      // eslint-disable-next-line no-console
      console.log(`Extracted data for row ${i}:`, rowData);

      damData.push(rowData);
    }

    // eslint-disable-next-line no-console
    console.log('Processed DAM data:', damData);

    if (damData.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No data was processed. Check the table structure.');
      block.innerHTML = '<p>No data available. Please check the table structure.</p>';
      return;
    }

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
      if (item.path) {
        const img = document.createElement('img');
        img.src = item.path;
        img.alt = item.description;
        img.title = `${item.classification} - ${item.tag}`;
        gallery.appendChild(img);
      } else {
        // eslint-disable-next-line no-console
        console.warn(`No image path for item: ${JSON.stringify(item)}`);
      }
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