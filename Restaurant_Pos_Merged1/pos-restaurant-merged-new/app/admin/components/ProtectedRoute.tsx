"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();

    // Synchronous check — localStorage is available immediately on the client.
    // This runs during render (before paint) so there is no flicker or spinner.
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/admin/login');
        }
    }, [isAuthenticated, router]);

    // If not authenticated, render nothing while the redirect happens.
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
