/**
 * Authentication Service
 * Handles login, logout, and token management
 */

import { apiService } from './api.service';
import { API_CONFIG, TOKEN_KEY, USER_KEY } from './api.config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user?: any;
    message?: string;
}

interface User {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
}

class AuthService {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await apiService.post<LoginResponse>(
                API_CONFIG.ENDPOINTS.ADMIN.LOGIN,
                credentials,
                false // Don't require auth for login
            );

            // Store token
            if (response.token) {
                this.setToken(response.token);
            }

            // Store user data if provided by the login response
            if (response.user) {
                this.setUser(response.user);
            } else {
                // If login response doesn't include user, build a minimal user object from credentials
                this.setUser({ email: credentials.email });
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        this.clearToken();
        this.clearUser();

        if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.replace('/admin/login');
        }
    }

    /**
     * Store authentication token
     */
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Clear authentication token
     */
    clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    /**
     * Store user data
     */
    setUser(user: User): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    }

    /**
     * Get user data from localStorage (synchronous — no network call)
     */
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Clear user data
     */
    clearUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_KEY);
        }
    }

    /**
     * Check if user is authenticated (synchronous localStorage check)
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Validate session with backend and get fresh user data.
     * Only call this when you need to verify the token is still valid server-side.
     */
    async validateSession(): Promise<User | null> {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }

            const user = await apiService.get<User>(
                API_CONFIG.ENDPOINTS.ADMIN.ME,
                true
            );

            if (user) {
                this.setUser(user);
            }

            return user;
        } catch (error) {
            console.error('Session validation error:', error);
            this.clearToken();
            this.clearUser();
            return null;
        }
    }

    /**
     * Get current user email
     */
    getUserEmail(): string | null {
        const user = this.getUser();
        return user?.email || null;
    }
}

// Export singleton instance
export const authService = new AuthService();
