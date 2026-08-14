export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email: unknown): boolean =>
    EMAIL_REGEX.test(String(email ?? '').trim())