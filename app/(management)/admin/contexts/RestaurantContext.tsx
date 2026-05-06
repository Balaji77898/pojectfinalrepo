"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { restaurantService, RestaurantProfile, Contact } from '../lib/restaurant.service';
import { useAuth } from './AuthContext';

interface RestaurantContextType {
    restaurant: RestaurantProfile | null;
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateDetails: (details: Partial<RestaurantProfile>) => Promise<void>;
    addContact: (type: 'PHONE' | 'EMAIL', value: string) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRestaurant = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [profile, contactsList] = await Promise.all([
                restaurantService.getRestaurantProfile(),
                restaurantService.getContacts()
            ]);
            setRestaurant(profile);
            setContacts(contactsList);
        } catch (err: any) {
            console.error('Error fetching restaurant data:', err);
            
            // Fallback: Try to get restaurant info from the user data stored during login
            const userDataStr = localStorage.getItem('admin_user_data');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
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
            const token = localStorage.getItem('admin_auth_token');
            if (authLoading && !token) return;

            if (token || isAuthenticated) {
                await fetchRestaurant();
            } else if (!authLoading && !isAuthenticated) {
                setRestaurant(null);
                setContacts([]);
                setError(null);
                setIsLoading(false);
            }
        };

        checkAndFetch();
    }, [isAuthenticated, authLoading]);

    const updateDetails = async (details: Partial<RestaurantProfile>) => {
        const updated = await restaurantService.updateRestaurantDetails(details);
        if (updated) {
            setRestaurant(prev => prev ? { ...prev, ...updated } : updated);
        }
    };

    const addContact = async (type: 'PHONE' | 'EMAIL', value: string) => {
        const newContact = await restaurantService.addContact(type, value);
        if (newContact) {
            setContacts(prev => [...prev, newContact]);
        }
    };

    const deleteContact = async (id: string) => {
        await restaurantService.deleteContact(id);
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    const value: RestaurantContextType = {
        restaurant,
        contacts,
        isLoading,
        error,
        refetch: fetchRestaurant,
        updateDetails,
        addContact,
        deleteContact,
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
