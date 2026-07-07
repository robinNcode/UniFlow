import { z } from 'zod'
import { normalizeBdPhoneNumber } from '@/utils/phoneValidation'

export const loginSchema = z.object({
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .refine(
            (val) => normalizeBdPhoneNumber(val) !== null,
            'Enter a valid Bangladeshi mobile number (01XXXXXXXXX or +8801XXXXXXXXX)',
        ),
    password: z.string().min(1, 'Password is required'),
})

export const adminLoginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .refine(
            (val) => normalizeBdPhoneNumber(val) !== null,
            'Enter a valid Bangladeshi mobile number (01XXXXXXXXX or +8801XXXXXXXXX)',
        ),
    email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        });
    }
});

export type LoginFormData = z.infer<typeof loginSchema>
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

