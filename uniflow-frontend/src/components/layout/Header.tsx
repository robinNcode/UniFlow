import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Trophy,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';

const STUDENT_NAV_ITEMS = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'programs', path: '/programs', icon: GraduationCap, label: 'Programs' },
  { key: 'applications', path: '/applications', icon: FileText, label: 'Applications' },
  { key: 'meritList', path: '/merit-list', icon: Trophy, label: 'Merit List' },
  { key: 'admitCard', path: '/admit-card', icon: CreditCard, label: 'Admit Card' },
];

const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', path: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { key: 'applications', path: '/admin/applications', icon: FileText, label: 'Applications' },
  { key: 'quotas', path: '/admin/quotas', icon: GraduationCap, label: 'Seat Quotas' },
  { key: 'payments', path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { key: 'meritList', path: '/admin/merit-list', icon: Trophy, label: 'Merit List' },
  { key: 'notifications', path: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

export function Header() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.fullName
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U';

  const navItems = user?.role === 'admin' ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Uni<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(({ key, path, icon: Icon, label }) => {
              const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <Link
                  key={key}
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
            </Link>

            {/* User avatar + name */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200 ml-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{initials}</span>
              </div>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-900 max-w-[120px] truncate">
                  {user?.fullName ?? 'User'}
                </p>
                {user?.role === 'admin' && (
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Admin</p>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Sign out"
              className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-slate-500 hover:bg-red-50 hover:text-danger transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-surface shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {/* User */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {navItems.map(({ key, path, icon: Icon, label }) => {
              const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <Link
                  key={key}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
