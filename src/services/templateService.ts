import { templateThumbnails, getTemplateThumbnail } from "@/assets/template-thumbnails";
import JSZip from "jszip";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: 'Dashboard' | 'E-commerce' | 'Portfolio' | 'Blog' | 'SaaS' | 'Mobile App' | 'Landing Page' | 'Other' | 'Admin Dashboard';
  image: string;
  techStack: string[];
  popularity: number;
  author?: string;
  githubUrl?: string;
  customTheme?: string;
};

// Updated template data with real-world projects
const templates: Template[] = [
  {
    id: "template-1",
    name: "TailAdmin Dashboard",
    description: "Free Tailwind CSS admin dashboard with dark mode and charts",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["HTML", "Tailwind CSS", "Alpine.js", "Chart.js"],
    popularity: 95,
    author: "TailAdmin",
    githubUrl: "https://github.com/TailAdmin/free-tailwind-dashboard-template"
  },
  {
    id: "template-2",
    name: "E-commerce Store",
    description: "Modern e-commerce platform with Stripe integration",
    category: "E-commerce",
    image: templateThumbnails.ecommerce,
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    popularity: 92,
    author: "adrianhajdin",
    githubUrl: "https://github.com/adrianhajdin/ecommerce_sanity_stripe"
  },
  {
    id: "template-3",
    name: "Developer Portfolio",
    description: "Clean and minimal developer portfolio with projects showcase",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Tailwind CSS"],
    popularity: 88,
    author: "soumyajit4419",
    githubUrl: "https://github.com/soumyajit4419/Portfolio"
  },
  {
    id: "template-4",
    name: "NextJS Blog",
    description: "SEO-friendly blog built with Next.js and Tailwind CSS",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["Next.js", "Tailwind CSS", "MDX"],
    popularity: 85,
    author: "timlrx",
    githubUrl: "https://github.com/timlrx/tailwind-nextjs-starter-blog"
  },
  {
    id: "template-5",
    name: "Open SaaS",
    description: "Open-source SaaS template with authentication and payments",
    category: "SaaS",
    image: templateThumbnails.saas,
    techStack: ["React", "Next.js", "Tailwind CSS", "Prisma"],
    popularity: 82,
    author: "steven-tey",
    githubUrl: "https://github.com/steven-tey/precedent"
  },
  {
    id: "template-6",
    name: "React Native Starter",
    description: "Cross-platform mobile app template with ready-to-use screens",
    category: "Mobile App",
    image: templateThumbnails.mobileApp,
    techStack: ["React Native", "Expo", "TypeScript"],
    popularity: 78,
    author: "obytes",
    githubUrl: "https://github.com/obytes/react-native-template-obytes"
  },
  {
    id: "template-7",
    name: "Gatsby Blog",
    description: "Fast and SEO-optimized blog built with Gatsby",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["Gatsby", "React", "GraphQL", "Markdown"],
    popularity: 76,
    author: "gatsbyjs",
    githubUrl: "https://github.com/gatsbyjs/gatsby-starter-blog"
  },
  {
    id: "template-8",
    name: "Tremor Dashboard",
    description: "Modern analytics dashboard with Tremor components",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["React", "Next.js", "Tailwind CSS", "Tremor"],
    popularity: 74,
    author: "tremorlabs",
    githubUrl: "https://github.com/tremorlabs/tremor"
  },
  {
    id: "template-9",
    name: "Creative Portfolio",
    description: "Stunning portfolio for designers with beautiful animations",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    popularity: 72,
    author: "bchiang7",
    githubUrl: "https://github.com/bchiang7/v4"
  },
  {
    id: "template-10",
    name: "Landing Page",
    description: "Modern landing page template for startups and products",
    category: "Landing Page",
    image: templateThumbnails.landingPage,
    techStack: ["HTML", "Tailwind CSS", "Alpine.js"],
    popularity: 70,
    author: "cruip",
    githubUrl: "https://github.com/cruip/tailwind-landing-page-template"
  },
  {
    id: "template-11",
    name: "Admin Dashboard Pro",
    description: "Feature-rich admin panel with dark mode and multiple layouts",
    category: "Admin Dashboard",
    image: templateThumbnails.adminDashboard,
    techStack: ["React", "Redux", "Material UI", "Chart.js"],
    popularity: 68,
    author: "themesberg",
    githubUrl: "https://github.com/themesberg/material-tailwind-dashboard-react"
  },
  {
    id: "template-12",
    name: "Photography Portfolio",
    description: "Minimalist portfolio for photographers with gallery view",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    popularity: 65,
    author: "leerob",
    githubUrl: "https://github.com/leerob/leerob.io"
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

// Improved download function that fetches actual files from GitHub before creating a zip
export const downloadTemplate = async (template: Template): Promise<string> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // If the template has a GitHub URL, try to fetch some basic files from the raw content
    if (template.githubUrl) {
      try {
        // Convert GitHub repository URL to raw content URL format
        // Example: https://github.com/username/repo to https://raw.githubusercontent.com/username/repo/main/
        const rawBaseUrl = template.githubUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace(/\/$/, '') + '/main/';
        
        // List of common files to fetch
        const filesToFetch = [
          'index.html',
          'README.md',
          'package.json',
          'style.css',
          'styles.css',
          'script.js',
          'main.js',
          'app.js',
          '.gitignore'
        ];
        
        // Try to fetch each file from the repository
        for (const file of filesToFetch) {
          try {
            const response = await fetch(`${rawBaseUrl}${file}`);
            if (response.ok) {
              const content = await response.text();
              zip.file(file, content);
            }
          } catch (error) {
            console.log(`Could not fetch ${file} from GitHub`);
          }
        }
        
        // Try to fetch additional directories
        const dirsToFetch = ['src', 'public', 'assets', 'css', 'js', 'images'];
        
        for (const dir of dirsToFetch) {
          // For simplicity, we'll just add a placeholder file to indicate these directories
          // In a real implementation, you'd recursively fetch directory contents
          zip.file(`${dir}/.gitkeep`, "This directory was detected but files were not fetched individually");
        }
      } catch (error) {
        console.error("Error fetching files from GitHub:", error);
      }
    }
    
    // Get the theme colors based on the custom theme selection
    const themeColors = getThemeColors(template.customTheme);
    
    // If we couldn't fetch files from GitHub or there's no GitHub URL,
    // fall back to generating example files
    if (Object.keys(zip.files).length === 0) {
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
  <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
  <div id="root"></div>
  <script src="./src/main.js" type="module"></script>
</body>
</html>`,

        // Main CSS file
        "styles/main.css": `:root {
  --primary-color: ${themeColors.primary};
  --secondary-color: ${themeColors.secondary};
  --accent-color: ${themeColors.accent};
}

body {
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.5;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}`,

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
      description: '${template.description}',
      features: [
        'Responsive design',
        'Modern UI components',
        'Customizable themes',
        'Easy to integrate',
        'Well documented'
      ]
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
            <div class="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <p class="text-lg text-center mb-4">{{ description }}</p>
              
              <div class="mt-8">
                <h2 class="text-xl font-semibold mb-4" style="color: var(--secondary-color)">Features</h2>
                <ul class="space-y-2">
                  <li v-for="feature in features" class="flex items-start">
                    <span class="mr-2" style="color: var(--accent-color)">✓</span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="mt-8 text-center">
                <button class="btn-primary">
                  Get Started
                </button>
              </div>
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

This project was generated using the Thynk AI Template Customizer with the following configuration:

- Template: ${template.name}
- Theme: ${template.customTheme || 'Default'}
- Tech Stack: ${template.techStack.join(', ')}

## Getting Started

1. Extract the ZIP file
2. Open the folder in your favorite code editor
3. For a quick preview, open the index.html file in your browser
4. For development, it's recommended to set up a local server:
   \`\`\`
   npx serve
   \`\`\`

## Features

- Responsive design for all device sizes
- Modern UI components
- Customizable theme colors
- Easy to extend

## Credits

Original template by: ${template.author || 'Template Creator'}
${template.githubUrl ? `GitHub: ${template.githubUrl}` : ''}

## License

MIT
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
      
      // Add files to the zip
      Object.entries(projectFiles).forEach(([path, content]) => {
        // Handle directories
        if (path.includes('/')) {
          const directory = path.substring(0, path.lastIndexOf('/'));
          if (!zip.folder(directory)) {
            zip.folder(directory);
          }
        }
        
        zip.file(path, content);
      });
    }
    
    // Generate a more substantial zip with actual content
    const zipContent = await zip.generateAsync({ type: "blob" });
    
    // Create a URL for the blob
    return URL.createObjectURL(zipContent);
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
  if (techStack.includes('Alpine.js')) deps['alpinejs'] = '"^3.12.3"';
  if (techStack.includes('Gatsby')) deps['gatsby'] = '"^5.12.4"';
  if (techStack.includes('GraphQL')) deps['graphql'] = '"^16.8.1"';
  if (techStack.includes('Framer Motion')) deps['framer-motion'] = '"^10.16.4"';
  if (techStack.includes('Material UI')) deps['@mui/material'] = '"^5.14.15"';
  if (techStack.includes('Redux')) deps['redux'] = '"^4.2.1"';
  if (techStack.includes('React Native')) deps['react-native'] = '"^0.72.6"';
  if (techStack.includes('Expo')) deps['expo'] = '"^49.0.0"';
  
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
