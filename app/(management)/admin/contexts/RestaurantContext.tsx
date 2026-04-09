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
            setError(err.message || 'Failed to load restaurant data');
            setRestaurant(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch restaurant data when authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchRestaurant();
        } else if (!authLoading && !isAuthenticated) {
            setRestaurant(null);
            setError(null);
            setIsLoading(false);
        }
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
