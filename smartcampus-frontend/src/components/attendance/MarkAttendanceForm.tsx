'use client';

import { useState } from 'react';
import { useBulkMarkAttendance } from '@/hooks/useAttendance';
import { AttendanceMethod, AttendanceStatus, BulkAttendanceItem } from '@/types/attendance';
import { CheckCircle2, XCircle, Save, Loader2 } from 'lucide-react';

interface Props {
  departments: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; name: string; departmentId: string }>;
  semesters: Array<{ id: string; name: string; courseId: string }>;
  subjects: Array<{ id: string; subjectName: string; semesterId: string }>;
  faculty: Array<{ id: string; firstName: string; lastName: string }>;
  students: Array<{ id: string; firstName: string; lastName: string; rollNumber: string; semesterId: string }>;
  onSuccess?: () => void;
}

export function MarkAttendanceForm({
  departments,
  courses,
  semesters,
  subjects,
  faculty,
  students,
  onSuccess,
}: Props) {
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [method] = useState<AttendanceMethod>('MANUAL');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const bulkMutation = useBulkMarkAttendance();

  const filteredCourses = courses.filter((c) => !departmentId || c.departmentId === departmentId);
  const filteredSemesters = semesters.filter((s) => !courseId || s.courseId === courseId);
  const filteredSubjects = subjects.filter((s) => !semesterId || s.semesterId === semesterId);
  const loadedStudents = students.filter((st) => !semesterId || st.semesterId === semesterId);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'PRESENT',
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    loadedStudents.forEach((st) => {
      updated[st.id] = {
        status,
        remarks: attendanceRecords[st.id]?.remarks || '',
      };
    });
    setAttendanceRecords(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId || !courseId || !semesterId || !subjectId || !facultyId || !attendanceDate) {
      alert('Please fill out all class selection fields before submitting.');
      return;
    }

    if (loadedStudents.length === 0) {
      alert('No students found for the selected semester.');
      return;
    }

    const records: BulkAttendanceItem[] = loadedStudents.map((st) => ({
      studentId: st.id,
      attendanceStatus: attendanceRecords[st.id]?.status || 'PRESENT',
      remarks: attendanceRecords[st.id]?.remarks || undefined,
    }));

    bulkMutation.mutate(
      {
        departmentId,
        courseId,
        semesterId,
        subjectId,
        facultyId,
        attendanceDate,
        attendanceMethod: method,
        records,
      },
      {
        onSuccess: (res) => {
          setSubmittedMessage(res.message);
          setTimeout(() => setSubmittedMessage(null), 4000);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Mark Bulk Attendance</h2>
          <p className="text-xs text-[var(--muted)]">Select class metadata to automatically load students and submit status.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll('PRESENT')}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('ABSENT')}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <XCircle className="h-3.5 w-3.5" /> All Absent
          </button>
        </div>
      </div>

      {submittedMessage && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          {submittedMessage}
        </div>
      )}

      {/* Class Selection Dropdowns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Department *</label>
          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setCourseId('');
              setSemesterId('');
              setSubjectId('');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Course *</label>
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setSemesterId('');
              setSubjectId('');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Course</option>
            {filteredCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Semester *</label>
          <select
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              setSubjectId('');
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Semester</option>
            {filteredSemesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Subject *</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map((sb) => (
              <option key={sb.id} value={sb.id}>
                {sb.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Faculty *</label>
          <select
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Faculty</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.firstName} {f.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Date *</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
      </div>

      {/* Loaded Students Table */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            Students Enrolled ({loadedStudents.length})
          </h3>
        </div>

        {loadedStudents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
            Select a semester to load student roster.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Roll Number</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {loadedStudents.map((st) => {
                  const currentStatus = attendanceRecords[st.id]?.status || 'PRESENT';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{st.rollNumber}</td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as AttendanceStatus[]).map((stt) => (
                            <button
                              key={stt}
                              type="button"
                              onClick={() => handleStatusChange(st.id, stt)}
                              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                currentStatus === stt
                                  ? stt === 'PRESENT'
                                    ? 'bg-emerald-600 text-white'
                                    : stt === 'ABSENT'
                                    ? 'bg-rose-600 text-white'
                                    : stt === 'LATE'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-purple-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {stt}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Optional remarks"
                          value={attendanceRecords[st.id]?.remarks || ''}
                          onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                          className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={bulkMutation.isPending || loadedStudents.length === 0}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
        >
          {bulkMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Submit Attendance
        </button>
      </div>
    </form>
  );
}
