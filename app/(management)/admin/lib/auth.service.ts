/**
 * Authentication Service
 * Handles login, logout, and token management
 */

import { apiService, normalizeResponse } from './api.service';

import { API_CONFIG, TOKEN_KEY, USER_KEY } from './api.config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token?: string;
    accessToken?: string;
    user?: Record<string, unknown>;
    data?: Record<string, unknown>;
    staff?: Record<string, unknown>;
    message?: string;
    [key: string]: unknown;
}

interface User {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: unknown;
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

            // Store token - check multiple possible locations
            const token = response.token || response.accessToken || (response.data?.token as string | undefined) || (response.user?.token as string | undefined) || (response.data?.accessToken as string | undefined);
            if (token) {
                this.setToken(token);
            }

            // Store user data - check multiple possible locations
            const userData = normalizeResponse(response, null) || response.user || response.data || response.staff;
            if (userData) {
                this.setUser(userData as User);
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
        // Clear all auth data
        this.clearToken();
        this.clearUser();

        // Force a hard redirect to login page (clears all state)
        if (typeof window !== 'undefined') {
            // Clear all localStorage to ensure clean state
            localStorage.clear();

            // Use window.location.replace for hard redirect (no back button)
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
     * Get user data
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
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Validate session with backend and get current user
     * Calls /api/admin/me to verify token and get user data
     */
    async validateSession(): Promise<User | null> {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }

            // Call /api/admin/me to validate session and get user data
            const response = await apiService.get<unknown>(
                API_CONFIG.ENDPOINTS.ADMIN.ME,
                true, // Requires authentication
                true  // Suppress logs for expected session expiry
            );

            const user = normalizeResponse(response, null);

            // Update stored user data with fresh data from API
            if (user) {
                this.setUser(user);
            }

            return user;
        } catch (error: unknown) {
            // Only log if it's NOT a 401/Unauthorized error (which is expected if token expired)
            const errMessage = error instanceof Error ? error.message : String(error);
            if (!errMessage.includes('Unauthorized') && !errMessage.includes('token')) {
                console.error('Session validation error:', error);
            }
            // Clear invalid token
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
    
    /**
     * Send forgot password email
     */
    async forgotPassword(email: string): Promise<unknown> {
        try {
            return await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
                { email },
                false, // No auth required
                true  // Suppress logs for expected "User not found" errors
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Reset password using token
     */
    async resetPassword(token: string, password: string): Promise<unknown> {
        try {
            return await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
                { token, password },
                false // No auth required
            );
        } catch (error) {
            throw error;
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
