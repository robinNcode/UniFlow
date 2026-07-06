import { CreditCard } from 'lucide-react';
import Card from '@/components/common/Card';

/**
 * AdminPaymentsPage
 * Verification queue for student payments. Reuses payment types.
 */
export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Verification Queue</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve manual payments.</p>
        </div>
      </div>

      <Card className="p-6">
        {/* TODO: Connect to backend endpoints using PaymentStatus types */}
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No pending payments require verification.</p>
        </div>
      </Card>
    </div>
  );
}
