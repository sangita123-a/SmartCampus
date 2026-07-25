'use client';

import { useState } from 'react';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useMyNotifications } from '@/hooks/useNotifications';
import { Bell, CheckCheck, X, Inbox } from 'lucide-react';

export function NotificationBellDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useMyNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 font-mono text-[10px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-teal-600" />
              <h4 className="font-bold text-sm text-[var(--foreground)] font-[family-name:var(--font-display)]">
                Notifications Inbox
              </h4>
              {unreadCount > 0 && (
                <span className="rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  title="Mark all as read"
                  className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:underline px-1.5 py-0.5 rounded"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Read All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-rose-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)] pr-1">
            {isLoading ? (
              <p className="p-6 text-center text-xs text-[var(--muted)] animate-pulse">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Inbox className="h-8 w-8 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-xs text-[var(--muted)]">Your notification inbox is clean!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.recipientId}
                  onClick={() => {
                    if (!n.isRead) markAsRead.mutate(n.notificationId);
                  }}
                  className={`p-3 text-xs space-y-1 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !n.isRead ? 'bg-teal-50/40 dark:bg-teal-950/20 font-medium' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-[var(--foreground)]">{n.title}</h5>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-teal-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] font-mono text-[var(--muted)] block pt-0.5">
                    {new Date(n.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
