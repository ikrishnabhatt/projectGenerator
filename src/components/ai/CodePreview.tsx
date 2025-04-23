import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Download, ExternalLink, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodePreviewProps {
  project: {
    html?: Record<string, string> | string;
    css?: string;
    javascript?: string;
    database?: string;
    backend?: string;
    js?: string;
  };
  projectName?: string;
  onDownload?: () => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({ 
  project, 
  projectName = "Generated Project",
  onDownload 
}) => {
  const [activeTab, setActiveTab] = useState<string>(getInitialActiveTab());
  const [copying, setCopying] = useState<Record<string, boolean>>({});
  const [activePreview, setActivePreview] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>("/");

  function getInitialActiveTab(): string {
    if (typeof project.html === "object" && Object.keys(project.html).length > 0) {
      return Object.keys(project.html)[0];
    } else if (project.html) {
      return "html";
    } else if (project.css) {
      return "css";
    } else if (project.javascript || project.js) {
      return "javascript";
    } else if (project.database) {
      return "database";
    } else if (project.backend) {
      return "backend";
    }
    return "html";
  }

  // Normalize project structure
  const normalizedProject = {
    html: typeof project.html === "string" ? { "/": project.html } : project.html || {},
    css: project.css || "",
    javascript: project.javascript || project.js || "",
    database: project.database || "",
    backend: project.backend || ""
  };

  // Get available tabs based on code content
  const htmlTabs = Object.keys(normalizedProject.html).map(path => ({
    id: path,
    label: path === "/" ? "Home" : path.replace(/^\//, ""),
    content: normalizedProject.html[path]
  }));

  const otherTabs = [
    { id: "css", label: "CSS", content: normalizedProject.css },
    { id: "javascript", label: "JavaScript", content: normalizedProject.javascript },
    { id: "database", label: "Database", content: normalizedProject.database },
    { id: "backend", label: "Backend", content: normalizedProject.backend }
  ].filter(tab => tab.content);

  const tabs = [...htmlTabs, ...otherTabs];

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying({ ...copying, [section]: true });
      setTimeout(() => {
        setCopying({ ...copying, [section]: false });
      }, 2000);
      toast({
        title: "Success",
        description: "Code copied to clipboard!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const handlePreviewToggle = () => {
    setActivePreview(!activePreview);
  };

  // Generate preview HTML
  const generatePreviewHTML = () => {
    // Get current page HTML or fallback to first available page
    const currentPageContent = normalizedProject.html[currentPage] || 
      normalizedProject.html[Object.keys(normalizedProject.html)[0]] || "";

    if (!currentPageContent) {
      return `<html><body><h1>No HTML content available for preview</h1></body></html>`;
    }

    // Process the HTML to make links work within the preview
    let html = currentPageContent;

    // Add page routing functionality by intercepting all internal links
    const navigationScript = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Intercept all link clicks for navigation within the preview
          document.body.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.href) {
              const url = new URL(e.target.href);
              
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
        });
      </script>
    `;

    // Insert CSS into head
    if (normalizedProject.css) {
      if (html.includes('</head>')) {
        html = html.replace('</head>', `<style>${normalizedProject.css}</style></head>`);
      } else {
        html = `<head><style>${normalizedProject.css}</style></head>${html}`;
      }
    }

    // Insert JS before end of body
    const js = normalizedProject.javascript;
    if (js) {
      if (html.includes('</body>')) {
        html = html.replace('</body>', `<script>${js}</script>${navigationScript}</body>`);
      } else {
        html = `${html}<script>${js}</script>${navigationScript}`;
      }
    } else {
      // If no custom JS, still add navigation script
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${navigationScript}</body>`);
      } else {
        html = `${html}${navigationScript}`;
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
          <title>Preview</title>
          ${normalizedProject.css ? `<style>${normalizedProject.css}</style>` : ''}
        </head>
        <body>
          ${html}
          ${js ? `<script>${js}</script>` : ''}
          ${navigationScript}
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
      if (normalizedProject.html[path]) {
        setCurrentPage(path);
      } else {
        // Find the closest matching path (helpful for trailing slashes or slight differences)
        const availablePaths = Object.keys(normalizedProject.html);
        const matchingPath = availablePaths.find(p => 
          path.endsWith(p) || p.endsWith(path) || 
          path.replace(/\/$/, '') === p.replace(/\/$/, '')
        );
        
        if (matchingPath) {
          setCurrentPage(matchingPath);
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
  }, [normalizedProject.html]);

  // Open preview in new tab
  const handleOpenInNewTab = () => {
    const html = generatePreviewHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{projectName}</h2>
        <div className="flex gap-2">
          <Button onClick={handlePreviewToggle} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            {activePreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          {onDownload && (
            <Button onClick={onDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      {activePreview ? (
        <div className="relative">
          <Card className="w-full h-[600px] relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
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
                onClick={handlePreviewToggle}
                title="Close preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {showNotice && (
              <div className="absolute top-4 left-4 right-16 z-10">
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <AlertDescription className="text-sm text-blue-600 dark:text-blue-400 flex justify-between items-center">
                    <span>
                      This is a simplified preview. For full functionality, download the project ZIP file.
                      {Object.keys(normalizedProject.html).length > 1 && " Click on links to navigate between pages."}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setShowNotice(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {Object.keys(normalizedProject.html).length > 1 && currentPage && (
              <div className="absolute top-16 left-4 z-10 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-md p-2">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Current page: {currentPage === "/" ? "Home" : currentPage}
                </p>
              </div>
            )}

            <iframe
              srcDoc={generatePreviewHTML()}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </Card>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="relative">
              <div className="bg-muted p-1 rounded-md">
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(tab.content || "", tab.id)}
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                    {copying[tab.id] && (
                      <span className="absolute -bottom-8 right-0 text-xs bg-black text-white px-2 py-1 rounded">
                        Copied!
                      </span>
                    )}
                  </Button>
                </div>
                <pre className="overflow-x-auto p-4 text-sm">
                  <code>{tab.content}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  );
};

export default CodePreview;