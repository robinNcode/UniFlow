import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children?: ReactNode;
    requireRole?: 'student' | 'admin';
}

/**
 * ProtectedRoute — redirects unauthenticated users to /login
 * with the current path preserved as a returnTo query param
 * so they're sent back after successful authentication.
 * If requireRole is provided, ensures the user has that role.
 */
export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
                replace
            />
        );
    }

    if (requireRole && user?.role !== requireRole) {
        // If authenticated but wrong role, send them to their respective dashboard
        return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
