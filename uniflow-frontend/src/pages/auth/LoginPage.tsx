import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/validators/auth.schema';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ phone: data.phone, password: data.password });
  };

  return (
    <div className="min-h-dvh flex bg-background">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-hover to-[#073040] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            University Admission<br />Management Platform
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Apply for admission, track your merit ranking, and manage your entire admission journey — all in one place.
          </p>

          {/* Features list */}
          <div className="mt-10 space-y-4">
            {[
              'Live merit list tracking',
              'Instant seat reservation',
              'Secure online payment',
              'Digital admit card',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm text-white/80">{feature}</span>
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
              {t('auth.login.title')}
            </h2>
            <p className="text-text-secondary">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('auth.login.phone')}
              placeholder={t('auth.login.phonePlaceholder')}
              type="tel"
              error={errors.phone?.message}
              {...register('phone')}
              required
            />

            <Input
              label={t('auth.login.password')}
              placeholder={t('auth.login.passwordPlaceholder')}
              type="password"
              error={errors.password?.message}
              {...register('password')}
              required
            />

            {loginMutation.isError && (
              <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20">
                <p className="text-sm text-danger">{loginMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loginMutation.isPending}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('auth.login.cta')}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            {t('auth.login.noAccount')}{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              {t('auth.login.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
