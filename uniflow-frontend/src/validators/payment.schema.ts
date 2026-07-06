import { z } from 'zod'

export const paymentInitiateSchema = z.object({
    provider: z.enum(['bkash', 'nagad', 'rocket'], {
        required_error: 'Please select a payment method',
    }),
})

export type PaymentInitiateData = z.infer<typeof paymentInitiateSchema>
