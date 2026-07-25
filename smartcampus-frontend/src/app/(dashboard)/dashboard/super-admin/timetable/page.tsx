'use client';

import { useTimetableDashboard, useWeeklyTimetable } from '@/hooks/useTimetable';
import { TimetableDashboardCards } from '@/components/timetable/TimetableDashboardCards';
import { TimetableCalendarView } from '@/components/timetable/TimetableCalendarView';

export default function SuperAdminTimetablePage() {
  const { data: cards, isLoading: isCardsLoading } = useTimetableDashboard();
  const { data: weeklyData, isLoading: isWeeklyLoading } = useWeeklyTimetable();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Super Admin - Master Timetable Overview
        </h1>
        <p className="text-xs text-[var(--muted)]">Global master class schedule and classroom utilization overview.</p>
      </div>

      <TimetableDashboardCards data={cards} isLoading={isCardsLoading} />

      <TimetableCalendarView weeklyGrid={weeklyData?.weeklyGrid} isLoading={isWeeklyLoading} />
    </div>
  );
}
