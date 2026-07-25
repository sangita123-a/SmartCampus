'use client';

import { ExamDashboardCardsData } from '@/types/exam';
import { Award, CalendarCheck, CheckCircle2, Clock, Percent, AlertTriangle } from 'lucide-react';

interface Props {
  data?: ExamDashboardCardsData;
  isLoading?: boolean;
}

export function ExamDashboardCards({ data, isLoading }: Props) {
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
      title: 'Upcoming Exams',
      value: `${data?.upcomingExams || 0}`,
      subtext: 'Scheduled exam sessions',
      icon: CalendarCheck,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Completed Exams',
      value: `${data?.completedExams || 0}`,
      subtext: 'Conducted examinations',
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Published Results',
      value: `${data?.publishedResults || 0}`,
      subtext: 'Results live on portal',
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Pending Results',
      value: `${data?.pendingResults || 0}`,
      subtext: 'Evaluation in progress',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Overall Pass Rate',
      value: `${data?.passPercentage || 0}%`,
      subtext: 'Passed students ratio',
      icon: Percent,
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-100/60 dark:bg-emerald-950/50',
    },
    {
      title: 'Overall Fail Rate',
      value: `${data?.failPercentage || 0}%`,
      subtext: 'Unsuccessful attempts',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
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
