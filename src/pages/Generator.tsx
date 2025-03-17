
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { templates } from '@/lib/templates';
import { 
  ChevronLeft, 
  Download, 
  Sparkles, 
  PanelLeft
} from 'lucide-react';
import AIGenerator from '@/components/AIGenerator';
import ProjectCustomizer from '@/components/ProjectCustomizer';
import TemplateSelector from '@/components/TemplateSelector';
import { ProjectOptions, generateProject, downloadProject } from '@/utils/projectGenerator';

type GeneratorStep = 'method-select' | 'ai-prompt' | 'template-select' | 'customize';

const Generator = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<GeneratorStep>(
    templateId ? 'customize' : 'method-select'
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateId ? templates.find(t => t.id === templateId) || null : null
  );
  const [generatingProject, setGeneratingProject] = useState(false);
  const [projectFile, setProjectFile] = useState<string | null>(null);
  const [projectOptions, setProjectOptions] = useState<ProjectOptions>({
    template: '',
    name: '',
    projectType: 'react',
    packageManager: 'npm',
    colorTheme: 'blue',
    fontFamily: 'inter',
    uiLayout: 'modern',
    backendType: 'express',
    database: 'mongodb',
    authentication: 'jwt'
  });
  
  const handleSelectMethod = (method: 'ai' | 'template') => {
    if (method === 'ai') {
      setStep('ai-prompt');
    } else {
      setStep('template-select');
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setProjectOptions({
      ...projectOptions,
      template: template.id,
      name: `my-${template.id}`
    });
    setStep('customize');
  };

  const handleAIComplete = (template, options) => {
    setSelectedTemplate(template);
    setProjectOptions({
      ...projectOptions,
      ...options,
      template: template.id
    });
    setStep('customize');
  };

  const handleBack = () => {
    if (step === 'ai-prompt' || step === 'template-select') {
      setStep('method-select');
    } else if (step === 'customize') {
      if (templateId) {
        navigate('/');
      } else {
        setStep(selectedTemplate ? 'template-select' : 'method-select');
      }
    }
  };

  const handleGenerateProject = async (options: ProjectOptions) => {
    setGeneratingProject(true);
    try {
      const fileName = await generateProject(options);
      setProjectFile(fileName);
    } catch (error) {
      console.error("Error generating project:", error);
    } finally {
      setGeneratingProject(false);
    }
  };

  const handleDownload = () => {
    if (projectFile) {
      downloadProject(projectFile);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="https://illustrations.popsy.co/amber/rocket.svg" 
              alt="ChaturCraft" 
              className="h-10 w-10" 
            />
            <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              ChaturCraft
            </h1>
          </div>
          
          {step !== 'method-select' && (
            <Button variant="ghost" className="ml-auto mr-4" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === 'method-select' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Choose How to Create Your Project</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Generation Option */}
              <div 
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 h-full border border-transparent hover:border-purple-200 cursor-pointer"
                onClick={() => handleSelectMethod('ai')}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Generate with AI</h3>
                <p className="text-gray-600 text-center mb-6">
                  Describe what you want to build and let our AI create the perfect project for you.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">Describe your project in natural language</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">AI understands your requirements</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">Custom generated code for your needs</p>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 w-full">
                    <Sparkles className="mr-2 h-4 w-4" /> Start with AI
                  </Button>
                </div>
              </div>
              
              {/* Template Option */}
              <div 
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 h-full border border-transparent hover:border-blue-200 cursor-pointer"
                onClick={() => handleSelectMethod('template')}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <PanelLeft className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Use Templates</h3>
                <p className="text-gray-600 text-center mb-6">
                  Browse our collection of pre-built templates and customize them to your needs.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">30+ professional templates</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">Categorized by project type</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-600">Fully customizable designs and features</p>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 w-full">
                    <PanelLeft className="mr-2 h-4 w-4" /> Browse Templates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 'ai-prompt' && (
          <AIGenerator onComplete={handleAIComplete} />
        )}
        
        {step === 'template-select' && (
          <TemplateSelector templates={templates} onSelect={handleTemplateSelect} />
        )}
        
        {step === 'customize' && selectedTemplate && (
          <div className="mb-8">
            {projectFile ? (
              <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Your project is ready!</h2>
                <p className="text-gray-600 mb-6">
                  Your project has been generated successfully. Click below to download the ZIP file.
                </p>
                <Button onClick={handleDownload} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Download className="mr-2 h-5 w-5" /> Download Project
                </Button>
              </div>
            ) : (
              <ProjectCustomizer 
                template={selectedTemplate} 
                initialOptions={projectOptions}
                onBack={handleBack}
                onGenerate={handleGenerateProject}
                isGenerating={generatingProject}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Generator;
