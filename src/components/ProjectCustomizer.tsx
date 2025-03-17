
import { useState, useEffect } from 'react';
import { ProjectTemplate } from '@/lib/templates';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ProjectOptions } from '@/utils/projectGenerator';
import { 
  Check, 
  Download, 
  ChevronLeft, 
  Edit, 
  Database, 
  Palette,
  Server,
  Code
} from 'lucide-react';

interface ProjectCustomizerProps {
  template: ProjectTemplate;
  initialOptions: ProjectOptions;
  onBack: () => void;
  onGenerate: (options: ProjectOptions) => void;
  isGenerating: boolean;
}

const ProjectCustomizer = ({ 
  template, 
  initialOptions,
  onBack, 
  onGenerate,
  isGenerating 
}: ProjectCustomizerProps) => {
  const { toast } = useToast();
  const [options, setOptions] = useState<ProjectOptions>(initialOptions);
  const [activeTab, setActiveTab] = useState('general');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isGenerating]);

  const updateOption = (key: keyof ProjectOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = () => {
    if (!options.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }

    onGenerate(options);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Preview Column */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
          <div className="h-56 overflow-hidden">
            <img 
              src={template.image} 
              alt={template.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="space-y-1">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold mb-2">Tech Stack:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">React</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">Tailwind CSS</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">TypeScript</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                  {options.backendType === 'express' ? 'Node.js' : 
                   options.backendType === 'django' ? 'Python' :
                   options.backendType === 'laravel' ? 'PHP' : 'Frontend Only'}
                </span>
                {options.database !== 'none' && (
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                    {options.database.charAt(0).toUpperCase() + options.database.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customization Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Customize Your Project</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center">
                <Edit className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" /> Design
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex items-center">
                <Server className="h-4 w-4 mr-2" /> Backend
              </TabsTrigger>
              <TabsTrigger value="frontend" className="flex items-center">
                <Code className="h-4 w-4 mr-2" /> Frontend
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  value={options.name} 
                  onChange={(e) => updateOption('name', e.target.value)}
                  placeholder="Enter project name"
                  disabled={isGenerating}
                />
                <p className="text-sm text-gray-500">
                  This will be used as the folder and package name.
                </p>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Project Type</Label>
                <RadioGroup 
                  value={options.projectType} 
                  onValueChange={(value) => updateOption('projectType', value)}
                  className="grid grid-cols-2 gap-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.projectType === 'react' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="react" id="react" />
                    <Label htmlFor="react" className="cursor-pointer flex-1">
                      <div className="font-medium">React</div>
                      <div className="text-sm text-gray-500">Modern UI library</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.projectType === 'vue' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="vue" id="vue" />
                    <Label htmlFor="vue" className="cursor-pointer flex-1">
                      <div className="font-medium">Vue</div>
                      <div className="text-sm text-gray-500">Progressive framework</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Package Manager</Label>
                <RadioGroup 
                  value={options.packageManager} 
                  onValueChange={(value) => updateOption('packageManager', value)}
                  className="grid grid-cols-3 gap-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.packageManager === 'npm' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="npm" id="npm" />
                    <Label htmlFor="npm" className="cursor-pointer font-medium">npm</Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.packageManager === 'yarn' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="yarn" id="yarn" />
                    <Label htmlFor="yarn" className="cursor-pointer font-medium">yarn</Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.packageManager === 'pnpm' ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="pnpm" id="pnpm" />
                    <Label htmlFor="pnpm" className="cursor-pointer font-medium">pnpm</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-5 gap-3">
                  {['blue', 'green', 'purple', 'red', 'gray'].map((color) => (
                    <div 
                      key={color}
                      className={`
                        h-12 rounded-md cursor-pointer 
                        ${color === 'blue' ? 'bg-blue-500' : 
                          color === 'green' ? 'bg-green-500' : 
                          color === 'purple' ? 'bg-purple-500' : 
                          color === 'red' ? 'bg-red-500' : 
                          'bg-gray-700'}
                        ${options.colorTheme === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                      `}
                      onClick={() => !isGenerating && updateOption('colorTheme', color)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Font Family</Label>
                <RadioGroup 
                  value={options.fontFamily} 
                  onValueChange={(value) => updateOption('fontFamily', value)}
                  className="grid grid-cols-2 gap-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.fontFamily === 'inter' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="inter" id="inter" />
                    <Label htmlFor="inter" className="cursor-pointer flex-1">
                      <div className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</div>
                      <div className="text-sm text-gray-500">Modern, clean</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.fontFamily === 'serif' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="serif" id="serif" />
                    <Label htmlFor="serif" className="cursor-pointer flex-1">
                      <div className="font-medium" style={{ fontFamily: 'serif' }}>Merriweather</div>
                      <div className="text-sm text-gray-500">Classic, readable</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>UI Layout</Label>
                <RadioGroup 
                  value={options.uiLayout} 
                  onValueChange={(value) => updateOption('uiLayout', value)}
                  className="grid grid-cols-2 gap-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.uiLayout === 'modern' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="modern" id="modern" />
                    <Label htmlFor="modern" className="cursor-pointer flex-1">
                      <div className="font-medium">Modern</div>
                      <div className="text-sm text-gray-500">Clean, minimalist</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.uiLayout === 'classic' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="classic" id="classic" />
                    <Label htmlFor="classic" className="cursor-pointer flex-1">
                      <div className="font-medium">Classic</div>
                      <div className="text-sm text-gray-500">Traditional layout</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="backend" className="space-y-4">
              <div className="space-y-2">
                <Label>Backend Type</Label>
                <RadioGroup 
                  value={options.backendType} 
                  onValueChange={(value) => updateOption('backendType', value)}
                  className="grid grid-cols-2 gap-4 mb-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.backendType === 'express' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer flex-1">
                      <div className="font-medium">Express</div>
                      <div className="text-sm text-gray-500">Node.js framework</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.backendType === 'django' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="django" id="django" />
                    <Label htmlFor="django" className="cursor-pointer flex-1">
                      <div className="font-medium">Django</div>
                      <div className="text-sm text-gray-500">Python framework</div>
                    </Label>
                  </div>
                </RadioGroup>
                <RadioGroup 
                  value={options.backendType} 
                  onValueChange={(value) => updateOption('backendType', value)}
                  className="grid grid-cols-2 gap-4"
                  disabled={isGenerating}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.backendType === 'laravel' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="laravel" id="laravel" />
                    <Label htmlFor="laravel" className="cursor-pointer flex-1">
                      <div className="font-medium">Laravel</div>
                      <div className="text-sm text-gray-500">PHP framework</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${options.backendType === 'none' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="none" id="none-backend" />
                    <Label htmlFor="none-backend" className="cursor-pointer flex-1">
                      <div className="font-medium">None</div>
                      <div className="text-sm text-gray-500">Frontend only</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Database</Label>
                <RadioGroup 
                  value={options.database} 
                  onValueChange={(value) => updateOption('database', value)}
                  className="grid grid-cols-3 gap-4"
                  disabled={isGenerating || options.backendType === 'none'}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.database === 'mongodb' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="mongodb" id="mongodb" disabled={options.backendType === 'none'} />
                    <Label htmlFor="mongodb" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">MongoDB</div>
                      <div className="text-sm text-gray-500">NoSQL</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.database === 'postgresql' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="postgresql" id="postgresql" disabled={options.backendType === 'none'} />
                    <Label htmlFor="postgresql" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">PostgreSQL</div>
                      <div className="text-sm text-gray-500">SQL</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.database === 'sqlite' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="sqlite" id="sqlite" disabled={options.backendType === 'none'} />
                    <Label htmlFor="sqlite" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">SQLite</div>
                      <div className="text-sm text-gray-500">File-based</div>
                    </Label>
                  </div>
                </RadioGroup>
                {options.backendType === 'none' && (
                  <p className="text-sm text-amber-600">Enable a backend to use databases</p>
                )}
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Authentication</Label>
                <RadioGroup 
                  value={options.authentication} 
                  onValueChange={(value) => updateOption('authentication', value)}
                  className="grid grid-cols-3 gap-4"
                  disabled={isGenerating || options.backendType === 'none'}
                >
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.authentication === 'jwt' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="jwt" id="jwt" disabled={options.backendType === 'none'} />
                    <Label htmlFor="jwt" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">JWT</div>
                      <div className="text-sm text-gray-500">Token-based</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.authentication === 'oauth' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="oauth" id="oauth" disabled={options.backendType === 'none'} />
                    <Label htmlFor="oauth" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">OAuth</div>
                      <div className="text-sm text-gray-500">Social login</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    options.authentication === 'none' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  } ${options.backendType === 'none' ? 'opacity-50' : ''}`}>
                    <RadioGroupItem value="none" id="none-auth" disabled={options.backendType === 'none'} />
                    <Label htmlFor="none-auth" className={`cursor-pointer flex-1 ${options.backendType === 'none' ? 'text-gray-400' : ''}`}>
                      <div className="font-medium">None</div>
                      <div className="text-sm text-gray-500">No auth</div>
                    </Label>
                  </div>
                </RadioGroup>
                {options.backendType === 'none' && (
                  <p className="text-sm text-amber-600">Enable a backend to use authentication</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="frontend" className="space-y-4">
              <div className="space-y-2">
                <Label>UI Components</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <input 
                      type="checkbox" 
                      id="responsive" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={true}
                      readOnly
                    />
                    <Label htmlFor="responsive" className="ml-2 cursor-pointer flex-1">
                      <div className="font-medium">Responsive Design</div>
                      <div className="text-sm text-gray-500">Adapt to all screens</div>
                    </Label>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <input 
                      type="checkbox" 
                      id="darkmode" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={true}
                      readOnly
                    />
                    <Label htmlFor="darkmode" className="ml-2 cursor-pointer flex-1">
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-gray-500">Light/dark themes</div>
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Framework</Label>
                <Select 
                  value={options.projectType === 'react' ? 'react' : 'vue'}
                  onValueChange={(value) => updateOption('projectType', value)}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React with TypeScript</SelectItem>
                    <SelectItem value="vue">Vue with TypeScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>CSS Framework</Label>
                <Select
                  defaultValue="tailwind"
                  disabled={true}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CSS framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">All projects use Tailwind CSS for styling</p>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Extra Features</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center p-3 rounded-lg border border-gray-200">
                    <input 
                      type="checkbox" 
                      id="animations" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={true}
                      readOnly
                    />
                    <Label htmlFor="animations" className="ml-2 cursor-pointer flex-1">
                      <div className="font-medium">Animations</div>
                      <div className="text-sm text-gray-500">Smooth transitions and effects</div>
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <Button 
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating Project... {progress}%
                </>
              ) : (
                "Generate Project"
              )}
            </Button>
            <p className="text-sm text-center text-gray-500 mt-2">
              {isGenerating 
                ? "This may take a few moments, please wait..."
                : "This will create a complete project based on your selections"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCustomizer;
