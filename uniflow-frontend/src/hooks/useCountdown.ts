import { useState, useEffect, useRef, useCallback } from 'react'
import { env } from '@/config/env'

interface CountdownResult {
    minutes: number
    seconds: number
    totalSeconds: number
    isExpired: boolean
    isWarning: boolean
}

/**
 * Reusable countdown hook synced against server time on mount and on
 * visibility changes (document.visibilitychange). Client clocks drift
 * and cannot be trusted alone for a 15-minute seat reservation window.
 *
 * @param expiresAt ISO string representing the server-side expiry time.
 */
export function useCountdown(expiresAt: string | null | undefined): CountdownResult {
    const calculateRemaining = useCallback((): number => {
        if (!expiresAt) return 0
        return Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
    }, [expiresAt])

    const [totalSeconds, setTotalSeconds] = useState<number>(calculateRemaining)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const resetFromServer = useCallback(() => {
        setTotalSeconds(calculateRemaining())
    }, [calculateRemaining])

    useEffect(() => {
        // Re-sync on mount
        resetFromServer()

        timerRef.current = setInterval(() => {
            setTotalSeconds((prev) => {
                if (prev <= 0) {
                    clearInterval(timerRef.current!)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Re-sync on tab becoming visible again (clock drift mitigation)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                resetFromServer()
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            clearInterval(timerRef.current!)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [expiresAt, resetFromServer])

    const clamped = Math.max(0, totalSeconds)
    return {
        totalSeconds: clamped,
        minutes: Math.floor(clamped / 60),
        seconds: clamped % 60,
        isExpired: clamped === 0,
        isWarning: clamped > 0 && clamped <= env.reservationWarningThresholdSeconds,
    }
}
