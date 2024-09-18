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

  // Move profile summary to side column
  const profileSummary = document.querySelector('.import-profile-summary');
  if (profileSummary) sideColumn.appendChild(profileSummary);

  // Move remaining blocks to main column
  const remainingBlocks = document.querySelectorAll('.block:not(.import-profile-summary):not(.import-header):not(.import-footer)');
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

  // Lazy loading for images
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  };

  // Fade-in animation for sections
  const addFadeInAnimation = () => {
    const sections = document.querySelectorAll('.section-card');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));
  };

  // Call functions
  lazyLoadImages();
  addFadeInAnimation();
}