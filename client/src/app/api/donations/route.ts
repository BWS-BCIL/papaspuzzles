import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, pieces, difficulty, theme, condition, email } = body;

        const docRef = await adminDb.collection('donations').add({
            name,
            pieces,
            difficulty,
            theme,
            condition,
            email,
            status: 'available', // Default status
            created_at: new Date().toISOString()
        });

        const newDoc = await docRef.get();

        return NextResponse.json({ message: 'success', data: { id: docRef.id, ...newDoc.data() } });
    } catch (error: any) {
        console.error('Donation error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
