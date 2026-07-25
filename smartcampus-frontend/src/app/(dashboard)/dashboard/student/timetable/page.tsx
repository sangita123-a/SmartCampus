'use client';

import { useWeeklyTimetable } from '@/hooks/useTimetable';
import { TimetableCalendarView } from '@/components/timetable/TimetableCalendarView';

export default function StudentTimetablePage() {
  const { data, isLoading } = useWeeklyTimetable();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          My Class Schedule
        </h1>
        <p className="text-xs text-[var(--muted)]">View your weekly class timetable, subject slots, and assigned lecture halls.</p>
      </div>

      <TimetableCalendarView weeklyGrid={data?.weeklyGrid} isLoading={isLoading} />
    </div>
  );
}
