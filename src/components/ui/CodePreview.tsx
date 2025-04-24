import React, { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Copy, X, Download } from "lucide-react";
import { useToast } from "./use-toast";

interface CodePreviewProps {
  html?: string;
  css?: string;
  javascript?: string;
  database?: string;
  framework?: string;
  onClose?: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  html = "",
  css = "",
  javascript = "",
  database = "",
  framework = "html-css-js",
  onClose
}) => {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Function to inject scripts for React/Vue
  const injectFrameworkDependencies = () => {
    let dependencies = "";
    if (framework.includes("react")) {
      dependencies = `
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
      `;
    } else if (framework.includes("vue")) {
      dependencies = `
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
      `;
    }
    return dependencies;
  };

  // Combine HTML, CSS, and JavaScript for the preview
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        
        // Create a complete HTML document with the CSS and JS
        const fullHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              ${injectFrameworkDependencies()}
              <style>
                ${css}
                /* Base responsive styles */
                @media (max-width: 768px) {
                  body { font-size: 14px; }
                  .container { width: 100%; padding: 0 1rem; }
                }
              </style>
            </head>
            <body>
              ${html}
              <script ${framework.includes("react") ? 'type="text/babel"' : 'type="text/javascript"'}>
                ${javascript}
              </script>
            </body>
          </html>
        `;
        
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [html, css, javascript, framework]);

  const handleCopyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${type} code has been copied to your clipboard.`
    });
  };

  const handleDownload = () => {
    // Create a zip file with all the code
    const zip = require('jszip')();
    
    // Add files based on the framework
    if (framework.includes("react")) {
      zip.file("index.html", `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script type="text/babel" src="app.js"></script>
  </body>
</html>`);
      zip.file("styles.css", css);
      zip.file("app.js", javascript);
    } else {
      zip.file("index.html", html);
      zip.file("styles.css", css);
      zip.file("script.js", javascript);
    }

    if (database) {
      zip.file("database.sql", database);
    }

    // Generate the zip file
    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-files.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your project files have been downloaded as a zip file."
      });
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`code-preview ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : 'relative'}`}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Code Preview - {framework.toUpperCase()}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <span className="flex items-center gap-1">
                  <X className="h-4 w-4" /> Exit Fullscreen
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Fullscreen
                </span>
              )}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full" style={{ gridTemplateColumns: database ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)' }}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            {database && <TabsTrigger value="database">Database</TabsTrigger>}
          </TabsList>

          <TabsContent value="preview" className="flex-1 p-0 data-[state=active]:flex">
            <iframe
              ref={iframeRef}
              title="Code Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </TabsContent>

          <TabsContent value="html" className="p-0 flex-1 data-[state=active]:flex flex-col">
            <div className="flex items-center justify-end p-2 bg-muted/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(html, "HTML")}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-sm">
              <pre>{html}</pre>
            </div>
          </TabsContent>

          <TabsContent value="css" className="p-0 flex-1 data-[state=active]:flex flex-col">
            <div className="flex items-center justify-end p-2 bg-muted/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(css, "CSS")}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-sm">
              <pre>{css}</pre>
            </div>
          </TabsContent>

          <TabsContent value="javascript" className="p-0 flex-1 data-[state=active]:flex flex-col">
            <div className="flex items-center justify-end p-2 bg-muted/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(javascript, "JavaScript")}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-sm">
              <pre>{javascript}</pre>
            </div>
          </TabsContent>

          {database && (
            <TabsContent value="database" className="p-0 flex-1 data-[state=active]:flex flex-col">
              <div className="flex items-center justify-end p-2 bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(database, "Database")}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-sm">
                <pre>{database}</pre>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>
  );
}; 