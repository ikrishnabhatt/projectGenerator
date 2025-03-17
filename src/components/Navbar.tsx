
import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-40 transition duration-500 ${isScrolled ? 'bg-netflix-background' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-16 py-6">
        <div className="flex items-center space-x-8">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
            alt="Netflix" 
            className="h-6"
          />
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-sm text-netflix-gray-light hover:text-white">Home</a>
            <a href="#" className="text-sm text-netflix-gray-light hover:text-white">TV Shows</a>
            <a href="#" className="text-sm text-netflix-gray-light hover:text-white">Movies</a>
            <a href="#" className="text-sm text-netflix-gray-light hover:text-white">New & Popular</a>
            <a href="#" className="text-sm text-netflix-gray-light hover:text-white">My List</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-netflix-gray-light hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-netflix-gray-light hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Profile" 
              className="w-8 h-8 rounded"
            />
            <ChevronDown className="h-4 w-4 text-netflix-gray-light" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
