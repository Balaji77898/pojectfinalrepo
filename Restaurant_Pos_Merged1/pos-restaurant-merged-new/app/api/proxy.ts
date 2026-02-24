import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = 'https://superconservatively-drouthiest-karoline.ngrok-free.dev';

/**
 * Generic proxy helper — forwards any request to the ngrok backend.
 * Runs server-side so there is no CORS issue.
 */
export async function proxyToBackend(
    req: NextRequest,
    backendPath: string
): Promise<NextResponse> {
    const url = `${BACKEND_BASE}${backendPath}`;

    // Forward only necessary headers; add ngrok bypass header
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    // Forward Authorization header if present
    const auth = req.headers.get('Authorization') || req.headers.get('authorization');
    if (auth) {
        headers['Authorization'] = auth;
    }

    try {
        let body: string | undefined;
        const method = req.method;

        if (method !== 'GET' && method !== 'HEAD') {
            body = await req.text();
        }

        const backendRes = await fetch(url, {
            method,
            headers,
            body,
        });

        const contentType = backendRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await backendRes.json();
            return NextResponse.json(data, { status: backendRes.status });
        } else {
            const text = await backendRes.text();
            return new NextResponse(text, {
                status: backendRes.status,
                headers: { 'Content-Type': 'text/plain' },
            });
        }
    } catch (error: any) {
        console.error(`Proxy error for ${backendPath}:`, error);
        return NextResponse.json(
            { message: error.message || 'Failed to reach backend server' },
            { status: 502 }
        );
    }
}
