"use client";

import React, { useState } from 'react';
import { Bell, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

    return (
        <div className="relative">
            {/* Notification Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm group"
                aria-label="Notifications"
            >
                <Bell size={20} className="text-white group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-start text-[10px] font-bold text-ruby-red border-2 border-ruby-red">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div
                            className="fixed inset-0 z-[100]"
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Dropdown Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 bg-card-white rounded-2xl shadow-2xl border border-gold-start/20 overflow-hidden z-[110]"
                        >
                            <div className="p-4 border-b border-gold-start/10 flex items-center justify-between bg-ruby-red/5">
                                <h3 className="font-serif font-bold text-ruby-red flex items-center gap-2">
                                    <Bell size={18} />
                                    Notifications
                                </h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-xs text-ruby-red hover:underline font-semibold"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                            <Bell size={24} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm text-text-muted">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-ruby-red/5 transition-colors cursor-pointer relative group ${
                                                    !notification.read ? 'bg-gold-start/5' : ''
                                                }`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                {!notification.read && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-start" />
                                                )}
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-ruby-red/10 flex items-center justify-center shrink-0">
                                                        <ShoppingBag size={18} className="text-ruby-red" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-text-dark leading-snug">
                                                            Order <span className="font-bold">#{notification.orderId.slice(-6)}</span> is placed by <span className="font-bold">{notification.customerName}</span>
                                                        </p>
                                                        <p className="text-[10px] text-text-muted mt-1">
                                                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-md transition-all"
                                                    >
                                                        <X size={14} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                        New orders appear here automatically
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
