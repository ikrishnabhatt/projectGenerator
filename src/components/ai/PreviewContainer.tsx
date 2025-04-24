import React, { useState, useEffect, useRef } from "react";
import { Loader2, ExternalLink, X, Info, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TechStack } from "@/services/grokService";

interface PreviewContainerProps {
  project: {
    html?: Record<string, string>;
    css?: string;
    js?: string;
    react?: Record<string, string>;
    vue?: Record<string, string>;
    backend?: string;
    database?: string;
  };
  techStack?: TechStack;
  onClose: () => void;
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({ 
  project, 
  techStack = "react-tailwind-node-mongo",
  onClose 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("/");
  const [showNotice, setShowNotice] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine what content to show based on tech stack
  const isReactStack = techStack.includes("react");
  const isVueStack = techStack.includes("vue");
  
  // Get available pages based on current tech stack
  const getAvailablePages = () => {
    if (isReactStack && project.react) {
      return Object.keys(project.react);
    } else if (isVueStack && project.vue) {
      return Object.keys(project.vue);
    } else if (project.html) {
      return Object.keys(project.html);
    }
    return [];
  };
  
  const pageUrls = getAvailablePages();
  
  useEffect(() => {
    // Simulate loading time for smoother transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  // Generate HTML content for preview based on tech stack
  const generatePreviewHTML = () => {
    // For React projects
    if (isReactStack && project.react) {
      const reactContent = project.react[currentPage] || project.react[Object.keys(project.react)[0]];
      if (!reactContent) {
        return `<html><body><h1>No React content available for preview</h1></body></html>`;
      }
      
      // Create a simplified React preview environment
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Preview - ${currentPage === '/' ? 'Home' : currentPage}</title>
          ${project.css ? `<style>${project.css}</style>` : ''}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.22.5/babel.min.js"></script>
          ${
            techStack.includes("tailwind") ? 
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>' : 
            ''
          }
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            // Navigation helper for React preview
            window.navigateTo = function(path) {
              window.parent.postMessage({ type: 'navigate', path: path }, '*');
            };
            
            // Simplified Link component for React
            function Link({ to, children, className }) {
              return (
                <a 
                  href={to} 
                  className={className} 
                  onClick={(e) => {
                    e.preventDefault();
                    window.navigateTo(to);
                  }}
                >
                  {children}
                </a>
              );
            }
            
            ${reactContent}
            
            // Ensure there's a default App component
            const AppComponent = typeof App !== 'undefined' ? App : (() => <div>No App component found</div>);
            
            ReactDOM.render(
              <AppComponent />,
              document.getElementById('root')
            );
          </script>
        </body>
        </html>
      `;
    }
    
    // For Vue projects
    else if (isVueStack && project.vue) {
      const vueContent = typeof project.vue === 'string' ? 
        project.vue : 
        project.vue[currentPage] || project.vue[Object.keys(project.vue)[0]];
        
      if (!vueContent) {
        return `<html><body><h1>No Vue content available for preview</h1></body></html>`;
      }
      
      // Create a simplified Vue preview environment
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vue Preview - ${currentPage === '/' ? 'Home' : currentPage}</title>
          ${project.css ? `<style>${project.css}</style>` : ''}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js"></script>
          ${
            techStack.includes("tailwind") ? 
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>' : 
            ''
          }
        </head>
        <body>
          <div id="app"></div>
          <script>
            // Navigation helper for Vue preview
            window.navigateTo = function(path) {
              window.parent.postMessage({ type: 'navigate', path: path }, '*');
            };
            
            ${vueContent}
            
            // Mount Vue app with navigation interceptor
            const app = Vue.createApp({
              template: '<App />',
              components: { App }
            });
            
            app.directive('link', {
              mounted(el, binding) {
                el.addEventListener('click', (e) => {
                  e.preventDefault();
                  window.navigateTo(binding.value);
                });
              }
            });
            
            app.mount('#app');
          </script>
        </body>
        </html>
      `;
    }
    
    // For standard HTML/CSS/JS
    else if (project.html) {
      if (Object.keys(project.html).length === 0) {
        return `<html><body><h1>No HTML content available for preview</h1></body></html>`;
      }

      // Get current page HTML or fallback to first available page
      const currentPageContent = project.html[currentPage] || project.html[Object.keys(project.html)[0]];

      if (!currentPageContent) {
        return `<html><body><h1>No content available for this page</h1></body></html>`;
      }

      // Process the HTML to make links work within the preview
      let html = currentPageContent;

      // Improved navigation script with better link handling
      const navigationScript = `
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Function to handle navigation
            function navigateTo(path) {
              window.parent.postMessage({ type: 'navigate', path: path }, '*');
            }
            
            // Intercept all link clicks for navigation
            document.addEventListener('click', function(e) {
              // Find the closest anchor element
              let target = e.target;
              while (target && target !== document && target.tagName !== 'A') {
                target = target.parentNode;
              }
              
              if (target && target.tagName === 'A' && target.href) {
                const url = new URL(target.href);
                
                // Handle both absolute and relative paths
                if (url.origin === window.location.origin || !url.origin) {
                  e.preventDefault();
                  
                  // Extract pathname or use '/' for empty paths
                  let path = url.pathname || '/';
                  if (!path.startsWith('/')) {
                    path = '/' + path;
                  }
                  
                  // Normalize path
                  path = path.replace(/\\.html$/, '');
                  if (path === '/index') path = '/';
                  
                  navigateTo(path);
                }
              }
            });

            // Handle navigation buttons
            document.querySelectorAll('[data-nav]').forEach(element => {
              element.addEventListener('click', function(e) {
                e.preventDefault();
                const path = this.getAttribute('data-nav');
                if (path) {
                  navigateTo(path);
                }
              });
            });
            
            // Enhance any nav or menu elements
            document.querySelectorAll('nav a, .nav a, .menu a, .navbar a, header a').forEach(link => {
              link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                  e.preventDefault();
                  let path = href;
                  if (!path.startsWith('/')) {
                    path = '/' + path;
                  }
                  navigateTo(path);
                }
              });
            });
          });

          // Handle form submissions by preventing them and showing alert
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submission is simulated in preview mode. Download the project to use full functionality.');
          });
        </script>
      `;

      // Create additional utility functions for preview
      const utilityScript = `
        <script>
          // Simulate API calls for preview
          window.simulateApi = function(endpoint, method = 'GET', data = {}) {
            console.log(\`API \${method} request to \${endpoint}\`, data);
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({ success: true, message: 'This is a simulated API response' });
                alert('API call simulated in preview mode. Real functionality will work when you download and run the project.');
              }, 500);
            });
          }

          // Override fetch in preview
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            console.log('Fetch intercepted:', url);
            return simulateApi(url, options?.method || 'GET', options?.body);
          }
        </script>
      `;

      // Insert CSS into head
      if (project.css) {
        if (html.includes('</head>')) {
          html = html.replace('</head>', `<style>${project.css}</style></head>`);
        } else if (!html.includes('<head>')) {
          html = `<head><style>${project.css}</style></head>${html}`;
        } else {
          // There's a head tag but no closing tag
          html = html.replace('<head>', `<head><style>${project.css}</style>`);
        }
      }

      // Insert JS before end of body
      if (project.js) {
        if (html.includes('</body>')) {
          html = html.replace('</body>', `<script>${project.js}</script>${navigationScript}${utilityScript}</body>`);
        } else {
          html = `${html}<script>${project.js}</script>${navigationScript}${utilityScript}`;
        }
      } else {
        // If no custom JS, still add navigation script
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${navigationScript}${utilityScript}</body>`);
        } else {
          html = `${html}${navigationScript}${utilityScript}`;
        }
      }

      // If it's not a complete HTML document, wrap it
      if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
        html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview - ${currentPage === '/' ? 'Home' : currentPage}</title>
            ${project.css ? `<style>${project.css}</style>` : ''}
            ${
              techStack.includes("tailwind") ? 
              '<script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>' : 
              ''
            }
          </head>
          <body>
            ${html}
            ${project.js ? `<script>${project.js}</script>` : ''}
            ${navigationScript}
            ${utilityScript}
          </body>
          </html>
        `;
      }

      return html;
    }
    
    // Fallback for no content
    return `<html><body><h1>No content available for preview</h1></body></html>`;
  };

  // Handle navigation between pages in the preview
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'navigate') {
      let path = event.data.path;
      
      // Normalize the path
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      // Remove .html extension if present
      path = path.replace(/\.html$/, '');
      
      // Handle '/index' as root
      if (path === '/index') {
        path = '/';
      }
      
      // Collection to check against
      const availablePages = getAvailablePages();
      
      if (availablePages.includes(path)) {
        setCurrentPage(path);
        return;
      }
      
      // Try to match paths with or without trailing slashes
      const normalizedPath = path.replace(/\/$/, '');
      const matchingPath = availablePages.find(p => 
        p.replace(/\/$/, '') === normalizedPath
      );
      
      if (matchingPath) {
        setCurrentPage(matchingPath);
        return;
      }
      
      // Try with added .html
      const htmlPath = path + '.html';
      const htmlMatch = availablePages.find(p => p === htmlPath);
      
      if (htmlMatch) {
        setCurrentPage(htmlMatch);
        return;
      }
      
      // Try to match by segments
      const pathSegments = path.split('/').filter(Boolean);
      const segmentMatch = availablePages.find(p => {
        const pSegments = p.split('/').filter(Boolean);
        return pathSegments.length > 0 && pSegments.length > 0 && 
              (pathSegments[0] === pSegments[0] || p.includes(pathSegments[0]));
      });
      
      if (segmentMatch) {
        setCurrentPage(segmentMatch);
        return;
      }
      
      // Fallback to home page with error message
      setCurrentPage('/');
      setError(`Page not found: ${path}. Redirected to home page.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    // Add event listener for messages from the iframe
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [project]);

  // Effect to update iframe when currentPage changes
  useEffect(() => {
    if (!loading && iframeRef.current) {
      setLoading(true);
      // Small delay to ensure the loading state is visible
      setTimeout(() => {
        if (iframeRef.current) {
          const iframe = iframeRef.current;
          iframe.srcdoc = generatePreviewHTML();
        }
      }, 100);
    }
  }, [currentPage]);

  // Open preview in new tab
  const handleOpenInNewTab = () => {
    const html = generatePreviewHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  // Function to switch to a specific page
  const navigateToPage = (path: string) => {
    const availablePages = getAvailablePages();
    if (availablePages.includes(path)) {
      setCurrentPage(path);
    }
  };

  return (
    <Card className="w-full h-[600px] relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          title="Refresh preview"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenInNewTab}
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          title="Close preview"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {showNotice && (
        <div className="absolute top-4 left-4 right-32 z-10">
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-600 dark:text-blue-400 flex justify-between items-center">
              <span>
                {isReactStack ? "React preview" : isVueStack ? "Vue preview" : "HTML preview"}: This is a simplified preview. 
                For full functionality, download the project ZIP file.
                {pageUrls.length > 1 && " Use navigation or links to switch between pages."}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowNotice(false)}>
                <X className="h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {pageUrls.length > 1 && (
        <div className="absolute top-16 left-4 right-4 z-10 bg-muted/20 border border-muted rounded-md p-2 flex flex-wrap gap-2">
          {pageUrls.map(path => (
            <button
              key={path}
              onClick={() => navigateToPage(path)}
              className={`text-xs px-2 py-1 rounded ${
                currentPage === path 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background hover:bg-accent'
              }`}
            >
              {path === "/" ? "Home" : path.replace(/^\//, '')}
            </button>
          ))}
        </div>
      )}

      <div className="h-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading {isReactStack ? "React" : isVueStack ? "Vue" : "HTML"} preview...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-destructive p-4 text-center">
            <div>
              <p className="mb-2">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>
                Return to preview
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={generatePreviewHTML()}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setLoading(false)}
            key={`${currentPage}-${refreshKey}`}
          />
        )}
      </div>
    </Card>
  );
};

export default PreviewContainer;