import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            userName, userEmail, uid,
            donations, // array of donation objects
            wantedPuzzleId,
            dropoffDatetime,
        } = body;

        if (!donations || !Array.isArray(donations) || donations.length === 0) {
            return NextResponse.json({ error: 'donations array is required' }, { status: 400 });
        }

        // 1. Insert donation documents (1 or 2 depending on trade tier)
        const donationIds: string[] = [];
        for (const donation of donations) {
            const donationRef = await adminDb.collection('donations').add({
                name: donation.name,
                pieces: donation.pieces,
                difficulty: 'medium',
                theme: donation.type,
                condition: donation.condition || 'good',
                email: userEmail,
                image_url: donation.image || null,
                status: 'pending_admin_review',
                uid: uid || null,
                created_at: new Date().toISOString(),
            });
            donationIds.push(donationRef.id);
        }

        // 2. Create the Trade record
        const tradeRef = await adminDb.collection('trades').add({
            user_name: userName,
            user_email: userEmail,
            uid: uid || null,
            given_donation_ids: donationIds,
            received_donation_id: wantedPuzzleId,
            dropoff_datetime: dropoffDatetime || null,
            status: 'pending',
            created_at: new Date().toISOString(),
        });

        // 3. Mark the requested puzzle as 'traded'
        await adminDb.collection('donations').doc(wantedPuzzleId).update({
            status: 'traded',
        });

        // 4. Ensure user document exists
        if (uid) {
            const userRef = adminDb.collection('users').doc(uid);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                await userRef.set({
                    uid,
                    email: userEmail || null,
                    displayName: userName || null,
                    completedTradesCount: 0,
                    createdAt: new Date().toISOString(),
                });
            }
        }

        return NextResponse.json({ message: 'success', tradeId: tradeRef.id });

    } catch (error: any) {
        console.error('Trade error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
