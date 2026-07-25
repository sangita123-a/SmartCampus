import type { FacultyStatus } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<FacultyStatus, string> = {
  ACTIVE: 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200',
  INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  ON_LEAVE: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  TERMINATED: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200',
};

export function FacultyStatusBadge({ status }: { status: FacultyStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        statusStyles[status]
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export {
  StudentAvatar as FacultyAvatar,
  formatDate,
  toDateInputValue,
  fullName,
} from '@/components/students/StudentBadges';
