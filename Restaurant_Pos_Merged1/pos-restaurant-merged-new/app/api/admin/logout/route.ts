import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/proxy';

export async function POST(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/logout');
}
