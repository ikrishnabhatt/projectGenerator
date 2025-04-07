
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateWithAI } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";

const AIPlusGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{html?: string; css?: string; js?: string} | null>(null);
  const [activeTab, setActiveTab] = useState("html");
  const { user, updateCredits } = useAuth();
  const [modelStatus, setModelStatus] = useState("");
  
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
      setModelStatus("Loading AI model...");
      
      // Use the updated AI generation service
      const result = await generateWithAI(prompt);
      
      // If not superuser or PRO, deduct credits
      if (!user?.isPro && !user?.isSuperUser) {
        updateCredits((user?.credits || 0) - 10);
        toast({
          title: "Credits Used",
          description: "10 credits have been deducted for this AI+ generation.",
        });
      }
      
      setGeneratedCode(result);
      setActiveTab("html"); // Reset to HTML tab after generation
      
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

  return (
    <div className="space-y-6">
      <Card>
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
            
            <Textarea
              placeholder="Describe your project in detail. For example: 'Create a responsive landing page for a coffee shop with a hero section, product showcase, about us section, and contact form. Use earthy colors like brown and green.'"
              className="h-40 resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="flex flex-col space-y-2">
              {modelStatus && (
                <div className="text-sm text-blue-500">
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
                    <span className="text-green-500 font-semibold">Unlimited generations (PRO)</span>
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
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Generated Project</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <pre className="p-4 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto">
                    <code className="text-sm">{generatedCode.html || "No HTML content generated"}</code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="css" className="mt-4">
                <div className="relative">
                  <pre className="p-4 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto">
                    <code className="text-sm">{generatedCode.css || "No CSS content generated"}</code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="js" className="mt-4">
                <div className="relative">
                  <pre className="p-4 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto">
                    <code className="text-sm">{generatedCode.js || "No JavaScript content generated"}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPlusGenerator;
