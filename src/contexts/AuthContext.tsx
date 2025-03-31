
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type SubscriptionTier = 'free' | 'pro' | 'team';

type User = {
  id: string;
  email: string;
  name: string;
  points: number;
  projectsGenerated: number;
  subscriptionTier: SubscriptionTier;
  subscriptionActive: boolean;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserPoints: (newPoints: number) => void;
  incrementProjectCount: () => void;
  checkRemainingGenerations: () => { canGenerate: boolean, remaining: number };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Simulated user database for demo purposes
const mockUsers = [
  {
    id: "user-123",
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
    points: 3,
    projectsGenerated: 0,
    subscriptionTier: 'free' as SubscriptionTier,
    subscriptionActive: true
  },
  {
    id: "user-456",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    points: 10,
    projectsGenerated: 2,
    subscriptionTier: 'pro' as SubscriptionTier,
    subscriptionActive: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for existing user (demo authentication)
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success("Successfully logged in!");
        return;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already in use
      if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      // For demo purposes only - in a real app, this would be a backend call
      const newUser = {
        id: "user-" + Date.now(),
        email,
        name,
        points: 3,
        projectsGenerated: 0,
        subscriptionTier: 'free' as SubscriptionTier,
        subscriptionActive: true
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const updateUserPoints = (newPoints: number) => {
    if (user) {
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const incrementProjectCount = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        projectsGenerated: user.projectsGenerated + 1,
        points: user.subscriptionTier === 'free' ? user.points - 1 : user.points
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const checkRemainingGenerations = () => {
    if (!user) {
      return { canGenerate: false, remaining: 0 };
    }

    if (user.subscriptionTier === 'free') {
      return { 
        canGenerate: user.points > 0, 
        remaining: user.points 
      };
    }
    
    // Pro or team users have unlimited generations
    return { canGenerate: true, remaining: Infinity };
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    updateUserPoints,
    incrementProjectCount,
    checkRemainingGenerations
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
