export function validateString(value: unknown, fieldName: string, maxLength = 200): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`${fieldName} is required.`);
    }
    if (value.length > maxLength) {
        throw new Error(`${fieldName} must be ${maxLength} characters or fewer.`);
    }
    return value.trim();
}

export function validateEmail(value: unknown): string {
    const email = validateString(value, 'Email', 254);
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error('Invalid email address.');
    }
    return email;
}

export function validatePositiveInt(value: unknown, fieldName: string): number {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error(`${fieldName} must be a positive integer.`);
    }
    return n;
}
