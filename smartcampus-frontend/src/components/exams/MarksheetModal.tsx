'use client';

import { StudentMarksheetData } from '@/types/exam';
import { Printer, X, Award } from 'lucide-react';

interface Props {
  marksheet: StudentMarksheetData;
  onClose: () => void;
}

export function MarksheetModal({ marksheet, onClose }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const student = marksheet.student;
  const exam = marksheet.exam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Official Student Marksheet
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-xs"
            >
              <Printer className="h-4 w-4" /> Print Marksheet
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Content */}
        <div className="mt-6 space-y-6 p-6 border border-slate-200 rounded-xl bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-teal-800 dark:text-teal-400 font-[family-name:var(--font-display)]">
                SMARTCAMPUS ERP
              </h1>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Official Statement of Marks & Performance
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{exam.examName}</span>
              <p className="text-[11px] text-slate-500">Academic Session: {exam.academicYear}</p>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-500">Student Name:</span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {student?.firstName} {student?.lastName}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Roll Number:</span>
              <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">{student?.rollNumber}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Department:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{student?.department?.name || '-'}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Course / Semester:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {student?.course?.name || '-'} ({student?.semester?.name || '-'})
              </p>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Subject Name</th>
                  <th className="p-2.5 text-center">Credits</th>
                  <th className="p-2.5 text-right">Max</th>
                  <th className="p-2.5 text-right">Obtained</th>
                  <th className="p-2.5 text-center">Grade</th>
                  <th className="p-2.5 text-center">GP</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {marksheet.subjectBreakdown.map((sb, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="p-2.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{sb.subjectCode}</td>
                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">{sb.subjectName}</td>
                    <td className="p-2.5 text-center font-mono font-semibold">{sb.credits}</td>
                    <td className="p-2.5 text-right font-mono">{sb.maxMarks}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-teal-700 dark:text-teal-400">{sb.obtainedMarks}</td>
                    <td className="p-2.5 text-center font-mono font-extrabold">{sb.grade}</td>
                    <td className="p-2.5 text-center font-mono font-bold">{sb.gradePoint}</td>
                    <td className="p-2.5 text-center font-bold">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] ${
                          sb.resultStatus === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {sb.resultStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Summary Footer Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs dark:border-teal-900 dark:bg-teal-950/20">
            <div>
              <span className="font-semibold text-slate-500">Total Score:</span>
              <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                {marksheet.summary.totalObtainedMarks} / {marksheet.summary.totalMaxMarks} ({marksheet.summary.percentage}%)
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Semester GPA:</span>
              <p className="font-mono font-extrabold text-base text-teal-700 dark:text-teal-400">
                {marksheet.summary.gpa.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Cumulative CGPA:</span>
              <p className="font-mono font-extrabold text-base text-blue-700 dark:text-blue-400">
                {marksheet.summary.cgpa.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Overall Result:</span>
              <p className="mt-0.5">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-black tracking-wider ${
                    marksheet.summary.overallStatus === 'PASS'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {marksheet.summary.overallStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="pt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-900">
            This transcript is computer generated. Official Controller of Examinations Signature Verified.
          </div>
        </div>

        <div className="mt-4 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
