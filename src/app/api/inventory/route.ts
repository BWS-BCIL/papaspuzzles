import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('donations')
            .where('status', '==', 'available')
            .orderBy('created_at', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ message: 'success', data });
    } catch (error: unknown) {
        console.error('Inventory error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

