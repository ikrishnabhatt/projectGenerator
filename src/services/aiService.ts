
import { generateProjectCss } from "./cssGenerationService";
import { enhanceContent } from "./aiServiceEnhancer";
import { pipeline } from "@huggingface/transformers";
import { generateCodeWithGPT } from "./gptService";

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

// Model cache
let textGenerationModel = null;

async function loadModel() {
  try {
    if (!textGenerationModel) {
      // Use Hugging Face Transformers.js to load an open-source model
      textGenerationModel = await pipeline(
        "text-generation",
        "TinyLlama/TinyLlama-1.1B-Chat-v1.0", // Using a small open-source LLM
        { 
          // Options that are supported by the library
        }
      );
    }
    return textGenerationModel;
  } catch (error) {
    console.error("Error loading model:", error);
    throw new Error("Failed to load AI model. Falling back to template-based generation.");
  }
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

// Default template-based generation as fallback
const generateWithTemplate = async (prompt: string): Promise<{html?: string; css?: string; js?: string}> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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

// AI generation using open-source model
export const generateWithAI = async (prompt: string): Promise<{html?: string; css?: string; js?: string}> => {
  try {
    console.log("Starting AI generation with prompt:", prompt);
    
    // First, try to use GPT service
    try {
      console.log("Attempting to use GPT service...");
      const gptResult = await generateCodeWithGPT(prompt);
      if (gptResult) {
        console.log("GPT generation successful");
        return gptResult;
      }
    } catch (gptError) {
      console.error("GPT generation failed, falling back to TinyLlama:", gptError);
    }
    
    // If GPT fails, try to use the TinyLlama model
    console.log("Loading TinyLlama model...");
    const model = await loadModel();
    
    // Create a prompt for HTML generation
    const htmlPrompt = `
Generate a complete HTML file for a web project based on this description: "${prompt}"
The HTML should include proper structure with semantic HTML5 tags.
Do not include any explanations, only output valid HTML code that would go in an index.html file.
`;

    // Generate HTML using the model
    console.log("Generating HTML...");
    const htmlResult = await model(htmlPrompt, {
      temperature: 0.7,
    });
    
    // Extract HTML from result
    let htmlCode = htmlResult[0].generated_text;
    // Clean up the HTML (remove any non-HTML content before and after the actual code)
    htmlCode = htmlCode.substring(htmlCode.indexOf("<!DOCTYPE") >= 0 ? htmlCode.indexOf("<!DOCTYPE") : 0);
    
    // Create a prompt for CSS generation
    const cssPrompt = `
Generate CSS styles for a web project with this description: "${prompt}"
The CSS should be modern, responsive, and include media queries.
Only output valid CSS code, no explanations.
`;

    // Generate CSS using the model
    console.log("Generating CSS...");
    const cssResult = await model(cssPrompt, {
      temperature: 0.7,
    });
    
    // Extract CSS from result
    let cssCode = cssResult[0].generated_text;
    // Clean up the CSS (remove any non-CSS content before and after the actual code)
    cssCode = cssCode.substring(cssCode.indexOf("/*") >= 0 ? cssCode.indexOf("/*") : 0);
    
    // Create a prompt for JavaScript generation
    const jsPrompt = `
Generate JavaScript code for a web project with this description: "${prompt}"
The JavaScript should include event listeners, DOM manipulation, and basic interactions.
Only output valid JavaScript code, no explanations.
`;

    // Generate JavaScript using the model
    console.log("Generating JavaScript...");
    const jsResult = await model(jsPrompt, {
      temperature: 0.7,
    });
    
    // Extract JavaScript from result
    let jsCode = jsResult[0].generated_text;
    // Clean up the JavaScript
    jsCode = jsCode.substring(jsCode.indexOf("//") >= 0 ? jsCode.indexOf("//") : 0);
    
    console.log("AI Generation completed successfully");
    // Return the generated code
    return {
      html: htmlCode || "<!-- No HTML content was generated -->",
      css: cssCode || "/* No CSS content was generated */",
      js: jsCode || "// No JavaScript content was generated"
    };
  } catch (error) {
    console.error("AI Generation error:", error);
    
    // Fall back to template-based generation
    console.log("Falling back to template-based generation");
    return generateWithTemplate(prompt);
  }
};
