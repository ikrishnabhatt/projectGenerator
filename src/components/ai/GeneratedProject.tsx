import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Download, Check } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TechStack } from "@/services/grokService";
import PreviewContainer from "./PreviewContainer";

interface GeneratedProjectProps {
  project: {
    html?: Record<string, string>;
    css?: string;
    js?: string;
    react?: Record<string, string>;
    vue?: Record<string, string>;
    backend?: string;
    database?: string;
    firebase?: string;
    tailwind?: string;
  };
  techStack?: TechStack;
  projectName?: string;
}

const GeneratedProject: React.FC<GeneratedProjectProps> = ({ 
  project, 
  techStack = "react-tailwind-node-mongo",
  projectName = "Generated Project"
}) => {
  const [copying, setCopying] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(selectInitialTab());
  const [activePage, setActivePage] = useState<string>("/");

  // Select the initial active tab based on tech stack
  function selectInitialTab(): string {
    if (techStack.includes("react") && project.react) {
      return "react";
    }
    if (techStack.includes("vue") && project.vue) {
      return "vue";
    }
    if (project.html) {
      return "html";
    }
    if (project.css) {
      return "css";
    }
    if (project.js) {
      return "javascript";
    }
    return "html";
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(section);
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadAsZip = async () => {
    try {
      const zip = new JSZip();

      // Handle HTML files
      if (project.html) {
        Object.entries(project.html).forEach(([path, content]) => {
          const fileName = path === '/' ? 'index.html' : `${path.replace(/^\//, '')}.html`;
          zip.file(fileName, content);
        });
      }

      if (project.css) {
        zip.file("css/styles.css", project.css);
      }

      if (project.js) {
        zip.file("js/script.js", project.js);
      }

      // Handle React files
      if (project.react) {
        const reactFolder = "src";
        if (typeof project.react === 'string') {
          zip.file(`${reactFolder}/App.jsx`, project.react);
        } else {
          // Create components folder
          Object.entries(project.react).forEach(([path, content]) => {
            const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
            zip.file(`${reactFolder}/pages/${componentName}.jsx`, content);
          });
          
          // Create App.jsx with React Router
          const appJsx = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
${Object.keys(project.react).map(path => {
  const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
  return `import ${componentName} from './pages/${componentName}';`;
}).join('\n')}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          ${Object.keys(project.react).map(path => {
            const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
            return `<Route path="${path}" element={<${componentName} />} />`;
          }).join('\n          ')}
        </Routes>
      </div>
    </Router>
  );
}

export default App;`;
          zip.file(`${reactFolder}/App.jsx`, appJsx);
        }

        const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script src="./src/index.js"></script>
</body>
</html>`;
        zip.file("public/index.html", indexHtml);

        const indexJs = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
${project.css ? "import './styles.css';" : ""}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
        zip.file(`${reactFolder}/index.js`, indexJs);
        
        if (project.css) {
          zip.file(`${reactFolder}/styles.css`, project.css);
        }
        
        // Add package.json with dependencies
        const packageJson = `{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "react-scripts": "5.0.1"${techStack.includes("tailwind") ? ',\n    "tailwindcss": "^3.3.5"' : ''}
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`;
        zip.file("package.json", packageJson);
      }

      // Handle Vue files
      if (project.vue) {
        const vueFolder = "src";
        
        if (typeof project.vue === 'string') {
          zip.file(`${vueFolder}/App.vue`, project.vue);
        } else {
          // Create components folder for Vue
          Object.entries(project.vue).forEach(([path, content]) => {
            const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
            zip.file(`${vueFolder}/pages/${componentName}.vue`, content);
          });
          
          // Create App.vue with Vue Router
          const appVue = `
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
${project.css || '/* Your global styles go here */'}
</style>`;
          zip.file(`${vueFolder}/App.vue`, appVue);
          
          // Create router.js
          const routerJs = `
import Vue from 'vue'
import VueRouter from 'vue-router'
${Object.keys(project.vue).map(path => {
  const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
  return `import ${componentName} from './pages/${componentName}.vue'`;
}).join('\n')}

Vue.use(VueRouter)

const routes = [
  ${Object.keys(project.vue).map(path => {
    const componentName = path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '-');
    return `{
    path: '${path}',
    name: '${componentName}',
    component: ${componentName}
  }`;
  }).join(',\n  ')}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router`;
          zip.file(`${vueFolder}/router.js`, routerJs);
        }

        const mainJs = `
import Vue from 'vue'
import App from './App.vue'
${Object.keys(project.vue || {}).length > 1 ? "import router from './router'" : ""}

Vue.config.productionTip = false

new Vue({
  ${Object.keys(project.vue || {}).length > 1 ? "router," : ""}
  render: h => h(App)
}).$mount('#app')`;
        zip.file(`${vueFolder}/main.js`, mainJs);
        
        const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
</head>
<body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
</body>
</html>`;
        zip.file("public/index.html", indexHtml);
        
        // Add package.json with dependencies for Vue
        const packageJsonVue = `{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.29.0",
    "vue": "^3.2.47"${Object.keys(project.vue || {}).length > 1 ? ',\n    "vue-router": "^4.1.6"' : ''}${techStack.includes("tailwind") ? ',\n    "tailwindcss": "^3.3.5"' : ''}
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~5.0.8",
    "@vue/cli-plugin-eslint": "~5.0.8",
    "@vue/cli-service": "~5.0.8",
    "eslint": "^8.35.0",
    "eslint-plugin-vue": "^9.9.0"
  }
}`;
        zip.file("package.json", packageJsonVue);
      }

      if (project.tailwind) {
        zip.file("tailwind.config.js", project.tailwind);
      }

      if (project.backend) {
        zip.file("backend/server.js", project.backend);
        
        // Add backend package.json if Node.js is in the tech stack
        if (techStack.includes("node")) {
          const backendPackageJson = `{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}-backend",
  "version": "1.0.0",
  "description": "Backend server for ${projectName}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"${techStack.includes("mongo") ? ',\n    "mongoose": "^7.2.0"' : ''}${techStack.includes("postgres") ? ',\n    "pg": "^8.10.0"' : ''}
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}`;
          zip.file("backend/package.json", backendPackageJson);
        }
      }

      if (project.database) {
        if (techStack.includes("mongo")) {
          zip.file("database/models.js", project.database);
        } else if (techStack.includes("postgres") || techStack.includes("mysql")) {
          zip.file("database/schema.sql", project.database);
        }
      }

      if (project.firebase) {
        zip.file("firebase/firebase.js", project.firebase);
      }

      const readme = `# ${projectName}

## Getting Started

${techStack.includes("react") ? `
### React Application
1. Navigate to the project directory
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm start\` 
4. Open your browser at http://localhost:3000
` : techStack.includes("vue") ? `
### Vue Application
1. Navigate to the project directory
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run serve\` 
4. Open your browser at http://localhost:8080
` : `
### HTML/CSS/JS
1. Extract all files
2. Open index.html in a browser or set up a local server
`}

${project.backend ? `
### Backend Server
1. Navigate to the backend directory
2. Install dependencies: \`npm install\`
3. Start the server: \`npm start\` or \`npm run dev\` for development
4. The API will be available at http://localhost:3000/api
` : ""}

## Project Structure
${techStack.includes("react") ? `
- \`public/\`: Static files
- \`src/\`: React source files${Object.keys(project.react || {}).length > 1 ? '\n  - `pages/`: React components for each page/route' : ''}
- \`src/App.jsx\`: Main React component${project.css ? '\n- `src/styles.css`: Global styles' : ''}
` : techStack.includes("vue") ? `
- \`public/\`: Static files
- \`src/\`: Vue source files${Object.keys(project.vue || {}).length > 1 ? '\n  - `pages/`: Vue components for each page/route\n  - `router.js`: Vue Router configuration' : ''}
- \`src/App.vue\`: Main Vue component
` : `
- \`index.html\`: Main HTML file
- \`css/\`: CSS styles
- \`js/\`: JavaScript files
`}
${project.backend ? `- \`backend/\`: Node.js server files\n` : ""}${project.database ? `- \`database/\`: Database ${techStack.includes("mongo") ? "models" : "schema"}\n` : ""}${project.firebase ? `- \`firebase/\`: Firebase configuration\n` : ""}

## Technologies Used
${techStack.includes("react") ? "- React\n" : ""}${techStack.includes("vue") ? "- Vue.js\n" : ""}${techStack.includes("tailwind") ? "- Tailwind CSS\n" : ""}${project.html ? "- HTML5\n" : ""}${project.css ? "- CSS3\n" : ""}${project.js ? "- JavaScript\n" : ""}${techStack.includes("node") ? "- Node.js Backend\n" : ""}${techStack.includes("mongo") ? "- MongoDB\n" : ""}${techStack.includes("postgres") ? "- PostgreSQL\n" : ""}${techStack.includes("mysql") ? "- MySQL\n" : ""}${project.firebase ? "- Firebase\n" : ""}
`;

      zip.file("README.md", readme);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`);
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to create zip file. Please try again.");
    }
  };

  // Create navigation tabs based on available content and tech stack
  const getTechTabs = () => {
    const tabs = [];
    
    // Frontend tabs
    if (techStack.includes("react") && project.react) {
      tabs.push({ id: "react", label: "React" });
    }
    
    if (techStack.includes("vue") && project.vue) {
      tabs.push({ id: "vue", label: "Vue" });
    }
    
    // Always show HTML/CSS/JS if available
    if (project.html && Object.keys(project.html).length > 0) {
      tabs.push({ id: "html", label: "HTML" });
    }
    
    if (project.css) tabs.push({ id: "css", label: "CSS" });
    if (project.js) tabs.push({ id: "javascript", label: "JavaScript" });
    
    // Backend tabs
    if (project.backend) tabs.push({ id: "backend", label: "Backend" });
    if (project.database) tabs.push({ id: "database", label: "Database" });
    if (project.firebase) tabs.push({ id: "firebase", label: "Firebase" });
    if (project.tailwind && typeof project.tailwind === 'string') tabs.push({ id: "tailwind", label: "Tailwind Config" });
    
    return tabs;
  };

  // Get pages for secondary navigation based on active tab
  const getPages = () => {
    if (activeTab === "html" && project.html) {
      return Object.keys(project.html).map(path => ({
        id: path,
        label: path === "/" ? "home" : path.replace(/^\//, '')
      }));
    } 
    else if (activeTab === "react" && project.react && typeof project.react !== 'string') {
      return Object.keys(project.react).map(path => ({
        id: path,
        label: path === "/" ? "home" : path.replace(/^\//, '')
      }));
    }
    else if (activeTab === "vue" && project.vue && typeof project.vue !== 'string') {
      return Object.keys(project.vue).map(path => ({
        id: path,
        label: path === "/" ? "home" : path.replace(/^\//, '')
      }));
    }
    return [];
  };

  const techTabs = getTechTabs();
  const pages = getPages();

  // Check if we can preview the project
  const canPreview = !!(
    (project.html && Object.keys(project.html).length > 0) || 
    (project.react && Object.keys(project.react).length > 0) ||
    (project.vue && Object.keys(project.vue).length > 0)
  );

  // Get content based on selected tab
  const getTabContent = (tab: string, page: string = "/") => {
    if (tab === "html" && project.html) {
      return project.html[page] || Object.values(project.html)[0] || "";
    } 
    else if (tab === "react" && project.react) {
      if (typeof project.react === 'string') {
        return project.react;
      }
      return project.react[page] || Object.values(project.react)[0] || "";
    }
    else if (tab === "vue" && project.vue) {
      if (typeof project.vue === 'string') {
        return project.vue;
      }
      return project.vue[page] || Object.values(project.vue)[0] || "";
    }
    else if (tab === "css") {
      return project.css || "";
    } 
    else if (tab === "javascript") {
      return project.js || "";
    } 
    else if (tab === "backend") {
      return project.backend || "";
    } 
    else if (tab === "database") {
      return project.database || "";
    }
    else if (tab === "firebase") {
      return project.firebase || "";
    }
    else if (tab === "tailwind") {
      return project.tailwind || "";
    }
    return "";
  };

  // Switch primary tab
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Reset page when switching tabs
    setActivePage("/");
  };

  // Switch page in secondary navigation
  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-card shadow-sm">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Generated Project <span className="text-sm text-muted-foreground ml-2">({techStack})</span></h2>
          <div className="flex gap-2">
            {canPreview && (
              <Button 
                onClick={() => setShowPreview(true)}
                className="w-full"
                variant="outline"
                size="sm"
              >
                <Eye className="mr-2 h-4 w-4" />
                Show Preview
              </Button>
            )}
            <Button 
              onClick={downloadAsZip}
              variant="default"
              size="sm"
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {showPreview ? (
          <PreviewContainer 
            project={project} 
            techStack={techStack} 
            onClose={() => setShowPreview(false)} 
          />
        ) : (
          <div>
            {/* Primary tabs - React, Vue, HTML, CSS, JavaScript, etc. */}
            <div className="bg-muted/20 p-2 border-b">
              {techTabs.map(tab => (
                <Button 
                  key={tab.id}
                  variant={tab.id === activeTab ? "secondary" : "ghost"}
                  size="sm"
                  className="mr-1"
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            
            {/* Secondary tabs - for pages (only shown when a tab with pages is active) */}
            {pages.length > 1 && (
              <div className="bg-background p-2 border-b">
                {pages.map(page => (
                  <Button 
                    key={page.id}
                    variant={page.id === activePage ? "secondary" : "ghost"}
                    size="sm"
                    className="mr-1 text-sm"
                    onClick={() => handlePageClick(page.id)}
                  >
                    {page.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Code display area */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => copyToClipboard(getTabContent(activeTab, activePage), activeTab)}
              >
                {copying === activeTab ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <pre className="bg-muted/10 p-4 pt-12 rounded-md overflow-auto max-h-96 text-sm font-mono whitespace-pre-wrap">
                {getTabContent(activeTab, activePage)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedProject;