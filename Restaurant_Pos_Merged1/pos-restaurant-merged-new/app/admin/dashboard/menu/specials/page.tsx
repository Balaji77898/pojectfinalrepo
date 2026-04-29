"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeft, Star, Plus, Pencil, Trash2, Search,
    X, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { menuService, MenuItem, Category, CreateMenuItemRequest, UpdateMenuItemRequest } from '../../../lib/menu.service';

const SPECIALS_CATEGORY_NAME = "Today's Special";

// ─── Google Drive link converter ─────────────────────────────────────────────
function convertGDrive(url: string): string {
    if (!url) return url;
    if (/drive\.google\.com\/uc\?/.test(url)) return url;
    const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
    return url;
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateMenuItemRequest | UpdateMenuItemRequest) => Promise<void>;
    item?: MenuItem | null;          // null/undefined = add mode
    specialCategoryId: string;
}

function ItemModal({ isOpen, onClose, onSave, item, specialCategoryId }: ItemModalProps) {
    const isEdit = !!item;
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        preparation_time: '' as number | '',
        is_available: true,
    });
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (isOpen) {
            setError('');
            if (item) {
                setForm({
                    name: item.name,
                    description: item.description ?? '',
                    price: item.price,
                    image_url: item.image_url ?? '',
                    preparation_time: item.preparation_time ?? '',
                    is_available: item.is_available,
                });
                setPreview(item.image_url ?? '');
            } else {
                setForm({ name: '', description: '', price: 0, image_url: '', preparation_time: '', is_available: true });
                setPreview('');
            }
        }
    }, [isOpen, item]);

    const handleImgUrl = (url: string) => {
        const converted = convertGDrive(url);
        setForm(f => ({ ...f, image_url: converted }));
        setPreview(converted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || form.price <= 0) {
            setError('Item name and a positive price are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload: any = {
                name: form.name.trim(),
                description: form.description || undefined,
                price: form.price,
                image_url: form.image_url || undefined,
                preparation_time: form.preparation_time || undefined,
                is_available: form.is_available,
            };
            if (!isEdit) payload.category_id = specialCategoryId;
            await onSave(payload);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save item.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-400 fill-amber-400" />
                        {isEdit ? 'Edit Special Item' : 'Add to Today\'s Special'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                            <AlertCircle size={15} className="shrink-0" />{error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name *</label>
                        <input type="text" value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                            placeholder="e.g. Chef's Signature Biryani" required />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm resize-none"
                            placeholder="Brief description…" />
                    </div>

                    {/* Price + Prep time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                            <input type="number" min="0" step="1" value={form.price || ''}
                                onChange={e => setForm(f => ({ ...f, price: Math.round(parseFloat(e.target.value) || 0) }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                                placeholder="0" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Prep Time (min)</label>
                            <input type="number" min="0" value={form.preparation_time}
                                onChange={e => setForm(f => ({ ...f, preparation_time: parseInt(e.target.value) || '' }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                                placeholder="e.g. 20" />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={form.image_url}
                            onChange={e => handleImgUrl(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                            placeholder="Paste Google Drive share link or direct URL" />
                        {preview && (
                            <div className="mt-2 h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={preview} alt="preview"
                                    className="w-full h-full object-cover"
                                    onError={() => setPreview('')} />
                            </div>
                        )}
                    </div>

                    {/* Available toggle */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={form.is_available}
                            onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))}
                            className="w-5 h-5 rounded text-amber-500 border-gray-300 focus:ring-amber-400" />
                        <span className="text-sm font-semibold text-gray-700">Available for ordering</span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-all disabled:opacity-60">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add to Special'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ item, onConfirm, onCancel }: {
    item: MenuItem | null;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Remove from Today's Special?</h3>
                <p className="text-gray-500 text-sm mb-6">
                    <strong>{item.name}</strong> will be removed from the database.
                </p>
                <div className="flex gap-3">
                    <button onClick={onConfirm}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                        Remove
                    </button>
                    <button onClick={onCancel}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Special Item Card ────────────────────────────────────────────────────────
function SpecialCard({ item, onEdit, onDelete }: {
    item: MenuItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            {/* Image */}
            <div className="relative h-44 bg-amber-50 overflow-hidden">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={40} className="text-amber-200" />
                    </div>
                )}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    <Star size={11} className="fill-white" /> Today's Special
                </div>
                <div className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_available ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{item.name}</h3>
                {item.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-extrabold text-amber-500">₹{Number(item.price).toFixed(2)}</span>
                    {item.preparation_time && (
                        <span className="text-xs text-gray-400">⏱ {item.preparation_time} min</span>
                    )}
                </div>
                <div className="flex gap-2 mt-3">
                    <button onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg text-sm transition-colors border border-amber-200">
                        <Pencil size={13} /> Edit
                    </button>
                    <button onClick={onDelete}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg text-sm transition-colors border border-red-200">
                        <Trash2 size={13} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TodaysSpecialPage() {
    const [category, setCategory] = useState<Category | null>(null);
    const [specialItems, setSpecialItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [search, setSearch] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
    const [actionMsg, setActionMsg] = useState('');

    // Fetch or create the "Today's Special" category, then load its items
    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        setPageError('');
        try {
            const cats = await menuService.getCategories();
            let special = cats.find(c => c.name.toLowerCase() === SPECIALS_CATEGORY_NAME.toLowerCase());

            // Create the category if it doesn't exist yet
            if (!special) {
                special = await menuService.createCategory({
                    name: SPECIALS_CATEGORY_NAME,
                    description: "Chef's handpicked daily specials",
                });
            }

            setCategory(special);

            const allItems = await menuService.getMenuItems();
            setSpecialItems(allItems.filter(i => i.category_id === special!.id));
        } catch (err: any) {
            setPageError(err.message || 'Failed to load Today\'s Special');
        } finally {
            setLoading(false);
        }
    };

    const flash = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(''), 3000);
    };

    const handleAdd = async (data: CreateMenuItemRequest) => {
        await menuService.createMenuItem(data as CreateMenuItemRequest);
        await load();
        flash('Item added to Today\'s Special ✓');
    };

    const handleEdit = async (data: UpdateMenuItemRequest) => {
        if (!editItem) return;
        await menuService.updateMenuItem(editItem.id, data as UpdateMenuItemRequest);
        await load();
        flash('Item updated ✓');
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        await menuService.deleteMenuItem(deleteItem.id);
        setDeleteItem(null);
        await load();
        flash('Item removed from Today\'s Special ✓');
    };

    const filtered = useMemo(() =>
        specialItems.filter(i =>
            !search || i.name.toLowerCase().includes(search.toLowerCase())
        ),
        [specialItems, search]
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)' }}>

                {/* Header */}
                <header className="py-8 px-8 shadow-lg border-b-4 border-amber-400"
                    style={{ background: 'linear-gradient(135deg, #92400e, #b45309)' }}>
                    <div className="max-w-7xl mx-auto">
                        <Link href="/admin/dashboard/menu"
                            className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white border border-amber-300/30 transition-all text-sm font-medium">
                            <ArrowLeft size={16} /> Back to Menu
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-white mb-1 flex items-center gap-3">
                                    <Star size={32} className="text-amber-300 fill-amber-300" />
                                    Today's Special
                                </h1>
                                <p className="text-amber-200/80">Curate today's chef specials — changes reflect in the database instantly</p>
                            </div>
                            <button onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold rounded-xl shadow-lg transition-all">
                                <Plus size={20} /> Add Special Item
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto p-8">

                    {/* Flash message */}
                    {actionMsg && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6 text-green-700 font-semibold text-sm shadow-sm">
                            <CheckCircle2 size={16} />{actionMsg}
                        </div>
                    )}

                    {/* Page error */}
                    {pageError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-6 text-red-700 text-sm">
                            <AlertCircle size={16} className="shrink-0" />{pageError}
                        </div>
                    )}

                    {/* Stats strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Total Specials', value: specialItems.length, color: 'text-amber-600' },
                            { label: 'Available Now', value: specialItems.filter(i => i.is_available).length, color: 'text-green-600' },
                            { label: 'Avg. Price', value: specialItems.length ? `₹${(specialItems.reduce((s, i) => s + Number(i.price), 0) / specialItems.length).toFixed(0)}` : '—', color: 'text-purple-600' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white rounded-xl shadow p-4 border border-amber-100">
                                <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow p-4 border border-amber-100 mb-6">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search today's specials…"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm" />
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl shadow-md h-72 animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-16 text-center border border-amber-100">
                            <Star size={56} className="mx-auto text-amber-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                {search ? 'No results found' : "No Today's Specials yet"}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                {search ? 'Try a different search term.' : 'Click "Add Special Item" to get started.'}
                            </p>
                            {!search && (
                                <button onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">
                                    <Plus size={18} className="inline mr-2" />Add Special Item
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map(item => (
                                <SpecialCard key={item.id} item={item}
                                    onEdit={() => setEditItem(item)}
                                    onDelete={() => setDeleteItem(item)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <ItemModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAdd as any}
                specialCategoryId={category?.id ?? ''}
            />

            {/* Edit Modal */}
            <ItemModal
                isOpen={!!editItem}
                onClose={() => setEditItem(null)}
                onSave={handleEdit as any}
                item={editItem}
                specialCategoryId={category?.id ?? ''}
            />

            {/* Delete Modal */}
            <DeleteModal
                item={deleteItem}
                onConfirm={handleDelete}
                onCancel={() => setDeleteItem(null)}
            />
        </ProtectedRoute>
    );
}
