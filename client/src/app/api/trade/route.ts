import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            userName, userEmail,
            donationName, donationPieces, donationType, donationCondition, donationImage,
            wantedPuzzleId
        } = body;

        // 1. Insert the new donation
        const donationRef = await adminDb.collection('donations').add({
            name: donationName,
            pieces: donationPieces,
            difficulty: 'medium', // Default
            theme: donationType,
            condition: donationCondition || 'good',
            email: userEmail,
            image_url: donationImage,
            status: 'available',
            created_at: new Date().toISOString()
        });

        // 2. Create the Trade record
        const tradeRef = await adminDb.collection('trades').add({
            user_name: userName,
            user_email: userEmail,
            given_donation_id: donationRef.id,
            received_donation_id: wantedPuzzleId,
            created_at: new Date().toISOString()
        });

        // 3. Mark the requested puzzle as 'traded'
        await adminDb.collection('donations').doc(wantedPuzzleId).update({
            status: 'traded'
        });

        return NextResponse.json({ message: 'success', tradeId: tradeRef.id });

    } catch (error: any) {
        console.error('Trade error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
