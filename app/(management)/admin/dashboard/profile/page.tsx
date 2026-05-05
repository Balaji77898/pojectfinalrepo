"use client";

import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import StatusBadge from '../../components/StatusBadge';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Building2, Phone, Mail, MapPin, FileText, ArrowLeft, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantProfile() {
    const { restaurant, contacts, isLoading, error, updateDetails, addContact, deleteContact } = useRestaurant();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: '',
        email: '',
        address: '',
        description: '',
        state: '',
        pincode: ''
    });
    const [newContact, setNewContact] = useState({ type: 'PHONE' as 'PHONE' | 'EMAIL', value: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (restaurant) {
            setEditForm({
                phone: restaurant.phone || '',
                email: restaurant.email || '',
                address: restaurant.address || '',
                description: restaurant.description || '',
                state: restaurant.state || '',
                pincode: restaurant.pincode || ''
            });
        }
    }, [restaurant]);

    const handleUpdateDetails = async () => {
        setIsSubmitting(true);
        try {
            await updateDetails(editForm);
            setIsEditing(false);
        } catch (err) {
            alert('Failed to update restaurant details');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddContact = async () => {
        if (!newContact.value.trim()) return;
        setIsSubmitting(true);
        try {
            await addContact(newContact.type, newContact.value);
            setNewContact({ ...newContact, value: '' });
        } catch (err) {
            alert('Failed to add contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            await deleteContact(id);
        } catch (err) {
            alert('Failed to delete contact');
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-paper-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ruby-red mx-auto"></div>
                        <p className="mt-4 text-text-muted">Loading restaurant profile...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !restaurant) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-paper-white flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-ruby-red font-semibold">Failed to load restaurant profile</p>
                        <p className="text-text-muted mt-2">{error || 'Restaurant data not available'}</p>
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ruby-red text-white hover:bg-ruby-red/90 transition-all duration-200 font-bold text-sm shadow-lg group mt-4"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <Link
                                href="/admin/dashboard"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gold-start hover:text-white border border-gold-start/30 hover:border-white/50 transition-all duration-200 font-bold text-sm backdrop-blur-sm shadow-lg group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                                Back to Dashboard
                            </Link>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-start text-ruby-red hover:bg-white transition-all font-bold text-sm shadow-lg"
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-bold text-sm"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateDetails}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-ruby-red hover:bg-gold-start transition-all font-bold text-sm shadow-lg disabled:opacity-50"
                                    >
                                        <Check size={16} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">
                            Restaurant Profile
                        </h1>
                        <p className="text-gold-start/80">View and manage your restaurant information</p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Core Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Core Identity Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">
                                            {restaurant.name}
                                        </h2>
                                        <p className="text-lg text-text-muted">{restaurant.restaurant_type}</p>
                                    </div>
                                    <StatusBadge status={restaurant.status} className="text-sm" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <FileText className="text-ruby-red mt-1 flex-shrink-0" size={20} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Description</h3>
                                            {isEditing ? (
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none min-h-[100px]"
                                                    placeholder="Tell us about your restaurant..."
                                                />
                                            ) : (
                                                <p className="text-text-muted">{restaurant.description || 'No description provided'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <MapPin className="text-ruby-red mt-1 flex-shrink-0" size={20} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Address</h3>
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={editForm.address}
                                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none"
                                                        placeholder="Full Address"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={editForm.state}
                                                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none"
                                                            placeholder="State"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editForm.pincode}
                                                            onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none"
                                                            placeholder="Pincode"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-text-muted">
                                                    <p>{restaurant.address}</p>
                                                    <p>{restaurant.city}, {restaurant.state}</p>
                                                    <p>{restaurant.country} - {restaurant.pincode}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Contacts Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-ruby-red/10 p-3 rounded-lg">
                                            <Plus className="text-ruby-red" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold text-text-primary">
                                            Additional Contacts
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {contacts.length === 0 ? (
                                        <p className="text-text-muted italic text-center py-4 bg-gray-50 rounded-xl">No additional contacts added</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {contacts.map((contact) => (
                                                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                                                    <div className="flex items-center gap-3">
                                                        {contact.type === 'PHONE' ? <Phone size={18} className="text-ruby-red" /> : <Mail size={18} className="text-ruby-red" />}
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{contact.type}</div>
                                                            <div className="text-text-primary font-medium">{contact.value}</div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        className="p-2 text-gray-300 hover:text-ruby-red transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 bg-ruby-red/5 rounded-2xl border border-ruby-red/10">
                                    <h4 className="font-bold text-ruby-red mb-4 text-sm uppercase tracking-wider">Add New Contact</h4>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <select
                                            value={newContact.type}
                                            onChange={(e) => setNewContact({ ...newContact, type: e.target.value as 'PHONE' | 'EMAIL' })}
                                            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ruby-red outline-none bg-white"
                                        >
                                            <option value="PHONE">Phone</option>
                                            <option value="EMAIL">Email</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={newContact.value}
                                            onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                                            placeholder={newContact.type === 'PHONE' ? 'Enter phone number' : 'Enter email address'}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ruby-red outline-none"
                                        />
                                        <button
                                            onClick={handleAddContact}
                                            disabled={isSubmitting || !newContact.value.trim()}
                                            className="px-6 py-2 bg-ruby-red text-white rounded-xl font-bold hover:bg-ruby-red/90 transition-all shadow-lg disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Primary Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-ruby-red/10 p-3 rounded-lg">
                                        <Building2 className="text-ruby-red" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                                        Primary Contact
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <Phone className="text-ruby-red" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Primary Phone</h3>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none"
                                                />
                                            ) : (
                                                <a href={`tel:${restaurant.phone}`} className="text-text-muted hover:text-ruby-red transition-colors font-medium">
                                                    {restaurant.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <Mail className="text-ruby-red" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Primary Email</h3>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none"
                                                />
                                            ) : (
                                                <a href={`mailto:${restaurant.email}`} className="text-text-muted hover:text-ruby-red transition-colors font-medium">
                                                    {restaurant.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Restaurant ID</div>
                                    <div className="font-mono text-sm text-text-muted break-all">{restaurant.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
