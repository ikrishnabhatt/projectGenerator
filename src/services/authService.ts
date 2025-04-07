
// Simulated user database for demo purposes
// In production, this would be replaced with actual API calls to your backend
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  isPro: boolean;
  isSuperUser?: boolean;
}

// Sample user data for demonstration including a superuser
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@thynkai.com',
    password: 'admin123',
    credits: 999999, // Unlimited credits for admin
    isPro: true,
    isSuperUser: true // This is the superuser with unlimited credits
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    credits: 10,
    isPro: false
  }
];

// Token expiration in minutes
const TOKEN_EXPIRATION = 60;

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

class AuthService {
  private users: User[];
  
  constructor() {
    // Load users from local storage or use sample data
    const storedUsers = localStorage.getItem('thynkai_users');
    this.users = storedUsers ? JSON.parse(storedUsers) : sampleUsers;
    
    // Save sample users to local storage if not already there
    if (!storedUsers) {
      localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    }
    
    // Always ensure admin user exists with unlimited credits
    const adminUser = this.users.find(u => u.email === 'admin@thynkai.com');
    if (!adminUser) {
      this.users.push({
        id: 'admin-' + Date.now(),
        name: 'Admin User',
        email: 'admin@thynkai.com',
        password: 'admin123',
        credits: 999999,
        isPro: true,
        isSuperUser: true
      });
      localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    } else {
      // Ensure admin always has unlimited credits and superuser status
      adminUser.credits = 999999;
      adminUser.isPro = true;
      adminUser.isSuperUser = true;
      localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    }
  }
  
  // Login function
  login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!credentials || !credentials.email || !credentials.password) {
      return { success: false, message: 'Missing email or password' };
    }
    
    const { email, password } = credentials;
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    
    // Create session token
    const token = this.generateToken(user.id);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return { 
      success: true, 
      user: userWithoutPassword,
      token
    };
  }
  
  // Register function
  register = async (userData: RegisterData): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { email, password, name } = userData;
    
    // Check if user already exists
    if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already in use' };
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      credits: 5, // Starting credits for new users
      isPro: false
    };
    
    // Add to users array and save to localStorage
    this.users.push(newUser);
    localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    
    // Create session token
    const token = this.generateToken(newUser.id);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { 
      success: true, 
      user: userWithoutPassword,
      token
    };
  }
  
  // Get current user based on token
  getCurrentUser = () => {
    const token = localStorage.getItem('thynkai_token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp < Date.now() / 1000) {
        localStorage.removeItem('thynkai_token');
        return null;
      }
      
      const user = this.users.find(u => u.id === payload.sub);
      if (!user) return null;
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('thynkai_token');
      return null;
    }
  }
  
  // Simple token generator
  private generateToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      sub: userId,
      iat: now,
      exp: now + TOKEN_EXPIRATION * 60
    }));
    
    // In a real app, you would sign this token with a secret key
    return `${header}.${payload}.signature`;
  }
  
  // Update user credits
  updateUserCredits = (userId: string, credits: number) => {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      // Don't reduce credits for superuser
      if (this.users[userIndex].isSuperUser) {
        console.log("Superuser credits remain unlimited");
        return;
      }
      
      this.users[userIndex].credits = credits;
      localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    }
  }
  
  // Upgrade user to pro
  upgradeUserToPro = (userId: string) => {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      this.users[userIndex].isPro = true;
      localStorage.setItem('thynkai_users', JSON.stringify(this.users));
    }
  }
}

export default new AuthService();
