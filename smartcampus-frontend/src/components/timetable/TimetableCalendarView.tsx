'use client';

import { DayOfWeek, TimetableSlot } from '@/types/timetable';
import { Printer, Calendar, Clock, MapPin, User } from 'lucide-react';

interface Props {
  weeklyGrid?: Record<DayOfWeek, TimetableSlot[]>;
  onSlotClick?: (slot: TimetableSlot) => void;
  isLoading?: boolean;
}

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function TimetableCalendarView({ weeklyGrid, onSlotClick, isLoading }: Props) {
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm print:border-none print:p-0 print:shadow-none">
      {/* Calendar Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-600" />
          <h2 className="text-base font-semibold text-[var(--foreground)]">Weekly Class Schedule Grid</h2>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Printer className="h-4 w-4 text-indigo-600" /> Print Schedule
        </button>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] border border-[var(--border)] rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--background)] text-center text-xs font-bold text-[var(--foreground)]">
            <div className="p-3 border-r border-[var(--border)] text-[var(--muted)]">Time</div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 border-r border-[var(--border)] last:border-r-0 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {TIME_SLOTS.map((time) => (
              <div key={time} className="grid grid-cols-7 min-h-[90px]">
                {/* Time Label Column */}
                <div className="flex items-center justify-center border-r border-[var(--border)] bg-[var(--background)] font-mono text-xs text-[var(--muted)]">
                  {time}
                </div>

                {/* Day Columns for this time slot */}
                {DAYS.map((day) => {
                  const daySlots = weeklyGrid?.[day] || [];
                  const matchingSlots = daySlots.filter((slot) => {
                    const slotStartHour = slot.startTime.split(':')[0];
                    const rowHour = time.split(':')[0];
                    return slotStartHour === rowHour;
                  });

                  return (
                    <div
                      key={`${day}-${time}`}
                      className="p-1.5 border-r border-[var(--border)] last:border-r-0 transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      {matchingSlots.map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => onSlotClick && onSlotClick(slot)}
                          className="h-full w-full cursor-pointer rounded-lg border border-teal-200 bg-teal-50/80 p-2 text-xs shadow-xs transition hover:scale-[1.02] hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/60 dark:hover:bg-teal-900/60"
                        >
                          <p className="font-bold text-teal-950 dark:text-teal-100 line-clamp-1">
                            {slot.subject?.subjectName}
                          </p>
                          <div className="mt-1 space-y-0.5 text-[11px] text-teal-800 dark:text-teal-300">
                            <p className="flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3 shrink-0" /> {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" /> Rm {slot.classroom?.roomNumber}
                            </p>
                            <p className="flex items-center gap-1 truncate">
                              <User className="h-3 w-3 shrink-0" /> {slot.faculty?.firstName} {slot.faculty?.lastName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
