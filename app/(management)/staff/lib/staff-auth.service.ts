/**
 * Staff Authentication Service
 * Handles staff login and token management
 */

import { API_CONFIG } from '@/app/admin/lib/api.config';

const STAFF_TOKEN_KEY = 'staff_auth_token';
const STAFF_USER_KEY = 'staff_user_data';

export type StaffRole = "serving_staff" | "billing_staff";

interface StaffLoginCredentials {
    email: string;
    password: string;
}

interface StaffUser {
    id: string;
    name: string;
    email: string;
    role: 'serving_staff' | 'billing_staff';
}

interface StaffLoginResponse {
    token: string;
    user: StaffUser;
    message?: string;
}

export interface StaffProfile extends StaffUser {
    phone?: string;
    restaurant_name?: string;
    created_at?: string;
    is_active?: boolean;
}

class StaffAuthService {
    /**
     * Login staff member with email and password
     */
    async login(credentials: StaffLoginCredentials, role: StaffRole): Promise<StaffLoginResponse> {
        try {
            // Trim credentials
            const payload = {
                email: credentials.email.trim(),
                password: credentials.password.trim()
            };

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.LOGIN}`;
            console.log('Attempting staff login at:', url);

            const response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(payload),
                }
            );

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response from server:', text);
                throw new Error('Server returned an invalid response. Please check your backend.');
            }
            console.log('Staff login response:', { status: response.status, data });

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            // Handle various response structures:
            // 1. Standard: { user: { ... } }
            // 2. Wrapped: { data: { ... } }
            // 3. Staff specific: { staff: { ... } }
            // 4. Flat: { role: "...", name: "..." }
            
            const userData = data.data || data.user || data.staff || data;
            const rawRole = (userData.role || '').toLowerCase().trim();
            console.log('Role detection:', { rawRole, userData });

            let determinedRole: StaffRole | null = null;
            
            // Comprehensive role detection
            if (rawRole === 'serving_staff' || rawRole === 'server' || rawRole === 'waiter' || rawRole.includes('serving')) {
                determinedRole = 'serving_staff';
            } 
            else if (rawRole === 'billing_staff' || rawRole === 'cashier' || rawRole === 'billing' || rawRole.includes('billing')) {
                determinedRole = 'billing_staff';
            }

            // Validate role exists
            if (!determinedRole) {
                throw new Error(`Profile role not recognized. Received: "${rawRole}". Please contact administrator.`);
            }

            // ENFORCE STRICT SEPARATION: Validate role match with user selection
            if (role !== determinedRole) {
                 const roleType = determinedRole.replace('_', ' ');
                 throw new Error(`Access Denied: You are registered as ${roleType}. Please use the ${roleType} login option.`);
            }

            const normalizedUser: StaffUser = {
                id: userData.id || 'unknown',
                name: userData.name || 'Staff Member',
                email: userData.email || payload.email,
                role: determinedRole
            };

            // Store token and user data
            // Robust token extraction checking multiple possible locations
            const token = data.token || data.data?.token || data.user?.token || (data as any).accessToken;
            if (token) {
                this.setToken(token);
            }

            if (normalizedUser) {
                this.setUser(normalizedUser);
            }

            return {
                token: token,
                user: normalizedUser,
                message: data.message
            };
        } catch (error: unknown) {
            console.error('Staff login error:', error);
            throw error;
        }
    }

    /**
     * Logout staff member
     */
    logout(): void {
        this.clearToken();
        this.clearUser();
        localStorage.removeItem('extra_staff_role');
    }

    /**
     * Store authentication token
     */
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STAFF_TOKEN_KEY, token);
        }
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STAFF_TOKEN_KEY);
    }

    /**
     * Clear authentication token
     */
    clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STAFF_TOKEN_KEY);
        }
    }

    /**
     * Store user data
     */
    setUser(user: StaffUser): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
            // Also store role for backward compatibility
            if (user.role) {
                localStorage.setItem('extra_staff_role', user.role);
            }
        }
    }

    /**
     * Get user data
     */
    getUser(): StaffUser | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(STAFF_USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Clear user data
     */
    clearUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STAFF_USER_KEY);
        }
    }

    /**
     * Check if staff member is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Get current user role
     */
    getRole(): 'serving_staff' | 'billing_staff' | null {
        const user = this.getUser();
        return user?.role || null;
    }

    /**
     * Get staff profile from API
     */
    async getProfile(): Promise<StaffProfile> {
        const token = this.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.PROFILE}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'x-access-token': token,
                        'x-auth-token': token,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const data = await response.json();
            return data.data || data.staff || data;
        } catch (error) {
            console.error('Error fetching staff profile:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const staffAuthService = new StaffAuthService();
