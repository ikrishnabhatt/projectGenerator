
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import authService, { LoginCredentials, RegisterData } from "@/services/authService";
import { toast } from "sonner";

// Define the shape of user object
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  isPro: boolean;
  isSuperUser?: boolean;
}

// Define the shape of auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
  upgradeToPro: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  signup: async () => false,
  logout: () => {},
  updateCredits: () => {},
  upgradeToPro: () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser as User);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user as User);
        localStorage.setItem("thynkai_token", response.token!);
        toast.success(`Welcome back, ${response.user.name}!`);
        return true;
      } else {
        toast.error(response.message || "Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success && response.user) {
        setUser(response.user as User);
        localStorage.setItem("thynkai_token", response.token!);
        toast.success(`Welcome to ThynkAI, ${response.user.name}!`);
        return true;
      } else {
        toast.error(response.message || "Could not create account");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup handler (wrapper for register to maintain compatibility with components using signup)
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    return register({ name, email, password });
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("thynkai_token");
    setUser(null);
    toast.success("You have been logged out.");
  };

  // Update user credits
  const updateCredits = (newCredits: number) => {
    if (user) {
      authService.updateUserCredits(user.id, newCredits);
      setUser({ ...user, credits: newCredits });
    }
  };

  // Upgrade user to pro
  const upgradeToPro = () => {
    if (user) {
      authService.upgradeUserToPro(user.id);
      setUser({ ...user, isPro: true });
      toast.success("Your account has been upgraded to PRO!");
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    signup,
    logout,
    updateCredits,
    upgradeToPro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
