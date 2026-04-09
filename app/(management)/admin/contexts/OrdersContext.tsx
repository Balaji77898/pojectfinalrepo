"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ordersService, Order, OrderDetails } from '../lib/orders.service';
import { useAuth } from './AuthContext';

interface OrdersContextType {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    refetchOrders: () => Promise<void>;
    getOrderDetails: (id: string) => Promise<OrderDetails>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await ordersService.getOrdersList();
            setOrders(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
        }
    };

    // Fetch data when authenticated
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('admin_auth_token');
            if (token) {
                setIsLoading(true);
                await fetchOrders();
                setIsLoading(false);
            } else if (!authLoading && !isAuthenticated) {
                setOrders([]);
                setError(null);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, authLoading]);

    const getOrderDetails = async (id: string): Promise<OrderDetails> => {
        return await ordersService.getOrderDetails(id);
    };

    const value: OrdersContextType = {
        orders,
        isLoading,
        error,
        refetchOrders: fetchOrders,
        getOrderDetails,
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
}
