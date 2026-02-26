const firebaseErrorMessages: Record<string, string> = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
};

export function getAuthErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const code = (error as { code?: string }).code ?? '';
        return firebaseErrorMessages[code] ?? 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
}
