import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'careers-hero-container';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'careers-hero-content';

  const title = document.createElement('h2');
  title.textContent = 'Work with us';
  contentContainer.appendChild(title);

  const description = document.createElement('p');
  description.textContent = 'At Amica, we work hard to enrich the lives of others and grow as a company. We believe in teamwork, compassion, and always learning and improving.';
  contentContainer.appendChild(description);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'careers-hero-buttons';

  const exploreButton = document.createElement('a');
  exploreButton.textContent = 'Explore jobs';
  exploreButton.className = 'careers-hero-button primary';
  exploreButton.href = '#';
  buttonContainer.appendChild(exploreButton);

  const volunteerButton = document.createElement('a');
  volunteerButton.textContent = 'Volunteer';
  volunteerButton.className = 'careers-hero-button secondary';
  volunteerButton.href = '#';
  buttonContainer.appendChild(volunteerButton);

  contentContainer.appendChild(buttonContainer);
  container.appendChild(contentContainer);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'careers-hero-image';
  
  // Get the image URL from the block content
  const imageUrl = block.querySelector('img') ? block.querySelector('img').src : '';
  
  if (imageUrl) {
    const picture = createOptimizedPicture(imageUrl, 'Careers hero image', false, [{ width: '750' }]);
    imageContainer.appendChild(picture);
  }

  container.appendChild(imageContainer);

  block.textContent = '';
  block.appendChild(container);
}