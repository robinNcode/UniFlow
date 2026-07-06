import { useQuery } from '@tanstack/react-query';
import { meritListApi } from '@/api/endpoints/meritList.api';
import { env } from '@/config/env';
import type { QuotaType } from '@/api/types/common.types';
import { useState, useEffect, useCallback } from 'react';

/**
 * Merit list polling hook.
 * - Polls at the configured interval while the tab is visible
 * - Pauses polling when tab is hidden (document.visibilitychange)
 * - Re-fetches immediately on return to foreground
 * - Tracks consecutive failures for stale-data banner
 */
export function useMeritListPolling(
  cycleId: string | undefined,
  quota?: QuotaType,
  page: number = 1
) {
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const query = useQuery({
    queryKey: ['merit-list', cycleId, quota, page],
    queryFn: () => meritListApi.getMeritList(cycleId!, quota, page),
    enabled: !!cycleId,
    refetchInterval: isTabVisible ? env.meritListPollIntervalMs : false,
    refetchOnWindowFocus: true,
  });

  // Track consecutive errors for stale-data banner (Section 7)
  const resetErrors = useCallback(() => setConsecutiveErrors(0), []);

  useEffect(() => {
    if (query.isError) {
      setConsecutiveErrors((prev) => prev + 1);
    } else if (query.isSuccess) {
      resetErrors();
    }
  }, [query.isError, query.isSuccess, resetErrors]);

  return {
    ...query,
    consecutiveErrors,
    showStaleWarning: consecutiveErrors >= 3,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
