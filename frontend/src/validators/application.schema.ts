import { z } from 'zod/v4';

/**
 * Personal information step schema.
 */
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.email('Please enter a valid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  address: z.string().min(5, 'Address is required'),
});

/**
 * Validation schema for the academic history step of the application form.
 * Merit score fields are read-only/pre-filled from board results where
 * available, but validated defensively in case of manual entry fallback.
 */
export const academicHistorySchema = z.object({
  sscGpa: z.number().min(0).max(5.0),
  hscGpa: z.number().min(0).max(5.0),
  boardName: z.string().min(2, 'Board name is required'),
  passingYear: z.number().int().min(2015).max(new Date().getFullYear()),
});

/**
 * Quota selection schema with conditional document requirement.
 */
export const quotaSelectionSchema = z.object({
  quotaType: z.enum([
    'general',
    'freedom_fighter',
    'tribal',
    'district_quota',
    'physically_challenged',
  ]),
  supportingDocumentUrl: z.url().optional(),
}).refine(
  (data) => data.quotaType === 'general' || !!data.supportingDocumentUrl,
  { message: 'Supporting document is required for non-general quotas', path: ['supportingDocumentUrl'] }
);

/**
 * Combined application schema — all steps merged.
 * Individual steps use .pick() from the relevant sub-schemas.
 */
export const applicationSchema = personalInfoSchema
  .merge(academicHistorySchema)
  .merge(z.object({
    quotaType: z.enum([
      'general',
      'freedom_fighter',
      'tribal',
      'district_quota',
      'physically_challenged',
    ]),
    supportingDocumentUrl: z.url().optional(),
    programId: z.string().min(1, 'Please select a program'),
  }))
  .refine(
    (data) => data.quotaType === 'general' || !!data.supportingDocumentUrl,
    { message: 'Supporting document is required for non-general quotas', path: ['supportingDocumentUrl'] }
  );

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AcademicHistoryFormData = z.infer<typeof academicHistorySchema>;
export type QuotaSelectionFormData = z.infer<typeof quotaSelectionSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
