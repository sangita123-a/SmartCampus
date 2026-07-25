'use client';

import { useState } from 'react';
import { useParentResults, useParentStudents } from '@/hooks/useParent';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildResultsView } from '@/components/parent/ChildResultsView';

export default function ParentResultsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  const { data: students = [] } = useParentStudents();
  const currentStudentId = selectedStudentId || students[0]?.id;

  const { data: resultsData, isLoading } = useParentResults(currentStudentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          {"Child's Examination Results & Marksheets"}
        </h1>
        <p className="text-xs text-[var(--muted)]">Inspect published examination grades, grade points, CGPA ratings, and official marksheets.</p>
      </div>

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildResultsView data={resultsData} isLoading={isLoading} />
    </div>
  );
}
