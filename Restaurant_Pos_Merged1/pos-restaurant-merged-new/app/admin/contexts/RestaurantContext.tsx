"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { restaurantService, RestaurantProfile } from '../lib/restaurant.service';
import { authService } from '../lib/auth.service';

interface RestaurantContextType {
    restaurant: RestaurantProfile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRestaurant = async () => {
        // Only fetch if the user is authenticated — the endpoint requires a JWT token.
        if (!authService.isAuthenticated()) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const data = await restaurantService.getRestaurantProfile();
            setRestaurant(data);
        } catch (err: any) {
            console.error('Error fetching restaurant:', err);
            setError(err.message || 'Failed to load restaurant data');
            setRestaurant(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Only run when a token is present — avoids a 401 on the landing/login pages.
    useEffect(() => {
        fetchRestaurant();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
