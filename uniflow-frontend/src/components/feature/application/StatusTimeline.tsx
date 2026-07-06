import { CheckCircle2, Circle } from 'lucide-react'
import { formatDateTime } from '@/utils/formatters'
import type { ApplicationStatus } from '@/api/types/common.types'
import { STATUS_LABELS } from '@/utils/constants'

interface StatusTimelineProps {
    status: ApplicationStatus
    appliedAt: string
    reservedAt?: string
    confirmedAt?: string
}

// Ordered steps for the typical application flow
const FLOW_STEPS = ['pending', 'seat_reserved', 'payment_pending', 'confirmed'] as const

export function StatusTimeline({ status, appliedAt, reservedAt, confirmedAt }: StatusTimelineProps) {
    // If the status is a terminal side-state (rejected, expired, withdrawn) we still show the timeline
    // but with that failure state appended or interrupting the flow. For simplicity in the prototype,
    // we'll map the progress based on whether previous dates exist.

    const isComplete = (step: string) => {
        switch (step) {
            case 'pending': return true
            case 'seat_reserved': return Boolean(reservedAt || confirmedAt || status === 'seat_reserved' || status === 'payment_pending')
            case 'payment_pending': return Boolean(confirmedAt || status === 'payment_pending')
            case 'confirmed': return status === 'confirmed'
            default: return false
        }
    }

    const getTimestamp = (step: string) => {
        switch (step) {
            case 'pending': return formatDateTime(appliedAt)
            case 'seat_reserved': return reservedAt ? formatDateTime(reservedAt) : undefined
            case 'confirmed': return confirmedAt ? formatDateTime(confirmedAt) : undefined
            default: return undefined
        }
    }

    return (
        <ol className="space-y-0">
            {FLOW_STEPS.map((step, index) => {
                const completed = isComplete(step)
                const isLastCompleted = completed && (index === FLOW_STEPS.length - 1 || !isComplete(FLOW_STEPS[index + 1]))
                const isCurrentState = step === status

                return (
                    <li key={step} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                            {completed ? (
                                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-surface flex items-center justify-center">
                                    <Circle className="w-3 h-3 text-slate-300" />
                                </div>
                            )}
                            {index < FLOW_STEPS.length - 1 && (
                                <div className={`w-px flex-1 my-1 ${completed ? (isLastCompleted ? 'bg-accent' : 'bg-success') : 'bg-slate-200'}`} />
                            )}
                        </div>
                        <div className="pb-6 pt-0.5">
                            <p className={`text-sm font-medium ${completed ? 'text-slate-900' : 'text-slate-400'}`}>
                                {STATUS_LABELS[step]}
                                {isCurrentState && ['pending', 'payment_pending'].includes(status) && (
                                    <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-accent-light text-accent">Active</span>
                                )}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {getTimestamp(step) ?? 'Pending'}
                            </p>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
