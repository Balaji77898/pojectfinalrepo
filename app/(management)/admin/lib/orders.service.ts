/**
 * Orders Service
 * Handles manual order placement and list/details viewing.
 */

import { apiService, normalizeResponse } from './api.service';
import { API_CONFIG } from './api.config';
import { TOKEN_KEY } from './api.config';

const BACKEND_BASE = 'https://pos-backend-s380.onrender.com';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum OrderType {
    DINE_IN = 'DINE_IN',
    TAKEAWAY = 'TAKEAWAY',
    DELIVERY = 'DELIVERY'
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PLACED = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    SERVED = 'SERVED',
    BILLED = 'BILLED',
    PAID = 'PAID',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
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
    /** GET /api/admin/orders */
    async getOrdersList(): Promise<Order[]> {
        const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.ORDERS.LIST);
        return normalizeResponse(response, []);
    }

    /** GET /api/admin/orders/:id */
    async getOrderDetails(id: string): Promise<OrderDetails | null> {
        const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.ORDERS.DETAILS(id));
        return normalizeResponse(response, null);
    }

    /** PATCH /api/admin/orders/:id/status */
    async updateOrderStatus(id: string, status: OrderStatus | string): Promise<Order | null> {
        const response = await apiService.patch<any>(
            API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(id),
            { status }
        );
        return normalizeResponse(response, null);
    }

    /** POST /api/admin/orders (staff/admin manual order creation) */
    async createOrder(data: CreateOrderRequest): Promise<Order | null> {
        const response = await apiService.post<any>(API_CONFIG.ENDPOINTS.ORDERS.LIST, data);
        return normalizeResponse(response, null);
    }
}

export const ordersService = new OrdersService();
