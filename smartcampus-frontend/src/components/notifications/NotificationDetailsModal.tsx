'use client';

import { NotificationItem } from '@/types/notification';
import { Bell, Users, X } from 'lucide-react';

interface Props {
  notification: NotificationItem | null;
  onClose: () => void;
}

export function NotificationDetailsModal({ notification, onClose }: Props) {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-600" /> Broadcast Details & Audit Log
          </h3>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-rose-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Title</span>
            <h4 className="text-lg font-bold text-[var(--foreground)] mt-0.5">{notification.title}</h4>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <div>
              <span className="text-[10px] text-[var(--muted)] block">Type & Priority</span>
              <span className="font-bold text-[var(--foreground)]">
                {notification.notificationType} ({notification.priority})
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--muted)] block">Target Audience</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {notification.targetAudience}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <div>
              <span className="text-[10px] text-[var(--muted)] block">Dispatched Date</span>
              <span className="font-mono">
                {notification.sentAt
                  ? new Date(notification.sentAt).toLocaleString('en-IN')
                  : 'Pending Schedule'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--muted)] block">Read Count Ratio</span>
              <span className="font-mono font-bold text-emerald-600">
                {notification.readCount || 0} / {notification.totalRecipients || 0} Recipients Read
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider block mb-1">
              Message Content
            </span>
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-wrap font-sans">
              {notification.message}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
