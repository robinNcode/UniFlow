import { useCountdown } from '@/hooks/useCountdown'

interface CountdownTimerProps {
    expiresAt: string | null | undefined
    className?: string
}

export function CountdownTimer({ expiresAt, className = '' }: CountdownTimerProps) {
    const { minutes, seconds, isExpired, isWarning } = useCountdown(expiresAt)

    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    return (
        <p
            className={[
                'text-2xl font-bold tabular-nums',
                isExpired ? 'text-danger' : isWarning ? 'text-accent' : 'text-accent',
                className,
            ].join(' ')}
            aria-live="polite"
            aria-label={isExpired ? 'Reservation expired' : `Reservation expires in ${display}`}
        >
            {isExpired ? '00:00' : display}
        </p>
    )
}
