import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/common/Button';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function SessionExpiredPage() {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-warning-light flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-10 w-10 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          {t('auth.sessionExpired.title')}
        </h1>
        <p className="text-text-secondary mb-8">
          {t('auth.sessionExpired.message')}
        </p>
        <Link to="/login" onClick={logout}>
          <Button size="lg" leftIcon={<LogIn className="h-4 w-4" />}>
            {t('auth.sessionExpired.cta')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
