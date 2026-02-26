import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { validateString, validateEmail } from '@/lib/validate';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { type, pieces, difficulty, email } = body;

        try {
            type = validateString(type, 'Type');
            email = validateEmail(email);
            pieces = validateString(pieces, 'Pieces');
        } catch (e: unknown) {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Validation error' }, { status: 400 });
        }

        const docRef = await adminDb.collection('requests').add({
            type,
            pieces,
            difficulty,
            email,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        const newDoc = await docRef.get();

        return NextResponse.json({ message: 'success', data: { id: docRef.id, ...newDoc.data() } });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
