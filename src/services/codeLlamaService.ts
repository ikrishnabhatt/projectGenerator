
import { toast } from "sonner";

export type ProjectRequirement = {
  projectType: string;
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  imageUrls?: string[];
  themeColor?: string;
};

export type GeneratedProject = {
  id: string;
  name: string;
  description: string;
  codeSnippets: {
    frontend: string;
    backend?: string;
  };
  techStack: string[];
  structure: {
    frontend: string[];
    backend?: string[];
  };
  downloadUrl?: string;
  previewImageUrl?: string;
  themeColor?: string;
};

// CodeLlama API details (using the Hugging Face API)
const HUGGING_FACE_API_KEY = "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";
const HUGGING_FACE_API_ENDPOINT = "https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf";

// Generate an index.html file with proper structure and theme
const generateHtmlFile = (projectName: string, themeColor: string = "#7c3aed") => {
  // Convert theme name to color code if needed
  const colorMap: Record<string, string> = {
    "default": "#7c3aed", // Purple
    "green": "#059669",
    "blue": "#2563eb",
    "red": "#dc2626",
    "orange": "#ea580c",
    "pink": "#db2777"
  };
  
  const primaryColor = colorMap[themeColor] || themeColor;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${getSecondaryColor(primaryColor)};
      --accent-color: ${getAccentColor(primaryColor)};
    }
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
    }
    .btn-primary:hover {
      background-color: var(--secondary-color);
    }
    .header {
      background-color: var(--primary-color);
      color: white;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script src="./main.js" type="module"></script>
</body>
</html>`;
};

// Helper function to get secondary color (darker shade)
function getSecondaryColor(primaryColor: string): string {
  // Simple darkening logic - this would be better with a proper color library
  if (primaryColor.startsWith('#')) {
    // Darken by reducing RGB values by about 15%
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    const darkerR = Math.max(0, Math.floor(r * 0.85)).toString(16).padStart(2, '0');
    const darkerG = Math.max(0, Math.floor(g * 0.85)).toString(16).padStart(2, '0');
    const darkerB = Math.max(0, Math.floor(b * 0.85)).toString(16).padStart(2, '0');
    
    return `#${darkerR}${darkerG}${darkerB}`;
  }
  return primaryColor;
}

// Helper function to get accent color (lighter shade)
function getAccentColor(primaryColor: string): string {
  // Simple lightening logic
  if (primaryColor.startsWith('#')) {
    // Lighten by increasing RGB values by about 20%
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    const lighterR = Math.min(255, Math.floor(r * 1.4)).toString(16).padStart(2, '0');
    const lighterG = Math.min(255, Math.floor(g * 1.4)).toString(16).padStart(2, '0');
    const lighterB = Math.min(255, Math.floor(b * 1.4)).toString(16).padStart(2, '0');
    
    return `#${lighterR}${lighterG}${lighterB}`;
  }
  return primaryColor;
}

