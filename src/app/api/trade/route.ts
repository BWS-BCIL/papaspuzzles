import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { validateString, validateEmail } from '@/lib/validate';
import * as admin from 'firebase-admin';

type TradeMode = 'swap' | 'donate_only' | 'claim_with_credit';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { userName, userEmail } = body;
        const {
            uid,
            donations, // array of donation objects
            wantedPuzzleId,
            dropoffDatetime,
            mode,
        } = body;
        const tradeMode: TradeMode = mode === 'donate_only' || mode === 'claim_with_credit' ? mode : 'swap';

        try {
            userName = validateString(userName, 'User name');
            userEmail = validateEmail(userEmail);
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Validation error' }, { status: 400 });
        }

        const submittedDonations = Array.isArray(donations) ? donations : [];
        const requiresDonation = tradeMode !== 'claim_with_credit';
        const requiresClaim = tradeMode !== 'donate_only';

        if (requiresDonation && submittedDonations.length === 0) {
            return NextResponse.json({ error: 'donations array is required' }, { status: 400 });
        }

        if (tradeMode === 'claim_with_credit' && submittedDonations.length > 0) {
            return NextResponse.json({ error: 'Donations are not required when claiming with credits' }, { status: 400 });
        }

        if (requiresClaim) {
            try {
                validateString(wantedPuzzleId, 'Wanted puzzle');
            } catch (e: unknown) {
                return NextResponse.json({ error: e instanceof Error ? e.message : 'Validation error' }, { status: 400 });
            }

            const wantedDoc = await adminDb.collection('donations').doc(wantedPuzzleId).get();
            if (!wantedDoc.exists) {
                return NextResponse.json({ error: 'Requested puzzle does not exist' }, { status: 404 });
            }

            const wantedData = wantedDoc.data();
            if (wantedData?.status !== 'available') {
                return NextResponse.json({ error: 'Requested puzzle is no longer available' }, { status: 400 });
            }
        }

        // Validate each donation's name
        for (const donation of submittedDonations) {
            try {
                validateString(donation.name, 'Donation name');
            } catch (e: unknown) {
                return NextResponse.json({ error: e instanceof Error ? e.message : 'Validation error' }, { status: 400 });
            }
        }

        // 1. Insert donation documents if this mode includes donated puzzles.
        const donationIds: string[] = [];
        if (requiresDonation) {
            for (const donation of submittedDonations) {
                const donationRef = await adminDb.collection('donations').add({
                    name: donation.name,
                    pieces: donation.pieces,
                    difficulty: 'medium',
                    theme: typeof donation.type === 'string' ? donation.type.trim() : donation.type,
                    condition: donation.condition || 'good',
                    email: userEmail,
                    image_url: donation.image || null,
                    status: 'pending_admin_review',
                    uid: uid || null,
                    created_at: new Date().toISOString(),
                });
                donationIds.push(donationRef.id);
            }
        }

        const userRef = uid ? adminDb.collection('users').doc(uid) : null;
        if (userRef) {
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                await userRef.set({
                    uid,
                    email: userEmail || null,
                    displayName: userName || null,
                    completedTradesCount: 0,
                    credits: 0,
                    createdAt: new Date().toISOString(),
                });
            }
        }

        if (tradeMode === 'donate_only') {
            const creditsEarned = donationIds.length;

            if (userRef && creditsEarned > 0) {
                await userRef.set(
                    { credits: admin.firestore.FieldValue.increment(creditsEarned) },
                    { merge: true }
                );
            }

            return NextResponse.json({ message: 'success', mode: tradeMode, creditsEarned });
        }

        if (tradeMode === 'claim_with_credit') {
            if (!uid || !userRef) {
                return NextResponse.json({ error: 'You must be signed in to claim with credits' }, { status: 400 });
            }

            const userDoc = await userRef.get();
            const currentCredits = Number(userDoc.data()?.credits ?? 0);
            if (currentCredits < 1) {
                return NextResponse.json({ error: 'Not enough credits to claim a puzzle' }, { status: 400 });
            }

            await userRef.set(
                { credits: admin.firestore.FieldValue.increment(-1) },
                { merge: true }
            );
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
            mode: tradeMode,
            created_at: new Date().toISOString(),
        });

        // 3. Mark the requested puzzle as 'traded'
        await adminDb.collection('donations').doc(wantedPuzzleId).update({
            status: 'traded',
        });

        return NextResponse.json({ message: 'success', tradeId: tradeRef.id });

    } catch (error: unknown) {
        console.error('Trade error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
