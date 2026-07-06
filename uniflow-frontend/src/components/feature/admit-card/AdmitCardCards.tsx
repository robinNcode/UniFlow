import { Card } from '@/components/common/Card'
import { Loader2, FileText, Download } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { formatDate } from '@/utils/formatters'
import type { AdmitCardReady } from '@/api/endpoints/admitCard.api'

interface AdmitCardCardProps {
    data: AdmitCardReady
}

export function AdmitCardCard({ data }: AdmitCardCardProps) {
    return (
        <Card padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
                <div className="w-14 h-16 bg-primary-light border border-primary/20 rounded-md flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-slate-900">Roll No. {data.rollNumber}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        Exam Date: {formatDate(data.examDate)} {data.examCenter ? `· ${data.examCenter}` : ''}
                    </p>
                </div>
            </div>

            <a
                href={data.pdfUrl}
                download={`AdmitCard_${data.rollNumber}.pdf`}
                className="shrink-0"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button variant="primary" className="w-full sm:w-auto">
                    <Download className="w-4 h-4" />
                    Download PDF
                </Button>
            </a>
        </Card>
    )
}

export function AdmitCardPendingState() {
    return (
        <Card padding="md">
            <div className="flex items-center gap-3 mb-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="font-semibold">Your admit card is being generated</p>
            </div>
            <p className="text-sm text-slate-500 ml-8">
                This usually takes a few minutes after payment confirmation. The system is assembling your center allocation. Check back shortly.
            </p>
        </Card>
    )
}
