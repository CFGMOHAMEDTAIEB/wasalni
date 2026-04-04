import { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (user: User) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  updateUser: (user: Partial<User>) => void;
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
  const [user, setUser] = useState<User | null>(guestUser);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(guestUser);
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user?.role !== 'guest',
    login,
    logout,
    setUserRole,
    updateUser,
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
