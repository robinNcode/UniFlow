import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useAuthStore } from '@/stores/authStore';

export function AppShell() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-dvh flex flex-col bg-canvas">
            <Header />
            <main className="flex-1 w-full animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-14">
                    <Outlet />
                </div>
            </main>
            <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 hidden lg:block">
                © {new Date().getFullYear()} UniFlow — University Admission Management Platform
            </footer>
            {isAuthenticated && <MobileNav />}
        </div>
    );
}

export default AppShell;
