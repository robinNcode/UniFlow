import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { applicationApi } from '@/api/endpoints/application.api';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Skeleton';
import { STATUS_LABELS, QUOTA_LABELS } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import {
  FileText,
  GraduationCap,
  Trophy,
  CreditCard,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
} from 'lucide-react';
import type { ApplicationStatus } from '@/api/types/common.types';

const statusVariantMap: Record<
  ApplicationStatus,
  'default' | 'success' | 'danger' | 'warning' | 'info' | 'accent'
> = {
  pending: 'warning',
  seat_reserved: 'accent',
  payment_pending: 'info',
  confirmed: 'success',
  expired: 'danger',
  rejected: 'danger',
  withdrawn: 'default',
};

const QUICK_ACTIONS = [
  {
    icon: GraduationCap,
    label: 'Browse Programs',
    desc: 'Find your ideal program',
    path: '/programs',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  {
    icon: Trophy,
    label: 'Merit Rankings',
    desc: 'Live leaderboard',
    path: '/merit-list',
    bg: 'bg-amber-100',
    color: 'text-amber-700',
  },
  {
    icon: CreditCard,
    label: 'Admit Card',
    desc: 'Download your card',
    path: '/admit-card',
    bg: 'bg-emerald-100',
    color: 'text-emerald-700',
  },
];

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.getMyApplications,
  });

  const firstName = user?.fullName?.split(' ')[0] ?? 'Student';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#082E38] px-6 py-8 sm:px-10 sm:py-10">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Student Portal</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-white/70 text-sm max-w-md">
              Track your applications, check live merit rankings, and complete your admission process.
            </p>
          </div>
          <Link to="/programs">
            <Button
              variant="accent"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Browse Programs
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, path, bg, color }) => (
            <Link key={path} to={path}>
              <div className="group bg-white rounded-2xl border border-border p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary leading-tight">{label}</p>
                  <p className="text-xs text-text-muted mt-0.5 hidden sm:block">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-auto self-end" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Applications ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">My Applications</h2>
          <Link to="/programs">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              New Application
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : !applications?.length ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-7 w-7 text-text-muted" />
            </div>
            <p className="text-sm text-text-secondary mb-4">No applications yet. Browse programs to get started.</p>
            <Link to="/programs">
              <Button size="sm" leftIcon={<GraduationCap className="h-4 w-4" />}>
                Browse Programs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link key={app.id} to={`/applications/${app.id}`}>
                <div className="group bg-white rounded-2xl border border-border px-5 py-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {app.programName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-text-muted">{QUOTA_LABELS[app.quotaType]}</span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(app.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusVariantMap[app.status]}>
                      {STATUS_LABELS[app.status]}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
