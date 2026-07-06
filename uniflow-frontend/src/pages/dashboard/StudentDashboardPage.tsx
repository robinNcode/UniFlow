import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { applicationApi } from '@/api/endpoints/application.api';
import Card from '@/components/common/Card';
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
} from 'lucide-react';
import type { ApplicationStatus } from '@/api/types/common.types';

const statusVariantMap: Record<ApplicationStatus, 'default' | 'success' | 'danger' | 'warning' | 'info' | 'accent'> = {
  pending: 'warning',
  seat_reserved: 'accent',
  payment_pending: 'info',
  confirmed: 'success',
  expired: 'danger',
  rejected: 'danger',
  withdrawn: 'default',
};

export default function StudentDashboardPage() {
  const { t } = useTranslation();
  const student = useAuthStore((s) => s.student);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.getMyApplications,
  });

  const quickActions = [
    {
      icon: GraduationCap,
      title: t('programs.title'),
      desc: 'Browse available programs',
      path: '/programs',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Trophy,
      title: t('nav.meritList'),
      desc: 'Check live rankings',
      path: '/merit-list',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: CreditCard,
      title: t('nav.admitCard'),
      desc: 'Download your card',
      path: '/admit-card',
      color: 'bg-success/10 text-success',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/10 translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">
            {t('dashboard.title')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {t('dashboard.welcome', { name: student?.fullName?.split(' ')[0] })}
          </h1>
          <p className="text-white/70 max-w-md">
            {t('dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card hover className="group">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm">{action.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t('dashboard.recentActivity')}
          </h2>
          <Link to="/programs">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              {t('dashboard.startApplication')}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !applications?.length ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-text-muted" />
            </div>
            <p className="text-text-secondary mb-4">{t('dashboard.noApplications')}</p>
            <Link to="/programs">
              <Button size="sm" leftIcon={<GraduationCap className="h-4 w-4" />}>
                {t('dashboard.startApplication')}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <Link key={app.id} to={`/applications/${app.id}`}>
                <Card hover>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">
                          {app.programName}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-text-secondary">
                            {QUOTA_LABELS[app.quotaType]}
                          </span>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(app.submittedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusVariantMap[app.status]}>
                      {STATUS_LABELS[app.status]}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
