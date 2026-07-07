import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { notificationApi } from '@/api/endpoints/notification.api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SkeletonCard } from '@/components/common/Skeleton';
import { Bell, Mail, MessageSquare, CheckCheck } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatters';
import Button from '@/components/common/Button';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {t('nav.notifications')}
          </h1>
          {unreadCount > 0 && (
            <p className="text-text-secondary text-sm mt-1">{unreadCount} unread</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : !notifications?.length ? (
        <Card className="text-center py-12">
          <Bell className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={!notif.read ? 'border-primary/20 bg-primary/[0.02]' : ''}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'sms' ? 'bg-info-light' : 'bg-accent-light'
                }`}>
                  {notif.type === 'sms'
                    ? <MessageSquare className="h-5 w-5 text-info" />
                    : <Mail className="h-5 w-5 text-accent" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-text-primary">{notif.subject}</p>
                    {!notif.read && <Badge variant="info">New</Badge>}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                  <p className="text-xs text-text-muted mt-2">{formatRelativeTime(notif.sentAt)}</p>
                </div>
                {!notif.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markReadMutation.mutate(notif.id)}
                    leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
