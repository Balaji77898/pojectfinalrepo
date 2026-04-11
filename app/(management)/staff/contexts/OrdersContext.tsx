'use client';
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { staffOrdersService, StaffOrder, StaffOrderItem, normalizeStaffOrderItems, PayOrderMeta } from '../lib/staff-orders.service';
import { staffAuthService } from '../lib/staff-auth.service';
import { formatTime } from '../lib/date-utils';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'BILLED' | 'PAID' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  table: string;
  customerName?: string;
  items: number;
  total: number;
  subtotal?: number;
  tax?: number;
  status: OrderStatus;
  time: string;
  createdAt: string; // ISO format
  itemsPreview: string[];
  itemsDetails?: StaffOrderItem[];
}

interface OrdersContextType {
  orders: Order[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
  generateBill: (id: string) => Promise<void>;
  payOrder: (id: string, paymentMethod: string, grandTotal: number, meta?: PayOrderMeta) => Promise<void>;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

function mapApiStatusToOrderStatus(apiStatus: string): OrderStatus {
  return (apiStatus || 'PLACED').toUpperCase() as OrderStatus;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    // Only fetch if we have a token or user
    const token = staffAuthService.getToken(); 
    if (!token) return;

    try {
      const data = await staffOrdersService.getOrders();
      
      const mappedOrders: Order[] = data.map((apiOrder: StaffOrder) => {
        const formattedTime = formatTime(apiOrder.created_at);
        const items = normalizeStaffOrderItems(apiOrder.items || []);
        
        const calculatedSubtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const calculatedTax = calculatedSubtotal * 0.05;
        const calculatedTotal = calculatedSubtotal + calculatedTax;

        const apiTotal = parseFloat(apiOrder.total_amount) || 0;
        const apiSubtotal = parseFloat(apiOrder.subtotal || '0');
        const apiTax = parseFloat(apiOrder.tax_amount || '0');

        return {
          id: apiOrder.id,
          orderNumber: apiOrder.id.substring(0, 8).toUpperCase(),
          table: apiOrder.table_number
            ? `Table ${apiOrder.table_number}`
            : (apiOrder.table_id && apiOrder.table_id !== 'null' && apiOrder.table_id !== 'undefined'
              ? `Table ${apiOrder.table_id}`
              : (apiOrder.order_type === 'DINE_IN' ? 'Dine In' : (apiOrder.customer_name || 'Takeaway'))),
          customerName: apiOrder.customer_name || '',
          items: items.length || 0,
          itemsDetails: items,
          total: apiTotal > 0 ? apiTotal : calculatedTotal,
          subtotal: Math.round(apiSubtotal > 0 ? apiSubtotal : calculatedSubtotal),
          tax: Math.round(apiTax > 0 ? apiTax : calculatedTax),
          status: mapApiStatusToOrderStatus(apiOrder.status),
          time: formattedTime,
          createdAt: apiOrder.created_at,
          itemsPreview: apiOrder.items?.map((item: StaffOrderItem) => `${item.quantity}x ${item.name}`) || [],
        };
      });
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    } else if (!authLoading && !user) {
      setOrders([]);
      setIsLoading(false);
    }
  }, [fetchOrders, user, authLoading]);

  const setOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );

    try {
      await staffOrdersService.updateStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchOrders();
    }
  }, [fetchOrders]);

  const generateBill = useCallback(async (id: string) => {
    try {
      await staffOrdersService.generateBill(id);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to generate bill:', error);
      throw error;
    }
  }, [fetchOrders]);

  const payOrder = useCallback(async (id: string, paymentMethod: string, grandTotal: number, meta?: PayOrderMeta) => {
    try {
      await staffOrdersService.payOrder(id, paymentMethod, grandTotal, meta);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to pay order:', error);
      throw error;
    }
  }, [fetchOrders]);

  const value = useMemo(
    () => ({
      orders,
      setOrderStatus,
      generateBill,
      payOrder,
      refreshOrders: fetchOrders,
      isLoading
    }),
    [orders, isLoading, setOrderStatus, generateBill, payOrder, fetchOrders],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
