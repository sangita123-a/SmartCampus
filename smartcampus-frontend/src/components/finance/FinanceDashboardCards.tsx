'use client';

import { FinanceDashboardCardsData } from '@/types/finance';
import { DollarSign, TrendingUp, AlertTriangle, Clock, Users, CheckCircle2 } from 'lucide-react';

interface Props {
  data?: FinanceDashboardCardsData;
  isLoading?: boolean;
}

export function FinanceDashboardCards({ data, isLoading }: Props) {
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
      title: "Today's Collection",
      value: `₹${(data?.todayCollection || 0).toLocaleString('en-IN')}`,
      subtext: 'Payments collected today',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(data?.monthlyCollection || 0).toLocaleString('en-IN')}`,
      subtext: 'Current month total',
      icon: TrendingUp,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Total Revenue',
      value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: 'Cumulative collection',
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Pending Fees',
      value: `₹${(data?.pendingFees || 0).toLocaleString('en-IN')}`,
      subtext: 'Outstanding balance',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Overdue Fees',
      value: `₹${(data?.overdueFees || 0).toLocaleString('en-IN')}`,
      subtext: 'Past due date',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Students with Dues',
      value: `${data?.studentsWithPendingFees || 0}`,
      subtext: 'Students owing fees',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
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
