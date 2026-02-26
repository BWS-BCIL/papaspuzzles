import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAdminSession } from '@/lib/adminAuth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const { id } = await params;

        await adminDb.collection('donations').doc(id).delete();

        return NextResponse.json({ message: 'success' });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        await adminDb.collection('donations').doc(id).update(body);

        return NextResponse.json({ message: 'success' });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
