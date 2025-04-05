
import { toast } from "sonner";
import JSZip from "jszip";

export type ProjectRequirement = {
  projectType: string;
  description: string;
  features: string[];
  techStack: string[];
  projectName?: string;
  themeColor?: string;
  imageUrls?: string[];
};

export type GeneratedProject = {
  id: string;
  name: string;
  description: string;
  codeSnippets: {
    frontend: string;
    backend: string;
  };
  techStack: string[];
  structure: {
    frontend: string[];
    backend: string[];
  };
  previewImageUrl?: string;
  downloadUrl?: string;
};

// Theme color utilities
const themeColors = {
  default: {
    primary: "#7c3aed",
    secondary: "#6d28d9",
    accent: "#4c1d95"
  },
  green: {
    primary: "#059669",
    secondary: "#047857",
    accent: "#065f46"
  },
  blue: {
    primary: "#2563eb",
    secondary: "#1d4ed8",
    accent: "#1e40af"
  },
  red: {
    primary: "#dc2626",
    secondary: "#b91c1c",
    accent: "#991b1b"
  },
  orange: {
    primary: "#ea580c",
    secondary: "#c2410c",
    accent: "#9a3412"
  },
  pink: {
    primary: "#db2777",
    secondary: "#be185d",
    accent: "#9d174d"
  }
};

// Generate project based on requirements
export const generateProject = async (requirements: ProjectRequirement): Promise<GeneratedProject> => {
  try {
    toast.info("Starting project generation...");
    
    // Generate a basic project structure
    const project = await generateTemplateBasedProject(requirements);
    
    toast.success("Project generated successfully!");
    return project;
    
  } catch (error) {
    console.error("Error generating project:", error);
    toast.error("Failed to generate project. Please try again later.");
    throw error;
  }
};

// Create a downloadable ZIP file for the project
export const downloadProject = async (project: GeneratedProject): Promise<string> => {
  try {
    const zip = new JSZip();
    
    // Add HTML file
    if (project.codeSnippets.frontend) {
      zip.file("index.html", project.codeSnippets.frontend);
    }
    
    // Add CSS file (if available)
    const cssContent = extractCSS(project.codeSnippets.frontend);
    if (cssContent) {
      zip.file("styles.css", cssContent);
    } else {
      // Add a default CSS file if no CSS was extracted
      zip.file("styles.css", generateDefaultCSS(project));
    }
    
    // Add JavaScript file
    if (project.codeSnippets.backend) {
      zip.file("script.js", project.codeSnippets.backend);
    } else {
      zip.file("script.js", generateDefaultJS(project));
    }
    
    // Add README
    zip.file("README.md", generateReadme(project));
    
    // Create assets folder
    const assets = zip.folder("assets");
    if (assets && project.previewImageUrl) {
      try {
        // Note: In a real implementation, you'd want to download and include the actual image
        assets.file("placeholder.txt", "Image would be downloaded here in a production environment");
      } catch (error) {
        console.error("Error adding image to ZIP:", error);
      }
    }
    
    // Generate the ZIP file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Create a URL for the blob
    return URL.createObjectURL(content);
  } catch (error) {
    console.error("Error creating project ZIP:", error);
    toast.error("Failed to create downloadable project");
    throw error;
  }
};

// Core project generation function
const generateTemplateBasedProject = async (requirements: ProjectRequirement): Promise<GeneratedProject> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const projectName = requirements.projectName || requirements.projectType || "Generated Project";
  const themeColor = requirements.themeColor || 'default';
  
  // Get content based on project type
  const { html, css, js } = generateProjectContent(requirements);
  
  // Create structure based on project type
  const structure = generateProjectStructure(requirements.projectType);
  
  // Create a project object
  const generatedProject: GeneratedProject = {
    id: `proj-${Date.now()}`,
    name: projectName,
    description: requirements.description || `A ${requirements.projectType} application`,
    codeSnippets: {
      frontend: html,
      backend: js
    },
    techStack: [...requirements.techStack],
    structure: structure,
    previewImageUrl: requirements.imageUrls && requirements.imageUrls.length > 0 ? requirements.imageUrls[0] : undefined
  };
  
  return generatedProject;
};

