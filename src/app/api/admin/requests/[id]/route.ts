import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { status } = body;
        const { id } = params;

        await adminDb.collection('requests').doc(id).update({ status });

        return NextResponse.json({ message: 'success' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
