/**
 * Orders Service
 * Handles read-only order viewing
 */

import { apiService, normalizeResponse } from './api.service';

import { API_CONFIG } from './api.config';

// Order Type Enum
export enum OrderType {
    DINE_IN = 'DINE_IN',
    TAKEAWAY = 'TAKEAWAY',
    DELIVERY = 'DELIVERY'
}

// Order Status Enum
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Payment Status Enum
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
}

// Order Item Interface
export interface OrderItem {
    id: string;
    menu_item_id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

// Order Interface (List View)
export interface Order {
    id: string;
    order_type: OrderType;
    status: OrderStatus;
    total_amount: number;
    payment_status: PaymentStatus;
    payment_method?: string;
    created_at: string;
    updated_at?: string;
}

// Order Details Interface (Detail View)
export interface OrderDetails extends Order {
    items: OrderItem[];
    subtotal: number;
    tax: number;
}

class OrdersService {
    /**
     * Get all orders
     */
    async getOrdersList(): Promise<Order[]> {
        try {
            const response = await apiService.get<any>(
                API_CONFIG.ENDPOINTS.ORDERS.LIST,
                true
            );
            return normalizeResponse(response, []) as Order[];
        } catch (error) {
            console.error('Failed to fetch orders list:', error);
            throw error;
        }
    }

    /**
     * Get order details by ID
     */
    async getOrderDetails(id: string): Promise<OrderDetails> {
        try {
            const response = await apiService.get<any>(
                API_CONFIG.ENDPOINTS.ORDERS.DETAILS(id),
                true
            );
            return normalizeResponse(response, response) as OrderDetails;
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const ordersService = new OrdersService();
