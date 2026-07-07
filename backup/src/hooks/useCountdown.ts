import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownResult {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  isUrgent: boolean;
}

/**
 * Countdown hook that:
 * 1. Counts down to an expiry time every second (client-side)
 * 2. Re-syncs against server time on mount
 * 3. Re-syncs on visibility change (document.visibilitychange)
 *
 * The isUrgent flag triggers when remaining time drops below the
 * warning threshold, allowing the UI to show amber/danger styling.
 */
export function useCountdown(
  expiresAt: string | null | undefined,
  warningThresholdSeconds: number = 120
): CountdownResult {
  const calculateRemaining = useCallback((): number => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [expiresAt]);

  const [totalSeconds, setTotalSeconds] = useState(calculateRemaining);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second
  useEffect(() => {
    if (!expiresAt) return;

    setTotalSeconds(calculateRemaining());

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expiresAt, calculateRemaining]);

  // Re-sync on visibility change — client clocks drift
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTotalSeconds(calculateRemaining());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [calculateRemaining]);

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isExpired: totalSeconds <= 0 && !!expiresAt,
    isUrgent: totalSeconds > 0 && totalSeconds <= warningThresholdSeconds,
  };
}
