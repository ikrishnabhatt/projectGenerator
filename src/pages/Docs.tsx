
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Docs = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to use Project Alchemy to build your next project
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="mb-12">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="ai-generation">AI Generation</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Project Alchemy</CardTitle>
                <CardDescription>
                  Learn the basics of Project Alchemy and how to create your first project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Introduction</h3>
                  <p className="text-gray-700">
                    Project Alchemy is a platform that helps developers quickly create complete projects with both frontend and backend code. You can use our AI generation feature to create custom projects based on your requirements, or choose from our pre-built templates.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>AI Project Generation:</strong> Describe your project and our AI will generate complete code for you
                    </li>
                    <li>
                      <strong>Pre-built Templates:</strong> Choose from our collection of professionally designed templates
                    </li>
                    <li>
                      <strong>Customization:</strong> Easily customize all projects to fit your specific needs
                    </li>
                    <li>
                      <strong>Export Options:</strong> Download your project as a ZIP file or directly clone it to your GitHub repository
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Quick Start Guide</h3>
                  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
                    <li>
                      <strong>Sign up for an account</strong>
                      <p className="mt-1">
                        Create a free account to get started with Project Alchemy
                      </p>
                    </li>
                    <li>
                      <strong>Choose a method</strong>
                      <p className="mt-1">
                        Decide whether you want to use AI generation or pre-built templates
                      </p>
                    </li>
                    <li>
                      <strong>Generate or select a project</strong>
                      <p className="mt-1">
                        Follow the step-by-step process to create your project
                      </p>
                    </li>
                    <li>
                      <strong>Customize and export</strong>
                      <p className="mt-1">
                        Make any necessary changes and export your project
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="flex justify-center">
                  <Link to="/generate">
                    <Button className="bg-brand-purple hover:bg-brand-purple/90">
                      Try It Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generation">
            <Card>
              <CardHeader>
                <CardTitle>AI Generation Guide</CardTitle>
                <CardDescription>
                  Learn how to use our AI to generate custom projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">
                  Our AI generation feature uses advanced models to create complete projects based on your description and requirements. Here's how to make the most of it.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">How It Works</h3>
                  <p className="text-gray-700">
                    The AI generation process involves four main steps:
                  </p>
                  <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                    <li>
                      <strong>Project Type and Description:</strong> Specify what kind of project you want to build and provide a description of its purpose and functionality.
                    </li>
                    <li>
                      <strong>Feature Selection:</strong> Choose from suggested features based on your project type or add custom features.
                    </li>
                    <li>
                      <strong>Tech Stack Selection:</strong> Select the technologies you want to use in your project.
                    </li>
                    <li>
                      <strong>Generation and Review:</strong> Our AI generates the complete project structure and code, which you can review and download.
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Tips for Better Results</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Be as specific as possible in your project description</li>
                    <li>Include all key features you want in your application</li>
                    <li>Select a consistent tech stack that works well together</li>
                    <li>Review the generated code and make adjustments as needed</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Link to="/generate">
                    <Button className="bg-brand-purple hover:bg-brand-purple/90">
                      Try AI Generation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Using Templates</CardTitle>
                <CardDescription>
                  Learn how to use and customize our pre-built templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">
                  Our template library contains a variety of pre-built projects for different use cases. Templates provide a faster way to get started with a well-structured project.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Browse Templates</h3>
                  <p className="text-gray-700">
                    Templates are organized by categories such as Dashboard, E-commerce, Portfolio, and Blog. You can also search for specific templates by name or technology.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Customizing Templates</h3>
                  <p className="text-gray-700">
                    After selecting a template, you can customize it in several ways:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Modify the theme and styling</li>
                    <li>Add or remove features</li>
                    <li>Change the data structure</li>
                    <li>Update the content</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Template Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-2">Dashboard Templates</h4>
                      <p className="text-sm text-gray-600">
                        Admin panels, analytics dashboards, and data visualization interfaces
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-2">E-commerce Templates</h4>
                      <p className="text-sm text-gray-600">
                        Online stores, product catalogs, and shopping cart systems
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-2">Portfolio Templates</h4>
                      <p className="text-sm text-gray-600">
                        Personal websites, project showcases, and professional profiles
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-2">Blog Templates</h4>
                      <p className="text-sm text-gray-600">
                        Content management systems, publication platforms, and news sites
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link to="/templates">
                    <Button className="bg-brand-purple hover:bg-brand-purple/90">
                      Browse Templates
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Learn how to use our API to integrate Project Alchemy with your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">
                  Project Alchemy provides a RESTful API that allows you to programmatically generate projects, access templates, and manage your account. This section covers the basics of using our API.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Authentication</h3>
                  <p className="text-gray-700">
                    All API requests require authentication using an API key. You can generate an API key in your account settings.
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto">
                    <pre className="text-sm">
                      <code>
                        {`curl -X GET \\
  https://api.projectalchemy.com/v1/templates \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Endpoints</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Endpoint
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            /v1/generate
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            POST
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Generate a project using AI
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            /v1/templates
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            GET
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Get all available templates
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            /v1/templates/:id
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            GET
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Get a specific template
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            /v1/projects
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            GET
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Get all your projects
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">API Access</h3>
                  <p className="text-blue-700">
                    API access is available on Pro and Team plans. For more detailed API documentation, please see our full API reference.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline">
                    Full API Reference
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Docs;
