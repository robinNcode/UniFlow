import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/api/endpoints/application.api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import CountdownTimer from '@/components/common/CountdownTimer';
import { STATUS_LABELS, QUOTA_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { ArrowRight, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { ApplicationStatus } from '@/api/types/common.types';

const statusVariantMap: Record<ApplicationStatus, 'default' | 'success' | 'danger' | 'warning' | 'info' | 'accent'> = {
  pending: 'warning', seat_reserved: 'accent', payment_pending: 'info',
  confirmed: 'success', expired: 'danger', rejected: 'danger', withdrawn: 'default',
};

export default function ApplicationStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getApplicationById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'confirmed' || status === 'rejected' || status === 'withdrawn' || status === 'expired') return false;
      return 10000;
    },
  });

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton height="32px" width="50%" />
      <Skeleton height="160px" width="100%" />
      <Skeleton height="120px" width="100%" />
    </div>
  );

  if (!application) return <div className="text-center py-20"><p className="text-text-secondary">Application not found.</p></div>;

  const statusIcon: Record<ApplicationStatus, React.ReactNode> = {
    pending: <Clock className="h-6 w-6 text-warning" />,
    seat_reserved: <CheckCircle className="h-6 w-6 text-accent" />,
    payment_pending: <Clock className="h-6 w-6 text-info" />,
    confirmed: <CheckCircle className="h-6 w-6 text-success" />,
    expired: <AlertCircle className="h-6 w-6 text-danger" />,
    rejected: <AlertCircle className="h-6 w-6 text-danger" />,
    withdrawn: <AlertCircle className="h-6 w-6 text-text-muted" />,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('application.status.title')}</h1>
        <p className="text-text-secondary mt-1">{application.programName}</p>
      </div>

      {/* Status Card */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
              {statusIcon[application.status]}
            </div>
            <div>
              <p className="text-sm text-text-secondary">Current Status</p>
              <p className="text-lg font-bold text-text-primary mt-0.5">
                {STATUS_LABELS[application.status]}
              </p>
            </div>
          </div>
          <Badge variant={statusVariantMap[application.status]}>
            {STATUS_LABELS[application.status]}
          </Badge>
        </div>

        {/* Active reservation countdown */}
        {application.status === 'seat_reserved' && application.reservationExpiresAt && (
          <div className="mt-4">
            <CountdownTimer expiresAt={application.reservationExpiresAt} label="Reservation Expires" size="sm" />
          </div>
        )}

        {/* Merit score */}
        {application.meritScore != null && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Merit Score:</span>
            <span className="font-semibold text-text-primary">{application.meritScore.toFixed(2)}</span>
            {application.meritRank != null && (
              <span className="text-text-muted">· Rank #{application.meritRank}</span>
            )}
          </div>
        )}
      </Card>

      {/* Details */}
      <Card>
        <h2 className="font-semibold text-text-primary mb-4">Application Details</h2>
        <div className="space-y-3">
          {[
            { label: 'Program', value: application.programName },
            { label: 'Quota', value: QUOTA_LABELS[application.quotaType] },
            { label: 'Submitted', value: formatDateTime(application.submittedAt) },
            { label: 'Last Updated', value: formatDateTime(application.updatedAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-border-light last:border-0">
              <span className="text-sm text-text-secondary">{label}</span>
              <span className="text-sm font-medium text-text-primary">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {application.status === 'seat_reserved' && (
          <Link to={`/applications/${id}/reserve-seat`} className="flex-1">
            <Button fullWidth variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>
              {t('application.reserveSeat.proceedPayment')}
            </Button>
          </Link>
        )}
        {application.status === 'confirmed' && (
          <Link to="/admit-card" className="flex-1">
            <Button fullWidth rightIcon={<FileText className="h-4 w-4" />}>
              {t('admitCard.download')}
            </Button>
          </Link>
        )}
        <Link to="/merit-list" className="flex-1">
          <Button fullWidth variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View Merit List
          </Button>
        </Link>
      </div>
    </div>
  );
}
