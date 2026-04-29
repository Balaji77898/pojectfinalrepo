import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../../proxy';

// Admin manually places an order — backend order creation endpoint
export async function POST(req: NextRequest) {
    return proxyToBackend(req, '/api/orders');
}
