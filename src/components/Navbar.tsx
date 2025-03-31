
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-brand-purple font-bold text-xl"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 mr-2" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7c3aed" strokeWidth="2"/>
                <path d="M12 8V16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 12L8 12" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Project Alchemy
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/templates"
              className={`text-sm font-medium ${
                isActive("/templates")
                  ? "text-brand-purple"
                  : "text-gray-600 hover:text-brand-purple"
              } transition-colors`}
            >
              Templates
            </Link>
            <Link
              to="/generate"
              className={`text-sm font-medium ${
                isActive("/generate")
                  ? "text-brand-purple"
                  : "text-gray-600 hover:text-brand-purple"
              } transition-colors`}
            >
              AI Generation
            </Link>
            <Link
              to="/docs"
              className={`text-sm font-medium ${
                isActive("/docs")
                  ? "text-brand-purple"
                  : "text-gray-600 hover:text-brand-purple"
              } transition-colors`}
            >
              Docs
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium ${
                isActive("/pricing")
                  ? "text-brand-purple"
                  : "text-gray-600 hover:text-brand-purple"
              } transition-colors`}
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-bold">Hi, {user?.name}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm bg-black text-white hover:bg-black/80"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="default"
                    className="text-sm bg-brand-purple hover:bg-brand-purple/90"
                  >
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-8 space-y-4">
                  <Link
                    to="/templates"
                    className="text-lg font-medium text-gray-700 hover:text-brand-purple transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <Link
                    to="/generate"
                    className="text-lg font-medium text-gray-700 hover:text-brand-purple transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AI Generation
                  </Link>
                  <Link
                    to="/docs"
                    className="text-lg font-medium text-gray-700 hover:text-brand-purple transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-lg font-medium text-gray-700 hover:text-brand-purple transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    {isAuthenticated ? (
                      <div className="flex flex-col space-y-4">
                        <span className="text-sm text-gray-700 font-bold">Hi, {user?.name}</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                            navigate("/");
                          }}
                          className="bg-black text-white hover:bg-black/80"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="default"
                            className="w-full bg-brand-purple hover:bg-brand-purple/90"
                          >
                            Signup
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
