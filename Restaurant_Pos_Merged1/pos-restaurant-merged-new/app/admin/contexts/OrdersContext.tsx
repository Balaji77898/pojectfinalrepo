"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ordersService, Order, OrderDetails, OrderStatus } from '../lib/orders.service';

interface OrdersContextType {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    refetchOrders: () => Promise<void>;
    getOrderDetails: (id: string) => Promise<OrderDetails>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await ordersService.getOrdersList();
            setOrders(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
        }
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchOrders();
            setIsLoading(false);
        };
        load();
    }, []);

    const getOrderDetails = async (id: string): Promise<OrderDetails> => {
        return ordersService.getOrderDetails(id);
    };

    const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
        await ordersService.updateOrderStatus(id, status);
        // Optimistically update local list
        setOrders(prev =>
            prev.map(o => (o.id === id ? { ...o, status } : o))
        );
    };

    const value: OrdersContextType = {
        orders,
        isLoading,
        error,
        refetchOrders: fetchOrders,
        getOrderDetails,
        updateOrderStatus,
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
