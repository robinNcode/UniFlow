import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import type { MeritListEntry } from '@/api/types/meritList.types'
import { STATUS_COLORS } from '@/utils/constants'
import { SkeletonTableRows } from '@/components/common/Skeleton'

interface MeritTableProps {
    data: MeritListEntry[]
    isLoading: boolean
}

export function MeritTable({ data, isLoading }: MeritTableProps) {
    const parentRef = useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 48, // approximate row height (px)
        overscan: 10,
    })

    // Table wrapper needs a constrained height for virtualization to work
    return (
        <div className="bg-surface border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-canvas border-b border-slate-200 px-4 py-3 flex text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div className="w-16">Rank</div>
                <div className="flex-1">Candidate</div>
                <div className="w-24">Score</div>
                <div className="w-32">Status</div>
            </div>

            <div
                ref={parentRef}
                className="overflow-auto max-h-[600px] w-full"
            >
                {isLoading ? (
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                            <SkeletonTableRows rows={10} />
                        </tbody>
                    </table>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No results found for this quota.</div>
                ) : (
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const row = data[virtualRow.index]
                            const isMe = row.isCurrentStudent

                            return (
                                <div
                                    key={row.studentId}
                                    className={[
                                        'absolute top-0 left-0 w-full flex items-center px-4 py-3 text-sm border-b border-slate-100 last:border-0',
                                        isMe ? 'bg-primary-light' : '',
                                    ].join(' ')}
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <div className="w-16 font-semibold tabular-nums">#{row.rank}</div>
                                    <div className={`flex-1 truncate pr-4 ${isMe ? 'font-semibold text-primary' : ''}`}>
                                        {row.studentName} {isMe && '(You)'}
                                    </div>
                                    <div className="w-24 tabular-nums">{row.meritScore.toFixed(3)}</div>
                                    <div className="w-32">
                                        <span
                                            className={[
                                                'text-xs font-semibold px-2 py-0.5 rounded-full',
                                                STATUS_COLORS[row.status] || 'bg-slate-100 text-slate-500',
                                            ].join(' ')}
                                        >
                                            {row.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
