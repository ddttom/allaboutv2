export default async function decorate(block) {
  const colors = [
    { name: 'Primary Blue', hex: '#0a66c2' },
    { name: 'Secondary Blue', hex: '#0073b1' },
    { name: 'Background Gray', hex: '#f3f2ef' },
    { name: 'Text Black', hex: '#000000' },
    { name: 'Text Gray', hex: '#666666' },
    { name: 'White', hex: '#ffffff' },
  ];

  const container = document.createElement('div');
  container.className = 'color-palette';

  colors.forEach((color) => {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.innerHTML = `
      <div class="color-sample" style="background-color: ${color.hex};"></div>
      <div class="color-info">
        <h3>${color.name}</h3>
        <p>${color.hex}</p>
      </div>
    `;
    container.appendChild(colorBox);
  });

  block.appendChild(container);
  block.classList.add('styleguide-color-palette--initialized');
}