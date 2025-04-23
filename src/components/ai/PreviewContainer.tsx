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
    vue?: string;
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

  const pageUrls = project.html ? Object.keys(project.html) : [];
  
  useEffect(() => {
    // Simulate loading time for smoother transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  // Generate HTML content for preview
  const generatePreviewHTML = () => {
    if (!project.html || Object.keys(project.html).length === 0) {
      return `<html><body><h1>No HTML content available for preview</h1></body></html>`;
    }

    // Get current page HTML or fallback to first available page
    const currentPageContent = project.html[currentPage] || project.html[Object.keys(project.html)[0]];

    if (!currentPageContent) {
      return `<html><body><h1>No content available for this page</h1></body></html>`;
    }

    // Process the HTML to make links work within the preview
    let html = currentPageContent;

    // Add page routing functionality by intercepting all internal links
    const navigationScript = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Intercept all link clicks for navigation within the preview
          document.body.addEventListener('click', function(e) {
            // Find the closest anchor element
            let target = e.target;
            while (target && target !== document && target.tagName !== 'A') {
              target = target.parentNode;
            }
            
            if (target && target.tagName === 'A' && target.href) {
              const url = new URL(target.href);
              
              // Only handle internal links (same origin)
              if (url.origin === window.location.origin) {
                e.preventDefault();
                
                // Extract pathname or use '/' for empty paths
                const path = url.pathname || '/';
                
                // Send message to parent frame for navigation
                window.parent.postMessage({ type: 'navigate', path: path }, '*');
              }
            }
          });

          // Add event listeners to any buttons with data-nav attributes
          document.querySelectorAll('[data-nav]').forEach(element => {
            element.addEventListener('click', function(e) {
              const path = this.getAttribute('data-nav');
              if (path) {
                e.preventDefault();
                window.parent.postMessage({ type: 'navigate', path: path }, '*');
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
  };

  // Handle navigation between pages in the preview
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'navigate') {
      const path = event.data.path;
      if (project.html && project.html[path]) {
        setCurrentPage(path);
      } else {
        // Find the closest matching path (helpful for trailing slashes or slight differences)
        const availablePaths = Object.keys(project.html || {});
        
        // Try to match paths with or without trailing slashes
        let matchingPath = availablePaths.find(p => 
          path.replace(/\/$/, '') === p.replace(/\/$/, '')
        );
        
        // If not found, try to match by path segments
        if (!matchingPath) {
          const pathSegments = path.split('/').filter(Boolean);
          matchingPath = availablePaths.find(p => {
            const pSegments = p.split('/').filter(Boolean);
            return pathSegments.length > 0 && pSegments.length > 0 && 
                  (pathSegments[0] === pSegments[0] || p.includes(pathSegments[0]));
          });
        }
        
        if (matchingPath) {
          setCurrentPage(matchingPath);
        } else {
          // Fallback to home page with error message
          setCurrentPage('/');
          setError(`Page not found: ${path}. Redirected to home page.`);
          setTimeout(() => setError(null), 3000);
        }
      }
    }
  };

  useEffect(() => {
    // Add event listener for messages from the iframe
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [project.html]);

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
    if (project.html && project.html[path]) {
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
                This is a simplified preview. For full functionality, download the project ZIP file.
                {pageUrls.length > 1 && " Click on links to navigate between pages."}
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
              <p className="text-muted-foreground">Loading preview...</p>
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