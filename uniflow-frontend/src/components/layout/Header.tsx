import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Trophy,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'programs', path: '/programs', icon: GraduationCap },
  { key: 'applications', path: '/applications', icon: FileText },
  { key: 'meritList', path: '/merit-list', icon: Trophy },
  { key: 'admitCard', path: '/admit-card', icon: CreditCard },
  { key: 'notifications', path: '/notifications', icon: Bell },
];

export default function Header() {
  const { t } = useTranslation();
  const { logout, student } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">UF</span>
            </div>
            <span className="text-lg font-bold text-text-primary hidden sm:block">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Info - desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary leading-tight">
                  {student?.fullName}
                </p>
                <p className="text-xs text-text-secondary">
                  Student
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {student?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout - desktop */}
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger-light transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-text-secondary hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-base font-semibold text-primary">
                  {student?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{student?.fullName}</p>
                <p className="text-xs text-text-secondary">{student?.phone}</p>
              </div>
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-50'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5" />
                    {t(`nav.${item.key}`)}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}

            <hr className="my-2 border-border" />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-light transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
