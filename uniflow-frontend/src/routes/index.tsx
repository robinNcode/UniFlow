import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

// ─── Skeleton loader ────────────────────────────────────────────────────────
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[40vh]">
        <div className="space-y-4 w-full max-w-2xl px-4">
            <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-2/3" />
            <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-100 rounded animate-pulse w-4/5" />
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    </div>
);

const wrap = (C: React.LazyExoticComponent<() => React.ReactElement>) => (
    <Suspense fallback={<PageLoader />}>
        <C />
    </Suspense>
);

// ─── Lazy page imports ───────────────────────────────────────────────────────
// Landing / Public
const LandingPage       = lazy(() => import('@/pages/landing/LandingPage'));
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('@/pages/auth/RegisterPage'));

// Student pages
const StudentDashboard  = lazy(() => import('@/pages/dashboard/StudentDashboardPage'));
const SeatReservation   = lazy(() => import('@/pages/application/SeatReservationPage'));
const PaymentInitiate   = lazy(() => import('@/pages/payment/PaymentInitiatePage'));
const LiveMeritList     = lazy(() => import('@/pages/merit-list/LiveMeritListPage'));
const AdmitCard         = lazy(() => import('@/pages/admit-card/AdmitCardPage'));

// Admin pages
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminApplications = lazy(() => import('@/pages/admin/AdminApplicationsPage'));
const AdminSeatQuotas   = lazy(() => import('@/pages/admin/AdminSeatQuotasPage'));
const AdminPayments     = lazy(() => import('@/pages/admin/AdminPaymentsPage'));
const AdminMeritList    = lazy(() => import('@/pages/admin/AdminMeritListPage'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotificationsPage'));

// ─── Index redirect based on role ────────────────────────────────────────────
function IndexRedirect() {
    const { token, user } = useAuthStore();
    if (!token) return <Navigate to="/" replace />;
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

// ─── Router ──────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
    // ── Layer 1: Landing / Guest ──────────────────────────────────────────
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: wrap(LandingPage) },
        ],
    },

    // ── Auth routes (no layout) ───────────────────────────────────────────
    {
        path: '/login',
        element: wrap(LoginPage),
    },
    {
        path: '/register',
        element: wrap(RegisterPage),
    },

    // ── Redirect root for authenticated users ─────────────────────────────
    {
        path: '/home',
        element: <IndexRedirect />,
    },

    // ── Layer 2 & 3: Protected app shell ─────────────────────────────────
    {
        element: <AppShell />,
        children: [
            // ── Layer 2: Student Panel ────────────────────────────────────
            {
                element: (
                    <ProtectedRoute requireRole="student">
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    { path: '/dashboard',       element: wrap(StudentDashboard) },
                    { path: '/programs',        element: <div className="text-center mt-20 text-slate-500">Programs listing coming soon…</div> },
                    { path: '/programs/:id',    element: <div className="text-center mt-20 text-slate-500">Program detail coming soon…</div> },
                    { path: '/applications',    element: <div className="text-center mt-20 text-slate-500">Applications list coming soon…</div> },
                    { path: '/applications/:id', element: <div className="text-center mt-20 text-slate-500">Application detail coming soon…</div> },
                    { path: '/reservation',     element: wrap(SeatReservation) },
                    { path: '/payment',         element: wrap(PaymentInitiate) },
                    { path: '/merit-list',      element: wrap(LiveMeritList) },
                    { path: '/admit-card',      element: wrap(AdmitCard) },
                    { path: '/notifications',   element: <div className="text-center mt-20 text-slate-500">Notifications coming soon…</div> },
                ],
            },

            // ── Layer 3: Admin Panel ──────────────────────────────────────
            {
                path: '/admin',
                element: (
                    <ProtectedRoute requireRole="admin">
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true,                      element: wrap(AdminDashboard) },
                    { path: 'applications',             element: wrap(AdminApplications) },
                    { path: 'quotas',                   element: wrap(AdminSeatQuotas) },
                    { path: 'payments',                 element: wrap(AdminPayments) },
                    { path: 'merit-list',               element: wrap(AdminMeritList) },
                    { path: 'notifications',            element: wrap(AdminNotifications) },
                ],
            },
        ],
    },

    // ── 404 ───────────────────────────────────────────────────────────────
    {
        path: '*',
        element: (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-canvas">
                <div className="text-center space-y-3">
                    <p className="text-6xl font-black text-slate-200">404</p>
                    <h1 className="text-2xl font-bold text-slate-800">Page not found</h1>
                    <p className="text-slate-500 text-sm">The page you're looking for doesn't exist.</p>
                    <a href="/" className="inline-block mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition">
                        Go back home
                    </a>
                </div>
            </div>
        ),
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
