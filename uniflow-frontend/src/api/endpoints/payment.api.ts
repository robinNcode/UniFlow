import { axiosInstance } from '@/api/axiosInstance'
import type { PaymentInitiateRequest, PaymentInitiateResponse, PaymentStatusResponse } from '@/api/types/payment.types'

export const paymentApi = {
    initiate: async (data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
        const response = await axiosInstance.post<PaymentInitiateResponse>('/payments/initiate', data)
        return response.data
    },

    getStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
        const response = await axiosInstance.get<PaymentStatusResponse>(`/payments/${paymentId}/status`)
        return response.data
    },
}
