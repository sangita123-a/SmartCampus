import type { AcademicStatus, CourseType } from '@/types';

import { cn } from '@/utils/cn';



const statusStyles: Record<AcademicStatus, string> = {

  ACTIVE: 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200',

  INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',

};



export function AcademicStatusBadge({ status }: { status: AcademicStatus }) {

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



export function CourseTypeBadge({ type }: { type: CourseType }) {

  return (

    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-200">

      {type.replaceAll('_', ' ')}

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



export function toDateInputValue(value: string | null | undefined): string {

  if (!value) return '';

  return value.slice(0, 10);

}

