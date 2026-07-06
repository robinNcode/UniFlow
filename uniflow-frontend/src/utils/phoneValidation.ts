/**
 * Normalizes a Bangladeshi phone number into E.164 format (+8801XXXXXXXXX).
 * Accepts common input variants: 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX,
 * and inputs with spaces or dashes.
 *
 * @param rawInput Raw user-entered phone number string.
 * @returns Normalized E.164 string, or null if the input cannot be parsed
 *          as a valid BD mobile number.
 */
export function normalizeBdPhoneNumber(rawInput: string): string | null {
    const digitsOnly = rawInput.replace(/[\s-]/g, '')

    const patterns = [
        /^(\+?880)?1[3-9]\d{8}$/, // covers 01XXXXXXXXX and 880/+880 prefixed
    ]

    const matches = patterns.some((pattern) => pattern.test(digitsOnly))
    if (!matches) return null

    const localDigits = digitsOnly.replace(/^(\+?880)?/, '')
    return `+880${localDigits}`
}
