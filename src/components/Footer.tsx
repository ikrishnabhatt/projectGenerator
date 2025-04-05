import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F6F8D5] pt-16 pb-8 border-t border-[#5A9C99]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center text-[#306b68] font-bold text-xl mb-4">
            <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="h-7 w-7 mr-2"
              >
                <image href="/logo.svg" width="26" height="26" />
              </svg>
              Thynk Ai
            </Link>
            <p className="text-sm text-gray-700 mb-4">
              Build complete projects instantly with AI-powered code generation.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-base mb-4 text-[#5A9C99]">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/generate" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  AI Generation
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-base mb-4 text-[#5A9C99]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-base mb-4 text-[#5A9C99]">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-[#5A9C99] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {currentYear} Thynk AI. All rights reserved.
        {/* <div className="border-t border-[#5A9C99]/30 pt-8">
          <p className="text-sm text-gray-700 text-center">
            &copy; {currentYear} Thynk Ai. All rights reserved. */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;