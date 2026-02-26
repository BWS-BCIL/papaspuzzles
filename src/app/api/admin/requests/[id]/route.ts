import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAdminSession } from '@/lib/adminAuth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const body = await request.json();
        const { status } = body;
        const { id } = await params;

        await adminDb.collection('requests').doc(id).update({ status });

        return NextResponse.json({ message: 'success' });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