// Generate project content (HTML, CSS, JS)
const generateProjectContent = (requirements: ProjectRequirement) => {
  const projectType = requirements.projectType.toLowerCase();
  
  // Generate content based on project type
  let html = "", js = "";
  
  if (projectType.includes("e-commerce") || projectType.includes("ecommerce")) {
    html = generateEcommerceHTML(requirements);
    js = generateEcommerceJS(requirements);
  } else if (projectType.includes("portfolio")) {
    html = generatePortfolioHTML(requirements);
    js = generatePortfolioJS(requirements);
  } else if (projectType.includes("blog")) {
    html = generateBlogHTML(requirements);
    js = generateBlogJS(requirements);
  } else if (projectType.includes("dashboard")) {
    html = generateDashboardHTML(requirements);
    js = generateDashboardJS(requirements);
  } else {
    // Default to landing page
    html = generateLandingPageHTML(requirements);
    js = generateLandingPageJS(requirements);
  }
  
  return { html, css: "", js };
};

// Generate project directory structure
const generateProjectStructure = (projectType: string) => {
  const baseStructure = {
    frontend: [
      "index.html",
      "styles.css",
      "script.js",
      "assets/"
    ],
    backend: []
  };
  
  // Add project-specific structure
  if (projectType.toLowerCase().includes("dashboard")) {
    baseStructure.frontend.push("components/charts.js");
    baseStructure.frontend.push("components/sidebar.js");
    baseStructure.frontend.push("components/widgets.js");
  } else if (projectType.toLowerCase().includes("ecommerce")) {
    baseStructure.frontend.push("components/product.js");
    baseStructure.frontend.push("components/cart.js");
    baseStructure.frontend.push("pages/checkout.html");
  } else if (projectType.toLowerCase().includes("blog")) {
    baseStructure.frontend.push("components/post.js");
    baseStructure.frontend.push("components/comment.js");
    baseStructure.frontend.push("pages/article.html");
  }
  
  return baseStructure;
};

// Utility functions
const extractCSS = (html: string): string => {
  const styleRegex = /<style>([\s\S]*?)<\/style>/;
  const match = html.match(styleRegex);
  return match ? match[1].trim() : "";
};

const generateDefaultCSS = (project: GeneratedProject): string => {
  const themeKey = (project as any).themeColor || "default";
  const colors = themeColors[themeKey as keyof typeof themeColors] || themeColors.default;
  
  return `/* Generated CSS for ${project.name} */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.header {
  background-color: ${colors.primary};
  color: white;
  padding: 1rem 0;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${colors.primary};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn:hover {
  background-color: ${colors.secondary};
}

.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 3rem;
}`;
};

const generateDefaultJS = (project: GeneratedProject): string => {
  return `// Generated JavaScript for ${project.name}
document.addEventListener('DOMContentLoaded', function() {
  console.log('${project.name} application loaded');
  
  // Initialize any interactive elements
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(event) {
      console.log('Button clicked:', event.target.textContent);
    });
  });
});`;
};

const generateReadme = (project: GeneratedProject): string => {
  return `# ${project.name}

${project.description}

## Overview
This project was generated using Thynk AI. It includes a basic structure for a ${project.name.toLowerCase()} application.

## Tech Stack
${project.techStack.join(', ')}

## Project Structure
${project.structure.frontend.map(item => `- ${item}`).join('\n')}
`;
};

