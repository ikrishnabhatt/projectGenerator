
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from 'lucide-react';
import { templates } from '@/lib/templates';
import { useToast } from "@/components/ui/use-toast";

interface AIGeneratorProps {
  onComplete: (template: any, options: any) => void;
}

const AIGenerator = ({ onComplete }: AIGeneratorProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleGenerate = () => {
    if (prompt.trim().length < 15) {
      toast({
        title: "Prompt too short",
        description: "Please provide a more detailed description of your project",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // For demo purposes, just select a random template
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        // Simulate some AI-detected options based on the prompt
        const detectedOptions = {
          name: `my-${randomTemplate.id}`,
          projectType: 'react',
          packageManager: 'npm',
          colorTheme: 'blue',
          fontFamily: 'inter',
          uiLayout: 'modern',
          backendType: prompt.toLowerCase().includes('database') ? 'express' : 'none',
          database: prompt.toLowerCase().includes('mongodb') ? 'mongodb' : 
                   prompt.toLowerCase().includes('sql') ? 'postgresql' : 'none',
          authentication: prompt.toLowerCase().includes('auth') || 
                         prompt.toLowerCase().includes('login') ? 'jwt' : 'none'
        };
        
        toast({
          title: "AI analysis complete",
          description: "We've analyzed your requirements and prepared a solution",
        });
        
        setTimeout(() => {
          setIsGenerating(false);
          onComplete(randomTemplate, detectedOptions);
        }, 500);
      }
    }, 100);
  };
  
  const examplePrompts = [
    "Create an e-commerce site with product listings, shopping cart, and secure checkout",
    "Build a blog platform with markdown support and categorization",
    "Make a dashboard for monitoring IoT devices with real-time data visualization",
    "Create a portfolio website with project showcase and contact form"
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate with AI</h1>
      <p className="text-gray-600 mb-8 text-center">
        Describe your project in detail, and our AI will generate the perfect solution for you.
      </p>
      
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Describe Your Project</h2>
        <Textarea
          placeholder="E.g., I need a dashboard for my fitness app with user authentication, workout tracking, and progress visualization..."
          className="min-h-[150px] mb-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <Button 
          onClick={handleGenerate} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Analyzing Requirements... {progress}%
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Project
            </>
          )}
        </Button>
      </div>
      
      {!isGenerating && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-3">Example Prompts</h3>
          <div className="space-y-2">
            {examplePrompts.map((examplePrompt, index) => (
              <div 
                key={index}
                className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => setPrompt(examplePrompt)}
              >
                <p className="text-gray-800">{examplePrompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isGenerating && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 20 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {progress >= 20 && <span className="text-green-600 text-xs">✓</span>}
                </div>
              </div>
              <div className="ml-3">
                <p className="font-medium">Analyzing requirements</p>
                <p className="text-sm text-gray-600">Understanding your project needs</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 40 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {progress >= 40 && <span className="text-green-600 text-xs">✓</span>}
                </div>
              </div>
              <div className="ml-3">
                <p className="font-medium">Selecting best template</p>
                <p className="text-sm text-gray-600">Finding the most suitable starting point</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 60 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {progress >= 60 && <span className="text-green-600 text-xs">✓</span>}
                </div>
              </div>
              <div className="ml-3">
                <p className="font-medium">Configuring features</p>
                <p className="text-sm text-gray-600">Setting up the technical specifications</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 80 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {progress >= 80 && <span className="text-green-600 text-xs">✓</span>}
                </div>
              </div>
              <div className="ml-3">
                <p className="font-medium">Preparing solution</p>
                <p className="text-sm text-gray-600">Getting everything ready for customization</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
