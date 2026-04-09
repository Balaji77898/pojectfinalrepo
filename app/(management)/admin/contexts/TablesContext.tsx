"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { tablesService, Table, CreateTableRequest } from '../lib/tables.service';
import { useAuth } from './AuthContext';

interface TablesContextType {
    tables: Table[];
    isLoading: boolean;
    error: string | null;
    refetchTables: () => Promise<void>;
    addTable: (data: CreateTableRequest) => Promise<Table>;
    toggleTableStatus: (id: string) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export function TablesProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTables = async () => {
        try {
            const data = await tablesService.getTablesList();
            setTables(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching tables:', err);
            setError(err.message || 'Failed to load tables');
        }
    };

    // Fetch data when authenticated
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('admin_auth_token');
            if (token) {
                setIsLoading(true);
                await fetchTables();
                setIsLoading(false);
            } else if (!authLoading && !isAuthenticated) {
                setTables([]);
                setError(null);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, authLoading]);

    const addTable = async (data: CreateTableRequest): Promise<Table> => {
        const newTable = await tablesService.createTable(data);
        await fetchTables(); // Refresh list
        return newTable;
    };

    const toggleTableStatus = async (id: string) => {
        // Optimistic update
        setTables(prevTables =>
            prevTables.map(table =>
                table.id === id ? { ...table, is_active: !table.is_active } : table
            )
        );

        try {
            await tablesService.toggleTableStatus(id);
        } catch (error: any) {
            // Revert on error
            setTables(prevTables =>
                prevTables.map(table =>
                    table.id === id ? { ...table, is_active: !table.is_active } : table
                )
            );
            throw error;
        }
    };

    const deleteTable = async (id: string) => {
        await tablesService.deleteTable(id);
        setTables(prevTables => prevTables.filter(table => table.id !== id));
    };

    const value: TablesContextType = {
        tables,
        isLoading,
        error,
        refetchTables: fetchTables,
        addTable,
        toggleTableStatus,
        deleteTable,
    };

    return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>;
}

export function useTables() {
    const context = useContext(TablesContext);
    if (context === undefined) {
        throw new Error('useTables must be used within a TablesProvider');
    }
    return context;
}
