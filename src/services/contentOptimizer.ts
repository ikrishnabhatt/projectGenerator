
/**
 * Content Optimizer Service
 * Optimizes generated content for better quality and performance
 */

interface Content {
  html: string;
  css: string;
  js: string;
}

/**
 * Main function to optimize all content
 */
export const optimizeContent = (content: Content): Content => {
  return {
    html: optimizeHtml(content.html),
    css: optimizeCss(content.css),
    js: optimizeJs(content.js)
  };
};

/**
 * Optimizes HTML content
 */
const optimizeHtml = (html: string): string => {
  // Add missing semantic tags
  let optimized = html;
  
  // Replace div with semantic tags where appropriate
  if (optimized.includes('<div class="header">') || optimized.includes('<div class="nav">')) {
    optimized = optimized.replace(/<div class="(header|navbar)">/g, '<header>');
    optimized = optimized.replace(/<\/div><!-- end (header|navbar) -->/, '</header>');
  }
  
  if (optimized.includes('<div class="footer">')) {
    optimized = optimized.replace(/<div class="footer">/, '<footer>');
    optimized = optimized.replace(/<\/div><!-- end footer -->/, '</footer>');
  }
  
  if (optimized.includes('<div class="main">')) {
    optimized = optimized.replace(/<div class="main">/, '<main>');
    optimized = optimized.replace(/<\/div><!-- end main -->/, '</main>');
  }
  
  // Add missing alt attributes to images
  optimized = optimized.replace(/<img src="([^"]*)"(?!\s+alt=)/g, '<img src="$1" alt="Project image"');
  
  return optimized;
};

/**
 * Optimizes CSS content
 */
const optimizeCss = (css: string): string => {
  let optimized = css;
  
  // Replace box-shadow with a more performant version
  optimized = optimized.replace(
    /box-shadow: 0px 0px 10px rgba\(0, 0, 0, 0\.5\)/g, 
    'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)'
  );
  
  // Add will-change for elements that are animated
  if (optimized.includes('@keyframes') || optimized.includes('transition:')) {
    optimized += '\n.animated { will-change: transform, opacity; }';
  }
  
  // Add print styles if missing
  if (!optimized.includes('@media print')) {
    optimized += `
@media print {
  body {
    color: black;
    background: white;
  }
  
  nav, button, .no-print {
    display: none !important;
  }
  
  a {
    text-decoration: none;
    color: black;
  }
  
  .container {
    width: 100%;
    margin: 0;
    padding: 0;
  }
}`;
  }
  
  return optimized;
};

/**
 * Optimizes JavaScript content
 */
const optimizeJs = (js: string): string => {
  let optimized = js;
  
  // Add error handling
  if (optimized.includes('fetch(')) {
    optimized = optimized.replace(
      /fetch\(([^)]+)\)\s*\.then/g,
      'fetch($1).catch(err => console.error("Fetch error:", err)).then'
    );
  }
  
  // Add performance optimization for scroll events
  if (optimized.includes('addEventListener("scroll"') || optimized.includes("addEventListener('scroll'")) {
    optimized += `
// Debounce function for performance optimization
function debounce(func, wait = 20, immediate = false) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Replace scroll event listeners with debounced versions
document.addEventListener('DOMContentLoaded', function() {
  const scrollHandlers = [];
  const originalAddEventListener = Element.prototype.addEventListener;
  
  Element.prototype.addEventListener = function(type, listener, options) {
    if (type === 'scroll') {
      const debouncedListener = debounce(listener, 50);
      scrollHandlers.push({ original: listener, debounced: debouncedListener });
      return originalAddEventListener.call(this, type, debouncedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
});`;
  }
  
  return optimized;
};

/**
 * Updates links in the content to use modern practices
 */
export const updateLinks = (html: string): string => {
  // Add rel="noopener noreferrer" to external links
  return html.replace(
    /<a([^>]*)href="http[s]?:\/\/([^"]*)"([^>]*)>/g, 
    '<a$1href="https://$2"$3 rel="noopener noreferrer" target="_blank">'
  );
};

export default {
  optimizeContent,
  updateLinks
};
