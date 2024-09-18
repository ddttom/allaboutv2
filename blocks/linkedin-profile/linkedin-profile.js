import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileData = '/samples/linkedin-profile.json';
  
  try {
    const response = await fetch(profileData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    block.innerHTML = `
      <div class="profile-header">
        <div class="background-image" style="background-image: url('${data.profileSummary.backgroundImage}')"></div>
        <div class="profile-info">
          <img class="profile-picture" src="${data.profileSummary.profilePicture}" alt="${data.profileSummary.name}">
          <h1>${data.profileSummary.name}</h1>
          <p class="title">${data.profileSummary.title}</p>
          <p class="location">${data.profileSummary.location}</p>
          <p class="connections">${data.profileSummary.connections}</p>
        </div>
      </div>
      <div class="profile-content">
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
      </div>
    `;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    block.innerHTML = '<p>Error loading profile data</p>';
  }

  block.classList.add('linkedin-profile--initialized');
}