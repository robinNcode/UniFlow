import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/api/endpoints/payment.api';
import { env } from '@/config/env';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import { CheckCircle, Clock, AlertCircle, Loader2, PhoneCall } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDateTime } from '@/utils/formatters';

/**
 * Payment Status Page — polls every VITE_PAYMENT_POLL_INTERVAL_MS until
 * confirmed/failed, or until VITE_PAYMENT_POLL_TIMEOUT_MS elapses.
 * After timeout, prompts user to check later rather than polling indefinitely.
 * See Section 5.3.
 */
export default function PaymentStatusPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId') ?? '';
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPollingTimedOut(true), env.paymentPollTimeoutMs);
    return () => clearTimeout(timer);
  }, [env.paymentPollTimeoutMs]);

  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment-status', paymentId],
    queryFn: () => paymentApi.getPaymentStatus(paymentId),
    enabled: !!paymentId && !pollingTimedOut,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'confirmed' || status === 'failed') return false;
      if (pollingTimedOut) return false;
      return env.paymentPollIntervalMs;
    },
  });

  if (isLoading) return (
    <div className="max-w-xl mx-auto space-y-4">
      <Skeleton height="32px" width="50%" />
      <Skeleton height="200px" width="100%" />
    </div>
  );

  const isConfirmed = payment?.status === 'confirmed';
  const isFailed = payment?.status === 'failed';
  const isPending = !payment || payment.status === 'pending' || payment.status === 'processing';

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary">{t('payment.status.title')}</h1>

      <Card>
        <div className="text-center py-6 space-y-4">
          {isConfirmed && (
            <>
              <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-success">{t('payment.status.confirmed')}</p>
                <p className="text-sm text-text-secondary mt-1">{t('payment.status.confirmedMessage')}</p>
              </div>
              {payment?.paidAt && (
                <p className="text-xs text-text-muted">Paid at {formatDateTime(payment.paidAt)}</p>
              )}
              <Badge variant="success">Transaction ID: {payment?.transactionId ?? 'N/A'}</Badge>
            </>
          )}

          {isFailed && (
            <>
              <div className="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-danger" />
              </div>
              <div>
                <p className="text-xl font-bold text-danger">{t('payment.status.failed')}</p>
                <p className="text-sm text-text-secondary mt-1">{t('payment.status.failedMessage')}</p>
              </div>
            </>
          )}

          {isPending && !pollingTimedOut && (
            <>
              <div className="w-16 h-16 rounded-full bg-info-light flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-info animate-spin" />
              </div>
              <div>
                <p className="text-xl font-bold text-info">{t('payment.status.pending')}</p>
                <p className="text-sm text-text-secondary mt-1">{t('payment.status.pendingMessage')}</p>
              </div>
              <p className="text-xs text-text-muted">Checking every {env.paymentPollIntervalMs / 1000}s…</p>
            </>
          )}

          {pollingTimedOut && isPending && (
            <>
              <div className="w-16 h-16 rounded-full bg-warning-light flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold text-warning">Still Processing</p>
                <p className="text-sm text-text-secondary mt-1">{t('payment.status.checkLater')}</p>
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        {isConfirmed && (
          <Link to="/admit-card" className="flex-1">
            <Button fullWidth>{t('admitCard.download')}</Button>
          </Link>
        )}
        {(isFailed || pollingTimedOut) && (
          <a href="tel:+8801234567890" className="flex-1">
            <Button fullWidth variant="secondary" leftIcon={<PhoneCall className="h-4 w-4" />}>
              {t('payment.status.contactSupport')}
            </Button>
          </a>
        )}
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth variant="ghost">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
