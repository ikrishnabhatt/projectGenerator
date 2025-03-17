
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import ProjectTemplateCard from '@/components/ProjectTemplateCard';
import { ProjectTemplate } from '@/lib/templates';

interface TemplateSelectorProps {
  templates: ProjectTemplate[];
  onSelect: (template: ProjectTemplate) => void;
}

const TemplateSelector = ({ templates, onSelect }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['all', 'dashboard', 'ecommerce', 'portfolio', 'blog', 'landing'];
  
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose a Template</h1>
      
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button 
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No templates found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <ProjectTemplateCard 
              key={template.id} 
              template={template} 
              onSelect={() => onSelect(template)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
