/**
 * API Service
 * Centralized service for making HTTP requests with automatic token injection
 */

import { API_CONFIG, TOKEN_KEY } from './api.config';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    requiresAuth?: boolean;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    /**
     * Get authentication token from localStorage
     */
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Build headers with optional authentication
     */
    private buildHeaders(customHeaders?: Record<string, string>, requiresAuth = true): HeadersInit {
        const headers: Record<string, string> = {
            ...API_CONFIG.HEADERS,
            ...customHeaders,
        };

        if (requiresAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Generic request method
     */
    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const {
            method = 'GET',
            headers: customHeaders,
            body,
            requiresAuth = true,
        } = options;

        const url = `${this.baseUrl}${endpoint}`;
        const headers = this.buildHeaders(customHeaders, requiresAuth);

        const config: RequestInit = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // Backend error envelope: { success: false, message: "..." }
                const errMsg = (typeof data === 'object' && data !== null)
                    ? (data.message || JSON.stringify(data))
                    : (data || `HTTP error! status: ${response.status}`);
                throw new Error(errMsg);
            }

            // Unwrap the standard backend envelope: { success: true, message: "...", data: {...} }
            // If the response matches this shape, return only the `data` field.
            if (
                data !== null &&
                typeof data === 'object' &&
                'success' in data &&
                'data' in data
            ) {
                return data.data as T;
            }

            return data as T;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
        return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
    }
}

// Export singleton instance
export const apiService = new ApiService();

