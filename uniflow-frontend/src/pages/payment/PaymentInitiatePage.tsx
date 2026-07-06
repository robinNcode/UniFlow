import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { CheckCircle2, Loader2 } from 'lucide-react'

type Provider = 'bkash' | 'nagad' | 'rocket'

export function PaymentInitiatePage() {
    const [provider, setProvider] = useState<Provider>('bkash')
    const [isPolling, setIsPolling] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Simulation of the payment flow as specified in the prototype
    const handleInitiate = () => {
        setIsPolling(true)

        // Simulate polling finishing after 3 seconds
        setTimeout(() => {
            setIsPolling(false)
            setIsSuccess(true)
        }, 3000)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Payment</h1>

            <Card padding="md" className="space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Admission Fee</span>
                    <span className="font-bold text-lg tabular-nums">৳ 2,450.00</span>
                </div>

                {!isPolling && !isSuccess && (
                    <div>
                        <p className="text-sm font-semibold mb-3">Select payment method</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {(['bkash', 'nagad', 'rocket'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setProvider(p)}
                                    className={`border-2 rounded-lg py-4 text-xs font-semibold uppercase tracking-wide transition ${provider === p
                                        ? 'border-primary bg-primary-light text-primary'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-surface'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <Button fullWidth size="lg" onClick={handleInitiate}>
                            Pay ৳ 2,450.00
                        </Button>
                    </div>
                )}

                {isPolling && (
                    <div className="bg-canvas border border-slate-200 rounded-lg p-5 flex items-center gap-4 animate-in fade-in">
                        <Loader2 className="w-6 h-6 animate-spin text-primary shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Verifying your payment…</p>
                            <p className="text-xs text-slate-500 mt-1">This can take up to a minute. Do not close this page.</p>
                        </div>
                    </div>
                )}

                {isSuccess && (
                    <div className="bg-success-light border border-success/30 rounded-lg p-5 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-success capitalize">Payment Verified</p>
                            <p className="text-xs text-success/80 mt-1 font-medium">
                                Your admission is now confirmed. Your admit card is being generated.
                            </p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
