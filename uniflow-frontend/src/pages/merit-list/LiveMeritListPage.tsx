import { useState, useEffect } from 'react'
import { MeritTable } from '@/components/feature/merit-list/MeritTable'
import type { MeritListEntry } from '@/api/types/meritList.types'

const MOCK_DATA: MeritListEntry[] = [
    { rank: 209, studentId: '1', studentName: 'Tania Islam', meritScore: 89.4, status: 'confirmed' },
    { rank: 210, studentId: '2', studentName: 'Mehedi Hasan', meritScore: 89.2, status: 'seat_reserved' },
    { rank: 211, studentId: '3', studentName: 'Fatema Akter', meritScore: 89.1, status: 'confirmed' },
    { rank: 212, studentId: '4', studentName: 'Rahim Uddin', meritScore: 88.9, status: 'seat_reserved', isCurrentStudent: true },
    { rank: 213, studentId: '5', studentName: 'Sabbir Ahmed', meritScore: 88.7, status: 'pending' },
    { rank: 214, studentId: '6', studentName: 'Nusrat Jahan', meritScore: 88.5, status: 'pending' },
    // Duplicate a lot of rows to test virtualization
    ...Array.from({ length: 400 }).map((_, i) => ({
        rank: 215 + i,
        studentId: `s_${i}`,
        studentName: `Candidate ${i}`,
        meritScore: 88.4 - (i * 0.01),
        status: 'pending' as const,
    }))
]

export function LiveMeritListPage() {
    const [activeQuota, setActiveQuota] = useState('general')
    const [secondsAgo, setSecondsAgo] = useState(0)

    // Simulation of the "Updated Xs ago" ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsAgo(s => s >= 12 ? 0 : s + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">Live Merit List</h1>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-surface px-3 py-1.5 rounded-full border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
                    <span>Live · updated {secondsAgo}s ago</span>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {(['general', 'freedom_fighter', 'tribal', 'district_quota'] as const).map(q => (
                    <button
                        key={q}
                        onClick={() => setActiveQuota(q)}
                        className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition whitespace-nowrap ${activeQuota === q
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {q.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            <MeritTable data={MOCK_DATA} isLoading={false} />
        </div>
    )
}
