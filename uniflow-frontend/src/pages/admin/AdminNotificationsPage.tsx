import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Send, Bell } from 'lucide-react';

/**
 * AdminNotificationsPage
 * Compose and broadcast notifications to students.
 */
export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Broadcast Notification</h1>
        <p className="text-slate-500 text-sm mt-1">Send alerts to specific cohorts or all students.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary" />
            Compose Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Connect to backend for actual broadcasting */}
          <Input 
            label="Subject" 
            placeholder="e.g. Merit List Published" 
          />
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Message</label>
            <textarea 
              className="flex w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
              rows={5}
              placeholder="Enter your message here..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button leftIcon={<Send className="w-4 h-4" />}>
              Send Broadcast
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
