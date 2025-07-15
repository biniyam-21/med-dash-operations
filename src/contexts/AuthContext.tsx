import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'assistant' | 'manager';
  branchId: string;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  selectedBranch: Branch | null;
  branches: Branch[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectBranch: (branchId: string) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockBranches: Branch[] = [
  { id: '1', name: 'Main Branch', location: 'Downtown', isActive: true },
  { id: '2', name: 'North Branch', location: 'North District', isActive: true },
  { id: '3', name: 'East Branch', location: 'East Side', isActive: true },
];

const mockUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah@pharmacy.com',
  role: 'admin',
  branchId: '1',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(mockBranches[0]);
  const [branches] = useState<Branch[]>(mockBranches);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    console.log('Login attempt:', email, password);
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setSelectedBranch(null);
  };

  const selectBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Role-based permissions
    const permissions = {
      admin: ['*'], // All permissions
      manager: ['inventory', 'sales', 'purchases', 'reports', 'suppliers'],
      pharmacist: ['inventory', 'sales', 'reports'],
      assistant: ['sales', 'inventory.view'],
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      selectedBranch,
      branches,
      login,
      logout,
      selectBranch,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};