import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useNavigate } from 'react-router-dom'

export function StudentDashboardPage() {
    const { student } = useAuth()
    const navigate = useNavigate()

    // In a real app we'd fetch this from /applications/my
    // Hardcoding mock state to match the prototype design visually.

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {student?.fullName.split(' ')[0]}</h1>
                <p className="text-slate-500 text-sm mt-1">Dhaka University — Combined Admission Cycle 2026</p>
            </div>

            {/* Urgent Action Banner */}
            <div className="bg-primary rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="font-semibold text-lg">Your seat hold expires soon</p>
                    <p className="text-sm text-white/80 mt-1">
                        Complete payment to confirm your seat under the General quota.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    className="shrink-0 text-primary border-none shadow-sm hover:bg-slate-50"
                    onClick={() => navigate('/payment')}
                >
                    Proceed to Payment
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid sm:grid-cols-3 gap-4">
                <Card padding="sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Application Status</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-semibold text-sm">Seat Reserved</span>
                    </div>
                </Card>

                <Card padding="sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Merit Rank</p>
                    <p className="mt-2 text-sm font-semibold">
                        #212 <span className="text-slate-400 font-normal">of 4,820 · General</span>
                    </p>
                </Card>

                <Card padding="sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Admission Window</p>
                    <p className="mt-2 text-sm font-semibold">Closes in 2 days 6 hours</p>
                </Card>
            </div>

            {/* Notifications */}
            <Card padding="md">
                <h2 className="font-semibold text-sm mb-4">Recent Notifications</h2>
                <ul className="divide-y divide-slate-100 text-sm">
                    <li className="py-3 flex sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <span>Seat reservation confirmed for CSE — General quota</span>
                        <span className="text-slate-400 text-xs shrink-0 tabular-nums">2m ago</span>
                    </li>
                    <li className="py-3 flex sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <span>Application submitted successfully</span>
                        <span className="text-slate-400 text-xs shrink-0 tabular-nums">1h ago</span>
                    </li>
                    <li className="py-3 flex sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <span>Merit list published for Combined Admission Cycle 2026</span>
                        <span className="text-slate-400 text-xs shrink-0 tabular-nums">1d ago</span>
                    </li>
                </ul>
            </Card>
        </div>
    )
}