// Helper to create a main.js file that uses the generated code
const generateMainJsFile = (frontendCode: string, projectName: string): string => {
  // Extract any imports needed
  const importMatches = frontendCode.match(/import [^;]+;/g) || [];
  const imports = importMatches.join('\n');
  
  // Clean up the code to work as a standalone app
  const cleanedCode = frontendCode
    .replace(/import [^;]+;/g, '')
    .replace(/export default [^{]+{/, 'const App = {')
    .trim();
  
  return `// Generated main.js for ${projectName}
${imports}

// Mount app to DOM
document.addEventListener('DOMContentLoaded', () => {
  ${cleanedCode}
  
  // Create a root element and render app
  const appContainer = document.getElementById('app');
  const appElement = document.createElement('div');
  appElement.innerHTML = \`
    <div class="min-h-screen bg-gray-50">
      <header class="header shadow-md">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-2xl font-bold">${projectName}</h1>
        </div>
      </header>
      <main class="container mx-auto px-4 py-8">
        <div id="content" class="bg-white rounded-lg shadow p-6">
          <!-- Generated content will be placed here -->
        </div>
      </main>
    </div>
  \`;
  
  appContainer.appendChild(appElement);
  
  // Execute any initialization code
  try {
    if (typeof init === 'function') {
      init();
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
});
`;
};

// Generate a README.md file for the project
const generateReadmeFile = (project: GeneratedProject): string => {
  return `# ${project.name}

${project.description}

## Generated Project by Customized Template Builder

This project was generated using the CodeLlama AI model through the Customized Template Builder.

## Tech Stack

${project.techStack.map(tech => `- ${tech}`).join('\n')}

## Getting Started

1. Extract the ZIP file
2. Open index.html in your browser
3. To modify, edit main.js file

## Project Structure

\`\`\`
${project.structure.frontend.join('\n')}
${project.structure.backend ? '\n' + project.structure.backend.join('\n') : ''}
\`\`\`
`;
};

// Generate a package.json file for the project
const generatePackageJsonFile = (project: GeneratedProject): string => {
  const dependencies: Record<string, string> = {};
  
  // Add dependencies based on tech stack
  if (project.techStack.includes('React')) dependencies['react'] = '^18.2.0';
  if (project.techStack.includes('Vue')) dependencies['vue'] = '^3.3.4';
  if (project.techStack.includes('Tailwind CSS')) dependencies['tailwindcss'] = '^3.3.3';
  if (project.techStack.includes('TypeScript')) dependencies['typescript'] = '^5.0.2';
  
  return JSON.stringify({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: project.description,
    main: 'index.html',
    scripts: {
      start: 'serve .',
      dev: 'vite',
      build: 'vite build'
    },
    dependencies,
    devDependencies: {
      vite: '^5.0.0',
      serve: '^14.0.0'
    }
  }, null, 2);
};

// Create a zip file from the generated project files
export const createZipFile = async (project: GeneratedProject): Promise<Blob> => {
  try {
    // Generate the content for each file
    const htmlFile = generateHtmlFile(project.name, project.themeColor);
    const mainJsFile = generateMainJsFile(project.codeSnippets.frontend, project.name);
    const readmeFile = generateReadmeFile(project);
    const packageJsonFile = generatePackageJsonFile(project);
    
    // Create a structure representing the files in our project
    const files = {
      'index.html': htmlFile,
      'main.js': mainJsFile,
      'README.md': readmeFile,
      'package.json': packageJsonFile
    };
    
    // In a real implementation, we'd use JSZip or similar
    // For now, we'll create a JSON representation of the project
    const projectJson = JSON.stringify({
      files: Object.entries(files).map(([path, content]) => ({
        path,
        content,
        type: path.endsWith('.js') ? 'application/javascript' : 
              path.endsWith('.html') ? 'text/html' : 
              path.endsWith('.md') ? 'text/markdown' : 
              path.endsWith('.json') ? 'application/json' : 
              'text/plain'
      })),
      metadata: {
        name: project.name,
        description: project.description,
        techStack: project.techStack
      }
    }, null, 2);

    // Create a blob that represents our project
    return new Blob([projectJson], { type: 'application/zip' });
  } catch (error) {
    console.error("Error creating project ZIP:", error);
    throw new Error("Failed to create downloadable project file");
  }
};

// Generate a project using the CodeLlama API
export const generateProject = async (requirements: ProjectRequirement): Promise<GeneratedProject> => {
  try {
    toast.info("Starting project generation with CodeLlama...");
    
    // Create a detailed and specific prompt for the AI
    const prompt = `
    <INST>
    You are a professional web developer tasked with creating a ${requirements.projectType} application named "${requirements.projectName}". Your task is to generate real, production-ready code based on the following requirements.

    Project Description: ${requirements.description || requirements.projectType + " application"}
    
    ${requirements.features && requirements.features.length > 0 
      ? `Required Features:\n${requirements.features.map(feature => `- ${feature}`).join('\n')}`
      : ''}
    
    Technology Stack:
    ${requirements.techStack.map(tech => `- ${tech}`).join('\n')}
    
    ${requirements.themeColor 
      ? `Theme Color: ${requirements.themeColor}`
      : ''}
    
    ${requirements.imageUrls && requirements.imageUrls.length > 0
      ? `Include these images in the design:\n${requirements.imageUrls.map(url => `- ${url}`).join('\n')}`
      : ''}
    
    I need you to generate a single-page web application with HTML, CSS and JavaScript (NOT a React application). Please focus on generating a simple but working implementation that demonstrates the core functionality.
    
    IMPORTANT GUIDELINES:
    - Do NOT use React or any complex framework, just use vanilla JavaScript or at most a small library
    - Create ACTUAL working code, not pseudocode
    - Include proper comments
    - Make sure to use the specified theme color
    - Focus on visual design and user experience
    - Create something simple but complete rather than complex and partial
    
    Return your response as a vanilla JavaScript application that can run directly in a browser.
    </INST>
    `;

    console.log("Sending request to CodeLlama API with prompt:", prompt);

    // For debugging - log the API endpoint and key (first few chars)
    console.log("API Endpoint:", HUGGING_FACE_API_ENDPOINT);
    console.log("API Key (first 5 chars):", HUGGING_FACE_API_KEY.substring(0, 5) + "...");

    // Call HuggingFace API with the prompt
    const response = await fetch(HUGGING_FACE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 4000,
          temperature: 0.2,
          top_p: 0.95,
          do_sample: true
        }
      })
    });

    console.log("Response status:", response.status);
    
    // If the API is temporarily unavailable, generate a fallback response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      
      // Check if it's a timeout error specifically
      if (errorData.error && errorData.error.includes("too busy")) {
        console.log("Model too busy, generating fallback response");
        return generateFallbackProject(requirements);
      }
      
      throw new Error(errorData.error || "Failed to generate project with AI");
    }

    const data = await response.json();
    console.log("Received response from API:", typeof data);
    let aiResponse = "";
    
    // Handle different response formats from Hugging Face
    if (typeof data === 'string') {
      aiResponse = data;
    } else if (data.generated_text) {
      aiResponse = data.generated_text;
    } else if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      aiResponse = data[0].generated_text;
    } else {
      console.error("Unexpected API response format:", data);
      return generateFallbackProject(requirements);
    }

    // Extract the code from the AI response (looking for code blocks)
    const codeBlockMatch = aiResponse.match(/```(?:html|js|javascript)([\s\S]*?)```/);
    let generatedCode = codeBlockMatch 
      ? codeBlockMatch[1].trim() 
      : aiResponse.replace(/```/g, '').trim();

    console.log("Generated code length:", generatedCode.length);

    // Create a basic structure if no code was generated
    if (!generatedCode || generatedCode.length < 50) {
      return generateFallbackProject(requirements);
    }

    // Generate a preview image based on project type
    const previewImageUrl = getPreviewImageForType(requirements.projectType, requirements.themeColor);

    // Create the final project object
    const generatedProject: GeneratedProject = {
      id: `proj-${Date.now()}`,
      name: requirements.projectName,
      description: requirements.description || `A ${requirements.projectType} application`,
      codeSnippets: {
        frontend: generatedCode
      },
      techStack: [...requirements.techStack],
      structure: {
        frontend: [
          "index.html",
          "main.js",
          "README.md",
          "package.json"
        ]
      },
      previewImageUrl,
      themeColor: requirements.themeColor
    };
    
    // Create the downloadable zip file
    const zipBlob = await createZipFile(generatedProject);
    generatedProject.downloadUrl = URL.createObjectURL(zipBlob);
    
    toast.success("Project generated successfully!");
    return generatedProject;
  } catch (error) {
    console.error("Error generating project:", error);
    toast.error("Failed to generate project. Using fallback generator.");
    return generateFallbackProject({ ...requirements });
  }
};

// Fallback project generator when API fails
const generateFallbackProject = (requirements: ProjectRequirement): GeneratedProject => {
  console.log("Generating fallback project");
  toast.info("Using fallback generator - API was unavailable");
  
  // Generate basic code based on project type
  const generatedCode = generateFallbackCode(requirements);
  
  // Generate a preview image based on project type
  const previewImageUrl = getPreviewImageForType(requirements.projectType, requirements.themeColor);

  // Create the project object
  const generatedProject: GeneratedProject = {
    id: `proj-${Date.now()}`,
    name: requirements.projectName,
    description: requirements.description || `A ${requirements.projectType} application`,
    codeSnippets: {
      frontend: generatedCode
    },
    techStack: [...requirements.techStack],
    structure: {
      frontend: [
        "index.html",
        "main.js",
        "README.md",
        "package.json"
      ]
    },
    previewImageUrl,
    themeColor: requirements.themeColor
  };
  
  // Create and attach the downloadable zip file
  createZipFile(generatedProject).then(zipBlob => {
    generatedProject.downloadUrl = URL.createObjectURL(zipBlob);
  }).catch(error => {
    console.error("Error creating fallback ZIP:", error);
  });
  
  return generatedProject;
};

// Generate fallback code based on the project type
const generateFallbackCode = (requirements: ProjectRequirement): string => {
  const { projectType, projectName, description, features, techStack, themeColor } = requirements;
  
  // Determine the type of code to generate
  const type = projectType.toLowerCase();
  let template = "";
  
  if (type.includes('ecommerce') || type.includes('shop')) {
    template = `
// E-commerce application: ${projectName}
// Description: ${description || "An e-commerce platform"}

// Main application code
document.addEventListener('DOMContentLoaded', function() {
  const products = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/150', description: 'This is product 1' },
    { id: 2, name: 'Product 2', price: 39.99, image: 'https://via.placeholder.com/150', description: 'This is product 2' },
    { id: 3, name: 'Product 3', price: 49.99, image: 'https://via.placeholder.com/150', description: 'This is product 3' },
    { id: 4, name: 'Product 4', price: 59.99, image: 'https://via.placeholder.com/150', description: 'This is product 4' }
  ];

  const cart = [];

  // Initialize the UI
  function init() {
    renderHeader();
    renderProducts();
    renderCart();
    setupEventListeners();
  }

  // Render the header
  function renderHeader() {
    const contentElement = document.getElementById('app');
    const header = document.createElement('header');
    header.className = 'header p-4 shadow-md';
    header.innerHTML = \`
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">${projectName}</h1>
        <div class="flex items-center">
          <button id="cart-button" class="flex items-center space-x-2 btn-primary">
            <span>Cart</span>
            <span id="cart-count" class="bg-white text-black rounded-full h-6 w-6 flex items-center justify-center">0</span>
          </button>
        </div>
      </div>
    \`;
    contentElement.appendChild(header);
  }

  // Render product list
  function renderProducts() {
    const contentElement = document.getElementById('app');
    const main = document.createElement('main');
    main.className = 'container mx-auto p-4';
    main.innerHTML = \`
      <h2 class="text-xl font-bold mb-4">Products</h2>
      <div id="products" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"></div>
    \`;
    contentElement.appendChild(main);

    const productsContainer = document.getElementById('products');
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'border rounded-lg overflow-hidden hover:shadow-lg transition-shadow';
      productCard.innerHTML = \`
        <img src="\${product.image}" alt="\${product.name}" class="w-full h-40 object-cover">
        <div class="p-4">
          <h3 class="font-semibold">\${product.name}</h3>
          <p class="text-gray-600">\${product.description}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="font-bold">$\${product.price}</span>
            <button class="btn-primary add-to-cart" data-id="\${product.id}">Add to Cart</button>
          </div>
        </div>
      \`;
      productsContainer.appendChild(productCard);
    });
  }

  // Render cart
  function renderCart() {
    const contentElement = document.getElementById('app');
    const cartSection = document.createElement('div');
    cartSection.id = 'cart-panel';
    cartSection.className = 'fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform';
    cartSection.innerHTML = \`
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Your Cart</h2>
          <button id="close-cart" class="text-gray-500">&times;</button>
        </div>
      </div>
      <div id="cart-items" class="p-4 space-y-4"></div>
      <div class="p-4 border-t">
        <div class="flex justify-between items-center mb-4">
          <span class="font-bold">Total:</span>
          <span id="cart-total" class="font-bold">$0.00</span>
        </div>
        <button id="checkout-button" class="btn-primary w-full">Checkout</button>
      </div>
    \`;
    contentElement.appendChild(cartSection);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        addToCart(productId);
      });
    });

    // Open cart
    document.getElementById('cart-button').addEventListener('click', function() {
      document.getElementById('cart-panel').classList.remove('translate-x-full');
    });

    // Close cart
    document.getElementById('close-cart').addEventListener('click', function() {
      document.getElementById('cart-panel').classList.add('translate-x-full');
    });

    // Checkout
    document.getElementById('checkout-button').addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty');
      } else {
        alert('Checkout functionality would go here in a real application');
      }
    });
  }

  // Add product to cart
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCart();
    }
  }

  // Update cart UI
  function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart items
    cartItemsElement.innerHTML = '';
    if (cart.length === 0) {
      cartItemsElement.innerHTML = '<p class="text-gray-500">Your cart is empty</p>';
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex justify-between items-center border-b pb-2';
        cartItem.innerHTML = \`
          <div>
            <p class="font-medium">\${item.name}</p>
            <p class="text-sm">$\${item.price} x \${item.quantity}</p>
          </div>
          <span>$\${(item.price * item.quantity).toFixed(2)}</span>
        \`;
        cartItemsElement.appendChild(cartItem);
      });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = '$' + total.toFixed(2);
  }

  // Initialize the application
  init();
});
`;
  } else if (type.includes('portfolio')) {
    template = `
// Portfolio application: ${projectName}
// Description: ${description || "A portfolio website"}

document.addEventListener('DOMContentLoaded', function() {
  // Data for the portfolio
  const projects = [
    { 
      title: 'Project 1', 
      description: 'This is a description of project 1', 
      image: 'https://via.placeholder.com/800x600',
      tags: ['Web Design', 'Frontend'] 
    },
    { 
      title: 'Project 2', 
      description: 'This is a description of project 2', 
      image: 'https://via.placeholder.com/800x600',
      tags: ['Mobile', 'UI/UX'] 
    },
    { 
      title: 'Project 3', 
      description: 'This is a description of project 3', 
      image: 'https://via.placeholder.com/800x600',
      tags: ['Frontend', 'Backend'] 
    }
  ];

  const skills = [
    { name: 'HTML/CSS', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'UI/UX Design', level: 75 },
    { name: 'Node.js', level: 70 }
  ];

  // Initialize the app
  function init() {
    renderHeader();
    renderHero();
    renderProjects();
    renderSkills();
    renderContact();
    renderFooter();
    setupEventListeners();
  }

  // Render the header
  function renderHeader() {
    const appElement = document.getElementById('app');
    const header = document.createElement('header');
    header.className = 'header sticky top-0 z-10 shadow-md';
    header.innerHTML = \`
      <div class="container mx-auto px-4 py-4">
        <nav class="flex justify-between items-center">
          <a href="#" class="text-xl font-bold text-white">${projectName}</a>
          <ul class="hidden md:flex space-x-6">
            <li><a href="#home" class="text-white hover:text-gray-200">Home</a></li>
            <li><a href="#projects" class="text-white hover:text-gray-200">Projects</a></li>
            <li><a href="#skills" class="text-white hover:text-gray-200">Skills</a></li>
            <li><a href="#contact" class="text-white hover:text-gray-200">Contact</a></li>
          </ul>
          <button id="mobile-menu-button" class="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
      </div>
    \`;
    appElement.appendChild(header);

    // Mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'hidden md:hidden bg-gray-800 text-white';
    mobileMenu.innerHTML = \`
      <div class="container mx-auto px-4 py-2">
        <ul class="space-y-2">
          <li><a href="#home" class="block py-2">Home</a></li>
          <li><a href="#projects" class="block py-2">Projects</a></li>
          <li><a href="#skills" class="block py-2">Skills</a></li>
          <li><a href="#contact" class="block py-2">Contact</a></li>
        </ul>
      </div>
    \`;
    appElement.appendChild(mobileMenu);
  }

  // Render the hero section
  function renderHero() {
    const appElement = document.getElementById('app');
    const hero = document.createElement('section');
    hero.id = 'home';
    hero.className = 'bg-gray-100 py-16';
    hero.innerHTML = \`
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4">Hi, I'm <span style="color: var(--primary-color);">John Doe</span></h1>
            <p class="text-xl mb-6">${description || "Welcome to my portfolio website"}</p>
            <button class="btn-primary mr-4">Download CV</button>
            <button class="border border-gray-300 px-4 py-2 rounded">Contact Me</button>
          </div>
          <div class="md:w-1/2">
            <img src="https://via.placeholder.com/600x400" alt="Profile" class="rounded-lg shadow-lg w-full">
          </div>
        </div>
      </div>
    \`;
    appElement.appendChild(hero);
  }

  // Render the projects section
  function renderProjects() {
    const appElement = document.getElementById('app');
    const projectsSection = document.createElement('section');
    projectsSection.id = 'projects';
    projectsSection.className = 'py-16';
    
    let projectsHTML = '';
    projects.forEach(project => {
      projectsHTML += \`
        <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
          <img src="\${project.image}" alt="\${project.title}" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">\${project.title}</h3>
            <p class="text-gray-600 mb-4">\${project.description}</p>
            <div class="flex flex-wrap gap-2">
              \${project.tags.map(tag => \`<span class="px-2 py-1 bg-gray-100 text-sm rounded">\${tag}</span>\`).join('')}
            </div>
          </div>
        </div>
      \`;
    });
    
    projectsSection.innerHTML = \`
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">My Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          \${projectsHTML}
        </div>
      </div>
    \`;
    
    appElement.appendChild(projectsSection);
  }

  // Render the skills section
  function renderSkills() {
    const appElement = document.getElementById('app');
    const skillsSection = document.createElement('section');
    skillsSection.id = 'skills';
    skillsSection.className = 'py-16 bg-gray-100';
    
    let skillsHTML = '';
    skills.forEach(skill => {
      skillsHTML += \`
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="font-medium">\${skill.name}</span>
            <span>\${skill.level}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="h-2.5 rounded-full" style="width: \${skill.level}%; background-color: var(--primary-color)"></div>
          </div>
        </div>
      \`;
    });
    
    skillsSection.innerHTML = \`
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">My Skills</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Technical Skills</h3>
            \${skillsHTML}
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">About Me</h3>
            <p class="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
              Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc,
              quis ultricies nisl nisl eget ultricies ultricies.
            </p>
            <p class="text-gray-600">
              Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl
              ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.
            </p>
          </div>
        </div>
      </div>
    \`;
    
    appElement.appendChild(skillsSection);
  }

  // Render the contact section
  function renderContact() {
    const appElement = document.getElementById('app');
    const contactSection = document.createElement('section');
    contactSection.id = 'contact';
    contactSection.className = 'py-16';
    
    contactSection.innerHTML = \`
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Contact Me</h2>
        <div class="max-w-xl mx-auto">
          <form id="contact-form" class="space-y-4">
            <div>
              <label for="name" class="block mb-1 font-medium">Name</label>
              <input type="text" id="name" class="w-full p-2 border rounded">
            </div>
            <div>
              <label for="email" class="block mb-1 font-medium">Email</label>
              <input type="email" id="email" class="w-full p-2 border rounded">
            </div>
            <div>
              <label for="message" class="block mb-1 font-medium">Message</label>
              <textarea id="message" rows="4" class="w-full p-2 border rounded"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    \`;
    
    appElement.appendChild(contactSection);
  }

  // Render the footer
  function renderFooter() {
    const appElement = document.getElementById('app');
    const footer = document.createElement('footer');
    footer.className = 'bg-gray-800 text-white py-8';
    
    footer.innerHTML = \`
      <div class="container mx-auto px-4">
        <div class="text-center">
          <p>&copy; ${new Date().getFullYear()} ${projectName}. All rights reserved.</p>
          <div class="flex justify-center space-x-4 mt-4">
            <a href="#" class="text-white hover:text-gray-300">Twitter</a>
            <a href="#" class="text-white hover:text-gray-300">LinkedIn</a>
            <a href="#" class="text-white hover:text-gray-300">GitHub</a>
          </div>
        </div>
      </div>
    \`;
    
    appElement.appendChild(footer);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Toggle mobile menu
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobile-menu');
      mobileMenu.classList.toggle('hidden');
    });
    
    // Handle form submission
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // In a real application, you would send this data to a server
      alert(\`Thank you for your message, \${name}! We'll get back to you soon.\`);
      this.reset();
    });
  }

  // Initialize the application
  init();
});
`;
  } else if (type.includes('blog')) {
    template = `
// Blog application: ${projectName}
// Description: ${description || "A simple blog"}

document.addEventListener('DOMContentLoaded', function() {
  // Sample blog posts
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Web Development',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.',
      image: 'https://via.placeholder.com/800x400',
      author: 'John Doe',
      date: '2023-06-15',
      category: 'Development',
      tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 2,
      title: 'The Future of AI in Technology',
      content: 'Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies. Nullam auctor, nisl eget ultricies ultricies.',
      image: 'https://via.placeholder.com/800x400',
      author: 'Jane Smith',
      date: '2023-06-10',
      category: 'Technology',
      tags: ['AI', 'Machine Learning', 'Technology']
    },
    {
      id: 3,
      title: 'Designing for User Experience',
      content: 'Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies. Sed euismod, nisl eget ultricies ultricies.',
      image: 'https://via.placeholder.com/800x400',
      author: 'Mike Johnson',
      date: '2023-06-05',
      category: 'Design',
      tags: ['UX', 'UI', 'Design Thinking']
    }
  ];

  // Blog categories
  const categories = ['All', 'Development', 'Technology', 'Design'];

  // Current active page
  let currentPage = 'home';
  let activePostId = null;

  // Initialize the app
  function init() {
    renderHeader();
    renderHomePage();
    setupEventListeners();
  }

  // Render the header
  function renderHeader() {
    const appElement = document.getElementById('app');
    const header = document.createElement('header');
    header.className = 'header shadow-md';
    header.innerHTML = \`
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <a href="#" class="text-2xl font-bold text-white" id="logo">${projectName}</a>
          <nav class="hidden md:block">
            <ul class="flex space-x-6">
              <li><a href="#" class="text-white hover:text-gray-200 nav-link" data-page="home">Home</a></li>
              <li><a href="#" class="text-white hover:text-gray-200 nav-link" data-page="about">About</a></li>
              <li><a href="#" class="text-white hover:text-gray-200 nav-link" data-page="contact">Contact</a></li>
            </ul>
          </nav>
          <button id="mobile-menu-button" class="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    \`;
    appElement.appendChild(header);

    // Mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'hidden md:hidden bg-gray-800 text-white';
    mobileMenu.innerHTML = \`
      <div class="container mx-auto px-4 py-2">
        <ul class="space-y-2">
          <li><a href="#" class="block py-2 nav-link" data-page="home">Home</a></li>
          <li><a href="#" class="block py-2 nav-link" data-page="about">About</a></li>
          <li><a href="#" class="block py-2 nav-link" data-page="contact">Contact</a></li>
        </ul>
      </div>
    \`;
    appElement.appendChild(mobileMenu);
  }

  // Render the home page
  function renderHomePage() {
    const appElement = document.getElementById('app');
    
    // Clear any existing main content
    const existingMain = document.querySelector('main');
    if (existingMain) {
      existingMain.remove();
    }
    
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4 py-8';
    
    // Hero section
    const hero = document.createElement('section');
    hero.className = 'bg-gray-100 p-8 rounded-lg mb-8';
    hero.innerHTML = \`
      <h1 class="text-3xl font-bold mb-4">${projectName}</h1>
      <p class="text-lg text-gray-600 mb-6">${description || "A place to share knowledge and ideas"}</p>
      <div class="flex space-x-4">
        <button class="btn-primary">Latest Posts</button>
        <button class="border border-gray-300 px-4 py-2 rounded">Subscribe</button>
      </div>
    \`;
    
    // Categories section
    const categoriesSection = document.createElement('section');
    categoriesSection.className = 'mb-8';
    
    let categoriesHTML = '';
    categories.forEach(category => {
      categoriesHTML += \`
        <button class="category-btn mr-2 mb-2 px-4 py-2 rounded-full \${category === 'All' ? 'bg-primary-color text-white' : 'bg-gray-100'}" 
          data-category="\${category}">\${category}</button>
      \`;
    });
    
    categoriesSection.innerHTML = \`
      <h2 class="text-xl font-bold mb-4">Categories</h2>
      <div class="flex flex-wrap">
        \${categoriesHTML}
      </div>
    \`;
    
    // Posts section
    const postsSection = document.createElement('section');
    postsSection.id = 'posts-container';
    postsSection.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
    
    posts.forEach(post => {
      const postElement = document.createElement('article');
      postElement.className = 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow';
      postElement.innerHTML = \`
        <img src="\${post.image}" alt="\${post.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <div class="flex items-center mb-2">
            <span class="text-sm text-gray-500">\${new Date(post.date).toLocaleDateString()}</span>
            <span class="mx-2">•</span>
            <span class="text-sm bg-gray-100 px-2 py-1 rounded">\${post.category}</span>
          </div>
          <h2 class="text-xl font-semibold mb-2">\${post.title}</h2>
          <p class="text-gray-600 mb-4">\${post.content.substring(0, 120)}...</p>
          <button class="text-primary-color hover:underline read-more" data-post-id="\${post.id}">Read More</button>
        </div>
      \`;
      postsSection.appendChild(postElement);
    });
    
    // Append all sections to main
    main.appendChild(hero);
    main.appendChild(categoriesSection);
    main.appendChild(postsSection);
    
    // Append main to app
    appElement.appendChild(main);
  }

  // Render a single post
  function renderSinglePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const appElement = document.getElementById('app');
    
    // Clear any existing main content
    const existingMain = document.querySelector('main');
    if (existingMain) {
      existingMain.remove();
    }
    
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4 py-8';
    
    main.innerHTML = \`
      <button class="flex items-center text-primary-color hover:underline mb-6 back-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to All Posts
      </button>
      
      <article class="bg-white rounded-lg overflow-hidden shadow-md">
        <img src="\${post.image}" alt="\${post.title}" class="w-full h-64 object-cover">
        <div class="p-8">
          <div class="flex items-center mb-4">
            <span class="text-sm text-gray-500">\${new Date(post.date).toLocaleDateString()}</span>
            <span class="mx-2">•</span>
            <span class="text-sm bg-gray-100 px-2 py-1 rounded">\${post.category}</span>
          </div>
          <h1 class="text-3xl font-bold mb-4">\${post.title}</h1>
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <span class="font-medium">\${post.author}</span>
          </div>
          <div class="prose max-w-none">
            <p class="mb-4">\${post.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies. Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.</p>
            <p class="mb-4">Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies. Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.</p>
          </div>
          <div class="mt-6">
            <h3 class="font-semibold mb-2">Tags:</h3>
            <div class="flex flex-wrap">
              \${post.tags.map(tag => \`<span class="mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-sm">\${tag}</span>\`).join('')}
            </div>
          </div>
        </div>
      </article>
      
      <section class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Comments</h2>
        <form id="comment-form" class="bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="mb-4">
            <label for="name" class="block mb-1 font-medium">Name</label>
            <input type="text" id="name" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label for="comment" class="block mb-1 font-medium">Comment</label>
            <textarea id="comment" rows="4" class="w-full p-2 border rounded"></textarea>
          </div>
          <button type="submit" class="btn-primary">Post Comment</button>
        </form>
        <div class="space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <span class="font-medium">Sarah Johnson</span>
              <span class="mx-2">•</span>
              <span class="text-sm text-gray-500">2 days ago</span>
            </div>
            <p>Great article! I learned a lot from this.</p>
          </div>
        </div>
      </section>
    \`;
    
    appElement.appendChild(main);
  }

  // Render the about page
  function renderAboutPage() {
    const appElement = document.getElementById('app');
    
    // Clear any existing main content
    const existingMain = document.querySelector('main');
    if (existingMain) {
      existingMain.remove();
    }
    
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4 py-8';
    
    main.innerHTML = \`
      <section class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 class="text-3xl font-bold mb-6">About ${projectName}</h1>
        <p class="text-lg text-gray-600 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, 
          nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.
        </p>
        <p class="text-lg text-gray-600 mb-4">
          Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget 
          ultricies ultricies. Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc.
        </p>
        <p class="text-lg text-gray-600">
          Quis ultricies nisl nisl eget ultricies ultricies. Sed euismod, nisl eget ultricies ultricies, 
          nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.
        </p>
      </section>
      
      <section class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold">John Doe</h3>
            <p class="text-gray-600">Editor in Chief</p>
          </div>
          <div class="text-center">
            <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold">Jane Smith</h3>
            <p class="text-gray-600">Senior Writer</p>
          </div>
          <div class="text-center">
            <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold">Mike Johnson</h3>
            <p class="text-gray-600">Content Strategist</p>
          </div>
        </div>
      </section>
    \`;
    
    appElement.appendChild(main);
  }

  // Render the contact page
  function renderContactPage() {
    const appElement = document.getElementById('app');
    
    // Clear any existing main content
    const existingMain = document.querySelector('main');
    if (existingMain) {
      existingMain.remove();
    }
    
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4 py-8';
    
    main.innerHTML = \`
      <section class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p class="text-lg text-gray-600 mb-4">
              Have a question or feedback? We'd love to hear from you. Fill out the form
              and we'll get back to you as soon as possible.
            </p>
            <div class="space-y-4 mt-8">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-color mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 class="font-semibold">Email</h3>
                  <p class="text-gray-600">info@${projectName.toLowerCase().replace(/\\s+/g, '')}.com</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-color mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 class="font-semibold">Phone</h3>
                  <p class="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-color mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 class="font-semibold">Address</h3>
                  <p class="text-gray-600">123 Blog Street, Suite 101</p>
                  <p class="text-gray-600">San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <form id="contact-form" class="space-y-4">
              <div>
                <label for="name" class="block mb-1 font-medium">Name</label>
                <input type="text" id="name" class="w-full p-2 border rounded">
              </div>
              <div>
                <label for="email" class="block mb-1 font-medium">Email</label>
                <input type="email" id="email" class="w-full p-2 border rounded">
              </div>
              <div>
                <label for="subject" class="block mb-1 font-medium">Subject</label>
                <input type="text" id="subject" class="w-full p-2 border rounded">
              </div>
              <div>
                <label for="message" class="block mb-1 font-medium">Message</label>
                <textarea id="message" rows="4" class="w-full p-2 border rounded"></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    \`;
    
    appElement.appendChild(main);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Toggle mobile menu
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobile-menu');
      mobileMenu.classList.toggle('hidden');
    });
    
    // Navigation links
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
        e.preventDefault();
        
        const link = e.target.classList.contains('nav-link') ? e.target : e.target.closest('.nav-link');
        const page = link.getAttribute('data-page');
        
        // Only change page if it's different
        if (page !== currentPage) {
          currentPage = page;
          
          switch (page) {
            case 'home':
              renderHomePage();
              break;
            case 'about':
              renderAboutPage();
              break;
            case 'contact':
              renderContactPage();
              break;
          }
          
          // Close mobile menu after navigation
          document.getElementById('mobile-menu').classList.add('hidden');
        }
      }
    });
    
    // Logo click
    document.addEventListener('click', function(e) {
      if (e.target.id === 'logo' || e.target.closest('#logo')) {
        e.preventDefault();
        
        if (currentPage !== 'home' || activePostId !== null) {
          currentPage = 'home';
          activePostId = null;
          renderHomePage();
        }
      }
    });
    
    // Read more buttons
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('read-more')) {
        e.preventDefault();
        
        const postId = parseInt(e.target.getAttribute('data-post-id'));
        activePostId = postId;
        renderSinglePost(postId);
      }
    });
    
    // Back button
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('back-button') || e.target.closest('.back-button')) {
        e.preventDefault();
        
        activePostId = null;
        renderHomePage();
      }
    });
    
    // Category buttons
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('category-btn')) {
        e.preventDefault();
        
        const category = e.target.getAttribute('data-category');
        
        // Update active category styles
        document.querySelectorAll('.category-btn').forEach(btn => {
          if (btn.getAttribute('data-category') === category) {
            btn.classList.add('bg-primary-color', 'text-white');
            btn.classList.remove('bg-gray-100');
          } else {
            btn.classList.remove('bg-primary-color', 'text-white');
            btn.classList.add('bg-gray-100');
          }
        });
        
        // Filter posts by category
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
          // Remove existing posts
          postsContainer.innerHTML = '';
          
          // Filter posts by selected category
          const filteredPosts = category === 'All' 
            ? posts 
            : posts.filter(post => post.category === category);
          
          // Add filtered posts
          filteredPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow';
            postElement.innerHTML = \`
              <img src="\${post.image}" alt="\${post.title}" class="w-full h-48 object-cover">
              <div class="p-6">
                <div class="flex items-center mb-2">
                  <span class="text-sm text-gray-500">\${new Date(post.date).toLocaleDateString()}</span>
                  <span class="mx-2">•</span>
                  <span class="text-sm bg-gray-100 px-2 py-1 rounded">\${post.category}</span>
                </div>
                <h2 class="text-xl font-semibold mb-2">\${post.title}</h2>
                <p class="text-gray-600 mb-4">\${post.content.substring(0, 120)}...</p>
                <button class="text-primary-color hover:underline read-more" data-post-id="\${post.id}">Read More</button>
              </div>
            \`;
            postsContainer.appendChild(postElement);
          });
        }
      }
    });
    
    // Form submissions
    document.addEventListener('submit', function(e) {
      if (e.target.id === 'contact-form' || e.target.id === 'comment-form') {
        e.preventDefault();
        
        // Show success message
        alert('Thank you for your submission!');
        e.target.reset();
      }
    });
  }

  // Initialize the application
  init();
});
`;
  } else if (type.includes('dashboard')) {
    template = `
// Dashboard application: ${projectName}
// Description: ${description || "An analytics dashboard"}

document.addEventListener('DOMContentLoaded', function() {
  // Sample data for the dashboard
  const salesData = [
    { month: 'Jan', value: 1000 },
    { month: 'Feb', value: 1500 },
    { month: 'Mar', value: 1200 },
    { month: 'Apr', value: 1800 },
    { month: 'May', value: 2000 },
    { month: 'Jun', value: 2400 },
    { month: 'Jul', value: 2100 },
    { month: 'Aug', value: 2800 },
    { month: 'Sep', value: 3000 },
    { month: 'Oct', value: 3300 },
    { month: 'Nov', value: 3500 },
    { month: 'Dec', value: 3800 }
  ];

  const userData = [
    { name: 'John Doe', email: 'john@example.com', status: 'Active', lastLogin: '2023-06-15' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Active', lastLogin: '2023-06-14' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', lastLogin: '2023-05-20' },
    { name: 'Alice Brown', email: 'alice@example.com', status: 'Active', lastLogin: '2023-06-13' },
    { name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Active', lastLogin: '2023-06-12' }
  ];

  const productData = [
    { id: 1, name: 'Product A', category: 'Electronics', stock: 250, price: 999 },
    { id: 2, name: 'Product B', category: 'Clothing', stock: 120, price: 59.99 },
    { id: 3, name: 'Product C', category: 'Home', stock: 75, price: 129.99 },
    { id: 4, name: 'Product D', category: 'Electronics', stock: 180, price: 1499 },
    { id: 5, name: 'Product E', category: 'Accessories', stock: 350, price: 29.99 }
  ];

  // Dashboard statistics
  const stats = [
    { label: 'Total Revenue', value: '$24,500', change: '+12.5%', trend: 'up' },
    { label: 'Total Orders', value: '850', change: '+18.2%', trend: 'up' },
    { label: 'New Customers', value: '245', change: '+5.8%', trend: 'up' },
    { label: 'Inventory', value: '1,250', change: '-2.3%', trend: 'down' }
  ];

  // Current active page on the dashboard
  let activeMenu = 'dashboard';

  // Initialize the dashboard
  function init() {
    renderLayout();
    renderDashboardPage();
    setupEventListeners();
  }

  // Render the dashboard layout
  function renderLayout() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    // Dashboard layout with sidebar and main content area
    appElement.innerHTML = \`
      <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white">
          <div class="p-4 border-b border-gray-700">
            <h1 class="text-xl font-bold">${projectName}</h1>
          </div>
          <nav class="p-4">
            <ul class="space-y-2">
              <li>
                <a href="#" class="flex items-center p-2 rounded-md hover:bg-gray-700 menu-link \${activeMenu === 'dashboard' ? 'bg-gray-700' : ''}" data-menu="dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center p-2 rounded-md hover:bg-gray-700 menu-link \${activeMenu === 'users' ? 'bg-gray-700' : ''}" data-menu="users">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Users
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center p-2 rounded-md hover:bg-gray-700 menu-link \${activeMenu === 'products' ? 'bg-gray-700' : ''}" data-menu="products">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                  </svg>
                  Products
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center p-2 rounded-md hover:bg-gray-700 menu-link \${activeMenu === 'settings' ? 'bg-gray-700' : ''}" data-menu="settings">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Top navbar -->
          <header class="bg-white shadow-sm">
            <div class="flex items-center justify-between p-4">
              <div>
                <input type="text" placeholder="Search..." class="p-2 border rounded-md w-64">
              </div>
              <div class="flex items-center space-x-4">
                <button class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div class="relative">
                  <button class="flex items-center space-x-2">
                    <div class="h-8 w-8 rounded-full bg-gray-300"></div>
                    <span>Admin User</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          <!-- Main content area -->
          <main id="main-content" class="flex-1 overflow-y-auto p-6 bg-gray-100">
            <!-- Content will be rendered here -->
          </main>
        </div>
      </div>
    \`;
  }

  // Render the main dashboard page
  function renderDashboardPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    // Page header
    const header = document.createElement('div');
    header.className = 'mb-6';
    header.innerHTML = \`
      <h1 class="text-2xl font-bold">Dashboard Overview</h1>
      <p class="text-gray-600">Welcome back, Admin!</p>
    \`;
    
    // Stats cards
    const statsSection = document.createElement('div');
    statsSection.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6';
    
    stats.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md p-6';
      card.innerHTML = \`
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">\${stat.label}</p>
            <h2 class="text-2xl font-bold">\${stat.value}</h2>
          </div>
          <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="\${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              \${stat.trend === 'up' 
                ? '<path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />'
                : '<path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />'
              }
            </svg>
            \${stat.change}
          </span>
          <span class="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
      \`;
      statsSection.appendChild(card);
    });
    
    // Charts section
    const chartsSection = document.createElement('div');
    chartsSection.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6';
    
    // Sales chart
    const salesChart = document.createElement('div');
    salesChart.className = 'bg-white rounded-lg shadow-md p-6';
    salesChart.innerHTML = \`
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Sales Overview</h3>
        <div class="flex items-center space-x-2">
          <select class="border rounded p-1 text-sm">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>
      <div class="h-64" id="sales-chart"></div>
    \`;
    
    // Customers chart
    const customersChart = document.createElement('div');
    customersChart.className = 'bg-white rounded-lg shadow-md p-6';
    customersChart.innerHTML = \`
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Customer Acquisition</h3>
        <div class="flex items-center space-x-2">
          <select class="border rounded p-1 text-sm">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>
      <div class="h-64" id="customers-chart"></div>
    \`;
    
    chartsSection.appendChild(salesChart);
    chartsSection.appendChild(customersChart);
    
    // Recent activities section
    const activitiesSection = document.createElement('div');
    activitiesSection.className = 'bg-white rounded-lg shadow-md p-6';
    
    activitiesSection.innerHTML = \`
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Recent Activities</h3>
        <button class="text-indigo-600 hover:text-indigo-800">View All</button>
      </div>
      <div class="space-y-4">
        <div class="flex items-start">
          <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium">New order <span class="text-indigo-600">#12345</span> was placed</p>
            <p class="text-gray-500 text-sm">1 hour ago</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            </svg>
          </div>
          <div>
            <p class="font-medium">New user <span class="text-indigo-600">John Doe</span> registered</p>
            <p class="text-gray-500 text-sm">2 hours ago</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium">Product <span class="text-indigo-600">Product A</span> inventory updated</p>
            <p class="text-gray-500 text-sm">4 hours ago</p>
          </div>
        </div>
      </div>
    \`;
    
    // Append all sections
    mainContent.appendChild(header);
    mainContent.appendChild(statsSection);
    mainContent.appendChild(chartsSection);
    mainContent.appendChild(activitiesSection);
    
    // Simple chart rendering with Canvas API
    renderSalesChart();
    renderCustomersChart();
  }

  // Render the users page
  function renderUsersPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    // Page header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = \`
      <div>
        <h1 class="text-2xl font-bold">Users</h1>
        <p class="text-gray-600">Manage your users</p>
      </div>
      <button class="btn-primary">Add User</button>
    \`;
    
    // Users table
    const usersTable = document.createElement('div');
    usersTable.className = 'bg-white rounded-lg shadow-md';
    
    // Table markup
    let tableRows = '';
    userData.forEach(user => {
      tableRows += \`
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <div class="font-medium">\${user.name}</div>
                <div class="text-gray-500">\${user.email}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 rounded-full text-xs \${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
              \${user.status}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500">
            \${new Date(user.lastLogin).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
            <button class="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      \`;
    });
    
    usersTable.innerHTML = \`
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          \${tableRows}
        </tbody>
      </table>
    \`;
    
    // Pagination
    const pagination = document.createElement('div');
    pagination.className = 'bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6';
    pagination.innerHTML = \`
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">20</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              1
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
              2
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </a>
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      </div>
    \`;
    
    // Append all sections
    mainContent.appendChild(header);
    mainContent.appendChild(usersTable);
    mainContent.appendChild(pagination);
  }

  // Render the products page
  function renderProductsPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    // Page header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = \`
      <div>
        <h1 class="text-2xl font-bold">Products</h1>
        <p class="text-gray-600">Manage your inventory</p>
      </div>
      <button class="btn-primary">Add Product</button>
    \`;
    
    // Filters section
    const filters = document.createElement('div');
    filters.className = 'bg-white rounded-lg shadow-md p-4 mb-6';
    filters.innerHTML = \`
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-1/4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input type="text" class="w-full p-2 border rounded" placeholder="Search products...">
        </div>
        <div class="w-full md:w-1/4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select class="w-full p-2 border rounded">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div class="w-full md:w-1/4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select class="w-full p-2 border rounded">
            <option value="">All</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>
        <div class="w-full md:w-1/4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select class="w-full p-2 border rounded">
            <option value="name">Name</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
    \`;
    
    // Products table
    const productsTable = document.createElement('div');
    productsTable.className = 'bg-white rounded-lg shadow-md';
    
    // Table markup
    let tableRows = '';
    productData.forEach(product => {
      tableRows += \`
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-gray-100 rounded mr-3"></div>
              <div>
                <div class="font-medium">\${product.name}</div>
                <div class="text-gray-500">ID: \${product.id}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500">
            \${product.category}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-500">
            \${product.stock} units
          </td>
          <td class="px-6 py-4 whitespace-nowrap font-medium">
            $\${product.price.toFixed(2)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
            <button class="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      \`;
    });
    
    productsTable.innerHTML = \`
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          \${tableRows}
        </tbody>
      </table>
    \`;
    
    // Pagination (same as users page)
    const pagination = document.createElement('div');
    pagination.className = 'bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6';
    pagination.innerHTML = \`
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">12</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
              1
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </a>
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      </div>
    \`;
    
    // Append all sections
    mainContent.appendChild(header);
    mainContent.appendChild(filters);
    mainContent.appendChild(productsTable);
    mainContent.appendChild(pagination);
  }

  // Render the settings page
  function renderSettingsPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    // Page header
    const header = document.createElement('div');
    header.className = 'mb-6';
    header.innerHTML = \`
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-gray-600">Manage your account and application settings</p>
    \`;
    
    // Settings content with tabs
    const settingsContent = document.createElement('div');
    settingsContent.className = 'bg-white rounded-lg shadow-md';
    settingsContent.innerHTML = \`
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <a href="#" class="settings-tab active w-1/4 py-4 px-1 text-center border-b-2 border-indigo-500 font-medium text-sm text-indigo-600" data-tab="profile">
            Profile
          </a>
          <a href="#" class="settings-tab w-1/4 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="account">
            Account
          </a>
          <a href="#" class="settings-tab w-1/4 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="notifications">
            Notifications
          </a>
          <a href="#" class="settings-tab w-1/4 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="appearance">
            Appearance
          </a>
        </nav>
      </div>
      
      <div id="profile-tab" class="settings-content p-6">
        <div class="mb-6">
          <h2 class="text-lg font-medium mb-4">Profile Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" class="w-full p-2 border rounded" value="Admin">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" class="w-full p-2 border rounded" value="User">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" class="w-full p-2 border rounded" value="admin@example.com">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" class="w-full p-2 border rounded" value="+1 (555) 123-4567">
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-medium mb-4">Profile Picture</h2>
          <div class="flex items-center space-x-6">
            <div class="h-24 w-24 rounded-full bg-gray-300"></div>
            <div>
              <button class="btn-primary mb-2">Upload Image</button>
              <p class="text-xs text-gray-500">JPG, GIF, or PNG. Max size 2MB.</p>
            </div>
          </div>
        </div>
        
        <div class="border-t pt-6">
          <button class="btn-primary">Save Changes</button>
        </div>
      </div>
      
      <div id="account-tab" class="settings-content p-6 hidden">
        <div class="mb-6">
          <h2 class="text-lg font-medium mb-4">Change Password</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" class="w-full p-2 border rounded">
            </div>
          </div>
          <button class="btn-primary mt-4">Update Password</button>
        </div>
        
        <div class="border-t pt-6">
          <h2 class="text-lg font-medium mb-4 text-red-600">Danger Zone</h2>
          <p class="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete Account</button>
        </div>
      </div>
      
      <div id="notifications-tab" class="settings-content p-6 hidden">
        <h2 class="text-lg font-medium mb-4">Notification Preferences</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Email Notifications</h3>
              <p class="text-gray-500 text-sm">Receive email notifications for important updates</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Order Updates</h3>
              <p class="text-gray-500 text-sm">Receive notifications when orders are placed or updated</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">User Registrations</h3>
              <p class="text-gray-500 text-sm">Get notified when new users register</p>
            </div>
            <label class="switch">
              <input type="checkbox">
              <span class="slider round"></span>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">System Alerts</h3>
              <p class="text-gray-500 text-sm">Receive system maintenance and update notifications</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="border-t pt-6 mt-6">
          <button class="btn-primary">Save Preferences</button>
        </div>
      </div>
      
      <div id="appearance-tab" class="settings-content p-6 hidden">
        <h2 class="text-lg font-medium mb-4">Theme Preferences</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div class="grid grid-cols-3 gap-4">
              <div class="border p-4 rounded-lg cursor-pointer bg-white">
                <div class="h-6 w-full bg-indigo-600 rounded-md mb-2"></div>
                <p class="text-sm text-center">Default</p>
              </div>
              <div class="border p-4 rounded-lg cursor-pointer hover:border-gray-400">
                <div class="h-6 w-full bg-blue-600 rounded-md mb-2"></div>
                <p class="text-sm text-center">Blue</p>
              </div>
              <div class="border p-4 rounded-lg cursor-pointer hover:border-gray-400">
                <div class="h-6 w-full bg-green-600 rounded-md mb-2"></div>
                <p class="text-sm text-center">Green</p>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
            <div class="grid grid-cols-2 gap-4">
              <div class="border p-4 rounded-lg cursor-pointer bg-white">
                <div class="h-20 w-full bg-white border rounded-md mb-2">
                  <div class="h-4 w-3/4 bg-gray-300 rounded-md mx-auto mt-2"></div>
                  <div class="h-12 w-full bg-gray-100 mt-2"></div>
                </div>
                <p class="text-sm text-center">Light Mode</p>
              </div>
              <div class="border p-4 rounded-lg cursor-pointer hover:border-gray-400">
                <div class="h-20 w-full bg-gray-800 border rounded-md mb-2">
                  <div class="h-4 w-3/4 bg-gray-600 rounded-md mx-auto mt-2"></div>
                  <div class="h-12 w-full bg-gray-700 mt-2"></div>
                </div>
                <p class="text-sm text-center">Dark Mode</p>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select class="w-full p-2 border rounded">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
        
        <div class="border-t pt-6 mt-6">
          <button class="btn-primary">Save Preferences</button>
        </div>
      </div>
    \`;
    
    // Append all sections
    mainContent.appendChild(header);
    mainContent.appendChild(settingsContent);
  }

  // Render a basic sales chart with the canvas API
  function renderSalesChart() {
    const canvas = document.createElement('canvas');
    canvas.id = 'salesChartCanvas';
    document.getElementById('sales-chart').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Calculate the max value for scaling
    const maxValue = Math.max(...salesData.map(d => d.value));
    const padding = 40;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const barWidth = chartWidth / salesData.length * 0.7;
    const barSpacing = chartWidth / salesData.length * 0.3;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw bars
    salesData.forEach((data, index) => {
      const barHeight = (data.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = height - padding - barHeight;
      
      // Bar
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.month, x + barWidth / 2, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = Math.round(maxValue / steps * i);
      const y = height - padding - (value / maxValue) * chartHeight;
      ctx.fillText('$' + value, padding - 10, y + 5);
    }
  }

  // Render a basic customers chart with the canvas API
  function renderCustomersChart() {
    const canvas = document.createElement('canvas');
    canvas.id = 'customersChartCanvas';
    document.getElementById('customers-chart').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Simulated customer acquisition data
    const customerData = [
      { month: 'Jan', value: 5 },
      { month: 'Feb', value: 12 },
      { month: 'Mar', value: 18 },
      { month: 'Apr', value: 25 },
      { month: 'May', value: 30 },
      { month: 'Jun', value: 35 },
      { month: 'Jul', value: 42 },
      { month: 'Aug', value: 55 },
      { month: 'Sep', value: 60 },
      { month: 'Oct', value: 70 },
      { month: 'Nov', value: 78 },
      { month: 'Dec', value: 85 }
    ];
    
    // Calculate the max value for scaling
    const maxValue = Math.max(...customerData.map(d => d.value));
    const padding = 40;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    
    customerData.forEach((data, index) => {
      const x = padding + (index * chartWidth / (customerData.length - 1));
      const y = height - padding - (data.value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    customerData.forEach((data, index) => {
      const x = padding + (index * chartWidth / (customerData.length - 1));
      const y = height - padding - (data.value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
    
    // Draw x-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    customerData.forEach((data, index) => {
      if (index % 2 === 0) { // Only show every other month for clarity
        const x = padding + (index * chartWidth / (customerData.length - 1));
        ctx.fillText(data.month, x, height - padding + 20);
      }
    });
    
    // Draw y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = Math.round(maxValue / steps * i);
      const y = height - padding - (value / maxValue) * chartHeight;
      ctx.fillText(value, padding - 10, y + 5);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Handle sidebar menu clicks
    document.addEventListener('click', function(e) {
      const menuLink = e.target.closest('.menu-link');
      if (menuLink) {
        e.preventDefault();
        
        const menuItem = menuLink.getAttribute('data-menu');
        
        // Don't do anything if it's already the active menu
        if (menuItem === activeMenu) return;
        
        // Update active state in the menu
        document.querySelectorAll('.menu-link').forEach(link => {
          link.classList.remove('bg-gray-700');
        });
        menuLink.classList.add('bg-gray-700');
        
        // Update active menu and render the appropriate page
        activeMenu = menuItem;
        
        switch (menuItem) {
          case 'dashboard':
            renderDashboardPage();
            break;
          case 'users':
            renderUsersPage();
            break;
          case 'products':
            renderProductsPage();
            break;
          case 'settings':
            renderSettingsPage();
            break;
        }
      }
    });
    
    // Handle settings tab clicks
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('settings-tab') || e.target.closest('.settings-tab')) {
        e.preventDefault();
        
        const tab = e.target.classList.contains('settings-tab') ? e.target : e.target.closest('.settings-tab');
        const tabName = tab.getAttribute('data-tab');
        
        // Update tab styles
        document.querySelectorAll('.settings-tab').forEach(t => {
          t.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
          t.classList.add('border-transparent', 'text-gray-500');
        });
        
        tab.classList.add('active', 'border-indigo-500', 'text-indigo-600');
        tab.classList.remove('border-transparent', 'text-gray-500');
        
        // Show selected tab content, hide others
        document.querySelectorAll('.settings-content').forEach(content => {
          content.classList.add('hidden');
        });
        
        document.getElementById(tabName + '-tab').classList.remove('hidden');
      }
    });
  }

  // Initialize the application
  init();
});
`;
  } else {
    // Generic template for other project types
    template = `
// ${projectType} application: ${projectName}
// Description: ${description || "A web application"}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  function init() {
    renderHeader();
    renderMain();
    renderFooter();
    setupEventListeners();
  }

  // Render the header
  function renderHeader() {
    const appElement = document.getElementById('app');
    const header = document.createElement('header');
    header.className = 'header shadow-md';
    header.innerHTML = \`
      <div class="container mx-auto px-4 py-4">
        <nav class="flex justify-between items-center">
          <a href="#" class="text-xl font-bold text-white">${projectName}</a>
          <ul class="hidden md:flex space-x-6">
            <li><a href="#" class="text-white hover:text-gray-200">Home</a></li>
            <li><a href="#" class="text-white hover:text-gray-200">Features</a></li>
            <li><a href="#" class="text-white hover:text-gray-200">About</a></li>
            <li><a href="#" class="text-white hover:text-gray-200">Contact</a></li>
          </ul>
          <button id="mobile-menu-button" class="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
      </div>
    \`;
    appElement.appendChild(header);

    // Mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'hidden md:hidden bg-gray-800 text-white';
    mobileMenu.innerHTML = \`
      <div class="container mx-auto px-4 py-2">
        <ul class="space-y-2">
          <li><a href="#" class="block py-2">Home</a></li>
          <li><a href="#" class="block py-2">Features</a></li>
          <li><a href="#" class="block py-2">About</a></li>
          <li><a href="#" class="block py-2">Contact</a></li>
        </ul>
      </div>
    \`;
    appElement.appendChild(mobileMenu);
  }

  // Render the main content
  function renderMain() {
    const appElement = document.getElementById('app');
    const main = document.createElement('main');
    
    // Hero section
    const hero = document.createElement('section');
    hero.className = 'bg-gray-100 py-16';
    hero.innerHTML = \`
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4">Welcome to ${projectName}</h1>
            <p class="text-xl mb-6">${description || "A modern web application"}</p>
            <button class="btn-primary mr-4">Get Started</button>
            <button class="border border-gray-300 px-4 py-2 rounded">Learn More</button>
          </div>
          <div class="md:w-1/2">
            <img src="https://via.placeholder.com/600x400" alt="Hero" class="rounded-lg shadow-lg w-full">
          </div>
        </div>
      </div>
    \`;
    
    // Features section
    const features = document.createElement('section');
    features.className = 'py-16';
    features.innerHTML = \`
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Feature 1</h3>
            <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Feature 2</h3>
            <p class="text-gray-600">Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Feature 3</h3>
            <p class="text-gray-600">Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.</p>
          </div>
        </div>
      </div>
    \`;
    
    // About section
    const about = document.createElement('section');
    about.className = 'py-16 bg-gray-100';
    about.innerHTML = \`
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <img src="https://via.placeholder.com/600x400" alt="About Us" class="rounded-lg shadow-lg w-full">
          </div>
          <div class="md:w-1/2 md:pl-12">
            <h2 class="text-3xl font-bold mb-6">About ${projectName}</h2>
            <p class="text-lg text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, 
              nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.
            </p>
            <p class="text-lg text-gray-600 mb-4">
              Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget 
              ultricies ultricies. Nullam auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc.
            </p>
            <button class="btn-primary">Learn More</button>
          </div>
        </div>
      </div>
    \`;
    
    // Contact section
    const contact = document.createElement('section');
    contact.className = 'py-16';
    contact.innerHTML = \`
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">Contact Us</h2>
        <div class="max-w-3xl mx-auto">
          <form id="contact-form" class="bg-white rounded-lg shadow-md p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" class="w-full p-2 border rounded">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" class="w-full p-2 border rounded">
              </div>
              <div class="md:col-span-2">
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" id="subject" class="w-full p-2 border rounded">
              </div>
              <div class="md:col-span-2">
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows="4" class="w-full p-2 border rounded"></textarea>
              </div>
            </div>
            <button type="submit" class="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    \`;
    
    // Append all sections to main
    main.appendChild(hero);
    main.appendChild(features);
    main.appendChild(about);
    main.appendChild(contact);
    
    // Append main to app
    appElement.appendChild(main);
  }

  // Render the footer
  function renderFooter() {
    const appElement = document.getElementById('app');
    const footer = document.createElement('footer');
    footer.className = 'bg-gray-800 text-white py-8';
    
    footer.innerHTML = \`
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="mb-6 md:mb-0">
            <h3 class="text-xl font-bold mb-4">${projectName}</h3>
            <p class="text-gray-400 max-w-xs">
              ${description || "A modern web application designed to make your life easier."}
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 class="text-lg font-semibold mb-4">Links</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Support</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Social</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Facebook</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">LinkedIn</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center">
          <p class="text-gray-400">&copy; ${new Date().getFullYear()} ${projectName}. All rights reserved.</p>
        </div>
      </div>
    \`;
    
    appElement.appendChild(footer);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Toggle mobile menu
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobile-menu');
      mobileMenu.classList.toggle('hidden');
    });
    
    // Handle form submission
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      if (name && email && subject && message) {
        // In a real application, you would send this data to a server
        alert('Thanks for your message! We will get back to you soon.');
        this.reset();
      } else {
        alert('Please fill out all fields');
      }
    });
  }

  // Add stylesheet to fix some styling issues
  const style = document.createElement('style');
  style.textContent = \`
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
    }
    .btn-primary:hover {
      background-color: var(--secondary-color);
    }
    .header {
      background-color: var(--primary-color);
    }
    a {
      text-decoration: none;
    }
  \`;
  document.head.appendChild(style);

  // Initialize the application
  init();
});
`;
  }
  
  return template;
};

// Helper function to get a preview image based on project type
function getPreviewImageForType(projectType: string, themeColor?: string): string {
  const type = projectType.toLowerCase();
  
  if (type.includes('dashboard')) return "../../public/template-icons/dashboard.png";
  if (type.includes('ecommerce') || type.includes('shop')) return "../../public/template-icons/ecommerce.jpg";
  if (type.includes('portfolio')) return "../../public/template-icons/portfolio.png";
  if (type.includes('blog')) return "../../public/template-icons/blog.png";
  if (type.includes('saas')) return "../../public/template-icons/saas.jpeg";
  if (type.includes('mobile')) return "../../public/template-icons/mobileapp.png";
  if (type.includes('landing')) return "../../public/template-icons/landingpage.png";
  if (type.includes('admin')) return "../../public/template-icons/admindashboard.png";
  
  // Default image
  return "../../public/template-icons/dashboard.png";
}

// Simulate downloading the project
export const downloadProject = async (project: GeneratedProject): Promise<string> => {
  if (project.downloadUrl) {
    return project.downloadUrl;
  }
  
  const zipBlob = await createZipFile(project);
  return URL.createObjectURL(zipBlob);
};

