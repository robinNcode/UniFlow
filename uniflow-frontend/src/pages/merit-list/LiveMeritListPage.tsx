import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMeritListPolling } from '@/hooks/useMeritListPolling';
import { useAuthStore } from '@/stores/authStore';
import Badge from '@/components/common/Badge';
import { SkeletonTable } from '@/components/common/Skeleton';
import { QUOTA_LABELS } from '@/utils/constants';
import { Trophy, AlertTriangle, WifiOff } from 'lucide-react';
import type { QuotaType } from '@/api/types/common.types';

const ACTIVE_CYCLE_ID = 'current';

export default function LiveMeritListPage() {
  const user = useAuthStore((s) => s.user);
  const [selectedQuota, setSelectedQuota] = useState<QuotaType | undefined>(undefined);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const { data, isLoading, showStaleWarning, lastUpdated } = useMeritListPolling(
    ACTIVE_CYCLE_ID,
    selectedQuota,
    1
  );

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

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
    { value: undefined, label: 'All Quotas' },
    ...Object.entries(QUOTA_LABELS).map(([k, v]) => ({ value: k as QuotaType, label: v })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-500" />
            Live Merit List
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time merit rankings updated every few seconds
          </p>
        </div>

        {/* Live indicator */}
        <div className="shrink-0">
          {showStaleWarning ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger-light border border-danger/20 text-xs font-medium text-danger">
              <WifiOff className="h-3.5 w-3.5" />
              Connection lost
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live
              {lastUpdated && (
                <span className="font-normal text-emerald-600">· {secondsAgo}s ago</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
        { label: 'Total Candidates', value: data.totalCandidates.toLocaleString() },
            { label: 'Total Pages', value: String(data.totalPages) },
            { label: 'Current Page', value: String(data.page) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <p className="text-xs text-text-muted mb-1">{label}</p>
              <p className="text-sm font-bold text-text-primary">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stale warning */}
      {showStaleWarning && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning-light border border-warning/30 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          Data may be stale. Reconnecting…
        </div>
      )}

      {/* Quota filter pills */}
      <div className="flex flex-wrap gap-2">
        {quotaOptions.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => setSelectedQuota(value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
              selectedQuota === value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 border-b border-border">
          <div className="col-span-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Rank</div>
          <div className="col-span-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Student ID</div>
          <div className="col-span-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Score</div>
          <div className="col-span-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</div>
        </div>

        {isLoading ? (
          <div className="p-6"><SkeletonTable rows={8} /></div>
        ) : !results.length ? (
          <div className="text-center py-20">
            <Trophy className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No results published yet.</p>
          </div>
        ) : shouldVirtualize ? (
          <div ref={parentRef} className="overflow-y-auto" style={{ height: '500px' }}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const entry = results[virtualRow.index];
                const isMe = entry.studentId === user?.id;
                return (
                  <div
                    key={virtualRow.key}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
                    className={`grid grid-cols-12 px-5 py-3.5 border-b border-border-light items-center text-sm ${
                      isMe ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-2 font-bold text-text-primary">#{entry.rank}</div>
                    <div className="col-span-4 font-mono text-xs text-text-secondary truncate">
                      {isMe ? <span className="font-semibold text-primary">You ({entry.studentId})</span> : entry.studentId}
                    </div>
                    <div className="col-span-3 font-bold text-text-primary">{entry.meritScore.toFixed(2)}</div>
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
          <div>
            {results.map((entry, idx) => {
              const isMe = entry.studentId === user?.id;
              const rankColors = ['bg-amber-50 text-amber-700', 'bg-slate-50 text-slate-600', 'bg-orange-50 text-orange-700'];
              return (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-12 px-5 py-3.5 border-b border-border-light items-center text-sm last:border-0 ${
                    isMe ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="col-span-2 font-bold text-text-primary">
                    {idx < 3 ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankColors[idx]}`}>
                        #{entry.rank}
                      </span>
                    ) : (
                      <span className="text-text-secondary">#{entry.rank}</span>
                    )}
                  </div>
                  <div className="col-span-4 font-mono text-xs text-text-secondary truncate">
                    {isMe ? <span className="font-semibold text-primary">You</span> : entry.studentId}
                  </div>
                  <div className="col-span-3 font-bold text-text-primary">{entry.meritScore.toFixed(2)}</div>
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
