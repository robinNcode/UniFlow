import { Outlet, Link, Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

export default function PublicLayout() {
  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Uni<span className="text-primary">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold hidden sm:inline-flex">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
