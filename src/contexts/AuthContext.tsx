import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  batch?: string;
  role?: string;
  isMentorAvailable?: boolean;
  mentorCapacity?: number;
  activeMentees?: number;
  availability?: {
    days: string[];
    timeSlots: string[];
    preferredMeetingType: "video" | "audio" | "chat" | "in-person";
  };
  mentorshipPreferences?: {
    topics: string[];
    experienceLevel: string[];
    sessionDuration: number;
  };
  company?: string;
  position?: string;
  expertise?: string[];
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('AuthContext: Loading stored auth data...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      console.log('AuthContext: Found stored auth data', { token: storedToken.substring(0, 20) + '...', user: JSON.parse(storedUser).email });
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      console.log('AuthContext: No stored auth data found');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login for', email);
      const response = await loginService({ email, password });
      console.log('AuthContext: Login successful', { token: response.token.substring(0, 20) + '...', userId: response.user.id });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('AuthContext: Login failed', err.response?.data?.message);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Registration now just sends verification email, doesn't log user in
      await registerService({ name, email, password });
      // Don't set token or user - they need to verify email first
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Registration error details:', error);
      console.error('Error response:', err.response);
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
