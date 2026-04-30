import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../../proxy';

export async function GET(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/menu/items');
}

export async function POST(req: NextRequest) {
    return proxyToBackend(req, '/api/admin/menu/items');
}
