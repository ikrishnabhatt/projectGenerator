import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCustomizationForm from "@/components/ai/ProjectCustomizationForm";
import AIPlusGenerator from "@/components/ai/AIPlusGenerator";
import GeneratedProject from "@/components/ai/GeneratedProject";
import PreviewContainer from "@/components/ai/PreviewContainer";
import { PageDescription, TechStack, generateWithGroq, assembleProject } from "@/services/grokService";
import { Button } from "@/components/ui/button";
import { Eye, Code } from "lucide-react";

export interface GeneratedProjectData {
  html?: Record<string, string>;
  css?: string;
  js?: string;
  react?: Record<string, string>;
  vue?: string;
  backend?: string;
  database?: string;
  firebase?: string;
  tailwind?: string;
  downloadUrl?: string;
  techStack: TechStack;
  projectName: string;
}

const Generate: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [generatedProject, setGeneratedProject] = useState<GeneratedProjectData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(true);

  // Function to handle project generation
  const handleGenerateProject = async (
    projectName: string,
    projectDescription: string,
    pages: PageDescription[],
    techStack: TechStack,
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate code using the Groq service
      const generatedCode = await generateWithGroq(projectDescription, pages);
      
      // If we have HTML files, assemble the project
      if (generatedCode.html && Object.keys(generatedCode.html).length > 0) {
        // Create a downloadable ZIP file
        const zipBlob = await assembleProject(
          projectName,
          generatedCode.html,
          techStack,
          generatedCode.css,
          generatedCode.js,
          generatedCode.backend,
          generatedCode.database
        );
        
        // Create a URL for the blob
        const downloadUrl = URL.createObjectURL(zipBlob);
        
        // Set the generated project data
        setGeneratedProject({
          ...generatedCode,
          downloadUrl,
          techStack,
          projectName
        });
        
        // Set view preferences
        setShowPreview(true);
        setShowCode(false);
        
        // Switch to the generated project output view
        setTimeout(() => {
          document.getElementById('generated-project-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        throw new Error("No HTML files were generated. Please try again with more specific requirements.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error generating project:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle between preview and code view
  const toggleView = () => {
    setShowPreview(!showPreview);
    setShowCode(!showCode);
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-background text-foreground">
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950 dark:via-teal-950 dark:to-blue-950"></div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Generate Your Project</h1>
        <p className="text-muted-foreground text-center mb-8">
          Choose a generation method and customize your project requirements
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Template-Based</TabsTrigger>
            <TabsTrigger value="aiplus">AI+ (No Templates)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            <ProjectCustomizationForm 
              onGenerateProject={handleGenerateProject}
              isGenerating={isGenerating}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="aiplus" className="mt-6">
            <AIPlusGenerator 
              onGenerateProject={handleGenerateProject}
              isGenerating={isGenerating}
              error={error}
            />
          </TabsContent>
        </Tabs>

        {generatedProject && (
          <div id="generated-project-section" className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generated Project: {generatedProject.projectName}</h2>
              <Button 
                onClick={toggleView}
                variant="outline"
                size="sm"
              >
                {showPreview ? (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Show Code
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            </div>
            
            {showPreview ? (
              <div className="mb-8">
                <PreviewContainer 
                  project={generatedProject} 
                  techStack={generatedProject.techStack}
                  onClose={toggleView}
                />
              </div>
            ) : (
              <GeneratedProject 
                project={generatedProject}
                techStack={generatedProject.techStack}
                projectName={generatedProject.projectName}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;