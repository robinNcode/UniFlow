import type { PaymentProvider, PaymentStatus } from './common.types'

export interface PaymentInitiateRequest {
    applicationId: string
    provider: PaymentProvider
}

export interface PaymentInitiateResponse {
    paymentId: string
    redirectUrl?: string
    provider: PaymentProvider
    amount: number
    status: PaymentStatus
}

export interface PaymentStatusResponse {
    paymentId: string
    status: PaymentStatus
    amount: number
    provider: PaymentProvider
    providerTxnId?: string
    initiatedAt: string
    verifiedAt?: string
}
