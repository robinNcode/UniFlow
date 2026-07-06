import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { meritListApi } from '@/api/endpoints/meritList.api'
import { env } from '@/config/env'
import type { QuotaType } from '@/api/types/common.types'

/**
 * Polls the live merit list on a configurable interval (VITE_MERIT_LIST_POLL_INTERVAL_MS).
 * Pauses when the tab is hidden (visibility = hidden) to avoid wasted requests.
 * Resumes and immediately refetches on tab becoming visible again.
 * Tracks consecutive failures; after 3, sets isDataStale to true for a UI warning banner.
 */
export function useMeritListPolling(
    cycleId: string | undefined,
    quota: QuotaType = 'general',
    page = 1,
) {
    const queryClient = useQueryClient()
    const consecutiveFailures = useRef(0)

    const query = useQuery({
        queryKey: ['merit-list', cycleId, quota, page],
        queryFn: async () => {
            consecutiveFailures.current = 0
            return meritListApi.getMeritList(cycleId!, quota, page)
        },
        enabled: Boolean(cycleId),
        staleTime: 0,
        refetchInterval: env.meritListPollIntervalMs,
        refetchIntervalInBackground: false, // Pauses when tab is hidden
    })

    // Re-fetch immediately when tab becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && cycleId) {
                void queryClient.invalidateQueries({ queryKey: ['merit-list', cycleId, quota, page] })
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [cycleId, quota, page, queryClient])

    if (query.isError) {
        consecutiveFailures.current += 1
    } else if (query.isSuccess) {
        consecutiveFailures.current = 0
    }

    return {
        ...query,
        isDataStale: consecutiveFailures.current >= 3,
    }
}
