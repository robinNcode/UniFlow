import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
    const { token, student } = useAuthStore()
    const isAuthenticated = Boolean(token && student)

    if (!isAuthenticated) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
        return <Navigate to={`/login?returnTo=${returnTo}`} replace />
    }

    return <Outlet />
}
