
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProjectTemplateCard from '@/components/ProjectTemplateCard';
import { templates } from '@/lib/templates';
import { 
  Sparkles, 
  PanelLeft, 
  Users, 
  Zap, 
  Code2, 
  Database, 
  Download
} from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="./public/logo.png" 
              alt="Thynk AI" 
              className="h-12 w-12" 
            />
            <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Thynk AI
            </h1>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost">Templates</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Docs</Button>
            <Button variant="outline">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Build Complete Projects Instantly
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Choose your preferred creation method and get a ready-to-use project with both frontend and backend code.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {/* AI Generation Option */}
              <Link to="/generator" className="group">
                <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 h-full border border-transparent hover:border-purple-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Generate with AI</h3>
                  <p className="text-gray-600 text-center">
                    Let our AI understand your needs and generate a complete project tailored for you.
                  </p>
                  <div className="mt-6 text-center">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                      Start with AI
                    </Button>
                  </div>
                </div>
              </Link>
              
              {/* Template Option */}
              <Link to="/generator" className="group">
                <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 h-full border border-transparent hover:border-blue-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                    <PanelLeft className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Use Templates</h3>
                  <p className="text-gray-600 text-center">
                    Choose from our curated templates and customize them to fit your specific needs.
                  </p>
                  <div className="mt-6 text-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Browse Templates
                    </Button>
                  </div>
                </div>
              </Link>
              
              {/* Create by Expert Option */}
              <div className="group relative">
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium
                </div>
                <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 h-full border border-transparent hover:border-amber-200">
                  <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-amber-200 transition-colors">
                    <Users className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Create by Expert</h3>
                  <p className="text-gray-600 text-center">
                    Work with our professional developers to build a custom solution for your business.
                  </p>
                  <div className="mt-6 text-center">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      Contact Experts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Templates Grid */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Popular Templates</h2>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                <Button 
                  variant={selectedCategory === 'dashboard' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={selectedCategory === 'ecommerce' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('ecommerce')}
                >
                  E-commerce
                </Button>
                <Button 
                  variant={selectedCategory === 'portfolio' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('portfolio')}
                >
                  Portfolio
                </Button>
                <Button 
                  variant={selectedCategory === 'blog' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('blog')}
                >
                  Blog
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <ProjectTemplateCard 
                  key={template.id} 
                  template={template} 
                  onSelect={() => window.location.href = `/generator/${template.id}`} 
                />
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-24 mb-16">
            <h2 className="text-2xl font-bold mb-12 text-center">Why Choose ChaturCraft</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Generate complete projects in seconds, not hours or days.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Full-Stack Ready</h3>
                <p className="text-gray-600">Get both frontend and backend code with clean architecture.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Database Included</h3>
                <p className="text-gray-600">Projects come with database schemas and integration ready to go.</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <div className="p-8 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-2xl text-white max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Ready to build your next project?</h3>
                <p className="mb-6">Start generating complete full-stack applications today.</p>
                <Button size="lg" variant="outline" className="text-blue-950 border-white hover:bg-white hover:text-blue-600">
                  <Download className="mr-2 h-5 w-5" /> Start Generating
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ChaturCraft</h3>
              <p className="text-gray-400">
                Create powerful web applications instantly with AI-powered project generation.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 ChaturCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
