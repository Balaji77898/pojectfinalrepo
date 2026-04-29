/**
 * Orders Service
 * Direct backend calls (no Next.js proxy) using the three admin order endpoints.
 */

import { TOKEN_KEY } from './api.config';

const BACKEND_BASE = 'https://pos-backend-s380.onrender.com';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum OrderType {
    DINE_IN  = 'DINE_IN',
    TAKEAWAY = 'TAKEAWAY',
    DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
    PENDING   = 'PENDING',
    PLACED    = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY     = 'READY',
    COMPLETED = 'COMPLETED',
    SERVED    = 'SERVED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID    = 'PAID',
    FAILED  = 'FAILED',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface OrderItem {
    id: string;
    menu_item_id?: string;
    name?: string;
    item_name?: string;
    quantity: number;
    price: number | string;
    subtotal: number | string;
}

export interface Order {
    id: string;
    order_type?: OrderType;
    status: OrderStatus;
    total_amount: number | string;
    payment_status: PaymentStatus;
    payment_method?: string | null;
    created_at: string;
    updated_at?: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    table_number?: string | null;
    items?: OrderItem[];
}

export interface OrderDetails extends Order {
    items: OrderItem[];
    subtotal: number | string;
    tax_amount: number | string;
    restaurant_id?: string;
    table_id?: string;
}

export interface CreateOrderItemRequest {
    menu_item_id: string;
    quantity: number;
}

export interface CreateOrderRequest {
    order_type: OrderType;
    items: CreateOrderItemRequest[];
    customer_name?: string;
    customer_phone?: string;
    table_id?: string;
    payment_method?: string;
    notes?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

class OrdersService {
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    private buildHeaders(): Record<string, string> {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    /** Generic fetch that unwraps the { success, data } envelope */
    private async call<T>(path: string, init: RequestInit = {}): Promise<T> {
        const res = await fetch(`${BACKEND_BASE}${path}`, {
            ...init,
            headers: { ...this.buildHeaders(), ...(init.headers as Record<string, string> ?? {}) },
        });

        const contentType = res.headers.get('content-type') ?? '';
        let data: any;
        if (contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (!res.ok) {
            const msg =
                typeof data === 'object' && data?.message
                    ? data.message
                    : `HTTP ${res.status}`;
            throw new Error(msg);
        }

        // Unwrap envelope { success: true, data: ... }
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
            return data.data as T;
        }
        return data as T;
    }

    /** GET /api/admin/orders */
    async getOrdersList(): Promise<Order[]> {
        return this.call<Order[]>('/api/admin/orders');
    }

    /** GET /api/admin/orders/:id */
    async getOrderDetails(id: string): Promise<OrderDetails> {
        return this.call<OrderDetails>(`/api/admin/orders/${id}`);
    }

    /** PATCH /api/admin/orders/:id/status */
    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        return this.call<Order>(`/api/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    /** POST /api/admin/orders  (staff/admin manual order creation) */
    async createOrder(data: CreateOrderRequest): Promise<Order> {
        return this.call<Order>('/api/admin/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const ordersService = new OrdersService();
