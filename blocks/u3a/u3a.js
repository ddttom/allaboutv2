// Configuration object for block settings
const U3A_CONFIG = {
  MESSAGES: {
    ERROR_LOADING: 'Error loading image metadata:',
    NO_IMAGES: 'No images available',
  },
  KEYS: {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
  },
  CLASSES: {
    ACTIVE: 'active',
    SLIDER: 'slider',
    METADATA: 'metadata',
  },
};

// Load EXIF.js script
async function loadExifScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
    script.onload = () => {
      console.log('EXIF.js loaded successfully');
      resolve(window.EXIF);
    };
    script.onerror = () => {
      console.error('Failed to load EXIF.js');
      reject();
    };
    document.head.appendChild(script);
  });
}

// Helper function to extract image metadata
async function getImageMetadata(imgElement) {
  const METADATA_CONFIG = {
    UNKNOWN: 'Unknown',
  };

  try {
    // Ensure EXIF.js is loaded
    const EXIF = await loadExifScript();
    console.log('Extracting metadata for image:', imgElement.src);

    return new Promise((resolve) => {
      EXIF.getData(imgElement, function() {
        const metadata = {
          dateTaken: EXIF.getTag(this, 'DateTimeOriginal') || 
                    EXIF.getTag(this, 'DateTime') || 
                    METADATA_CONFIG.UNKNOWN,
          camera: `${EXIF.getTag(this, 'Make') || ''} ${EXIF.getTag(this, 'Model') || ''}`.trim() || 
                  METADATA_CONFIG.UNKNOWN,
          fstop: EXIF.getTag(this, 'FNumber') ? 
                `f/${EXIF.getTag(this, 'FNumber')}` : 
                METADATA_CONFIG.UNKNOWN,
          lens: EXIF.getTag(this, 'LensModel') || METADATA_CONFIG.UNKNOWN,
          focalLength: EXIF.getTag(this, 'FocalLength') ? 
                      `${EXIF.getTag(this, 'FocalLength')}mm` : 
                      METADATA_CONFIG.UNKNOWN,
          location: EXIF.getTag(this, 'GPSLatitude') ? 
                   `${EXIF.getTag(this, 'GPSLatitude')}, ${EXIF.getTag(this, 'GPSLongitude')}` : 
                   METADATA_CONFIG.UNKNOWN,
          copyright: EXIF.getTag(this, 'Copyright') || METADATA_CONFIG.UNKNOWN,
          iso: EXIF.getTag(this, 'ISOSpeedRatings') || METADATA_CONFIG.UNKNOWN,
          exposureTime: EXIF.getTag(this, 'ExposureTime') ? 
                       `1/${Math.round(1/EXIF.getTag(this, 'ExposureTime'))}s` : 
                       METADATA_CONFIG.UNKNOWN,
        };
        console.log('Extracted metadata:', metadata);
        resolve(metadata);
      });
    });
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    return {
      dateTaken: METADATA_CONFIG.UNKNOWN,
      camera: METADATA_CONFIG.UNKNOWN,
      fstop: METADATA_CONFIG.UNKNOWN,
      lens: METADATA_CONFIG.UNKNOWN,
      focalLength: METADATA_CONFIG.UNKNOWN,
      location: METADATA_CONFIG.UNKNOWN,
      copyright: METADATA_CONFIG.UNKNOWN,
      iso: METADATA_CONFIG.UNKNOWN,
      exposureTime: METADATA_CONFIG.UNKNOWN,
    };
  }
}

// Function to toggle full-screen mode for an image
function toggleFullScreen(imgWrapper) {
  imgWrapper.classList.toggle('full-screen');
  if (imgWrapper.classList.contains('full-screen')) {
    enableFullScreenControls(imgWrapper);
  } else {
    disableFullScreenControls(imgWrapper);
  }
}

// Function to enable full-screen controls
function enableFullScreenControls(imgWrapper) {
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  const img = imgWrapper.querySelector('img');

  // Function to apply transformations
  function applyTransform() {
    img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }

  // Keydown event listener for zoom, pan, and exit
  function handleKeydown(event) {
    switch (event.key) {
      case '+':
        scale += 0.1;
        break;
      case '-':
        scale = Math.max(1, scale - 0.1);
        break;
      case 'ArrowUp':
        translateY -= 10;
        break;
      case 'ArrowDown':
        translateY += 10;
        break;
      case 'ArrowLeft':
        translateX -= 10;
        break;
      case 'ArrowRight':
        translateX += 10;
        break;
      case 'Escape':
        toggleFullScreen(imgWrapper); // Exit full-screen on Esc
        break;
      default:
        return; // Exit if not a relevant key
    }
    applyTransform();
    event.preventDefault(); // Prevent default scrolling behavior
  }

  // Add event listener for keydown
  window.addEventListener('keydown', handleKeydown);

  // Add click event listener to exit full-screen
  imgWrapper.addEventListener('click', () => toggleFullScreen(imgWrapper));

  // Store the event listener for removal later
  imgWrapper._handleKeydown = handleKeydown;
  imgWrapper._resetTransform = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  };
}

