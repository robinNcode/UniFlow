import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/api/endpoints/payment.api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ArrowRight, Shield, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function PaymentInitiatePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const applicationId = searchParams.get('applicationId') ?? '';

  const initiateMutation = useMutation({
    mutationFn: () => paymentApi.initiatePayment({ applicationId, reservationId: '' }),
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.success('Payment initiated.');
        navigate(`/payment/status?paymentId=${data.paymentId}&applicationId=${applicationId}`);
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('payment.initiate.title')}</h1>
        <p className="text-text-secondary mt-1">{t('payment.initiate.subtitle')}</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">{t('payment.initiate.amount')}</p>
              <p className="text-2xl font-bold text-text-primary">৳ 1,500</p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <Shield className="h-4 w-4 text-success shrink-0" />
              <span>Secure payment via bKash / Nagad</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Shield className="h-4 w-4 text-success shrink-0" />
              <span>Payment verification may take a few minutes</span>
            </div>
          </div>

          {initiateMutation.isError && (
            <div className="px-4 py-3 rounded-xl bg-danger-light border border-danger/20">
              <p className="text-sm text-danger">{initiateMutation.error.message}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="sticky-bottom-bar sm:static sm:p-0 sm:bg-transparent sm:border-0">
        <Button
          fullWidth
          size="lg"
          variant="accent"
          isLoading={initiateMutation.isPending}
          onClick={() => initiateMutation.mutate()}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          {initiateMutation.isPending ? t('payment.initiate.processing') : t('payment.initiate.cta')}
        </Button>
      </div>
    </div>
  );
}
