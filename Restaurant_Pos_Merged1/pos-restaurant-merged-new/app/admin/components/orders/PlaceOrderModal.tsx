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
                setTables(tbls.filter(t => t.is_active));
            })
            .catch(console.error)
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
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
        if (orderType === OrderType.DINE_IN && !selectedTableId) {
            setSubmitError('Please select a table for Dine-In orders.');
            return;
        }

        const payload: CreateOrderRequest = {
            order_type: orderType,
            items: cart.map(c => ({ menu_item_id: c.id, quantity: c.quantity })),
            payment_method: paymentMethod,
        };
        if (customerName.trim()) payload.customer_name = customerName.trim();
        if (customerPhone.trim()) payload.customer_phone = customerPhone.trim();
        if (orderType === OrderType.DINE_IN && selectedTableId) payload.table_id = selectedTableId;
        if (notes.trim()) payload.notes = notes.trim();

        setIsSubmitting(true);
        try {
            const order = await ordersService.createOrder(payload);
            onSuccess(); // trigger a background refetch

            // Find selected table number for the success page
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

                        {/* Order Type */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[OrderType.DINE_IN, OrderType.TAKEAWAY, OrderType.DELIVERY].map(type => (
                                    <button key={type}
                                        onClick={() => { setOrderType(type); setSelectedTableId(''); }}
                                        className={`py-2.5 px-3 rounded-lg border-2 font-semibold text-sm transition-all
                                            ${orderType === type
                                                ? 'border-ruby-red bg-ruby-red/10 text-ruby-red'
                                                : 'border-gray-200 text-gray-600 hover:border-ruby-red/40'}`}>
                                        {type === OrderType.DINE_IN ? '🍽 Dine-In' : type === OrderType.TAKEAWAY ? '🥡 Takeaway' : '🛵 Delivery'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table selection (Dine-In only) */}
                        {orderType === OrderType.DINE_IN && (
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin size={14} className="inline mr-1 text-ruby-red" />Table *
                                </label>
                                <select
                                    value={selectedTableId}
                                    onChange={e => setSelectedTableId(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm">
                                    <option value="">— Select a table —</option>
                                    {tables.map(t => (
                                        <option key={t.id} value={t.id}>
                                            Table {t.table_number}
                                            {t.table_status === 'OCCUPIED' ? ' (Occupied)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    <User size={13} className="inline mr-1 text-ruby-red" />Customer Name
                                </label>
                                <input type="text" value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    <Phone size={13} className="inline mr-1 text-ruby-red" />Phone Number
                                </label>
                                <input type="tel" value={customerPhone}
                                    onChange={e => setCustomerPhone(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm" />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                            <div className="flex flex-wrap gap-2">
                                {PAYMENT_METHODS.map(pm => (
                                    <button key={pm}
                                        onClick={() => setPaymentMethod(pm)}
                                        className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all
                                            ${paymentMethod === pm
                                                ? 'border-ruby-red bg-ruby-red text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-ruby-red/40'}`}>
                                        {pm}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Special Instructions</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Any special requests or notes..."
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm resize-none" />
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-200 mb-5" />
                        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <UtensilsCrossed size={16} className="text-ruby-red" />Select Menu Items
                        </h3>

                        {/* Category + Search filters */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={menuSearch}
                                    onChange={e => setMenuSearch(e.target.value)}
                                    placeholder="Search items..."
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ruby-red focus:border-transparent" />
                            </div>
                            <div className="relative">
                                <select value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ruby-red focus:border-transparent">
                                    <option value="ALL">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Menu Item List */}
                        {loadingMeta ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <p className="text-gray-400 text-center py-8 text-sm">No items found</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {filteredItems.map(item => {
                                    const qty = getQty(item.id);
                                    return (
                                        <div key={item.id}
                                            className={`flex items-center justify-between bg-gray-50 border rounded-xl px-3 py-2.5 transition-all
                                                ${qty > 0 ? 'border-ruby-red/40 bg-ruby-red/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">{getCategoryName(item.category_id)}</p>
                                                <p className="text-sm font-bold text-ruby-red">₹{Number(item.price).toFixed(2)}</p>
                                            </div>
                                            {qty === 0 ? (
                                                <button onClick={() => addToCart(item)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-ruby-red text-white rounded-lg text-xs font-semibold hover:bg-ruby-red/90 transition-colors shrink-0">
                                                    <Plus size={13} />Add
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button onClick={() => changeQty(item.id, -1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-ruby-red/10 text-ruby-red hover:bg-ruby-red/20 transition-colors">
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="w-5 text-center text-sm font-bold text-ruby-red">{qty}</span>
                                                    <button onClick={() => changeQty(item.id, 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-ruby-red text-white hover:bg-ruby-red/90 transition-colors">
                                                        <Plus size={13} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Cart Summary */}
                    <div className="w-full lg:w-80 flex flex-col bg-gray-50 rounded-br-2xl">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={16} className="text-ruby-red" />
                                Order Summary
                                {cart.length > 0 && (
                                    <span className="ml-auto bg-ruby-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {cart.reduce((s, c) => s + c.quantity, 0)}
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-3">
                            {cart.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No items added yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button onClick={() => changeQty(item.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-ruby-red/10 hover:text-ruby-red transition-colors">
                                                    <Minus size={11} />
                                                </button>
                                                <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => changeQty(item.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-ruby-red/10 hover:text-ruby-red transition-colors">
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                            <p className="ml-3 text-sm font-bold text-ruby-red w-16 text-right shrink-0">
                                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Total + Place Order */}
                        <div className="px-5 py-4 border-t border-gray-200 bg-white rounded-br-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-gray-600">Subtotal</span>
                                <span className="text-lg font-bold text-ruby-red">₹{cartTotal.toFixed(2)}</span>
                            </div>

                            {submitError && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-sm text-red-700">
                                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                    {submitError}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || cart.length === 0}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                                    ${isSubmitting || cart.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-ruby-red text-white hover:bg-ruby-red/90 shadow-lg hover:shadow-ruby-red/30'}`}>
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
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
