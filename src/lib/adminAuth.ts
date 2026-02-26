import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);

export async function requireAdminSession(): Promise<NextResponse | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return null;
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
