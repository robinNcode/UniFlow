// Common shared types used across multiple API modules.
// Match the SQL schema in uniflow_v1.sql and .NET backend domain model.

export type QuotaType =
    | 'general'
    | 'freedom_fighter'
    | 'tribal'
    | 'district_quota'
    | 'physically_challenged'

export type ApplicationStatus =
    | 'pending'
    | 'seat_reserved'
    | 'payment_pending'
    | 'confirmed'
    | 'rejected'
    | 'expired'
    | 'withdrawn'

export type PaymentProvider = 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'ssl_card'
export type PaymentStatus = 'initiated' | 'pending' | 'verified' | 'failed' | 'refunded'
export type NotificationChannel = 'sms' | 'email' | 'push'
export type NotificationStatus = 'pending' | 'sent' | 'failed'

/** API error shape returned by the backend */
export interface ApiError {
    error: string
    message: string
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
    items: T[]
    totalCount: number
    page: number
    pageSize: number
}

/** Authenticated user profile */
export interface UserProfile {
    id: string
    fullName: string
    phone: string
    role: 'student' | 'admin'
}

/** Auth API response */
export interface AuthResponse {
    token: string
    user: UserProfile
}

/** Login request payload */
export interface LoginRequest {
    phone: string
    password: string
}

/** Register request payload */
export interface RegisterRequest {
    fullName: string
    phone: string
    password: string
}
