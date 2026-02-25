import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('trades')
            .orderBy('created_at', 'desc')
            .get();

        const trades = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const trade = { id: doc.id, ...doc.data() } as any;

                // Fetch donation names for display
                const givenIds: string[] = trade.given_donation_ids || (trade.given_donation_id ? [trade.given_donation_id] : []);
                const givenNames: string[] = [];
                for (const donationId of givenIds) {
                    try {
                        const donationDoc = await adminDb.collection('donations').doc(donationId).get();
                        if (donationDoc.exists) {
                            givenNames.push((donationDoc.data() as any).name || donationId);
                        }
                    } catch {
                        givenNames.push(donationId);
                    }
                }

                let receivedName = trade.received_donation_id;
                if (trade.received_donation_id) {
                    try {
                        const receivedDoc = await adminDb.collection('donations').doc(trade.received_donation_id).get();
                        if (receivedDoc.exists) {
                            receivedName = (receivedDoc.data() as any).name || trade.received_donation_id;
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
    } catch (error: any) {
        console.error('GET /api/admin/trades error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
