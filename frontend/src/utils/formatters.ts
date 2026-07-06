import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string for display.
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

/**
 * Format a date-time string for display.
 */
export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
}

/**
 * Relative time display, e.g. "2 minutes ago".
 */
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Format currency amount in BDT.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format phone number for display (inserts spaces).
 */
export function formatPhoneDisplay(phone: string): string {
  // +8801712345678 → +880 1712 345678
  if (phone.startsWith('+880')) {
    const local = phone.slice(4);
    return `+880 ${local.slice(0, 4)} ${local.slice(4)}`;
  }
  return phone;
}

/**
 * Pad a number to 2 digits (for countdown display).
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
