'use client';

import { useState } from 'react';
import { useParentAttendance, useParentStudents } from '@/hooks/useParent';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildAttendanceView } from '@/components/parent/ChildAttendanceView';

export default function ParentAttendancePage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  const { data: students = [] } = useParentStudents();
  const currentStudentId = selectedStudentId || students[0]?.id;

  const { data: attendanceData, isLoading } = useParentAttendance(currentStudentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          {"Child's Real-Time Attendance Monitoring"}
        </h1>
        <p className="text-xs text-[var(--muted)]">Track overall class attendance %, subject-wise ratios, and monthly absence logs.</p>
      </div>

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildAttendanceView data={attendanceData} isLoading={isLoading} />
    </div>
  );
}
