/**
 * AdminSeatQuotasPage
 * Manage seat quotas across programs.
 */
export default function AdminSeatQuotasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Seat Quotas</h1>
      <p className="text-slate-500">Configure and monitor quota allocations.</p>
      
      {/* TODO: connect endpoint with backend */}
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Quota management will be implemented here.</p>
      </div>
    </div>
  );
}
