'use client';

import { CalendarDays, Clock, MapPin, UserCheck, Calendar } from 'lucide-react';

interface TimetableSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject?: { subjectCode: string; subjectName: string };
  faculty?: { firstName: string; lastName: string };
  classroom?: { roomNumber: string; building: string };
}

interface ExamScheduleItem {
  id: string;
  examName: string;
  startDate: string;
  endDate: string;
  examSubjects?: {
    subject?: { subjectCode: string; subjectName: string };
    examDate: string;
    startTime: string;
    endTime: string;
  }[];
}

interface Props {
  timetable?: Record<string, unknown>[];
  upcomingExams?: Record<string, unknown>[];
  isLoading?: boolean;
}

export function ChildTimetableGrid({ timetable = [], upcomingExams = [], isLoading }: Props) {
  if (isLoading) {
    return <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  return (
    <div className="space-y-6">
      {/* Timetable Grid */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-teal-600" /> Weekly Class Schedule & Timetable Grid
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => {
            const slots = ((timetable || []) as unknown as TimetableSlot[]).filter((t) => t.dayOfWeek === day);

            return (
              <div key={day} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                <span className="text-xs font-black tracking-wider text-teal-700 dark:text-teal-400 uppercase border-b border-[var(--border)] pb-2 block">
                  {day}
                </span>

                {slots.length === 0 ? (
                  <p className="text-xs text-[var(--muted)] py-4 text-center">No scheduled lectures</p>
                ) : (
                  slots.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg bg-[var(--surface)] p-3 border border-[var(--border)] space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--foreground)]">{s.subject?.subjectName}</span>
                        <span className="font-mono text-[10px] text-teal-600 font-semibold">{s.subject?.subjectCode}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono">{s.startTime} - {s.endTime}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" /> {s.faculty ? `${s.faculty.firstName} ${s.faculty.lastName}` : '-'}
                        </span>
                        <span className="flex items-center gap-1 font-mono font-semibold">
                          <MapPin className="h-3 w-3" /> {s.classroom?.roomNumber || '-'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Exam Timetable */}
      {upcomingExams.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" /> Upcoming Examination Dates & Timings
          </h3>

          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Examination</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {((upcomingExams || []) as unknown as ExamScheduleItem[]).map((ex) =>
                  ex.examSubjects?.map((es, idx) => (
                    <tr key={`${ex.id}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{ex.examName}</td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium text-[var(--foreground)]">{es.subject?.subjectName}</p>
                        <span className="font-mono text-[11px] text-[var(--muted)]">{es.subject?.subjectCode}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {new Date(es.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-teal-600">
                        {es.startTime} - {es.endTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
