import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { useAuthStore } from '@/stores/authStore'

export function AppShell() {
    const { token } = useAuthStore()
    const isAuthenticated = Boolean(token)

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <Header />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10">
                <Outlet />
            </main>
            <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} uniFlow — University Admission Management Platform
            </footer>
            {isAuthenticated && <MobileNav />}
        </div>
    )
}
