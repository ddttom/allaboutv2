import { createOptimizedPicture } from '../../scripts/aem.js';

// Function to format timestamp to dd/mm/yyyy
function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Function to extract part number from title
function extractPartNumber(title) {
  const match = title.match(/Part (\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

// Function to group and sort blog posts
function groupAndSortPosts(posts) {
  const groupedPosts = {};

  posts.forEach(post => {
    const pathParts = post.path.split('/');
    const basePath = pathParts.slice(0, -1).join('/');
    const fileName = pathParts[pathParts.length - 1];

    if (!groupedPosts[basePath]) {
      groupedPosts[basePath] = [];
    }

    groupedPosts[basePath].push({
      ...post,
      partNumber: extractPartNumber(post.title)
    });
  });

  // Sort each group by part number
  Object.keys(groupedPosts).forEach(key => {
    groupedPosts[key].sort((a, b) => a.partNumber - b.partNumber);
  });

  // Sort the groups by the first post's title (without Part - x)
  return Object.entries(groupedPosts).sort((a, b) => {
    const titleA = a[1][0].title.replace(/Part \d+/i, '').trim();
    const titleB = b[1][0].title.replace(/Part \d+/i, '').trim();
    return titleA.localeCompare(titleB);
  });
}

export default async function decorate(block) {
  const blogrollContainer = document.createElement('div');
  blogrollContainer.classList.add('blogroll-container');

  try {
    const response = await fetch('https://allabout.network/blogs/ddt/query-index.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const groupedAndSortedPosts = groupAndSortPosts(data.data);

    groupedAndSortedPosts.forEach(([basePath, posts]) => {
      const groupContainer = document.createElement('div');
      groupContainer.classList.add('blogroll-group');

      const groupTitle = document.createElement('h2');
      groupTitle.textContent = posts[0].title.replace(/Part \d+/i, '').trim();
      groupContainer.appendChild(groupTitle);

      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blogroll-post');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('blogroll-image');
        const image = createOptimizedPicture(post.image, post.title, false, [{ width: '300' }]);
        imageContainer.appendChild(image);

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('blogroll-content');

        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = post.path;
        titleLink.textContent = post.title;
        title.appendChild(titleLink);

        const description = document.createElement('p');
        description.textContent = post.longdescription || post.description;

        const date = document.createElement('p');
        date.classList.add('blogroll-date');
        date.textContent = `Last modified: ${formatDate(post.lastModified)}`;

        contentContainer.appendChild(title);
        contentContainer.appendChild(description);
        contentContainer.appendChild(date);

        postElement.appendChild(imageContainer);
        postElement.appendChild(contentContainer);

        groupContainer.appendChild(postElement);
      });

      blogrollContainer.appendChild(groupContainer);
    });

    block.appendChild(blogrollContainer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching or processing blog data:', error);
    block.textContent = 'Error loading blog posts. Please try again later.';
  }
}
