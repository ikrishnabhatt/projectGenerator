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
    vue?: string;
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
  const [activeTab, setActiveTab] = useState<string>("html");
  const [activePage, setActivePage] = useState<string>("/");

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

      // Handle HTML files (now as Record with paths)
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

      // Handle React files (now potentially as Record with paths)
      if (project.react) {
        if (typeof project.react === 'string') {
          zip.file("src/App.jsx", project.react);
        } else {
          Object.entries(project.react).forEach(([path, content]) => {
            const fileName = path === '/' ? 'Home' : path.replace(/^\//, '');
            zip.file(`src/pages/${fileName}.jsx`, content);
          });
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
        zip.file("src/index.js", indexJs);
      }

      if (project.vue) {
        zip.file("src/App.vue", project.vue);

        const mainJs = `
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`;
        zip.file("src/main.js", mainJs);
      }

      if (project.tailwind) {
        zip.file("tailwind.config.js", project.tailwind);
      }

      if (project.backend) {
        zip.file("backend/server.js", project.backend);
      }

      if (project.database) {
        zip.file("database/schema.sql", project.database);
      }

      if (project.firebase) {
        zip.file("firebase/firebase.js", project.firebase);
      }

      const readme = `# ${projectName}

## Getting Started

1. Extract all files
2. Open index.html in a browser or set up a local server

## Project Structure

- \`index.html\`: Main HTML file
- \`css/\`: CSS styles
- \`js/\`: JavaScript files
${project.react ? "- \`src/\`: React source files\n" : ""}${project.vue ? "- \`src/\`: Vue source files\n" : ""}

## Technologies Used
${project.react ? "- React\n" : ""}${project.vue ? "- Vue.js\n" : ""}${project.tailwind ? "- Tailwind CSS\n" : ""}${project.html ? "- HTML5\n" : ""}${project.css ? "- CSS3\n" : ""}${project.js ? "- JavaScript\n" : ""}${project.backend ? "- Node.js Backend\n" : ""}${project.database ? "- SQL/Database\n" : ""}${project.firebase ? "- Firebase\n" : ""}
`;

      zip.file("README.md", readme);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`);
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to create zip file. Please try again.");
    }
  };

  // Create navigation tabs
  const getTechTabs = () => {
    const tabs = [];
    
    if (project.html && Object.keys(project.html).length > 0) {
      tabs.push({ id: "html", label: "HTML" });
    }
    
    if (project.css) tabs.push({ id: "css", label: "CSS" });
    if (project.js) tabs.push({ id: "javascript", label: "JavaScript" });
    if (project.backend) tabs.push({ id: "backend", label: "Backend" });
    if (project.database) tabs.push({ id: "database", label: "Database" });
    
    return tabs;
  };

  // Get HTML pages for secondary navigation
  const getHtmlPages = () => {
    if (!project.html) return [];
    
    return Object.keys(project.html).map(path => ({
      id: path,
      label: path === "/" ? "home" : path.replace(/^\//, '')
    }));
  };

  const techTabs = getTechTabs();
  const htmlPages = getHtmlPages();

  // Check if we can preview the project
  const canPreview = !!(
    (project.html && Object.keys(project.html).length > 0) || 
    project.css || 
    project.js || 
    project.react || 
    project.vue
  );

  // Get content based on selected tab
  const getTabContent = (tab: string, page: string = "/") => {
    if (tab === "html" && project.html) {
      return project.html[page] || Object.values(project.html)[0];
    } else if (tab === "css") {
      return project.css || "";
    } else if (tab === "javascript") {
      return project.js || "";
    } else if (tab === "backend") {
      return project.backend || "";
    } else if (tab === "database") {
      return project.database || "";
    }
    return "";
  };

  // Switch primary tab
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Reset page when switching from HTML to other tabs
    if (tabId !== "html") {
      setActivePage("/");
    }
  };

  // Switch HTML page in secondary navigation
  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-card shadow-sm">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Generated Project</h2>
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
            {/* Primary tabs - HTML, CSS, JavaScript, etc. */}
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
            
            {/* Secondary tabs - for HTML pages (only shown when HTML tab is active) */}
            {activeTab === "html" && htmlPages.length > 1 && (
              <div className="bg-background p-2 border-b">
                {htmlPages.map(page => (
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