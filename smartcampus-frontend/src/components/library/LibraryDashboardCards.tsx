'use client';

import { LibraryDashboardCardsData } from '@/types/library';
import { BookOpen, CheckCircle, Clock, AlertTriangle, BookmarkCheck, DollarSign } from 'lucide-react';

interface Props {
  data?: LibraryDashboardCardsData;
  isLoading?: boolean;
}

export function LibraryDashboardCards({ data, isLoading }: Props) {
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
      title: 'Total Titles in Catalog',
      value: `${data?.totalBooks || 0}`,
      subtext: 'Distinct titles registered',
      icon: BookOpen,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Available Copies',
      value: `${data?.availableBooks || 0}`,
      subtext: 'On-shelf available copies',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Currently Issued Books',
      value: `${data?.issuedBooks || 0}`,
      subtext: 'Active borrowings',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Reserved Books',
      value: `${data?.reservedBooks || 0}`,
      subtext: 'Pending reservations',
      icon: BookmarkCheck,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Overdue Borrowings',
      value: `${data?.overdueBooks || 0}`,
      subtext: 'Past due return date',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Fine Collected',
      value: `₹${(data?.fineCollected || 0).toLocaleString()}`,
      subtext: 'Cumulative overdue fines',
      icon: DollarSign,
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
