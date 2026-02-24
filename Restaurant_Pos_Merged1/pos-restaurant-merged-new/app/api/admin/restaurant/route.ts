import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/proxy';

export async function GET(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/restaurant');
}

export async function PUT(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/restaurant');
}
