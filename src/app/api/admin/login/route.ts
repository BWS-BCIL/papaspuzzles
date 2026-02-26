import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_PASSWORD and ADMIN_JWT_SECRET environment variables must be set.');
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);

export async function POST(request: Request) {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('8h')
        .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
        path: '/',
    });
    return response;
}
