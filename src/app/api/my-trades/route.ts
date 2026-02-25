import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const tradesSnapshot = await adminDb.collection('trades')
            .where('user_email', '==', email)
            .orderBy('created_at', 'desc')
            .get();

        const trades = tradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Fetch related donations manually (NoSQL join)
        const formattedData = await Promise.all(trades.map(async (trade: any) => {
            let givenName = '';
            let receivedName = '';
            let receivedImage = '';

            if (trade.given_donation_id) {
                const givenDoc = await adminDb.collection('donations').doc(trade.given_donation_id).get();
                if (givenDoc.exists) givenName = givenDoc.data()?.name;
            }

            if (trade.received_donation_id) {
                const receivedDoc = await adminDb.collection('donations').doc(trade.received_donation_id).get();
                if (receivedDoc.exists) {
                    const data = receivedDoc.data();
                    receivedName = data?.name;
                    receivedImage = data?.image_url;
                }
            }

            return {
                ...trade,
                given_name: givenName,
                received_name: receivedName,
                received_image: receivedImage
            };
        }));

        return NextResponse.json({ message: 'success', data: formattedData });
    } catch (error: any) {
        console.error('MyTrades error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
