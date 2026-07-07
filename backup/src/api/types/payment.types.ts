import type { PaymentStatus } from './common.types';

export interface PaymentInitiateRequest {
  applicationId: string;
  reservationId: string;
}

export interface PaymentInitiateResponse {
  paymentId: string;
  amount: number;
  currency: string;
  redirectUrl?: string;
  // TODO: confirm with backend — does the response include MFS provider details?
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string;
  transactionId?: string;
}
