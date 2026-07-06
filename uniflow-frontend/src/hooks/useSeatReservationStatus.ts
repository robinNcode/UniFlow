import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seatReservationApi } from '@/api/endpoints/seatReservation.api';
import type { SeatReservationResponse } from '@/api/types/application.types';
import { toast } from 'sonner';

/**
 * Seat reservation status polling hook.
 * Polls the reservation status while the reservation is active.
 * Stops polling once expired or completed.
 */
export function useSeatReservationStatus(applicationId: string | undefined) {
  return useQuery({
    queryKey: ['reservation-status', applicationId],
    queryFn: () => seatReservationApi.getReservationStatus(applicationId!),
    enabled: !!applicationId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling once reservation is no longer active
      if (status === 'expired' || status === 'completed') return false;
      return 5000; // Poll every 5 seconds while active
    },
    refetchOnWindowFocus: true,
  });
}

/**
 * Reserve seat mutation — handles the POST and cache invalidation.
 */
export function useReserveSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => seatReservationApi.reserveSeat(applicationId),
    onSuccess: (_data: SeatReservationResponse) => {
      toast.success('Seat reserved successfully! Complete payment before it expires.');
      queryClient.invalidateQueries({ queryKey: ['reservation-status'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
    // Error handling is global via queryClient, but 409 QUOTA_EXHAUSTED is
    // handled explicitly in the component for dedicated inline UI
  });
}
