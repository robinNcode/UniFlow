import { Outlet, Link, Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';

/**
 * PublicLayout — wraps public-facing pages (landing, etc.)
 * with a minimal header that shows Login/Sign Up CTAs.
 * If user is already authenticated, redirect to their dashboard.
 */
export function PublicLayout() {
    const { token, user } = useAuthStore();

    if (token && user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return (
        <div className="min-h-dvh flex flex-col bg-slate-50">
            <header className="sticky top-0 z-50 bg-surface border-b border-slate-200 shadow-sm">
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

            <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} UniFlow — University Admission Management Platform
            </footer>
        </div>
    );
}

export default PublicLayout;
