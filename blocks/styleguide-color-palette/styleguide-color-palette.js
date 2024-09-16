export default async function decorate(block) {
  const resp = await fetch('/blocks/styleguide-color-palette/styleguide-color-palette.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load color palette data');
    return;
  }
  const json = await resp.json();

  const palette = document.createElement('div');
  palette.classList.add('styleguide-color-palette');

  json.colors.forEach((color) => {
    const colorSwatch = document.createElement('div');
    colorSwatch.classList.add('color-swatch');
    colorSwatch.style.backgroundColor = color.hex;

    const colorInfo = document.createElement('div');
    colorInfo.classList.add('color-info');

    const colorName = document.createElement('span');
    colorName.textContent = color.name;

    const colorHex = document.createElement('span');
    colorHex.textContent = color.hex;

    colorInfo.appendChild(colorName);
    colorInfo.appendChild(colorHex);
    colorSwatch.appendChild(colorInfo);
    palette.appendChild(colorSwatch);
  });

  block.textContent = '';
  block.appendChild(palette);
}