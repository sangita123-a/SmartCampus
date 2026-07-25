'use client';

import { useState } from 'react';
import {
  useAttendanceReports,
  useExamReports,
  useFacultyReports,
  useFeeReports,
  useLibraryReports,
  useStudentReports,
} from '@/hooks/useReports';
import { ReportFilterBar } from '@/components/reports/ReportFilterBar';
import { StudentAnalyticsSection } from '@/components/reports/StudentAnalyticsSection';
import { FacultyAnalyticsSection } from '@/components/reports/FacultyAnalyticsSection';
import { AttendanceAnalyticsSection } from '@/components/reports/AttendanceAnalyticsSection';
import { FeeAnalyticsSection } from '@/components/reports/FeeAnalyticsSection';
import { ExamAnalyticsSection } from '@/components/reports/ExamAnalyticsSection';
import { LibraryAnalyticsSection } from '@/components/reports/LibraryAnalyticsSection';
import { LayoutDashboard, Users, UserCheck, CalendarCheck, Wallet, Award, Library } from 'lucide-react';

export default function CollegeAdminReportsPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STUDENTS' | 'FACULTY' | 'ATTENDANCE' | 'FEES' | 'EXAMS' | 'LIBRARY'>('OVERVIEW');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');

  const filterParams = {
    departmentId: departmentId || undefined,
    courseId: courseId || undefined,
  };

  const { data: studentData, isLoading: isStudentLoading } = useStudentReports(filterParams);
  const { data: facultyData, isLoading: isFacultyLoading } = useFacultyReports(filterParams);
  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceReports(filterParams);
  const { data: feeData, isLoading: isFeeLoading } = useFeeReports(filterParams);
  const { data: examData, isLoading: isExamLoading } = useExamReports(filterParams);
  const { data: libraryData, isLoading: isLibraryLoading } = useLibraryReports();

  const tabs = [
    { id: 'OVERVIEW', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'STUDENTS', label: 'Student Reports', icon: Users },
    { id: 'FACULTY', label: 'Faculty Reports', icon: UserCheck },
    { id: 'ATTENDANCE', label: 'Attendance Reports', icon: CalendarCheck },
    { id: 'FEES', label: 'Fee & Revenue Reports', icon: Wallet },
    { id: 'EXAMS', label: 'Exam & CGPA Reports', icon: Award },
    { id: 'LIBRARY', label: 'Library Reports', icon: Library },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Reports & Analytics Hub
        </h1>
        <p className="text-xs text-[var(--muted)]">Real-time analytical metrics, interactive charts, and exportable statements powered by live database query engines.</p>
      </div>

      <ReportFilterBar
        departmentId={departmentId}
        courseId={courseId}
        onDepartmentChange={setDepartmentId}
        onCourseChange={setCourseId}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--border)] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <StudentAnalyticsSection data={studentData} isLoading={isStudentLoading} />
          <AttendanceAnalyticsSection data={attendanceData} isLoading={isAttendanceLoading} />
        </div>
      )}

      {activeTab === 'STUDENTS' && <StudentAnalyticsSection data={studentData} isLoading={isStudentLoading} />}
      {activeTab === 'FACULTY' && <FacultyAnalyticsSection data={facultyData} isLoading={isFacultyLoading} />}
      {activeTab === 'ATTENDANCE' && <AttendanceAnalyticsSection data={attendanceData} isLoading={isAttendanceLoading} />}
      {activeTab === 'FEES' && <FeeAnalyticsSection data={feeData} isLoading={isFeeLoading} />}
      {activeTab === 'EXAMS' && <ExamAnalyticsSection data={examData} isLoading={isExamLoading} />}
      {activeTab === 'LIBRARY' && <LibraryAnalyticsSection data={libraryData} isLoading={isLibraryLoading} />}
    </div>
  );
}
