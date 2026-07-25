'use client';

import { NotificationDashboardData } from '@/types/notification';
import { Bell, Clock, Send, AlertTriangle, CheckCircle2, Inbox } from 'lucide-react';

interface Props {
  data?: NotificationDashboardData;
  isLoading?: boolean;
}

export function NotificationDashboardCards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Broadcasts',
      value: `${data?.totalNotifications || 0}`,
      subtext: 'Created notifications & circulars',
      icon: Bell,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Unread Notifications',
      value: `${data?.unreadNotifications || 0}`,
      subtext: 'Pending recipient views',
      icon: Inbox,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Scheduled Notifications',
      value: `${data?.scheduledNotifications || 0}`,
      subtext: 'Queued future dispatches',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Dispatched Today',
      value: `${data?.sentToday || 0}`,
      subtext: 'Broadcasts sent today',
      icon: Send,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Failed Deliveries',
      value: `${data?.failedDeliveries || 0}`,
      subtext: 'Undelivered channel errors',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Read Engagement %',
      value: `${data?.readPercentage || 0}%`,
      subtext: 'Recipient read ratio',
      icon: CheckCircle2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs transition hover:shadow-md"
          >
            <div>
              <span className="text-xs font-semibold text-[var(--muted)]">{card.title}</span>
              <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{card.value}</h3>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">{card.subtext}</p>
            </div>
            <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
