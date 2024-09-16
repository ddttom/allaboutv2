export default function decorate(block) {
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Experience';
  block.prepend(title);

  [...block.children].forEach((row, index) => {
    if (index === 0) return; // Skip the title row

    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';

    const companyLogo = document.createElement('img');
    companyLogo.className = 'company-logo';
    companyLogo.src = 'https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg';
    companyLogo.alt = 'Company logo';

    const jobTitle = document.createElement('h3');
    jobTitle.className = 'job-title';
    jobTitle.textContent = row.children[0].textContent;

    const companyName = document.createElement('p');
    companyName.className = 'company-name';
    companyName.textContent = row.children[1].textContent;

    const jobDuration = document.createElement('p');
    jobDuration.className = 'job-duration';
    jobDuration.textContent = row.children[2].textContent;

    const jobDescription = document.createElement('p');
    jobDescription.className = 'job-description';
    jobDescription.textContent = row.children[3].textContent;

    experienceItem.appendChild(companyLogo);
    experienceItem.appendChild(jobTitle);
    experienceItem.appendChild(companyName);
    experienceItem.appendChild(jobDuration);
    experienceItem.appendChild(jobDescription);

    block.appendChild(experienceItem);
  });

  // Remove original content
  [...block.children].forEach((child, index) => {
    if (index !== 0) child.remove();
  });
}