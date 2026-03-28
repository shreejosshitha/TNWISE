import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'user' | 'admin';
export type Department = 'electricity' | 'water' | 'municipal' | 'transport';

export interface CitizenServices {
  electricity?: {
    consumerNumber: string;
    status: "active" | "inactive";
    connectionDate: string;
  };
  water?: {
    consumerNumber: string;
    status: "active" | "inactive";
    connectionDate: string;
  };
  municipal?: {
    propertyId: string;
    status: "active" | "inactive";
    registrationDate: string;
  };
  transport?: {
    rtcNumber: string;
    status: "active" | "inactive";
    issuedDate: string;
  };
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  email?: string;
  department?: Department; // For admins
  // Citizen profile data
  citizenProfile?: {
    id: string;
    phone: string;
    name: string;
    email: string;
    aadhar: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dateOfBirth: string;
    gender: string;
    profilePhoto?: string;
    services: CitizenServices;
    kyc: {
      verified: boolean;
      verificationDate?: string;
      documents: {
        aadhar: boolean;
        pan?: boolean;
        license?: boolean;
      };
    };
    createdAt: string;
    updatedAt: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  hasRole: (role: UserRole) => boolean;
  hasAdminAccess: (department?: Department) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  const hasAdminAccess = (department?: Department) => {
    if (user?.role !== 'admin') return false;
    if (!department) return true;
    return user.department === department;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
    hasAdminAccess,
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
