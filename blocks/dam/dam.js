export default async function decorate(block) {
  try {
    const data = [];
    const gallery = document.createElement('div');
    gallery.className = 'dam-gallery';

    // Create selection controls
    const selectionControls = document.createElement('div');
    selectionControls.className = 'dam-selection-controls';
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.className = 'dam-select-all';
    const clearSelectionBtn = document.createElement('button');
    clearSelectionBtn.textContent = 'Clear Selection';
    clearSelectionBtn.className = 'dam-clear-selection';
    selectionControls.appendChild(selectAllBtn);
    selectionControls.appendChild(clearSelectionBtn);

    // Create copy JSON button
    const copyJsonBtn = document.createElement('button');
    copyJsonBtn.textContent = 'Copy JSON';
    copyJsonBtn.className = 'dam-copy-json';

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

          // Create image card for gallery
          const card = document.createElement('div');
          card.className = 'dam-gallery-card';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'dam-gallery-checkbox';
          card.appendChild(checkbox);
          card.innerHTML += `
            <img src="${imageElement.src}" alt="${description}">
            <div class="dam-gallery-card-info">
              <h3>${note}</h3>
              <p>${description}</p>
              <p>Classification: ${classification}</p>
              <p>Tag: ${tag}</p>
              <p>${additionalInfo}</p>
            </div>
          `;
          gallery.appendChild(card);
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

    // Colorize JSON function
    const colorizeJSON = (json) => {
      const colorMap = {
        string: '#008000',
        number: '#0000FF',
        boolean: '#b22222',
        null: '#808080',
        key: '#0000FF'
      };

      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let type = 'number';
        if (/^"/.test(match)) {
          type = /:$/.test(match) ? 'key' : 'string';
        } else if (/true|false/.test(match)) {
          type = 'boolean';
        } else if (/null/.test(match)) {
          type = 'null';
        }
        return `<span style="color:${colorMap[type]}">${match}</span>`;
      });
    };

    // Create JSON output
    const createJsonOutput = (selectedData) => {
      const jsonString = JSON.stringify(selectedData, null, 2);
      const colorizedJSON = colorizeJSON(jsonString);
      const pre = document.createElement('pre');
      pre.innerHTML = colorizedJSON;
      return pre;
    };

    // Create a container for the JSON output
    const outputContainer = document.createElement('div');
    outputContainer.className = 'dam-output';
    outputContainer.appendChild(createJsonOutput(data));

    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle View';
    toggleButton.className = 'dam-toggle';

    // Function to update view
    const updateView = (isJsonView) => {
      outputContainer.classList.toggle('dam-output-hidden', !isJsonView);
      gallery.classList.toggle('dam-gallery-hidden', isJsonView);
      selectionControls.classList.toggle('dam-selection-controls-hidden', isJsonView);
      copyJsonBtn.classList.toggle('dam-copy-json-hidden', !isJsonView);
    };

    // Set initial view
    updateView(true);

    // Add event listener for toggle button
    toggleButton.addEventListener('click', () => {
      const isJsonView = outputContainer.classList.contains('dam-output-hidden');
      updateView(isJsonView);
    });

    // Selection functionality
    const updateSelection = () => {
      const checkboxes = gallery.querySelectorAll('.dam-gallery-checkbox');
      const selectedData = data.filter((_, index) => checkboxes[index].checked);
      
      // Log the selected data and all data
      console.log('Selected data:', selectedData);
      console.log('All data:', data);

      outputContainer.innerHTML = '';
      // Always show data, whether items are selected or not
      const dataToShow = selectedData.length > 0 ? selectedData : data;
      console.log('Data to show:', dataToShow);
      
      outputContainer.appendChild(createJsonOutput(dataToShow));
    };

    selectAllBtn.addEventListener('click', () => {
      gallery.querySelectorAll('.dam-gallery-checkbox').forEach(cb => { cb.checked = true; });
      updateSelection();
    });

    clearSelectionBtn.addEventListener('click', () => {
      gallery.querySelectorAll('.dam-gallery-checkbox').forEach(cb => { cb.checked = false; });
      updateSelection();
      console.log('Selection cleared, updating view');
    });

    gallery.addEventListener('change', (e) => {
      if (e.target.classList.contains('dam-gallery-checkbox')) {
        updateSelection();
      }
    });

    // Copy JSON functionality
    copyJsonBtn.addEventListener('click', () => {
      const checkboxes = gallery.querySelectorAll('.dam-gallery-checkbox');
      const selectedData = data.filter((_, index) => checkboxes[index].checked);
      // Always use data, whether items are selected or not
      const dataToUse = selectedData.length > 0 ? selectedData : data;
      const jsonString = JSON.stringify(dataToUse, null, 2);
      
      console.log('Data being copied:', dataToUse);

      // Create a temporary textarea element to hold the text
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = jsonString;
      document.body.appendChild(tempTextArea);

      try {
        // Select the text and copy it
        tempTextArea.select();
        document.execCommand('copy');
        
        // Provide feedback
        const originalText = copyJsonBtn.textContent;
        copyJsonBtn.textContent = 'Copied!';
        copyJsonBtn.disabled = true;
        setTimeout(() => {
          copyJsonBtn.textContent = originalText;
          copyJsonBtn.disabled = false;
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy JSON: ', err);
        copyJsonBtn.textContent = 'Copy failed';
        setTimeout(() => {
          copyJsonBtn.textContent = 'Copy JSON';
        }, 2000);
      } finally {
        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);
      }
    });

    // Clear the block and add new elements
    block.innerHTML = '';
    block.appendChild(toggleButton);
    block.appendChild(copyJsonBtn);
    block.appendChild(selectionControls);
    block.appendChild(outputContainer);
    block.appendChild(gallery);

    // Initially hide the gallery and selection controls, show JSON view
    gallery.classList.add('dam-gallery-hidden');
    selectionControls.classList.add('dam-selection-controls-hidden');

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in DAM block:', error);
    block.innerHTML = '<p>Error processing DAM data. Please check the console for details.</p>';
  }
}