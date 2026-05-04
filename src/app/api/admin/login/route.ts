import { NextResponse } from 'next/server';

// Auth disabled for alpha testing.
export async function POST() {
    return NextResponse.json({ success: true });
}
