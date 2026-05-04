"use client";

import React, { useState } from 'react';
import { X, DollarSign, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (method: string, tip: number) => Promise<void>;
    tableNumber?: string | null;
    totalAmount: number;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, tableNumber, totalAmount }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI'>('CASH');
    const [tipPercent, setTipPercent] = useState<number>(0);
    const [customTip, setCustomTip] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tipAmount = customTip ? parseFloat(customTip) || 0 : (totalAmount * tipPercent) / 100;
    const finalTotal = totalAmount + tipAmount;

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm(paymentMethod, tipAmount);
            onClose();
        } catch (error) {
            console.error('Payment confirmation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-ruby-red p-8 text-white relative">
                        <h2 className="text-3xl font-bold mb-1">Process Payment</h2>
                        <p className="text-white/80 text-lg">Table {tableNumber || 'N/A'}</p>
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Select Method */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Method</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('CASH')}
                                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-200 ${
                                        paymentMethod === 'CASH' 
                                        ? 'border-ruby-red bg-ruby-red/5 text-ruby-red shadow-lg' 
                                        : 'border-gray-100 text-gray-400 hover:border-ruby-red/20'
                                    }`}
                                >
                                    <DollarSign size={32} className="mb-2" />
                                    <span className="font-bold text-lg">Cash</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('UPI')}
                                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-200 ${
                                        paymentMethod === 'UPI' 
                                        ? 'border-ruby-red bg-ruby-red/5 text-ruby-red shadow-lg' 
                                        : 'border-gray-100 text-gray-400 hover:border-ruby-red/20'
                                    }`}
                                >
                                    <Smartphone size={32} className="mb-2" />
                                    <span className="font-bold text-lg">UPI</span>
                                </button>
                            </div>
                        </div>

                        {/* Add Tip */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Add Tip</label>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[0, 10, 15, 20].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => { setTipPercent(p); setCustomTip(''); }}
                                        className={`py-3 rounded-xl font-bold text-sm transition-all ${
                                            tipPercent === p && !customTip
                                            ? 'bg-gray-100 text-gray-900 shadow-sm' 
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {p}%
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={customTip}
                                    onChange={(e) => { setCustomTip(e.target.value); setTipPercent(0); }}
                                    placeholder="Custom amount (₹)"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ruby-red transition-all text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-gray-500 mb-2 font-medium">
                                <span>Order Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            {tipAmount > 0 && (
                                <div className="flex justify-between text-gray-500 mb-2 font-medium">
                                    <span>Tip</span>
                                    <span>₹{tipAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-2xl font-black text-ruby-red">
                                <span>Grand Total</span>
                                <span>₹{finalTotal}</span>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                                isSubmitting 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-50 text-gray-400 hover:bg-ruby-red hover:text-white hover:shadow-ruby-red/30 active:scale-[0.98]'
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-3 border-gray-300 border-t-ruby-red rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 size={24} />
                                    Confirm Payment
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
