
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
import ThemeToggle from "./ThemeToggle";

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
    <header className="w-full bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center font-bold text-xl text-primary"
            >
              <img src="/logo.svg" alt="ThynkAI Logo" className="h-8 w-8 mr-2" />
              <span>Thynk AI</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {["/templates", "/generate", "/docs", "/pricing"].map((path) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium ${
                  isActive(path)
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                } transition-colors`}
              >
                {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground font-bold">Hi, {user.name}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Login/Signup
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background">
                <div className="flex flex-col mt-8 space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center font-bold text-xl mb-6 text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img src="/logo.svg" alt="ThynkAI Logo" className="h-8 w-8 mr-2" />
                    <span>Thynk AI</span>
                  </Link>
                  
                  {["/templates", "/generate", "/docs", "/pricing"].map((path) => (
                    <Link
                      key={path}
                      to={path}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border">
                    {isAuthenticated && user ? (
                      <div className="flex flex-col space-y-4">
                        <span className="text-sm text-foreground font-bold">Hi, {user.name}</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                            navigate("/");
                          }}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="default"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Login/Signup
                        </Button>
                      </Link>
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
