export default function decorate(block) {
  const certificationsSection = document.createElement('div');
  certificationsSection.classList.add('certifications-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Licenses & Certifications';

  certificationsSection.appendChild(title);

  const certificationsList = document.createElement('ul');
  certificationsList.classList.add('certifications-list');

  [...block.children].forEach((row) => {
    const [certName, issuer, issueDate, expDate, credentialId] = [...row.children].map(cell => cell.textContent);

    const listItem = document.createElement('li');
    listItem.classList.add('certification-item');

    const nameElement = document.createElement('h3');
    nameElement.textContent = certName;

    const issuerElement = document.createElement('p');
    issuerElement.classList.add('certification-issuer');
    issuerElement.textContent = `Issuing organization: ${issuer}`;

    const dateElement = document.createElement('p');
    dateElement.classList.add('certification-date');
    dateElement.textContent = `Issued ${issueDate}${expDate ? ` · Expires ${expDate}` : ''}`;

    const credentialElement = document.createElement('p');
    credentialElement.classList.add('certification-credential');
    credentialElement.textContent = `Credential ID: ${credentialId}`;

    listItem.appendChild(nameElement);
    listItem.appendChild(issuerElement);
    listItem.appendChild(dateElement);
    listItem.appendChild(credentialElement);

    certificationsList.appendChild(listItem);
  });

  certificationsSection.appendChild(certificationsList);

  block.textContent = '';
  block.appendChild(certificationsSection);
}