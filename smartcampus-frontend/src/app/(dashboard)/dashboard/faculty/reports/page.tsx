'use client';

import { useState } from 'react';
import { useAttendanceReports, useExamReports } from '@/hooks/useReports';
import { AttendanceAnalyticsSection } from '@/components/reports/AttendanceAnalyticsSection';
import { ExamAnalyticsSection } from '@/components/reports/ExamAnalyticsSection';
import { CalendarCheck, Award } from 'lucide-react';

export default function FacultyReportsPage() {
  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'EXAMS'>('ATTENDANCE');

  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceReports();
  const { data: examData, isLoading: isExamLoading } = useExamReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Faculty Class Analytics & Performance Reports
        </h1>
        <p className="text-xs text-[var(--muted)]">Review class attendance ratios, subject pass percentages, and student marks distribution.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            activeTab === 'ATTENDANCE' ? 'bg-teal-600 text-white shadow-xs' : 'bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarCheck className="h-4 w-4" /> Class Attendance Reports
        </button>
        <button
          onClick={() => setActiveTab('EXAMS')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            activeTab === 'EXAMS' ? 'bg-teal-600 text-white shadow-xs' : 'bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Subject Exam Reports
        </button>
      </div>

      {activeTab === 'ATTENDANCE' && <AttendanceAnalyticsSection data={attendanceData} isLoading={isAttendanceLoading} />}
      {activeTab === 'EXAMS' && <ExamAnalyticsSection data={examData} isLoading={isExamLoading} />}
    </div>
  );
}
