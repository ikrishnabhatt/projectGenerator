import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Enhanced gradient background with proper dark mode support */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
      
      {/* Decorative elements with dark mode adjustments */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-fade-in">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 dark:from-purple-400 dark:via-pink-300 dark:to-teal-300 text-transparent bg-clip-text">
              Build Complete Projects
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 dark:from-blue-300 dark:via-violet-300 dark:to-indigo-300 text-transparent bg-clip-text">
              Instantly
            </span>
          </h1>
          <p className="mt-6 text-xl text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Choose your preferred creation method and get a ready-to-use project with both
            frontend and backend code.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 shadow-lg shadow-purple-500/20 text-white border-0 dark:shadow-purple-900/30">
                Start with Templates
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-primary hover:border-primary/80 text-foreground backdrop-blur-sm">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
