import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'uid is required' }, { status: 400 });
        }

        const userDoc = await adminDb.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data()!;
        const completedTradesCount = userData.completedTradesCount ?? 0;
        const credits = userData.credits ?? 0;
        const tradeTier = completedTradesCount === 0 ? 'first-time' : 'returning';

        return NextResponse.json({
            message: 'success',
            data: { ...userData, completedTradesCount, credits, tradeTier },
        });
    } catch (error: unknown) {
        console.error('GET /api/users error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, email, displayName } = body;

        if (!uid) {
            return NextResponse.json({ error: 'uid is required' }, { status: 400 });
        }

        const userRef = adminDb.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                uid,
                email: email || null,
                displayName: displayName || null,
                completedTradesCount: 0,
                credits: 0,
                createdAt: new Date().toISOString(),
            });
        } else {
            // Update display info but do not overwrite completedTradesCount
            await userRef.update({
                email: email || null,
                displayName: displayName || null,
            });
        }

        const updatedDoc = await userRef.get();
        return NextResponse.json({ message: 'success', data: updatedDoc.data() });
    } catch (error: unknown) {
        console.error('POST /api/users error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
