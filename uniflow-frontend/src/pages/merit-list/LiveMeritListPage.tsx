import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useMeritListPolling } from '@/hooks/useMeritListPolling';
import { useAuthStore } from '@/stores/authStore';
import Badge from '@/components/common/Badge';
import { SkeletonTable } from '@/components/common/Skeleton';
import { QUOTA_LABELS } from '@/utils/constants';
import { Trophy, AlertTriangle, WifiOff } from 'lucide-react';
import type { QuotaType } from '@/api/types/common.types';

// Hard-coded cycle ID for MVP — real implementation would derive from active cycle API
const ACTIVE_CYCLE_ID = 'current';

export default function LiveMeritListPage() {
  const { t } = useTranslation();
  const student = useAuthStore((s) => s.student);
  const [selectedQuota, setSelectedQuota] = useState<QuotaType | undefined>(undefined);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const { data, isLoading, showStaleWarning, lastUpdated } = useMeritListPolling(
    ACTIVE_CYCLE_ID,
    selectedQuota,
    1
  );

  // Update "N seconds ago" label every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Virtual list — virtualize when > 200 rows (Section 6.4)
  const parentRef = useRef<HTMLDivElement>(null);
  const results = data?.results ?? [];
  const shouldVirtualize = (data?.totalCandidates ?? 0) > 200;

  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    enabled: shouldVirtualize,
  });

  const quotaOptions: { value: QuotaType | undefined; label: string }[] = [
    { value: undefined, label: t('meritList.allQuotas') },
    ...Object.entries(QUOTA_LABELS).map(([k, v]) => ({ value: k as QuotaType, label: v })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            {t('meritList.title')}
          </h1>
          <p className="text-text-secondary mt-1">{t('meritList.subtitle')}</p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          {showStaleWarning ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger-light border border-danger/20">
              <WifiOff className="h-4 w-4 text-danger" />
              <span className="text-xs font-medium text-danger">{t('common.connectionIssue')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-light border border-success/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs font-medium text-success">{t('common.live')}</span>
              {lastUpdated && (
                <span className="text-xs text-text-muted">
                  · {secondsAgo}s ago
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats + Quota filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {data && (
          <p className="text-sm text-text-secondary">
            {t('meritList.totalCandidates', { count: data.totalCandidates.toLocaleString() })}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {quotaOptions.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setSelectedQuota(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedQuota === value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-text-secondary border border-border hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stale warning banner */}
      {showStaleWarning && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning-light border border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-sm text-warning">{t('common.connectionIssue')}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wide">
          <div className="col-span-2">{t('meritList.rank')}</div>
          <div className="col-span-4">{t('meritList.studentId')}</div>
          <div className="col-span-3">{t('meritList.score')}</div>
          <div className="col-span-3">{t('meritList.status')}</div>
        </div>

        {isLoading ? (
          <div className="p-4">
            <SkeletonTable rows={8} />
          </div>
        ) : !results.length ? (
          <div className="text-center py-16">
            <Trophy className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No results available yet.</p>
          </div>
        ) : shouldVirtualize ? (
          /* Virtualised list for large datasets */
          <div ref={parentRef} className="overflow-y-auto" style={{ height: '500px' }}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const entry = results[virtualRow.index];
                const isMe = entry.studentId === student?.id;
                return (
                  <div
                    key={virtualRow.key}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
                    className={`grid grid-cols-12 px-4 py-3 border-b border-border-light text-sm items-center transition-colors
                      ${isMe ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-slate-50'}`}
                  >
                    <div className="col-span-2 font-bold text-text-primary">#{entry.rank}</div>
                    <div className="col-span-4 font-mono text-text-secondary text-xs truncate">
                      {isMe ? <span className="font-semibold text-primary">{entry.studentId} (You)</span> : entry.studentId}
                    </div>
                    <div className="col-span-3 font-semibold text-text-primary">{entry.meritScore.toFixed(2)}</div>
                    <div className="col-span-3">
                      <Badge variant={entry.status === 'confirmed' ? 'success' : 'default'}>
                        {entry.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Non-virtualised for smaller lists */
          <div>
            {results.map((entry) => {
              const isMe = entry.studentId === student?.id;
              return (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-12 px-4 py-3.5 border-b border-border-light text-sm items-center transition-colors
                    ${isMe ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50'}`}
                >
                  <div className="col-span-2 font-bold text-text-primary">
                    {entry.rank <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                        ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : entry.rank === 2 ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                        #{entry.rank}
                      </span>
                    ) : `#${entry.rank}`}
                  </div>
                  <div className="col-span-4 font-mono text-xs text-text-secondary truncate">
                    {isMe ? <span className="font-semibold text-primary">You</span> : entry.studentId}
                  </div>
                  <div className="col-span-3 font-semibold text-text-primary">{entry.meritScore.toFixed(2)}</div>
                  <div className="col-span-3">
                    <Badge variant={entry.status === 'confirmed' ? 'success' : 'default'}>
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
