import type { StudentStatus } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<StudentStatus, string> = {
  ACTIVE: 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200',
  INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  GRADUATED: 'bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  SUSPENDED: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

export function StudentAvatar({
  src,
  name,
  size = 'md',
}: {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-10 w-10 text-sm';

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeClass)}
      />
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200',
        sizeClass
      )}
    >
      {initials || '?'}
    </div>
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

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}
