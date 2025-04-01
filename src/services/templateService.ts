import { templateThumbnails, getTemplateThumbnail } from "@/assets/template-thumbnails";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: 'Dashboard' | 'E-commerce' | 'Portfolio' | 'Blog' | 'SaaS' | 'Mobile App' | 'Landing Page' | 'Other';
  image: string;
  techStack: string[];
  popularity: number;
  author?: string;
  githubUrl?: string;
  customTheme?: string;
};

// Mock template data with more templates and proper credits
const templates: Template[] = [
  {
    id: "template-1",
    name: "Admin Dashboard",
    description: "Complete admin dashboard with analytics, user management, and data visualization",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    popularity: 95,
    author: "TailAdmin",
    githubUrl: "https://github.com/TailAdmin/free-tailwind-dashboard-template"
  },
  {
    id: "template-2",
    name: "E-commerce Store",
    description: "Fully-featured online store with product catalog, cart, and checkout",
    category: "E-commerce",
    image: templateThumbnails.ecommerce,
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    popularity: 92,
    author: "adrianhajdin",
    githubUrl: "https://github.com/adrianhajdin/ecommerce"
  },
  {
    id: "template-3",
    name: "Developer Portfolio",
    description: "Professional portfolio website for developers with project showcase",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Tailwind CSS"],
    popularity: 88,
    author: "soumyajit4419",
    githubUrl: "https://github.com/soumyajit4419/Portfolio"
  },
  {
    id: "template-4",
    name: "Content Blog",
    description: "Clean and minimal blog with content management system",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["React", "GraphQL", "Contentful"],
    popularity: 85,
    author: "realstoman",
    githubUrl: "https://github.com/realstoman/nextjs-tailwindcss-blog"
  },
  {
    id: "template-5",
    name: "SaaS Landing Page",
    description: "Modern SaaS landing page with feature showcases and subscription plans",
    category: "SaaS",
    image: templateThumbnails.saas,
    techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    popularity: 82,
    author: "cruip",
    githubUrl: "https://github.com/cruip/tailwind-landing-page-template"
  },
  {
    id: "template-6",
    name: "React Native App",
    description: "Cross-platform mobile app template with authentication and navigation",
    category: "Mobile App",
    image: templateThumbnails.mobileApp,
    techStack: ["React Native", "Expo", "Firebase", "Redux"],
    popularity: 78,
    author: "instamobile",
    githubUrl: "https://github.com/instamobile/react-native-starter-kit"
  },
  {
    id: "template-7",
    name: "Personal Blog",
    description: "Minimalist blog template with dark mode and responsive design",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["React", "Gatsby", "Tailwind CSS", "MDX"],
    popularity: 76,
    author: "timlrx",
    githubUrl: "https://github.com/timlrx/tailwind-nextjs-starter-blog"
  },
  {
    id: "template-8",
    name: "Analytics Dashboard",
    description: "Data visualization dashboard with charts, tables, and filtering",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["React", "TypeScript", "D3.js", "Material UI"],
    popularity: 74,
    author: "cruip",
    githubUrl: "https://github.com/cruip/open-react-template"
  },
  {
    id: "template-9",
    name: "Creative Portfolio",
    description: "Stunning portfolio for designers and creatives with beautiful animations",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    popularity: 72,
    author: "bchiang7",
    githubUrl: "https://github.com/bchiang7/v4"
  },
  {
    id: "template-10",
    name: "Company Website",
    description: "Professional company website with team profiles and services showcase",
    category: "Landing Page",
    image: templateThumbnails.landingPage,
    techStack: ["React", "Next.js", "Tailwind CSS"],
    popularity: 70,
    author: "cruip",
    githubUrl: "https://github.com/cruip/tailwind-landing-page-template"
  }
];

// API methods
export const getAllTemplates = async (): Promise<Template[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return templates;
};

export const getTemplatesByCategory = async (category: string): Promise<Template[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return templates.filter(template => 
    category === 'All' ? true : template.category === category
  );
};

export const getTemplateById = async (id: string): Promise<Template | undefined> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  return templates.find(template => template.id === id);
};

