
import { Button } from "@/components/ui/button";
import { ProjectTemplate } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";

interface ProjectTemplateCardProps {
  template: ProjectTemplate;
  onSelect: () => void;
}

const ProjectTemplateCard = ({ template, onSelect }: ProjectTemplateCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={template.image} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-gray-800 text-white hover:bg-gray-700">
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
        <p className="text-gray-600 mb-4 h-12 line-clamp-2">{template.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Complexity:</span>
            <Badge variant={
              template.complexity === 'beginner' ? 'outline' : 
              template.complexity === 'intermediate' ? 'secondary' : 'default'
            } className="text-xs">
              {template.complexity}
            </Badge>
          </div>
          <Button onClick={onSelect}>
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplateCard;
