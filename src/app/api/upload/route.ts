import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebaseAdmin';
import convert from 'heic-convert';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('puzzlePhoto') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        let buffer: Buffer = Buffer.from(await file.arrayBuffer());
        let mimeType = file.type;
        let fileName = file.name;

        // HEIC conversion
        if (fileName.toLowerCase().endsWith('.heic') || mimeType === 'image/heic') {
            try {
                const converted = await convert({
                    buffer: buffer,
                    format: 'JPEG',
                    quality: 0.8
                });
                buffer = Buffer.from(new Uint8Array(converted));
                mimeType = 'image/jpeg';
                fileName = fileName.replace(/\.heic$/i, '.jpg');
            } catch (convError) {
                console.error('HEIC conversion failed:', convError);
                // Continue with original file if conversion fails, or throw
                throw new Error('Failed to convert HEIC image');
            }
        }

        const bucket = adminStorage.bucket();
        const fileUpload = bucket.file(`puzzles/${Date.now()}-${fileName}`);

        await fileUpload.save(buffer, {
            metadata: { contentType: mimeType }
        });

        await fileUpload.makePublic();
        const publicUrl = fileUpload.publicUrl();

        return NextResponse.json({ imageUrl: publicUrl });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
