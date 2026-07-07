import axiosInstance from '../axiosInstance';
import type { PaymentInitiateRequest, PaymentInitiateResponse, PaymentStatusResponse } from '../types/payment.types';

export const paymentApi = {
  initiatePayment: async (data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    const response = await axiosInstance.post<PaymentInitiateResponse>('/payments/initiate', data);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get<PaymentStatusResponse>(`/payments/${paymentId}/status`);
    return response.data;
  },
};
