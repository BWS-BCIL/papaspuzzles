import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { validateString, validateEmail, validatePositiveInt } from '@/lib/validate';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { name, pieces, difficulty, theme, condition, email } = body;

        try {
            name = validateString(name, 'Name');
            email = validateEmail(email);
            pieces = validatePositiveInt(pieces, 'Pieces');
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Validation error' }, { status: 400 });
        }

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
    } catch (error: unknown) {
        console.error('Donation error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
