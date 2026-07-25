'use client';

import { HallTicketData } from '@/types/exam';
import { Printer, X, CalendarCheck } from 'lucide-react';

interface Props {
  hallTicket: HallTicketData;
  onClose: () => void;
}

export function HallTicketModal({ hallTicket, onClose }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const student = hallTicket.student;
  const exam = hallTicket.exam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Examination Admit Card / Hall Ticket
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-xs"
            >
              <Printer className="h-4 w-4" /> Print Hall Ticket
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Hall Ticket Body */}
        <div className="mt-6 space-y-6 p-6 border border-slate-200 rounded-xl bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h1 className="text-xl font-extrabold text-teal-800 dark:text-teal-400 font-[family-name:var(--font-display)]">
                SMARTCAMPUS ERP
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">OFFICIAL EXAMINATION ADMIT CARD</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{exam.examName}</span>
              <p className="text-[11px] text-slate-500">Academic Year: {exam.academicYear}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-xs dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-500">Candidate Name:</span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Roll Number:</span>
              <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">{student.rollNumber}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Reg. Number:</span>
              <p className="font-mono font-bold text-slate-700 dark:text-slate-300">{student.registrationNumber || '-'}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Department / Course:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{student.department?.name} ({student.course?.name})</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Exam Timetable Schedule</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Subject Name</th>
                  <th className="p-2.5">Exam Date</th>
                  <th className="p-2.5">Timing</th>
                  <th className="p-2.5 text-right">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {hallTicket.schedule.map((sc, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">{sc.subjectCode}</td>
                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">{sc.subjectName}</td>
                    <td className="p-2.5 font-medium text-slate-700 dark:text-slate-300">
                      {new Date(sc.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">{sc.startTime} - {sc.endTime}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{sc.maxMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <div className="text-center border-t border-slate-400 pt-1 w-36">
              Candidate Signature
            </div>
            <div className="text-center border-t border-slate-400 pt-1 w-36 font-semibold text-slate-800 dark:text-slate-200">
              Controller of Examinations
            </div>
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
