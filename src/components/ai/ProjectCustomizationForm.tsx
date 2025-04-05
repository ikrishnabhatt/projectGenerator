
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Download, PlusCircle, Trash2, Code, ExternalLink } from "lucide-react";
import { ProjectRequirement, GeneratedProject, generateProject, downloadProject } from "@/services/aiService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Theme color options
const themeOptions = [
  { value: "default", label: "Default (Purple/Blue)", color: "#7c3aed" },
  { value: "green", label: "Nature Green", color: "#059669" },
  { value: "blue", label: "Ocean Blue", color: "#2563eb" },
  { value: "red", label: "Ruby Red", color: "#dc2626" },
  { value: "orange", label: "Sunset Orange", color: "#ea580c" },
  { value: "pink", label: "Rose Pink", color: "#db2777" },
];

// Project type options
const projectTypeOptions = [
  "Dashboard",
  "E-commerce",
  "Portfolio",
  "Blog",
  "Landing Page",
  "Admin Panel",
  "Mobile App"
];

// Tech stack options
const techStackOptions = [
  "HTML",
  "CSS",
  "JavaScript",
  "Tailwind CSS",
  "Alpine.js",
  "jQuery"
];

interface ProjectCustomizationFormProps {
  onGenerated?: (project: GeneratedProject) => void;
}

