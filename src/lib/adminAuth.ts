import { NextResponse } from 'next/server';

// Auth disabled for alpha testing — anyone with the admin URL can access.
export async function requireAdminSession(): Promise<NextResponse | null> {
    return null;
}
