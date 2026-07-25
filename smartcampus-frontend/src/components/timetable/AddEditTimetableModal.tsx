'use client';

import { useState } from 'react';
import { useCreateTimetable, useUpdateTimetable } from '@/hooks/useTimetable';
import { DayOfWeek, TimetableSlot } from '@/types/timetable';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  slotToEdit?: TimetableSlot | null;
  departments: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; name: string; departmentId: string }>;
  semesters: Array<{ id: string; name: string; courseId: string }>;
  subjects: Array<{ id: string; subjectName: string; semesterId: string }>;
  faculty: Array<{ id: string; firstName: string; lastName: string }>;
  classrooms: Array<{ id: string; roomNumber: string; roomName: string; building: string }>;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEditTimetableModal({
  slotToEdit,
  departments,
  courses,
  semesters,
  subjects,
  faculty,
  classrooms,
  onClose,
  onSuccess,
}: Props) {
  const [departmentId, setDepartmentId] = useState(slotToEdit?.departmentId || '');
  const [courseId, setCourseId] = useState(slotToEdit?.courseId || '');
  const [semesterId, setSemesterId] = useState(slotToEdit?.semesterId || '');
  const [subjectId, setSubjectId] = useState(slotToEdit?.subjectId || '');
  const [facultyId, setFacultyId] = useState(slotToEdit?.facultyId || '');
  const [classroomId, setClassroomId] = useState(slotToEdit?.classroomId || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(slotToEdit?.dayOfWeek || 'MONDAY');
  const [startTime, setStartTime] = useState(slotToEdit?.startTime || '09:00');
  const [endTime, setEndTime] = useState(slotToEdit?.endTime || '10:00');
  const [conflictError, setConflictError] = useState<string | null>(null);

  const createMutation = useCreateTimetable();
  const updateMutation = useUpdateTimetable();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const payload = {
      departmentId,
      courseId,
      semesterId,
      subjectId,
      facultyId,
      classroomId,
      dayOfWeek,
      startTime,
      endTime,
    };

    if (slotToEdit) {
      updateMutation.mutate(
        { id: slotToEdit.id, data: payload },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: (err: unknown) => {
            setConflictError(
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to update timetable slot.'
            );
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (err: unknown) => {
          setConflictError(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Failed to schedule timetable slot.'
          );
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            {slotToEdit ? 'Edit Scheduled Class Slot' : 'Schedule New Class Slot'}
          </h3>
          <button onClick={onClose} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
            Cancel
          </button>
        </div>

        {conflictError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{conflictError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
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
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
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
                onChange={(e) => setSemesterId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
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
                {subjects.map((sb) => (
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
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Classroom *</label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Classroom</option>
                {classrooms.map((cr) => (
                  <option key={cr.id} value={cr.id}>
                    Room {cr.roomNumber} ({cr.roomName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Day of Week *</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="MONDAY">MONDAY</option>
                <option value="TUESDAY">TUESDAY</option>
                <option value="WEDNESDAY">WEDNESDAY</option>
                <option value="THURSDAY">THURSDAY</option>
                <option value="FRIDAY">FRIDAY</option>
                <option value="SATURDAY">SATURDAY</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Start Time *</label>
                <input
                  type="text"
                  placeholder="09:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">End Time *</label>
                <input
                  type="text"
                  placeholder="10:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {slotToEdit ? 'Save Changes' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
