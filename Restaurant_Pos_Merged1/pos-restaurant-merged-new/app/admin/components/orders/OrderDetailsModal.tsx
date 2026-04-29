"use client";

import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CreditCard, RefreshCw, CheckCircle2 } from 'lucide-react';
import { OrderDetails, OrderStatus, PaymentStatus } from '../../lib/orders.service';
import { useOrders } from '../../contexts/OrdersContext';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
}

const STATUS_FLOW: OrderStatus[] = [
    OrderStatus.PLACED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.SERVED,
    OrderStatus.COMPLETED,
];

const STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]:   'Pending',
    [OrderStatus.PLACED]:    'Placed',
    [OrderStatus.CONFIRMED]: 'Confirmed',
    [OrderStatus.PREPARING]: 'Preparing',
    [OrderStatus.READY]:     'Ready',
    [OrderStatus.SERVED]:    'Served',
    [OrderStatus.COMPLETED]: 'Completed',
    [OrderStatus.CANCELLED]: 'Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]:   'bg-yellow-100 text-yellow-800 border-yellow-300',
    [OrderStatus.PLACED]:    'bg-sky-100 text-sky-800 border-sky-300',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
    [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
    [OrderStatus.READY]:     'bg-purple-100 text-purple-800 border-purple-300',
    [OrderStatus.SERVED]:    'bg-teal-100 text-teal-800 border-teal-300',
    [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
};

export default function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
    const { getOrderDetails, updateOrderStatus } = useOrders();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [statusSuccess, setStatusSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) fetchOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        if (!orderId) return;
        setIsLoading(true);
        setError(null);
        setStatusSuccess(false);
        try {
            const details = await getOrderDetails(orderId);
            setOrderDetails(details);
        } catch (err: any) {
            setError(err.message || 'Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!orderDetails || statusUpdating) return;
        setStatusUpdating(true);
        setStatusSuccess(false);
        try {
            await updateOrderStatus(orderDetails.id, newStatus);
            setOrderDetails(prev => prev ? { ...prev, status: newStatus } : prev);
            setStatusSuccess(true);
            setTimeout(() => setStatusSuccess(false), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const getPaymentBadge = (status: PaymentStatus) => {
        const map: Record<PaymentStatus, string> = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]:    'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]:  'bg-red-100 text-red-800 border-red-300',
        };
        return map[status] ?? 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    if (!isOpen) return null;

    const isCancelled = orderDetails?.status === OrderStatus.CANCELLED;
    const isCompleted = orderDetails?.status === OrderStatus.COMPLETED;
    const canUpdateStatus = !isCancelled && !isCompleted;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">Order Details</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-800">{error}</p>
                        </div>
                    ) : orderDetails ? (
                        <>
                            {/* Order meta */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Order ID</div>
                                        <div className="font-mono font-semibold text-text-primary text-sm">
                                            #{orderDetails.id.slice(0, 8)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Order Type</div>
                                        <div className="font-semibold text-text-primary text-sm">
                                            {orderDetails.order_type?.replace('_', ' ') ?? 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Table</div>
                                        <div className="font-semibold text-text-primary text-sm">
                                            {orderDetails.table_number ? `Table ${orderDetails.table_number}` : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Status</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[orderDetails.status] ?? 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                            {STATUS_LABELS[orderDetails.status] ?? orderDetails.status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Customer</div>
                                        <div className="font-semibold text-text-primary text-sm">{orderDetails.customer_name || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Phone</div>
                                        <div className="font-semibold text-text-primary text-sm">{orderDetails.customer_phone || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Payment</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentBadge(orderDetails.payment_status)}`}>
                                            {orderDetails.payment_status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted mb-1">Date</div>
                                        <div className="text-xs font-semibold text-text-primary">
                                            {new Date(orderDetails.created_at).toLocaleString('en-IN', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ─── Status Update Panel ─────────────────────────── */}
                            <div className={`rounded-xl border-2 p-4 ${canUpdateStatus ? 'border-ruby-red/30 bg-ruby-red/5' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <RefreshCw size={16} className="text-ruby-red" />
                                        Update Order Status
                                    </h3>
                                    {statusSuccess && (
                                        <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                            <CheckCircle2 size={15} />Status updated!
                                        </span>
                                    )}
                                </div>

                                {isCancelled && (
                                    <p className="text-sm text-red-600 font-medium">This order has been cancelled and cannot be updated.</p>
                                )}
                                {isCompleted && (
                                    <p className="text-sm text-green-600 font-medium">This order is completed.</p>
                                )}

                                {canUpdateStatus && (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {STATUS_FLOW.map(st => {
                                                const isCurrent = orderDetails.status === st;
                                                return (
                                                    <button
                                                        key={st}
                                                        onClick={() => !isCurrent && handleStatusChange(st)}
                                                        disabled={statusUpdating || isCurrent}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                                                            ${isCurrent
                                                                ? 'border-ruby-red bg-ruby-red text-white cursor-default'
                                                                : 'border-gray-200 text-gray-600 hover:border-ruby-red/60 hover:text-ruby-red cursor-pointer'
                                                            } ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isCurrent && '✓ '}{STATUS_LABELS[st]}
                                                    </button>
                                                );
                                            })}
                                            {/* Cancel button separately */}
                                            <button
                                                onClick={() => handleStatusChange(OrderStatus.CANCELLED)}
                                                disabled={statusUpdating}
                                                className="px-4 py-1.5 rounded-full text-xs font-semibold border-2 border-red-200 text-red-600 hover:border-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                        {statusUpdating && (
                                            <p className="text-xs text-gray-400 mt-2 animate-pulse">Updating status…</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <Package size={20} /> Order Items
                                </h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Item</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">Qty</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Price</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orderDetails.items.map(item => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-text-primary">{item.name ?? item.item_name}</td>
                                                    <td className="px-4 py-3 text-center text-text-primary">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-text-primary">₹{Number(item.price).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-text-primary">₹{Number(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Price Breakdown</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-text-primary">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{Number(orderDetails.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-primary">
                                        <span>Tax</span>
                                        <span className="font-semibold">₹{Number(orderDetails.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold text-ruby-red">
                                            <span>Total</span>
                                            <span>₹{Number(orderDetails.total_amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Timestamps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <CreditCard size={16} /> Payment Information
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-blue-800">
                                            <span className="font-semibold">Method:</span> {orderDetails.payment_method ?? 'N/A'}
                                        </div>
                                        <div className="text-sm text-blue-800">
                                            <span className="font-semibold">Status:</span> {orderDetails.payment_status}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                        <Clock size={16} /> Timestamps
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-purple-800">
                                            <span className="font-semibold">Created:</span> {formatDate(orderDetails.created_at)}
                                        </div>
                                        {orderDetails.updated_at && (
                                            <div className="text-sm text-purple-800">
                                                <span className="font-semibold">Updated:</span> {formatDate(orderDetails.updated_at)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
