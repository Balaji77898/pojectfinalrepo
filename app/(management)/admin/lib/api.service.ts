/**
 * API Service
 * Centralized service for making HTTP requests with automatic token injection
 */

import { API_CONFIG, TOKEN_KEY } from './api.config';

/**
 * Normalizes API response to handle various response structures (data, items, user, etc.)
 */
export function normalizeResponse<T>(data: unknown, fallback: T): T {
    if (!data || typeof data !== 'object') return fallback;
    
    const responseData = data as Record<string, unknown>;
    
    // Check for common wrapper fields
    if (responseData.data !== undefined) return responseData.data as T;
    if (responseData.items !== undefined && Array.isArray(responseData.items)) return responseData.items as unknown as T;
    if (responseData.restaurant !== undefined) return responseData.restaurant as T;
    if (responseData.user !== undefined) return responseData.user as T;
    if (responseData.staff !== undefined) return responseData.staff as T;
    
    return data as T;
}


interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    requiresAuth?: boolean;
    suppressLogs?: boolean;
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
                // Send standard Authorization header
                headers['Authorization'] = `Bearer ${token}`;
                
                console.log('[AUTH] Token injected into request headers');
            } else {
                console.warn('[AUTH] Request requires auth but no token was found in localStorage');
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
            suppressLogs = false,
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
            console.log(`[API REQUEST] ${method} ${url}`, body ? { body } : '');
            const response = await fetch(url, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            console.log(`[API RESPONSE] ${method} ${url}`, { status: response.status, data });

            if (!response.ok) {
                const message = data.message || (typeof data === 'string' ? data : JSON.stringify(data)) || `HTTP error! status: ${response.status}`;
                throw new Error(message);
            }

            return data as T;
        } catch (error) {
            if (!suppressLogs) {
                console.error(`[API ERROR] ${method} ${url}`, error);
            }
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, requiresAuth = true, suppressLogs = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth, suppressLogs });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: unknown, requiresAuth = true, suppressLogs = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, requiresAuth, suppressLogs });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: unknown, requiresAuth = true, suppressLogs = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth, suppressLogs });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, requiresAuth = true, suppressLogs = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth, suppressLogs });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: unknown, requiresAuth = true, suppressLogs = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth, suppressLogs });
    }
}

// Export singleton instance
export const apiService = new ApiService();
