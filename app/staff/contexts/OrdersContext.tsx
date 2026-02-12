'use client';
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'BILLED' | 'PAID' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  table: string;
  customerName?: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
  itemsPreview: string[];
}

interface OrdersContextType {
  orders: Order[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

import { staffOrdersService } from '../lib/staff-orders.service';

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = React.useCallback(async () => {
    try {
      const data = await staffOrdersService.getOrders();
      // Map API response to Order interface
      const mappedOrders: Order[] = data.map(apiOrder => ({
        id: apiOrder.id,
        orderNumber: '#' + apiOrder.id.substring(0, 5), // Generate short ID
        table: apiOrder.order_type === 'DINE_IN' ? `Table ${apiOrder.table_id || '?'}` : apiOrder.order_type,
        customerName: 'Guest', // API doesn't return customer name yet in list
        items: 0, // API doesn't return items count yet in list
        total: parseFloat(apiOrder.total_amount),
        status: mapApiStatusToOrderStatus(apiOrder.status),
        time: new Date(apiOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itemsPreview: [], // API doesn't return items preview yet
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
    // Optional: Poll for updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const setOrderStatus = React.useCallback(async (id: string, status: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );

    try {
        await staffOrdersService.updateStatus(id, status);
    } catch (error) {
        console.error('Failed to update status:', error);
        // Revert on failure (optional, or show toast)
        // For now logging error. Re-fetch could also fix state.
        fetchOrders();
    }
  }, [fetchOrders]);

  const value = useMemo(
    () => ({
      orders,
      setOrderStatus,
      refreshOrders: fetchOrders,
      isLoading
    }),
    [orders, isLoading, setOrderStatus, fetchOrders],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

function mapApiStatusToOrderStatus(apiStatus: string): OrderStatus {
    return apiStatus.toUpperCase() as OrderStatus;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
