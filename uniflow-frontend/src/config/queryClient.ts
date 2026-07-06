import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: 0 for live-data screens (merit list, reservation status)
            // Components that need longer stale times override via useQuery options
            staleTime: 0,
            retry: 3,
            refetchOnWindowFocus: true,
        },
        mutations: {
            onError: (error: unknown) => {
                const message =
                    error instanceof Error ? error.message : 'Something went wrong. Please try again.'
                toast.error(message)
            },
            retry: 1,
        },
    },
})
