import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'accent';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-text-secondary',
  success: 'bg-success-light text-success',
  danger: 'bg-danger-light text-danger',
  warning: 'bg-warning-light text-warning',
  info: 'bg-info-light text-info',
  accent: 'bg-accent-light text-accent',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-secondary',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
  accent: 'bg-accent',
};

export default function Badge({
  children,
  variant = 'default',
  dot = false,
  pulseDot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulseDot && (
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColors[variant]}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
}
