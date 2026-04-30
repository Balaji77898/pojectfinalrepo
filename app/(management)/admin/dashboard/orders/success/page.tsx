"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';

// Inner component that safely reads search params
function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const tableNumber = searchParams.get('table');
    const orderType = searchParams.get('type') || 'DINE_IN';
    const orderId = searchParams.get('orderId');
    const customerName = searchParams.get('name');
    const amount = searchParams.get('amount');
    const customMessage = searchParams.get('successMessage');

    // Auto-redirect after 8 seconds
    const [countdown, setCountdown] = useState(8);
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push('/admin/dashboard/orders');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [router]);

    const getOrderTypeLabel = () => {
        if (orderType === 'TAKEAWAY') return 'Takeaway';
        if (orderType === 'DELIVERY') return 'Delivery';
        return 'Dine-In';
    };

    const getSuccessMessage = () => {
        if (customMessage) return customMessage;
        if (orderType === 'DINE_IN' && tableNumber) {
            return `Order placed for Table ${tableNumber} successfully!`;
        }
        if (orderType === 'TAKEAWAY') return 'Takeaway order placed successfully!';
        if (orderType === 'DELIVERY') return 'Delivery order placed successfully!';
        return 'Order placed successfully!';
    };

    return (
        <div className="min-h-screen bg-paper-white flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">

                {/* Top accent bar */}
                <div className="h-2 bg-gradient-to-r from-ruby-red via-gold-start to-ruby-red" />

                <div className="p-10 text-center">
                    {/* Animated checkmark */}
                    <div className="relative inline-flex mb-6">
                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center animate-pulse">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 size={56} className="text-green-500" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Main message */}
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                        {getSuccessMessage()}
                    </h1>

                    <p className="text-gray-500 text-sm mb-8">
                        The order has been recorded and sent to the kitchen.
                    </p>

                    {/* Order detail pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-ruby-red/8 rounded-full text-ruby-red text-sm font-semibold border border-ruby-red/20">
                            <span>📋</span> {getOrderTypeLabel()}
                        </div>
                        {tableNumber && (
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-semibold border border-blue-100">
                                <span>🪑</span> Table {tableNumber}
                            </div>
                        )}
                        {customerName && (
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 rounded-full text-purple-700 text-sm font-semibold border border-purple-100">
                                <span>👤</span> {customerName}
                            </div>
                        )}
                        {amount && (
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-semibold border border-green-100">
                                <span>💰</span> ₹{Number(amount).toFixed(2)}
                            </div>
                        )}
                        {orderId && (
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-gray-600 text-sm border border-gray-200">
                                <span>🆔</span>
                                <span className="font-mono text-xs">{orderId.slice(0, 8)}…</span>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/admin/dashboard/orders"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-ruby-red text-white font-semibold rounded-xl hover:bg-ruby-red/90 transition-all shadow-lg hover:shadow-ruby-red/30"
                        >
                            <ClipboardList size={18} />
                            View All Orders
                        </Link>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Countdown */}
                    <p className="mt-6 text-xs text-gray-400">
                        Redirecting to orders list in{' '}
                        <span className="font-bold text-ruby-red">{countdown}s</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Outer page wraps inner content in Suspense (required by Next.js App Router for useSearchParams)
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-paper-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-ruby-red/20 border-t-ruby-red animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
