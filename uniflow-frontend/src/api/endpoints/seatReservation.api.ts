import axios from 'axios'
import { axiosInstance } from '@/api/axiosInstance'
import type { SeatReservation } from '@/api/types/application.types'
import type { ApiError } from '@/api/types/common.types'

export interface QuotaExhaustedError {
    type: 'QUOTA_EXHAUSTED'
    message: string
    // TODO: confirm with backend — may expose alternate quota eligibility
    alternateQuotas?: string[]
}

export type ReserveSeatResult =
    | { success: true; data: SeatReservation }
    | { success: false; quotaExhausted: true; details: QuotaExhaustedError }
    | { success: false; quotaExhausted: false; error: string }

export const seatReservationApi = {
    /**
     * Reserves a seat for an application. Returns a discriminated union to force
     * the caller to handle QUOTA_EXHAUSTED as a first-class UI state per spec §5.2.
     */
    reserveSeat: async (applicationId: string): Promise<ReserveSeatResult> => {
        try {
            const response = await axiosInstance.post<SeatReservation>(
                `/applications/${applicationId}/reserve-seat`,
            )
            return { success: true, data: response.data }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                const data = error.response.data as ApiError & { alternateQuotas?: string[] }
                return {
                    success: false,
                    quotaExhausted: true,
                    details: {
                        type: 'QUOTA_EXHAUSTED',
                        message: data.message ?? 'No seats remaining in this quota.',
                        alternateQuotas: data.alternateQuotas,
                    },
                }
            }
            return {
                success: false,
                quotaExhausted: false,
                error: error instanceof Error ? error.message : 'Failed to reserve seat.',
            }
        }
    },

    getReservationStatus: async (applicationId: string): Promise<SeatReservation | null> => {
        try {
            const response = await axiosInstance.get<SeatReservation>(
                `/applications/${applicationId}/reservation`,
            )
            return response.data
        } catch {
            return null
        }
    },
}
