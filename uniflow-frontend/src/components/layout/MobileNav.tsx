import { NavLink } from 'react-router-dom'
import { Home, Calendar, CreditCard, BarChart2, FileText } from 'lucide-react'

const navItems = [
    { to: '/dashboard', label: 'Home', Icon: Home },
    { to: '/reservation', label: 'Reserve', Icon: Calendar },
    { to: '/payment', label: 'Payment', Icon: CreditCard },
    { to: '/merit-list', label: 'Merit', Icon: BarChart2 },
    { to: '/admit-card', label: 'Card', Icon: FileText },
]

export function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-slate-200 flex justify-around py-1.5 z-30">
            {navItems.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition ${isActive ? 'text-primary' : 'text-slate-400'
                        }`
                    }
                >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{label}</span>
                </NavLink>
            ))}
        </nav>
    )
}
