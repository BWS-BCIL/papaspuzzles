import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';
import { requireAdminSession } from '@/lib/adminAuth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (action === 'confirm_dropoff') {
            // Get the trade to find the uid
            const tradeDoc = await adminDb.collection('trades').doc(id).get();
            if (!tradeDoc.exists) {
                return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
            }

            const trade = tradeDoc.data() as { uid?: string; user_email?: string; user_name?: string };

            // Set trade status to completed
            await adminDb.collection('trades').doc(id).update({
                status: 'completed',
                completed_at: new Date().toISOString(),
            });

            // Increment completedTradesCount on the user document
            if (trade.uid) {
                const userRef = adminDb.collection('users').doc(trade.uid);
                const userDoc = await userRef.get();
                if (userDoc.exists) {
                    await userRef.update({
                        completedTradesCount: admin.firestore.FieldValue.increment(1),
                    });
                } else {
                    await userRef.set({
                        uid: trade.uid,
                        email: trade.user_email || null,
                        displayName: trade.user_name || null,
                        completedTradesCount: 1,
                        createdAt: new Date().toISOString(),
                    });
                }
            }

            return NextResponse.json({ message: 'success' });
        }

        // Generic update
        await adminDb.collection('trades').doc(id).update(body);
        return NextResponse.json({ message: 'success' });
    } catch (error: unknown) {
        console.error('PATCH /api/admin/trades/[id] error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
