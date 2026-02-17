import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    let credential;

    // 1. Try parsing the service account JSON from environment variable (Best Practice for Netlify/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(serviceAccount);
        } catch (error) {
            console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON:', error);
        }
    }

    // 2. Fallback to individual environment variables
    if (!credential && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    }

    if (credential) {
        admin.initializeApp({
            credential,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
    } else {
        // Warn but don't crash immediately - this allows build to proceed if it doesn't actually use the DB
        console.warn('Firebase Admin not initialized. Missing credentials (FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY).');
    }
}

// Helper to access services safely
function getAdminService<T>(serviceGetter: () => T): T {
    if (!admin.apps.length) {
        // If we're in a build or environment without creds, attempting to use the service should throw or handle gracefully
        // But for top-level constants, we might want to delay throwing until usage
        // However, existing code expects 'adminDb' to be the service instance
        // We'll throw detailed error if accessed without init
        throw new Error('Firebase Admin not initialized. Check environment variables.');
    }
    return serviceGetter();
}

// We use getters or just export the instances. 
// If we export the result of admin.firestore() immediately and init failed, it crashes HERE.
// But if we wrap it, existing code importing 'adminDb' might need changes if it expects a direct value.
// NOTE: admin.firestore() itself generally requires an app to be initialized.
// To avoid top-level crash when imports happen during build:
export const adminDb = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;
export const adminStorage = admin.apps.length ? admin.storage() : null as unknown as admin.storage.Storage;

