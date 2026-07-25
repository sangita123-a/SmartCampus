'use client';

import { useState } from 'react';
import {
  useParentAttendance,
  useParentDashboard,
  useParentFees,
  useParentNotifications,
  useParentStudents,
} from '@/hooks/useParent';
import { ParentDashboardCards } from '@/components/parent/ParentDashboardCards';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { ChildProfileCard } from '@/components/parent/ChildProfileCard';
import { ChildAttendanceView } from '@/components/parent/ChildAttendanceView';
import { ChildFeesView } from '@/components/parent/ChildFeesView';
import { NotificationsList } from '@/components/parent/NotificationsList';

export default function ParentDashboardPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  const { data: cards, isLoading: isCardsLoading } = useParentDashboard();
  const { data: students = [], isLoading: isStudentsLoading } = useParentStudents();

  const currentStudentId = selectedStudentId || students[0]?.id;

  const { data: attendanceData, isLoading: isAttendanceLoading } = useParentAttendance(currentStudentId);
  const { data: feesData, isLoading: isFeesLoading } = useParentFees(currentStudentId);
  const { data: notifData } = useParentNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Parent Dashboard Portal
        </h1>
        <p className="text-xs text-[var(--muted)]">Real-time academic monitoring, attendance tracking, fee statements, and institution circulars.</p>
      </div>

      <ParentDashboardCards data={cards} isLoading={isCardsLoading} />

      <ChildSelector
        students={students}
        selectedStudentId={currentStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <ChildProfileCard
        student={students.find((s) => s.id === currentStudentId) || students[0]}
        isLoading={isStudentsLoading}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChildAttendanceView data={attendanceData} isLoading={isAttendanceLoading} />
        <ChildFeesView data={feesData} isLoading={isFeesLoading} />
      </div>

      <NotificationsList notifications={notifData?.notifications || []} />
    </div>
  );
}
