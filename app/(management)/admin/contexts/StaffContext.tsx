"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { staffService, StaffMember, CreateStaffRequest, UpdateStaffRequest } from '../lib/staff.service';
import { useAuth } from './AuthContext';

interface StaffContextType {
    staff: StaffMember[];
    isLoading: boolean;
    error: string | null;
    refetchStaff: () => Promise<void>;
    addStaff: (data: CreateStaffRequest) => Promise<void>;
    updateStaff: (id: string, data: UpdateStaffRequest) => Promise<void>;
    toggleStaffStatus: (id: string) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStaff = async () => {
        try {
            const data = await staffService.getStaffList();
            setStaff(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching staff:', err);
            setError(err.message || 'Failed to load staff');
        }
    };

    // Fetch data when authenticated
    useEffect(() => {
        const fetchData = async () => {
            if (!authLoading && isAuthenticated) {
                setIsLoading(true);
                await fetchStaff();
                setIsLoading(false);
            } else if (!authLoading && !isAuthenticated) {
                setStaff([]);
                setError(null);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, authLoading]);

    const addStaff = async (data: CreateStaffRequest) => {
        await staffService.createStaff(data);
        await fetchStaff();
    };

    const updateStaff = async (id: string, data: UpdateStaffRequest) => {
        await staffService.updateStaff(id, data);
        await fetchStaff();
    };

    const toggleStaffStatus = async (id: string) => {
        // Optimistic update
        setStaff(prev =>
            prev.map(member =>
                member.id === id ? { ...member, is_active: !member.is_active } : member
            )
        );

        try {
            await staffService.toggleStaffStatus(id);
        } catch (err) {
            // Revert on error
            await fetchStaff();
            throw err;
        }
    };

    const deleteStaff = async (id: string) => {
        await staffService.deleteStaff(id);
        setStaff(prev => prev.filter(member => member.id !== id));
    };

    const value: StaffContextType = {
        staff,
        isLoading,
        error,
        refetchStaff: fetchStaff,
        addStaff,
        updateStaff,
        toggleStaffStatus,
        deleteStaff,
    };

    return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
    const context = useContext(StaffContext);
    if (context === undefined) {
        throw new Error('useStaff must be used within a StaffProvider');
    }
    return context;
}
