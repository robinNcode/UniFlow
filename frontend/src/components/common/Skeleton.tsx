interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export default function Skeleton({
  className = '',
  width,
  height,
  rounded = 'lg',
}: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
        bg-[length:200%_100%] animate-skeleton
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Pre-built skeleton patterns for common layouts.
 */
export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="80%" />
      <Skeleton height="16px" width="40%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height="32px" width="80px" rounded="full" />
        <Skeleton height="32px" width="100px" rounded="full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton height="40px" width="100%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="48px" width="100%" />
      ))}
    </div>
  );
}
