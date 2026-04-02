/**
 * Staff Tables Service
 * Handles table status fetching for staff
 */

import { API_CONFIG } from '@/app/admin/lib/api.config';
import { staffAuthService } from './staff-auth.service';

export interface StaffTable {
    id: string;
    table_number: number | string;
    table_status: 'EMPTY' | 'OCCUPIED';
    is_active: boolean;
    created_at: string;
}

class StaffTablesService {
    async getTables(): Promise<StaffTable[]> {
        const token = staffAuthService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.TABLES}`,
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
                throw new Error(errorData.message || 'Failed to fetch tables');
            }

            const data = await response.json();
            
            // Handle both array and object response formats
            if (Array.isArray(data)) {
                return data;
            }
            
            return data.tables || [];
        } catch (error) {
            console.error('Error fetching staff tables:', error);
            throw error;
        }
    }
}

export const staffTablesService = new StaffTablesService();
