import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileData = '/samples/linkedin-profile.json';
  
  try {
    const response = await fetch(profileData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Create background image
    const backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'background-image';
    backgroundDiv.style.backgroundImage = `url('${data.profileSummary.backgroundImage}')`;
    block.insertBefore(backgroundDiv, block.firstChild);

    // Update profile picture
    const profilePictureDiv = block.children[1].firstElementChild;
    if (profilePictureDiv) {
      const profilePicture = document.createElement('img');
      profilePicture.src = data.profileSummary.profilePicture;
      profilePicture.alt = `${data.profileSummary.name}'s profile picture`;
      profilePicture.className = 'profile-picture';
      profilePictureDiv.innerHTML = '';
      profilePictureDiv.appendChild(profilePicture);
    }

    // Update name
    const nameDiv = block.children[2].firstElementChild;
    if (nameDiv) {
      nameDiv.textContent = data.profileSummary.name;
    }

    // Update title
    const titleDiv = block.children[3].firstElementChild;
    if (titleDiv) {
      titleDiv.textContent = data.profileSummary.title;
    }

    // Update location
    const locationDiv = block.children[4].firstElementChild;
    if (locationDiv) {
      locationDiv.textContent = data.profileSummary.location;
    }

    // Update connections
    const connectionsDiv = block.children[5].firstElementChild;
    if (connectionsDiv) {
      connectionsDiv.textContent = data.profileSummary.connections;
    }

    // Add classes for styling
    block.classList.add('profile-summary');
    Array.from(block.children).forEach((child, index) => {
      if (index > 0) {
        child.classList.add('profile-info-item');
      }
    });

    // Log the profile picture URL for debugging
    console.log('Profile picture URL:', data.profileSummary.profilePicture);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    block.innerHTML += '<p>Error loading profile data</p>';
  }

  block.classList.add('linkedin-profile--initialized');
}