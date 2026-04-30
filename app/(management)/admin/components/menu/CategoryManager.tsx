"use client";

import React, { useState } from 'react';
import { Plus, FolderOpen, Trash2, Star } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';

interface CategoryManagerProps {
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryManager({ selectedCategory, onSelectCategory }: CategoryManagerProps) {
    const { categories, addCategory, deleteCategory, isLoading } = useMenu();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        setIsSubmitting(true);
        try {
            await addCategory({
                name: newCategory.name,
                description: newCategory.description || undefined,
            });
            setNewCategory({ name: '', description: '' });
            setShowAddForm(false);
        } catch (error: any) {
            alert(error.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <FolderOpen className="text-ruby-red" size={24} />
                <h2 className="text-xl font-serif font-bold text-text-primary">Categories</h2>
            </div>

            {/* Add Category Button - Premium Style */}
            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm border-2 font-bold mb-6
                    ${showAddForm 
                        ? 'bg-ruby-red text-white border-ruby-red' 
                        : 'bg-white text-ruby-red border-ruby-red hover:bg-ruby-red/5'}`}
            >
                <Plus size={18} />
                Add Category
            </button>

            {/* Add Category Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl border border-ruby-red/20 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Category Name *</label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ruby-red focus:border-transparent text-sm"
                                placeholder="e.g., Appetizers"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-ruby-red text-white rounded-xl text-sm font-bold shadow-md hover:bg-ruby-red/90 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewCategory({ name: '', description: '' });
                                }}
                                className="px-4 py-2.5 bg-gray-200 text-text-primary rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Categories List */}
            <div className="space-y-3">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 border-2 font-bold shadow-sm
                        ${selectedCategory === null
                            ? 'bg-ruby-red text-white border-ruby-red shadow-ruby-red/20 scale-[1.02]'
                            : 'bg-white text-text-primary border-gray-100 hover:border-ruby-red/30 hover:bg-ruby-red/5'
                        }`}
                >
                    <span className="font-bold">All Items</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${selectedCategory === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-muted'}`}>
                        View all
                    </span>
                </button>

                {categories
                    .filter(c => !c.name.toLowerCase().includes('special'))
                    .map((category) => (
                    <div key={category.id} className="group relative">
                        <div
                            onClick={() => onSelectCategory(category.id)}
                            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 border-2 font-bold shadow-sm cursor-pointer
                                ${selectedCategory === category.id
                                    ? 'bg-ruby-red text-white border-ruby-red shadow-ruby-red/20 scale-[1.02]'
                                    : 'bg-white text-text-primary border-gray-100 hover:border-ruby-red/30 hover:bg-ruby-red/5'
                                }`}
                        >
                            <div className="flex flex-col items-start pr-8">
                                <span className="font-bold">{category.name}</span>
                                {category.description && (
                                    <span className={`text-[10px] font-medium uppercase tracking-wider mt-0.5 ${selectedCategory === category.id ? 'text-white/70' : 'text-text-muted'}`}>
                                        {category.description}
                                    </span>
                                )}
                            </div>
                            
                            {/* Delete Button - Correctly placed (not nested in a button) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                                        deleteCategory(category.id);
                                    }
                                }}
                                className={`p-2 rounded-lg transition-all z-10
                                    ${selectedCategory === category.id 
                                        ? 'text-white/60 hover:text-white hover:bg-white/20' 
                                        : 'text-gray-300 hover:text-ruby-red hover:bg-ruby-red/10'}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && !showAddForm && (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <FolderOpen className="mx-auto mb-2 text-gray-300" size={40} />
                        <p className="text-sm font-medium text-gray-400">No categories found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export selected category for parent component
export function useCategoryFilter() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    return { selectedCategory, setSelectedCategory };
}
