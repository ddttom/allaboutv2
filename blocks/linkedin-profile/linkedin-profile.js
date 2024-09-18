import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileData = '/samples/linkedin-profile.json';
  
  try {
    const response = await fetch(profileData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Update existing elements instead of replacing them
    const backgroundImage = block.querySelector('.background-image');
    if (backgroundImage) {
      backgroundImage.style.backgroundImage = `url('${data.profileSummary.backgroundImage}')`;
    }

    const profilePicture = block.querySelector('.profile-picture');
    if (profilePicture) {
      profilePicture.src = data.profileSummary.profilePicture;
      profilePicture.alt = data.profileSummary.name;
    }

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

    // Add experience, education, and skills sections
    const profileContent = document.createElement('div');
    profileContent.className = 'profile-content';
    profileContent.innerHTML = `
      <section class="experience-section">
        <h2>Experience</h2>
        ${data.experience.map(job => `
          <div class="job">
            <img src="${job.logo}" alt="${job.company} logo">
            <div class="job-details">
              <h3>${job.title}</h3>
              <p>${job.company}</p>
              <p>${job.duration}</p>
            </div>
          </div>
        `).join('')}
      </section>
      <section class="education-section">
        <h2>Education</h2>
        ${data.education.map(edu => `
          <div class="education">
            <img src="${edu.logo}" alt="${edu.school} logo">
            <div class="education-details">
              <h3>${edu.school}</h3>
              <p>${edu.degree}</p>
              <p>${edu.duration}</p>
            </div>
          </div>
        `).join('')}
      </section>
      <section class="skills-section">
        <h2>Skills</h2>
        <ul>
          ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </section>
    `;
    block.appendChild(profileContent);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    block.innerHTML += '<p>Error loading profile data</p>';
  }

  block.classList.add('linkedin-profile--initialized');
}