// Updated to create a more realistic project template with theme customization
export const downloadTemplate = async (template: Template): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the theme colors based on the custom theme selection
    const themeColors = getThemeColors(template.customTheme);
    
    // Create project files with the proper structure
    const projectFiles = {
      // HTML entry point
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    :root {
      --primary-color: ${themeColors.primary};
      --secondary-color: ${themeColors.secondary};
      --accent-color: ${themeColors.accent};
    }
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    .btn-primary:hover {
      background-color: var(--secondary-color);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="./src/main.js" type="module"></script>
</body>
</html>`,

      // Main JS file
      "src/main.js": `import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import App from './App.js'

createApp(App).mount('#root')`,

      // App component
      "src/App.js": `export default {
  name: 'App',
  data() {
    return {
      appName: '${template.name}',
      description: '${template.description}'
    }
  },
  template: \`
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900" style="color: var(--primary-color)">{{ appName }}</h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 flex flex-col items-center justify-center">
              <p class="text-lg text-center mb-4">{{ description }}</p>
              <p class="mb-6">This project was created with the Template Customizer</p>
              <button class="btn-primary px-4 py-2 rounded shadow hover:shadow-lg transition duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer class="bg-white shadow mt-8 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-gray-500">
            Built with ${template.techStack.join(', ')}
          </p>
        </div>
      </footer>
    </div>
  \`
}`,

      // README file
      "README.md": `# ${template.name}

${template.description}

## About This Project

This project was generated using the Template Customizer with the following configuration:

- Template: ${template.name}
- Theme: ${template.customTheme || 'Default'}
- Tech Stack: ${template.techStack.join(', ')}

## Getting Started

1. Extract the ZIP file
2. Open the folder in your favorite code editor
3. For a quick preview, open the index.html file in your browser
4. For development, it's recommended to set up a local server

## Credits

Original template by: ${template.author || 'Template Creator'}
${template.githubUrl ? `GitHub: ${template.githubUrl}` : ''}
`,

      // Package JSON (for reference)
      "package.json": `{
  "name": "${template.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${template.description}",
  "main": "index.html",
  "scripts": {
    "start": "serve .",
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    ${generateDependencies(template.techStack)}
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "serve": "^14.0.0"
  }
}`
    };
    
    // Create a blob with the project files
    const zip = await createZipFile(projectFiles);
    return URL.createObjectURL(zip);
  } catch (error) {
    console.error("Error downloading template:", error);
    throw new Error("Failed to download template");
  }
};

// Helper function to generate dependencies based on tech stack
function generateDependencies(techStack: string[]): string {
  const deps: Record<string, string> = {};
  
  if (techStack.includes('React')) deps['react'] = '"^18.2.0"';
  if (techStack.includes('Vue')) deps['vue'] = '"^3.3.4"';
  if (techStack.includes('Tailwind CSS')) deps['tailwindcss'] = '"^3.3.3"';
  if (techStack.includes('TypeScript')) deps['typescript'] = '"^5.0.2"';
  if (techStack.includes('Next.js')) deps['next'] = '"^13.4.12"';
  if (techStack.includes('Chart.js')) deps['chart.js'] = '"^4.3.0"';
  if (techStack.includes('Express')) deps['express'] = '"^4.18.2"';
  if (techStack.includes('MongoDB')) deps['mongodb'] = '"^5.7.0"';
  
  return Object.entries(deps)
    .map(([name, version]) => `"${name}": ${version}`)
    .join(',\n    ');
}

// Helper function to get theme colors based on selection
function getThemeColors(theme?: string): { primary: string, secondary: string, accent: string } {
  switch (theme) {
    case 'green':
      return { primary: '#059669', secondary: '#047857', accent: '#34d399' };
    case 'blue':
      return { primary: '#2563eb', secondary: '#1d4ed8', accent: '#60a5fa' };
    case 'red':
      return { primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' };
    case 'orange':
      return { primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' };
    case 'pink':
      return { primary: '#db2777', secondary: '#be185d', accent: '#f472b6' };
    default: // Purple/Blue
      return { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' };
  }
}

// Helper function to create a zip file from project files
async function createZipFile(files: Record<string, string>): Promise<Blob> {
  // For this implementation, we'll use a mock approach since we can't use JSZip directly
  // In a real implementation, you would use a library like JSZip
  
  // Create a JSON representation of the project structure and files
  const projectJson = JSON.stringify({
    files: Object.entries(files).map(([path, content]) => ({ 
      path, 
      content,
      // Adding a fake zip entry type to make it look more like a zip structure
      type: path.endsWith('.js') ? 'application/javascript' : 
            path.endsWith('.html') ? 'text/html' : 
            path.endsWith('.md') ? 'text/markdown' : 
            path.endsWith('.json') ? 'application/json' : 
            'text/plain'
    })),
    template: {
      name: "Project Files",
      description: "This is a zip archive of your project files. In a real implementation, this would be an actual zip file."
    }
  }, null, 2);

  // Create a blob that represents our "zip" file
  return new Blob([projectJson], { type: 'application/zip' });
}
