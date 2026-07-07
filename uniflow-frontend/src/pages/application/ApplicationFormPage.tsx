import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { applicationApi } from '@/api/endpoints/application.api';
import {
  applicationSchema,
  type ApplicationFormData,
} from '@/validators/application.schema';
import { BOARD_NAMES, QUOTA_LABELS } from '@/utils/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { CheckCircle, User, BookOpen, Shield, Eye, ChevronRight, ChevronLeft } from 'lucide-react';

const SESSION_STORAGE_KEY = 'uniflow-application-draft';

const STEPS = [
  { key: 'personal', label: 'Personal Info', icon: User },
  { key: 'academic', label: 'Academic History', icon: BookOpen },
  { key: 'quota', label: 'Quota', icon: Shield },
  { key: 'review', label: 'Review', icon: Eye },
];

type QuotaType = 'general' | 'freedom_fighter' | 'tribal' | 'district_quota' | 'physically_challenged';

export default function ApplicationFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId') ?? '';
  const [currentStep, setCurrentStep] = useState(0);

  // Load draft from sessionStorage (per Section 6.1 — PII, not localStorage)
  const savedDraft = sessionStorage.getItem(SESSION_STORAGE_KEY);
  const defaultValues: Partial<ApplicationFormData> = {
    programId,
    quotaType: 'general' as QuotaType,
    ...(savedDraft ? JSON.parse(savedDraft) : {}),
  };

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultValues as ApplicationFormData,
    mode: 'onBlur',
  });

  const formValues = watch();

  // Persist to sessionStorage on change
  useEffect(() => {
    const draft = getValues();
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(draft));
  }, [formValues, getValues]);

  const submitMutation = useMutation({
    mutationFn: (data: ApplicationFormData) =>
      applicationApi.submitApplication(data as unknown as import('@/api/types/application.types').ApplicationFormData),
    onSuccess: (application) => {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      toast.success('Application submitted successfully!');
      navigate(`/applications/${application.id}`);
    },
  });

  const stepFields: Record<number, (keyof ApplicationFormData)[]> = {
    0: ['fullName', 'phone', 'email', 'dateOfBirth', 'fatherName', 'motherName', 'address'],
    1: ['sscGpa', 'hscGpa', 'boardName', 'passingYear'],
    2: ['quotaType'],
    3: [],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const onFinalSubmit = handleSubmit((data) => {
    submitMutation.mutate(data);
  });

  const quotaType = watch('quotaType');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('application.title')}</h1>
        <p className="text-text-secondary mt-1">Complete all steps to submit your application</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-success border-success text-white'
                      : isActive
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-border text-text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium hidden sm:block ${
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                    index < currentStep ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Steps */}
      <Card>
        <form>
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t('application.steps.personal')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label={t('application.personal.fullName')}
                  error={errors.fullName?.message}
                  required
                  {...register('fullName')}
                />
                <Input
                  label={t('application.personal.phone')}
                  type="tel"
                  error={errors.phone?.message}
                  required
                  {...register('phone')}
                />
                <Input
                  label={t('application.personal.email')}
                  type="email"
                  error={errors.email?.message}
                  required
                  {...register('email')}
                />
                <Input
                  label={t('application.personal.dateOfBirth')}
                  type="date"
                  error={errors.dateOfBirth?.message}
                  required
                  {...register('dateOfBirth')}
                />
                <Input
                  label={t('application.personal.fatherName')}
                  error={errors.fatherName?.message}
                  required
                  {...register('fatherName')}
                />
                <Input
                  label={t('application.personal.motherName')}
                  error={errors.motherName?.message}
                  required
                  {...register('motherName')}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('application.personal.address')} <span className="text-danger">*</span>
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${errors.address ? 'border-danger' : ''}`}
                  {...register('address')}
                />
                {errors.address && (
                  <p className="text-sm text-danger mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Academic History */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t('application.steps.academic')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="sscGpa" className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('application.academic.sscGpa')} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="sscGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    placeholder="e.g. 4.50"
                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.sscGpa ? 'border-danger' : ''}`}
                    {...register('sscGpa', { valueAsNumber: true })}
                  />
                  {errors.sscGpa && <p className="text-sm text-danger mt-1">{errors.sscGpa.message}</p>}
                </div>

                <div>
                  <label htmlFor="hscGpa" className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('application.academic.hscGpa')} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="hscGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    placeholder="e.g. 4.75"
                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.hscGpa ? 'border-danger' : ''}`}
                    {...register('hscGpa', { valueAsNumber: true })}
                  />
                  {errors.hscGpa && <p className="text-sm text-danger mt-1">{errors.hscGpa.message}</p>}
                </div>

                <div>
                  <label htmlFor="boardName" className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('application.academic.boardName')} <span className="text-danger">*</span>
                  </label>
                  <select
                    id="boardName"
                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.boardName ? 'border-danger' : ''}`}
                    {...register('boardName')}
                  >
                    <option value="">Select board</option>
                    {BOARD_NAMES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.boardName && <p className="text-sm text-danger mt-1">{errors.boardName.message}</p>}
                </div>

                <div>
                  <label htmlFor="passingYear" className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('application.academic.passingYear')} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="passingYear"
                    type="number"
                    min="2015"
                    max={new Date().getFullYear()}
                    placeholder={String(new Date().getFullYear())}
                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.passingYear ? 'border-danger' : ''}`}
                    {...register('passingYear', { valueAsNumber: true })}
                  />
                  {errors.passingYear && <p className="text-sm text-danger mt-1">{errors.passingYear.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Quota Selection */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t('application.steps.quota')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(QUOTA_LABELS) as [QuotaType, string][]).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      quotaType === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      className="accent-primary"
                      {...register('quotaType')}
                    />
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                  </label>
                ))}
              </div>

              {quotaType !== 'general' && (
                <div className="mt-4">
                  <Input
                    label={t('application.quota.supportingDocument')}
                    type="url"
                    placeholder="https://..."
                    helperText={t('application.quota.documentRequired')}
                    error={errors.supportingDocumentUrl?.message}
                    {...register('supportingDocumentUrl')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t('application.steps.review')}
              </h2>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-text-secondary">
                {t('application.review.confirmMessage')}
              </div>

              {[
                { section: 'Personal Information', data: [
                  { label: 'Full Name', value: formValues.fullName },
                  { label: 'Phone', value: formValues.phone },
                  { label: 'Email', value: formValues.email },
                  { label: 'Date of Birth', value: formValues.dateOfBirth },
                  { label: "Father's Name", value: formValues.fatherName },
                  { label: "Mother's Name", value: formValues.motherName },
                  { label: 'Address', value: formValues.address },
                ]},
                { section: 'Academic History', data: [
                  { label: 'SSC GPA', value: String(formValues.sscGpa) },
                  { label: 'HSC GPA', value: String(formValues.hscGpa) },
                  { label: 'Board', value: formValues.boardName },
                  { label: 'Passing Year', value: String(formValues.passingYear) },
                ]},
                { section: 'Quota', data: [
                  { label: 'Quota Type', value: QUOTA_LABELS[formValues.quotaType] },
                ]},
              ].map(({ section, data }) => (
                <div key={section} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary">{section}</p>
                  </div>
                  <div className="divide-y divide-border-light">
                    {data.map(({ label, value }) => (
                      <div key={label} className="flex justify-between px-4 py-3">
                        <span className="text-sm text-text-secondary">{label}</span>
                        <span className="text-sm font-medium text-text-primary text-right max-w-xs truncate">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              {t('common.back')}
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                onClick={onFinalSubmit}
                isLoading={submitMutation.isPending}
                variant="primary"
                rightIcon={<CheckCircle className="h-4 w-4" />}
              >
                {t('application.review.submitCta')}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
