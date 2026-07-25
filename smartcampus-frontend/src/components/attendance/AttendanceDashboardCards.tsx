'use client';

import { AttendanceDashboardCards as CardsData } from '@/types/attendance';
import { CalendarCheck, CheckCircle2, XCircle, Clock, UserX, Percent } from 'lucide-react';

interface Props {
  data?: CardsData;
  isLoading?: boolean;
}

export function AttendanceDashboardCards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Today's Total",
      value: data?.todayAttendance ?? 0,
      icon: CalendarCheck,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      title: 'Present',
      value: data?.presentStudents ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      title: 'Absent',
      value: data?.absentStudents ?? 0,
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
    },
    {
      title: 'Late',
      value: data?.lateStudents ?? 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      title: 'On Leave',
      value: data?.leaveStudents ?? 0,
      icon: UserX,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    },
    {
      title: 'Attendance %',
      value: `${data?.attendancePercentage ?? 0}%`,
      icon: Percent,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">{card.title}</span>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
