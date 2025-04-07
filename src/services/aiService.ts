
import { generateProjectCss } from "./cssGenerationService";
import { enhanceContent } from "./aiServiceEnhancer";

export interface ProjectRequirement {
  projectName: string;
  projectType: string;
  description: string;
  features: string[];
  imageUrls: string[];
  themeColor: string;
  techStack: string[];
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  previewImageUrl?: string;
  structure: {
    frontend: string[];
    backend?: string[];
  };
  codeSnippets: {
    frontend: string;
    backend?: string;
  };
  techStack: string[];
}

export const generateProject = async (requirements: ProjectRequirement): Promise<GeneratedProject> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const project: GeneratedProject = {
    id: `proj-${Date.now()}`,
    name: requirements.projectName,
    description: requirements.description || `A ${requirements.projectType} project`,
    previewImageUrl: requirements.imageUrls && requirements.imageUrls.length > 0 ? requirements.imageUrls[0] : undefined,
    structure: {
      frontend: [
        "index.html",
        "styles.css",
        "script.js",
        "assets/",
      ],
    },
    codeSnippets: {
      frontend: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${requirements.projectName}</title>
  <style>
    /* CSS styles for ${requirements.projectName} */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      color: #333;
    }
    header {
      background-color: #3498db;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .hero {
      background-color: #f4f4f4;
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .feature-card {
      border: 1px solid #ddd;
      padding: 1.5rem;
      border-radius: 5px;
    }
    footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>${requirements.projectName}</h1>
  </header>
  
  <main class="container">
    <section class="hero">
      <h2>Welcome to ${requirements.projectName}</h2>
      <p>${requirements.description || 'A fantastic web project'}</p>
    </section>
    
    <section class="features">
      ${requirements.features.map(feature => `
        <div class="feature-card">
          <h3>${feature}</h3>
          <p>This feature provides excellent functionality for your project.</p>
        </div>
      `).join('')}
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${requirements.projectName}. All rights reserved.</p>
  </footer>

  <script>
    // JavaScript for ${requirements.projectName}
    document.addEventListener('DOMContentLoaded', () => {
      console.log('${requirements.projectName} loaded!');
    });
  </script>
</body>
</html>`,
    },
    techStack: requirements.techStack || ["HTML", "CSS", "JavaScript"],
  };

  return project;
};

export const downloadProject = async (project: GeneratedProject): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const blob = new Blob([project.codeSnippets.frontend], { type: 'text/html' });
  
  const url = URL.createObjectURL(blob);
  
  return url;
};

export const generateWithAI = async (prompt: string): Promise<{html?: string; css?: string; js?: string}> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>AI Generated Project</h1>
    <p>Based on prompt: "${prompt}"</p>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h2>Welcome to Your AI-Generated Project</h2>
        <p>This project was generated based on your requirements.</p>
        <button class="cta-button">Get Started</button>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature">
            <h3>Responsive Design</h3>
            <p>Works on all devices and screen sizes.</p>
          </div>
          <div class="feature">
            <h3>Modern Interface</h3>
            <p>Clean and intuitive user experience.</p>
          </div>
          <div class="feature">
            <h3>Customizable</h3>
            <p>Easy to modify and extend.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} AI Generated Project</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header styles */
header {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  text-align: center;
}

header h1 {
  margin-bottom: 10px;
}

/* Hero section */
.hero {
  background-color: #3498db;
  color: white;
  padding: 60px 0;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #c0392b;
}

/* Features section */
.features {
  padding: 60px 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature h3 {
  margin-bottom: 15px;
  color: #3498db;
}

/* Footer */
footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero h2 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`;

  const js = `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const ctaButton = document.querySelector('.cta-button');
  const features = document.querySelectorAll('.feature');
  
  // Add click event to the CTA button
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      alert('Thanks for your interest! This is a demo project.');
    });
  }
  
  // Add animation to features when they come into view
  if ('IntersectionObserver' in window) {
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          featureObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    features.forEach(feature => {
      feature.style.opacity = 0;
      feature.style.transform = 'translateY(20px)';
      feature.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      featureObserver.observe(feature);
    });
  }
  
  // Add a simple theme toggler (just for demonstration)
  const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('dark-theme', document.body.classList.contains('dark-theme'));
  };
  
  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.innerHTML = '🌙';
  themeToggle.classList.add('theme-toggle');
  themeToggle.style.position = 'fixed';
  themeToggle.style.bottom = '20px';
  themeToggle.style.right = '20px';
  themeToggle.style.backgroundColor = '#333';
  themeToggle.style.color = 'white';
  themeToggle.style.border = 'none';
  themeToggle.style.borderRadius = '50%';
  themeToggle.style.width = '50px';
  themeToggle.style.height = '50px';
  themeToggle.style.fontSize = '1.5rem';
  themeToggle.style.cursor = 'pointer';
  themeToggle.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
  themeToggle.addEventListener('click', toggleTheme);
  document.body.appendChild(themeToggle);
  
  // Check for saved theme preference
  if (localStorage.getItem('dark-theme') === 'true') {
    document.body.classList.add('dark-theme');
  }
  
  console.log('AI Generated Project initialized!');
});`;

  return { html, css, js };
};
