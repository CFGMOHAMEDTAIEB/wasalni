import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient, AuthResponse } from '../services/apiClient';

export type UserRole = 'guest' | 'normal' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  rating?: number;
  reviews?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loginWithAPI: (email: string, password: string, role?: UserRole) => Promise<void>;
  registerWithAPI: (name: string, email: string, password: string, phone?: string, role?: UserRole) => Promise<void>;
  setUserRole: (role: UserRole) => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Guest user template
const guestUser: User = {
  id: 'guest',
  name: 'Guest',
  email: '',
  role: 'guest',
  verified: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        apiClient.setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(guestUser);
      }
    } else {
      setUser(guestUser);
    }
  }, []);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    apiClient.setToken(token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authToken', token);
  };

  const loginWithAPI = async (email: string, password: string, role: UserRole = 'normal') => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await apiClient.login({ email, password, role });
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as UserRole,
        avatar: response.user.avatar,
        verified: response.user.verified,
        rating: response.user.rating,
        reviews: response.user.reviews,
      };
      login(newUser, response.token);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithAPI = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role: UserRole = 'normal'
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await apiClient.register({
        name,
        email,
        password,
        phone,
        role,
      });
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as UserRole,
        avatar: response.user.avatar,
        verified: response.user.verified,
        rating: response.user.rating,
        reviews: response.user.reviews,
      };
      login(newUser, response.token);
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(guestUser);
    apiClient.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const setUserRole = (role: UserRole) => {
    if (user && user.role !== 'guest') {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user && user.role !== 'guest') {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isAuthenticated: user?.role !== 'guest',
    isLoading,
    error,
    login,
    logout,
    loginWithAPI,
    registerWithAPI,
    setUserRole,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook to check if user has a specific role
export function useAuthRole(requiredRole: UserRole | UserRole[]) {
  const { user } = useAuth();
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return user ? roles.includes(user.role) : false;
}
