(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/admin/lib/api.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */ __turbopack_context__.s([
    "API_CONFIG",
    ()=>API_CONFIG,
    "TOKEN_KEY",
    ()=>TOKEN_KEY,
    "USER_KEY",
    ()=>USER_KEY
]);
const API_CONFIG = {
    BASE_URL: 'https://superconservatively-drouthiest-karoline.ngrok-free.dev',
    ENDPOINTS: {
        ADMIN: {
            LOGIN: '/api/admin/login',
            LOGOUT: '/api/admin/logout',
            PROFILE: '/api/admin/profile',
            ME: '/api/admin/me',
            RESTAURANT: '/api/admin/restaurant'
        },
        MENU: {
            CATEGORIES: '/api/admin/menu/categories',
            ITEMS: '/api/admin/menu/items',
            ITEM_BY_ID: (id)=>`/api/admin/menu/items/${id}`,
            TOGGLE_ITEM: (id)=>`/api/admin/menu/items/${id}/toggle`
        },
        STAFF: {
            LIST: '/api/admin/staff',
            CREATE: '/api/admin/staff',
            UPDATE: (id)=>`/api/admin/staff/${id}`,
            TOGGLE: (id)=>`/api/admin/staff/${id}/toggle`,
            DELETE: (id)=>`/api/admin/staff/${id}`
        },
        ORDERS: {
            LIST: '/api/admin/orders',
            DETAILS: (id)=>`/api/admin/orders/${id}`
        },
        TABLES: {
            LIST: '/api/admin/tables',
            CREATE: '/api/admin/tables',
            TOGGLE: (id)=>`/api/admin/tables/${id}/toggle`,
            DELETE: (id)=>`/api/admin/tables/${id}`
        },
        STAFF_APP: {
            LOGIN: '/api/staff/login',
            ORDERS: '/api/staff/orders',
            UPDATE_STATUS: (id)=>`/api/staff/orders/${id}/status`,
            GENERATE_BILL: (id)=>`/api/staff/orders/${id}/generate-bill`
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
};
const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user_data';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/lib/api.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService
]);
/**
 * API Service
 * Centralized service for making HTTP requests with automatic token injection
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-client] (ecmascript)");
;
class ApiService {
    baseUrl;
    constructor(){
        this.baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL;
    }
    /**
     * Get authentication token from localStorage
     */ getToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_KEY"]);
    }
    /**
     * Build headers with optional authentication
     */ buildHeaders(customHeaders, requiresAuth = true) {
        const headers = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].HEADERS,
            ...customHeaders
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
     */ async request(endpoint, options = {}) {
        const { method = 'GET', headers: customHeaders, body, requiresAuth = true } = options;
        const url = `${this.baseUrl}${endpoint}`;
        const headers = this.buildHeaders(customHeaders, requiresAuth);
        const config = {
            method,
            headers
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
                throw new Error(data.message || data || `HTTP error! status: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
    /**
     * GET request
     */ async get(endpoint, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'GET',
            requiresAuth
        });
    }
    /**
     * POST request
     */ async post(endpoint, body, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'POST',
            body,
            requiresAuth
        });
    }
    /**
     * PUT request
     */ async put(endpoint, body, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'PUT',
            body,
            requiresAuth
        });
    }
    /**
     * DELETE request
     */ async delete(endpoint, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'DELETE',
            requiresAuth
        });
    }
    /**
     * PATCH request
     */ async patch(endpoint, body, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'PATCH',
            body,
            requiresAuth
        });
    }
}
const apiService = new ApiService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/lib/auth.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
/**
 * Authentication Service
 * Handles login, logout, and token management
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-client] (ecmascript)");
;
;
class AuthService {
    /**
     * Login user with email and password
     */ async login(credentials) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.LOGIN, credentials, false // Don't require auth for login
            );
            // Store token
            if (response.token) {
                this.setToken(response.token);
            }
            // Store user data if provided
            if (response.user) {
                this.setUser(response.user);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    /**
     * Logout user
     */ logout() {
        // Clear all auth data
        this.clearToken();
        this.clearUser();
        // Force a hard redirect to login page (clears all state)
        if ("TURBOPACK compile-time truthy", 1) {
            // Clear all localStorage to ensure clean state
            localStorage.clear();
            // Use window.location.replace for hard redirect (no back button)
            window.location.replace('/admin/login');
        }
    }
    /**
     * Store authentication token
     */ setToken(token) {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_KEY"], token);
        }
    }
    /**
     * Get authentication token
     */ getToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_KEY"]);
    }
    /**
     * Clear authentication token
     */ clearToken() {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_KEY"]);
        }
    }
    /**
     * Store user data
     */ setUser(user) {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USER_KEY"], JSON.stringify(user));
        }
    }
    /**
     * Get user data
     */ getUser() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const userData = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USER_KEY"]);
        return userData ? JSON.parse(userData) : null;
    }
    /**
     * Clear user data
     */ clearUser() {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["USER_KEY"]);
        }
    }
    /**
     * Check if user is authenticated
     */ isAuthenticated() {
        return !!this.getToken();
    }
    /**
     * Validate session with backend and get current user
     * Calls /api/admin/me to verify token and get user data
     */ async validateSession() {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }
            // Call /api/admin/me to validate session and get user data
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.ME, true // Requires authentication
            );
            // Update stored user data with fresh data from API
            if (user) {
                this.setUser(user);
            }
            return user;
        } catch (error) {
            console.error('Session validation error:', error);
            // Clear invalid token
            this.clearToken();
            this.clearUser();
            return null;
        }
    }
    /**
     * Get current user email
     */ getUserEmail() {
        const user = this.getUser();
        return user?.email || null;
    }
}
const authService = new AuthService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/auth.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check authentication status on mount and validate with backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const checkAuth = {
                "AuthProvider.useEffect.checkAuth": async ()=>{
                    const token = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getToken();
                    if (!token) {
                        setIsLoading(false);
                        return;
                    }
                    // Validate session with backend API
                    const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].validateSession();
                    if (userData) {
                        setUser(userData);
                    } else {
                        // Session invalid, clear everything
                        setUser(null);
                    }
                    setIsLoading(false);
                }
            }["AuthProvider.useEffect.checkAuth"];
            checkAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login({
                email,
                password
            });
            // Validate session and get fresh user data from API
            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].validateSession();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].logout();
        setUser(null);
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/contexts/AuthContext.tsx",
        lineNumber: 79,
        columnNumber: 12
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/lib/restaurant.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "restaurantService",
    ()=>restaurantService
]);
/**
 * Restaurant Service
 * Handles fetching and managing restaurant profile data
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-client] (ecmascript)");
;
;
class RestaurantService {
    /**
     * Get restaurant profile data
     */ async getRestaurantProfile() {
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.RESTAURANT, true // Requires authentication
            );
            return profile;
        } catch (error) {
            console.error('Failed to fetch restaurant profile:', error);
            throw error;
        }
    }
}
const restaurantService = new RestaurantService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/contexts/RestaurantContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantProvider",
    ()=>RestaurantProvider,
    "useRestaurant",
    ()=>useRestaurant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$restaurant$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/restaurant.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const RestaurantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function RestaurantProvider({ children }) {
    _s();
    const [restaurant, setRestaurant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchRestaurant = async ()=>{
        try {
            setIsLoading(true);
            setError(null);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$restaurant$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["restaurantService"].getRestaurantProfile();
            setRestaurant(data);
        } catch (err) {
            console.error('Error fetching restaurant:', err);
            setError(err.message || 'Failed to load restaurant data');
            setRestaurant(null);
        } finally{
            setIsLoading(false);
        }
    };
    // Fetch restaurant data on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantProvider.useEffect": ()=>{
            fetchRestaurant();
        }
    }["RestaurantProvider.useEffect"], []);
    const value = {
        restaurant,
        isLoading,
        error,
        refetch: fetchRestaurant
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/contexts/RestaurantContext.tsx",
        lineNumber: 47,
        columnNumber: 12
    }, this);
}
_s(RestaurantProvider, "AjBuCIPZ1MtISLFCmzdZBnb2uBU=");
_c = RestaurantProvider;
function useRestaurant() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
}
_s1(useRestaurant, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "RestaurantProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_8c4f94d6._.js.map