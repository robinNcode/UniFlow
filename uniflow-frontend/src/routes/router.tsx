import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from './ProtectedRoute';
import { SkeletonCard } from '@/components/common/Skeleton';

// Route-based code splitting via React.lazy + Suspense (Section 9 — Lighthouse target)
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
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

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminApplicationsPage = lazy(() => import('@/pages/admin/AdminApplicationsPage'));
const AdminSeatQuotasPage = lazy(() => import('@/pages/admin/AdminSeatQuotasPage'));
const AdminPaymentsPage = lazy(() => import('@/pages/admin/AdminPaymentsPage'));
const AdminMeritListPage = lazy(() => import('@/pages/admin/AdminMeritListPage'));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage'));

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

const withSuspenseLayout = (Component: React.LazyExoticComponent<() => React.ReactElement>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public routes with layout
  {
    path: '/',
    element: withSuspenseLayout(PublicLayout),
    children: [
      { index: true, element: withSuspense(LandingPage) },
    ],
  },
  // Auth routes (no layout)
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
    element: <AppShell />,
    children: [
      // Student Routes
      {
        element: <ProtectedRoute requireRole="student"><Outlet /></ProtectedRoute>,
        children: [
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
      // Admin Routes
      {
        path: 'admin',
        element: <ProtectedRoute requireRole="admin"><Outlet /></ProtectedRoute>,
        children: [
          { index: true, element: withSuspense(AdminDashboardPage) },
          { path: 'applications', element: withSuspense(AdminApplicationsPage) },
          { path: 'quotas', element: withSuspense(AdminSeatQuotasPage) },
          { path: 'payments', element: withSuspense(AdminPaymentsPage) },
          { path: 'merit-list', element: withSuspense(AdminMeritListPage) },
          { path: 'notifications', element: withSuspense(AdminNotificationsPage) },
        ],
      }
    ],
  },

  // 404
  { path: '*', element: withSuspense(NotFoundPage) },
]);
