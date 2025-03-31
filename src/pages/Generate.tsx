
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectRequirement, GeneratedProject, generateProject, getRecommendedFeatures, saveProject, downloadProject } from "@/services/aiService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Download, Save, IndianRupee } from "lucide-react";
import SubscriptionPrompt from "@/components/SubscriptionPrompt";
import { useNavigate } from "react-router-dom";

const Generate = () => {
  const { isAuthenticated, user, incrementProjectCount, checkRemainingGenerations } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [isCopied, setIsCopied] = useState({
    frontend: false,
    backend: false
  });

  const handleAddCustomFeature = () => {
    if (customFeature.trim() !== "" && !features.includes(customFeature.trim())) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  const handleToggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomFeature();
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to generate a project");
      navigate("/login");
      return;
    }

    if (!projectType || !description || features.length === 0 || techStack.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if user has remaining generations
    const { canGenerate, remaining } = checkRemainingGenerations();
    
    if (!canGenerate) {
      setShowSubscriptionPrompt(true);
      return;
    }

    const requirements: ProjectRequirement = {
      projectType,
      description,
      features,
      techStack,
    };

    setIsGenerating(true);

    try {
      const project = await generateProject(requirements);
      setGeneratedProject(project);
      setStep(2);
      
      // Increment project count and decrease points if on free plan
      incrementProjectCount();
      
      // Show toast with remaining generations if on free plan
      if (user?.subscriptionTier === 'free' && remaining > 0) {
        toast(`You have ${remaining - 1} free generations remaining`);
      }
      
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProject = async () => {
    if (!generatedProject) return;

    try {
      await saveProject(generatedProject);
      toast.success("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleCopyCode = (type: "frontend" | "backend") => {
    if (!generatedProject) return;

    navigator.clipboard.writeText(generatedProject.codeSnippets[type]);
    setIsCopied({ ...isCopied, [type]: true });

    setTimeout(() => {
      setIsCopied({ ...isCopied, [type]: false });
    }, 2000);

    toast.success(`${type === "frontend" ? "Frontend" : "Backend"} code copied to clipboard`);
  };

  const handleDownloadProject = async () => {
    if (!generatedProject) return;

    setIsDownloading(true);
    try {
      const downloadUrl = await downloadProject(generatedProject);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${generatedProject.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
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

  useEffect(() => {
    if (projectType) {
      setIsLoading(true);
      getRecommendedFeatures(projectType)
        .then((features) => {
          setSuggestedFeatures(features);
        })
        .catch((error) => {
          console.error("Error fetching recommended features:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectType]);

  useEffect(() => {
    // Check remaining generations on component mount
    if (isAuthenticated) {
      const { remaining, canGenerate } = checkRemainingGenerations();
      // If user has no generations left and is on free plan, show subscription prompt
      if (!canGenerate && user?.subscriptionTier === 'free') {
        toast.info(`You have used all your free generations. Upgrade to continue.`);
      } else if (user?.subscriptionTier === 'free') {
        toast.info(`You have ${remaining} free project generations remaining.`);
      }
    }
  }, [isAuthenticated]);

  const techOptions = [
    "React", "Vue", "Angular", "Next.js", "Node.js", 
    "Express", "MongoDB", "PostgreSQL", "Firebase", 
    "AWS", "GraphQL", "REST API", "Tailwind CSS", 
    "Material UI", "Bootstrap", "TypeScript", "JavaScript"
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Project Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Describe your project requirements and our AI will generate a complete project structure with code.
          </p>
          
          {isAuthenticated && user && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
              {user.subscriptionTier === 'free' ? (
                <>
                  <span className="mr-2">Free Plan:</span> 
                  <span className="font-semibold">{user.points} generations remaining</span>
                </>
              ) : (
                <>
                  <span className="mr-2">{user.subscriptionTier === 'pro' ? 'Pro' : 'Team'} Plan:</span> 
                  <span className="font-semibold">Unlimited generations</span>
                </>
              )}
            </div>
          )}
        </div>

        {step === 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
              <CardDescription>
                Provide details about the project you want to build
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Input
                  id="projectType"
                  placeholder="E.g., E-commerce, Blog, Dashboard, Social Media"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your project should do..."
                  className="min-h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Features</Label>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <>
                    {suggestedFeatures.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedFeatures.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={feature}
                              checked={features.includes(feature)}
                              onCheckedChange={() => {
                                if (features.includes(feature)) {
                                  handleRemoveFeature(feature);
                                } else {
                                  setFeatures([...features, feature]);
                                }
                              }}
                            />
                            <Label htmlFor={feature}>{feature}</Label>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {features.map(
                        (feature) =>
                          !suggestedFeatures.includes(feature) && (
                            <div
                              key={feature}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              <span>{feature}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(feature)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </div>
                          )
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom feature"
                        value={customFeature}
                        onChange={(e) => setCustomFeature(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomFeature}
                      >
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <Label>Tech Stack</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {techOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tech-${tech}`}
                        checked={techStack.includes(tech)}
                        onCheckedChange={() => handleToggleTech(tech)}
                      />
                      <Label htmlFor={`tech-${tech}`}>{tech}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="bg-brand-purple hover:bg-brand-purple/90"
                >
                  {isGenerating ? "Generating..." : "Generate Project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{generatedProject?.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {generatedProject?.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveProject}
                    >
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadProject}
                      disabled={isDownloading}
                    >
                      <Download className="h-4 w-4 mr-2" /> 
                      {isDownloading ? "Downloading..." : "Download"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      Edit Requirements
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {generatedProject?.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="code">
                  <TabsList className="mb-4">
                    <TabsTrigger value="code">Code Snippets</TabsTrigger>
                    <TabsTrigger value="structure">Project Structure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">Frontend Code</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode("frontend")}
                        >
                          {isCopied.frontend ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {isCopied.frontend ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                        <pre className="text-sm">
                          <code>{generatedProject?.codeSnippets.frontend}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">Backend Code</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode("backend")}
                        >
                          {isCopied.backend ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {isCopied.backend ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                        <pre className="text-sm">
                          <code>{generatedProject?.codeSnippets.backend}</code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="structure">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Frontend Structure</h3>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <ul className="space-y-2">
                            {generatedProject?.structure.frontend.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <span className="mr-2 text-brand-purple">▸</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Backend Structure</h3>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <ul className="space-y-2">
                            {generatedProject?.structure.backend.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <span className="mr-2 text-brand-purple">▸</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Subscription Prompt Modal */}
      <SubscriptionPrompt 
        open={showSubscriptionPrompt} 
        onClose={() => setShowSubscriptionPrompt(false)} 
      />
    </div>
  );
};

export default Generate;
