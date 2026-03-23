"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    // Start as null = "not yet determined" to avoid SSR/client mismatch.
    // On the server localStorage doesn't exist, so we must not read it during SSR.
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const auth = authService.isAuthenticated();
        setIsAuthenticated(auth);
        if (!auth) {
            router.replace('/admin/login');
        }
    }, [router]);

    // null = still determining (initial server render or just-mounted client)
    // Render nothing until we know — avoids both hydration mismatch and content flash.
    if (isAuthenticated === null || isAuthenticated === false) {
        return null;
    }

    return <>{children}</>;
}