// HTML generators for each project type
const generateEcommerceHTML = (req: ProjectRequirement) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${req.projectName || "E-commerce Store"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>${req.projectName || "E-commerce Store"}</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Cart</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h2>Welcome to our store</h2>
        <p>${req.description || "Find the best products for your needs"}</p>
      </div>
    </section>
    
    <section class="products">
      <div class="container">
        <h2>Featured Products</h2>
        <div class="product-grid" id="product-grid">
          <!-- Products will be loaded here by JavaScript -->
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2>Our Features</h2>
        <div class="feature-grid">
          ${req.features.map(feature => `
            <div class="feature-card">
              <h3>${feature}</h3>
              <p>High-quality feature implementation</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${req.projectName || "E-commerce Store"}. All rights reserved.</p>
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`;
};

const generatePortfolioHTML = (req: ProjectRequirement) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${req.projectName || "Portfolio"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>${req.projectName || "My Portfolio"}</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Projects</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h2>Hi, I'm a Developer</h2>
        <p>${req.description || "Welcome to my portfolio website"}</p>
      </div>
    </section>
    
    <section class="projects">
      <div class="container">
        <h2>My Projects</h2>
        <div class="project-grid" id="project-grid">
          <!-- Projects will be loaded here by JavaScript -->
        </div>
      </div>
    </section>
    
    <section class="skills">
      <div class="container">
        <h2>My Skills</h2>
        <div class="skills-grid">
          ${req.techStack.map(tech => `
            <div class="skill-card">
              <h3>${tech}</h3>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${req.projectName || "My Portfolio"}. All rights reserved.</p>
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`;
};

const generateBlogHTML = (req: ProjectRequirement) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${req.projectName || "Blog"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>${req.projectName || "My Blog"}</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Articles</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h2>Welcome to my Blog</h2>
        <p>${req.description || "Read my latest articles and thoughts"}</p>
      </div>
    </section>
    
    <section class="articles">
      <div class="container">
        <h2>Recent Articles</h2>
        <div class="article-grid" id="article-grid">
          <!-- Articles will be loaded here by JavaScript -->
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2>Blog Features</h2>
        <div class="feature-grid">
          ${req.features.map(feature => `
            <div class="feature-card">
              <h3>${feature}</h3>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${req.projectName || "My Blog"}. All rights reserved.</p>
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`;
};

const generateDashboardHTML = (req: ProjectRequirement) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${req.projectName || "Dashboard"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>${req.projectName || "Dashboard"}</h1>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li><a href="#" class="active">Dashboard</a></li>
          <li><a href="#">Analytics</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
    </aside>
    
    <main class="main-content">
      <header class="dash-header">
        <div class="header-search">
          <input type="search" placeholder="Search...">
        </div>
        <div class="header-user">
          <span>Admin User</span>
        </div>
      </header>
      
      <div class="dashboard-content">
        <section class="stats-cards">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat">1,254</p>
          </div>
          <div class="stat-card">
            <h3>Revenue</h3>
            <p class="stat">$45,455</p>
          </div>
          <div class="stat-card">
            <h3>Orders</h3>
            <p class="stat">334</p>
          </div>
          <div class="stat-card">
            <h3>Conversion</h3>
            <p class="stat">5.2%</p>
          </div>
        </section>
        
        <section class="charts">
          <div class="chart-container">
            <h3>Sales Analytics</h3>
            <div class="chart" id="sales-chart">
              <!-- Chart will be rendered by JavaScript -->
              <p>Chart placeholder</p>
            </div>
          </div>
        </section>
        
        <section class="activity">
          <h3>Recent Activity</h3>
          <div class="activity-list" id="activity-list">
            <!-- Activity items will be loaded by JavaScript -->
          </div>
        </section>
      </div>
    </main>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`;
};

const generateLandingPageHTML = (req: ProjectRequirement) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${req.projectName || "Landing Page"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>${req.projectName || "Company Name"}</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h2>${req.projectName || "Welcome to Our Site"}</h2>
        <p>${req.description || "The best solution for your needs"}</p>
        <button class="btn">Get Started</button>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2>Key Features</h2>
        <div class="feature-grid">
          ${req.features.map((feature, index) => `
            <div class="feature-card">
              <h3>${feature}</h3>
              <p>Feature ${index + 1} description goes here.</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <section class="cta">
      <div class="container">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers today</p>
        <button class="btn">Sign Up Now</button>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${req.projectName || "Company Name"}. All rights reserved.</p>
    </div>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`;
};

// JavaScript generators for each project type
const generateEcommerceJS = (req: ProjectRequirement) => {
  return `// E-commerce store JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Premium Watch',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      rating: 4
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      rating: 5
    },
    {
      id: 3,
      name: 'Polaroid Camera',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
      rating: 4
    },
    {
      id: 4,
      name: 'Stylish Sunglasses',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
      rating: 4
    }
  ];
  
  // Render products
  const productGrid = document.getElementById('product-grid');
  if (productGrid) {
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product-card';
      productElement.innerHTML = \`
        <div class="product-image">
          <img src="\${product.image}" alt="\${product.name}">
        </div>
        <div class="product-info">
          <h3>\${product.name}</h3>
          <p class="product-price">$\${product.price.toFixed(2)}</p>
          <div class="product-rating">
            <span>\${Array(5).fill('★').map((star, i) => i < product.rating ? star : '☆').join('')}</span>
          </div>
          <button class="btn" data-id="\${product.id}">Add to Cart</button>
        </div>
      \`;
      productGrid.appendChild(productElement);
    });
    
    // Add event listeners for add to cart buttons
    const addToCartButtons = document.querySelectorAll('[data-id]');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        console.log('Added product to cart:', productId);
        alert('Product added to cart!');
      });
    });
  }
});`;
};

const generatePortfolioJS = (req: ProjectRequirement) => {
  return `// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sample project data
  const projects = [
    {
      id: 1,
      name: 'E-commerce Website',
      description: 'A fully responsive e-commerce platform built with modern technologies.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      technologies: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 2,
      name: 'Dashboard Application',
      description: 'An interactive dashboard for data visualization.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      technologies: ['React', 'Chart.js', 'Tailwind CSS']
    },
    {
      id: 3,
      name: 'Mobile App',
      description: 'A cross-platform mobile application for productivity.',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
      technologies: ['React Native', 'Firebase', 'Redux']
    }
  ];
  
  // Render projects
  const projectGrid = document.getElementById('project-grid');
  if (projectGrid) {
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project-card';
      projectElement.innerHTML = \`
        <div class="project-image">
          <img src="\${project.image}" alt="\${project.name}">
        </div>
        <div class="project-info">
          <h3>\${project.name}</h3>
          <p>\${project.description}</p>
          <div class="project-tech">
            \${project.technologies.map(tech => \`<span class="tech-tag">\${tech}</span>\`).join('')}
          </div>
          <a href="#" class="btn" data-id="\${project.id}">View Project</a>
        </div>
      \`;
      projectGrid.appendChild(projectElement);
    });
    
    // Add event listeners for project links
    const projectLinks = document.querySelectorAll('[data-id]');
    projectLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const projectId = this.getAttribute('data-id');
        console.log('Viewing project:', projectId);
        alert('Project details would open here');
      });
    });
  }
});`;
};

const generateBlogJS = (req: ProjectRequirement) => {
  return `// Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sample article data
  const articles = [
    {
      id: 1,
      title: 'Getting Started with Web Development',
      excerpt: 'Learn the basics of HTML, CSS, and JavaScript to start your web development journey.',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
      date: '2025-04-01',
      readTime: 5
    },
    {
      id: 2,
      title: 'The Future of AI in Web Design',
      excerpt: 'Exploring how artificial intelligence is changing the landscape of web design and development.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      date: '2025-03-25',
      readTime: 8
    },
    {
      id: 3,
      title: 'Responsive Design Best Practices',
      excerpt: 'Tips and tricks for creating websites that look great on all devices.',
      image: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40',
      date: '2025-03-18',
      readTime: 6
    }
  ];
  
  // Render articles
  const articleGrid = document.getElementById('article-grid');
  if (articleGrid) {
    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'article-card';
      articleElement.innerHTML = \`
        <div class="article-image">
          <img src="\${article.image}" alt="\${article.title}">
        </div>
        <div class="article-info">
          <div class="article-meta">
            <span>\${article.date}</span>
            <span>\${article.readTime} min read</span>
          </div>
          <h3>\${article.title}</h3>
          <p>\${article.excerpt}</p>
          <a href="#" class="btn" data-id="\${article.id}">Read More</a>
        </div>
      \`;
      articleGrid.appendChild(articleElement);
    });
    
    // Add event listeners for article links
    const articleLinks = document.querySelectorAll('[data-id]');
    articleLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const articleId = this.getAttribute('data-id');
        console.log('Reading article:', articleId);
        alert('Article content would open here');
      });
    });
  }
});`;
};

const generateDashboardJS = (req: ProjectRequirement) => {
  return `// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sample activity data
  const activityItems = [
    { user: 'John Doe', action: 'logged in', time: '5 minutes ago' },
    { user: 'Jane Smith', action: 'purchased Product XYZ', time: '10 minutes ago' },
    { user: 'Robert Johnson', action: 'updated their profile', time: '25 minutes ago' },
    { user: 'Emily Davis', action: 'submitted a support ticket', time: '1 hour ago' },
    { user: 'Michael Wilson', action: 'left a product review', time: '2 hours ago' }
  ];
  
  // Render activity items
  const activityList = document.getElementById('activity-list');
  if (activityList) {
    activityItems.forEach(item => {
      const activityElement = document.createElement('div');
      activityElement.className = 'activity-item';
      activityElement.innerHTML = \`
        <div class="activity-content">
          <strong>\${item.user}</strong> \${item.action}
          <span class="activity-time">\${item.time}</span>
        </div>
      \`;
      activityList.appendChild(activityElement);
    });
  }
  
  // Simulate a simple chart
  const salesChart = document.getElementById('sales-chart');
  if (salesChart) {
    salesChart.innerHTML = '<div class="mock-chart">This is where an actual chart would be rendered with a charting library like Chart.js</div>';
    
    console.log('Dashboard loaded successfully');
    console.log('In a real application, you would use a library like Chart.js to render actual charts with data');
  }
});`;
};

const generateLandingPageJS = (req: ProjectRequirement) => {
  return `// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Landing page loaded');
  
  // Simple scroll animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.feature-card');
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      
      // If element is in viewport
      if(position.top >= 0 && position.bottom <= window.innerHeight) {
        element.classList.add('animate');
      }
    });
  };
  
  // Add event listeners for buttons
  const ctaButtons = document.querySelectorAll('.btn');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Button clicked:', this.textContent);
      alert('Thank you for your interest! This would redirect to a signup form in a real application.');
    });
  });
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Run once on load
  animateOnScroll();
});`;
};
