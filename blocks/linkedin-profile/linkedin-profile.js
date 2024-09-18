import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const profileData = '/samples/linkedin-profile.json';
  const container = document.createElement('div');
  block.appendChild(container);

  try {
    const response = await fetch(profileData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Create profile summary
    const summary = document.createElement('div');
    summary.className = 'profile-summary';
    summary.innerHTML = `
      <div class="background-image" style="background-image: url('${data.profileSummary.backgroundImage}')"></div>
      <img class="profile-picture" src="${data.profileSummary.profilePicture}" alt="${data.profileSummary.name}">
      <h1>${data.profileSummary.name}</h1>
      <p>${data.profileSummary.title}</p>
      <p>${data.profileSummary.location}</p>
      <p>${data.profileSummary.connections}</p>
    `;
    container.appendChild(summary);

    // Create experience section
    const experience = document.createElement('div');
    experience.className = 'experience-section';
    experience.innerHTML = '<h2>Experience</h2>';
    data.experience.forEach((job) => {
      const jobElement = document.createElement('div');
      jobElement.className = 'job';
      jobElement.innerHTML = `
        <img src="${job.logo}" alt="${job.company} logo">
        <div>
          <h3>${job.title}</h3>
          <p>${job.company}</p>
          <p>${job.duration}</p>
        </div>
      `;
      experience.appendChild(jobElement);
    });
    container.appendChild(experience);

    // Create education section
    const education = document.createElement('div');
    education.className = 'education-section';
    education.innerHTML = '<h2>Education</h2>';
    data.education.forEach((edu) => {
      const eduElement = document.createElement('div');
      eduElement.className = 'education';
      eduElement.innerHTML = `
        <img src="${edu.logo}" alt="${edu.school} logo">
        <div>
          <h3>${edu.school}</h3>
          <p>${edu.degree}</p>
          <p>${edu.duration}</p>
        </div>
      `;
      education.appendChild(eduElement);
    });
    container.appendChild(education);

    // Create skills section
    const skills = document.createElement('div');
    skills.className = 'skills-section';
    skills.innerHTML = '<h2>Skills</h2>';
    const skillsList = document.createElement('ul');
    data.skills.forEach((skill) => {
      const skillItem = document.createElement('li');
      skillItem.textContent = skill;
      skillsList.appendChild(skillItem);
    });
    skills.appendChild(skillsList);
    container.appendChild(skills);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    container.innerHTML = '<p>Error loading profile data</p>';
  }

  block.classList.add('linkedin-profile--initialized');
}