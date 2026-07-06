import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden lg:block border-t border-border bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-white font-bold text-xs">UF</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {t('common.appName')}
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            © {currentYear} UniFlow — University Admission Management Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
