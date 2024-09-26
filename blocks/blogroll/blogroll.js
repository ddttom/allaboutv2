// Remove the unused import
// import { createOptimizedPicture } from '../../scripts/aem.js';

// Function to format the date
function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return date.toLocaleDateString('en-GB');
}

// Function to extract series name and part number
function extractSeriesInfo(title, path) {
  const match = title.match(/^(.*?)\s*-?\s*Part\s*(\d+)$/i);
  const basePath = path.split('/').slice(0, -1).join('/');
  return {
    name: match ? match[1].trim() : title,
    part: match ? parseInt(match[2], 10) : null,
    basePath
  };
}

// Function to group and sort blog posts
function groupAndSortPosts(posts, acceptList) {
  const seriesMap = new Map();

  posts.forEach(post => {
    // Filter posts based on the accept list, if provided
    if (acceptList.length > 0 && !acceptList.some(term => post.path.includes(term))) {
      return;
    }

    const { name, part, basePath } = extractSeriesInfo(post.title, post.path);
    const key = `${basePath}/${name}`;
    if (!seriesMap.has(key)) {
      seriesMap.set(key, []);
    }
    seriesMap.get(key).push({ ...post, part });
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

  // Convert map to array and sort by number of posts (descending)
  return Array.from(seriesMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key, posts]) => [posts[0].title.split(' - ')[0], posts]);
}

// Configuration function
function getConfig(block) {
  const config = {};
  const rows = [...block.children];
  if (rows.length > 0) {
    const firstRow = rows.shift();
    config.acceptList = [...firstRow.children].map(cell => cell.textContent.trim());
  }
  config.isCompact = block.classList.contains('compact');
  return config;
}

export default async function decorate(block) {
  const config = getConfig(block);
  
  // Add loading state
  block.textContent = 'Loading blog posts...';
  
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    // Use all blog posts without filtering
    const blogPosts = json.data;

    const groupedPosts = groupAndSortPosts(blogPosts, config.acceptList);

    // Clear loading message
    block.textContent = '';

    const blogrollContainer = document.createElement('div');
    blogrollContainer.className = 'blogroll-container';
    if (config.isCompact) {
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

        if (!config.isCompact) {
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
