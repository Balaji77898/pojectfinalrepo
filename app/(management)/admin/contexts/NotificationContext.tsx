"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ordersService, Order } from '../lib/orders.service';
import { useAuth } from './AuthContext';

export interface Notification {
    id: string;
    orderId: string;
    customerName: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const lastOrderIds = useRef<Set<string>>(new Set());
    const isFirstLoad = useRef(true);

    const fetchNewOrders = async () => {
        try {
            const orders = await ordersService.getOrdersList(true);
            
            const newNotifications: Notification[] = [];
            const currentOrderIds = new Set<string>();

            orders.forEach(order => {
                currentOrderIds.add(order.id);
                
                // If it's a new order ID and NOT the first load
                if (!lastOrderIds.current.has(order.id) && !isFirstLoad.current) {
                    newNotifications.push({
                        id: Math.random().toString(36).substr(2, 9),
                        orderId: order.id,
                        customerName: order.customer_name || 'Guest',
                        timestamp: new Date(order.created_at),
                        read: false
                    });
                }
            });

            if (newNotifications.length > 0) {
                setNotifications(prev => [...newNotifications, ...prev]);
            }

            // Update seen IDs
            lastOrderIds.current = currentOrderIds;
            isFirstLoad.current = false;

        } catch (error) {
            // Silently handle polling errors to avoid UI noise
            console.debug('Background notification poll failed (likely network/timeout)');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            lastOrderIds.current = new Set();
            isFirstLoad.current = true;
            return;
        }

        // Initial fetch to populate lastOrderIds
        fetchNewOrders();

        // Poll every 10 seconds
        const interval = setInterval(fetchNewOrders, 10000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
