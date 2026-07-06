import { useState } from 'react'

import { Button } from '@/components/common/Button'
import { AdmitCardCard, AdmitCardPendingState } from '@/components/feature/admit-card/AdmitCardCards'

export function AdmitCardPage() {
    // Prototype simulation states
    const [isReady, setIsReady] = useState(false)

    const readyData = {
        status: 'ready' as const,
        pdfUrl: '#',
        rollNumber: 'DU-CSE-2026-04421',
        examDate: '2026-08-01T00:00:00Z',
        examCenter: 'Kazi Nazrul Islam Hall',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admit Card</h1>
                {!isReady && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsReady(true)}
                        className="text-primary underline"
                    >
                        Simulate: Mark Ready
                    </Button>
                )}
            </div>

            {isReady ? (
                <AdmitCardCard data={readyData} />
            ) : (
                <AdmitCardPendingState />
            )}
        </div>
    )
}
