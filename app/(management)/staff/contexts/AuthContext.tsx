"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { staffAuthService } from "../lib/staff-auth.service";

export type StaffRole = "serving_staff" | "billing_staff";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

interface AuthContextType {
  role: StaffRole | null;
  user: StaffUser | null;
  isLoading: boolean;
  setRole: (role: StaffRole) => void;
  login: (email: string, password: string, role: StaffRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [role, setRoleState] = useState<StaffRole | null>(null);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Try to restore session from localStorage
    const storedUser = staffAuthService.getUser();
    const storedToken = staffAuthService.getToken();
    
    if (storedUser && storedToken) {
      setRoleState(storedUser.role);
      setUser(storedUser);
    } else {
      // Fallback to old role storage for backward compatibility
      const storedRole = localStorage.getItem("extra_staff_role");
      if (storedRole) {
        setRoleState(storedRole as StaffRole);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, selectedRole: StaffRole) => {
    try {
      const response = await staffAuthService.login({ email, password }, selectedRole);
      setRoleState(response.user.role);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const setRole = (newRole: StaffRole) => {
    localStorage.setItem("extra_staff_role", newRole);
    setRoleState(newRole);
  };

  const logout = () => {
    staffAuthService.logout();
    setRoleState(null);
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ role, user, isLoading, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
