import { z } from 'zod/v4';

export const paymentSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  reservationId: z.string().min(1, 'Reservation ID is required'),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
