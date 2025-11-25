/**
 * View MyBlog Block
 * Fetches and displays blog content from my-blog.json
 * Supports variations:
 * - Default: Shows all blog posts
 * - AI variation (.ai class): Shows only AI-related posts
 */

/**
 * Check if a post is AI-related
 */
function isAIRelated(post) {
  const urlLower = post.url.toLowerCase();
  const titleLower = post.title.toLowerCase();

  // Check for /ai/ in path
  if (urlLower.includes('/ai/')) {
    return true;
  }

  // Check for 'ai' or 'llm' in title (as whole words or parts of words)
  if (titleLower.includes('ai') || titleLower.includes('llm')) {
    return true;
  }

  return false;
}

/**
 * Filter and restructure data to show only AI-related content
 */
function filterAIContent(data) {
  const aiPosts = [];

  // Collect all AI-related posts from all categories
  if (data.categories) {
    data.categories.forEach((category) => {
      if (category.posts) {
        category.posts.forEach((post) => {
          if (isAIRelated(post)) {
            aiPosts.push({ ...post, originalCategory: category.name });
          }
        });
      }
    });
  }

  // Sort by lastModified date (newest first)
  aiPosts.sort((a, b) => {
    const dateA = new Date(a.lastModified || '1970-01-01');
    const dateB = new Date(b.lastModified || '1970-01-01');
    return dateB - dateA;
  });

  // Get latest 3 posts for featured section
  const latestPosts = aiPosts.slice(0, 3);

  // Create restructured data
  return {
    latestPosts,
    categoryMap: [
      {
        id: 'all-ai-posts',
        name: 'All AI & LLM Posts',
        count: aiPosts.length,
        description: 'All articles about AI, LLM, and machine learning topics'
      }
    ],
    categories: [
      {
        id: 'all-ai-posts',
        name: 'All AI & LLM Posts',
        posts: aiPosts
      }
    ]
  };
}

/**
 * Create a blog entry article
 */
function createBlogEntry(entry, isLast = false) {
  const article = document.createElement('article');
  article.className = 'view-myblog-entry';
  if (isLast) {
    article.classList.add('view-myblog-entry--last');
  }

  const title = document.createElement('h3');
  title.className = 'view-myblog-entry-title';

  const link = document.createElement('a');
  link.href = entry.url;
  link.textContent = entry.title;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  title.appendChild(link);

  const description = document.createElement('p');
  description.className = 'view-myblog-entry-description';
  description.textContent = entry.description;

  article.appendChild(title);
  article.appendChild(description);

  return article;
}

/**
 * Create a featured section (Latest Posts or Most Visited)
 */
function createFeaturedSection(title, posts, type = 'latest') {
  const section = document.createElement('section');
  section.className = `view-myblog-section view-myblog-section--${type}`;

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'view-myblog-section-title';
  sectionTitle.textContent = title;

  section.appendChild(sectionTitle);

  posts.forEach((post, index) => {
    const isLast = index === posts.length - 1;
    section.appendChild(createBlogEntry(post, isLast));
  });

  return section;
}

/**
 * Create the category map table
 */
function createCategoryMap(categories) {
  const nav = document.createElement('nav');
  nav.className = 'view-myblog-category-map';
  nav.setAttribute('aria-label', 'Category navigation');

  const heading = document.createElement('h2');
  heading.className = 'view-myblog-category-map-title';
  heading.textContent = 'Category Map, click one to jump';

  const table = document.createElement('table');
  table.className = 'view-myblog-category-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Category</th>
      <th>Articles</th>
      <th>Focus Area</th>
    </tr>
  `;

  const tbody = document.createElement('tbody');
  categories.forEach((category, index) => {
    const tr = document.createElement('tr');
    if (index < categories.length - 1) {
      tr.classList.add('view-myblog-category-row--bordered');
    }

    tr.innerHTML = `
      <td><a href="#${category.id}">${category.name}</a></td>
      <td class="view-myblog-category-count">${category.count}</td>
      <td class="view-myblog-category-description">${category.description}</td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  nav.appendChild(heading);
  nav.appendChild(table);

  return nav;
}

/**
 * Create a category section with blog posts
 */
