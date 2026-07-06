import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { admitCardApi } from '@/api/endpoints/admitCard.api';
import { isAdmitCardReady } from '@/api/types/meritList.types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import Badge from '@/components/common/Badge';
import { Download, Clock, FileText, Calendar, Hash, RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

// For MVP: assume applicationId comes from the first confirmed application
// TODO: In production, derive from active confirmed application query
const MOCK_APPLICATION_ID = 'current';

export default function AdmitCardPage() {
  const { t } = useTranslation();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admit-card', MOCK_APPLICATION_ID],
    queryFn: () => admitCardApi.getAdmitCard(MOCK_APPLICATION_ID),
  });

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton height="32px" width="40%" />
      <Skeleton height="200px" width="100%" />
    </div>
  );

  const isReady = data && isAdmitCardReady(data);
  const isPending = data && !isAdmitCardReady(data);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('admitCard.title')}</h1>
        <p className="text-text-secondary mt-1">Your official examination admit card</p>
      </div>

      {/* Pending generation — 202 state, first-class UI per Section 6.5 */}
      {isPending && (
        <Card className="text-center py-10">
          <div className="w-16 h-16 rounded-2xl bg-warning-light flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          <p className="text-lg font-semibold text-text-primary mb-2">{t('admitCard.generating')}</p>
          <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
            {t('admitCard.generatingMessage')}
          </p>
          <Button
            variant="secondary"
            isLoading={isRefetching}
            onClick={() => refetch()}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            {t('admitCard.refreshCta')}
          </Button>
        </Card>
      )}

      {/* Not yet available (no data) */}
      {!data && !isLoading && (
        <Card className="text-center py-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-text-muted" />
          </div>
          <p className="text-text-secondary max-w-sm mx-auto">
            {t('admitCard.notAvailable')}
          </p>
        </Card>
      )}

      {/* Ready state */}
      {isReady && (
        <>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-6 text-white">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm">Admit Card</p>
                  <h2 className="text-xl font-bold mt-1">University Admission Exam</h2>
                </div>
                <Badge variant="success" dot pulseDot>Ready</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-white/60 text-xs flex items-center gap-1"><Hash className="h-3 w-3" /> Roll Number</p>
                  <p className="text-lg font-bold mt-0.5">{data.rollNumber}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> Exam Date</p>
                  <p className="text-lg font-bold mt-0.5">{formatDate(data.examDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-medium text-text-primary">Download your admit card</p>
                <p className="text-sm text-text-secondary mt-0.5">
                  PDF format · Keep this for the exam day
                </p>
              </div>
              {/* Native download — no PDF.js, no blob fetch per Section 6.5 */}
              <a
                href={data.pdfUrl}
                download={`admit-card-${data.rollNumber}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  leftIcon={<Download className="h-4 w-4" />}
                  size="lg"
                >
                  {t('admitCard.download')}
                </Button>
              </a>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
