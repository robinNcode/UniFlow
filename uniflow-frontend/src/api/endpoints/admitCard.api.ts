import { axiosInstance } from '@/api/axiosInstance'

export interface AdmitCardReady {
    status: 'ready'
    pdfUrl: string
    rollNumber: string
    examDate: string
    examCenter?: string
}

export interface AdmitCardPending {
    status: 'PENDING'
    message: string
}

export type AdmitCardResponse = AdmitCardReady | AdmitCardPending

export const admitCardApi = {
    /**
     * Returns either ready (200) or pending (202) state.
     * A 202 is treated as a first-class UI state, not an error.
     */
    getAdmitCard: async (applicationId: string): Promise<AdmitCardResponse> => {
        const response = await axiosInstance.get<AdmitCardResponse>(
            `/applications/${applicationId}/admit-card`,
            { validateStatus: (s) => s === 200 || s === 202 },
        )
        if (response.status === 202) {
            return { status: 'PENDING', message: (response.data as AdmitCardPending).message }
        }
        return { ...(response.data as AdmitCardReady), status: 'ready' }
    },
}
