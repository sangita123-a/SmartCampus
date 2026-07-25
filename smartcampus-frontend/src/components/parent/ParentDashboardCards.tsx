'use client';

import { ParentDashboardData } from '@/types/parent';
import { Users, CalendarCheck, Wallet, Calendar, Bell } from 'lucide-react';

interface Props {
  data?: ParentDashboardData;
  isLoading?: boolean;
}

export function ParentDashboardCards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Enrolled Children',
      value: `${data?.totalChildren || 0}`,
      subtext: 'Linked student profiles',
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Overall Attendance Rate',
      value: `${data?.overallAttendance || 0}%`,
      subtext: 'Classes attended ratio',
      icon: CalendarCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Outstanding Fee Balance',
      value: `₹${(data?.pendingFees || 0).toLocaleString()}`,
      subtext: 'Pending tuition & dues',
      icon: Wallet,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Upcoming Examinations',
      value: `${data?.upcomingExams || 0}`,
      subtext: 'Scheduled exam sessions',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Unread Alerts & Notices',
      value: `${data?.unreadNotifications || 0}`,
      subtext: 'Fee reminders & circulars',
      icon: Bell,
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
