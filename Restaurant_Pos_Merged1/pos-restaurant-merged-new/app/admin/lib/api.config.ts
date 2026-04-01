/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

export const API_CONFIG = {
    // Empty string = relative URL → goes through local Next.js proxy routes.
    // The proxy routes (app/api/admin/...) forward server-side to the live Render backend
    // (https://pos-backend-s380.onrender.com), bypassing browser CORS restrictions entirely.
    BASE_URL: '',
    ENDPOINTS: {
        ADMIN: {
            LOGIN: '/api/admin/login',
            LOGOUT: '/api/admin/logout',
            PROFILE: '/api/admin/profile',
            ME: '/api/admin/me',
            RESTAURANT: '/api/admin/restaurant',
        },
        MENU: {
            CATEGORIES: '/api/admin/menu/categories',
            CATEGORY_BY_ID: (id: string) => `/api/admin/menu/categories/${id}`,
            ITEMS: '/api/admin/menu/items',
            ITEM_BY_ID: (id: string) => `/api/admin/menu/items/${id}`,
            TOGGLE_ITEM: (id: string) => `/api/admin/menu/items/${id}/toggle`,
        },
        STAFF: {
            LIST: '/api/admin/staff',
            CREATE: '/api/admin/staff',
            UPDATE: (id: string) => `/api/admin/staff/${id}`,
            TOGGLE: (id: string) => `/api/admin/staff/${id}/toggle`,
            DELETE: (id: string) => `/api/admin/staff/${id}`,
        },
        ORDERS: {
            LIST: '/api/admin/orders',
            DETAILS: (id: string) => `/api/admin/orders/${id}`,
        },
        TABLES: {
            LIST: '/api/admin/tables',
            CREATE: '/api/admin/tables',
            TOGGLE: (id: string) => `/api/admin/tables/${id}/toggle`,
            DELETE: (id: string) => `/api/admin/tables/${id}`,
        },
    },
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_user_data';