// Function to disable full-screen controls
function disableFullScreenControls(imgWrapper) {
  // Remove the event listener
  window.removeEventListener('keydown', imgWrapper._handleKeydown);
  delete imgWrapper._handleKeydown;

  // Reset transformations
  imgWrapper._resetTransform();
  delete imgWrapper._resetTransform;
}

// Create image set controls
function createImageSetControls(slider, images) {
  const controls = document.createElement('div');
  controls.className = 'u3a-controls';
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  prevBtn.className = 'prev-btn';
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  nextBtn.className = 'next-btn';
  
  controls.append(prevBtn, nextBtn);
  slider.appendChild(controls);

  let currentIndex = 0;

  function updateSlider() {
    images.forEach((img, index) => {
      img.style.display = index === currentIndex ? 'block' : 'none';
    });
    updateIndicators();
  }

  function showPreviousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlider();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlider();
  }

  prevBtn.addEventListener('click', showPreviousImage);
  nextBtn.addEventListener('click', showNextImage);

  // Add keydown event listener for arrow keys
  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showPreviousImage();
    } else if (event.key === 'ArrowRight') {
      showNextImage();
    }
  });

  // Add focus to slider to capture key events
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('focus', () => slider.focus());

  // Create indicators
  const indicators = document.createElement('div');
  indicators.className = 'u3a-indicators';
  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.className = 'indicator';
    indicator.dataset.index = index;
    indicators.appendChild(indicator);
  });
  slider.appendChild(indicators);

  function updateIndicators() {
    const allIndicators = indicators.querySelectorAll('.indicator');
    allIndicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  // Initialize slider
  updateSlider();
}

export default async function decorate(block) {
  console.log('Decorating block:', block);
  
  // Create wrapper for image sets
  const wrapper = document.createElement('div');
  wrapper.className = 'u3a-wrapper';
  
  // Skip header row and process data rows
  const rows = [...block.children].slice(1);
  console.log('Processing rows:', rows);
  
  // Process each row into an image set - make this async
  await Promise.all(rows.map(async (row) => {
    const [note, author, description, classification, tag, ...imageCells] = [...row.children];
    console.log('Processing row:', { note, author, description, classification, tag });
    
    const images = imageCells
      .map((cell) => {
        const img = cell.querySelector('img');
        if (img) {
          console.log('Found image:', img.src);
          // Remove lazy loading attribute as we need the image loaded for EXIF data
          img.removeAttribute('loading');
          // Force load the image
          img.loading = 'eager';
        }
        return img;
      })
      .filter((img) => img);
    
    if (images.length) {
      const imageSet = document.createElement('div');
      imageSet.className = 'u3a-image-set';
      
      // Create image slider
      const slider = document.createElement('div');
      slider.className = U3A_CONFIG.CLASSES.SLIDER;
      
      images.forEach((img) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'u3a-image';
        imgWrapper.appendChild(img.cloneNode(true));
        
        // Add double-click event listener to toggle full-screen mode
        imgWrapper.addEventListener('dblclick', () => toggleFullScreen(imgWrapper));
        
        slider.appendChild(imgWrapper);
      });
      
      // Create metadata section
      const metadata = document.createElement('div');
      metadata.className = U3A_CONFIG.CLASSES.METADATA;
      
      // Get metadata for the first image (or most visible one)
      const imageMetadata = await getImageMetadata(images[0]);

      // Add metadata to the display
      metadata.innerHTML = `
        <div class="normal-metadata">
          <h4>Author Details</h4>
          <p>Note: ${note.textContent}</p>
          <p>By: ${author.textContent}</p>
          <p>Description: ${description.textContent}</p>
          <p>Classification: ${classification.textContent}</p>
          <p>Tag: ${tag.textContent}</p>
        </div>
        <div class="technical-metadata">
          <h4>Technical Details</h4>
          <p>Date Taken: ${imageMetadata.dateTaken}</p>
          <p>Camera: ${imageMetadata.camera}</p>
          <p>Lens: ${imageMetadata.lens}</p>
          <p>Settings: ${imageMetadata.fstop}, ${imageMetadata.exposureTime}, ISO ${imageMetadata.iso}</p>
          <p>Focal Length: ${imageMetadata.focalLength}</p>
          <p>Location: ${imageMetadata.location}</p>
          <p>Copyright: ${imageMetadata.copyright}</p>
        </div>
      `;
      
      imageSet.append(slider, metadata);
      wrapper.appendChild(imageSet);
      
      // Add controls if multiple images
      if (images.length > 1) {
        createImageSetControls(slider, images);
      }
    }
  }));
  
  block.textContent = '';
  block.appendChild(wrapper);
  console.log('Block decoration complete');
}
