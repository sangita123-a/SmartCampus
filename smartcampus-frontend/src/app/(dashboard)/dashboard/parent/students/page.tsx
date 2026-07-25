'use client';

import { useState } from 'react';
import { useParentStudents } from '@/hooks/useParent';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildProfileCard } from '@/components/parent/ChildProfileCard';

export default function ParentStudentsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const { data: students = [], isLoading } = useParentStudents();

  const currentStudentId = selectedStudentId || students[0]?.id;
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          My Linked Children & Enrolled Profiles
        </h1>
        <p className="text-xs text-[var(--muted)]">View detailed profiles, roll numbers, department details, and guardian contacts for your linked children.</p>
      </div>

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildProfileCard student={currentStudent} isLoading={isLoading} />
    </div>
  );
}
