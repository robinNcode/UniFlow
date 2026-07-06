import { useCountdown } from '@/hooks/useCountdown';
import { padZero } from '@/utils/formatters';
import { env } from '@/config/env';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: string;
  label?: string;
  onExpire?: () => void;
  size?: 'sm' | 'lg';
}

/**
 * Visual countdown timer component.
 * Uses aria-live="polite" for screen reader announcements.
 * Switches to urgent (amber → red) styling as deadline approaches.
 */
export default function CountdownTimer({
  expiresAt,
  label = 'Time Remaining',
  onExpire,
  size = 'lg',
}: CountdownTimerProps) {
  const { minutes, seconds, isExpired, isUrgent } = useCountdown(
    expiresAt,
    env.reservationWarningThresholdSeconds
  );

  // Notify parent on expiry
  if (isExpired && onExpire) {
    onExpire();
  }

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger-light border border-danger/20">
        <AlertTriangle className="h-5 w-5 text-danger" />
        <span className="text-sm font-medium text-danger">
          Time expired — reservation released
        </span>
      </div>
    );
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`
        flex items-center gap-3 rounded-xl transition-colors duration-300
        ${isUrgent
          ? 'bg-danger-light border border-danger/20'
          : 'bg-accent-light border border-accent/20'
        }
        ${isSmall ? 'px-3 py-2' : 'px-4 py-3'}
      `}
      aria-live="polite"
      role="timer"
    >
      <Clock className={`${isSmall ? 'h-4 w-4' : 'h-5 w-5'} ${isUrgent ? 'text-danger' : 'text-accent'}`} />
      <div className="flex flex-col">
        <span className={`${isSmall ? 'text-xs' : 'text-xs'} font-medium ${isUrgent ? 'text-danger' : 'text-accent'}`}>
          {label}
        </span>
        <span className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold tabular-nums ${isUrgent ? 'text-danger' : 'text-accent'}`}>
          {padZero(minutes)}:{padZero(seconds)}
        </span>
      </div>
    </div>
  );
}
