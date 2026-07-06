import type { ApplicationStatus, QuotaType } from './common.types'

export interface Student {
    id: string
    phone: string
    email?: string
    fullName: string
    fatherName?: string
    motherName?: string
    dateOfBirth?: string
    nidOrBirthReg?: string
    createdAt: string
    updatedAt: string
}

export interface Program {
    id: string
    universityId: string
    universityName: string
    name: string
    code: string
    durationYears: number
    isActive: boolean
}

export interface AdmissionCycle {
    id: string
    programId: string
    title: string
    opensAt: string
    closesAt: string
    meritResultAt?: string
    isActive: boolean
}

export interface SeatQuota {
    id: string
    cycleId: string
    quotaType: QuotaType
    totalSeats: number
    filledSeats: number
}

export interface Application {
    id: string
    studentId: string
    cycleId: string
    quotaId: string
    quotaType: QuotaType
    meritScore: number
    status: ApplicationStatus
    appliedAt: string
    confirmedAt?: string
    program?: Program
    cycle?: AdmissionCycle
}

export interface SeatReservation {
    reservationId: string
    quotaType: QuotaType
    expiresAt: string
    paymentDeadlineMinutes: number
}

export interface NotificationLog {
    id: string
    applicationId?: string
    studentId: string
    channel: 'sms' | 'email' | 'push'
    templateKey: string
    status: 'pending' | 'sent' | 'failed'
    sentAt?: string
    createdAt: string
}
