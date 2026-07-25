'use client';

import { LinkedStudent } from '@/types/parent';
import { Phone, Mail, Building, BookOpen, Calendar } from 'lucide-react';

interface Props {
  student?: LinkedStudent;
  isLoading?: boolean;
}

export function ChildProfileCard({ student, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!student) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-black text-xl border-2 border-teal-500">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              {student.firstName} {student.lastName}
            </h2>
            <p className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">
              Roll No: {student.rollNumber} • Reg No: {student.registrationNumber || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ACTIVE ENROLLED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2">
          <Building className="h-4 w-4 text-[var(--muted)] mt-0.5" />
          <div>
            <span className="text-[10px] text-[var(--muted)] block">Department</span>
            <span className="font-semibold text-[var(--foreground)]">{student.department?.name || '-'}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-[var(--muted)] mt-0.5" />
          <div>
            <span className="text-[10px] text-[var(--muted)] block">Course & Semester</span>
            <span className="font-semibold text-[var(--foreground)]">
              {student.course?.name || '-'} ({student.semester?.name || '-'})
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-[var(--muted)] mt-0.5" />
          <div>
            <span className="text-[10px] text-[var(--muted)] block">Admission Date</span>
            <span className="font-mono font-semibold text-[var(--foreground)]">
              {new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          <span>Student Email: {student.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          <span>Student Phone: {student.phone || '-'}</span>
        </div>
      </div>
    </div>
  );
}
