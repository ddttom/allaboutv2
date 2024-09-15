export default function decorate(block) {
  const colors = {
    primary: ['#000000', '#FFFFFF'],
    secondary: ['#BB1919', '#F6F6F6'],
    accent: ['#007BC7', '#FFD230'],
  };

  Object.entries(colors).forEach(([category, colorList]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('color-category');
    categoryDiv.innerHTML = `<h3>${category}</h3>`;

    colorList.forEach(color => {
      const colorSwatch = document.createElement('div');
      colorSwatch.classList.add('color-swatch');
      colorSwatch.style.backgroundColor = color;
      colorSwatch.innerHTML = `<span>${color}</span>`;
      categoryDiv.appendChild(colorSwatch);
    });

    block.appendChild(categoryDiv);
  });
}