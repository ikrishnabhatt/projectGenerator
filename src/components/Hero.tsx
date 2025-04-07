
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-blue-50 to-purple-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-fade-in">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 text-transparent bg-clip-text">
              Build Complete Projects
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 text-transparent bg-clip-text">
              Instantly
            </span>
          </h1>
          <p className="mt-6 text-xl text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Choose your preferred creation method and get a ready-to-use project with both
            frontend and backend code.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/generate">
              <Button size="lg" className="bg-primary hover:opacity-90 shadow-lg shadow-gray-500/20 text-primary-foreground">
                Start with Templates
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-primary hover:border-primary/80 text-foreground">
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
