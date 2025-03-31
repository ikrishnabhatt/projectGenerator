
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Download, Github, ExternalLink } from "lucide-react";
import { getTemplateById, Template, downloadTemplate } from "@/services/templateService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getTemplateById(id);
        if (data) {
          setTemplate(data);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleUseTemplate = () => {
    if (!isAuthenticated) {
      toast.error("Please login to use this template");
      navigate("/login");
      return;
    }
    
    toast.success("Template selected! You can now customize it.");
  };

  const handleDownload = async () => {
    if (!template) return;
    
    setDownloading(true);
    try {
      const downloadUrl = await downloadTemplate(template);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`${template.name} template download started`);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenGithub = () => {
    if (!template || !template.githubUrl) return;
    
    window.open(template.githubUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/templates">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Templates
              </Button>
            </Link>
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Skeleton className="w-full h-80 rounded-lg" />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-2/3 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
          <p className="text-gray-600 mb-8">The template you are looking for does not exist or has been removed.</p>
          <Link to="/templates">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/templates">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Templates
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{template?.name}</h1>
          <p className="text-gray-600">{template?.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={template?.image}
                alt={template?.name}
                className="w-full h-auto"
              />
            </div>

            <div className="mt-8">
              <Tabs defaultValue="features">
                <TabsList className="mb-4">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>

                <TabsContent value="features" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-medium mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Responsive design for all device sizes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Modern UI components with animations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Authentication system with role-based access</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Backend API with database integration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Comprehensive documentation</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="structure" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-medium mb-4">Project Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Frontend Structure</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`src/
├── assets/
├── components/
├── config/
├── hooks/
├── pages/
├── services/
├── styles/
├── utils/
└── App.tsx`}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Backend Structure</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── config.js
└── server.js`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-medium mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-gray-700 mr-2">•</span>
                        <span>Node.js v14+ and npm/yarn</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-700 mr-2">•</span>
                        <span>Database (MongoDB/PostgreSQL)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-700 mr-2">•</span>
                        <span>Basic knowledge of React and JavaScript</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-700 mr-2">•</span>
                        <span>Git for version control</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Template Details</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template?.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium">{template?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Popularity</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-brand-purple rounded-full"
                            style={{ width: `${template?.popularity}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{template?.popularity}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="font-medium">April 12, 2023</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUseTemplate}
                  className="w-full mb-3 bg-brand-purple hover:bg-brand-purple/90"
                >
                  Use This Template
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-1/2"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    <Download className="h-4 w-4 mr-2" /> 
                    {downloading ? "Downloading..." : "Download"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-1/2"
                    onClick={handleOpenGithub}
                    disabled={!template?.githubUrl}
                  >
                    <Github className="h-4 w-4 mr-2" /> GitHub
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium mb-3">Live Demo</h4>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-brand-purple hover:underline"
                  >
                    View Demo <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Need Customization?</h3>
                  <p className="text-gray-600 mb-4">
                    Our team of experts can customize this template to fit your specific requirements.
                  </p>
                  <Link to="/create-by-experts">
                    <Button variant="outline" className="w-full">
                      Request Custom Work
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
