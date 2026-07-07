

interface SkeletonProps {
  height?: string;
  width?: string;
  className?: string;
}

export function Skeleton({ height = '20px', width = '100%', className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-md ${className}`}
      style={{ height, width }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full flex gap-4">
      <Skeleton width="40px" height="40px" className="rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height="20px" />
        <Skeleton width="30%" height="16px" />
      </div>
      <Skeleton width="60px" height="24px" className="rounded-full shrink-0" />
    </div>
  );
}

export default Skeleton;
