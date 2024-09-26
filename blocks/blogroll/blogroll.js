// Remove the unused import
// import { createOptimizedPicture } from '../../scripts/aem.js';

// Function to format the date
function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return date.toLocaleDateString('en-GB');
}

// Function to extract series name and part number
function extractSeriesInfo(title) {
  const match = title.match(/^(.*?)\s*-?\s*Part\s*(\d+)$/i);
  return match ? { name: match[1].trim(), part: parseInt(match[2], 10) } : { name: title, part: null };
}

// Function to group and sort blog posts
function groupAndSortPosts(posts) {
  const seriesMap = new Map();

  posts.forEach(post => {
    const { name, part } = extractSeriesInfo(post.title);
    if (!seriesMap.has(name)) {
      seriesMap.set(name, []);
    }
    seriesMap.get(name).push({ ...post, part });
  });

  // Sort posts within each series
  seriesMap.forEach(posts => {
    posts.sort((a, b) => {
      if (a.part !== null && b.part !== null) {
        return a.part - b.part;
      }
      return a.title.localeCompare(b.title);
    });
  });

  return Array.from(seriesMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function decorate(block) {
  const isCompact = block.classList.contains('compact');
  
  // Add loading state
  block.textContent = 'Loading blog posts...';
  
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const blogPosts = json.data.filter(item => item.path !== '/blogs/ddt/');

    const groupedPosts = groupAndSortPosts(blogPosts);

    // Clear loading message
    block.textContent = '';

    const blogrollContainer = document.createElement('div');
    blogrollContainer.className = 'blogroll-container';
    if (isCompact) {
      blogrollContainer.classList.add('compact');
    }

    groupedPosts.forEach(([seriesName, posts]) => {
      const seriesContainer = document.createElement('div');
      seriesContainer.className = 'blogroll-series';

      const seriesTitle = document.createElement('h2');
      seriesTitle.textContent = seriesName;
      seriesContainer.appendChild(seriesTitle);

      const postList = document.createElement('ul');
      posts.forEach(post => {
        const listItem = document.createElement('li');
        
        const postLink = document.createElement('a');
        postLink.href = post.path;
        postLink.textContent = post.title;
        
        const postDate = document.createElement('span');
        postDate.className = 'blogroll-date';
        postDate.textContent = formatDate(post.lastModified);
        
        listItem.appendChild(postLink);
        listItem.appendChild(postDate);

        if (!isCompact) {
          const postDescription = document.createElement('p');
          postDescription.textContent = post.longdescription || post.description;
          listItem.appendChild(postDescription);
        }

        postList.appendChild(listItem);
      });

      seriesContainer.appendChild(postList);
      blogrollContainer.appendChild(seriesContainer);
    });

    block.appendChild(blogrollContainer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching blog posts:', error);
    block.textContent = 'Failed to load blog posts. Please try again later.';
  }
}
