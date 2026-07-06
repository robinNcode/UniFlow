import { z } from 'zod'

// --- Step schemas (split via .pick() for multi-step form) ---

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    fatherName: z.string().min(2, "Father's name is required"),
    motherName: z.string().min(2, "Mother's name is required"),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nidOrBirthReg: z.string().min(6, 'NID or Birth Registration is required'),
})

/**
 * Validation schema for the academic history step of the application form.
 * Merit score fields are read-only/pre-filled from board results where
 * available, but validated defensively in case of manual entry fallback.
 */
export const academicHistorySchema = z.object({
    sscGpa: z.number().min(0).max(5.0),
    hscGpa: z.number().min(0).max(5.0),
    boardName: z.string().min(2, 'Board name is required'),
    passingYear: z
        .number()
        .int()
        .min(2015)
        .max(new Date().getFullYear()),
})

export const quotaSelectionSchema = z
    .object({
        quotaType: z.enum([
            'general',
            'freedom_fighter',
            'tribal',
            'district_quota',
            'physically_challenged',
        ]),
        supportingDocumentUrl: z.string().url('Must be a valid URL').optional(),
    })
    .refine(
        (data) => data.quotaType === 'general' || !!data.supportingDocumentUrl,
        {
            message: 'Supporting document is required for non-general quotas',
            path: ['supportingDocumentUrl'],
        },
    )

export const applicationFormSchema = personalInfoSchema
    .merge(academicHistorySchema)
    .merge(quotaSelectionSchema.innerType())
    .extend({
        cycleId: z.string().min(1, 'Cycle ID is required'),
    })

export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type AcademicHistoryData = z.infer<typeof academicHistorySchema>
export type QuotaSelectionData = z.infer<typeof quotaSelectionSchema>
export type ApplicationFormData = z.infer<typeof applicationFormSchema>
