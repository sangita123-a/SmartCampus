'use client';

import { useState } from 'react';
import {
  useCreateNotification,
  useDeleteNotification,
  useNotificationDashboard,
  useNotifications,
} from '@/hooks/useNotifications';
import { NotificationDashboardCards } from '@/components/notifications/NotificationDashboardCards';
import { NotificationTable } from '@/components/notifications/NotificationTable';
import { CreateNotificationModal } from '@/components/notifications/CreateNotificationModal';
import { NotificationDetailsModal } from '@/components/notifications/NotificationDetailsModal';
import { CreateNotificationPayload, NotificationItem, NotificationType } from '@/types/notification';
import { Plus, Search, Filter } from 'lucide-react';

export default function CollegeAdminNotificationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page] = useState(1);

  const { data: metrics, isLoading: isMetricsLoading } = useNotificationDashboard();
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotifications({
    page,
    limit: 10,
    search: search || undefined,
    notificationType: (typeFilter as NotificationType) || undefined,
  });

  const createNotification = useCreateNotification();
  const deleteNotification = useDeleteNotification();

  const handleCreate = async (payload: CreateNotificationPayload) => {
    await createNotification.mutateAsync(payload);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notification broadcast?')) {
      deleteNotification.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Notifications & Communication Center
          </h1>
          <p className="text-xs text-[var(--muted)]">Broadcast announcements, official circulars, fee reminders, exam schedules, and emergency alerts.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition"
        >
          <Plus className="h-4 w-4" /> Create Broadcast
        </button>
      </div>

      <NotificationDashboardCards data={metrics} isLoading={isMetricsLoading} />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notification titles or message content..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[var(--muted)]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
          >
            <option value="">All Types</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="CIRCULAR">Circular</option>
            <option value="FEE_REMINDER">Fee Reminder</option>
            <option value="ATTENDANCE_ALERT">Attendance Alert</option>
            <option value="EXAM_NOTICE">Exam Notice</option>
            <option value="HOLIDAY_NOTICE">Holiday Notice</option>
            <option value="EMERGENCY_ALERT">Emergency Alert</option>
          </select>
        </div>
      </div>

      <NotificationTable
        notifications={notificationsData?.data || []}
        isLoading={isNotificationsLoading}
        onViewDetails={setSelectedNotification}
        onDelete={handleDelete}
      />

      <CreateNotificationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createNotification.isPending}
      />

      <NotificationDetailsModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
}
