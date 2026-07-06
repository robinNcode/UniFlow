import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '@/api/endpoints/application.api';
import { useReserveSeat } from '@/hooks/useSeatReservationStatus';
import CountdownTimer from '@/components/common/CountdownTimer';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import { toast } from 'sonner';
import { QUOTA_LABELS } from '@/utils/constants';
import { AlertTriangle, ArrowRight, CheckCircle, Ban } from 'lucide-react';
import axios from 'axios';

export default function SeatReservationPage() {
  const { id: applicationId } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationApi.getApplicationById(applicationId!),
    enabled: !!applicationId,
  });

  const reserveMutation = useReserveSeat();

  const handleReserve = () => {
    if (!applicationId) return;
    reserveMutation.mutate(applicationId);
  };

  // 409 QUOTA_EXHAUSTED — dedicated inline UI per Section 5.2, never a generic toast
  const isQuotaExhausted =
    reserveMutation.isError &&
    axios.isAxiosError(reserveMutation.error) &&
    reserveMutation.error.response?.status === 409 &&
    reserveMutation.error.response?.data?.error === 'QUOTA_EXHAUSTED';

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Skeleton height="32px" width="60%" />
        <Skeleton height="200px" width="100%" />
      </div>
    );
  }

  if (!application) return <div className="text-center py-20"><p className="text-text-secondary">Application not found.</p></div>;

  const hasActiveReservation = application.status === 'seat_reserved' && application.reservationExpiresAt;
  const isPaymentPending = application.status === 'payment_pending';
  const isConfirmed = application.status === 'confirmed';

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('application.reserveSeat.cta')}</h1>
        <p className="text-text-secondary mt-1">{application.programName}</p>
      </div>

      {isConfirmed && (
        <Card className="border-success/20 bg-success-light">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-success shrink-0" />
            <div>
              <p className="font-semibold text-success">Admission Confirmed!</p>
              <p className="text-sm text-success/80 mt-0.5">Your payment has been verified and admission secured.</p>
            </div>
          </div>
        </Card>
      )}

      {hasActiveReservation && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-text-primary">Seat Reserved</h2>
                <p className="text-sm text-text-secondary mt-0.5">Quota: <span className="font-medium">{QUOTA_LABELS[application.quotaType]}</span></p>
              </div>
              <Badge variant="accent" dot pulseDot>Active</Badge>
            </div>
            <CountdownTimer
              expiresAt={application.reservationExpiresAt!}
              label={t('application.reserveSeat.timeRemaining')}
              onExpire={() => toast.error('Your reservation expired — seat released.')}
            />
            <p className="text-xs text-text-secondary bg-slate-50 rounded-lg p-3">
              Complete payment before the timer expires or your seat will be released automatically.
            </p>
            <div className="sticky-bottom-bar sm:static sm:p-0 sm:bg-transparent sm:border-0">
              <Link to={`/payment/initiate?applicationId=${applicationId}`}>
                <Button fullWidth size="lg" variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {t('application.reserveSeat.proceedPayment')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {isPaymentPending && (
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-light flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Payment in Progress</p>
              <p className="text-sm text-text-secondary mt-0.5">Your payment is being verified.</p>
            </div>
          </div>
          <Link to={`/payment/status?applicationId=${applicationId}`} className="mt-4 block">
            <Button variant="secondary" fullWidth size="sm">Check Payment Status</Button>
          </Link>
        </Card>
      )}

      {isQuotaExhausted && (
        <Card className="border-danger/20 bg-danger-light">
          <div className="flex items-start gap-3">
            <Ban className="h-6 w-6 text-danger shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-danger">{t('application.reserveSeat.quotaExhausted')}</p>
              <p className="text-sm text-danger/80 mt-1">
                {t('application.reserveSeat.quotaExhaustedMessage', { quota: QUOTA_LABELS[application.quotaType] })}
              </p>
              <p className="text-sm text-text-secondary mt-2">
                You may be eligible for another quota type. Please check with the admissions office.
              </p>
            </div>
          </div>
        </Card>
      )}

      {reserveMutation.isError && !isQuotaExhausted && (
        <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-danger shrink-0" />
          <p className="text-sm text-danger">{reserveMutation.error.message}</p>
        </div>
      )}

      {!hasActiveReservation && !isPaymentPending && !isConfirmed && (
        <>
          <Card>
            <div className="space-y-3">
              <h2 className="font-semibold text-text-primary">Reservation Details</h2>
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-sm text-text-secondary">Program</span>
                <span className="text-sm font-medium text-text-primary">{application.programName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-text-secondary">Quota Type</span>
                <span className="text-sm font-medium text-text-primary">{QUOTA_LABELS[application.quotaType]}</span>
              </div>
              <p className="text-xs text-text-muted bg-amber-50 border border-amber-100 rounded-lg p-3">
                Reserving a seat holds it for <strong>15 minutes</strong>. Complete payment within this window to secure your admission.
              </p>
            </div>
          </Card>
          <div className="sticky-bottom-bar sm:static sm:p-0 sm:bg-transparent sm:border-0">
            <Button fullWidth size="lg" isLoading={reserveMutation.isPending} onClick={handleReserve}>
              {reserveMutation.isPending ? t('application.reserveSeat.reserving') : t('application.reserveSeat.cta')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
