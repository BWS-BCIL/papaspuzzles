import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, pieces, difficulty, theme, condition, email, image_url } = body;

        const docRef = await adminDb.collection('donations').add({
            name,
            pieces: parseInt(pieces),
            difficulty,
            theme,
            condition,
            email,
            image_url,
            status: 'available', // Explicitly set as available for trade
            created_at: new Date().toISOString()
        });

        const newDoc = await docRef.get();

        return NextResponse.json({ message: 'success', data: { id: docRef.id, ...newDoc.data() } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
