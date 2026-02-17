import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        await adminDb.collection('donations').doc(id).delete();

        return NextResponse.json({ message: 'success' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();

        await adminDb.collection('donations').doc(id).update(body);

        return NextResponse.json({ message: 'success' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
