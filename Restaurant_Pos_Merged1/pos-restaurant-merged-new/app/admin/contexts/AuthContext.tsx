"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth.service';

interface User {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Initialize directly from localStorage — synchronous, no flicker.
    const [user, setUser] = useState<User | null>(() => {
        // This initializer only runs on the client (useState lazy init).
        // On SSR it returns null, on client it reads localStorage.
        if (typeof window === 'undefined') return null;
        return authService.getUser();
    });

    // isLoading is only true if we have a token but no user data yet
    // (edge case: logged in before we added user storage)
    const [isLoading, setIsLoading] = useState(false);

    // If we have a token but no user data, fetch user data once.
    useEffect(() => {
        const token = authService.getToken();
        const storedUser = authService.getUser();

        if (token && !storedUser) {
            // Token exists but no user data — fetch from backend once
            setIsLoading(true);
            authService.validateSession()
                .then((userData) => {
                    if (userData) setUser(userData);
                    else setUser(null);
                })
                .catch(() => setUser(null))
                .finally(() => setIsLoading(false));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await authService.login({ email, password });
            // Read user from localStorage — auth.service stored it during login
            const userData = authService.getUser();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!authService.getToken(),
        isLoading,
        login,
        logout,
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
