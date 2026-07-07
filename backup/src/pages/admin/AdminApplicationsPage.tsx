/**
 * AdminApplicationsPage
 * List and manage student applications.
 */
export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
      <p className="text-slate-500">View and manage all student applications.</p>
      
      {/* TODO: connect endpoint with backend and implement data table */}
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Application management table will be implemented here.</p>
      </div>
    </div>
  );
}
