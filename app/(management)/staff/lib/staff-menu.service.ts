/**
 * Staff Menu Service
 * Handles menu categories and items fetching for staff
 */

import { API_CONFIG } from '@/app/admin/lib/api.config';
import { staffAuthService } from './staff-auth.service';

export interface StaffCategory {
    id: string;
    name: string;
    description?: string;
    display_order?: number;
}

export interface StaffMenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category_id: string;
    is_available: boolean;
    image_url?: string;
}

class StaffMenuService {
    /**
     * Get all categories for staff
     */
    async getCategories(): Promise<StaffCategory[]> {
        const token = staffAuthService.getToken();
        if (!token) throw new Error('No authentication token found');

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MENU.CATEGORIES}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch categories');
            }

            const data = await response.json();
            return (data.data || data.categories || data) as StaffCategory[];
        } catch (error) {
            console.error('Error fetching categories for staff:', error);
            throw error;
        }
    }

    /**
     * Get all menu items for staff
     */
    async getMenuItems(): Promise<StaffMenuItem[]> {
        const token = staffAuthService.getToken();
        if (!token) throw new Error('No authentication token found');

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MENU.ITEMS}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch menu items');
            }

            const data = await response.json();
            return (data.data || data.items || data) as StaffMenuItem[];
        } catch (error) {
            console.error('Error fetching menu items for staff:', error);
            throw error;
        }
    }
}

export const staffMenuService = new StaffMenuService();
