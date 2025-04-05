import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTemplates, getTemplatesByCategory, Template, downloadTemplate } from "@/services/templateService";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PopularTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = ["All", "Dashboard", "E-commerce", "Portfolio", "Blog"];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        let data;
        if (activeCategory === "All") {
          data = await getAllTemplates();
        } else {
          data = await getTemplatesByCategory(activeCategory);
        }
        // Only show the top 6 templates on the homepage
        setTemplates(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [activeCategory]);

  const handleDownload = async (template: Template, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDownloadingId(template.id);
    try {
      // Download the template as a ZIP file
      const downloadUrl = await downloadTemplate(template);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`${template.name} template download started`);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenGithub = (githubUrl: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (githubUrl) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-16 bg-[#d1fffb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 text-[#5A9C99]">Popular Templates</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "bg-[#5A9C99] hover:bg-[#5A9C99]/90 text-white" : "border-[#A1A55C] hover:border-[#5A9C99] text-[#A1A55C]"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden bg-[#F6F8D5]">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
            : templates.map((template) => (
                <Link to={`/templates/${template.id}`} key={template.id}>
                  <Card className="overflow-hidden template-card h-full bg-[#F6F8D5] border-t-4 border-[#A1A55C] rounded-lg">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="template-image h-48 w-full object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg mb-1 text-[#5A9C99]">{template.name}</h3>
                          <p className="text-sm text-[#A1A55C] mb-3">{template.description}</p>
                          {template.author && (
                            <p className="text-xs text-gray-400 mb-3">
                              Created by: {template.author}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                          {template.category}
                        </span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => handleDownload(template, e)}
                          disabled={downloadingId === template.id}
                          className="border-[#A1A55C] hover:border-[#5A9C99] text-[#A1A55C]"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {downloadingId === template.id ? "Downloading..." : "Download"}
                        </Button>
                        {template.githubUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => handleOpenGithub(template.githubUrl, e)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            GitHub
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTemplates;
 