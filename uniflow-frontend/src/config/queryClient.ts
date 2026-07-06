import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Global React Query client configuration.
 *
 * Design decisions:
 * - Stale time of 30s keeps data fresh for high-frequency polling screens
 * - Retry count of 2 with exponential backoff balances resilience vs latency
 * - Global mutation onError triggers toast feedback per Section 7
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        toast.error(message);
        console.error('[Mutation Error]', error);
      },
    },
  },
});
