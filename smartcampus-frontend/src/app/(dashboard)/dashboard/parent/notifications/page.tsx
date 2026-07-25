'use client';

import { useParentNotifications } from '@/hooks/useParent';
import { NotificationsList } from '@/components/parent/NotificationsList';

export default function ParentNotificationsPage() {
  const { data, isLoading } = useParentNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Notifications & Institution Circulars
        </h1>
        <p className="text-xs text-[var(--muted)]">Stay informed with real-time fee reminders, attendance alerts, exam schedules, and holiday announcements.</p>
      </div>

      <NotificationsList notifications={data?.notifications || []} isLoading={isLoading} />
    </div>
  );
}
