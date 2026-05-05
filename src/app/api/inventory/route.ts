import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Filtering by `status` and ordering by a different field (`created_at`)
        // requires a composite Firestore index. To avoid that dependency, we fetch
        // by status only and sort in memory.
        const snapshot = await adminDb.collection('donations')
            .where('status', '==', 'available')
            .get();

        interface DonationDoc { id: string; created_at?: string; [key: string]: unknown; }

        const data: DonationDoc[] = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as DonationDoc))
            .sort((a, b) => {
                // Use '0' so docs missing created_at sort to the end in descending order
                const aDate = a.created_at ?? '0';
                const bDate = b.created_at ?? '0';
                return bDate.localeCompare(aDate);
            });

        return NextResponse.json({ message: 'success', data });
    } catch (error: unknown) {
        console.error('Inventory error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

