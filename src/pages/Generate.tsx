import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getTemplateById, Template, downloadTemplate } from "@/services/templateService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Save, ArrowLeft, Palette, FileCode } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectCustomizationForm from "@/components/ai/ProjectCustomizationForm";
import { GeneratedProject } from "@/services/aiService";

const Generate = () => {
  const { isAuthenticated, user, incrementProjectCount, checkRemainingGenerations } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const templateIdFromQuery = queryParams.get('template');
  
  const [step, setStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdFromQuery || "");
  const [projectName, setProjectName] = useState("");
  const [projectTheme, setProjectTheme] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [mockProjectStructure, setMockProjectStructure] = useState({
    frontend: [] as string[],
    backend: [] as string[]
  });
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);

  const themeOptions = [
    { value: "default", label: "Default (Purple/Blue)", color: "#7c3aed" },
    { value: "green", label: "Nature Green", color: "#059669" },
    { value: "blue", label: "Ocean Blue", color: "#2563eb" },
    { value: "red", label: "Ruby Red", color: "#dc2626" },
    { value: "orange", label: "Sunset Orange", color: "#ea580c" },
    { value: "pink", label: "Rose Pink", color: "#db2777" },
  ];

  useEffect(() => {
    const loadTemplate = async () => {
      if (selectedTemplateId) {
        setIsLoading(true);
        try {
          const template = await getTemplateById(selectedTemplateId);
          if (template) {
            setSelectedTemplate(template);
            setProjectName(template.name);
            generateMockStructure(template);
          }
        } catch (error) {
          console.error("Error loading template:", error);
          toast.error("Failed to load template");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTemplate();
  }, [selectedTemplateId]);

  const generateMockStructure = (template: Template) => {
    const frontendStructure = [
      "src/",
      "├── components/",
      "│   ├── layout/",
      "│   ├── ui/",
      "│   └── features/",
      "├── pages/",
      "├── hooks/",
      "├── styles/",
      "└── utils/"
    ];

    const backendStructure = [
      "server/",
      "├── controllers/",
      "├── models/",
      "├── routes/",
      "├── middleware/",
      "└── utils/"
    ];

    if (template.category === "Dashboard") {
      frontendStructure.push("├── dashboard/");
      frontendStructure.push("│   ├── charts/");
      frontendStructure.push("│   └── widgets/");
    } else if (template.category === "E-commerce") {
      frontendStructure.push("├── store/");
      frontendStructure.push("│   ├── products/");
      frontendStructure.push("│   ├── cart/");
      frontendStructure.push("│   └── checkout/");
      backendStructure.push("├── payment/");
    } else if (template.category === "Blog") {
      frontendStructure.push("├── blog/");
      frontendStructure.push("│   ├── posts/");
      frontendStructure.push("│   └── comments/");
      backendStructure.push("├── content/");
    }

    setMockProjectStructure({
      frontend: frontendStructure,
      backend: backendStructure
    });
  };

  const handleSelectTemplate = async () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }

    if (isAuthenticated) {
      setStep(2);
      return;
    }

    toast.error("Please login to generate a project");
    navigate("/login");
  };

  const handleGenerateProject = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to generate a project");
      navigate("/login");
      return;
    }

    const { canGenerate, remaining } = checkRemainingGenerations();
    
    if (!canGenerate) {
      toast.error("You've reached your generation limit. Please upgrade your plan.");
      return;
    }

    incrementProjectCount();
    
    if (user?.subscriptionTier === 'free' && remaining > 0) {
      toast(`You have ${remaining - 1} free generations remaining`);
    }

    toast.success("Project customization ready!");
    setStep(2);
  };

  const handleDownloadProject = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    const customizedTemplate = {
      ...selectedTemplate,
      name: projectName || selectedTemplate.name,
      customTheme: projectTheme
    };

    setIsDownloading(true);
    try {
      const downloadUrl = await downloadTemplate(customizedTemplate);
      
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

  const handleProjectGenerated = (project: GeneratedProject) => {
    setGeneratedProject(project);
  };

  const mockCodeSnippets = {
    frontend: `// Example React component for ${projectName || "your project"}
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function ${projectName.replace(/\s+/g, '') || "MainComponent"}() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(result => setData(result))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to ${projectName || "your project"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(item => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2">{item.description}</p>
            <Button className="mt-4">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    backend: `// Example Express server for ${projectName || "your project"}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${projectName.toLowerCase().replace(/\s+/g, '_') || "app_database"}')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/data', async (req, res) => {
  try {
    const data = [
      { id: 1, title: 'Item 1', description: 'Description for item 1' },
      { id: 2, title: 'Item 2', description: 'Description for item 2' },
      { id: 3, title: 'Item 3', description: 'Description for item 3' },
    ];
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Template Customizer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select and customize a template to generate your next project
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

        <Tabs defaultValue="template">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="template" className="flex-1">Template Customizer</TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">AI Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="template">
            {step === 1 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Template</CardTitle>
                  <CardDescription>
                    Choose a template as the starting point for your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : selectedTemplate ? (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={selectedTemplate.image} 
                          alt={selectedTemplate.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                          <p className="text-gray-600 mt-2">{selectedTemplate.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {selectedTemplate.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          placeholder="Enter a name for your project"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="mb-4">Please select a template from the templates page first.</p>
                      <Button
                        onClick={() => navigate('/templates')}
                        className="bg-brand-purple hover:bg-brand-purple/90"
                      >
                        Browse Templates
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {selectedTemplate && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/templates')}
                      >
                        Change Template
                      </Button>
                      <Button
                        onClick={handleGenerateProject}
                        className="bg-brand-purple hover:bg-brand-purple/90"
                      >
                        Continue to Customization
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Customize Your Project</CardTitle>
                        <CardDescription className="mt-2">
                          Personalize your template before downloading
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter a name for your project"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Theme Color</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((theme) => (
                          <div 
                            key={theme.value}
                            className={`p-4 border rounded-md cursor-pointer transition-all ${
                              projectTheme === theme.value ? 'border-2 border-brand-purple' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setProjectTheme(theme.value)}
                          >
                            <div 
                              className="w-full h-4 rounded-full mb-2"
                              style={{ backgroundColor: theme.color }}
                            ></div>
                            <p className="text-sm text-center">{theme.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between gap-4 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Project
                      </Button>
                      <Button
                        onClick={handleDownloadProject}
                        disabled={isDownloading}
                        className="flex-1 bg-brand-purple hover:bg-brand-purple/90"
                      >
                        <Download className="h-4 w-4 mr-2" /> 
                        {isDownloading ? "Downloading..." : "Download Project"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{projectName || selectedTemplate?.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {selectedTemplate?.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <FileCode className="h-4 w-4 mr-2" />
                          Preview Code
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedTemplate?.techStack.map((tech) => (
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
                          </div>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                            <pre className="text-sm">
                              <code>{mockCodeSnippets.frontend}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Backend Code</h3>
                          </div>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                            <pre className="text-sm">
                              <code>{mockCodeSnippets.backend}</code>
                            </pre>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="structure">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Frontend Structure</h3>
                            <div className="bg-gray-100 p-4 rounded-md">
                              <ul className="space-y-1 font-mono text-sm">
                                {mockProjectStructure.frontend.map((item, index) => (
                                  <li key={index} className="whitespace-pre">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Backend Structure</h3>
                            <div className="bg-gray-100 p-4 rounded-md">
                              <ul className="space-y-1 font-mono text-sm">
                                {mockProjectStructure.backend.map((item, index) => (
                                  <li key={index} className="whitespace-pre">
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
          </TabsContent>

          <TabsContent value="ai">
            <ProjectCustomizationForm onGenerated={handleProjectGenerated} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Generate;
