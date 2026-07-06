import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-primary/10 mb-6 select-none">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">{t('errors.notFound.title')}</h1>
        <p className="text-text-secondary mb-8">{t('errors.notFound.message')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button leftIcon={<Home className="h-4 w-4" />}>{t('errors.notFound.cta')}</Button>
          </Link>
          <Button variant="ghost" onClick={() => history.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
