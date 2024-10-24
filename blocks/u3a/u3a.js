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

// Helper function to extract image metadata
async function getImageMetadata(imgElement) {
  // Create config object for metadata fields
  const METADATA_CONFIG = {
    UNKNOWN: 'Unknown',
    CORS_PROXY: '', // Add CORS proxy if needed
  };

  try {
    // Get the image URL
    const imageUrl = imgElement.src;
    
    // Fetch the image as a blob
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    
    // Create a FileReader to read the blob data
    const reader = new FileReader();
    
    // Convert blob to array buffer
    const arrayBuffer = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(imageBlob);
    });

    // Use EXIF.js to parse metadata
    const exifData = await import('https://cdn.jsdelivr.net/npm/exif-js');
    const tags = exifData.readFromBinaryFile(arrayBuffer);

    // Extract and return relevant metadata
    return {
      dateTaken: tags?.DateTimeOriginal || tags?.DateTime || METADATA_CONFIG.UNKNOWN,
      camera: `${tags?.Make || ''} ${tags?.Model || ''}`.trim() || METADATA_CONFIG.UNKNOWN,
      fstop: tags?.FNumber ? `f/${tags.FNumber}` : METADATA_CONFIG.UNKNOWN,
      lens: tags?.LensModel || METADATA_CONFIG.UNKNOWN,
      focalLength: tags?.FocalLength ? `${tags.FocalLength}mm` : METADATA_CONFIG.UNKNOWN,
      location: tags?.GPSLatitude ? 
        `${tags.GPSLatitude}, ${tags.GPSLongitude}` : 
        METADATA_CONFIG.UNKNOWN,
      copyright: tags?.Copyright || METADATA_CONFIG.UNKNOWN,
      iso: tags?.ISOSpeedRatings || METADATA_CONFIG.UNKNOWN,
      exposureTime: tags?.ExposureTime ? 
        `1/${Math.round(1/tags.ExposureTime)}s` : 
        METADATA_CONFIG.UNKNOWN,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error extracting image metadata:', error);
    
    // Return unknown values if metadata extraction fails
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

// Create image set controls
function createImageSetControls(wrapper, imageSet) {
  const controls = document.createElement('div');
  controls.className = 'u3a-controls';
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  
  controls.append(prevBtn, nextBtn);
  wrapper.appendChild(controls);
}

export default async function decorate(block) {
  // Create wrapper for image sets
  const wrapper = document.createElement('div');
  wrapper.className = 'u3a-wrapper';
  
  // Skip header row and process data rows
  const rows = [...block.children].slice(1);
  
  // Process each row into an image set - make this async
  await Promise.all(rows.map(async (row) => {
    const [note, author, description, classification, tag, ...imageCells] = [...row.children];
    const images = imageCells
      .map((cell) => cell.querySelector('img'))
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
        slider.appendChild(imgWrapper);
      });
      
      // Create metadata section
      const metadata = document.createElement('div');
      metadata.className = U3A_CONFIG.CLASSES.METADATA;
      
      // Get metadata for the first image (or most visible one)
      const imageMetadata = await getImageMetadata(images[0]);

      // Add metadata to the display
      metadata.innerHTML = `
        <h3>${note.textContent}</h3>
        <p>By: ${author.textContent}</p>
        <p>${description.textContent}</p>
        <p>Classification: ${classification.textContent}</p>
        <p>Tag: ${tag.textContent}</p>
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
        createImageSetControls(imageSet, images);
      }
    }
  }));
  
  block.textContent = '';
  block.appendChild(wrapper);
}
