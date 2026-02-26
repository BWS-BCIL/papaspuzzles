import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    let credential;

    // 1. Try parsing the service account JSON from environment variable (Best Practice for Vercel)
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
        console.warn('Firebase Admin not initialized. Missing credentials (FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY).');
    }
}

function requireAdminDb(): admin.firestore.Firestore {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin is not initialized. Ensure FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY environment variables are set in Vercel.');
    }
    return admin.firestore();
}

function requireAdminStorage(): admin.storage.Storage {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin is not initialized. Ensure FIREBASE_SERVICE_ACCOUNT or FIREBASE_STORAGE_BUCKET environment variables are set in Vercel.');
    }
    return admin.storage();
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
    get(_target, prop) {
        return Reflect.get(requireAdminDb(), prop);
    }
});

export const adminStorage = new Proxy({} as admin.storage.Storage, {
    get(_target, prop) {
        return Reflect.get(requireAdminStorage(), prop);
    }
});

