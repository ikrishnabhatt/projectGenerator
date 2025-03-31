
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with pattern and overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/4a7b9440-eda6-4273-bebc-4a08e6ae4c26.png')] bg-center bg-cover opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(124,58,237,0.1),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 animate-fade-in">
            <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              Build Complete Projects
            </span>{" "}
            Instantly
          </h1>
          <p className="mt-6 text-xl text-gray-600 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Choose your preferred creation method and get a ready-to-use project with both
            frontend and backend code.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/generate">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 shadow-lg shadow-purple-500/20">
                Start with AI
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-gray-300 hover:border-brand-purple">
                Browse Templates
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-white p-4 rounded-lg shadow-xl max-w-xl">
              <img 
                src="/lovable-uploads/4a7b9440-eda6-4273-bebc-4a08e6ae4c26.png" 
                alt="Project preview" 
                className="rounded-md w-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
