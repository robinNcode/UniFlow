import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/common/Card';
import { FileText, GraduationCap, CreditCard } from 'lucide-react';

/**
 * AdminDashboardPage
 * High-level overview of admission metrics.
 */
export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const STATS = [
    { label: 'Total Applications', value: '12,450', icon: FileText, color: 'text-blue-500' },
    { label: 'Payments Verified', value: '8,210', icon: CreditCard, color: 'text-emerald-500' },
    { label: 'Seats Reserved', value: '450', icon: GraduationCap, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.fullName}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} padding="md" className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
