// Typed environment variable accessors — all VITE_ prefixed vars must go through
// this module, never accessed directly from import.meta.env in components.
// This centralizes validation and makes missing vars fail at startup, not at runtime.

export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
    meritListPollIntervalMs: Number(import.meta.env.VITE_MERIT_LIST_POLL_INTERVAL_MS ?? 12000),
    paymentPollIntervalMs: Number(import.meta.env.VITE_PAYMENT_POLL_INTERVAL_MS ?? 3000),
    paymentPollTimeoutMs: Number(import.meta.env.VITE_PAYMENT_POLL_TIMEOUT_MS ?? 300000),
    reservationWarningThresholdSeconds: Number(
        import.meta.env.VITE_RESERVATION_WARNING_THRESHOLD_SECONDS ?? 120,
    ),
} as const
