"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    X, Plus, Minus, ShoppingCart, User, Phone, MapPin,
    UtensilsCrossed, Search, ChevronDown, AlertCircle
} from 'lucide-react';
import { ordersService, OrderType, CreateOrderRequest } from '../../lib/orders.service';
import { menuService, MenuItem, Category } from '../../lib/menu.service';
import { tablesService, Table } from '../../lib/tables.service';

interface CartItem extends MenuItem {
    quantity: number;
}

interface PlaceOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'OTHER'];

export default function PlaceOrderModal({ isOpen, onClose, onSuccess }: PlaceOrderModalProps) {
    const router = useRouter();
    // Form state
    const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
    const [selectedTableId, setSelectedTableId] = useState<string>('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [notes, setNotes] = useState('');

    // Menu state
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [menuSearch, setMenuSearch] = useState('');

    // Cart
    const [cart, setCart] = useState<CartItem[]>([]);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Load menu items, categories, tables on open
    useEffect(() => {
        if (!isOpen) return;
        setLoadingMeta(true);
        Promise.all([
            menuService.getCategories(),
            menuService.getMenuItems(),
            tablesService.getTablesList(),
        ])
            .then(([cats, items, tbls]) => {
                setCategories(cats);
                setMenuItems(items.filter(i => i.is_available));
                // Filter to show only active and empty (available) tables
                setTables(tbls.filter(t => t.is_active && t.table_status === 'EMPTY'));
            })
            .catch(err => {
                console.error('Error loading modal data:', err);
            })
            .finally(() => setLoadingMeta(false));
    }, [isOpen]);

    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            setOrderType(OrderType.DINE_IN);
            setSelectedTableId('');
            setCustomerName('');
            setCustomerPhone('');
            setPaymentMethod('CASH');
            setNotes('');
            setCart([]);
            setSubmitError(null);
            setMenuSearch('');
            setSelectedCategory('ALL');
        }
    }, [isOpen]);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCat = selectedCategory === 'ALL' || item.category_id === selectedCategory;
            const matchesSearch = !menuSearch ||
                item.name.toLowerCase().includes(menuSearch.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [menuItems, selectedCategory, menuSearch]);

    const cartTotal = useMemo(() =>
        cart.reduce((sum, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            return sum + price * item.quantity;
        }, 0),
        [cart]);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === item.id);
            if (existing) {
                return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const changeQty = (itemId: string, delta: number) => {
        setCart(prev => {
            return prev
                .map(c => c.id === itemId ? { ...c, quantity: c.quantity + delta } : c)
                .filter(c => c.quantity > 0);
        });
    };

    const getQty = (itemId: string) => cart.find(c => c.id === itemId)?.quantity ?? 0;

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? '';

    const handleSubmit = async () => {
        setSubmitError(null);
        if (cart.length === 0) {
            setSubmitError('Please add at least one item to the order.');
            return;
        }
        if (orderType === 'DINE_IN' && !selectedTableId) {
            setSubmitError('Please select a table for Dine-In orders.');
            return;
        }

        const payload: any = {
            order_type: orderType,
            items: cart.map(c => ({ 
                menu_item_id: c.id, 
                quantity: c.quantity,
                price: typeof c.price === 'string' ? parseFloat(c.price) : c.price
            })),
            payment_method: paymentMethod,
            total_amount: cartTotal // Include total_amount explicitly
        };
        if (customerName.trim()) payload.customer_name = customerName.trim();
        if (customerPhone.trim()) payload.customer_phone = customerPhone.trim();
        
        // Ensure table_id is handled correctly for all types
        if (orderType === 'DINE_IN') {
            if (selectedTableId) payload.table_id = selectedTableId;
        } else {
            // For Takeaway/Delivery, we send an empty string to satisfy backend validation 
            // without actually assigning a table.
            payload.table_id = "";
        }

        if (notes.trim()) payload.notes = notes.trim();

        setIsSubmitting(true);
        try {
            const order = await ordersService.createOrder(payload);
            onSuccess(); // refresh parent orders list

            // Find selected table number for success display
            const selectedTable = tables.find(t => t.id === selectedTableId);
            const params = new URLSearchParams({
                type: orderType,
                ...(selectedTable ? { table: selectedTable.table_number } : {}),
                ...(customerName.trim() ? { name: customerName.trim() } : {}),
                ...(cartTotal ? { amount: cartTotal.toFixed(2) } : {}),
                ...(order?.id ? { orderId: order.id } : {}),
            });
            router.push(`/admin/dashboard/orders/success?${params.toString()}`);
        } catch (err: any) {
            console.error('Submit order error:', err);
            setSubmitError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-6 flex flex-col"
                style={{ maxHeight: 'calc(100vh - 48px)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-ruby-red rounded-t-2xl border-b-4 border-gold-start">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white">Place Manual Order</h2>
                        <p className="text-gold-start/80 text-sm mt-0.5">Fill in the details and select items</p>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

                    {/* LEFT — Order Details + Menu */}
                    <div className="flex-1 overflow-y-auto p-6 border-r border-gray-100">

                        {/* 1. Order Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Order Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'DINE_IN', label: '🍽 Dine-In' },
                                    { id: 'TAKEAWAY', label: '🥡 Takeaway' },
                                    { id: 'DELIVERY', label: '🛵 Delivery' }
                                ].map(type => (
                                    <button key={type.id}
                                        onClick={() => { setOrderType(type.id as OrderType); setSelectedTableId(''); }}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all duration-200
                                            ${orderType === type.id
                                                ? 'border-ruby-red bg-ruby-red/10 text-ruby-red shadow-inner'
                                                : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-ruby-red/30'}`}>
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Table selection (Only for Dine-In) */}
                        {orderType === 'DINE_IN' && (
                            <div className="mb-6 p-4 bg-ruby-red/5 rounded-xl border border-ruby-red/10 animate-in fade-in slide-in-from-top-1">
                                <label className="block text-sm font-bold text-ruby-red mb-2 uppercase tracking-wider">
                                    <MapPin size={14} className="inline mr-1" /> Assign Table *
                                </label>
                                <select
                                    value={selectedTableId}
                                    onChange={e => setSelectedTableId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm bg-white font-semibold">
                                    <option value="">— Select an available table —</option>
                                    {tables.map(t => (
                                        <option key={t.id} value={t.id}>
                                            Table {t.table_number}
                                        </option>
                                    ))}
                                </select>
                                {tables.length === 0 && !loadingMeta && (
                                    <p className="mt-2 text-xs text-red-500 font-medium italic">No available tables found. Please check Table Management.</p>
                                )}
                            </div>
                        )}

                        {/* 3. Customer & Payment Details */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Customer Information</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Name</label>
                                    <input type="text" value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="Customer Name"
                                        className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Phone</label>
                                    <input type="tel" value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">Payment Method</label>
                                <div className="flex flex-wrap gap-2">
                                    {PAYMENT_METHODS.map(pm => (
                                        <button key={pm}
                                            onClick={() => setPaymentMethod(pm)}
                                            className={`px-5 py-2 rounded-full border-2 text-xs font-bold transition-all
                                                ${paymentMethod === pm
                                                    ? 'border-ruby-red bg-ruby-red text-white'
                                                    : 'border-gray-100 bg-white text-gray-500 hover:border-ruby-red/40'}`}>
                                            {pm}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Menu Selection */}
                        <div className="border-t-2 border-dashed border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                    <UtensilsCrossed size={16} className="text-ruby-red" /> Select Menu Items
                                </h3>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={menuSearch}
                                        onChange={e => setMenuSearch(e.target.value)}
                                        placeholder="Search menu items..."
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-ruby-red focus:border-transparent" />
                                </div>
                                <div className="relative min-w-[150px]">
                                    <select value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        className="appearance-none w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-ruby-red focus:border-transparent bg-white font-medium">
                                        <option value="ALL">All Categories</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Menu Grid */}
                            {loadingMeta ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium">No items found matching your filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredItems.map(item => {
                                        const qty = getQty(item.id);
                                        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                                        return (
                                            <div key={item.id}
                                                className={`flex items-center justify-between border-2 rounded-2xl p-3 transition-all duration-200
                                                    ${qty > 0 ? 'border-ruby-red bg-ruby-red/5' : 'border-gray-50 bg-gray-50/50 hover:border-ruby-red/20 hover:bg-white'}`}>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">{getCategoryName(item.category_id)}</p>
                                                    <p className="text-sm font-black text-ruby-red mt-1">₹{price.toFixed(2)}</p>
                                                </div>
                                                {qty === 0 ? (
                                                    <button onClick={() => addToCart(item)}
                                                        className="w-10 h-10 flex items-center justify-center bg-ruby-red text-white rounded-xl hover:bg-ruby-red/90 transition-all shadow-md active:scale-95">
                                                        <Plus size={20} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-ruby-red/10">
                                                        <button onClick={() => changeQty(item.id, -1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-ruby-red hover:bg-ruby-red/10 transition-colors">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-5 text-center text-sm font-black text-ruby-red">{qty}</span>
                                                        <button onClick={() => changeQty(item.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-ruby-red text-white hover:bg-ruby-red/90 transition-colors">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Cart Summary */}
                    <div className="w-full lg:w-80 flex flex-col bg-gray-50 rounded-br-2xl">
                        <div className="px-6 py-5 border-b border-gray-200 bg-white">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={18} className="text-ruby-red" />
                                Order Summary
                                {cart.length > 0 && (
                                    <span className="ml-auto bg-ruby-red text-white text-xs font-black px-2.5 py-1 rounded-full">
                                        {cart.reduce((s, c) => s + c.quantity, 0)}
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-16 text-gray-300">
                                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold">Your cart is empty</p>
                                    <p className="text-xs mt-1">Add items to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map(item => {
                                        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                                        return (
                                            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-sm font-bold text-gray-800 truncate pr-2">{item.name}</p>
                                                    <p className="text-sm font-black text-ruby-red">₹{(price * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 font-medium">₹{price.toFixed(2)} each</span>
                                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5">
                                                        <button onClick={() => changeQty(item.id, -1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-100 text-gray-400 hover:text-ruby-red transition-colors">
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                                                        <button onClick={() => changeQty(item.id, 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-100 text-gray-400 hover:text-ruby-red transition-colors">
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer - Checkout */}
                        <div className="px-6 py-5 border-t border-gray-200 bg-white rounded-br-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-sm font-bold text-gray-500">Subtotal</span>
                                <span className="text-2xl font-black text-ruby-red tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                            </div>

                            {submitError && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-sm text-red-700 font-medium animate-bounce">
                                    <AlertCircle size={18} className="shrink-0" />
                                    {submitError}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || cart.length === 0}
                                className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg
                                    ${isSubmitting || cart.length === 0
                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-ruby-red text-white hover:bg-ruby-red/90 hover:shadow-ruby-red/30 active:scale-[0.98]'}`}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        Place Order · ₹{cartTotal.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
