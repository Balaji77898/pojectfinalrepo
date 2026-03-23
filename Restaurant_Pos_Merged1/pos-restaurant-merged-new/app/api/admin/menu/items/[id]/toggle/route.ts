import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/proxy';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToBackend(req, `/api/admin/menu/items/${id}/toggle`);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToBackend(req, `/api/admin/menu/items/${id}/toggle`);
}