function createCategorySection(category) {
  const section = document.createElement('section');
  section.className = 'view-myblog-section';
  section.id = category.id;

  const title = document.createElement('h2');
  title.className = 'view-myblog-section-title';
  title.textContent = category.name;

  section.appendChild(title);

  // Handle Additional Resources differently (it has links instead of posts)
  if (category.links) {
    const quickLinksDiv = document.createElement('div');
    quickLinksDiv.style.marginBottom = '2rem';

    const quickLinksTitle = document.createElement('h3');
    quickLinksTitle.style.color = '#667eea';
    quickLinksTitle.style.fontSize = '1.1rem';
    quickLinksTitle.style.marginBottom = '1rem';
    quickLinksTitle.textContent = 'Quick Links & Publications';

    const linksList = document.createElement('ul');
    linksList.style.listStyle = 'none';
    linksList.style.paddingLeft = '0';

    category.links.forEach((link) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';

      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.title;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.color = '#667eea';
      a.style.textDecoration = 'none';
      a.style.transition = 'color 0.3s ease';
      a.addEventListener('mouseenter', () => {
        a.style.color = '#764ba2';
      });
      a.addEventListener('mouseleave', () => {
        a.style.color = '#667eea';
      });

      li.appendChild(a);
      linksList.appendChild(li);
    });

    quickLinksDiv.appendChild(quickLinksTitle);
    quickLinksDiv.appendChild(linksList);
    section.appendChild(quickLinksDiv);
  } else if (category.posts) {
    // Regular category with blog posts
    // Sort posts based on sortOrder metadata
    let posts = [...category.posts];
    if (category.sortOrder === 'oldest-first') {
      // Sort by lastModified date ascending (oldest first)
      posts.sort((a, b) => {
        const dateA = new Date(a.lastModified || '1970-01-01');
        const dateB = new Date(b.lastModified || '1970-01-01');
        return dateA - dateB;
      });
    }
    // Default is newest-first (no sorting needed as JSON is already in that order)

    posts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'view-myblog-entry';

      const postTitle = document.createElement('h3');
      postTitle.className = 'view-myblog-entry-title';

      const link = document.createElement('a');
      link.href = post.url;
      link.textContent = post.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      postTitle.appendChild(link);

      const description = document.createElement('p');
      description.className = 'view-myblog-entry-description';
      description.textContent = post.description;

      article.appendChild(postTitle);
      article.appendChild(description);

      if (post.lastModified) {
        const meta = document.createElement('p');
        meta.className = 'view-myblog-entry-meta';
        meta.textContent = `Last Modified: ${post.lastModified}`;
        article.appendChild(meta);
      }

      section.appendChild(article);
    });
  }

  return section;
}

/**
 * Main decorate function
 */
export default async function decorate(block) {
  // Check if this is the AI variation
  const isAIVariation = block.classList.contains('ai');

  // Get data URL from block content or use default
  const blockContent = block.textContent.trim();
  const dataUrl = blockContent || '/my-blog.json';

  // Clear the block content (the parameter)
  block.textContent = '';

  // Configuration
  const config = {
    dataUrl,
    errorMessage: `Unable to load ${isAIVariation ? 'AI ' : ''}blog content. Please try again later.`
  };

  try {
    // Show loading state
    block.innerHTML = `<p class="view-myblog-loading">Loading ${isAIVariation ? 'AI ' : ''}blog content...</p>`;

    // Fetch blog data
    const response = await fetch(config.dataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Filter data if AI variation
    const data = isAIVariation ? filterAIContent(rawData) : rawData;

    // Clear the block
    block.textContent = '';

    // Create main container
    const container = document.createElement('div');
    container.className = 'view-myblog-content';

    // Add featured sections container
    const featuredContainer = document.createElement('div');
    featuredContainer.className = 'view-myblog-featured';

    // Add Latest Posts section
    if (data.latestPosts && data.latestPosts.length > 0) {
      const latestTitle = isAIVariation ? 'Latest AI Posts' : 'Latest Posts';
      featuredContainer.appendChild(
        createFeaturedSection(latestTitle, data.latestPosts, 'latest')
      );
    }

    // Add Most Visited section
    if (data.mostVisited && data.mostVisited.length > 0) {
      featuredContainer.appendChild(
        createFeaturedSection('Most Visited', data.mostVisited, 'popular')
      );
    }

    container.appendChild(featuredContainer);

    // Add Category Map (only if more than one category)
    if (data.categoryMap && data.categoryMap.length > 1) {
      container.appendChild(createCategoryMap(data.categoryMap));
    }

    // Add category sections with blog posts
    if (data.categories && data.categories.length > 0) {
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'view-myblog-categories';

      data.categories.forEach((category) => {
        categoriesContainer.appendChild(createCategorySection(category));
      });

      container.appendChild(categoriesContainer);
    }

    // Append to block
    block.appendChild(container);

  } catch (error) {
    console.error('View MyBlog block failed:', error);
    block.innerHTML = `<p class="view-myblog-error">${config.errorMessage}</p>`;
  }
}
