
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backgroundImages } from "@/assets/template-thumbnails";
// import Footer from "@/components/Footer";

const Docs = () => {
  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative bg-background text-foreground">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black" />
          <div 
            className="absolute inset-0 bg-center bg-cover" 
            style={{ backgroundImage: `url(${backgroundImages.docs})`, opacity: 0.05 }}
          />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Documentation</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about creating and managing your projects
            </p>
          </div>
          
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-muted text-muted-foreground">
              <TabsTrigger value="getting-started" className="data-[state=active]:text-foreground">Getting Started</TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:text-foreground">Using Templates</TabsTrigger>
              <TabsTrigger value="ai-generator" className="data-[state=active]:text-foreground">AI Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started">
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle>Getting Started Guide</CardTitle>
                  <CardDescription>
                    Learn the basics of creating projects with our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Welcome to Our Platform</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our platform helps you quickly build complete web applications using a combination of templates, AI-powered code generation, and expert assistance. This guide will help you understand the basics and get started with your first project.
                    </p>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Creating Your First Project</h3>
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Choose Your Approach</h4>
                      <p className="text-gray-600 dark:text-gray-300 pl-4">
                        You can start by using a template, generating code with AI, or requesting expert assistance.
                      </p>
                      
                      <h4 className="font-medium">2. Customize Your Project</h4>
                      <p className="text-gray-600 dark:text-gray-300 pl-4">
                        Edit the code, add features, and make the project your own.
                      </p>
                      
                      <h4 className="font-medium">3. Download or Deploy</h4>
                      <p className="text-gray-600 dark:text-gray-300 pl-4">
                        Once you're satisfied, download your project or deploy it directly to your hosting service.
                      </p>
                    </div>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Account Management</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your account gives you access to all features based on your subscription plan. You can view and manage your projects from the dashboard.
                    </p>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle>Using Templates</CardTitle>
                  <CardDescription>
                    How to effectively use our pre-built templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Finding the Right Template</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Browse our template library, filter by category, and find the perfect starting point for your project. Each template includes both frontend and backend code.
                    </p>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Customizing Templates</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Once you've selected a template, you can customize it to fit your specific needs:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Change colors, fonts, and layouts</li>
                      <li>Add or remove features</li>
                      <li>Integrate with your existing systems</li>
                      <li>Modify the database structure</li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Template Best Practices</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      To get the most out of our templates:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Read the documentation included with each template</li>
                      <li>Start with the simplest version and add complexity as needed</li>
                      <li>Use the template's existing patterns when adding new features</li>
                      <li>Keep the responsive design intact when making changes</li>
                    </ul>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-generator">
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle>AI Generator</CardTitle>
                  <CardDescription>
                    How to effectively use our AI code generation tool
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Getting Started with AI Generation</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our AI generator creates complete, production-ready code based on your requirements. To get the best results:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Be specific about what you want to build</li>
                      <li>Include all important features and requirements</li>
                      <li>Specify your preferred technology stack</li>
                      <li>Provide context on your project's purpose</li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Understanding AI-Generated Code</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      The AI generates both frontend and backend code. You'll get:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Frontend UI components and logic</li>
                      <li>Backend API endpoints and database models</li>
                      <li>A complete project structure</li>
                      <li>Integration between frontend and backend</li>
                    </ul>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-medium">Fine-tuning AI Results</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      After generating code, you can:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Download the complete project as a ZIP file</li>
                      <li>Copy specific code snippets as needed</li>
                      <li>Regenerate with more specific requirements</li>
                      <li>Ask for expert help if the generated code needs adjustments</li>
                    </ul>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Docs;
