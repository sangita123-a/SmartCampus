'use client';

import { useState } from 'react';
import { useAttendanceDashboard, useAttendanceList } from '@/hooks/useAttendance';
import { AttendanceDashboardCards } from '@/components/attendance/AttendanceDashboardCards';
import { MarkAttendanceForm } from '@/components/attendance/MarkAttendanceForm';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { FacultyAttendanceReportView } from '@/components/attendance/FacultyAttendanceReportView';
import { QRSessionModal } from '@/components/attendance/QRSessionModal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QrCode } from 'lucide-react';

export default function FacultyAttendancePage() {
  const [activeTab, setActiveTab] = useState<'mark' | 'history' | 'summary'>('mark');
  const [page, setPage] = useState(1);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const { data: cards, isLoading: isCardsLoading } = useAttendanceDashboard();
  const { data: attendanceData, isLoading: isListLoading } = useAttendanceList({ page, limit: 10 });

  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: async () => (await api.get('/departments')).data.data });
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: async () => (await api.get('/courses')).data.data });
  const { data: semesters = [] } = useQuery({ queryKey: ['semesters'], queryFn: async () => (await api.get('/semesters')).data.data });
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: async () => (await api.get('/subjects')).data.data });
  const { data: faculty = [] } = useQuery({ queryKey: ['faculty'], queryFn: async () => (await api.get('/faculty')).data.data });
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: async () => (await api.get('/students')).data.data });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Faculty Attendance Portal
          </h1>
          <p className="text-xs text-[var(--muted)]">Mark class attendance for assigned subjects, generate dynamic QR codes, and review class logs.</p>
        </div>

        <button
          onClick={() => setIsQRModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-700"
        >
          <QrCode className="h-4 w-4" /> Generate QR Code Session
        </button>
      </div>

      <AttendanceDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('mark')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'mark' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Mark Class Attendance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'history' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Attendance Log History
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'summary' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Teaching Summary
        </button>
      </div>

      {activeTab === 'mark' && (
        <MarkAttendanceForm
          departments={departments}
          courses={courses}
          semesters={semesters}
          subjects={subjects}
          faculty={faculty}
          students={students}
          onSuccess={() => setActiveTab('history')}
        />
      )}

      {activeTab === 'history' && (
        <AttendanceTable
          records={attendanceData?.data || []}
          total={attendanceData?.meta?.total || 0}
          page={page}
          limit={10}
          onPageChange={setPage}
          onSearchChange={() => {}}
          onStatusFilterChange={() => {}}
          isLoading={isListLoading}
        />
      )}

      {activeTab === 'summary' && <FacultyAttendanceReportView facultyId={faculty[0]?.id} />}

      {isQRModalOpen && (
        <QRSessionModal
          departmentId={departments[0]?.id || ''}
          courseId={courses[0]?.id || ''}
          semesterId={semesters[0]?.id || ''}
          subjectId={subjects[0]?.id || ''}
          facultyId={faculty[0]?.id || ''}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}
    </div>
  );
}
