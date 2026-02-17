import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Hardcoded password for MVP, matching original server logic
        if (password === 'puzzleadmin123') {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
