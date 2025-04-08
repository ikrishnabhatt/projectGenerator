
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCustomizationForm from "@/components/ai/ProjectCustomizationForm";
import AIPlusGenerator from "@/components/ai/AIPlusGenerator";

const Generate: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");

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
            <ProjectCustomizationForm />
          </TabsContent>
          
          <TabsContent value="aiplus" className="mt-6">
            <AIPlusGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Generate;
