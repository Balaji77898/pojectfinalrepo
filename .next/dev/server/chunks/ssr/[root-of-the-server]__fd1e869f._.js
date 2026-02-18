module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/admin/lib/api.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
            ORDERS: '/api/admin/orders',
            DETAILS: (id)=>`/api/admin/orders/${id}`,
            UPDATE_STATUS: (id)=>`/api/admin/orders/${id}/status`
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
};
const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user_data';
}),
"[project]/app/admin/lib/api.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService
]);
/**
 * API Service
 * Centralized service for making HTTP requests with automatic token injection
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-ssr] (ecmascript)");
;
class ApiService {
    baseUrl;
    constructor(){
        this.baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL;
    }
    /**
     * Get authentication token from localStorage
     */ getToken() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    /**
     * Build headers with optional authentication
     */ buildHeaders(customHeaders, requiresAuth = true) {
        const headers = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].HEADERS,
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
}),
"[project]/app/admin/lib/auth.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
/**
 * Authentication Service
 * Handles login, logout, and token management
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-ssr] (ecmascript)");
;
;
class AuthService {
    /**
     * Login user with email and password
     */ async login(credentials) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.LOGIN, credentials, false // Don't require auth for login
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    /**
     * Store authentication token
     */ setToken(token) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    /**
     * Get authentication token
     */ getToken() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    /**
     * Clear authentication token
     */ clearToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    /**
     * Store user data
     */ setUser(user) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    /**
     * Get user data
     */ getUser() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
        const userData = undefined;
    }
    /**
     * Clear user data
     */ clearUser() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.ME, true // Requires authentication
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
}),
"[project]/app/admin/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/auth.service.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check authentication status on mount and validate with backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkAuth = async ()=>{
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }
            // Validate session with backend API
            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].validateSession();
            if (userData) {
                setUser(userData);
            } else {
                // Session invalid, clear everything
                setUser(null);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);
    const login = async (email, password)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].login({
                email,
                password
            });
            // Validate session and get fresh user data from API
            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].validateSession();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].logout();
        setUser(null);
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/contexts/AuthContext.tsx",
        lineNumber: 79,
        columnNumber: 12
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/app/admin/lib/restaurant.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "restaurantService",
    ()=>restaurantService
]);
/**
 * Restaurant Service
 * Handles fetching and managing restaurant profile data
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/api.config.ts [app-ssr] (ecmascript)");
;
;
class RestaurantService {
    /**
     * Get restaurant profile data
     */ async getRestaurantProfile() {
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.ADMIN.RESTAURANT, true // Requires authentication
            );
            return profile;
        } catch (error) {
            console.error('Failed to fetch restaurant profile:', error);
            throw error;
        }
    }
}
const restaurantService = new RestaurantService();
}),
"[project]/app/admin/contexts/RestaurantContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantProvider",
    ()=>RestaurantProvider,
    "useRestaurant",
    ()=>useRestaurant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$restaurant$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/lib/restaurant.service.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const RestaurantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function RestaurantProvider({ children }) {
    const [restaurant, setRestaurant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchRestaurant = async ()=>{
        try {
            setIsLoading(true);
            setError(null);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$lib$2f$restaurant$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["restaurantService"].getRestaurantProfile();
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchRestaurant();
    }, []);
    const value = {
        restaurant,
        isLoading,
        error,
        refetch: fetchRestaurant
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/contexts/RestaurantContext.tsx",
        lineNumber: 47,
        columnNumber: 12
    }, this);
}
function useRestaurant() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fd1e869f._.js.map