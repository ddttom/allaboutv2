export default function decorate(block) {
  // Wrap the main content
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';

  // Create main column
  const mainColumn = document.createElement('div');
  mainColumn.className = 'main-column';

  // Create side column
  const sideColumn = document.createElement('div');
  sideColumn.className = 'side-column';

  // Move profile summary and skills to side column
  const profileSummary = document.querySelector('.import-profile-summary');
  const skills = document.querySelector('.import-skills');
  if (profileSummary) sideColumn.appendChild(profileSummary);
  if (skills) sideColumn.appendChild(skills);

  // Move remaining blocks to main column
  const remainingBlocks = document.querySelectorAll('.block:not(.import-profile-summary):not(.import-skills):not(.import-header):not(.import-footer)');
  remainingBlocks.forEach(block => mainColumn.appendChild(block));

  // Append columns to main content
  mainContent.appendChild(sideColumn);
  mainContent.appendChild(mainColumn);

  // Wrap main content in content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';
  contentWrapper.appendChild(mainContent);

  // Insert content wrapper after header
  const header = document.querySelector('.import-header');
  if (header) {
    header.parentNode.insertBefore(contentWrapper, header.nextSibling);
  } else {
    document.body.appendChild(contentWrapper);
  }

  // Move footer outside of content wrapper
  const footer = document.querySelector('.import-footer');
  if (footer) {
    document.body.appendChild(footer);
  }
}