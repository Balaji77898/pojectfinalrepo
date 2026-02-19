import { API_CONFIG } from '@/app/admin/lib/api.config';
import { staffAuthService } from './staff-auth.service';

export interface StaffOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: string;
    subtotal: string;
    notes?: string;
}

export interface StaffOrder {
    id: string;
    // These fields might be missing in some API versions
    restaurant_id?: string;
    table_id?: string | null;
    table_number?: string;
    order_type?: string;
    status: string;
    subtotal?: string;
    tax_amount?: string;
    total_amount: string;
    payment_status: string;
    payment_method?: string;
    created_at: string;
    updated_at?: string;
    customer_name?: string;
    customer_phone?: string;
    items?: StaffOrderItem[];
}

export interface StaffOrdersResponse {
    success: boolean;
    orders: StaffOrder[];
}

class StaffOrdersService {
    /**
     * Get all orders for the current staff's restaurant
     */
    async getOrders(): Promise<StaffOrder[]> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.ORDERS}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch orders');
            }

            const data = await response.json();
            
            // Handle both array and object response formats
            if (Array.isArray(data)) {
                return data;
            }
            
            return data.orders || [];
        } catch (error) {
            console.error('Error fetching staff orders:', error);
            throw error;
        }
    }

    /**
     * Update order status
     */
    async updateStatus(orderId: string, status: string): Promise<void> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    /**
     * Generate bill for an order
     */
    async generateBill(orderId: string): Promise<void> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify({ status: 'BILLED' }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to generate bill');
            }
        } catch (error) {
            console.error('Error generating bill:', error);
            throw error;
        }
    }

    /**
     * Process payment for an order
     */
    async payOrder(orderId: string, paymentMethod: string, amount: number): Promise<void> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify({
                        status: 'PAID',
                        payment_method: paymentMethod,
                        amount: amount
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to process payment');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }
}

export const staffOrdersService = new StaffOrdersService();
