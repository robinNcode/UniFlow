import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { GraduationCap, LogOut } from 'lucide-react'

export function Header() {
    const { student, token, clearAuth } = useAuthStore()
    const navigate = useNavigate()
    const isAuthenticated = Boolean(token && student)

    const initials = student?.fullName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() ?? ''

    const handleLogout = () => {
        clearAuth()
        navigate('/login', { replace: true })
    }

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-100'
        }`

    return (
        <header className="sticky top-0 z-30 bg-surface border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        uni<span className="text-primary">Flow</span>
                    </span>
                </Link>

                {/* Student nav (desktop) */}
                {isAuthenticated && (
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                        <NavLink to="/application" className={navLinkClass}>Application</NavLink>
                        <NavLink to="/reservation" className={navLinkClass}>Seat Reservation</NavLink>
                        <NavLink to="/payment" className={navLinkClass}>Payment</NavLink>
                        <NavLink to="/merit-list" className={navLinkClass}>Merit List</NavLink>
                        <NavLink to="/admit-card" className={navLinkClass}>Admit Card</NavLink>
                    </nav>
                )}

                {/* Right side */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm text-slate-500">{student?.fullName}</span>
                        <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                            {initials}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-danger transition"
                            aria-label="Log out"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-600 hover:text-primary px-3 py-2 transition"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}
