export default async function decorate(block) {
  const resp = await fetch('/blocks/styleguide-typography/styleguide-typography.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load typography data');
    return;
  }
  const json = await resp.json();

  const typographyContainer = document.createElement('div');
  typographyContainer.classList.add('styleguide-typography');

  json.fonts.forEach((font) => {
    const fontSection = document.createElement('div');
    fontSection.classList.add('font-section');

    const fontName = document.createElement('h3');
    fontName.textContent = font.name;
    fontSection.appendChild(fontName);

    font.styles.forEach((style) => {
      const styleExample = document.createElement('div');
      styleExample.classList.add('style-example');

      const styleName = document.createElement('span');
      styleName.classList.add('style-name');
      styleName.textContent = style.name;

      const styleText = document.createElement('p');
      styleText.classList.add('style-text');
      styleText.style.fontFamily = font.name;
      styleText.style.fontSize = style.size;
      styleText.style.fontWeight = style.weight;
      styleText.style.lineHeight = style.lineHeight;
      styleText.textContent = 'The quick brown fox jumps over the lazy dog';

      styleExample.appendChild(styleName);
      styleExample.appendChild(styleText);
      fontSection.appendChild(styleExample);
    });

    typographyContainer.appendChild(fontSection);
  });

  block.textContent = '';
  block.appendChild(typographyContainer);
}