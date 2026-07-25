'use client';

import { useState } from 'react';
import { ExamRecord, ExamStatus, ExamType } from '@/types/exam';
import { useAddExamSubject, useCreateExam, useRemoveExamSubject, useUpdateExam } from '@/hooks/useExams';
import { Plus, Trash2, Loader2, Calendar, Clock } from 'lucide-react';

interface SelectItem {
  id: string;
  name: string;
}

interface SubjectItem {
  id: string;
  subjectCode: string;
  subjectName: string;
}

interface FacultyItem {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  examToEdit?: ExamRecord | null;
  departments: SelectItem[];
  courses: SelectItem[];
  semesters: SelectItem[];
  subjects: SubjectItem[];
  faculty: FacultyItem[];
  onClose: () => void;
}

export function AddEditExamModal({
  examToEdit,
  departments,
  courses,
  semesters,
  subjects,
  faculty,
  onClose,
}: Props) {
  const [departmentId, setDepartmentId] = useState(examToEdit?.departmentId || departments[0]?.id || '');
  const [courseId, setCourseId] = useState(examToEdit?.courseId || courses[0]?.id || '');
  const [semesterId, setSemesterId] = useState(examToEdit?.semesterId || semesters[0]?.id || '');
  const [examName, setExamName] = useState(examToEdit?.examName || '');
  const [examType, setExamType] = useState<ExamType>(examToEdit?.examType || 'SEMESTER_END');
  const [academicYear, setAcademicYear] = useState(examToEdit?.academicYear || '2025-2026');
  const [startDate, setStartDate] = useState(
    examToEdit?.startDate ? new Date(examToEdit.startDate).toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    examToEdit?.endDate ? new Date(examToEdit.endDate).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState<ExamStatus>(examToEdit?.status || 'SCHEDULED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Exam Subject Schedule state
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [facultyId, setFacultyId] = useState(faculty[0]?.id || '');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [passingMarks, setPassingMarks] = useState<number>(40);
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('12:30');

  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();
  const addSubjectMutation = useAddExamSubject();
  const removeSubjectMutation = useRemoveExamSubject();

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      departmentId,
      courseId,
      semesterId,
      examName,
      examType,
      academicYear,
      startDate,
      endDate,
      status,
    };

    if (examToEdit) {
      updateMutation.mutate(
        { id: examToEdit.id, data: payload },
        {
          onSuccess: () => onClose(),
          onError: (err: unknown) =>
            setErrorMessage(
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update exam.'
            ),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err: unknown) =>
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create exam.'
          ),
      });
    }
  };

  const handleAddSubject = () => {
    if (!examToEdit) return;
    setErrorMessage(null);

    addSubjectMutation.mutate(
      {
        examId: examToEdit.id,
        subjectId,
        facultyId: facultyId || undefined,
        maxMarks,
        passingMarks,
        examDate,
        startTime,
        endTime,
      },
      {
        onError: (err: unknown) =>
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to schedule subject.'
          ),
      }
    );
  };

  const handleRemoveSubject = (id: string) => {
    removeSubjectMutation.mutate(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
          {examToEdit ? 'Manage Exam Schedule & Subjects' : 'Create New Exam Schedule'}
        </h3>

        {errorMessage && (
          <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSaveExam} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Exam Name *</label>
            <input
              type="text"
              placeholder="e.g. End Semester Theory Examination 2026"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Exam Type *</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="SEMESTER_END">SEMESTER_END</option>
                <option value="MID_SEMESTER">MID_SEMESTER</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="PRACTICAL">PRACTICAL</option>
                <option value="LAB">LAB</option>
                <option value="ASSIGNMENT">ASSIGNMENT</option>
                <option value="SUPPLEMENTARY">SUPPLEMENTARY</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Academic Year *</label>
              <input
                type="text"
                placeholder="2025-2026"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
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
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExamStatus)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* If Editing existing exam, display Exam Subject Scheduler */}
          {examToEdit && (
            <div className="mt-6 border-t border-[var(--border)] pt-4 space-y-4">
              <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-teal-600" /> Scheduled Exam Subjects
              </h4>

              <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)] font-semibold text-[var(--muted)]">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Evaluator</th>
                      <th className="p-2.5 text-center">Max / Pass</th>
                      <th className="p-2.5">Exam Date & Time</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {examToEdit.examSubjects?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-xs text-[var(--muted)]">
                          No subjects scheduled yet. Use form below to add.
                        </td>
                      </tr>
                    ) : (
                      examToEdit.examSubjects?.map((es) => (
                        <tr key={es.id}>
                          <td className="p-2.5 font-bold">{es.subject?.subjectCode} - {es.subject?.subjectName}</td>
                          <td className="p-2.5 text-[var(--muted)]">{es.faculty ? `${es.faculty.firstName} ${es.faculty.lastName}` : '-'}</td>
                          <td className="p-2.5 text-center font-mono font-semibold">{es.maxMarks} / {es.passingMarks}</td>
                          <td className="p-2.5 font-mono text-[var(--muted)]">
                            {new Date(es.examDate).toLocaleDateString()} ({es.startTime} - {es.endTime})
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(es.id)}
                              className="rounded p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Subject Row */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                <span className="text-xs font-bold text-[var(--foreground)]">Schedule Additional Subject:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block mb-1 font-medium">Subject</label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.subjectCode} - {s.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Evaluator</label>
                    <select
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5"
                    >
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.firstName} {f.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Max / Passing</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={maxMarks}
                        onChange={(e) => setMaxMarks(parseFloat(e.target.value) || 0)}
                        className="w-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5 font-mono"
                      />
                      <input
                        type="number"
                        value={passingMarks}
                        onChange={(e) => setPassingMarks(parseFloat(e.target.value) || 0)}
                        className="w-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Date & Time</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-[var(--muted)]" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="rounded border border-[var(--border)] p-1 font-mono"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="rounded border border-[var(--border)] p-1 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    disabled={addSubjectMutation.isPending}
                    className="flex items-center gap-1 rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Subject Slot
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Exam Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
