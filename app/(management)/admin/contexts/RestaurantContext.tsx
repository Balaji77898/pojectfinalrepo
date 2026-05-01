"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { restaurantService, RestaurantProfile } from '../lib/restaurant.service';
import { useAuth } from './AuthContext';

interface RestaurantContextType {
    restaurant: RestaurantProfile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRestaurant = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await restaurantService.getRestaurantProfile();
            setRestaurant(data);
        } catch (err: any) {
            console.error('Error fetching restaurant:', err);
            
            // Fallback: Try to get restaurant info from the user data stored during login
            const userDataStr = localStorage.getItem('admin_user_data');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    // Check if user data contains restaurant info (some backends nest it)
                    const fallbackData = userData.restaurant || userData;
                    if (fallbackData && (fallbackData.name || fallbackData.restaurant_name)) {
                        console.log('[RESTAURANT CONTEXT] Using fallback data from localStorage');
                        setRestaurant({
                            ...fallbackData,
                            name: fallbackData.name || fallbackData.restaurant_name || 'Restaurant',
                            restaurant_type: fallbackData.restaurant_type || 'Dining',
                        });
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse fallback user data:', e);
                }
            }

            setError(err.message || 'Failed to load restaurant data');
            setRestaurant(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch restaurant data when authenticated
    useEffect(() => {
        const checkAndFetch = async () => {
            // Check for token directly from service
            const token = localStorage.getItem('admin_auth_token');
            
            // Wait for auth context to stabilize if it's currently loading
            if (authLoading && !token) {
                return;
            }

            if (token || isAuthenticated) {
                await fetchRestaurant();
            } else if (!authLoading && !isAuthenticated) {
                setRestaurant(null);
                setError(null);
                setIsLoading(false);
            }
        };

        checkAndFetch();
    }, [isAuthenticated, authLoading]);

    const value: RestaurantContextType = {
        restaurant,
        isLoading,
        error,
        refetch: fetchRestaurant,
    };

    return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
}

export function useRestaurant() {
    const context = useContext(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
}