const ProjectCustomizationForm: React.FC<ProjectCustomizationFormProps> = ({ onGenerated }) => {
  // Auth context for user info
  const { isAuthenticated, user, incrementProjectCount, checkRemainingGenerations } = useAuth();
  
  // Form state
  const [formStep, setFormStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState(projectTypeOptions[0]);
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0].value);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>(["HTML", "CSS", "JavaScript", "Tailwind CSS"]);
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState("html");

  // Handle tech stack selection
  const toggleTechStack = (tech: string) => {
    if (selectedTechStack.includes(tech)) {
      setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
    } else {
      setSelectedTechStack([...selectedTechStack, tech]);
    }
  };

  // Add a new feature to the list
  const addFeature = () => {
    if (newFeature.trim()) {
      setCustomFeatures([...customFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  // Remove a feature from the list
  const removeFeature = (index: number) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index));
  };

  // Add a new image URL to the list
  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  // Remove an image URL from the list
  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Go to the next form step
  const nextStep = () => {
    if (formStep === 1) {
      if (!projectName.trim()) {
        toast.error("Please enter a project name");
        return;
      }
      if (!projectType) {
        toast.error("Please select a project type");
        return;
      }
    }
    
    setFormStep(formStep + 1);
  };

  // Go to the previous form step
  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  // Generate the project
  const handleGenerateProject = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to generate a project");
      return;
    }

    const { canGenerate, remaining } = checkRemainingGenerations();
    
    if (!canGenerate) {
      toast.error("You've reached your generation limit. Please upgrade your plan.");
      return;
    }

    // Prepare project requirements
    const requirements: ProjectRequirement = {
      projectName,
      projectType,
      description: projectDescription,
      features: customFeatures,
      techStack: selectedTechStack,
      imageUrls,
      themeColor: selectedTheme
    };

    setIsGenerating(true);
    
    try {
      // Generate the project
      const project = await generateProject(requirements);
      
      // Update state and notify parent component
      setGeneratedProject(project);
      if (onGenerated) {
        onGenerated(project);
      }
      
      // Update user's project count
      incrementProjectCount();
      
      if (user?.subscriptionTier === 'free' && remaining > 0) {
        toast(`You have ${remaining - 1} free generations remaining`);
      }
      
      // Move to the preview step
      setFormStep(4);
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse code snippets from the project
  const parseCodeSnippets = () => {
    if (!generatedProject) return { html: "", css: "", js: "" };
    
    let html = generatedProject.codeSnippets.frontend || "";
    let css = "";
    let js = generatedProject.codeSnippets.backend || "";
    
    // Extract CSS if it's embedded in the HTML
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch && styleMatch[1]) {
      css = styleMatch[1].trim();
    }
    
    // Extract JS if it's embedded in the HTML
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch && scriptMatch[1]) {
      js = scriptMatch[1].trim();
    }
    
    return { html, css, js };
  };

  // Download the generated project
  const handleDownloadProject = async () => {
    if (!generatedProject) {
      toast.error("No project to download");
      return;
    }

    setIsDownloading(true);
    
    try {
      const downloadUrl = await downloadProject(generatedProject);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${projectName.replace(/\s+/g, '-').toLowerCase() || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Project download started");
    } catch (error) {
      console.error("Error downloading project:", error);
      toast.error("Failed to download project");
    } finally {
      setIsDownloading(false);
    }
  };

  // Render form step 1: Basic info
  const renderStepOne = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter a name for your project"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Project Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {projectTypeOptions.map((type) => (
            <div
              key={type}
              onClick={() => setProjectType(type)}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                projectType === type
                  ? 'border-2 border-brand-purple bg-brand-purple/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm text-center">{type}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Describe what your project should do"
          className="mt-1 min-h-[100px]"
        />
      </div>
      
      <div className="pt-4">
        <Button onClick={nextStep} className="w-full bg-brand-purple hover:bg-brand-purple/90">
          Next: Customize Features
        </Button>
      </div>
    </div>
  );

  // Render form step 2: Features
  const renderStepTwo = () => (
    <div className="space-y-4">
      <div>
        <Label>Features</Label>
        <p className="text-sm text-gray-500 mb-2">Add custom features for your project</p>
        
        <div className="flex space-x-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="e.g. User authentication"
            onKeyDown={(e) => e.key === 'Enter' && addFeature()}
          />
          <Button onClick={addFeature} variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {customFeatures.length > 0 ? (
          <div className="space-y-2 mt-4">
            {customFeatures.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span>{feature}</span>
                <Button 
                  onClick={() => removeFeature(index)} 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No features added yet</p>
        )}
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button onClick={prevStep} variant="outline">
          Back
        </Button>
        <Button onClick={nextStep} className="bg-brand-purple hover:bg-brand-purple/90">
          Next: Theme & Media
        </Button>
      </div>
    </div>
  );

  // Render form step 3: Theme and media
  const renderStepThree = () => (
    <div className="space-y-4">
      <div>
        <Label>Theme Color</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {themeOptions.map((theme) => (
            <div
              key={theme.value}
              onClick={() => setSelectedTheme(theme.value)}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                selectedTheme === theme.value
                  ? 'border-2 border-brand-purple'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-full h-4 rounded-full mb-2"
                style={{ backgroundColor: theme.color }}
              ></div>
              <p className="text-xs text-center">{theme.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Technology Stack</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {techStackOptions.map((tech) => (
            <div
              key={tech}
              onClick={() => toggleTechStack(tech)}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                selectedTechStack.includes(tech)
                  ? 'border-2 border-brand-purple bg-brand-purple/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm text-center">{tech}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Add Images (Optional)</Label>
        <p className="text-sm text-gray-500 mb-2">Add image URLs to include in your project</p>
        
        <div className="flex space-x-2 mb-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
          />
          <Button onClick={addImageUrl} variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {imageUrls.length > 0 ? (
          <div className="space-y-2 mt-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-sm truncate max-w-[80%]">{url}</span>
                <Button
                  onClick={() => removeImageUrl(index)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No images added yet</p>
        )}
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button onClick={prevStep} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleGenerateProject}
          disabled={isGenerating}
          className="bg-brand-purple hover:bg-brand-purple/90"
        >
          {isGenerating ? "Generating..." : "Generate Project"}
        </Button>
      </div>
    </div>
  );

  // Render form step 4: Preview and download
  const renderStepFour = () => {
    const { html, css, js } = parseCodeSnippets();
    
    return (
      <div className="space-y-6">
        {generatedProject ? (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold">{generatedProject.name}</h3>
              <p className="text-gray-600 mt-1">{generatedProject.description}</p>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {generatedProject.previewImageUrl && (
                <img
                  src={generatedProject.previewImageUrl}
                  alt={generatedProject.name}
                  className="w-full h-40 object-cover"
                />
              )}
              
              <div className="p-4">
                <h4 className="font-semibold mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h4 className="font-semibold mb-2">Project Structure</h4>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <ul className="text-sm font-mono space-y-1">
                    {generatedProject.structure.frontend.map((file, index) => (
                      <li key={index}>{file}</li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={handleDownloadProject}
                  disabled={isDownloading}
                  className="w-full mt-2 bg-brand-purple hover:bg-brand-purple/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download Project"}
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Generated Code</h4>
              
              <Tabs defaultValue="html" onValueChange={setActiveCodeTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
                  <TabsTrigger value="js" className="flex-1">JavaScript</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                    <pre className="text-sm">
                      <code>{html || "No HTML code generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="css">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                    <pre className="text-sm">
                      <code>{css || "No CSS code generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="js">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                    <pre className="text-sm">
                      <code>{js || "No JavaScript code generated"}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const codeToDisplay = activeCodeTab === "html" ? html : 
                                          activeCodeTab === "css" ? css : js;
                    
                    // Create a Blob with the code
                    const blob = new Blob([codeToDisplay], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    
                    // Create a temporary <a> element and trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${activeCodeTab === "html" ? "index.html" : 
                                     activeCodeTab === "css" ? "styles.css" : "script.js"}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // Clean up the Blob URL
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Download {activeCodeTab.toUpperCase()} Code
                </Button>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button onClick={() => setFormStep(1)} variant="outline" className="w-full">
                Create New Project
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>No project generated yet.</p>
            <Button
              onClick={() => setFormStep(1)}
              className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
            >
              Start Over
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render the appropriate form step
  return (
    <Card>
      <CardContent className="pt-6">
        {formStep === 1 && renderStepOne()}
        {formStep === 2 && renderStepTwo()}
        {formStep === 3 && renderStepThree()}
        {formStep === 4 && renderStepFour()}
      </CardContent>
    </Card>
  );
};

export default ProjectCustomizationForm;
