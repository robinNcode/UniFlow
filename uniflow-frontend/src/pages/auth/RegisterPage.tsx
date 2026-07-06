import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/validators/auth.schema';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { GraduationCap, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

const TRUST_ITEMS = [
  { Icon: Shield, title: 'Bank-grade Security', desc: 'Your personal data is fully encrypted' },
  { Icon: Zap, title: 'Real-time Updates', desc: 'Live merit rankings & instant alerts' },
  { Icon: BarChart3, title: 'Fair & Transparent', desc: 'Quota-based allocation with full visibility' },
];

export default function RegisterPage() {
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({ fullName: data.fullName, phone: data.phone, password: data.password });
  };

  return (
    <div className="min-h-dvh flex">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="auth-panel-left w-[46%] bg-gradient-to-br from-[#0F4C5C] via-[#0c3d4a] to-[#06282f] flex-col justify-between p-12 xl:p-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">UniFlow</span>
        </div>

        {/* Centre content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Start Your<br />Admission<br />Journey
            </h1>
            <p className="text-white/65 text-lg leading-relaxed max-w-xs">
              Join thousands of students who trust UniFlow for their university admission process.
            </p>
          </div>

          <div className="space-y-5">
            {TRUST_ITEMS.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#D97706]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/55 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs">© 2026 UniFlow — All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">UniFlow</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
            <p className="text-text-secondary mt-1.5 text-sm">
              Fill in the details below to get started
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                label="Full Name"
                placeholder="Your full name as per NID"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register('fullName')}
                required
              />
              <Input
                label="Phone Number"
                placeholder="01XXXXXXXXX"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  placeholder="Min. 8 characters"
                  type="password"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register('password')}
                  required
                />
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  required
                />
              </div>

              {registerMutation.isError && (
                <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">
                  {registerMutation.error.message}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={registerMutation.isPending}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mt-2"
              >
                Create Account
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
