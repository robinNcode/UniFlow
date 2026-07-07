import LiveMeritListPage from '@/pages/merit-list/LiveMeritListPage';
import Button from '@/components/common/Button';
import { RefreshCw, UploadCloud } from 'lucide-react';
import Card, { CardContent } from '@/components/common/Card';

/**
 * AdminMeritListPage
 * Reuses the student-facing live merit list, but adds
 * admin-specific controls for recalculating and publishing.
 */
export default function AdminMeritListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merit List Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review rankings and publish to students.</p>
        </div>
        <div className="flex gap-2">
          {/* TODO: connect with backend endpoints for recalculate/publish */}
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Recalculate
          </Button>
          <Button leftIcon={<UploadCloud className="w-4 h-4" />}>
            Publish List
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Reusing the exact same underlying component for the list */}
          <LiveMeritListPage />
        </CardContent>
      </Card>
    </div>
  );
}
