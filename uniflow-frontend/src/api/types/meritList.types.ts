import type { ApplicationStatus } from './common.types'

export interface MeritListEntry {
    rank: number
    studentId: string
    studentName: string
    meritScore: number
    status: ApplicationStatus
    /** True when this row belongs to the currently authenticated student */
    isCurrentStudent?: boolean
}

export interface MeritListResponse {
    quota: string
    totalCandidates: number
    results: MeritListEntry[]
}
