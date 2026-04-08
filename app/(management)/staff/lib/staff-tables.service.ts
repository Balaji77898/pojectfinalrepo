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
            const authHeaders = {
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF_APP.TABLES}`,
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
                throw new Error(errorData.message || 'Failed to fetch tables');
            }

            const data = await response.json();
            
            // Handle various response structures: data, tables, or flat array
            if (Array.isArray(data)) return data;
            if (data.data && Array.isArray(data.data)) return data.data;
            if (data.tables && Array.isArray(data.tables)) return data.tables;
            if (data.items && Array.isArray(data.items)) return data.items;
            
            return [];
        } catch (error) {
            console.error('Error fetching staff tables:', error);
            throw error;
        }
    }
}

export const staffTablesService = new StaffTablesService();
