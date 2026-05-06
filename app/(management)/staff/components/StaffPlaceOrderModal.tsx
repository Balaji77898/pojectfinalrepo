"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    X, Plus, Minus, ShoppingCart, User, Phone, MapPin,
    UtensilsCrossed, Search, AlertCircle
} from 'lucide-react';
import { staffOrdersService, CreateOrderPayload } from '../lib/staff-orders.service';
import { staffMenuService, StaffMenuItem, StaffCategory } from '../lib/staff-menu.service';
import { staffTablesService, StaffTable } from '../lib/staff-tables.service';
import { Icon } from './Icon';
import { Animated } from './Animated';
import { Gradient } from './Gradient';

interface CartItem extends StaffMenuItem {
    quantity: number;
}

interface StaffPlaceOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ORDER_TYPES = [
    { id: 'DINE_IN', label: 'Dine-In', icon: 'restaurant' as const },
    { id: 'TAKEAWAY', label: 'Takeaway', icon: 'receipt' as const },
    { id: 'DELIVERY', label: 'Delivery', icon: 'phone-portrait' as const }
];

export default function StaffPlaceOrderModal({ isOpen, onClose, onSuccess }: StaffPlaceOrderModalProps) {
    // Form state
    const [orderType, setOrderType] = useState('DINE_IN');
    const [selectedTableId, setSelectedTableId] = useState<string>('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod] = useState('CASH');
    const [notes, setNotes] = useState('');

    // Menu/Table state
    const [categories, setCategories] = useState<StaffCategory[]>([]);
    const [menuItems, setMenuItems] = useState<StaffMenuItem[]>([]);
    const [tables, setTables] = useState<StaffTable[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [menuSearch, setMenuSearch] = useState('');

    // Cart
    const [cart, setCart] = useState<CartItem[]>([]);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Load data
    useEffect(() => {
        if (!isOpen) return;
        setLoadingMeta(true);
        Promise.all([
            staffMenuService.getCategories(),
            staffMenuService.getMenuItems(),
            staffTablesService.getTables(),
        ])
            .then(([cats, items, tbls]) => {
                setCategories(cats);
                setMenuItems(items.filter(i => i.is_available));
                // Only show empty/active tables
                setTables(tbls.filter(t => t.is_active && t.table_status === 'EMPTY'));
            })
            .catch(err => {
                console.error('Error loading staff modal data:', err);
                setSubmitError('Failed to load menu or tables. Please check your connection.');
            })
            .finally(() => setLoadingMeta(false));
    }, [isOpen]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setOrderType('DINE_IN');
            setSelectedTableId('');
            setCustomerName('');
            setCustomerPhone('');
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

    const taxAmount = useMemo(() => Math.round(cartTotal * 0.05), [cartTotal]);
    const finalTotal = useMemo(() => cartTotal + taxAmount, [cartTotal, taxAmount]);

    const addToCart = (item: StaffMenuItem) => {
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

        const payload: CreateOrderPayload = {
            table_id: orderType === 'DINE_IN' ? selectedTableId : undefined,
            customer_name: customerName.trim() || 'Walk-in Customer',
            customer_phone: customerPhone.trim() || undefined,
            order_type: orderType,
            items: cart.map(c => ({ 
                menu_item_id: c.id, 
                quantity: c.quantity
            })),
            notes: notes.trim() || undefined,
            payment_method: paymentMethod,
            tax_amount: taxAmount,
            total_amount: finalTotal
        };

        setIsSubmitting(true);
        try {
            await staffOrdersService.createOrder(payload);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Submit staff order error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-ivory rounded-[48px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden border border-gold/20 animate-in fade-in zoom-in-95 duration-500">
                
                {/* Header */}
                <Gradient
                    colors={['#7B1F1F', '#5A1616']}
                    className="relative px-10 py-8 flex items-center justify-between overflow-hidden"
                >
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,white_20%,transparent_60%)]"></div>
                    </div>

                    <div className="relative z-10 flex items-center">
                        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-xl border border-white/20 shadow-inner">
                            <Icon name="restaurant" size={32} color="white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-white tracking-tight drop-shadow-sm">Place Order</h2>
                            <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse" />
                                <p className="text-gold/90 text-xs font-bold uppercase tracking-[0.25em]">Premium Staff Entry</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all border border-white/10 backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </Gradient>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    
                    <div className="flex-1 overflow-y-auto p-10 space-y-12">
                        
                        {/* Order Type Selection */}
                        <Animated type="fadeInUp" delay={0.1}>
                            <h3 className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                                <span className="w-8 h-px bg-gold/30 mr-3" />
                                01. Service Type
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                {ORDER_TYPES.map(type => (
                                    <button 
                                        key={type.id}
                                        onClick={() => { setOrderType(type.id); setSelectedTableId(''); }}
                                        className={`group relative overflow-hidden rounded-[32px] p-6 flex flex-col items-center justify-center transition-all duration-500 border-2 
                                            ${orderType === type.id 
                                                ? 'border-gold bg-white shadow-[0_20px_40px_-12px_rgba(200,169,81,0.2)] scale-[1.05] z-10' 
                                                : 'border-gold/5 bg-white/40 hover:border-gold/30 hover:bg-white hover:shadow-xl'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500
                                            ${orderType === type.id ? 'bg-primary text-white shadow-glow-gold' : 'bg-ivory text-primary/40 group-hover:bg-primary/5 group-hover:text-primary'}`}>
                                            <Icon name={type.icon} size={28} color="currentColor" />
                                        </div>
                                        <span className={`text-sm font-black tracking-widest uppercase ${orderType === type.id ? 'text-primary' : 'text-primary/40 group-hover:text-primary/70'}`}>{type.label}</span>
                                        
                                        {orderType === type.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-2.5 h-2.5 bg-gold rounded-full shadow-[0_0_12px_rgba(200,169,81,0.8)]" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Animated>

                        {/* Table Assignment (Dine-In) */}
                        {orderType === 'DINE_IN' && (
                            <Animated type="fadeInUp" className="p-8 bg-white/40 rounded-[40px] border border-gold/10 shadow-inner">
                                <h3 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                                    <MapPin size={12} className="mr-3" /> 02. Table Selection
                                </h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-3">
                                    {tables.map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => setSelectedTableId(t.id)}
                                            className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300
                                                ${selectedTableId === t.id 
                                                    ? 'bg-gold text-white shadow-glow-gold scale-125 z-10' 
                                                    : 'bg-white border border-gold/10 text-primary/60 hover:border-gold/50 hover:text-primary'
                                                }`}
                                        >
                                            {t.table_number}
                                        </button>
                                    ))}
                                    {tables.length === 0 && !loadingMeta && (
                                        <div className="col-span-full py-6 text-center text-primary/40 italic text-sm font-medium">
                                            All tables are currently occupied.
                                        </div>
                                    )}
                                </div>
                            </Animated>
                        )}

                        {/* Customer Details */}
                        <Animated type="fadeInUp" delay={0.2}>
                            <h3 className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center">
                                <span className="w-8 h-px bg-gold/30 mr-3" />
                                03. Guest Information
                            </h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gold/80 tracking-widest ml-1 uppercase">Guest Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            placeholder="Enter guest name..."
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-gold/10 rounded-[24px] focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all font-bold text-primary placeholder:text-primary/20 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gold/80 tracking-widest ml-1 uppercase">Contact Line</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <input 
                                            type="tel" 
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                            placeholder="+91 00000 00000"
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-gold/10 rounded-[24px] focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all font-bold text-primary placeholder:text-primary/20 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Animated>

                        {/* Menu Selection */}
                        <Animated type="fadeInUp" delay={0.3} className="pt-12 border-t-2 border-dashed border-gold/10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center">
                                    <UtensilsCrossed size={16} className="mr-3 text-gold" /> 04. Menu Selection
                                </h3>
                                <div className="flex gap-4">
                                    <div className="relative group">
                                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-gold transition-colors" />
                                        <input 
                                            type="text" 
                                            value={menuSearch}
                                            onChange={e => setMenuSearch(e.target.value)}
                                            placeholder="Search delicacy..."
                                            className="pl-14 pr-6 py-4 bg-white border border-gold/10 rounded-2xl text-sm font-bold text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all w-72 shadow-sm placeholder:text-primary/20"
                                        />
                                    </div>
                                    <select 
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        className="px-6 py-4 bg-white border border-gold/10 rounded-2xl text-sm font-black text-primary/70 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none shadow-sm cursor-pointer hover:border-gold/30 transition-all appearance-none"
                                    >
                                        <option value="ALL">All Categories</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loadingMeta ? (
                                <div className="grid grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-32 bg-white/40 rounded-[32px] animate-pulse border border-gold/5" />
                                    ))}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-24 bg-white/20 rounded-[40px] border-2 border-dashed border-gold/10">
                                    <div className="w-20 h-20 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Icon name="restaurant-outline" size={40} className="text-gold/30" />
                                    </div>
                                    <p className="text-primary/40 font-black text-lg tracking-tight">No match found in our cellar</p>
                                    <p className="text-primary/20 text-sm mt-1">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6">
                                    {filteredItems.map(item => {
                                        const qty = getQty(item.id);
                                        return (
                                            <div 
                                                key={item.id}
                                                className={`group relative overflow-hidden rounded-[32px] p-6 flex items-center justify-between transition-all duration-500 border-2
                                                    ${qty > 0 
                                                        ? 'border-gold bg-white shadow-[0_20px_40px_-12px_rgba(200,169,81,0.15)] translate-y-[-4px]' 
                                                        : 'border-transparent bg-white/40 hover:bg-white hover:border-gold/30 hover:shadow-xl'
                                                    }`}
                                            >
                                                <div className="flex-1 min-w-0 pr-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">{getCategoryName(item.category_id)}</p>
                                                    </div>
                                                    <p className="font-serif font-bold text-primary text-xl truncate mb-1">{item.name}</p>
                                                    <p className="text-2xl font-black text-primary">₹{item.price}</p>
                                                </div>
                                                
                                                {qty === 0 ? (
                                                    <button 
                                                        onClick={() => addToCart(item)}
                                                        className="w-14 h-14 rounded-2xl bg-ivory text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all shadow-sm active:scale-90"
                                                    >
                                                        <Plus size={28} strokeWidth={3} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-4 bg-primary/5 rounded-[20px] p-2 border border-gold/10">
                                                        <button 
                                                            onClick={() => changeQty(item.id, -1)}
                                                            className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-transform border border-gold/10"
                                                        >
                                                            <Minus size={18} strokeWidth={3} />
                                                        </button>
                                                        <span className="w-6 text-center font-black text-primary text-xl">{qty}</span>
                                                        <button 
                                                            onClick={() => changeQty(item.id, 1)}
                                                            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-transform shadow-glow-gold"
                                                        >
                                                            <Plus size={18} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Animated>
                    </div>

                    {/* RIGHT PANEL - Cart Summary */}
                    <div className="w-[420px] bg-[#FDFBF7] flex flex-col border-l border-gold/10">
                        <div className="p-10 border-b border-gold/10 bg-white/50 backdrop-blur-md">
                            <h3 className="flex items-center gap-4 text-xl font-serif font-bold text-primary">
                                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shadow-inner">
                                    <ShoppingCart size={24} className="text-gold" />
                                </div>
                                Selected Items
                                {cart.length > 0 && (
                                    <span className="ml-auto bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-glow-gold">
                                        {cart.reduce((s, c) => s + c.quantity, 0)} ITEMS
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gold/5">
                                        <ShoppingCart size={48} className="text-gold/20" />
                                    </div>
                                    <p className="text-primary/40 font-black text-xl tracking-tight">The tray is empty</p>
                                    <p className="text-primary/20 text-sm mt-2 leading-relaxed">Select items from our curated menu to begin the order.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <Animated key={item.id} type="slideInRight" className="bg-white rounded-[28px] p-5 shadow-sm border border-gold/5 group hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h4 className="font-serif font-bold text-primary text-base truncate">{item.name}</h4>
                                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.15em] mt-1">₹{item.price} EACH</p>
                                            </div>
                                            <p className="font-black text-primary text-lg">₹{item.price * item.quantity}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-ivory rounded-xl p-1 border border-gold/5">
                                                <button 
                                                    onClick={() => changeQty(item.id, -1)}
                                                    className="w-9 h-9 rounded-lg bg-white text-primary/40 hover:text-gold transition-colors flex items-center justify-center shadow-sm"
                                                >
                                                    <Minus size={16} strokeWidth={2.5} />
                                                </button>
                                                <span className="w-6 text-center font-black text-primary text-base">{item.quantity}</span>
                                                <button 
                                                    onClick={() => changeQty(item.id, 1)}
                                                    className="w-9 h-9 rounded-lg bg-white text-primary/40 hover:text-gold transition-colors flex items-center justify-center shadow-sm"
                                                >
                                                    <Plus size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => changeQty(item.id, -item.quantity)}
                                                className="w-10 h-10 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </Animated>
                                ))
                            )}
                        </div>

                        {/* Order Notes */}
                        <div className="px-10 pb-6">
                            <div className="relative">
                                <div className="absolute top-4 left-5 text-gold/30">
                                    <Icon name="create-outline" size={18} />
                                </div>
                                <textarea 
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Special requests or allergies..."
                                    className="w-full h-28 pl-14 pr-6 py-4 bg-white border border-gold/10 rounded-[28px] text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all resize-none shadow-sm placeholder:text-primary/20"
                                />
                            </div>
                        </div>

                        {/* Totals & Submit */}
                        <div className="p-10 bg-white border-t border-gold/10 rounded-br-[48px] shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.05)]">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-black text-primary/30 tracking-widest">
                                    <span>SUBTOTAL</span>
                                    <span className="text-primary/60 font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black text-primary/30 tracking-widest">
                                    <span>TAX (5% GST)</span>
                                    <span className="text-primary/60 font-bold">₹{taxAmount}</span>
                                </div>
                                <div className="flex justify-between items-end pt-5 border-t border-gold/10">
                                    <span className="text-xs font-black text-gold tracking-[0.2em]">TOTAL AMOUNT</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter drop-shadow-sm">₹{finalTotal}</span>
                                </div>
                            </div>

                            {submitError && (
                                <Animated type="fadeIn" className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                                    <p className="text-xs font-bold text-red-600 leading-tight">{submitError}</p>
                                </Animated>
                            )}

                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting || cart.length === 0}
                                className="w-full group relative overflow-hidden"
                            >
                                <Gradient
                                    colors={isSubmitting || cart.length === 0 ? ['#F1F5F9', '#F1F5F9'] : ['#C8A951', '#B8993D']}
                                    className={`py-6 rounded-[28px] transition-all duration-500 flex items-center justify-center gap-4 shadow-xl
                                        ${isSubmitting || cart.length === 0 
                                            ? 'cursor-not-allowed grayscale' 
                                            : 'hover:scale-[1.02] active:scale-95 shadow-gold/30'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="text-white font-black text-lg tracking-widest">PLACING...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Icon name="checkmark-circle" size={24} color="white" />
                                            <span className={`text-white font-black text-lg tracking-[0.2em] uppercase ${cart.length === 0 ? 'text-primary/20' : 'text-white'}`}>
                                                Place Order
                                            </span>
                                        </>
                                    )}
                                </Gradient>
                                {!isSubmitting && cart.length > 0 && (
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-[-20deg]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
