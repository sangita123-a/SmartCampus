import type { CollegeStatus, SubscriptionPlan } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<CollegeStatus, string> = {
  ACTIVE: 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200',
  INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  SUSPENDED: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
};

const planStyles: Record<SubscriptionPlan, string> = {
  FREE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  BASIC: 'bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  PREMIUM: 'bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
  ENTERPRISE: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
};

export function StatusBadge({ status }: { status: CollegeStatus }) {
  const badgeStyle = statusStyles[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        badgeStyle
      )}
    >
      {status ?? 'INACTIVE'}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const badgeStyle = planStyles[plan] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        badgeStyle
      )}
    >
      {plan ?? 'FREE'}
    </span>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
