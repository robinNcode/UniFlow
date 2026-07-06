import type { QuotaType, ApplicationStatus } from '@/api/types/common.types'

export const QUOTA_LABELS: Record<QuotaType, string> = {
    general: 'General',
    freedom_fighter: 'Freedom Fighter',
    tribal: 'Tribal',
    district_quota: 'District Quota',
    physically_challenged: 'Physically Challenged',
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    pending: 'Pending',
    seat_reserved: 'Seat Reserved',
    payment_pending: 'Payment Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    expired: 'Expired',
    withdrawn: 'Withdrawn',
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    pending: 'bg-slate-100 text-slate-500',
    seat_reserved: 'bg-accent-light text-accent',
    payment_pending: 'bg-accent-light text-accent',
    confirmed: 'bg-success-light text-success',
    rejected: 'bg-danger-light text-danger',
    expired: 'bg-danger-light text-danger',
    withdrawn: 'bg-slate-100 text-slate-500',
}

export const BD_BOARDS = [
    'Dhaka Board',
    'Chittagong Board',
    'Rajshahi Board',
    'Jessore Board',
    'Comilla Board',
    'Sylhet Board',
    'Barisal Board',
    'Dinajpur Board',
    'Madrasha Board',
    'Technical Board',
]

export const PAYMENT_PROVIDERS = [
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
] as const
