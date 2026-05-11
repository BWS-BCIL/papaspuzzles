import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('donations').select('theme').get();
        const seen = new Set<string>();
        const themes: string[] = [];

        for (const doc of snapshot.docs) {
            const rawTheme = doc.data().theme;
            if (typeof rawTheme !== 'string') continue;

            const trimmedTheme = rawTheme.trim();
            if (!trimmedTheme) continue;

            const key = trimmedTheme.toLowerCase();
            if (seen.has(key)) continue;

            seen.add(key);
            themes.push(trimmedTheme);
        }

        themes.sort((a, b) => a.localeCompare(b));
        return NextResponse.json({ message: 'success', data: themes });
    } catch (error: unknown) {
        console.error('Themes API error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
