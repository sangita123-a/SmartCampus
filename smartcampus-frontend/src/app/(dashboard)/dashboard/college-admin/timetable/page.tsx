'use client';

import { useState } from 'react';
import { useTimetableDashboard, useTimetableList, useWeeklyTimetable, useDeleteTimetable } from '@/hooks/useTimetable';
import { TimetableDashboardCards } from '@/components/timetable/TimetableDashboardCards';
import { TimetableCalendarView } from '@/components/timetable/TimetableCalendarView';
import { TimetableListView } from '@/components/timetable/TimetableListView';
import { AddEditTimetableModal } from '@/components/timetable/AddEditTimetableModal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TimetableSlot } from '@/types/timetable';
import { LayoutGrid, List, Plus } from 'lucide-react';

export default function CollegeAdminTimetablePage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const { data: cards, isLoading: isCardsLoading } = useTimetableDashboard();
  const { data: weeklyData, isLoading: isWeeklyLoading } = useWeeklyTimetable();
  const { data: listData, isLoading: isListLoading } = useTimetableList({ page, limit: 20 });
  const deleteMutation = useDeleteTimetable();

  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: async () => (await api.get('/departments')).data.data });
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: async () => (await api.get('/courses')).data.data });
  const { data: semesters = [] } = useQuery({ queryKey: ['semesters'], queryFn: async () => (await api.get('/semesters')).data.data });
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: async () => (await api.get('/subjects')).data.data });
  const { data: faculty = [] } = useQuery({ queryKey: ['faculty'], queryFn: async () => (await api.get('/faculty')).data.data });
  const { data: classrooms = [] } = useQuery({ queryKey: ['classrooms'], queryFn: async () => (await api.get('/classrooms')).data.data });

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable slot?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Timetable Management
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Schedule master classes, resolve faculty and classroom time conflicts, and view weekly calendars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'text-[var(--muted)]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-teal-600 text-white' : 'text-[var(--muted)]'
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table List
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" /> Schedule Class
          </button>
        </div>
      </div>

      <TimetableDashboardCards data={cards} isLoading={isCardsLoading} />

      {viewMode === 'calendar' ? (
        <TimetableCalendarView weeklyGrid={weeklyData?.weeklyGrid} onSlotClick={handleOpenEdit} isLoading={isWeeklyLoading} />
      ) : (
        <TimetableListView
          slots={listData?.data || []}
          total={listData?.meta?.total || 0}
          page={page}
          limit={20}
          onPageChange={setPage}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isLoading={isListLoading}
        />
      )}

      {isModalOpen && (
        <AddEditTimetableModal
          slotToEdit={editingSlot}
          departments={departments}
          courses={courses}
          semesters={semesters}
          subjects={subjects}
          faculty={faculty}
          classrooms={classrooms}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
