import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, FileText, Trophy, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const STUDENT_MOBILE_NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/programs', icon: GraduationCap, label: 'Programs' },
  { path: '/applications', icon: FileText, label: 'Apply' },
  { path: '/merit-list', icon: Trophy, label: 'Rankings' },
  { path: '/notifications', icon: Bell, label: 'Alerts' },
];

const ADMIN_MOBILE_NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { path: '/admin/applications', icon: FileText, label: 'Apps' },
  { path: '/admin/quotas', icon: GraduationCap, label: 'Quotas' },
  { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { path: '/admin/merit-list', icon: Trophy, label: 'Merit' },
];

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = user?.role === 'admin' ? ADMIN_MOBILE_NAV : STUDENT_MOBILE_NAV;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg">
      <div className="flex items-stretch h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
