export default async function decorate(block) {
  const profileImage = block.querySelector('img');
  const [name, headline, location, connections, company, education] = block.querySelectorAll('p');

  const profileContent = document.createElement('div');
  profileContent.className = 'import-profile-content';

  const backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'import-profile-background';

  profileImage.className = 'import-profile-image';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'import-profile-name';
  nameDiv.textContent = name.textContent;

  const headlineDiv = document.createElement('div');
  headlineDiv.className = 'import-profile-headline';
  headlineDiv.textContent = headline.textContent;

  const locationDiv = document.createElement('div');
  locationDiv.className = 'import-profile-location';
  locationDiv.textContent = location.textContent;

  const connectionsDiv = document.createElement('div');
  connectionsDiv.className = 'import-profile-connections';
  connectionsDiv.textContent = connections.textContent;

  const companyDiv = document.createElement('div');
  companyDiv.className = 'import-profile-company';
  companyDiv.textContent = company.textContent;

  const educationDiv = document.createElement('div');
  educationDiv.className = 'import-profile-education';
  educationDiv.textContent = education.textContent;

  profileContent.appendChild(backgroundDiv);
  profileContent.appendChild(profileImage);
  profileContent.appendChild(nameDiv);
  profileContent.appendChild(headlineDiv);
  profileContent.appendChild(locationDiv);
  profileContent.appendChild(connectionsDiv);
  profileContent.appendChild(companyDiv);
  profileContent.appendChild(educationDiv);

  block.innerHTML = '';
  block.appendChild(profileContent);
}
