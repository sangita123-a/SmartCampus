'use client';

import { useState } from 'react';
import { useParentStudents, useParentTimetable } from '@/hooks/useParent';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildTimetableGrid } from '@/components/parent/ChildTimetableGrid';

export default function ParentTimetablePage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  const { data: students = [] } = useParentStudents();
  const currentStudentId = selectedStudentId || students[0]?.id;

  const { data: timetableData, isLoading } = useParentTimetable(currentStudentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          {"Child's Class Schedule & Exam Timetable"}
        </h1>
        <p className="text-xs text-[var(--muted)]">View weekly lecture schedules, assigned faculty, classroom locations, and upcoming exam dates.</p>
      </div>

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildTimetableGrid
        timetable={timetableData?.timetable || []}
        upcomingExams={timetableData?.upcomingExams || []}
        isLoading={isLoading}
      />
    </div>
  );
}
