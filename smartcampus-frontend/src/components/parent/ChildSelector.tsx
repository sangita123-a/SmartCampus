'use client';

import { LinkedStudent } from '@/types/parent';
import { User } from 'lucide-react';

interface Props {
  students: LinkedStudent[];
  selectedStudentId?: string;
  onSelectStudent: (studentId: string) => void;
}

export function ChildSelector({ students, selectedStudentId, onSelectStudent }: Props) {
  if (students.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xs">
      <span className="text-xs font-bold text-[var(--muted)] px-2">Child Switcher:</span>
      <div className="flex items-center gap-2">
        {students.map((st) => {
          const isSelected = st.id === selectedStudentId || (!selectedStudentId && students[0]?.id === st.id);
          return (
            <button
              key={st.id}
              onClick={() => onSelectStudent(st.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              {st.firstName} {st.lastName} ({st.rollNumber})
            </button>
          );
        })}
      </div>
    </div>
  );
}
