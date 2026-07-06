import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Trophy,
  Bell,
} from 'lucide-react';

const mobileNavItems = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'programs', path: '/programs', icon: GraduationCap },
  { key: 'applications', path: '/applications', icon: FileText },
  { key: 'meritList', path: '/merit-list', icon: Trophy },
  { key: 'notifications', path: '/notifications', icon: Bell },
];

export default function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around py-2 px-1">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px]
                transition-all duration-200
                ${isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-secondary'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium leading-tight">
                {t(`nav.${item.key}`)}
              </span>
              {isActive && (
                <span className="absolute -top-0 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
