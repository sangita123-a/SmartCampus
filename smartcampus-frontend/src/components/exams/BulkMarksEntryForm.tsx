'use client';

import { useState } from 'react';
import { ExamRecord, ResultStatus } from '@/types/exam';
import { useBulkSaveMarks } from '@/hooks/useExams';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AlertCircle, Loader2, Save } from 'lucide-react';

interface Props {
  exam: ExamRecord;
  onSuccess: () => void;
}

interface StudentItem {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
}

export function BulkMarksEntryForm({ exam, onSuccess }: Props) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    exam.examSubjects?.[0]?.subjectId || ''
  );
  const [marksState, setMarksState] = useState<
    Record<string, { obtainedMarks: number; resultStatus: ResultStatus; remarks: string }>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bulkSaveMutation = useBulkSaveMarks();

  const selectedExamSubject = exam.examSubjects?.find((es) => es.subjectId === selectedSubjectId);
  const maxMarks = Number(selectedExamSubject?.maxMarks || 100);
  const passingMarks = Number(selectedExamSubject?.passingMarks || 40);

  const { data: students = [], isLoading: isStudentsLoading } = useQuery<StudentItem[]>({
    queryKey: ['students', exam.departmentId, exam.courseId, exam.semesterId],
    queryFn: async () => {
      const res = await api.get('/students', {
        params: {
          departmentId: exam.departmentId,
          courseId: exam.courseId,
          semesterId: exam.semesterId,
          limit: 100,
        },
      });
      return res.data.data;
    },
    enabled: Boolean(selectedSubjectId),
  });

  const calculateGradePreview = (obtained: number, status: ResultStatus) => {
    if (status === 'ABSENT' || status === 'FAIL' || obtained < passingMarks) {
      return { grade: 'F', point: 0 };
    }
    const pct = (obtained / maxMarks) * 100;
    if (pct >= 90) return { grade: 'O', point: 10 };
    if (pct >= 80) return { grade: 'A+', point: 9 };
    if (pct >= 70) return { grade: 'A', point: 8 };
    if (pct >= 60) return { grade: 'B+', point: 7 };
    if (pct >= 50) return { grade: 'B', point: 6 };
    if (pct >= 40) return { grade: 'C', point: 5 };
    return { grade: 'F', point: 0 };
  };

  const handleMarkChange = (studentId: string, val: number) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        obtainedMarks: val,
        resultStatus: prev[studentId]?.resultStatus || (val >= passingMarks ? 'PASS' : 'FAIL'),
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleStatusChange = (studentId: string, status: ResultStatus) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        obtainedMarks: prev[studentId]?.obtainedMarks || 0,
        resultStatus: status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSubjectId) {
      setErrorMessage('Please select a subject to enter marks.');
      return;
    }

    const payloadMarks = students.map((st) => {
      const entry = marksState[st.id] || { obtainedMarks: 0, resultStatus: 'PASS', remarks: '' };
      return {
        studentId: st.id,
        obtainedMarks: entry.obtainedMarks,
        resultStatus: entry.resultStatus,
        remarks: entry.remarks,
      };
    });

    for (const pm of payloadMarks) {
      if (pm.obtainedMarks > maxMarks) {
        setErrorMessage(`Obtained marks cannot exceed Max Marks (${maxMarks}).`);
        return;
      }
    }

    bulkSaveMutation.mutate(
      {
        examId: exam.id,
        subjectId: selectedSubjectId,
        marks: payloadMarks,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (err: unknown) => {
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Failed to save marks.'
          );
        },
      }
    );
  };

  return (
    <div className="space-y-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Bulk Marks Entry - {exam.examName}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {exam.course?.name} ({exam.semester?.name}) • Academic Year: {exam.academicYear}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[var(--muted)]">Select Subject:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {exam.examSubjects?.map((es) => (
              <option key={es.subjectId} value={es.subjectId}>
                {es.subject?.subjectCode} - {es.subject?.subjectName} (Max: {es.maxMarks})
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Max Marks</th>
                <th className="px-4 py-3">Obtained Marks</th>
                <th className="px-4 py-3">Grade Preview</th>
                <th className="px-4 py-3">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {isStudentsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[var(--muted)]">
                    No enrolled students found for this class roster.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const currentEntry = marksState[st.id] || { obtainedMarks: 0, resultStatus: 'PASS', remarks: '' };
                  const preview = calculateGradePreview(currentEntry.obtainedMarks, currentEntry.resultStatus);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-mono text-xs font-bold">{st.rollNumber}</td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-semibold text-[var(--muted)]">{maxMarks}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={currentEntry.obtainedMarks}
                          onChange={(e) => handleMarkChange(st.id, parseFloat(e.target.value) || 0)}
                          className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-extrabold text-teal-700 dark:text-teal-400">
                          {preview.grade} ({preview.point} GP)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={currentEntry.resultStatus}
                          onChange={(e) => handleStatusChange(st.id, e.target.value as ResultStatus)}
                          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="PASS">PASS</option>
                          <option value="FAIL">FAIL</option>
                          <option value="ABSENT">ABSENT</option>
                          <option value="WITHHELD">WITHHELD</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={bulkSaveMutation.isPending || students.length === 0}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 shadow-sm"
          >
            {bulkSaveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save & Compute Results
          </button>
        </div>
      </form>
    </div>
  );
}
