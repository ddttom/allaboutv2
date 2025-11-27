export default function decorate(block) {
  // Use block parameter to scope selectors to current block instance
  const firstPicture = block.querySelector('div:first-of-type picture');
  const secondPicture = block.querySelector('div:first-of-type > div:nth-of-type(2) picture');

  if (firstPicture && secondPicture) {
    // Select the second source element from the second picture element
    const secondSource = secondPicture.querySelector('source:nth-of-type(2)');
    if (secondSource) {
      const newSource = secondSource.cloneNode(true);
      const firstPictureSecondSource = firstPicture.querySelector('source:nth-of-type(2)');
      if (firstPictureSecondSource) {
        firstPicture.replaceChild(newSource, firstPictureSecondSource);
      } else {
        firstPicture.appendChild(newSource);
      }
      secondPicture.remove();
    }
  }
}
