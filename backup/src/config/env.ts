/**
 * Typed environment variable access layer.
 * All VITE_ prefixed env vars are accessed through this module
 * to ensure type safety and single-point-of-change.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:5000/api/v1',
  meritListPollIntervalMs: Number(import.meta.env.VITE_MERIT_LIST_POLL_INTERVAL_MS) || 12000,
  paymentPollIntervalMs: Number(import.meta.env.VITE_PAYMENT_POLL_INTERVAL_MS) || 3000,
  paymentPollTimeoutMs: Number(import.meta.env.VITE_PAYMENT_POLL_TIMEOUT_MS) || 300000,
  reservationWarningThresholdSeconds: Number(import.meta.env.VITE_RESERVATION_WARNING_THRESHOLD_SECONDS) || 120,
} as const;
