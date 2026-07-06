import axios from 'axios'
import { env } from '@/config/env'

// Axios instance — all API calls must use this, never a bare axios.get/post.
// Interceptors handle token attachment and error normalization globally.
export const axiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30_000,
})

// Request interceptor: attach JWT token from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { state?: { token?: string } }
                const token = parsed?.state?.token
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`
                }
            } catch {
                // malformed storage — ignore
            }
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor:
// • 401: clear auth store, redirect to /login preserving return-to path
// • 5xx/network: map to a user-readable generic error; log raw for debugging
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status

            if (status === 401) {
                // Clear persisted auth state
                localStorage.removeItem('auth-storage')
                const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
                window.location.href = `/login?returnTo=${returnTo}`
                return Promise.reject(new Error('Session expired. Please log in again.'))
            }

            if (!status || status >= 500) {
                // eslint-disable-next-line no-console
                console.error('[UniFlow API] Server error:', error)
                return Promise.reject(new Error('Something went wrong. Please try again.'))
            }

            // 4xx with a structured error body: bubble up as-is
            const data = error.response?.data as { message?: string } | undefined
            return Promise.reject(new Error(data?.message ?? error.message))
        }

        // Network error (no response)
        // eslint-disable-next-line no-console
        console.error('[UniFlow API] Network error:', error)
        return Promise.reject(new Error('Network error. Please check your connection.'))
    },
)
