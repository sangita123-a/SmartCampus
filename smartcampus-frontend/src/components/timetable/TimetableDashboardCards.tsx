'use client';

import { TimetableDashboardCards as CardsData } from '@/types/timetable';
import { CalendarDays, Clock, Building, CheckCircle2, UserCheck } from 'lucide-react';

interface Props {
  data?: CardsData;
  isLoading?: boolean;
}

export function TimetableDashboardCards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Today's Scheduled Classes",
      value: data?.todayClasses ?? 0,
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
    {
      title: 'Weekly Total Classes',
      value: data?.weeklyClasses ?? 0,
      icon: CalendarDays,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400',
    },
    {
      title: 'Available Classrooms',
      value: data?.availableClassrooms ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      title: 'Occupied Classrooms',
      value: data?.occupiedClassrooms ?? 0,
      icon: Building,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      title: 'Faculty Assigned',
      value: data?.totalFacultyAssigned ?? 0,
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
