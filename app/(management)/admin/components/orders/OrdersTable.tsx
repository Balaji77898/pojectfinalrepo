"use client";

import React from 'react';
import { Eye, Package, User, MapPin, ClipboardList } from 'lucide-react';
import { Order, OrderType, OrderStatus, PaymentStatus } from '../../lib/orders.service';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
    const getOrderTypeBadge = (type?: OrderType | string) => {
        if (!type) return { style: 'bg-gray-100 text-gray-800 border-gray-300', label: 'N/A' };
        const normType = type.toString().toUpperCase().replace(/-/g, '_');
        const styles: Record<string, string> = {
            DINE_IN: 'bg-blue-100 text-blue-800 border-blue-300',
            TAKEAWAY: 'bg-purple-100 text-purple-800 border-purple-300',
            DELIVERY: 'bg-green-100 text-green-800 border-green-300',
        };
        const labels: Record<string, string> = {
            DINE_IN: 'Dine-In',
            TAKEAWAY: 'Takeaway',
            DELIVERY: 'Delivery',
        };
        return { style: styles[normType] || 'bg-gray-100 text-gray-800 border-gray-300', label: labels[normType] || type };
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<string, string> = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [OrderStatus.PLACED]: 'bg-sky-100 text-sky-800 border-sky-300',
            [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
            [OrderStatus.READY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderStatus.SERVED]: 'bg-teal-100 text-teal-800 border-teal-300',
            [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels: Record<string, string> = {
            [OrderStatus.PENDING]: 'Pending',
            [OrderStatus.PLACED]: 'Placed',
            [OrderStatus.CONFIRMED]: 'Confirmed',
            [OrderStatus.PREPARING]: 'Preparing',
            [OrderStatus.READY]: 'Ready',
            [OrderStatus.SERVED]: 'Served',
            [OrderStatus.COMPLETED]: 'Completed',
            [OrderStatus.CANCELLED]: 'Cancelled',
        };
        return { 
            style: styles[status] || 'bg-gray-100 text-gray-800 border-gray-300', 
            label: labels[status] || status 
        };
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const styles: Record<string, string> = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels: Record<string, string> = {
            [PaymentStatus.PENDING]: 'Pending',
            [PaymentStatus.PAID]: 'Paid',
            [PaymentStatus.FAILED]: 'Failed',
        };
        return { style: styles[status] || 'bg-gray-100 text-gray-800 border-gray-300', label: labels[status] || status };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-gray-300 mb-4">
                    <Package size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No orders found</h3>
                <p className="text-text-muted">Orders will appear here once they are placed.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Table</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => {
                            const orderType = getOrderTypeBadge(order.order_type);
                            const status = getStatusBadge(order.status);
                            const paymentStatus = getPaymentStatusBadge(order.payment_status);
                            
                            // Improved amount calculation with fallback for manual orders
                            let amount = Number(order.total_amount || (order as any).totalAmount || (order as any).total || 0);
                            
                            // Fallback: If amount is 0 but we have items, calculate it manually
                            if (amount === 0 && order.items && order.items.length > 0) {
                                const subtotal = order.items.reduce((sum, item) => {
                                    const price = Number(item.price || 0);
                                    const qty = Number(item.quantity || 0);
                                    return sum + (price * qty);
                                }, 0);
                                amount = subtotal + Math.round(subtotal * 0.05); // Add rounded 5% tax
                            }

                            return (
                                <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                                    {/* Order ID & Type */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm font-bold text-gray-800">
                                            #{order.id.slice(0, 8)}
                                        </div>
                                        {order.order_type && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${orderType.style}`}>
                                                {orderType.label}
                                            </span>
                                        )}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">
                                                    {order.customer_name || 'Walking Customer'}
                                                </div>
                                                {order.customer_phone && (
                                                    <div className="text-[11px] text-gray-500">{order.customer_phone}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Table */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* Show table number only for Dine-In, otherwise show a clean dash */}
                                            {order.order_type === 'DINE_IN' ? (
                                                <>
                                                    <MapPin size={14} className="text-ruby-red" />
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        {order.table_number ? `Table ${order.table_number}` : 'N/A'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-400 ml-6">—</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.style}`}>
                                            {status.label}
                                        </span>
                                    </td>

                                    {/* Total Amount */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base font-black text-ruby-red tracking-tight">
                                            ₹{amount.toFixed(2)}
                                        </div>
                                    </td>

                                    {/* Payment Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${paymentStatus.style}`}>
                                            {paymentStatus.label}
                                        </span>
                                    </td>

                                    {/* Created Date */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-xs font-medium text-gray-500">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-bold shadow-sm hover:shadow-blue-200"
                                        >
                                            <Eye size={14} />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
