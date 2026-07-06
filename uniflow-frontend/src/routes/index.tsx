import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

import { LoginPage } from '@/pages/auth/LoginPage'
import { StudentDashboardPage } from '@/pages/dashboard/StudentDashboardPage'
import { SeatReservationPage } from '@/pages/application/SeatReservationPage'
import { PaymentInitiatePage } from '@/pages/payment/PaymentInitiatePage'
import { LiveMeritListPage } from '@/pages/merit-list/LiveMeritListPage'
import { AdmitCardPage } from '@/pages/admit-card/AdmitCardPage'
import { useAuthStore } from '@/stores/authStore'

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: (
                    // Redirect root to dashboard if logged in, else login
                    <IndexRedirect />
                ),
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <div className="text-center mt-20">Registration UI (Placeholder)</div>,
            },
            {
                path: '/',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'dashboard',
                        element: <StudentDashboardPage />,
                    },
                    {
                        path: 'application',
                        element: <div className="text-center mt-20">Application Form UI (Placeholder)</div>,
                    },
                    {
                        path: 'reservation',
                        element: <SeatReservationPage />,
                    },
                    {
                        path: 'payment',
                        element: <PaymentInitiatePage />,
                    },
                    {
                        path: 'merit-list',
                        element: <LiveMeritListPage />,
                    },
                    {
                        path: 'admit-card',
                        element: <AdmitCardPage />,
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <div className="text-center mt-32 space-y-4">
                        <h1 className="text-3xl font-bold text-slate-800">404</h1>
                        <p className="text-slate-500">The page you are looking for does not exist.</p>
                    </div>
                ),
            },
        ],
    },
])

function IndexRedirect() {
    const { token } = useAuthStore()
    return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export function AppRouter() {
    return <RouterProvider router={router} />
}
