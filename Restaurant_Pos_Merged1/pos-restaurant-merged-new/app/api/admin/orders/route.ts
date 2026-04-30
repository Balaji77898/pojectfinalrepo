import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/restaurant-pos/app/api/proxy';

export async function GET(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/orders');
}

export async function POST(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/orders');
}
