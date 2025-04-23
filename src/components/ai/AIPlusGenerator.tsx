import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Sparkles, Eye, Download, Code } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWithGroq, TECH_STACK_OPTIONS, TechStack, PageDescription, assembleProject } from "@/services/grokService";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useToast } from "@/components/ui/use-toast";
import PreviewContainer from "./PreviewContainer";
import GeneratedProject from "./GeneratedProject";

// Sample prompts
const SAMPLE_PROMPTS = [
  {
    title: "E-commerce Dashboard",
    description: "Create a modern e-commerce dashboard with order management, inventory tracking, and sales analytics. Include dark mode support and responsive design.",
    techStack: "react-tailwind-node-mongo" as TechStack
  },
  {
    title: "Personal Blog",
    description: "Build a minimalist blog platform with markdown support, categories, search functionality, and a clean reading experience. Include SEO optimization.",
    techStack: "vue-django-postgres" as TechStack
  },
  {
    title: "Task Management App",
    description: "Develop a Kanban-style task management app with real-time updates, file attachments, and team collaboration features. Include offline support.",
    techStack: "react-firebase" as TechStack
  },
  {
    title: "Learning Platform",
    description: "Create an educational platform with course management, video lessons, quizzes, and progress tracking. Include accessibility features.",
    techStack: "html-css-js-flask-sqlite" as TechStack
  }
];

interface GeneratedCode {
  html?: Record<string, string>;
  css?: string;
  js?: string;
  react?: Record<string, string>;
  backend?: string;
  database?: string;
  tailwind?: string;
  firebase?: string;
  vue?: string;
}

interface AIPlusGeneratorProps {
  onGenerateProject?: (
    projectName: string,
    projectDescription: string,
    pages: PageDescription[],
    techStack: TechStack
  ) => Promise<void>;
  isGenerating?: boolean;
  error?: string | null;
}

const AIPlusGenerator: React.FC<AIPlusGeneratorProps> = ({ 
  onGenerateProject, 
  isGenerating = false, 
  error = null 
}) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem("groq_api_key") || "");
  const [techStack, setTechStack] = useState<TechStack>("react-tailwind-node-mongo");
  const [modelStatus, setModelStatus] = useState("");
  const { user, updateCredits } = useAuth();
  const [showExamples, setShowExamples] = useState(false);
  const [projectName, setProjectName] = useState("My AI Project");
  const [pages, setPages] = useState<PageDescription[]>([
    { name: "Home", path: "/", description: "Main landing page with featured content and navigation" }
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(true);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem("groq_api_key", key);
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

    // Validate pages
    for (const page of pages) {
      if (!page.name.trim() || !page.path.trim() || !page.description.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all page details",
          variant: "destructive",
        });
        return;
      }
    }

    if (!user?.isPro && !user?.isSuperUser && (user?.credits || 0) < 10) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 10 credits to use AI+ generation. Please top up your credits.",
        variant: "destructive",
      });
      return;
    }

    try {
      setModelStatus("Preparing AI model...");

      if (onGenerateProject) {
        await onGenerateProject(projectName, prompt, pages, techStack);
      } else {
        // Fallback to direct generation if no prop function provided
        const result = await generateWithGroq(
          `${prompt}\n\nTechnology Stack: ${TECH_STACK_OPTIONS.find(opt => opt.value === techStack)?.label}`,
          pages
        );

        if (!user?.isPro && !user?.isSuperUser) {
          updateCredits((user?.credits || 0) - 10);
          toast({
            title: "Credits Used",
            description: "10 credits have been deducted for this AI+ generation.",
          });
        }

        setGeneratedCode(result);
      }

      toast({
        title: "Generation Complete",
        description: "Your project has been generated successfully!",
      });
    } catch (error) {
      console.error("AI Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred during generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setModelStatus("");
    }
  };

  // Add handleSamplePrompt function
  const handleSamplePrompt = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setPrompt(sample.description);
    setTechStack(sample.techStack);
    setShowExamples(false);
  };

  const addPage = () => {
    setPages([...pages, { name: "", path: "", description: "" }]);
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const updatePage = (index: number, field: keyof PageDescription, value: string) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], [field]: value };
    setPages(newPages);
  };

  // Toggle between preview and code view
  const toggleView = () => {
    setShowPreview(!showPreview);
    setShowCode(!showCode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Generate with AI</h1>
      <p className="mb-8 text-center text-lg text-muted-foreground">
        Describe your project and its pages in detail, and our AI will generate the perfect solution for you.
      </p>

      {showExamples && (
        <div className="mb-8 mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Example Projects</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_PROMPTS.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 text-left"
                  onClick={() => handleSamplePrompt(sample)}
                >
                  <span className="font-medium mb-1">{sample.title}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-full">
                    {sample.description.length > 100 
                      ? sample.description.substring(0, 100) + "..." 
                      : sample.description}
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>AI+ Project Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="project-name" className="mb-2 block font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="framework" className="mb-2 block font-medium">
                Choose Tech Stack
              </label>
              <Select value={techStack} onValueChange={(value) => setTechStack(value as TechStack)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tech stack" />
                </SelectTrigger>
                <SelectContent>
                  {TECH_STACK_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="api-key" className="mb-2 block font-medium">
                Groq API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Groq API key"
                value={apiKey}
                onChange={handleApiKeyChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Required for AI+ generation with deepseek-r1-distill-llama-70b model
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="project-description" className="block font-medium">
                  Project Overview
                </label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowExamples(!showExamples)}
                >
                  {showExamples ? "Hide Examples" : "Show Examples"}
                </Button>
              </div>
              <Textarea
                id="project-description"
                placeholder="Describe your overall project goals, target audience, and key features..."
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block font-medium">Pages</label>
                <Button variant="outline" size="sm" onClick={addPage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
              </div>
              
              {pages.map((page, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Page {index + 1}</h3>
                    {index > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => removePage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm">Page Name</label>
                      <Input
                        placeholder="e.g., Dashboard"
                        value={page.name}
                        onChange={(e) => updatePage(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm">URL Path</label>
                      <Input
                        placeholder="e.g., /dashboard"
                        value={page.path}
                        onChange={(e) => updatePage(index, 'path', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm">Page Description</label>
                    <Textarea
                      placeholder="Describe what this page should do and what features it should have..."
                      value={page.description}
                      onChange={(e) => updatePage(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>

            {!user?.isPro && !user?.isSuperUser && (
              <div className="flex items-center gap-2 rounded-md bg-orange-50 p-2 dark:bg-orange-900/20">
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  This feature costs 10 credits per generation. Your credits: {user?.credits || 0}
                </p>
              </div>
            )}

            {(user?.isPro || user?.isSuperUser) && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400">
                  {/* Check icon */}
                </span>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Unlimited generations (PRO)
                </p>
              </div>
            )}

            {modelStatus && (
              <div className="text-sm text-blue-500 dark:text-blue-400">
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                {modelStatus}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button 
              className="flex-1" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <ProgressIndicator className="h-4 w-4" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Project
                </span>
              )}
            </Button>
            
            {generatedCode && (
              <>
                <Button
                  variant="outline"
                  onClick={toggleView}
                >
                  {showPreview ? (
                    <>
                      <Code className="h-4 w-4 mr-2" />
                      Show Code
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Preview
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Project
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      {generatedCode && (
        <div className="mt-8">
          {showPreview ? (
            <PreviewContainer 
              project={generatedCode} 
              techStack={techStack} 
              onClose={() => setShowPreview(false)} 
            />
          ) : (
            <GeneratedProject
              project={generatedCode}
              techStack={techStack}
              projectName={projectName}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AIPlusGenerator;