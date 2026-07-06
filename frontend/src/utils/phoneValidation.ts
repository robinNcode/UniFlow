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
  const digitsOnly = rawInput.replace(/[\s-]/g, '');

  // Strip optional +880 or 880 prefix and the leading 0 if present
  const localDigits = digitsOnly.replace(/^(\+?880)?0?/, '');

  // Local part must be exactly 10 digits starting with 13-19
  if (!/^1[3-9]\d{8}$/.test(localDigits)) {
    return null;
  }

  return `+880${localDigits}`;
}
