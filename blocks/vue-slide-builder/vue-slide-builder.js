export default function decorate(block) {
    // Create container for Vue.js app
    const container = document.createElement('div');
    container.id = 'vue-slide-app';
    block.appendChild(container);
  
    // Load Vue.js bundle
    const script = document.createElement('script');
    script.src = '/static/js/main-def456.js'; // Your built JS file
    script.type = 'module';
    document.head.appendChild(script);
    
    // Load CSS
  
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/css/style-abc123.css'; // Your built CSS file
    document.head.appendChild(link);
  }
  