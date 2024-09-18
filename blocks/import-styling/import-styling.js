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

  // Add lazy loading for images
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, options);

    images.forEach(img => imageObserver.observe(img));
  };

  // Call lazy loading function
  lazyLoadImages();

  // Add smooth scrolling for anchor links
  const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (element) {
      try {
        window.scrollTo({
          top: element.offsetTop - 60,
          behavior: 'smooth'
        });
      } catch (error) {
        console.error('Error during smooth scroll:', error);
        // Fallback to instant scroll if smooth scroll is not supported
        window.scrollTo(0, element.offsetTop - 60);
      }
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScroll(e.target.getAttribute('href'));
    });
  });

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Add fade-in animation to newly visible elements
  const addFadeInAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-card').forEach(card => {
      observer.observe(card);
    });
  };

  // Debounced scroll handler
  const debouncedScrollHandler = debounce(() => {
    // Add any scroll-based functionality here
  }, 100);

  // Add event listener for scroll events
  window.addEventListener('scroll', debouncedScrollHandler);

  // Call fade-in animation function
  addFadeInAnimation();
}