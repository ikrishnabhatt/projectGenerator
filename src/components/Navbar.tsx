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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-[#d1fffb] border-b border-[#5A9C99] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center font-bold text-xl"
              style={{ color: "#006A71" }} 
            >
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
                    ? "text-[#006A71] font-semibold"
                    : "text-[#5A9C99] hover:text-[#006A71]"
                } transition-colors`}
              >
                {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#006A71] font-bold">Hi, {user?.name}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm bg-[#5A9C99] text-white hover:bg-[#5A9C99]/90"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm text-[#5A9C99] hover:text-[#006A71]">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="default"
                    className="text-sm bg-[#006A71] hover:bg-[#006A71]/90 text-white"
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
                  <Menu className="text-[#5A9C99]" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#F6F8D5]">
                <div className="flex flex-col mt-8 space-y-4">
                  {["/templates", "/generate", "/docs", "/pricing"].map((path) => (
                    <Link
                      key={path}
                      to={path}
                      className="text-lg font-medium text-[#5A9C99] hover:text-[#006A71] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-[#A1A55C]">
                    {isAuthenticated ? (
                      <div className="flex flex-col space-y-4">
                        <span className="text-sm text-[#5A9C99] font-bold">Hi, {user?.name}</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                            navigate("/");
                          }}
                          className="bg-[#5A9C99] text-white hover:bg-[#5A9C99]/90"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full text-[#5A9C99] hover:text-[#006A71]">
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="default"
                            className="w-full bg-[#006A71] hover:bg-[#006A71]/90 text-white"
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
