export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-certifications';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Licenses & Certifications';
  container.appendChild(title);

  const certificationsList = document.createElement('ul');
  certificationsList.className = 'certifications-list';

  [...block.children].forEach((row) => {
    const [name, issuer, issueDate, expirationDate, credentialId] = [...row.children].map(cell => cell.textContent.trim());
    
    const listItem = document.createElement('li');
    listItem.className = 'certification-item';
    
    const nameElement = document.createElement('h3');
    nameElement.className = 'certification-name';
    nameElement.textContent = name;
    
    const issuerElement = document.createElement('p');
    issuerElement.className = 'certification-issuer';
    issuerElement.textContent = `Issuer: ${issuer}`;
    
    const dateElement = document.createElement('p');
    dateElement.className = 'certification-date';
    dateElement.textContent = `Issued: ${issueDate}${expirationDate ? ` • Expires: ${expirationDate}` : ''}`;
    
    const credentialElement = document.createElement('p');
    credentialElement.className = 'certification-credential';
    credentialElement.textContent = `Credential ID: ${credentialId}`;
    
    listItem.appendChild(nameElement);
    listItem.appendChild(issuerElement);
    listItem.appendChild(dateElement);
    listItem.appendChild(credentialElement);
    
    certificationsList.appendChild(listItem);
  });

  container.appendChild(certificationsList);
  block.textContent = '';
  block.appendChild(container);
}