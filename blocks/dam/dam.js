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
    toggleButton.addEventListener('click', () => {
      outputContainer.classList.toggle('dam-output-hidden');
      gallery.classList.toggle('dam-gallery-hidden');
      selectionControls.classList.toggle('dam-selection-controls-hidden');
    });

    // Selection functionality
    const updateSelection = () => {
      const checkboxes = gallery.querySelectorAll('.dam-gallery-checkbox');
      const selectedData = data.filter((_, index) => checkboxes[index].checked);
      outputContainer.innerHTML = '';
      outputContainer.appendChild(createJsonOutput(selectedData));
    };

    selectAllBtn.addEventListener('click', () => {
      gallery.querySelectorAll('.dam-gallery-checkbox').forEach(cb => { cb.checked = true; });
      updateSelection();
    });

    clearSelectionBtn.addEventListener('click', () => {
      gallery.querySelectorAll('.dam-gallery-checkbox').forEach(cb => { cb.checked = false; });
      updateSelection();
    });

    gallery.addEventListener('change', (e) => {
      if (e.target.classList.contains('dam-gallery-checkbox')) {
        updateSelection();
      }
    });

    // Clear the block and add new elements
    block.innerHTML = '';
    block.appendChild(toggleButton);
    block.appendChild(selectionControls);
    block.appendChild(outputContainer);
    block.appendChild(gallery);

    // Initially hide the gallery and selection controls
    gallery.classList.add('dam-gallery-hidden');
    selectionControls.classList.add('dam-selection-controls-hidden');

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in DAM block:', error);
    block.innerHTML = '<p>Error processing DAM data. Please check the console for details.</p>';
  }
}