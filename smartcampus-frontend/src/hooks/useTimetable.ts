import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timetableApi } from '@/services/timetable.service';
import { TimetableSlot } from '@/types/timetable';

export function useTimetableList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['timetable', params],
    queryFn: () => timetableApi.list(params),
  });
}

export function useTimetableDashboard() {
  return useQuery({
    queryKey: ['timetable', 'dashboard'],
    queryFn: () => timetableApi.getDashboardCards(),
  });
}

export function useWeeklyTimetable(params?: { semesterId?: string; facultyId?: string; classroomId?: string }) {
  return useQuery({
    queryKey: ['timetable', 'weekly', params],
    queryFn: () => timetableApi.getWeeklyView(params),
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TimetableSlot>) => timetableApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

export function useUpdateTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TimetableSlot> }) => timetableApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

export function useDeleteTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => timetableApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}
