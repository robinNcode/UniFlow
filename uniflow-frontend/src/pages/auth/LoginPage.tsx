import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/validators/auth.schema';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  'Live merit list tracking with real-time updates',
  'Instant seat reservation under 15 minutes',
  'Secure bKash / Nagad online payment',
  'Downloadable digital admit card',
];

export default function LoginPage() {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ phone: data.phone, password: data.password });
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
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              University<br />Admission<br />Management
            </h1>
            <p className="text-white/65 text-lg leading-relaxed max-w-xs">
              Your complete platform for a transparent and stress-free admission journey.
            </p>
          </div>

          <ul className="space-y-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom decorative */}
        <p className="text-white/30 text-xs">© 2026 UniFlow — All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">UniFlow</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-text-secondary mt-1.5 text-sm">
              Sign in to continue your admission journey
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                label="Phone Number"
                placeholder="01XXXXXXXXX"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
                required
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
                required
              />

              {loginMutation.isError && (
                <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">
                  {loginMutation.error.message}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loginMutation.isPending}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mt-2"
              >
                Sign In
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
