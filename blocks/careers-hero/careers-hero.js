import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'careers-hero';
  
  // Create left content
  const leftContent = document.createElement('div');
  leftContent.className = 'careers-hero__left';
  
  const rows = [...block.children];
  
  // Title
  const title = document.createElement('h1');
  title.textContent = rows[0]?.textContent.trim() || 'Work with us';
  leftContent.appendChild(title);
  
  // Description
  if (rows[1]) {
    const description = document.createElement('p');
    description.textContent = rows[1].textContent.trim();
    leftContent.appendChild(description);
  }
  
  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'careers-hero__buttons';
  
  if (rows[2]) {
    const exploreButton = document.createElement('a');
    exploreButton.className = 'button button--primary';
    exploreButton.textContent = rows[2].textContent.trim();
    exploreButton.href = rows[2].querySelector('a')?.href || '#';
    buttonContainer.appendChild(exploreButton);
  }
  
  if (rows[3]) {
    const volunteerButton = document.createElement('a');
    volunteerButton.className = 'button button--secondary';
    volunteerButton.textContent = rows[3].textContent.trim();
    volunteerButton.href = rows[3].querySelector('a')?.href || '#';
    buttonContainer.appendChild(volunteerButton);
  }
  
  leftContent.appendChild(buttonContainer);
  
  // Create right content (image)
  const rightContent = document.createElement('div');
  rightContent.className = 'careers-hero__right';
  
  if (rows[4]) {
    const imgSrc = rows[4].textContent.trim();
    const picture = createOptimizedPicture(imgSrc, 'People working together', false, [{ width: '750' }]);
    rightContent.appendChild(picture);
  }
  
  // Append left and right content to the container
  container.appendChild(leftContent);
  container.appendChild(rightContent);
  
  // Replace block content with the new structure
  block.textContent = '';
  block.appendChild(container);
}