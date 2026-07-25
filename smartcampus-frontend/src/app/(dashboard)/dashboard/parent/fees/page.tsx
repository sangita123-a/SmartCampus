'use client';

import { useState } from 'react';
import { useParentFees, useParentStudents } from '@/hooks/useParent';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildFeesView } from '@/components/parent/ChildFeesView';

export default function ParentFeesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  const { data: students = [] } = useParentStudents();
  const currentStudentId = selectedStudentId || students[0]?.id;

  const { data: feesData, isLoading } = useParentFees(currentStudentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          {"Child's Fee Dues & Payment Receipts"}
        </h1>
        <p className="text-xs text-[var(--muted)]">Review assigned tuition fee structures, cleared transactions, and print official receipts.</p>
      </div>

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildFeesView data={feesData} isLoading={isLoading} />
    </div>
  );
}
