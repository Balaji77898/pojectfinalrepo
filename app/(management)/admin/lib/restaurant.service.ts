/**
 * Restaurant Service
 * Handles fetching and managing restaurant profile data
 */

import { apiService, normalizeResponse } from './api.service';

import { API_CONFIG } from './api.config';

export interface RestaurantProfile {
    // Core Identity
    id: string;
    name: string;
    restaurant_type: string; // Cafe / Restaurant / Cloud Kitchen
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

    // Description & Contact
    description?: string;
    phone: string;
    email: string;

    // Address Info
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

export interface Contact {
    id: string;
    type: 'PHONE' | 'EMAIL';
    value: string;
    created_at: string;
}

class RestaurantService {
    /**
     * Get restaurant profile data
     */
    async getRestaurantProfile(): Promise<RestaurantProfile> {
        let data: any = null;

        // 1. Try RESTAURANT endpoint first (as it's confirmed working on landing page)
        try {
            const response = await apiService.get<any>(
                API_CONFIG.ENDPOINTS.ADMIN.RESTAURANT,
                true
            );
            data = normalizeResponse(response, null);
        } catch (error: any) {
            if (!error.message?.includes('Unauthorized')) {
                console.log('[RESTAURANT SERVICE] RESTAURANT endpoint failed:', error.message);
            }
        }

        // 2. Try PROFILE endpoint as fallback if RESTAURANT failed
        if (!data) {
            try {
                const response = await apiService.get<any>(
                    API_CONFIG.ENDPOINTS.ADMIN.PROFILE,
                    true
                );
                data = normalizeResponse(response, null);
            } catch (error) {
                console.log('[RESTAURANT SERVICE] PROFILE endpoint failed.');
            }
        }

        // 3. Final Fallback: Return a valid object structure to prevent UI crashes
        if (!data || (!data.name && !data.id)) {
            console.warn('[RESTAURANT SERVICE] Both endpoints failed, using default info');
            return {
                id: 'default',
                name: 'Spice Delight',
                restaurant_type: 'Cafe',
                status: 'ACTIVE',
                description: 'North Indian cuisine crafted with tradition.',
                phone: '8888888888',
                email: 'contact@spicedelight.com',
                address: 'MG Road',
                city: 'Bangalore',
                state: 'KA',
                country: 'India',
                pincode: '576101'
            };
        }

        return data as RestaurantProfile;
    }

    /**
     * Update restaurant details
     */
    async updateRestaurantDetails(details: Partial<RestaurantProfile>): Promise<RestaurantProfile> {
        const response = await apiService.put<any>(
            API_CONFIG.ENDPOINTS.ADMIN.RESTAURANT_DETAILS,
            details,
            true
        );
        return normalizeResponse(response, null);
    }

    /**
     * Get all additional contacts
     */
    async getContacts(): Promise<Contact[]> {
        const response = await apiService.get<any>(
            API_CONFIG.ENDPOINTS.ADMIN.CONTACTS,
            true
        );
        return normalizeResponse(response, []);
    }

    /**
     * Add a new additional contact
     */
    async addContact(type: 'PHONE' | 'EMAIL', value: string): Promise<Contact> {
        const response = await apiService.post<any>(
            API_CONFIG.ENDPOINTS.ADMIN.CONTACTS,
            { type, value },
            true
        );
        return normalizeResponse(response, null);
    }

    /**
     * Delete an additional contact
     */
    async deleteContact(id: string): Promise<void> {
        await apiService.delete(
            API_CONFIG.ENDPOINTS.ADMIN.CONTACT_BY_ID(id),
            true
        );
    }
}

// Export singleton instance
export const restaurantService = new RestaurantService();
