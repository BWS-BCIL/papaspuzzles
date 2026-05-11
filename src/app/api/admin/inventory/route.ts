import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAdminSession } from '@/lib/adminAuth';

export async function POST(request: Request) {
    const authError = await requireAdminSession();
    if (authError) return authError;

    try {
        const body = await request.json();
        const { name, pieces, difficulty, theme, condition, email, image_url } = body;

        const docRef = await adminDb.collection('donations').add({
            name,
            pieces: Number.parseInt(pieces, 10),
            difficulty,
            theme: typeof theme === 'string' ? theme.trim() : theme,
            condition,
            email,
            image_url,
            status: 'available', // Explicitly set as available for trade
            created_at: new Date().toISOString()
        });

        const newDoc = await docRef.get();

        return NextResponse.json({ message: 'success', data: { id: docRef.id, ...newDoc.data() } });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
