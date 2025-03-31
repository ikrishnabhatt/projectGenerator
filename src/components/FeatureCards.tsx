
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Code, Users, ArrowRight } from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      id: "ai",
      title: "Generate with AI",
      description: "Let our AI understand your needs and generate a complete project tailored for you.",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-100 text-brand-purple mb-4 shadow-md shadow-purple-200">
          <Bot className="h-7 w-7" />
        </div>
      ),
      details: "Let our AI understand your needs and generate a complete project tailored for you.",
      buttonText: "Start with AI",
      link: "/generate"
    },
    {
      id: "templates",
      title: "Use Templates",
      description: "Choose from our curated templates and customize them to fit your specific needs.",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4 shadow-md shadow-blue-200">
          <Code className="h-7 w-7" />
        </div>
      ),
      details: "Choose from our curated templates and customize them to fit your specific needs.",
      buttonText: "Browse Templates",
      link: "/templates"
    },
    {
      id: "expert",
      title: "Create by Expert",
      description: "Work with our professional developers to build a custom solution for your business.",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 mb-4 shadow-md shadow-yellow-200">
          <Users className="h-7 w-7" />
        </div>
      ),
      details: "Work with our professional developers to build a custom solution for your business.",
      buttonText: "Contact Experts",
      link: "/create-by-experts",
      premium: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Creation Method</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Multiple ways to get the perfect project for your needs, from AI-powered generation to professional development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={feature.id} className="card-hover h-full relative overflow-hidden border-t-4 transition-all duration-300" 
              style={{ 
                borderTopColor: index === 0 ? '#7c3aed' : index === 1 ? '#3b82f6' : '#eab308',
                borderRadius: '0.75rem',
              }}
            >
              {feature.premium && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                  Premium
                </div>
              )}
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <CardDescription className="mb-6 text-gray-600">
                  {feature.description}
                </CardDescription>
                <Link to={feature.link} className="mt-auto w-full">
                  <Button 
                    variant={index === 0 ? "default" : index === 1 ? "outline" : "secondary"}
                    className={`w-full group ${index === 0 ? "bg-brand-purple hover:bg-brand-purple/90" : ""}`}
                  >
                    {feature.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
