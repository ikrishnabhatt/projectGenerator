
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, Download, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateWithAI } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AIPlusGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{html?: string; css?: string; js?: string; react?: string; backend?: string} | null>(null);
  const [activeTab, setActiveTab] = useState("html");
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const [framework, setFramework] = useState("html");
  const [modelStatus, setModelStatus] = useState("");
  const { user, updateCredits } = useAuth();
  
  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
  };
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project description",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has credits (if not superuser or PRO)
    if (!user?.isPro && !user?.isSuperUser && (user?.credits || 0) < 10) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 10 credits to use AI+ generation. Please top up your credits.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      setModelStatus("Preparing AI model...");
      
      // Enhance the prompt with framework preference if selected
      const enhancedPrompt = framework === "html" 
        ? prompt 
        : `Create a ${framework} application for: ${prompt}`;
      
      // Use the updated AI generation service
      const result = await generateWithAI(enhancedPrompt);
      
      // If not superuser or PRO, deduct credits
      if (!user?.isPro && !user?.isSuperUser) {
        updateCredits((user?.credits || 0) - 10);
        toast({
          title: "Credits Used",
          description: "10 credits have been deducted for this AI+ generation.",
        });
      }
      
      setGeneratedCode(result);
      setActiveTab(framework === "react" ? "react" : "html"); // Select appropriate tab based on framework
      
      toast({
        title: "Generation Complete",
        description: "Your project has been generated successfully!",
      });
    } catch (error) {
      console.error("AI Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "An error occurred during generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setModelStatus("");
      setGenerating(false);
    }
  };
  
  const downloadGeneratedCode = () => {
    if (!generatedCode) return;
    
    // Create content based on framework
    let content = '';
    if (framework === 'react') {
      content = generatedCode.react || '';
    } else {
      content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Project</title>
    <style>
${generatedCode.css || ''}
    </style>
</head>
<body>
${generatedCode.html || ''}

<script>
${generatedCode.js || ''}
</script>
</body>
</html>`;
    }
    
    // Create file name
    const fileName = framework === 'react' ? 'App.jsx' : 'index.html';
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card text-card-foreground border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI+ Project Generation</h3>
            <p className="text-muted-foreground">
              Describe your project in detail and our AI will generate a complete solution for you.
              {!user?.isPro && !user?.isSuperUser && (
                <span className="block mt-2 text-orange-500 font-medium">
                  This feature costs 10 credits per generation.
                </span>
              )}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="framework" className="mb-2 block">Choose Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML/CSS/JS</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="api-key" className="mb-2 block">OpenAI API Key (Optional)</Label>
                <Input
                  type="password"
                  id="api-key"
                  placeholder="Enter OpenAI API key for better results"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will use local AI model if no API key provided
                </p>
              </div>
            </div>
            
            <Textarea
              placeholder="Describe your project in detail. For example: 'Create a responsive landing page for a coffee shop with a hero section, product showcase, about us section, and contact form. Use earthy colors like brown and green.'"
              className="h-40 resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="flex flex-col space-y-2">
              {modelStatus && (
                <div className="text-sm text-blue-500 dark:text-blue-400">
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  {modelStatus}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {!user?.isPro && !user?.isSuperUser && (
                    <>Your available credits: <span className="font-semibold">{user?.credits || 0}</span></>
                  )}
                  {(user?.isPro || user?.isSuperUser) && (
                    <span className="text-green-500 dark:text-green-400 font-semibold">Unlimited generations (PRO)</span>
                  )}
                </p>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !prompt.trim()} 
                  className="ml-auto"
                >
                  {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {generating ? "Generating..." : "Generate Project"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {generatedCode && (
        <Card className="mt-8 border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Project</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadGeneratedCode}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Code
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                {framework !== "react" && <TabsTrigger value="html">HTML</TabsTrigger>}
                {framework !== "react" && <TabsTrigger value="css">CSS</TabsTrigger>}
                {framework !== "react" && <TabsTrigger value="js">JavaScript</TabsTrigger>}
                {framework === "react" && <TabsTrigger value="react">React</TabsTrigger>}
                {generatedCode.backend && <TabsTrigger value="backend">Backend</TabsTrigger>}
              </TabsList>
              
              {framework !== "react" && (
                <TabsContent value="html" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 rounded bg-muted text-foreground overflow-x-auto max-h-96">
                      <code className="text-sm">{generatedCode.html || "No HTML content generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              )}
              
              {framework !== "react" && (
                <TabsContent value="css" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 rounded bg-muted text-foreground overflow-x-auto max-h-96">
                      <code className="text-sm">{generatedCode.css || "No CSS content generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              )}
              
              {framework !== "react" && (
                <TabsContent value="js" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 rounded bg-muted text-foreground overflow-x-auto max-h-96">
                      <code className="text-sm">{generatedCode.js || "No JavaScript content generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              )}
              
              {framework === "react" && (
                <TabsContent value="react" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 rounded bg-muted text-foreground overflow-x-auto max-h-96">
                      <code className="text-sm">{generatedCode.react || "No React content generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              )}
              
              {generatedCode.backend && (
                <TabsContent value="backend" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 rounded bg-muted text-foreground overflow-x-auto max-h-96">
                      <code className="text-sm">{generatedCode.backend || "No backend content generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                This AI-generated code is a starting point for your project. You may need to make adjustments based on your specific requirements. For more complex projects, consider using our expert services or upgrading to a Pro plan.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPlusGenerator;
