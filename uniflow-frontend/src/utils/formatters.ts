import { format, formatDistance } from 'date-fns'

/**
 * Formats an ISO date string for display (e.g. "August 1, 2026")
 */
export function formatDate(isoString: string): string {
    try {
        return format(new Date(isoString), 'MMMM d, yyyy')
    } catch {
        return isoString
    }
}

/**
 * Formats an ISO date string with time (e.g. "July 6, 2026 — 10:15 AM")
 */
export function formatDateTime(isoString: string): string {
    try {
        return format(new Date(isoString), "MMMM d, yyyy — h:mm a")
    } catch {
        return isoString
    }
}

/**
 * Formats a BDT amount as a Bangladeshi Taka string (e.g. "৳ 2,450.00")
 */
export function formatCurrency(amount: number): string {
    return `৳ ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`
}

/**
 * Returns a relative time string (e.g. "2 minutes ago")
 */
export function formatRelativeTime(isoString: string): string {
    try {
        return formatDistance(new Date(isoString), new Date(), { addSuffix: true })
    } catch {
        return isoString
    }
}

/**
 * Formats an E.164 phone number for display (e.g. "+8801712345678" → "017 1234 5678")
 */
export function formatPhoneDisplay(e164: string): string {
    const local = e164.replace(/^\+?880/, '')
    if (local.length === 11) {
        return `${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`
    }
    return e164
}

/**
 * Pads minutes/seconds to 2 digits for countdown display
 */
export function formatCountdown(totalSeconds: number): string {
    const m = Math.floor(Math.max(0, totalSeconds) / 60).toString().padStart(2, '0')
    const s = (Math.max(0, totalSeconds) % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}
