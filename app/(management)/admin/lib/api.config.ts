/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

export const API_CONFIG = {
    BASE_URL: 'https://pos-backend-s380.onrender.com',
    ENDPOINTS: {
        ADMIN: {
            LOGIN: '/api/admin/login',
            LOGOUT: '/api/admin/logout',
            PROFILE: '/api/admin/profile',
            ME: '/api/admin/me',
            RESTAURANT: '/api/admin/restaurant',
            RESTAURANT_DETAILS: '/api/admin/restaurant/details',
            CONTACTS: '/api/admin/restaurant/contacts',
            CONTACT_BY_ID: (id: string) => `/api/admin/restaurant/contacts/${id}`,
        },
        AUTH: {
            FORGOT_PASSWORD: '/api/auth/forgot-password',
            RESET_PASSWORD: '/api/auth/reset-password',
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
        STAFF_APP: {
            LOGIN: '/api/staff/login',
            // Staff app uses Admin order/table APIs (per backend routes)
            ORDERS: '/api/admin/orders', // GET /api/admin/orders
            DETAILS: (id: string) => `/api/admin/orders/${id}`, // GET /api/admin/orders/:id
            UPDATE_STATUS: (id: string) => `/api/admin/orders/${id}/status`, // PATCH /api/admin/orders/:id/status
            TABLES: '/api/admin/tables', // GET /api/admin/tables
            PROFILE: '/api/staff/me',
        },
        CUSTOMER: {
            MENU: '/api/customer/menu',
            ORDERS: '/api/customer/orders',
            TABLE: (id: string) => `/api/customer/table/${id}`, // Assumed endpoint for verifying table
        },
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
} as const;

export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_user_data';
