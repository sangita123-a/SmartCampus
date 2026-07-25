'use client';

import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useMyNotifications } from '@/hooks/useNotifications';
import { Bell, CheckCheck, Inbox } from 'lucide-react';

export default function FacultyNotificationsPage() {
  const { data, isLoading } = useMyNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.notifications || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Faculty Notices & Communication Center
          </h1>
          <p className="text-xs text-[var(--muted)]">View institutional circulars, academic notices, exam duties, and official announcements.</p>
        </div>

        {data?.unreadCount && data.unreadCount > 0 ? (
          <button
            onClick={() => markAllAsRead.mutate()}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-teal-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Inbox className="h-10 w-10 text-[var(--muted)] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[var(--muted)]">No active notifications found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.recipientId}
                onClick={() => {
                  if (!n.isRead) markAsRead.mutate(n.notificationId);
                }}
                className={`flex items-start gap-4 rounded-xl border border-[var(--border)] p-4 transition cursor-pointer ${
                  !n.isRead
                    ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900'
                    : 'bg-[var(--background)] hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="rounded-xl p-2.5 bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 shrink-0 mt-0.5">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[var(--foreground)]">{n.title}</h4>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {new Date(n.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
