interface SkeletonProps {
    className?: string
    rows?: number
}

export function Skeleton({ className = '' }: Omit<SkeletonProps, 'rows'>) {
    return (
        <div
            className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-skeleton-shimmer rounded ${className}`}
            aria-hidden
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-surface border border-slate-200 rounded-xl p-5 space-y-3" aria-label="Loading…">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
        </div>
    )
}

export function SkeletonTableRows({ rows = 5 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} aria-hidden>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
            ))}
        </>
    )
}
