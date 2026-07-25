'use client';

import { ParentNotification } from '@/types/parent';
import { Bell, Wallet, Calendar, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  notifications: ParentNotification[];
  isLoading?: boolean;
}

export function NotificationsList({ notifications, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'FEE_REMINDER':
        return { icon: Wallet, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' };
      case 'EXAM_UPDATE':
        return { icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' };
      case 'ATTENDANCE_ALERT':
        return { icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' };
      default:
        return { icon: FileText, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40' };
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
        <Bell className="h-5 w-5 text-teal-600" /> Institution Notices, Circulars & Alerts
      </h3>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-[var(--muted)]">No active notifications or alerts.</p>
        ) : (
          notifications.map((n) => {
            const config = getNotifIcon(n.type);
            const Icon = config.icon;

            return (
              <div
                key={n.id}
                className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <div className={`rounded-xl p-2.5 ${config.bg} ${config.color} shrink-0 mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[var(--foreground)]">{n.title}</h4>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {new Date(n.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
