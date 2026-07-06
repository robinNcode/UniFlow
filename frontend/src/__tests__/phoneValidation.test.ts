import { describe, it, expect } from 'vitest';
import { normalizeBdPhoneNumber } from '../utils/phoneValidation';

describe('normalizeBdPhoneNumber', () => {
  it('normalizes 01XXXXXXXXX format', () => {
    expect(normalizeBdPhoneNumber('01712345678')).toBe('+8801712345678');
  });

  it('normalizes 8801XXXXXXXXX format', () => {
    expect(normalizeBdPhoneNumber('8801712345678')).toBe('+8801712345678');
  });

  it('normalizes +8801XXXXXXXXX format', () => {
    expect(normalizeBdPhoneNumber('+8801712345678')).toBe('+8801712345678');
  });

  it('handles inputs with spaces', () => {
    expect(normalizeBdPhoneNumber('017 1234 5678')).toBe('+8801712345678');
  });

  it('handles inputs with dashes', () => {
    expect(normalizeBdPhoneNumber('017-1234-5678')).toBe('+8801712345678');
  });

  it('handles +880 prefix with spaces', () => {
    expect(normalizeBdPhoneNumber('+880 1712345678')).toBe('+8801712345678');
  });

  it('returns null for invalid short number', () => {
    expect(normalizeBdPhoneNumber('0171234')).toBeNull();
  });

  it('returns null for invalid prefix', () => {
    expect(normalizeBdPhoneNumber('02012345678')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizeBdPhoneNumber('')).toBeNull();
  });

  it('returns null for non-BD international number', () => {
    expect(normalizeBdPhoneNumber('+11234567890')).toBeNull();
  });

  it('works with all valid BD operator prefixes (13-19)', () => {
    expect(normalizeBdPhoneNumber('01312345678')).toBe('+8801312345678');
    expect(normalizeBdPhoneNumber('01412345678')).toBe('+8801412345678');
    expect(normalizeBdPhoneNumber('01512345678')).toBe('+8801512345678');
    expect(normalizeBdPhoneNumber('01612345678')).toBe('+8801612345678');
    expect(normalizeBdPhoneNumber('01712345678')).toBe('+8801712345678');
    expect(normalizeBdPhoneNumber('01812345678')).toBe('+8801812345678');
    expect(normalizeBdPhoneNumber('01912345678')).toBe('+8801912345678');
  });
});
