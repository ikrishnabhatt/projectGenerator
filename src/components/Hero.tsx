import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with new gradient colors */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E1F7F5] via-[#F6F8D5] to-[#E1F7F5]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(225,247,245,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(246,248,213,0.2),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#5A9C99] animate-fade-in">
            <span className="bg-gradient-to-r from-[#5A9C99] to-[#A1A55C] bg-clip-text text-transparent">
              Build Complete Projects
            </span>{" "}
            Instantly
          </h1>
          <p className="mt-6 text-xl text-[#A1A55C] animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Choose your preferred creation method and get a ready-to-use project with both
            frontend and backend code.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-[#5A9C99] to-[#A1A55C] hover:opacity-90 shadow-lg shadow-gray-500/20 text-white">
                Start with Templates
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-[#A1A55C] hover:border-[#5A9C99] text-[#A1A55C] hover:text-[#5A9C99]">
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
