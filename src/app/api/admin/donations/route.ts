import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('donations')
            .orderBy('created_at', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ message: 'success', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

