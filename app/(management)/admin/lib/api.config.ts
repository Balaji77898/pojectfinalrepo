/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

export const API_CONFIG = {
    BASE_URL: 'https://pos-backend-s380.onrender.com/api',
    ENDPOINTS: {
        ADMIN: {
            LOGIN: '/admin/login',
            LOGOUT: '/admin/logout',
            PROFILE: '/admin/profile',
            ME: '/admin/me',
            RESTAURANT: '/admin/restaurant',
            RESTAURANT_DETAILS: '/admin/restaurant/details',
            CONTACTS: '/admin/restaurant/contacts',
            CONTACT_BY_ID: (id: string) => `/admin/restaurant/contacts/${id}`,
        },
        AUTH: {
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
        },
        MENU: {
            CATEGORIES: '/admin/menu/categories',
            CATEGORY_BY_ID: (id: string) => `/admin/menu/categories/${id}`,
            ITEMS: '/admin/menu/items',
            ITEM_BY_ID: (id: string) => `/admin/menu/items/${id}`,
            TOGGLE_ITEM: (id: string) => `/admin/menu/items/${id}/toggle`,
        },
        STAFF: {
            LIST: '/admin/staff',
            CREATE: '/admin/staff',
            UPDATE: (id: string) => `/admin/staff/${id}`,
            TOGGLE: (id: string) => `/admin/staff/${id}/toggle`,
            DELETE: (id: string) => `/admin/staff/${id}`,
        },
        ORDERS: {
            LIST: '/admin/orders',
            DETAILS: (id: string) => `/admin/orders/${id}`,
        },
        TABLES: {
            LIST: '/admin/tables',
            CREATE: '/admin/tables',
            TOGGLE: (id: string) => `/admin/tables/${id}/toggle`,
            DELETE: (id: string) => `/admin/tables/${id}`,
        },
        STAFF_APP: {
            LOGIN: '/staff/login',
            ORDERS: '/admin/orders',
            DETAILS: (id: string) => `/admin/orders/${id}`,
            UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`,
            TABLES: '/admin/tables',
            PROFILE: '/staff/me',
        },
        CUSTOMER: {
            MENU: '/customer/menu',
            ORDERS: '/customer/orders',
            TABLE: (id: string) => `/customer/table/${id}`,
        },
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
} as const;

export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_user_data';
