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

function pickStr(o: Record<string, unknown>, k: string): string | undefined {
    const v = o[k];
    return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Map varied API line-item shapes to StaffOrderItem (fixes missing names from nested menu_item, etc.) */
export function normalizeStaffOrderItems(items: unknown): StaffOrderItem[] {
    if (!Array.isArray(items)) return [];
    return items.map((raw, index) => {
        if (raw && typeof raw === 'object') {
            const x = raw as Record<string, unknown>;
            const existingName = pickStr(x, 'name');
            if (existingName) {
                const qty = Math.max(1, Math.round(Number(x.quantity ?? x.qty ?? 1) || 1));
                const p = x.price ?? x.unit_price ?? 0;
                const priceNum = typeof p === 'number' ? p : parseFloat(String(p)) || 0;
                const sub = x.subtotal;
                const subNum =
                    sub != null
                        ? typeof sub === 'number'
                            ? sub
                            : parseFloat(String(sub)) || qty * priceNum
                        : qty * priceNum;
                return {
                    id: pickStr(x, 'id') || `line-${index}`,
                    name: existingName,
                    quantity: qty,
                    price: String(priceNum),
                    subtotal: String(subNum),
                    notes: pickStr(x, 'notes') || pickStr(x, 'special_instructions'),
                };
            }
        }
        const r = raw as Record<string, unknown>;
        const nested = (r.menu_item || r.MenuItem) as Record<string, unknown> | undefined;
        const name =
            pickStr(r, 'name') ||
            pickStr(r, 'menu_item_name') ||
            pickStr(r, 'item_name') ||
            pickStr(r, 'title') ||
            (nested && pickStr(nested, 'name')) ||
            'Item';
        const quantity = Math.max(1, Math.round(Number(r.quantity ?? r.qty ?? 1) || 1));
        const p = r.price ?? r.unit_price ?? nested?.price ?? 0;
        const priceNum = typeof p === 'number' ? p : parseFloat(String(p)) || 0;
        const price = String(priceNum);
        const subRaw = r.subtotal;
        const subNum =
            subRaw != null
                ? typeof subRaw === 'number'
                    ? subRaw
                    : parseFloat(String(subRaw)) || quantity * priceNum
                : quantity * priceNum;
        const id = pickStr(r, 'id') || `line-${index}`;
        const notes = pickStr(r, 'notes') || pickStr(r, 'special_instructions');
        return {
            id,
            name,
            quantity,
            price,
            subtotal: String(subNum),
            notes,
        };
    });
}

function normalizeStaffOrder(order: StaffOrder): StaffOrder {
    return {
        ...order,
        items: normalizeStaffOrderItems(order.items),
    };
}

export type PayOrderMeta = {
    /** Invoice total (subtotal + tax), excluding tip — helps backends validate payment */
    orderTotal?: number;
    tip?: number;
};

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
            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'x-access-token': token,
                'x-auth-token': token,
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.ORDERS}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...authHeaders,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch orders');
            }

            const data = await response.json();
            
            // Handle various response structures: data, orders, items, or flat array
            if (Array.isArray(data)) return data;
            if (data.data && Array.isArray(data.data)) return data.data;
            if (data.orders && Array.isArray(data.orders)) return data.orders;
            if (data.items && Array.isArray(data.items)) return data.items;
            
            return [];
        } catch (error) {
            console.error('Error fetching staff orders:', error);
            throw error;
        }
    }

    /**
     * Get order details
     */
    async getOrderDetails(orderId: string): Promise<StaffOrder> {
        const token = staffAuthService.getToken();
        if (!token) throw new Error('No authentication token found');

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.DETAILS(orderId)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'x-access-token': token,
                        'x-auth-token': token,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch order details');
            }

            const data = await response.json();
            
            let order: StaffOrder;
            if (data.data) order = data.data;
            else if (data.order) order = data.order;
            else order = data;
            return normalizeStaffOrder(order as StaffOrder);
        } catch (error) {
            console.error('Error fetching order details:', error);
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
            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'x-access-token': token,
                'x-auth-token': token,
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...authHeaders,
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
            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'x-access-token': token,
                'x-auth-token': token,
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...authHeaders,
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
     * Process payment for an order (PATCH .../orders/:id/status).
     * Sends common field aliases so different backends can read amount / tip / method.
     */
    async payOrder(orderId: string, paymentMethod: string, grandTotal: number, meta?: PayOrderMeta): Promise<void> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const tip = Math.max(0, Math.round(meta?.tip ?? 0));
        const orderTotal = Math.round(meta?.orderTotal ?? grandTotal - tip);
        const totalPaid = Math.round(grandTotal);

        const methodLower = String(paymentMethod).toLowerCase();
        const normalizedMethod =
            methodLower === 'cash' ? 'CASH' : methodLower === 'upi' ? 'UPI' : String(paymentMethod).toUpperCase();

        try {
            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'x-access-token': token,
                'x-auth-token': token,
            };

            // `amount` / `paid_amount` = cash/UPI collected (invoice + tip). `total_amount` = invoice before tip.
            const payload: Record<string, unknown> = {
                status: 'PAID',
                payment_status: 'PAID',
                payment_method: normalizedMethod,
                paymentMethod: normalizedMethod,
                amount: totalPaid,
                paid_amount: totalPaid,
                total_paid: totalPaid,
                total_amount: orderTotal,
                tip_amount: tip,
                tipAmount: tip,
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...authHeaders,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                let message = `Payment failed (${response.status})`;
                try {
                    const err = JSON.parse(text) as Record<string, unknown>;
                    message =
                        (typeof err.message === 'string' && err.message) ||
                        (typeof err.error === 'string' && err.error) ||
                        (typeof err.detail === 'string' && err.detail) ||
                        message;
                } catch {
                    if (text?.trim()) message = text.trim().slice(0, 280);
                }
                throw new Error(message);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }
}

export const staffOrdersService = new StaffOrdersService();
