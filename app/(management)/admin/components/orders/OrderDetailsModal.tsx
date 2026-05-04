"use client";

import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CreditCard } from 'lucide-react';
import { OrderDetails, OrderStatus, PaymentStatus, OrderType } from '../../lib/orders.service';
import { useOrders } from '../../contexts/OrdersContext';
import { CheckCircle, ChefHat, Bell, Truck, Receipt, CreditCard as PaymentIcon, Printer, Download } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { restaurantService, RestaurantProfile } from '../../lib/restaurant.service';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
}

export default function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
    const { getOrderDetails, updateOrderStatus } = useOrders();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);

    useEffect(() => {
        const fetchResto = async () => {
            try {
                const profile = await restaurantService.getRestaurantProfile();
                setRestaurant(profile);
            } catch (err) {
                console.error('Failed to fetch restaurant profile:', err);
            }
        };
        fetchResto();
    }, []);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        if (!orderId) return;

        setIsLoading(true);
        setError(null);
        try {
            const details = await getOrderDetails(orderId);
            setOrderDetails(details);
        } catch (err: any) {
            setError(err.message || 'Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: OrderStatus | string) => {
        if (!orderId) return;
        setIsUpdating(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            await fetchOrderDetails(); // Refresh details
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleDownloadReceipt = async () => {
        const element = document.getElementById('printable-receipt');
        if (!element || !orderDetails) return;

        try {
            const dataUrl = await toPng(element, { quality: 0.95, backgroundColor: '#fff' });
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`receipt-${orderDetails.id.slice(0, 8)}.pdf`);
        } catch (err) {
            console.error('Failed to download receipt:', err);
            alert('Failed to generate PDF. Please try printing instead.');
        }
    };

    const handleConfirmPayment = async (method: string, tip: number) => {
        if (!orderId || !orderDetails) return;
        setIsUpdating(true);
        try {
            // Update order status to PAID
            await updateOrderStatus(orderId, OrderStatus.PAID);
            await fetchOrderDetails();
            setShowPaymentModal(false);
        } catch (err: any) {
            alert(err.message || 'Failed to confirm payment');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [OrderStatus.PLACED]: 'bg-sky-100 text-sky-800 border-sky-300',
            [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
            [OrderStatus.READY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderStatus.SERVED]: 'bg-teal-100 text-teal-800 border-teal-300',
            [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
            [OrderStatus.BILLED]: 'bg-indigo-100 text-indigo-800 border-indigo-300',
            [OrderStatus.PAID]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
        return styles[status] || styles[OrderStatus.PENDING];
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const styles = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        return styles[status] || styles[PaymentStatus.PENDING];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl no-print">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Order Details
                    </h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <style>{`
                    .visible-only-print { display: none; }
                    @media print {
                        html, body { height: initial !important; overflow: initial !important; -webkit-print-color-adjust: exact; }
                        .no-print { display: none !important; }
                        .visible-only-print { display: block !important; }
                        body * { visibility: hidden; }
                        #printable-receipt, #printable-receipt * { visibility: visible; }
                        #printable-receipt {
                            position: absolute; left: 0; top: 0; width: 100%; height: auto;
                            padding: 20mm; visibility: visible !important; background: white !important; display: block !important;
                        }
                        @page { size: portrait; margin: 0; }
                    }
                `}</style>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-800">{error}</p>
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Order ID</div>
                                        <div className="font-mono font-semibold text-text-primary">#{orderDetails.id.slice(0, 8)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Order Type</div>
                                        <div className="font-semibold text-text-primary">{orderDetails.order_type?.replace('_', ' ') || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Status</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(orderDetails.status)}`}>
                                            {orderDetails.status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Payment</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(orderDetails.payment_status)}`}>
                                            {orderDetails.payment_status === PaymentStatus.PAID ? 'Paid' : 
                                             orderDetails.status === OrderStatus.BILLED ? 'Billed' : orderDetails.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Transition & Receipt Actions */}
                            <div className="bg-white p-4 border-2 border-dashed border-gray-200 rounded-xl no-print">
                                <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                                    {orderDetails.status === OrderStatus.PAID ? 'Finalized Order' : 'Update Order Status'}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {orderDetails.status === OrderStatus.PLACED && (
                                        <button onClick={() => handleStatusUpdate(OrderStatus.CONFIRMED)} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md disabled:opacity-50">
                                            <CheckCircle size={18} /> Confirm Order
                                        </button>
                                    )}
                                    {orderDetails.status === OrderStatus.CONFIRMED && (
                                        <button onClick={() => handleStatusUpdate(OrderStatus.PREPARING)} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-md disabled:opacity-50">
                                            <ChefHat size={18} /> Start Preparing
                                        </button>
                                    )}
                                    {orderDetails.status === OrderStatus.PREPARING && (
                                        <button onClick={() => handleStatusUpdate(OrderStatus.READY)} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-bold shadow-md disabled:opacity-50">
                                            <Bell size={18} /> Mark as Ready
                                        </button>
                                    )}
                                    {orderDetails.status === OrderStatus.READY && (
                                        <button onClick={() => handleStatusUpdate(OrderStatus.SERVED)} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-bold shadow-md disabled:opacity-50">
                                            <Truck size={18} /> Mark as Served
                                        </button>
                                    )}
                                    {orderDetails.status === OrderStatus.SERVED && (
                                        <button onClick={() => handleStatusUpdate(OrderStatus.BILLED)} disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-md disabled:opacity-50">
                                            <Receipt size={18} /> Generate Bill
                                        </button>
                                    )}
                                    {orderDetails.status === OrderStatus.BILLED && orderDetails.payment_status !== PaymentStatus.PAID && (
                                        <button onClick={() => setShowPaymentModal(true)} disabled={isUpdating} className="flex items-center gap-2 px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-all font-bold shadow-lg transform hover:scale-105 disabled:opacity-50">
                                            <PaymentIcon size={20} /> Proceed to Payment
                                        </button>
                                    )}
                                    {(orderDetails.status === OrderStatus.BILLED || orderDetails.status === OrderStatus.PAID || orderDetails.status === OrderStatus.COMPLETED) && (
                                        <div className="flex gap-2">
                                            <button onClick={handlePrintReceipt} className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all font-bold shadow-md">
                                                <Printer size={18} /> Print Receipt
                                            </button>
                                            <button onClick={handleDownloadReceipt} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all font-bold shadow-md">
                                                <Download size={18} /> Download Receipt
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div id="printable-receipt" className="space-y-6 bg-white p-4 font-mono">
                                <div className="text-center mb-6 py-4 border-b border-gray-200">
                                    <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900 mb-1">{restaurant?.name || 'RESTAURANT'}</h1>
                                    <p className="text-sm font-medium text-gray-600 mb-2">{restaurant?.email || ''}</p>
                                    <h2 className="text-base font-bold text-gray-800 uppercase tracking-tighter">Payment Receipt</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-sm mb-6 pb-4 border-b border-gray-100">
                                    <div className="text-gray-500">Bill Number</div>
                                    <div className="text-right font-bold text-gray-900 uppercase">BILL-{orderDetails.id.slice(0, 8)}</div>
                                    <div className="text-gray-500">Date</div>
                                    <div className="text-right font-medium text-gray-900">{formatDate(orderDetails.created_at)}</div>
                                    <div className="text-gray-500">Payment Method</div>
                                    <div className="text-right font-bold text-gray-900">{orderDetails.payment_method || 'Cash'}</div>
                                    {orderDetails.table_number && (
                                        <>
                                            <div className="text-gray-500">Table</div>
                                            <div className="text-right font-bold text-gray-900">Table {orderDetails.table_number}</div>
                                        </>
                                    )}
                                </div>

                                <div className="uppercase text-xs font-black text-gray-900 mb-4 tracking-widest border-b border-gray-100 pb-2">Order Items</div>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Item</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">Qty</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Price</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orderDetails.items?.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className="px-4 py-3 text-text-primary">{item.name || (item as any).item_name || 'Item'}</td>
                                                    <td className="px-4 py-3 text-center text-text-primary">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-text-primary">₹{Number(item.price || 0).toFixed(0)}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-text-primary">₹{Math.round(Number(item.subtotal || 0) || (Number(item.price || 0) * Number(item.quantity || 0))).toFixed(0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="space-y-2">
                                        {(() => {
                                            const subtotal = orderDetails.items?.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0) || Number(orderDetails.subtotal || 0);
                                            const displayTax = Math.round(subtotal * 0.05);
                                            const displayTotal = Math.round(subtotal + displayTax);
                                            return (
                                                <>
                                                    <div className="flex justify-between text-text-primary">
                                                        <span className="text-gray-600 font-medium">Subtotal</span>
                                                        <span className="font-bold text-gray-900">₹{Math.round(subtotal).toFixed(0)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-text-primary">
                                                        <span className="text-gray-600 font-medium">Tax (5%)</span>
                                                        <span className="font-bold text-gray-900">₹{displayTax.toFixed(0)}</span>
                                                    </div>
                                                    <div className="border-t border-gray-300 pt-3 mt-3">
                                                        <div className="flex justify-between text-xl font-black text-gray-900 uppercase tracking-tighter">
                                                            <span>Total</span>
                                                            <span>₹{displayTotal.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center mt-10 visible-only-print">
                                                        <p className="text-gray-500 italic text-sm">Thank you for dining with us</p>
                                                    </div>
                                                </>
                                            );
                                        })()}
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
                                        <div className="text-sm text-blue-800"><span className="font-semibold">Method:</span> {orderDetails.payment_method || 'N/A'}</div>
                                        <div className="text-sm text-blue-800"><span className="font-semibold">Status:</span> {orderDetails.payment_status}</div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                        <Clock size={16} /> Timestamps
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-purple-800"><span className="font-semibold">Created:</span> {formatDate(orderDetails.created_at)}</div>
                                        {orderDetails.updated_at && <div className="text-sm text-purple-800"><span className="font-semibold">Updated:</span> {formatDate(orderDetails.updated_at)}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Payment Modal */}
            {orderDetails && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handleConfirmPayment}
                    tableNumber={orderDetails.table_number || (orderDetails as any).table?.table_number}
                    totalAmount={(() => {
                        const subtotal = orderDetails.items?.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0) || Number(orderDetails.subtotal || 0);
                        return Math.round(subtotal + (subtotal * 0.05));
                    })()}
                />
            )}
        </div>
    );
}
