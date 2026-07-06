import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { seatReservationApi } from '@/api/endpoints/seatReservation.api'
import { env } from '@/config/env'

/**
 * Polls the seat reservation status on a configurable interval.
 * Tracks consecutive failed refetch attempts and surfaces a stale-data warning
 * after 3 failures, as required by spec §7.
 */
export function useSeatReservationStatus(applicationId: string | undefined) {
    const consecutiveFailures = useRef(0)

    const query = useQuery({
        queryKey: ['reservation-status', applicationId],
        queryFn: async () => {
            consecutiveFailures.current = 0
            return seatReservationApi.getReservationStatus(applicationId!)
        },
        enabled: Boolean(applicationId),
        refetchInterval: env.paymentPollIntervalMs,
        refetchIntervalInBackground: false,
    })

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
