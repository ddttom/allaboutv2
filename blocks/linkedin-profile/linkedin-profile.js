import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileData = '/samples/linkedin-profile.json';
  
  try {
    const response = await fetch(profileData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Update background image
    const backgroundImage = block.querySelector('.background-image');
    if (backgroundImage) {
      backgroundImage.style.backgroundImage = `url('${data.profileSummary.backgroundImage}')`;
    }

    // Create and insert profile picture
    const profilePictureContainer = block.querySelector('.profile-picture-container');
    if (profilePictureContainer) {
      const profilePicture = document.createElement('img');
      profilePicture.src = data.profileSummary.profilePicture;
      profilePicture.alt = `${data.profileSummary.name}'s profile picture`;
      profilePicture.className = 'profile-picture';
      profilePictureContainer.appendChild(profilePicture);
    }

    // Update profile details
    const nameElement = block.querySelector('h1');
    if (nameElement) {
      nameElement.textContent = data.profileSummary.name;
    }

    const titleElement = block.querySelector('h2');
    if (titleElement) {
      titleElement.textContent = data.profileSummary.title;
    }

    const locationElement = block.querySelector('.profile-details p:nth-of-type(1)');
    if (locationElement) {
      locationElement.textContent = data.profileSummary.location;
    }

    const connectionsElement = block.querySelector('.profile-details p:nth-of-type(2)');
    if (connectionsElement) {
      connectionsElement.textContent = data.profileSummary.connections;
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    block.innerHTML += '<p>Error loading profile data</p>';
  }

  block.classList.add('linkedin-profile--initialized');
}