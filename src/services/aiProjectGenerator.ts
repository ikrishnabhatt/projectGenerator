
/**
 * AI Project Generator Service
 * Handles advanced project generation with AI assistance
 */

export interface EnhancedProjectContent {
  html: string;
  css: string;
  js: string;
}

/**
 * Enhances the generated project content with more advanced features
 * based on the prompt and initial content
 */
export const enhanceProjectContent = async (
  prompt: string,
  initialContent: EnhancedProjectContent
): Promise<EnhancedProjectContent> => {
  // Add enhanced features based on prompt analysis
  const enhancedHtml = enhanceHtmlContent(initialContent.html, prompt);
  const enhancedCss = enhanceCssContent(initialContent.css, prompt);
  const enhancedJs = enhanceJsContent(initialContent.js, prompt);

  // For demo purposes, we'll simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    html: enhancedHtml,
    css: enhancedCss,
    js: enhancedJs
  };
};

/**
 * Enhances HTML content with more semantic structure and accessibility features
 */
const enhanceHtmlContent = (html: string, prompt: string): string => {
  // Add meta tags for better SEO
  const metaTags = `
  <meta name="description" content="AI Generated Project">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ffffff">`;

  // Add these meta tags to the head section
  let enhancedHtml = html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1${metaTags}</head>`);

  // Add ARIA attributes for better accessibility
  enhancedHtml = enhancedHtml.replace(/<button/g, '<button aria-label="Button"');
  enhancedHtml = enhancedHtml.replace(/<a /g, '<a aria-label="Link" ');

  // Add container divs for better structure if needed
  if (prompt.toLowerCase().includes("responsive") && !enhancedHtml.includes("container")) {
    enhancedHtml = enhancedHtml.replace(/<body>([\s\S]*?)<\/body>/, 
      '<body><div class="container">$1</div></body>');
  }

  return enhancedHtml;
};

/**
 * Enhances CSS content with more modern styling and responsive design
 */
const enhanceCssContent = (css: string, prompt: string): string => {
  let enhancedCss = css;

  // Add CSS variables for better theming
  const cssVars = `
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
  --background-color: #f9f9f9;
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}`;

  // Add variables to the beginning of CSS
  enhancedCss = cssVars + enhancedCss;

  // Add responsive media queries if not present
  if (!enhancedCss.includes('@media') && prompt.toLowerCase().includes('responsive')) {
    enhancedCss += `
@media screen and (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  header, footer {
    padding: 10px;
  }
  
  .hero h1 {
    font-size: 28px;
  }
  
  .hero p {
    font-size: 16px;
  }
}

@media screen and (max-width: 480px) {
  .hero h1 {
    font-size: 24px;
  }
  
  .grid, .features-grid {
    grid-template-columns: 1fr;
  }
}`;
  }

  return enhancedCss;
};

/**
 * Enhances JavaScript content with more interactive features and modern practices
 */
const enhanceJsContent = (js: string, prompt: string): string => {
  let enhancedJs = js;

  // Add modern JS features
  if (!enhancedJs.includes('const') && !enhancedJs.includes('let')) {
    enhancedJs = enhancedJs.replace(/var /g, 'const ');
  }

  // Add smooth scrolling if not present
  if (!enhancedJs.includes('scrollIntoView')) {
    enhancedJs += `
// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});`;
  }

  // Add dynamic content loading if needed
  if (prompt.toLowerCase().includes('dynamic') || prompt.toLowerCase().includes('api')) {
    enhancedJs += `
// Example function to load dynamic content
function loadDynamicContent(containerId, url) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<p>Loading content...</p>';
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Process and display the data
      let content = '';
      data.forEach(item => {
        content += \`<div class="item">
          <h3>\${item.title}</h3>
          <p>\${item.description}</p>
        </div>\`;
      });
      container.innerHTML = content;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      container.innerHTML = '<p>Failed to load content. Please try again later.</p>';
    });
}`;
  }

  return enhancedJs;
};

export default {
  enhanceProjectContent
};
