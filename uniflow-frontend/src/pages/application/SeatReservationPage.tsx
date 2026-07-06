import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { SeatGrid } from '@/components/feature/seat-reservation/SeatGrid'
import { CountdownTimer } from '@/components/common/CountdownTimer'
import { useCountdown } from '@/hooks/useCountdown'

export function SeatReservationPage() {
    const navigate = useNavigate()

    // Prototype mock data — in a real app this would come from useQuery
    // and handle the QUOTA_EXHAUSTED union state from seatReservationApi.
    const [mockReservation] = useState({
        expiresAt: new Date(Date.now() + 14 * 60000 + 59000).toISOString(),
        quotaType: 'General',
        program: 'CSE, University of Dhaka',
        totalSeats: 60,
        filledSeats: 46,
        mySeatIndex: 46,
    })

    // We invoke the countdown hook here to know exactly when to disable the button,
    // matching the requirement §6.2 to immediately disable on client expiry.
    const { isExpired } = useCountdown(mockReservation.expiresAt)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Seat Reservation</h1>

            <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-sm">{mockReservation.quotaType} Quota — {mockReservation.program}</p>
                </div>

                <SeatGrid
                    totalSeats={mockReservation.totalSeats}
                    filledSeats={mockReservation.filledSeats}
                    mySeatIndex={mockReservation.mySeatIndex}
                />

                <div className="bg-accent-light border border-accent/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                    <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                            Reservation expires in
                        </p>
                        <CountdownTimer expiresAt={mockReservation.expiresAt} />
                    </div>
                    <Button
                        variant="accent"
                        disabled={isExpired}
                        onClick={() => navigate('/payment')}
                        className="shrink-0"
                    >
                        Proceed to Payment
                    </Button>
                </div>

                {isExpired && (
                    <div className="mt-4 bg-danger-light border border-danger/20 rounded-lg p-4 animate-in fade-in zoom-in duration-300">
                        <p className="text-sm font-semibold text-danger">Reservation expired — seat released</p>
                        <p className="text-xs text-danger/80 mt-1">
                            Your held seat has returned to the available pool. You may attempt to reserve again if seats remain.
                        </p>
                        <Button variant="danger" size="sm" className="mt-3">
                            Try Reserving Again
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}
