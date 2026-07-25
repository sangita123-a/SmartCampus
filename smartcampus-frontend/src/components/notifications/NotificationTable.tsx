'use client';

import { NotificationItem } from '@/types/notification';
import { Eye, Trash2, Bell, Users } from 'lucide-react';

interface Props {
  notifications: NotificationItem[];
  isLoading?: boolean;
  onViewDetails: (notification: NotificationItem) => void;
  onDelete: (id: string) => void;
}

export function NotificationTable({ notifications, isLoading, onViewDetails, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'EMERGENCY_ALERT':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      case 'FEE_REMINDER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'EXAM_NOTICE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'CIRCULAR':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-rose-600 font-black';
      case 'HIGH':
        return 'text-amber-600 font-bold';
      case 'MEDIUM':
        return 'text-teal-600 font-semibold';
      default:
        return 'text-[var(--muted)]';
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
          <Bell className="h-5 w-5 text-teal-600" /> Notifications & Circulars Registry
        </h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Title & Creator</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Target Audience</th>
              <th className="px-4 py-3 text-center">Priority</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Reads / Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No notifications created yet. Click Create Notification to dispatch broadcasts.
                </td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--foreground)] leading-snug">{n.title}</p>
                    <span className="text-[11px] text-[var(--muted)]">By: {n.creator?.name || 'Admin'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getTypeBadge(n.notificationType)}`}>
                      {n.notificationType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--foreground)]">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-teal-600" /> {n.targetAudience.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center text-xs ${getPriorityBadge(n.priority)}`}>
                    {n.priority}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        n.status === 'SENT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : n.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                    {n.readCount || 0} / {n.totalRecipients || 0}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => onViewDetails(n)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-3.5 w-3.5 text-teal-600" /> Details
                    </button>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/50 dark:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
