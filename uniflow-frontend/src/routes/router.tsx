import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from './ProtectedRoute';
import { SkeletonCard } from '@/components/common/Skeleton';

// Route-based code splitting via React.lazy + Suspense (Section 9 — Lighthouse target)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const StudentDashboardPage = lazy(() => import('@/pages/dashboard/StudentDashboardPage'));
const ProgramListPage = lazy(() => import('@/pages/programs/ProgramListPage'));
const ProgramDetailPage = lazy(() => import('@/pages/programs/ProgramDetailPage'));
const ApplicationFormPage = lazy(() => import('@/pages/application/ApplicationFormPage'));
const SeatReservationPage = lazy(() => import('@/pages/application/SeatReservationPage'));
const ApplicationStatusPage = lazy(() => import('@/pages/application/ApplicationStatusPage'));
const PaymentInitiatePage = lazy(() => import('@/pages/payment/PaymentInitiatePage'));
const PaymentStatusPage = lazy(() => import('@/pages/payment/PaymentStatusPage'));
const LiveMeritListPage = lazy(() => import('@/pages/merit-list/LiveMeritListPage'));
const AdmitCardPage = lazy(() => import('@/pages/admit-card/AdmitCardPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const SessionExpiredPage = lazy(() => import('@/pages/errors/SessionExpiredPage'));

const PageLoader = () => (
  <div className="space-y-4 py-4">
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<() => React.ReactElement>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/session-expired',
    element: withSuspense(SessionExpiredPage),
  },

  // Protected routes — wrapped in AppShell layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(StudentDashboardPage) },
      { path: 'programs', element: withSuspense(ProgramListPage) },
      { path: 'programs/:id', element: withSuspense(ProgramDetailPage) },
      { path: 'application/new', element: withSuspense(ApplicationFormPage) },
      { path: 'applications/:id', element: withSuspense(ApplicationStatusPage) },
      { path: 'applications/:id/reserve-seat', element: withSuspense(SeatReservationPage) },
      { path: 'payment/initiate', element: withSuspense(PaymentInitiatePage) },
      { path: 'payment/status', element: withSuspense(PaymentStatusPage) },
      { path: 'merit-list', element: withSuspense(LiveMeritListPage) },
      { path: 'admit-card', element: withSuspense(AdmitCardPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
    ],
  },

  // 404
  { path: '*', element: withSuspense(NotFoundPage) },
]);
