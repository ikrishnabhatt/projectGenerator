
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
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#d1fffb]">
          <Bot className="h-7 w-7 text-[#5A9C99]" />
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
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#F6F8D5]">
          <Code className="h-7 w-7 text-[#A1A55C]" />
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
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#D1E8FF]">
          <Users className="h-7 w-7 text-[#0056b3]" />
        </div>
      ),
      details: "Work with our professional developers to build a custom solution for your business.",
      buttonText: "Contact Experts",
      link: "/create-by-experts",
      premium: true
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-[#5A9C99]">Choose Your Creation Method</h2>
        <p className="text-[#A1A55C] max-w-2xl mx-auto">
          Multiple ways to get the perfect project for your needs, from AI-powered generation to professional development.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={feature.id} className="card-hover h-full relative overflow-hidden border-t-4 transition-all duration-300" 
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderTopColor: index === 0 ? '#5A9C99' : index === 1 ? '#A1A55C' : '#0056b3',
              borderRadius: '0.75rem',
              backdropFilter: "blur(8px)"
            }}
          >
            {feature.premium && (
              <div className="absolute top-3 right-3 bg-[#0056b3] text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                Premium
              </div>
            )}
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <CardTitle className={feature.premium ? "text-[#0056b3]" : "text-[#5A9C99]"}>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <CardDescription className={feature.premium ? "mb-6 text-[#0056b3]" : "mb-6 text-[#A1A55C]"}>
                {feature.description}
              </CardDescription>
              <Link to={feature.link} className="mt-auto w-full">
                <Button 
                  variant={index === 0 ? "default" : index === 1 ? "outline" : "secondary"}
                  className={`w-full group ${index === 0 ? "bg-[#5A9C99] hover:bg-[#5A9C99]/90 text-white" : index === 1 ? "border-[#A1A55C] hover:border-[#5A9C99] text-[#A1A55C]" : "bg-[#0056b3] hover:bg-[#0056b3]/90 text-white"}`}
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
  );
};

export default FeatureCards;
