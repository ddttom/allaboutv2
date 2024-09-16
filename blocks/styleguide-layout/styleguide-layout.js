export default async function decorate(block) {
  const resp = await fetch('/blocks/styleguide-layout/styleguide-layout.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load layout data');
    return;
  }
  const json = await resp.json();

  const layoutContainer = document.createElement('div');
  layoutContainer.classList.add('styleguide-layout');

  // Grid System
  const gridSection = document.createElement('div');
  gridSection.classList.add('layout-section');
  
  const gridTitle = document.createElement('h3');
  gridTitle.textContent = 'Grid System';
  gridSection.appendChild(gridTitle);

  const gridDescription = document.createElement('p');
  gridDescription.textContent = json.gridSystem.description;
  gridSection.appendChild(gridDescription);

  const gridExample = document.createElement('div');
  gridExample.classList.add('grid-example');
  for (let i = 0; i < 12; i += 1) {
    const column = document.createElement('div');
    column.classList.add('grid-column');
    gridExample.appendChild(column);
  }
  gridSection.appendChild(gridExample);

  layoutContainer.appendChild(gridSection);

  // Spacing
  const spacingSection = document.createElement('div');
  spacingSection.classList.add('layout-section');

  const spacingTitle = document.createElement('h3');
  spacingTitle.textContent = 'Spacing';
  spacingSection.appendChild(spacingTitle);

  json.spacing.forEach((space) => {
    const spaceExample = document.createElement('div');
    spaceExample.classList.add('space-example');
    
    const spaceName = document.createElement('span');
    spaceName.textContent = space.name;
    spaceExample.appendChild(spaceName);

    const spaceVisual = document.createElement('div');
    spaceVisual.style.width = space.value;
    spaceVisual.style.height = '20px';
    spaceVisual.style.backgroundColor = '#0a66c2';
    spaceExample.appendChild(spaceVisual);

    spacingSection.appendChild(spaceExample);
  });

  layoutContainer.appendChild(spacingSection);

  block.textContent = '';
  block.appendChild(layoutContainer);
}