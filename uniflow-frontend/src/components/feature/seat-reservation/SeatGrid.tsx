
interface SeatGridProps {
    totalSeats: number
    filledSeats: number
    mySeatIndex?: number
    className?: string
}

export function SeatGrid({ totalSeats = 60, filledSeats = 0, mySeatIndex = -1, className = '' }: SeatGridProps) {
    const seats = Array.from({ length: totalSeats }, (_, i) => i)

    return (
        <div className={className}>
            <div className="grid grid-cols-10 gap-1.5 mb-4">
                {seats.map((i) => {
                    let cls = 'bg-slate-200' // Available
                    if (i === mySeatIndex) cls = 'bg-accent' // My seat
                    else if (i < filledSeats) cls = 'bg-primary' // Filled by others

                    return (
                        <div
                            key={i}
                            className={`aspect-square rounded-sm ${cls}`}
                            aria-hidden
                        />
                    )
                })}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Filled
                </span>
                {mySeatIndex >= 0 && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> Your seat
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" /> Available
                </span>
            </p>
        </div>
    )
}
