import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const snapshot = await adminDb.collection('trades')
            .orderBy('created_at', 'desc')
            .get();

        const trades = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const trade = { id: doc.id, ...doc.data() } as Record<string, unknown> & { id: string };

                // Fetch donation names for display
                const givenIds: string[] = (trade.given_donation_ids as string[]) || (trade.given_donation_id ? [trade.given_donation_id as string] : []);
                const givenNames: string[] = [];
                for (const donationId of givenIds) {
                    try {
                        const donationDoc = await adminDb.collection('donations').doc(donationId).get();
                        if (donationDoc.exists) {
                            givenNames.push((donationDoc.data() as { name?: string }).name || donationId);
                        }
                    } catch {
                        givenNames.push(donationId);
                    }
                }

                let receivedName = trade.received_donation_id as string;
                if (trade.received_donation_id) {
                    try {
                        const receivedDoc = await adminDb.collection('donations').doc(trade.received_donation_id as string).get();
                        if (receivedDoc.exists) {
                            receivedName = (receivedDoc.data() as { name?: string }).name || trade.received_donation_id as string;
                        }
                    } catch {
                        // keep original id
                    }
                }

                return {
                    ...trade,
                    given_donation_names: givenNames,
                    received_donation_name: receivedName,
                };
            })
        );

        return NextResponse.json({ message: 'success', data: trades });
    } catch (error: unknown) {
        console.error('GET /api/admin/trades error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
