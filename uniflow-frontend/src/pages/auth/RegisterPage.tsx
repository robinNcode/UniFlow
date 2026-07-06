import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/validators/auth.schema';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { GraduationCap, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      fullName: data.fullName,
      phone: data.phone,
      password: data.password,
    });
  };

  return (
    <div className="min-h-dvh flex bg-background">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-hover to-[#073040] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start Your<br />Admission Journey
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Join thousands of students who trust UniFlow for their university admission process.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6">
            {[
              { icon: Shield, title: 'Secure Process', desc: 'Your data is encrypted and protected' },
              { icon: Zap, title: 'Real-time Updates', desc: 'Live merit list and instant notifications' },
              { icon: BarChart3, title: 'Fair & Transparent', desc: 'Quota-based allocation with full visibility' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">{t('common.appName')}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t('auth.register.title')}
            </h2>
            <p className="text-text-secondary">
              {t('auth.register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('auth.register.fullName')}
              placeholder={t('auth.register.fullNamePlaceholder')}
              error={errors.fullName?.message}
              {...register('fullName')}
              required
            />

            <Input
              label={t('auth.register.phone')}
              placeholder={t('auth.register.phonePlaceholder')}
              type="tel"
              error={errors.phone?.message}
              {...register('phone')}
              required
            />

            <Input
              label={t('auth.register.password')}
              placeholder={t('auth.register.passwordPlaceholder')}
              type="password"
              error={errors.password?.message}
              {...register('password')}
              required
            />

            <Input
              label={t('auth.register.confirmPassword')}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              required
            />

            {registerMutation.isError && (
              <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20">
                <p className="text-sm text-danger">{registerMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={registerMutation.isPending}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('auth.register.cta')}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            {t('auth.register.hasAccount')}{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              {t('auth.register.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
